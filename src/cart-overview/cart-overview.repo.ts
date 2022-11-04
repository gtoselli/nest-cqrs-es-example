import { OnModuleInit } from '@nestjs/common';
import * as fakeLocalDb from 'node-persist';

export type CartReadModel = {
    cartId: string;
    itemsCount: number;
    isDeleted: boolean;
};

const fakeLocalDbCartsKey = 'cart-overview';

export class CartOverviewRepo implements OnModuleInit {
    async onModuleInit() {
        await fakeLocalDb.init({});
    }

    public async getOne(cartId: string): Promise<CartReadModel | null> {
        const carts = (await fakeLocalDb.get(fakeLocalDbCartsKey)) || [];
        return carts.find((c) => c.cartId === cartId);
    }

    public async createOne(cartReadModel: CartReadModel): Promise<void> {
        const carts = (await fakeLocalDb.get(fakeLocalDbCartsKey)) || [];
        carts.push(cartReadModel);
        await fakeLocalDb.set(fakeLocalDbCartsKey, carts);
    }

    public async updateOne(cartId: string, stuffToUpdate: Partial<CartReadModel>): Promise<void> {
        const carts = (await fakeLocalDb.get(fakeLocalDbCartsKey)) || [];

        const cartIndex = carts.findIndex((c) => c.cartId === cartId);
        if (cartIndex === -1) throw new Error('Cart to update not found');

        carts[cartIndex] = { ...carts[cartIndex], ...stuffToUpdate };
        await fakeLocalDb.set(fakeLocalDbCartsKey, carts);
        return;
    }

    public async getMany(): Promise<CartReadModel[]> {
        return (await fakeLocalDb.get(fakeLocalDbCartsKey)) || [];
    }
}
