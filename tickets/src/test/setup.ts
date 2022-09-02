
import { MongoMemoryServer } from 'mongodb-memory-server'; 
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  function signin(): string[];
  
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
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
  // Build a json web token payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  //create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!); 

  // Build a session object {jwt, my_jwt}
  const session = { jwt: token};

  // turn that session in JSON
  const sessionJSON = JSON.stringify(session);

  // return a string thats the cookie with the encoded data
  const base64 = Buffer.from(sessionJSON).toString('base64');


  return [`session=${base64}`];
}