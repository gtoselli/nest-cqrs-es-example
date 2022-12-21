import { ISimpleEventStore } from '@infra';
import { Event } from '../event';
import { EventStoreDBClient, FORWARDS, jsonEvent, ResolvedEvent, START } from '@eventstore/db-client';
import { Logger } from '@nestjs/common';
import * as process from 'process';

// https://github.com/GoogleChromeLabs/jsbi/issues/30
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export class EventStore implements ISimpleEventStore {
    private readonly client: EventStoreDBClient;

    private logger = new Logger(EventStore.name);

    constructor(private readonly domainEvents: Map<string, Event<unknown>>, private readonly aggregateName: string) {
        this.client = new EventStoreDBClient(
            {
                endpoint: process.env.ESDB_ENDPOINT,
            },
            { insecure: true },
        );
    }

    public async retrieveEventsByAggregateId(aggregate_id: string): Promise<Event<unknown>[]> {
        const streamName = this.aggregateIdToStreamName(aggregate_id);
        let jsonEvents: ResolvedEvent[] = [];

        const eventsStream = this.client.readStream(streamName, {
            direction: FORWARDS,
            fromRevision: START,
        });
        for await (const resolvedEvent of eventsStream) {
            jsonEvents = [...jsonEvents, resolvedEvent];
        }
        this.logger.debug(`Aggregate ${aggregate_id} rehydrated from ${jsonEvents.length} events`);

        return jsonEvents.map((rawEvent) => {
            return this.rawEventToGoleeEvent(rawEvent);
        });
    }

    public async appendEvents(aggregate_id: string, events: Event<unknown>[]): Promise<void> {
        const streamName = this.aggregateIdToStreamName(aggregate_id);
        const jsonEvents = events.map((event) =>
            jsonEvent({
                data: JSON.parse(JSON.stringify(event)),
                type: event.eventName,
            }),
        );
        const appendResult = await this.client.appendToStream(streamName, jsonEvents);
        this.logger.debug(
            `Appended ${events.length} events to stream ${streamName}. Esdb response ${JSON.stringify(appendResult)}`,
        );
    }

    public async start$AllPersistentSub(onEvent: (e: Event<unknown>) => Promise<void>) {
        // const groupName = `${hostname()}`;
        // const persistentSubSettings: PersistentSubscriptionToAllSettings =
        //     persistentSubscriptionToAllSettingsFromDefaults({});
        //
        // try {
        //     await this.client.createPersistentSubscriptionToAll(groupName, persistentSubSettings, {
        //         filter: streamNameFilter({ prefixes: ['cart'] }),
        //     });
        // } catch (e) {
        //     if (e.code == 6) {
        //         {
        //             this.logger.debug(`$All persistence subscription with groupName ${groupName} already exists`);
        //             await this.client.deletePersistentSubscriptionToAll(groupName);
        //             return await this.start$AllPersistentSub(onEvent);
        //         }
        //     } else throw e;
        // }
        // const startSub = async () => {
        //     try {
        //         const subscription = this.client.subscribeToPersistentSubscriptionToAll(groupName);
        //         this.logger.debug(`${groupName} subscribed to $all stream`);
        //
        //         for await (const event of subscription) {
        //             this.logger.debug(`handling event ${event.event?.type} with retryCount ${event.retryCount}`);
        //             try {
        //                 await onEvent(this.rawEventToGoleeEvent(event));
        //                 await subscription.ack(event);
        //             } catch (e) {
        //                 await subscription.ack(event);
        //             }
        //         }
        //     } catch (error) {
        //         console.log(`Subscription was dropped. ${error}`);
        //     }
        // };
        //
        // startSub();
    }

    private rawEventToGoleeEvent(rawEvent: ResolvedEvent): Event<unknown> {
        // TODO: bad solution
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const event = new (this.domainEvents.get(rawEvent.event.type)!)(
                rawEvent.event.streamId,
                (rawEvent.event.data as any).eventPayload,
            );
            // event.setEventId(rawEvent.event.id); //TODO
            // event.setAggregateVersion(rawEvent.event.s); //TODO
            return event;
        } catch (e) {
            if (e.message.includes('this.domainEvents.get(...) is not a constructor')) {
                this.logger.error(`eventsMap not include ${rawEvent.event.type} event`);
            } else throw e;
        }
    }

    private aggregateIdToStreamName(aggregateId: string): string {
        return `${this.aggregateName.toLowerCase()}-${aggregateId}`;
    }
}
