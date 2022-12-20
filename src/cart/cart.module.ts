import { Module } from '@nestjs/common';
import { CartCommandHandlers } from './cart.command-handlers';
import { CartController } from './api/cart.controller';
import { InfraModule, ProvidersHelper } from '@infra';

@Module({
    imports: [InfraModule],
    providers: [...ProvidersHelper.forAggregate('Cart'), CartCommandHandlers],
    controllers: [CartController],
})
export class CartModule {}
