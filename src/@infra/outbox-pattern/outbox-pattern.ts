import { Event, IEventBus } from '@infra';
import { Logger } from '@nestjs/common';

export class OutboxPattern {
    constructor(private readonly eventBus: IEventBus) {
        setInterval(async () => {
            await this.publishAll();
        }, 500);
    }

    private outboxTable: { event: Event<unknown>; published: boolean }[] = [];

    private readonly logger = new Logger(OutboxPattern.name);

    public async add(event: Event<unknown>) {
        this.outboxTable.push({ event, published: false });
        this.logger.debug(`Event ${event.eventId} added to outbox`);
    }

    public async publishAll() {
        const eventsToPublish = await this.getUnpublishedEvents();
        for (const { event } of eventsToPublish) {
            await this.eventBus.emits([event]);
            await this.markEventAsPublished(event.eventId);
        }
    }

    private async getUnpublishedEvents() {
        return this.outboxTable.filter((e) => e.published === false);
    }

    private async markEventAsPublished(eventId: string) {
        const _index = this.outboxTable.findIndex((e) => e.event.eventId === eventId);
        this.outboxTable[_index].published = true;
        this.logger.debug(`Event ${eventId} marked as published`);
    }
}
