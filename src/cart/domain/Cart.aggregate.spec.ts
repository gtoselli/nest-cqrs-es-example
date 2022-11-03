import { CartAggregate } from './Cart.aggregate';

describe('Cart aggregate', () => {
  let cart: CartAggregate;

  beforeEach(() => {
    cart = new CartAggregate();
  });

  it('should be defined', () => {
    expect(cart).toBeDefined();
  });
});
