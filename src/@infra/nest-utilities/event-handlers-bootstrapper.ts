import { ClassProvider, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { EventBusProviderToken } from './infra.module';
import { GleEventHandlerMetadataKey, GleEventNameMetadataKey } from './decorators/EventHandler.decorator';
import { ILocalEventBus } from '@infra/event-store/local-event-bus';

export class EventHandlersBootstrapper {
    constructor(private readonly nestModule: any, private readonly moduleRef: ModuleRef) {}

    private logger = new Logger(EventHandlersBootstrapper.name);

    public static factory(nestModule: any, moduleRef: ModuleRef) {
        return new EventHandlersBootstrapper(nestModule, moduleRef);
    }

    public async registerAll() {
        const eventBus: ILocalEventBus = this.moduleRef.get(EventBusProviderToken, { strict: false });
        const handlers = this.onlyEventHandlers();

        for (const { handlerForEvent, classProvider } of handlers) {
            const handler = this.moduleRef.get(classProvider as any);
            eventBus.register(handlerForEvent, (e) => handler.handle(e));
        }
    }

    private getAllModuleProviders(): ClassProvider<unknown>[] {
        return Reflect.getMetadata('providers', this.nestModule);
    }

    private onlyEventHandlers(): { classProvider: ClassProvider<any>; handlerForEvent: string }[] {
        const allModuleRegisteredProviders = this.getAllModuleProviders();

        const handlerProviders = allModuleRegisteredProviders.filter((pClass) =>
            Reflect.getMetadata(GleEventHandlerMetadataKey, pClass),
        );

        this.logger.debug(`${handlerProviders.length} event handlers providers found`); //TODO add module name

        return handlerProviders.map((handler) => ({
            classProvider: handler,
            handlerForEvent: Reflect.getMetadata(GleEventNameMetadataKey, handler),
        }));
    }
}
