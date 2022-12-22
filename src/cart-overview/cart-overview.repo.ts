import { Logger, OnModuleInit } from '@nestjs/common';
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

    private readonly logger = new Logger(CartOverviewRepo.name);

    public async getOne(cartId: string): Promise<CartReadModel | null> {
        this.logger.debug(`Getting one by cartId ${cartId}`);
        const carts = (await fakeLocalDb.get(fakeLocalDbCartsKey)) || [];
        return carts.find((c) => c.cartId === cartId);
    }

    public async createOne(cartReadModel: CartReadModel): Promise<void> {
        const carts = (await fakeLocalDb.get(fakeLocalDbCartsKey)) || [];
        carts.push(cartReadModel);
        await fakeLocalDb.set(fakeLocalDbCartsKey, carts);
        this.logger.debug(`Created one ${JSON.stringify(cartReadModel)}`);
    }

    public async updateOne(cartId: string, stuffToUpdate: Partial<CartReadModel>): Promise<void> {
        const carts = (await fakeLocalDb.get(fakeLocalDbCartsKey)) || [];

        const cartIndex = carts.findIndex((c) => c.cartId === cartId);
        if (cartIndex === -1) throw new Error('Cart to update not found');

        carts[cartIndex] = { ...carts[cartIndex], ...stuffToUpdate };
        await fakeLocalDb.set(fakeLocalDbCartsKey, carts);
        this.logger.debug(`Updated one by cartId ${cartId} one with ${JSON.stringify(carts[cartIndex])}`);

        return;
    }

    public async getMany(): Promise<CartReadModel[]> {
        this.logger.debug(`Getting many`);
        return (await fakeLocalDb.get(fakeLocalDbCartsKey)) || [];
    }

    public async deleteMany(): Promise<void> {
        this.logger.debug(`Deleting all`);
        await fakeLocalDb.clear();
    }
}
