import { Module } from '@nestjs/common';
import { CartInfrastructure } from './domain/cart.infrastructure';
import { CartCommandHandlers } from './cart.command-handlers';
import { CartController } from './api/cart.controller';

@Module({
    providers: [CartCommandHandlers, ...CartInfrastructure.factory().getProviders()],
    controllers: [CartController],
})
export class CartModule {}
