import { EventStore } from '@infra/event-store/event-store';
import { eventsMap } from '../../cart/domain/events';
import { ISimpleEventStore } from '@infra/interfaces';
import { EventStoreRepo } from '@infra/event-store/event-store.repo';
import { CartAggregate } from '../../cart/domain/Cart.aggregate';

export class ProvidersHelper {
    constructor(public aggregateName: string) {}

    public static forAggregate(aggregateName: string) {
        return new ProvidersHelper(aggregateName).all();
    }

    private all() {
        return [
            {
                provide: this.repoProviderName(),
                useFactory: async (es: ISimpleEventStore) => {
                    return new EventStoreRepo(es, CartAggregate);
                },
                inject: [this.esProviderName()],
            },
            {
                provide: this.esProviderName(),
                useFactory: async () => {
                    const eventStore = new EventStore(eventsMap, this.aggregateName);
                    return eventStore;
                },
                inject: [],
            },
        ];
    }

    private esProviderName() {
        return this.aggregateName + 'Es';
    }

    private repoProviderName() {
        return this.aggregateName + 'Repo';
    }
}
