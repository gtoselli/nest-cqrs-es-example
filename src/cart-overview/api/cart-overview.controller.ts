import { Controller, Get } from '@nestjs/common';
import { CartOverviewRepo } from '../cart-overview.repo';

@Controller('cart-overview')
export class CartOverviewController {
    constructor(private readonly repo: CartOverviewRepo) {}

    @Get('')
    public async getList() {
        return await this.repo.getMany();
    }
}
