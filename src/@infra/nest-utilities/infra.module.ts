import { Module } from '@nestjs/common';
import { InMemoryEventBus } from '../event-bus-implementations';
import { RabbitNestProvider } from '../gpad/rabbit.nest-provider';

export const EventBusProviderToken = 'ServiceEventBus';

@Module({
    providers: [
        RabbitNestProvider,
        {
            provide: EventBusProviderToken,
            useFactory: () => new InMemoryEventBus(),
            inject: [],
        },
    ],
    exports: [EventBusProviderToken],
})
export class InfraModule {}
