import { Module } from '@nestjs/common';
import { InfraModule } from '@infra';

@Module({
    imports: [
        InfraModule,
        // CartModule,
        // CartOverviewModule
    ],
})
export class AppModule {}
