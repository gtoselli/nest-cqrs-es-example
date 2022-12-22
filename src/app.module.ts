import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { CartOverviewProjectorModule } from './cart-overview-read-model/projector/cart-overview-projector.module';
import { CartOverviewApiModule } from './cart-overview-read-model/api/cart-overview-api.module';

@Module({
    imports: [CartModule, CartOverviewProjectorModule, CartOverviewApiModule],
})
export class AppModule {}
