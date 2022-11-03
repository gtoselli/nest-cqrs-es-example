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
  });

  describe('Cart creation', () => {
    it('should create an empty cart with a uuid', () => {
      const cart = CartAggregate.createEmpty();
      expect(isValidUUID(cart.id)).toBeTruthy();
    });
  });
});
