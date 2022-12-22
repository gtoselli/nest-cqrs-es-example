import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Event, EventBusProviderToken, EventHandlersBootstrapper, InfraModule, ProjectorProviderToken } from '@infra';
import { eventHandlers } from './handlers';
import { CartOverviewRepo } from '../cart-overview.repo';
import { MongoProjector } from '@infra/projector/mongo-projector';
import { ILocalEventBus } from '@infra/event-store/local-event-bus';

@Module({
    imports: [InfraModule],
    providers: [CartOverviewRepo, ...eventHandlers],
})
export class CartOverviewProjectorModule implements OnModuleInit {
    public constructor(private readonly moduleRef: ModuleRef) {}

    async onModuleInit() {
        await EventHandlersBootstrapper.factory(CartOverviewProjectorModule, this.moduleRef).registerAll();

        const eventBus: ILocalEventBus = this.moduleRef.get(EventBusProviderToken, { strict: false });
        const projector: MongoProjector = this.moduleRef.get(ProjectorProviderToken, { strict: false });
        await projector.subscribeToAll('END', async (events: Event<unknown>[]) => {
            for (const e of events) {
                await eventBus.emitAsync(e);
            }
        });
    }
}
