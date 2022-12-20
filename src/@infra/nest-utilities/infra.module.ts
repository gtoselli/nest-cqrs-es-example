import { Module } from '@nestjs/common';
import { InMemoryEventBus } from '../event-bus';
import { OutboxPattern } from '@infra/outbox-pattern/outbox-pattern';

export const EVENT_BUS_PROVIDER_TOKEN = 'ServiceEventBus';
export const OUTBOX_PROVIDER_TOKEN = 'Outbox';

@Module({
    providers: [
        {
            provide: EVENT_BUS_PROVIDER_TOKEN,
            useFactory: () => new InMemoryEventBus(),
        },
        {
            provide: OUTBOX_PROVIDER_TOKEN,
            useFactory: (eventBus) => new OutboxPattern(eventBus),
            inject: [EVENT_BUS_PROVIDER_TOKEN],
        },
    ],
    exports: [EVENT_BUS_PROVIDER_TOKEN, OUTBOX_PROVIDER_TOKEN],
})
export class InfraModule {}
