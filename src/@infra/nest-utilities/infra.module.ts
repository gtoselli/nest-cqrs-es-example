import { Module } from '@nestjs/common';
import { RabbitServiceBus } from '../event-bus-implementations';

export const EventBusProviderToken = 'ServiceEventBus';

@Module({
    providers: [{ provide: EventBusProviderToken, useFactory: () => new RabbitServiceBus() }],
    exports: [EventBusProviderToken],
})
export class InfraModule {}
