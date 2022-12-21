import { Event, ISimpleEventStore } from '@infra';
import { DynamoDBClient, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { OnModuleInit } from '@nestjs/common';

export class DdbEventStore implements ISimpleEventStore, OnModuleInit {
    private readonly client = new DynamoDBClient({ region: 'eu-south-1' });

    constructor(private readonly domainEvents: Map<string, Event<unknown>>) {}

    public async appendEvents(aggregateId: string, events: Event<unknown>[]): Promise<void> {
        for (const event of events) {
            await this.client.send(
                new PutItemCommand({
                    TableName: 'test-event-store',
                    Item: {
                        aggregateId: { S: aggregateId },
                        eventId: { S: event.eventId },
                        eventName: { S: event.eventName },
                        timestamp: { S: new Date().toISOString() },
                        eventPayload: { S: JSON.stringify(event.eventPayload || {}) },
                        aggregateVersion: { N: String(event.aggregateVersion) },
                    },
                }),
            );
        }
    }

    public async retrieveEventsByAggregateId(aggregateId: string): Promise<Event<unknown>[]> {
        const params = {
            ExpressionAttributeValues: {
                ':catval': {
                    S: aggregateId,
                },
            },
            FilterExpression: 'aggregateId = :catval',
            TableName: 'test-event-store',
        };
        const query = await this.client.send(new ScanCommand(params));
        return this.mongoDocsToDomainEvents(query.Items);
    }

    private mongoDocsToDomainEvents(docs: any[]) {
        return docs.map((e) => {
            // TODO: bad solution
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const event = new (this.domainEvents.get(e.eventName.S!)!)(e.aggregateId.S, JSON.parse(e.eventPayload.S));
            event.setEventId(e.eventId);
            event.setAggregateVersion(e.aggregateVersion);
            return event;
        });
    }

    async onModuleInit() {
        const params = {
            AttributeDefinitions: [
                {
                    AttributeName: 'eventId', //ATTRIBUTE_NAME_1
                    AttributeType: 'S', //ATTRIBUTE_TYPE
                },
                {
                    AttributeName: 'aggregateId', //ATTRIBUTE_NAME_1
                    AttributeType: 'S', //ATTRIBUTE_TYPE
                },
                {
                    AttributeName: 'timestamp', //ATTRIBUTE_NAME_2
                    AttributeType: 'S', //ATTRIBUTE_TYPE
                },
            ],
            KeySchema: [
                {
                    AttributeName: 'eventId',
                    KeyType: 'HASH',
                },
                {
                    AttributeName: 'timestamp',
                    KeyType: 'RANGE',
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
            TableName: 'test-event-store',
            StreamSpecification: {
                StreamEnabled: false,
            },
        };
        // try {
        //     const data = await this.client.send(new CreateTableCommand(params));
        //     console.log('Table Created', data);
        //     return data;
        // } catch (err) {
        //     console.log('Error', err);
        // }
    }
}
