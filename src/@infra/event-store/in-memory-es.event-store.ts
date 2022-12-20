import { ISimpleEventStore } from './event-store.interface';
import { Event } from '../event';
import { OutboxPattern } from '@infra/outbox-pattern/outbox-pattern';

export class InMemoryEs implements ISimpleEventStore {
    private store: { [key: string]: Event<unknown>[] }[] = [];

    constructor(private readonly outBox: OutboxPattern) {}

    public async appendEvents(aggregateId: string, events: Event<unknown>[]): Promise<void> {
        if (!this.store[aggregateId]) {
            this.store[aggregateId] = [];
        }
        events.forEach((event) => {
            this.store[aggregateId].push(event);
            this.outBox.add(event);
        });
    }

    public async retrieveEventsByAggregateId(aggregateId: string): Promise<Event<unknown>[]> {
        return this.store[aggregateId] || [];
    }
}
