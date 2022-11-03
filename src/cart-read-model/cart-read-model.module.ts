import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CartCreatedHandler } from './handlers';

@Module({
    providers: [CartCreatedHandler],
})
export class CartReadModelModule implements OnModuleInit {
    public constructor(private readonly moduleRef: ModuleRef) {}

    async onModuleInit() {
        const moduleProviders = Reflect.getMetadata('providers', CartReadModelModule);
        console.log(`${moduleProviders.length} providers found from module CartReadModelModule`);

        const _handlers = moduleProviders.filter((pClass) => Reflect.getMetadata('isEventHandler', pClass));
        console.log(`${_handlers.length} handlers providers found from module CartReadModelModule`);

        const eventBus = this.moduleRef.get('ServiceEventBus', { strict: false });
        if (!eventBus) throw new Error('Event bus provider not found');

        for (const _handler of _handlers) {
            const handler = this.moduleRef.get(_handler);
            handler.registerTo(eventBus);
        }
    }
}
