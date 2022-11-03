import { AggregateRoot } from '../../@infra/aggregate';
import { v4 as uuid } from 'uuid';
import { ItemsEntity } from './Items.entity';
import { ItemEntity } from './Item.entity';
import { ItemAddedToCart } from './events';

export class CartAggregate extends AggregateRoot {
    private items = new ItemsEntity();

    constructor(cartId: string) {
        super(cartId);
    }

    public static createEmpty() {
        const cartId = uuid();
        return new CartAggregate(cartId);
    }

    public addItem(itemId: string, itemName: string) {
        this.applyChange(new ItemAddedToCart(this.id, { itemId, itemName }));
    }

    public getItemsCount(): number {
        return this.items.getCount();
    }

    private onItemAddedToCart({ eventPayload }: ItemAddedToCart) {
        const { itemId, itemName } = eventPayload;
        const item = new ItemEntity(itemId, itemName);
        this.items.addItem(item);
    }
}
