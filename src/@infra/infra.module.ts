import { Module } from '@nestjs/common';
import { RabbitServiceBus } from './in-memory-event-bus/in-memory-event-bus';

@Module({
    providers: [{ provide: 'ServiceEventBus', useFactory: () => new RabbitServiceBus() }],
    exports: ['ServiceEventBus'],
})
export class InfraModule {}
