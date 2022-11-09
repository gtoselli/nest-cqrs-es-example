import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Rabbit } from './rabbit';

@Injectable()
export class RabbitNestProvider implements OnModuleInit, OnModuleDestroy {
    private readonly rabbit: Rabbit;

    constructor() {
        this.rabbit = new Rabbit(process.env.AMQP_URI, 10);
    }

    public async onModuleInit() {
        await this.rabbit.connect({ temporary: false });
    }

    public async onModuleDestroy() {
        await this.rabbit.disconnect();
    }
}
