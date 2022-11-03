import { EventResult, IEventBus } from './EventBus.interface';
import { Event } from '../event';

export interface IEventHandler<E extends Event<unknown>> {
    registerTo: (eventBus: IEventBus) => void;
    handle: (event: E) => Promise<EventResult>;
}
