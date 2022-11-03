import { RabbitServiceBus } from '../../@infra/in-memory-event-bus/in-memory-event-bus';
import { CartCreatedEvent } from '../../cart/domain/events/CartCreated.event';
import { EventResult } from '../../@infra/interfaces/EventBus.interface';
import { Injectable, SetMetadata } from '@nestjs/common';

@Injectable()
@SetMetadata('isEventHandler', true)
export class CartCreatedHandler {
    registerTo(eventBus: RabbitServiceBus) {
        eventBus.register<CartCreatedEvent>(CartCreatedEvent.name, (e) => this.handler(e));
    }

    async handler(e: CartCreatedEvent): Promise<EventResult> {
        console.log(`Elaboro il mio fantastico evento ${JSON.stringify(e)}`);
        return { ack: true };
    }
}
