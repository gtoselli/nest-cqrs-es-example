import { EventHandler, EventResult, IEventHandler } from '@infra';

import { Injectable } from '@nestjs/common';
import { CartOverviewRepo } from '../../cart-overview.repo';
import { ItemAddedToCartEvent } from '../../../cart/domain/events';

@EventHandler(ItemAddedToCartEvent)
@Injectable()
export class ItemAddedToCartHandler implements IEventHandler<ItemAddedToCartEvent> {
    constructor(private readonly repo: CartOverviewRepo) {}

    async handle(event: ItemAddedToCartEvent): Promise<EventResult> {
        const cart = await this.repo.getOne(event.aggregateId);
        if (!cart) return { ack: false };

        await this.repo.updateOne(event.aggregateId, {
            itemsCount: cart.itemsCount + 1,
        });

        return { ack: true };
    }
}
