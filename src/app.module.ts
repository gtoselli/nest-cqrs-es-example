import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { InfraModule } from './@infra/infra.module';
import { CartReadModelModule } from './cart-read-model/cart-read-model.module';

@Module({
    imports: [InfraModule, CartModule, CartReadModelModule],
})
export class AppModule {}
