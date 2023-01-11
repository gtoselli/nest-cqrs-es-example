import { CartCreatedEvent } from '../../../cart/domain/events';
import { EventHandler, IEventHandler } from '@infra';
import { Injectable } from '@nestjs/common';
import { CartOverviewRepo } from '../../cart-overview.repo';

@EventHandler(CartCreatedEvent)
@Injectable()
export class CartCreatedHandler implements IEventHandler<CartCreatedEvent> {
    constructor(private readonly repo: CartOverviewRepo) {}

    async handle(event: CartCreatedEvent): Promise<void> {
        await this.repo.createOne({
            cartId: event.aggregateId,
            isDeleted: false,
            itemsCount: 0,
        });
        return;
    }
}
