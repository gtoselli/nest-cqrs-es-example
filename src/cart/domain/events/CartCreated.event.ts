import { PublicEvent } from '@infra';

export class CartCreatedEvent extends PublicEvent<void> {
    constructor(cartId: string) {
        super(CartCreatedEvent.name, cartId);
    }
}
