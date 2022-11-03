import { Module } from '@nestjs/common';
import { CartInfrastructure } from './domain/cart.infrastructure';
import { CartCommandHandlers } from './cart.command-handlers';

@Module({
    providers: [CartCommandHandlers, ...CartInfrastructure.factory().getProviders()],
})
export class CartModule {}
