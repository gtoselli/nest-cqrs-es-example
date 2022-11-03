import { CartAggregate } from './Cart.aggregate';
import { validate as isValidUUID } from 'uuid';

describe('Cart aggregate', () => {
    const cartIdFixture = 'foo-cart-id';

    it('should be defined', () => {
        const cart = new CartAggregate(cartIdFixture);
        expect(cart).toBeDefined();
    });

    it('should be an aggregate root extension', () => {
        const cart = new CartAggregate(cartIdFixture);
        expect(cart.id).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(cart._changes).toBeDefined();
    });

    describe('Cart creation', () => {
        it('should create an empty cart with a uuid', () => {
            const cart = CartAggregate.emptyFactory();
            cart.create();
            expect(isValidUUID(cart.id)).toBeTruthy();
        });
    });

    describe('Items', () => {
        let cart: CartAggregate;

        beforeEach(() => {
            cart = CartAggregate.emptyFactory();
        });

        const itemIdFixture = 'foo-item-id';
        const itemNameFixture = 'foo-item-name';

        describe('Add a cart item', () => {
            it('item should be added', () => {
                cart.addItem(itemIdFixture, itemNameFixture);
                expect(cart.getItemsCount()).toBe(1);

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                expect(cart.items.items[0]).toEqual({
                    itemId: itemIdFixture,
                    itemName: itemNameFixture,
                });
            });
        });
    });
});
