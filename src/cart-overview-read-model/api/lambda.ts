import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { CartOverviewApiModule } from './cart-overview-api.module';

let cachedServer;

export const handler = async (event, context) => {
    if (!cachedServer) {
        const nestApp = await NestFactory.create(CartOverviewApiModule);
        await nestApp.init();
        cachedServer = serverlessExpress({ app: nestApp.getHttpAdapter().getInstance() });
    }
    return cachedServer(event, context);
};
