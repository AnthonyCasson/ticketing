import request from "supertest";
import { app } from "../../app";

it('returns a 201 on succesful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
})

it("return a 400 with an invalid email", async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'testest.com',
        password: 'password'
    })
    .expect(400)
})