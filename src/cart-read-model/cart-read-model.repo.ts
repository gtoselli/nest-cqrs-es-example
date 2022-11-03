export type CartReadModel = {
    cartId: string;
    itemsCount: number;
    isDeleted: boolean;
};

export class CartReadModelRepo {
    constructor(private carts: CartReadModel[] = []) {}

    public async getOne(cartId: string): Promise<CartReadModel | null> {
        return this.carts.find((c) => c.cartId === cartId);
    }

    public async createOne(cartReadModel: CartReadModel): Promise<void> {
        this.carts.push(cartReadModel);
    }

    public async updateOne(cartId: string, stuffToUpdate: Partial<CartReadModel>): Promise<void> {
        const cartIndex = this.carts.findIndex((c) => c.cartId === cartId);
        if (cartIndex === -1) throw new Error('Cart to update not found');

        this.carts[cartIndex] = { ...this.carts[cartIndex], ...stuffToUpdate };
        return;
    }

    public async getMany(): Promise<CartReadModel[]> {
        return this.carts;
    }
}
