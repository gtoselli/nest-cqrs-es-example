import { CartCommandHandlers } from '../cart.command-handlers';
import { Test } from '@nestjs/testing';
import { ISimpleRepo } from '../../@infra/interfaces/SimpleRepo.interface';
import { CartAggregate } from '../domain/Cart.aggregate';
import { ProvidersFactory } from '../../@infra/providers-factory';
import { InfraModule } from '../../@infra/infra.module';

describe('Cart command handler integration', () => {
    let cmdHandlers: CartCommandHandlers;
    let repo: ISimpleRepo<CartAggregate>;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [InfraModule],
            providers: [CartCommandHandlers, ...ProvidersFactory.withContext('Cart').all()],
        }).compile();

        cmdHandlers = moduleRef.get<CartCommandHandlers>(CartCommandHandlers);
        repo = moduleRef.get<ISimpleRepo<CartAggregate>>('CartRepo');
    });

    let cartId;
    const itemId = 'foo-item-id';
    const itemName = 'foo-item-name';

    describe('createCmd', () => {
        it('should create an empty cart', async () => {
            const cmdResult = await cmdHandlers.createCmd();

            const cart = await repo.getById(cmdResult.cartId);
            expect(cart.id).toBeDefined();
        });
    });

    describe('Given an existing empty cart', () => {
        beforeEach(async () => {
            const _ = await cmdHandlers.createCmd();
            cartId = _.cartId;
        });

        describe('addItemCmd', () => {
            it('should add items', async () => {
                await cmdHandlers.addItem(cartId, itemId, itemName);

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
