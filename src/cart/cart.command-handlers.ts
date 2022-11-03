import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISimpleRepo } from '../@infra/interfaces/SimpleRepo.interface';
import { CartAggregate } from './domain/Cart.aggregate';

@Injectable()
export class CartCommandHandlers {
    constructor(@Inject('CartRepo') private readonly repo: ISimpleRepo<CartAggregate>) {}

    public async addItemToCartCmd(cartId: string, itemId: string, itemName: string) {
        const cart = await this.repo.getById(cartId);
        if (!cart) throw new NotFoundException();

        cart.addItem(itemId, itemName);

        await this.repo.commit(cart);
    }
}
