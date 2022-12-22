import { Module } from '@nestjs/common';
import { LocalEventBus } from '@infra/event-store/local-event-bus';
import { MongoProjector } from '@infra/projector/mongo-projector';

export const EventBusProviderToken = 'ServiceEventBus';
export const ProjectorProviderToken = 'Projector';

@Module({
    providers: [
        {
            provide: EventBusProviderToken,
            useFactory: () => new LocalEventBus(),
        },
        { provide: ProjectorProviderToken, useFactory: () => new MongoProjector() },
    ],
    exports: [EventBusProviderToken],
})
export class InfraModule {}
