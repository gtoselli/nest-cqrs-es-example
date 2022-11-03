import { Event } from '../event';

export interface ISimpleEventStore {
    appendEvents: (aggregateId: string, events: Event<unknown>[]) => Promise<void>;
    retrieveEventsByAggregateId: (aggregateId: string) => Promise<Event<unknown>[]>;
}
