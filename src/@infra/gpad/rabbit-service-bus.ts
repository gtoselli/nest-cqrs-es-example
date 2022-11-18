import { Event, PrivateEvent, PublicEvent } from '../event';
import { Rabbit, RabbitMessage } from '../gpad/rabbit';
import { ClassNotInstanceOf, elapsedFrom, EventHandlerFunc, IEventBus, wait } from '@infra';
import { Logger } from '@nestjs/common';
import { isEmpty, snakeCase } from 'lodash';
import { ConsumeMessage } from 'amqplib';
import { inspect } from 'util';

function partitionPublicEvents<T extends Event<unknown>>(
    events: T[],
): [PublicEvent<unknown>[], PrivateEvent<unknown>[]] {
    const isPublicDomainEvent = (e: Event<unknown>): boolean => {
        return e.isPublic;
    };

    const publicEvents: PublicEvent<unknown>[] = [];
    const domainEvents: PrivateEvent<unknown>[] = [];
    for (const event of events) {
        if (isPublicDomainEvent(event)) {
            publicEvents.push(event as PublicEvent<unknown>);
        } else {
            domainEvents.push(event as PrivateEvent<unknown>);
        }
    }

    return [publicEvents, domainEvents];
}

interface ReceivedMessage {
    causationId: string;
    correlationId: string;
    payload: unknown;
    messageId: string;
    aggregateId: string;
    aggregateVersion: number;
    aggregateVersionIndex: number;
}

const eventToMessage = (event: PublicEvent<unknown>): RabbitMessage => {
    return {
        aggregateVersion: 0, //TODO
        aggregateVersionIndex: 0, //TODO
        causationId: '', //TODO
        messageId: '', //TODO
        correlationId: '', //TODO
        eventName: event.eventName,
        payload: event.eventPayload,
        aggregateId: event.aggregateId, //TODO maybe should be in eventPayload
    };
};

export interface IPublicDomainEventBuilder<T extends PublicEvent<unknown>> {
    createFromMessage(msg: ReceivedMessage): T;

    getEventName(): string;
}

export class GenericPublicDomainEventBuilder<T extends PublicEvent<unknown>> implements IPublicDomainEventBuilder<T> {
    constructor(private readonly Event: ClassNotInstanceOf<PublicEvent<unknown>>) {}

    getEventName(): string {
        return this.Event.name;
    }

    createFromMessage(msg: ReceivedMessage): T {
        return new this.Event(msg.aggregateId, msg.payload) as T;
    }
}

export class RabbitServiceBus implements IEventBus {
    private handlers: { [key: string]: EventHandlerFunc<never> } = {};
    private pendingLocalEvents: PrivateEvent<unknown>[] = [];
    private executingLocalEvents = false;

    constructor(private readonly rabbit: Rabbit, private msName: string) {}

    private readonly logger = new Logger('RabbitServiceBus');

    async start(builders: IPublicDomainEventBuilder<PublicEvent<unknown>>[], temporary: boolean): Promise<void> {
        const eventNames = builders.map((b) => b.getEventName());
        const handlerNames = Object.keys(this.handlers);
        const everyBuildersHaveHandlers = eventNames.every((e) => handlerNames.find((h) => h === e));
        if (!everyBuildersHaveHandlers) {
            throw new Error(
                `Some builders doesn't have an handler, builders: ${eventNames}, handlers: ${handlerNames}`,
            );
        }
        await Promise.all(
            eventNames.map((eventName, index) => this.createConsumer(eventName, builders[index], temporary)),
        );
    }

    emit(event: Event<unknown>): Promise<void> {
        if (event.isPublic) {
            return this.rabbit.publish(eventToMessage(event as PublicEvent<unknown>));
        }

        this.pendingLocalEvents.push(event as PrivateEvent<unknown>);
        setImmediate(() => this.executePendingEvents());
        return Promise.resolve();
    }

