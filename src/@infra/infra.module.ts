import { Module } from '@nestjs/common';
import { RabbitServiceBus } from './in-memory-event-bus/in-memory-event-bus';

export const EventBusProviderToken = 'ServiceEventBus';

@Module({
    providers: [{ provide: EventBusProviderToken, useFactory: () => new RabbitServiceBus() }],
    exports: [EventBusProviderToken],
})
export class InfraModule {}
