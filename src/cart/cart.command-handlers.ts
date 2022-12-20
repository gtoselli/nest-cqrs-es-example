import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartAggregate } from './domain/Cart.aggregate';
import { ISimpleRepo } from '@infra';

@Injectable()
export class CartCommandHandlers {
    constructor(@Inject('CartRepo') private readonly repo: ISimpleRepo<CartAggregate>) {}

    public async createCmd(): Promise<{ cartId: string }> {
        const cart = CartAggregate.emptyFactory();
        cart.create();

        await this.repo.commit(cart);
        return { cartId: cart.id };
    }

    public async addItem(cartId: string, itemId: string, itemName: string) {
        const cart = await this.repo.getById(cartId);
        if (!cart) throw new NotFoundException();

        cart.addItem(itemId, itemName);

        await this.repo.commit(cart);
    }
}
