import { ISimpleEventStore } from '@infra';
import { Event } from '../event';
import { Logger, OnModuleInit } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import { eventsMap } from '../../cart/domain/events';

export class MongoEventStore implements ISimpleEventStore, OnModuleInit {
    private readonly client: MongoClient;

    private logger = new Logger(MongoEventStore.name);

    async onModuleInit() {
        await this.client.connect();
    }

    constructor() {
        this.client = new MongoClient(
            'mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0&readPreference=primary&ssl=false',
        );
    }

    public async retrieveEventsByAggregateId(aggregate_id: string): Promise<Event<unknown>[]> {
        const eventsDocs = await this.client
            .db('es')
            .collection('event-store')
            .find({ aggregate_id: aggregate_id })
            .sort({ _id: 1 })
            .toArray();

        this.logger.debug(`Aggregate ${aggregate_id} rehydrated from ${eventsDocs.length} events`);

        return MongoEventStore.mongoDocsToDomainEvents(eventsDocs, eventsMap);
    }

    public async appendEvents(aggregate_id: string, events: Event<unknown>[]): Promise<void> {
        for (const event of events) {
            await this.client.db('es').collection('event-store').insertOne({
                _id: new ObjectId(),
                event_id: event.eventId,
                aggregate_id: event.aggregateId,
                event_name: event.eventName,
                payload: event.eventPayload,
                aggregate_version: event.aggregateVersion,
            });
        }
        this.logger.debug(`Appended ${events.length} events to stream ${aggregate_id}.`);
    }

    static mongoDocsToDomainEvents(docs: any[], eventsMap: Map<string, Event<unknown>>) {
        return docs.map((e) => {
            // TODO: bad solution
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const event = new (eventsMap.get(e.event_name!)!)(e.aggregate_id, e.payload);
            event.setEventId(e.event_id); //TODO
            event.setAggregateVersion(e.aggregate_version); //TODO
            return event;
        });
    }
}
