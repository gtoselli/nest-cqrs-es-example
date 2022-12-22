import { v4 as uuid } from 'uuid';

export abstract class Event<EventPayloadType> {
    public eventId: string;
    public aggregateVersion: number;
    abstract readonly eventName: string;
    abstract readonly aggregateId: string;
    abstract readonly eventPayload: EventPayloadType;
    abstract readonly isPublic: boolean;

    protected constructor() {
        this.eventId = uuid();
    }

    public setEventId(eventId: string): void {
        this.eventId = eventId;
    }

    public setAggregateVersion(version: number): void {
        this.aggregateVersion = version;
    }
}

export class PrivateEvent<EventPayloadType> extends Event<EventPayloadType> {
    readonly isPublic = false;

    constructor(readonly eventName: string, readonly aggregateId: string, readonly eventPayload: EventPayloadType) {
        super();
    }
}

export class PublicEvent<EventPayloadType> extends Event<EventPayloadType> {
    readonly isPublic = true;

    constructor(readonly eventName: string, readonly aggregateId: string, readonly eventPayload: EventPayloadType) {
        super();
    }
}
