import { Controller, Get } from '@nestjs/common';
import { CartOverviewRepo } from '../cart-overview.repo';

@Controller('query/cart-overview')
export class CartOverviewController {
    constructor(private readonly repo: CartOverviewRepo) {}

    @Get('list')
    public async getList() {
        return await this.repo.getMany();
    }
}
