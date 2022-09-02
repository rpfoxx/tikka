import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on a successful signup', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test1@test.com',
        password: '1234567'
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test1test.com',
        password: '1234567'
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test1@test.com',
        password: ''
    })
    .expect(400);
});

it('returns a 400 with no email or password', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: ''
    })
    .expect(400);

    await request(app)
    .post('/api/users/signup')
    .send({ 
        password: ''
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test2@test.com',
        password: '1234567'
    })
    .expect(201);

    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test2@test.com',
        password: '1234567'
    })
    .expect(400);
});

it('sets a cookie after succesful signup', async () => {
    const response = await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: '1234567'
    })
    .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined(); 
});