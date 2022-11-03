import { PublicEvent } from '../../../@infra/event';

interface IItemAddedToCartPayload {
    itemId: string;
    itemName: string;
}

export class ItemAddedToCartEvent extends PublicEvent<IItemAddedToCartPayload> {
    constructor(cartId: string, payload: IItemAddedToCartPayload) {
        super(ItemAddedToCartEvent.name, cartId, payload);
    }
}
