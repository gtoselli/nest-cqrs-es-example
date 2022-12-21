import { ItemAddedToCartEvent } from './ItemAddedToCart.event';
import { CartCreatedEvent } from './CartCreated.event';

export * from './ItemAddedToCart.event';
export * from './CartCreated.event';

export const eventsMap = new Map<string, any>([
    ['ItemAddedToCartEvent', ItemAddedToCartEvent],
    ['CartCreatedEvent', CartCreatedEvent],
]);
