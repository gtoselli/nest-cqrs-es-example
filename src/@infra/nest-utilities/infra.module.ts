import { Module } from '@nestjs/common';
import { InMemoryEventBus } from '../event-bus-implementations';

export const EventBusProviderToken = 'ServiceEventBus';

@Module({
    providers: [{ provide: EventBusProviderToken, useFactory: () => new InMemoryEventBus() }],
    exports: [EventBusProviderToken],
})
export class InfraModule {}
