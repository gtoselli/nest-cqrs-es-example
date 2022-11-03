import { CartAggregate } from './Cart.aggregate';

describe('Cart aggregate', () => {
  let cart: CartAggregate;

  const cartIdFixture = 'foo-cart-id';

  beforeEach(() => {
    cart = new CartAggregate(cartIdFixture);
  });

  it('should be defined', () => {
    expect(cart).toBeDefined();
  });

  it('should be an aggregate root extension', () => {
    expect(cart.id).toBeDefined();
  });
});
