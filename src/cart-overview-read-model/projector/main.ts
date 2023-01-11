import { NestFactory } from '@nestjs/core';
import { CartOverviewApiModule } from '../api/cart-overview-api.module';

async function bootstrap() {
    const app = await NestFactory.create(CartOverviewApiModule);
    await app.listen(process.env.PORT);
}

bootstrap();
