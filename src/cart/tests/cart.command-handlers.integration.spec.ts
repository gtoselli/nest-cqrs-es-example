import { CartCommandHandlers } from '../cart.command-handlers';
import { Test } from '@nestjs/testing';
import { CartInfrastructure } from '../domain/cart.infrastructure';
import { ISimpleRepo } from '../../@infra/interfaces/SimpleRepo.interface';
import { CartAggregate } from '../domain/Cart.aggregate';

describe('Cart command handler integration', () => {
    let cmdHandlers: CartCommandHandlers;
    let repo: ISimpleRepo<CartAggregate>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [CartCommandHandlers, ...CartInfrastructure.factory().getProviders()],
        }).compile();

        cmdHandlers = moduleRef.get<CartCommandHandlers>(CartCommandHandlers);
        repo = moduleRef.get<ISimpleRepo<CartAggregate>>('CartRepo');
    });

    let cartId;
    const itemId = 'foo-item-id';
    const itemName = 'foo-item-name';

    describe('createCartCmd', () => {
        it('should create an empty cart', async () => {
            const cmdResult = await cmdHandlers.createCartCmd();

            const cart = await repo.getById(cmdResult.cartId);
            expect(cart.id).toBeDefined();
        });
    });

    describe('Given an existing empty cart', () => {
        beforeEach(async () => {
            const _ = await cmdHandlers.createCartCmd();
            cartId = _.cartId;
        });

        describe('addItemToCartCmd', () => {
            it('should add items', async () => {
                await cmdHandlers.addItemToCartCmd(cartId, itemId, itemName);

                const cart = await repo.getById(cartId);
                expect(cart).toEqual(
                    expect.objectContaining({
                        items: { items: [{ itemId, itemName }] },
                    }),
                );
            });
        });
    });
});
