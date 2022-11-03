import { Body, Controller, Post } from '@nestjs/common';
import { CartCommandHandlers } from '../cart.command-handlers';
import { AddItemDto } from './dto/add-item.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly commands: CartCommandHandlers) {}

    @Post('create')
    public async createCmd() {
        return await this.commands.createCmd();
    }

    @Post('add-item')
    public async addItem(@Body() body: AddItemDto) {
        return await this.commands.addItem(body.cartId, body.itemId, body.itemName);
    }
}
