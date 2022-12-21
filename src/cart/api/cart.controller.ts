import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CartCommandHandlers } from '../cart.command-handlers';
import { AddItemDto } from './dto/add-item.dto';

@Controller('cmd')
export class CartController {
    constructor(private readonly commands: CartCommandHandlers) {}

    @Post('create')
    @HttpCode(202)
    public async createCmd() {
        return await this.commands.createCmd();
    }

    @Post('add-item')
    @HttpCode(202)
    public async addItem(@Body() body: AddItemDto) {
        return await this.commands.addItem(body.cartId, body.itemId, body.itemName);
    }
}
