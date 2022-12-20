import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CartCreatedHandler, ItemAddedToCartHandler } from './handlers';
import { EventHandlersBootstrapper, InfraModule } from '@infra';
import { CartOverviewRepo } from './cart-overview.repo';
import { CartOverviewController } from './api/cart-overview.controller';

@Module({
    imports: [InfraModule],
    providers: [CartOverviewRepo, CartCreatedHandler, ItemAddedToCartHandler],
    controllers: [CartOverviewController],
})
export class CartOverviewModule implements OnModuleInit {
    public constructor(private readonly moduleRef: ModuleRef) {}

    async onModuleInit() {
        await EventHandlersBootstrapper.factory(CartOverviewModule, this.moduleRef).registerAll();
    }
}
