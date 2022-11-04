import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CartCreatedHandler, ItemAddedToCartHandler } from './handlers';
import { EventHandlersBootstrapper, InfraModule } from '@infra';
import { CartReadModelRepo } from './cart-read-model.repo';
import { CartReadModelController } from './api/cart-read-model.controller';

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
