import { CartCreatedEvent } from './CartCreated.event';
import { ItemAddedToCartEvent } from './ItemAddedToCart.event';

export * from './ItemAddedToCart.event';
export * from './CartCreated.event';

export const eventsMap = new Map<string, any>([
    ['CartCreatedEvent', CartCreatedEvent],
    ['ItemAddedToCartEvent', ItemAddedToCartEvent],
]);
