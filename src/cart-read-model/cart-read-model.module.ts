import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CartCreatedHandler, ItemAddedToCartHandler } from './handlers';
import { InfraModule } from '../@infra/nest-utilities/infra.module';
import { EventHandlersBootstrapper } from '../@infra/nest-utilities/event-handlers-bootstrapper';
import { CartReadModelRepo } from './cart-read-model.repo';
import { CartReadModelController } from './cart-read-model.controller';

@Module({
    imports: [InfraModule],
    providers: [CartReadModelRepo, CartCreatedHandler, ItemAddedToCartHandler],
    controllers: [CartReadModelController],
})
export class CartReadModelModule implements OnModuleInit {
    public constructor(private readonly moduleRef: ModuleRef) {}

    async onModuleInit() {
        EventHandlersBootstrapper.factory(CartReadModelModule, this.moduleRef).registerAll();
    }
}
