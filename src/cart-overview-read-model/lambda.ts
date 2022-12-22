// import { configure as serverlessExpress } from '@vendia/serverless-express';
// import { NestFactory } from '@nestjs/core';
// import { CartOverviewModule } from './cart-overview.module';
//
// let cachedServer;
//
// export const handler = async (event, context) => {
//     if (!cachedServer) {
//         const nestApp = await NestFactory.create(CartOverviewModule);
//         await nestApp.init();
//         cachedServer = serverlessExpress({ app: nestApp.getHttpAdapter().getInstance() });
//     }
//     return cachedServer(event, context);
// };
