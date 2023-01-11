import { Event } from '@infra';
import { Logger } from '@nestjs/common';
import { EventHandlerFunc } from '@infra/event-bus/event-bus.interface';

export interface ILocalEventBus {
    register<T extends Event<unknown>>(eventName: string, handler: EventHandlerFunc<T>): void;

    emitAsync<T extends Event<unknown>>(event: T): Promise<void>;
}

export class LocalEventBus implements ILocalEventBus {
    private logger = new Logger(LocalEventBus.name);
    private handlers: { [key: string]: EventHandlerFunc<never> } = {};

    public async emitAsync<T extends Event<unknown>>(event: T): Promise<void> {
        const handler = this.handlers[event.eventName] as EventHandlerFunc<T>;
        if (!handler) {
            this.logger.warn(`Handler not found for event ${event.eventName}`);
            return;
        }
        try {
            await handler(event);
            this.logger.debug(`Event handled successfully`);
        } catch (e) {
            this.logger.error(`Failed to handle event due ${e.message}`);
            throw e;
        }
    }

    public register<T extends Event<unknown>>(eventName: string, handler: EventHandlerFunc<T>): void {
        if (this.alreadyRegister(eventName)) throw new Error(`${eventName} is already registered!`);
        this.handlers[eventName] = handler;
    }

    private alreadyRegister(eventName: string) {
        return !!this.handlers[eventName];
    }
}
