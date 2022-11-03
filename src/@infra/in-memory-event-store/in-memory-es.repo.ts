import { Injectable } from '@nestjs/common';
import { ISimpleRepo } from '../interfaces/SimpleRepo.interface';
import { ISimpleEventStore } from '../interfaces/SimpleEventStore.interface';
import { Event } from '../event';
import { ConstructorFor } from '../utils';
import { AggregateRoot } from '../aggregate';

@Injectable()
export class InMemoryEsRepo<GenericAggregate extends AggregateRoot> implements ISimpleRepo<GenericAggregate> {
    constructor(
        private readonly es: ISimpleEventStore,
        private aggregateConstructor: ConstructorFor<GenericAggregate>,
    ) {}

    public async commit(aggregate: GenericAggregate): Promise<void> {
        const uncommittedChanges = aggregate.getUncommittedChanges();
        await this.es.appendEvents(aggregate.id, uncommittedChanges);
        aggregate.markChangesAsCommitted();
    }

    public async getById(aggregateId: string, options?: { includeDeleted: boolean }): Promise<GenericAggregate | null> {
        const aggregate = new this.aggregateConstructor(aggregateId);

        const history = await this.es.retrieveEventsByAggregateId(aggregateId);
        if (history.length === 0) return null;

        aggregate.loadFromHistory(history);

        if (aggregate.deleted && !options.includeDeleted) return null;
        return aggregate;
    }
}

export class InMemoryEs implements ISimpleEventStore {
    private store: { [key: string]: Event<unknown>[] }[] = [];

    public async appendEvents(aggregateId: string, events: Event<unknown>[]): Promise<void> {
        if (!this.store[aggregateId]) {
            this.store[aggregateId] = [];
        }
        events.forEach((event) => this.store[aggregateId].push(event));
    }

    public async retrieveEventsByAggregateId(aggregateId: string): Promise<Event<unknown>[]> {
        return this.store[aggregateId] || [];
    }
}