    emits(events: Event<unknown>[]): Promise<void> {
        const [publicEvents, localEvents] = partitionPublicEvents(events);
        this.pendingLocalEvents.push(...localEvents);
        setImmediate(() => this.executePendingEvents());
        return this.rabbit.publishAll(publicEvents.map(eventToMessage));
    }

    register<T extends Event<unknown>>(eventName: string, handler: EventHandlerFunc<T>): void {
        if (this.alreadyRegister(eventName)) throw new Error(`${eventName} is already registered!`);
        this.handlers[eventName] = handler;
    }

    async waitPendingExecutions() {
        if (isEmpty(this.pendingLocalEvents)) return;
        while (!isEmpty(this.pendingLocalEvents)) {
            await wait(0);
        }
    }

    private createConsumer<T extends PublicEvent<unknown>>(
        eventName: string,
        builder: IPublicDomainEventBuilder<T>,
        temporary: boolean,
    ): Promise<void> {
        return this.rabbit.startConsumer(
            (msg) => {
                return this.handleMessage<T>(msg, this.handlers[eventName] as EventHandlerFunc<T>, builder);
            },
            {
                queueName: this.createQueueNameFrom(eventName, temporary),
                bindingKey: `event.*.${eventName}`,
                exchange: 'events',
                temporary,
            },
        );
    }

    private async handleMessage<T extends PublicEvent<unknown>>(
        msg: ConsumeMessage,
        handler: EventHandlerFunc<T>,
        builder: IPublicDomainEventBuilder<T>,
    ): Promise<void> {
        const start = Date.now();
        try {
            const rabbitMessage = JSON.parse(msg.content.toString()) as RabbitMessage;
            const receivedMessage: ReceivedMessage = rabbitMessage;
            // const event = createEventFrom<T>(msg)
            const event = builder.createFromMessage(receivedMessage);
            const ret = await handler(event);
            this.logger.log(`Executed event: ${inspect(event)} in ${elapsedFrom(start)} ms, ret: ${inspect(ret)}`);

            if (ret.ack) {
                this.rabbit.ack(msg);
                this.logger.log(`ACK event: ${inspect(event)}`);
            } else {
                this.rabbit.nack(msg, { requeue: false });
                this.logger.warn(`NACK event: ${inspect(event)}`);
            }
        } catch (error) {
            this.logger.error(`Unable to handle message ${inspect(msg)} error: ${inspect(error)}`);
            this.rabbit.nack(msg, { requeue: !msg.fields.redelivered });
        }
    }

    private createQueueNameFrom(eventName: string, temporary: boolean): string {
        return `${snakeCase(this.msName)}_${snakeCase(eventName)}${temporary ? '_tmp' : ''}`;
    }

    private alreadyRegister(commandName: string) {
        return !!this.handlers[commandName];
    }

    private async executePendingEvents(): Promise<void> {
        if (this.executingLocalEvents) {
            return;
        }
        this.executingLocalEvents = true;
        while (this.pendingLocalEvents.length) {
            const events = this.pendingLocalEvents.splice(0);
            await Promise.all(events.map((e) => this.dispatchLocalEvent(e)));
        }
        this.executingLocalEvents = false;
    }

    private async dispatchLocalEvent<T extends PrivateEvent<unknown>>(event: T) {
        let count = 0;
        const start = Date.now();
        const handler = this.handlers[event.eventName] as EventHandlerFunc<T>;
        while (count < 3) {
            try {
                const ret = await handler(event);
                this.logger.log(`Executed event: ${inspect(event)} in ${elapsedFrom(start)} ms, ret: ${inspect(ret)}`);

                if (ret.ack) {
                    this.logger.log(`ACK local event: ${inspect(event)}`);
                    return;
                }
                this.logger.warn(`NACK local event: ${inspect(event)}`);
            } catch (error) {
                this.logger.warn(`NACK local event: ${inspect(event)} - ${inspect(error)}`, error);
            }
            count += 1;
        }
    }
}
