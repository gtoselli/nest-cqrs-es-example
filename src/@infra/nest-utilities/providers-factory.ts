import { EventStoreRepo, OUTBOX_PROVIDER_TOKEN } from '../';
import { ISimpleEventStore } from '../event-store/event-store.interface';
import { CartAggregate } from '../../cart/domain/Cart.aggregate';
import { DdbEventStore } from '@infra/event-store/dynamodb/ddb-event-store';
import { eventsMap } from '../../cart/domain/events';

export class ProvidersFactory {
    constructor(public contextName: string) {}

    public static withContext(contextName: string) {
        return new ProvidersFactory(contextName);
    }

    public all() {
        return [this.repo(), this.eventStore()];
    }

    private eventStore() {
        return {
            provide: this.esProviderName(),
            useFactory: async () => {
                return new DdbEventStore(eventsMap);
            },
            inject: [OUTBOX_PROVIDER_TOKEN],
        };
    }

    private repo() {
        return {
            provide: this.repoProviderName(),
            useFactory: async (es: ISimpleEventStore) => {
                return new EventStoreRepo(es, CartAggregate);
            },
            inject: [this.esProviderName()],
        };
    }

    private esProviderName() {
        return this.contextName + 'Es';
    }

    private repoProviderName() {
        return this.contextName + 'Repo';
    }
}
