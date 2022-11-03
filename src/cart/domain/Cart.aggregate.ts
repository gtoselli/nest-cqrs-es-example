import { AggregateRoot } from '../../infra/aggregate';

export class CartAggregate extends AggregateRoot {
  constructor(cartId: string) {
    super(cartId);
  }
}
