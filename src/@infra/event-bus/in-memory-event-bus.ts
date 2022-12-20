import { EventHandlerFunc, IEventBus } from '@infra';
import { Event } from '../event';
import { Logger } from '@nestjs/common';

export class InMemoryEventBus implements IEventBus {
    private handlers: { [key: string]: EventHandlerFunc<never> } = {};
    private pendingLocalEvents: Event<unknown>[] = [];
    private executingLocalEvents = false;

    private logger = new Logger(InMemoryEventBus.name);

    emits<T extends Event<unknown>>(events: T[]): Promise<void> {
        this.pendingLocalEvents.push(...events);
        setImmediate(() => this.executePendingEvents());
        return Promise.resolve();
    }

    register<T extends Event<unknown>>(eventName: string, handler: EventHandlerFunc<T>): void {
        if (this.alreadyRegister(eventName)) throw new Error(`${eventName} is already registered!`);
        this.handlers[eventName] = handler;
    }

    private alreadyRegister(eventName: string) {
        return !!this.handlers[eventName];
    }

    private async executePendingEvents(): Promise<void> {
        if (this.executingLocalEvents) {
            return;
        }
        this.executingLocalEvents = true;
        while (this.pendingLocalEvents.length) {
            const events = this.pendingLocalEvents.splice(0);
            await Promise.all(events.map((e) => this.dispatchLocalEvent(e)));
        }
        this.executingLocalEvents = false;
    }

    private async dispatchLocalEvent<T extends Event<unknown>>(event: T) {
        const handler = this.handlers[event.eventName] as EventHandlerFunc<T>;
        if (!handler) {
            return;
        }

        try {
            await handler(event);
            this.logger.debug(`Event ${event.eventId} handled successfully`);
        } catch (e) {
            this.logger.warn(`Failed to handle ${event.eventId}`);
        }
    }
}
