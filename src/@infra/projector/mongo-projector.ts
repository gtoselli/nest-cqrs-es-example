import { MongoClient, ObjectId } from 'mongodb';
import { Logger, OnModuleInit } from '@nestjs/common';
import { getBatchedIterableFromCursor } from 'batch-mobile';
import { Event } from '@infra';
import { MongoEventStore } from '@infra/event-store/mongo-event-store';
import { eventsMap } from '../../cart/domain/events';

export class MongoProjector implements OnModuleInit {
    private readonly client: MongoClient;

    private logger = new Logger(MongoProjector.name);

    constructor() {
        this.client = new MongoClient(
            'mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0&readPreference=primary&ssl=false',
        );
    }

    async onModuleInit() {
        await this.client.connect();
    }

    public async subscribeToAll(
        startFrom: string | 'START' | 'END',
        eventHandler: (events: Event<unknown>[]) => Promise<void>,
    ) {
        const BATCH_SIZE = 100;
        const collection = this.client.db('es').collection('event-store');
        const options = { batchSize: BATCH_SIZE };
        const cursor = collection.find(this.getQuery(startFrom), options).sort({ _id: 1 });
        let latestDocId: ObjectId;
        for await (const batch of getBatchedIterableFromCursor(cursor, BATCH_SIZE)) {
            latestDocId = batch[batch.length - 1]._id;
            await eventHandler(MongoEventStore.mongoDocsToDomainEvents(batch, eventsMap));
        }

        let startAtOperationTime;
        if (latestDocId) {
            const oplogDoc = await this.client.db('local').collection('oplog.rs').findOne({ 'o._id': latestDocId });
            startAtOperationTime = oplogDoc.ts;
        }

        setImmediate(async () => {
            try {
                const changeStream = collection.watch([], { startAtOperationTime });
                while (await changeStream.hasNext()) {
                    const change = await changeStream.next();
                    if (!latestDocId) {
                        await eventHandler(
                            MongoEventStore.mongoDocsToDomainEvents([(change as any).fullDocument], eventsMap),
                        );
                    } else if ((change as any).fullDocument._id.toString() != latestDocId.toString()) {
                        await eventHandler(
                            MongoEventStore.mongoDocsToDomainEvents([(change as any).fullDocument], eventsMap),
                        );
                    }
                }
            } catch (e) {
                throw e;
            }
        });
    }

    private getQuery(startFrom: string | 'START' | 'END') {
        switch (startFrom) {
            case 'START': {
                return {};
            }
            case 'END': {
                return { _id: { $gt: new ObjectId(objectIdFromDate(new Date())) } };
            }
            default: {
                return { _id: { $gt: new ObjectId(startFrom) } };
            }
        }
    }
}

const objectIdFromDate = function (date) {
    return Math.floor(date.getTime() / 1000).toString(16) + '0000000000000000';
};
