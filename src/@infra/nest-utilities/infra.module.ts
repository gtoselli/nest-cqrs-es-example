import { Module } from '@nestjs/common';
import { LocalEventBus } from '@infra/event-store/local-event-bus';

export const EventBusProviderToken = 'ServiceEventBus';

@Module({
    providers: [{ provide: EventBusProviderToken, useFactory: () => new LocalEventBus() }],
    exports: [EventBusProviderToken],
})
export class InfraModule {}
