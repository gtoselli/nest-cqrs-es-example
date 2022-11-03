import { AggregateRoot } from '@infra';
import { v4 as uuid } from 'uuid';
import { ItemsEntity } from './Items.entity';
import { ItemEntity } from './Item.entity';
import { ItemAddedToCartEvent } from './events';
import { CartCreatedEvent } from './events/CartCreated.event';

export class CartAggregate extends AggregateRoot {
    private items = new ItemsEntity();

    constructor(cartId: string) {
        super(cartId);
    }

    public static emptyFactory() {
        const cartId = uuid();
        return new CartAggregate(cartId);
    }

    public create() {
        if (!this.id) throw new Error('Use factory before this method');
        this.applyChange(new CartCreatedEvent(this.id));
    }

    public addItem(itemId: string, itemName: string) {
        this.applyChange(new ItemAddedToCartEvent(this.id, { itemId, itemName }));
    }

    public getItemsCount(): number {
        return this.items.getCount();
    }

    private onItemAddedToCartEvent({ eventPayload }: ItemAddedToCartEvent) {
        const { itemId, itemName } = eventPayload;
        const item = new ItemEntity(itemId, itemName);
        this.items.addItem(item);
    }

    private onCartCreatedEvent({}: CartCreatedEvent) {}
}
