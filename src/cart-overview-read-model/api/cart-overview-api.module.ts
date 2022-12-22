import { Module } from '@nestjs/common';
import { CartOverviewController } from './cart-overview.controller';
import { CartOverviewRepo } from '../cart-overview.repo';

@Module({ controllers: [CartOverviewController], providers: [CartOverviewRepo] })
export class CartOverviewApiModule {}
