import { EventStoreRepo, InMemoryEs, OUTBOX_PROVIDER_TOKEN } from '../';
import { ISimpleEventStore } from '../event-store/event-store.interface';
import { CartAggregate } from '../../cart/domain/Cart.aggregate';

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
            useFactory: async (outBox) => {
                return new InMemoryEs(outBox);
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
