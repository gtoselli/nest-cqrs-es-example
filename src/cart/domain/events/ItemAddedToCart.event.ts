import { PublicEvent } from '../../../@infra/event';

interface IItemAddedToCartPayload {
    itemId: string;
    itemName: string;
}

export class ItemAddedToCart extends PublicEvent<IItemAddedToCartPayload> {
    constructor(cartId: string, payload: IItemAddedToCartPayload) {
        super(ItemAddedToCart.name, cartId, payload);
    }
}
