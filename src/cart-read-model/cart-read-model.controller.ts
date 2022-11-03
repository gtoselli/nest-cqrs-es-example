import { Controller, Get } from '@nestjs/common';
import { CartReadModelRepo } from './cart-read-model.repo';

@Controller('cart-read-model')
export class CartReadModelController {
    constructor(private readonly repo: CartReadModelRepo) {}

    @Get('')
    public async getList() {
        return await this.repo.getMany();
    }
}
