import { CartCreatedEvent } from '../../cart/domain/events/CartCreated.event';
import { EventResult, IEventBus } from '../../@infra/interfaces/EventBus.interface';
import { EventHandler } from '../../@infra/nest-utilities/decorators/EventHandler.decorator';
import { IEventHandler } from '../../@infra/interfaces/EventHandler.interface';
import { Injectable } from '@nestjs/common';

@EventHandler(CartCreatedEvent)
@Injectable()
export class CartCreatedHandler implements IEventHandler<CartCreatedEvent> {
    registerTo(eventBus: IEventBus) {
        eventBus.register<CartCreatedEvent>(CartCreatedEvent.name, (e) => this.handle(e));
    }

    async handle(event: CartCreatedEvent): Promise<EventResult> {
        console.log(`Elaboro il mio fantastico evento ${JSON.stringify(event)}`);
        return { ack: true };
    }
}
