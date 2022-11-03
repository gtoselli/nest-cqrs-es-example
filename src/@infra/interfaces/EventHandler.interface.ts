import { EventResult } from './EventBus.interface';
import { Event } from '../event';

export interface IEventHandler<E extends Event<unknown>> {
    handle: (event: E) => Promise<EventResult>;
}
