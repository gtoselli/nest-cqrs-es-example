import { Injectable } from '@nestjs/common';
import { ISimpleRepo } from '../interfaces/SimpleRepo.interface';
import { ISimpleEventStore } from '../interfaces/SimpleEventStore.interface';
import { ConstructorFor } from '../utils';
import { AggregateRoot } from '../aggregate';

@Injectable()
export class EventStoreRepo<GenericAggregate extends AggregateRoot> implements ISimpleRepo<GenericAggregate> {
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
