import { Module } from '@nestjs/common';
import { CartCommandHandlers } from './cart.command-handlers';
import { CartController } from './api/cart.controller';
import { InfraModule } from '../@infra/nest-utilities/infra.module';
import { ProvidersFactory } from '../@infra/nest-utilities/providers-factory';

@Module({
    imports: [InfraModule],
    providers: [...ProvidersFactory.withContext('Cart').all(), CartCommandHandlers],
    controllers: [CartController],
})
export class CartModule {}
