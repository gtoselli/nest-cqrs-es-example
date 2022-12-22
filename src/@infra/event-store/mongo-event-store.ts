import { ISimpleEventStore } from '@infra';
import { Event } from '../event';
import { Logger, OnModuleInit } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';

export class MongoEventStore implements ISimpleEventStore, OnModuleInit {
    private readonly client: MongoClient;

    private logger = new Logger(MongoEventStore.name);

    async onModuleInit() {
        await this.client.connect();
    }

    constructor(private readonly domainEvents: Map<string, Event<unknown>>, private readonly aggregateName: string) {
        this.client = new MongoClient('mongodb://root:example@localhost:27017');
    }

    public async retrieveEventsByAggregateId(aggregate_id: string): Promise<Event<unknown>[]> {
        const eventsDocs = await this.client
            .db('es')
            .collection('event-store')
            .find({ aggregate_id: aggregate_id })
            .sort({ _id: 1 })
            .toArray();

        this.logger.debug(`Aggregate ${aggregate_id} rehydrated from ${eventsDocs.length} events`);

        return this.mongoDocsToDomainEvents(eventsDocs);
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

    private mongoDocsToDomainEvents(docs: any[]) {
        return docs.map((e) => {
            // TODO: bad solution
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const event = new (this.domainEvents.get(e.event_name!)!)(e.aggregate_id, e.payload);
            event.setEventId(e.event_id);
            event.setAggregateVersion(e.aggregate_version);
            return event;
        });
    }
}
