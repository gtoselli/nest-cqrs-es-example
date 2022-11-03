import { Event } from '../event';

export interface EventResult {
    ack: boolean;
}

export type EventHandler<T extends Event<unknown>> = (e: T) => Promise<EventResult>;

export interface IEventBus {
    register<T extends Event<unknown>>(eventName: string, handler: EventHandler<T>): void;

    emit<T extends Event<unknown>>(event: T): Promise<void>;

    emits<T extends Event<unknown>>(events: T[]): Promise<void>;
}
