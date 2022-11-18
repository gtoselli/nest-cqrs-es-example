import { Module } from '@nestjs/common';
import { InMemoryEventBus } from '../event-bus-implementations';
import { RabbitNestProvider } from '@infra/gpad/rabbit.nest-provider';
import { GenericPublicDomainEventBuilder, RabbitServiceBus } from '@infra/gpad/rabbit-service-bus';
import { CartCreatedEvent, ItemAddedToCartEvent } from '../../cart/domain/events';

export const EventBusProviderToken = 'ServiceEventBus';

@Module({
    providers: [
        RabbitNestProvider,
        {
            provide: EventBusProviderToken,
            useFactory: () => new InMemoryEventBus(),
            inject: [],
        },
        {
            provide: 'foo',
            useFactory: async (rabbitNestProvider: RabbitNestProvider) => {
                const rabbitServiceBus = new RabbitServiceBus(rabbitNestProvider.getInstance(), '');
                await rabbitServiceBus.start(
                    [
                        new GenericPublicDomainEventBuilder(CartCreatedEvent),
                        new GenericPublicDomainEventBuilder(ItemAddedToCartEvent),
                    ],
                    false,
                );
                return rabbitServiceBus;
            },
            inject: [RabbitNestProvider],
        },
    ],
    exports: [EventBusProviderToken],
})
export class InfraModule {}
