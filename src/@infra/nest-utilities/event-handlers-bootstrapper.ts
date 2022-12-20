import { ClassProvider } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { EVENT_BUS_PROVIDER_TOKEN } from './infra.module';
import { GleEventHandlerMetadataKey, GleEventNameMetadataKey } from './decorators/EventHandler.decorator';

export class EventHandlersBootstrapper {
    constructor(private readonly nestModule: any, private readonly moduleRef: ModuleRef) {}

    public static factory(nestModule: any, moduleRef: ModuleRef) {
        return new EventHandlersBootstrapper(nestModule, moduleRef);
    }

    public registerAll() {
        const eventBus = this.moduleRef.get(EVENT_BUS_PROVIDER_TOKEN, { strict: false });
        const handlers = this.onlyEventHandlers();

        for (const { handlerForEvent, classProvider } of handlers) {
            const handler = this.moduleRef.get(classProvider as any);
            eventBus.register(handlerForEvent, (e) => handler.handle(e));
        }
    }

    private getAllModuleProviders(): ClassProvider<any>[] {
        const moduleProviders = Reflect.getMetadata('providers', this.nestModule);

        console.log(`${moduleProviders.length} providers found from module CartReadModelModule`); //TODO
        return moduleProviders;
    }

    private onlyEventHandlers(): { classProvider: ClassProvider<any>; handlerForEvent: string }[] {
        const allModuleRegisteredProviders = this.getAllModuleProviders();

        const handlerProviders = allModuleRegisteredProviders.filter((pClass) =>
            Reflect.getMetadata(GleEventHandlerMetadataKey, pClass),
        );

        console.log(`${handlerProviders.length} handlers providers found from module CartReadModelModule`); //TODO

        return handlerProviders.map((handler) => ({
            classProvider: handler,
            handlerForEvent: Reflect.getMetadata(GleEventNameMetadataKey, handler),
        }));
    }
}
