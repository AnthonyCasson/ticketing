import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
    var signin: () => string[];
  }

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdcscf';

    mongo = new MongoMemoryServer();
    await mongo.start();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = () => {
    //build JWT payload { id, email }
    const payload = {
        id: 'ghghgjhgjghj',
        email: 'test@test.com',
    };

    //create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    //build session object { jwt: MY_JWT }
    const session = { jwt: token };

    //make object JSON
    const sessionJSON = JSON.stringify(session);

    //take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    //return a string thats the cookie with the encoded data
    return [`session=${base64}`];
};
