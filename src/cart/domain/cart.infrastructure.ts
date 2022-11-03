import { CartAggregate } from './Cart.aggregate';
import { InMemoryEs, InMemoryEsRepo } from '../../infra/in-memory-event-store/in-memory-es.repo';
import { Provider } from '@nestjs/common';

export class CartInfrastructure {
    constructor(private readonly es: InMemoryEs, private readonly repo: InMemoryEsRepo<CartAggregate>) {}

    public static factory() {
        const es = new InMemoryEs();
        const repo = new InMemoryEsRepo(es, CartAggregate);
        return new CartInfrastructure(es, repo);
    }

    public getProviders(): Provider[] {
        return [
            {
                provide: 'CartRepo',
                useFactory: async () => {
                    return this.repo;
                },
            },
        ];
    }
}
