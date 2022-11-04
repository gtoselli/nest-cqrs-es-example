import { CartCreatedEvent } from '../../../cart/domain/events';

export const CartCreatedEventFixture = (cartId: string) => new CartCreatedEvent(cartId);
