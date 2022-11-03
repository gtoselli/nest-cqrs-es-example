import { ISimpleEventStore } from '../../interfaces/SimpleEventStore.interface';
import { Event } from '../../event';
import { IEventBus } from '../../interfaces/EventBus.interface';

export class InMemoryEs implements ISimpleEventStore {
    private store: { [key: string]: Event<unknown>[] }[] = [];

    constructor(private readonly eventBus: IEventBus) {}

    public async appendEvents(aggregateId: string, events: Event<unknown>[]): Promise<void> {
        if (!this.store[aggregateId]) {
            this.store[aggregateId] = [];
        }
        events.forEach((event) => {
            this.store[aggregateId].push(event);
            this.eventBus.emit(event);
        });
    }

    public async retrieveEventsByAggregateId(aggregateId: string): Promise<Event<unknown>[]> {
        return this.store[aggregateId] || [];
    }
}
