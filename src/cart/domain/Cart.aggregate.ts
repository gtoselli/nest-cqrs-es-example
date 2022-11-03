import { AggregateRoot } from '../../infra/aggregate';
import { v4 as uuid } from 'uuid';

export class CartAggregate extends AggregateRoot {
  constructor(cartId: string) {
    super(cartId);
  }

  public static createEmpty() {
    const cartId = uuid();
    return new CartAggregate(cartId);
  }
}
