import { response } from 'express';
import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'moob',
            price: 22,
        });
};

it('can fetch a list of ticket', async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const res = await request(app).get('/api/tickets/').send().expect(200);
    expect(res.body.length).toEqual(3);
});
