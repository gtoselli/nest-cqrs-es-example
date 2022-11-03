import { PublicEvent } from '../../../@infra/event';

export class CartCreatedEvent extends PublicEvent<void> {
    constructor(cartId: string) {
        super(CartCreatedEvent.name, cartId);
    }
}
