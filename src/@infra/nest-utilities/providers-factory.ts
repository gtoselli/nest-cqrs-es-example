import { IEventBus } from '../interfaces/EventBus.interface';
import { EventStoreRepo, InMemoryEs } from '../event-store-implementations';
import { ISimpleEventStore } from '../interfaces/SimpleEventStore.interface';
import { CartAggregate } from '../../cart/domain/Cart.aggregate';
import { EventBusProviderToken } from './infra.module';

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
            useFactory: async (eventBus: IEventBus) => {
                return new InMemoryEs(eventBus);
            },
            inject: [EventBusProviderToken],
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
