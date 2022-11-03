import { ItemEntity } from './Item.entity';

export class ItemsEntity {
    constructor(private items: ItemEntity[] = []) {}

    public addItem(item: ItemEntity): void {
        this.items.push(item);
    }

    public getCount(): number {
        return this.items.length;
    }
}
