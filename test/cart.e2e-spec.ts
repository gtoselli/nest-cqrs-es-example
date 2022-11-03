import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { validate as isValidUUID } from 'uuid';

describe('CartController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    describe('/cart/create (POST)', () => {
        it('status code and body should be correct', async () => {
            const { statusCode, body } = await request(app.getHttpServer()).post('/cart/create');

            expect(statusCode).toBe(202);
            expect(body.cartId).toBeDefined();
            expect(isValidUUID(body.cartId)).toBeTruthy();
        });
    });

    describe('/cart/add-item (POST)', () => {
        const bodyFixture = { itemId: '788d4086-5313-4e1c-85ea-1d9f37d4e89a', itemName: 'Foo Item' };

        describe('Existing cart', () => {
            let existingCartId: string;

            beforeEach(async () => {
                const { body } = await request(app.getHttpServer()).post('/cart/create');
                existingCartId = body.cartId;
            });

            describe('Without body', () => {
                it('status code should be 400', async () => {
                    const { statusCode, body } = await request(app.getHttpServer()).post('/cart/add-item');

                    expect(statusCode).toBe(400);
                });
            });

            describe('Happy path', () => {
                it('status code should be 202', async () => {
                    const { statusCode } = await request(app.getHttpServer())
                        .post('/cart/add-item')
                        .send({ cartId: existingCartId, ...bodyFixture });

                    expect(statusCode).toBe(202);
                });
            });
        });

        describe('Non Existing cart', () => {
            const casualUuid = 'a7364a3d-fc17-4597-9ce2-86e95b3e1389';
            it('/cart/add-item (POST)', async () => {
                const { statusCode } = await request(app.getHttpServer())
                    .post('/cart/add-item')
                    .send({ cartId: casualUuid, ...bodyFixture });

                expect(statusCode).toBe(404);
            });
        });
    });
});
