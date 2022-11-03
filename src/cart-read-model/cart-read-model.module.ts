import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CartCreatedHandler } from './handlers';
import { InfraModule } from '../@infra/nest-utilities/infra.module';
import { EventHandlersBootstrapper } from '../@infra/nest-utilities/event-handlers-bootstrapper';

@Module({
    imports: [InfraModule],
    providers: [CartCreatedHandler],
})
export class CartReadModelModule implements OnModuleInit {
    public constructor(private readonly moduleRef: ModuleRef) {}

    async onModuleInit() {
        EventHandlersBootstrapper.factory(CartReadModelModule, this.moduleRef).registerAll();
    }
}
