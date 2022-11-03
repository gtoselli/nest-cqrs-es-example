import { EventHandler, IEventBus } from '../../interfaces/EventBus.interface';
import { Event } from '../../event';
import { inspect } from 'util';
import { elapsedFrom } from '../../utils';

export class InMemoryEventBus implements IEventBus {
    private handlers: { [key: string]: EventHandler<never> } = {};
    private pendingLocalEvents: Event<unknown>[] = [];
    private executingLocalEvents = false;

    emit<T extends Event<unknown>>(event: T): Promise<void> {
        this.pendingLocalEvents.push(event);
        setImmediate(() => this.executePendingEvents());
        return Promise.resolve();
    }

    emits<T extends Event<unknown>>(events: T[]): Promise<void> {
        this.pendingLocalEvents.push(...events);
        setImmediate(() => this.executePendingEvents());
        return Promise.resolve();
    }

    register<T extends Event<unknown>>(eventName: string, handler: EventHandler<T>): void {
        if (this.alreadyRegister(eventName)) throw new Error(`${eventName} is already registered!`);
        this.handlers[eventName] = handler;
    }

    private alreadyRegister(eventName: string) {
        return !!this.handlers[eventName];
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

    private async dispatchLocalEvent<T extends Event<unknown>>(event: T) {
        let count = 0;
        const start = Date.now();
        const handler = this.handlers[event.eventName] as EventHandler<T>;
        while (count < 3) {
            try {
                const ret = await handler(event);
                console.log(`Executed event: ${inspect(event)} in ${elapsedFrom(start)} ms, ret: ${inspect(ret)}`);

                if (ret.ack) {
                    console.log(`ACK local event: ${inspect(event)}`);
                    return;
                }
                console.log(`NACK local event: ${inspect(event)}`);
            } catch (error) {
                console.warn(`NACK local event: ${inspect(event)} - ${inspect(error)}`, error);
            }
            count += 1;
        }
    }
}
