import { Module } from '@nestjs/common';
import { CartCommandHandlers } from './cart.command-handlers';
import { CartController } from './api/cart.controller';
import { InfraModule, ProvidersFactory } from '@infra';

@Module({
    imports: [InfraModule],
    providers: [...ProvidersFactory.withContext('Cart').all(), CartCommandHandlers],
    controllers: [CartController],
})
export class CartModule {}
