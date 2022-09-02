import { response } from "express";
import request from "supertest";
import { app } from "../../app";

it('fails when a email supplied does not exist', async () => {
    await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@test.com',
        password: '1234567'
    })
    .expect(400)
});

it('fails when a password supplied is incorrect', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: '1234567' 
    })
    .expect(201); 
   
    await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@test.com',
        password: '1234568'
    })
    .expect(400);
});

it('response with cookie when given valid credentials', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: '1234567' 
    })
    .expect(201); 
   
    const response = await request(app)
    .post('/api/users/signin')
    .send({
        email: 'test@test.com',
        password: '1234567'
    })
    .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined(); 

});