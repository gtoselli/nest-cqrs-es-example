import { ItemAddedToCartEvent } from '../../../cart/domain/events';

export const ItemAddedToCartEventFixture = (cartId: string) =>
    new ItemAddedToCartEvent(cartId, {
        itemId: 'foo-item-id',
        itemName: 'item-name',
    });
