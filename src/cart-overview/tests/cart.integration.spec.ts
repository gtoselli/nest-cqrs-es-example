import { Test, TestingModule } from '@nestjs/testing';
import { InfraModule } from '@infra';
import { CartOverviewRepo } from '../cart-overview.repo';
import { CartCreatedHandler, ItemAddedToCartHandler } from '../handlers';
import { CartCreatedEventFixture } from './fixtures/CartCreatedEvent.fixture';
import { ItemAddedToCartEventFixture } from './fixtures/ItemAddedToCartEvent.fixture';

describe('Cart read model integration ', () => {
    let module: TestingModule;
    let repo: CartOverviewRepo;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [InfraModule],
            providers: [CartOverviewRepo, CartCreatedHandler, ItemAddedToCartHandler],
        }).compile();

        repo = module.get<CartOverviewRepo>(CartOverviewRepo);
        await repo.onModuleInit();
    });

    beforeEach(async () => {
        await repo.deleteMany();
    });

    const getHandler = (handler) => module.get(handler);

    describe('on CartCreated event', () => {
        it('should insert a right document in cart-overview', async () => {
            await getHandler(CartCreatedHandler).handle(CartCreatedEventFixture('foo-cart-id'));

            const cartOverview = await repo.getOne('foo-cart-id');
            expect(cartOverview).toEqual({ cartId: 'foo-cart-id', isDeleted: false, itemsCount: 0 });
        });
    });

    describe('on ItemAddedToCart event', () => {
        beforeEach(async () => {
            await getHandler(CartCreatedHandler).handle(CartCreatedEventFixture('foo-cart-id'));
        });

        it('should insert a right document in cart-overview', async () => {
            await getHandler(ItemAddedToCartHandler).handle(ItemAddedToCartEventFixture('foo-cart-id'));

            const cartOverview = await repo.getOne('foo-cart-id');
            expect(cartOverview).toEqual({ cartId: 'foo-cart-id', isDeleted: false, itemsCount: 1 });
        });
    });
});
