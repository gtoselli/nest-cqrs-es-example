import { Module } from '@nestjs/common';
import { CartCommandHandlers } from './cart.command-handlers';
import { CartController } from './api/cart.controller';
import { InMemoryEs, InMemoryEsRepo } from '../@infra/in-memory-event-store/in-memory-es.repo';
import { IEventBus } from '../@infra/interfaces/EventBus.interface';
import { ISimpleEventStore } from '../@infra/interfaces/SimpleEventStore.interface';
import { CartAggregate } from './domain/Cart.aggregate';
import { InfraModule } from '../@infra/infra.module';

@Module({
    imports: [InfraModule],
    providers: [
        {
            provide: 'CartEs',
            useFactory: async (eventBus: IEventBus) => {
                return new InMemoryEs(eventBus);
            },
            inject: ['ServiceEventBus'],
        },
        {
            provide: 'CartRepo',
            useFactory: async (es: ISimpleEventStore) => {
                return new InMemoryEsRepo(es, CartAggregate);
            },
            inject: ['CartEs'],
        },
        CartCommandHandlers,
    ],
    controllers: [CartController],
})
export class CartModule {}
