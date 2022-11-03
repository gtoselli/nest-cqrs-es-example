import { ClassProvider } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { EventBusProviderToken } from './infra.module';
import { GleEventHandlerMetadataKey } from './decorators/EventHandler.decorator';

export class EventHandlersBootstrapper {
    constructor(private readonly nestModule: any, private readonly moduleRef: ModuleRef) {}

    public static factory(nestModule: any, moduleRef: ModuleRef) {
        return new EventHandlersBootstrapper(nestModule, moduleRef);
    }

    public registerAll() {
        const providers = this.getAllModuleProviders();

        const eventBus = this.moduleRef.get(EventBusProviderToken, { strict: false });

        const handlers = this.onlyEventHandlers(providers);

        for (const _handler of handlers) {
            const handler = this.moduleRef.get(_handler);
            handler.registerTo(eventBus);
        }
    }

    private getAllModuleProviders(): ClassProvider[] {
        const moduleProviders = Reflect.getMetadata('providers', this.nestModule);

        console.log(`${moduleProviders.length} providers found from module CartReadModelModule`); //TODO
        return moduleProviders;
    }

    private onlyEventHandlers(providers) {
        const _handlers = providers.filter((pClass) => Reflect.getMetadata(GleEventHandlerMetadataKey, pClass));

        console.log(`${_handlers.length} handlers providers found from module CartReadModelModule`); //TODO
        return _handlers;
    }
}
