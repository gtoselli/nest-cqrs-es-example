import { CartCreatedEvent } from '../../cart/domain/events/CartCreated.event';
import { EventHandler, EventResult, IEventHandler } from '@infra';
import { Injectable } from '@nestjs/common';
import { CartOverviewRepo } from '../cart-overview.repo';

@EventHandler(CartCreatedEvent)
@Injectable()
export class CartCreatedHandler implements IEventHandler<CartCreatedEvent> {
    constructor(private readonly repo: CartOverviewRepo) {}

    async handle(event: CartCreatedEvent): Promise<EventResult> {
        await this.repo.createOne({
            cartId: event.aggregateId,
            isDeleted: false,
            itemsCount: 0,
        });
        return { ack: true };
    }
}
