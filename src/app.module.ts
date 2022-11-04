import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { InfraModule } from '@infra';
import { CartOverviewModule } from './cart-overview/cart-overview.module';

@Module({
    imports: [InfraModule, CartModule, CartOverviewModule],
})
export class AppModule {}
