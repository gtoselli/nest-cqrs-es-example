import { Event } from '../event';

export interface EventResult {
    ack: boolean;
}

export type EventHandlerFunc<T extends Event<unknown>> = (e: T) => Promise<EventResult>;

export interface IEventBus {
    register<T extends Event<unknown>>(eventName: string, handler: EventHandlerFunc<T>): void;

    emits<T extends Event<unknown>>(events: T[]): Promise<void>;
}
