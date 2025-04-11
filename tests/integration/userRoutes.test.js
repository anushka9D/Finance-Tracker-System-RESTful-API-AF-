const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const userRoutes = require('../../src/routes/userRoutes');
const User = require('../../src/models/userModel');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User Routes Integration Tests', () => {

  it('should register a user and allow login', async () => {

    const registerResponse = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        
      });
    expect(registerResponse.status).toBe(200);
    expect(registerResponse.body).toHaveProperty('token');


    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'password123',
      });
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
  });


  it('should return current user details with a valid token', async () => {

    const registerResponse = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    const token = registerResponse.body.token;


    const userResponse = await request(app)
      .get('/api/users/me')
      .set('x-auth-token', token);
    expect(userResponse.status).toBe(200);
    expect(userResponse.body).toHaveProperty('username', 'testuser');
    expect(userResponse.body).toHaveProperty('email', 'test@example.com');
    expect(userResponse.body).not.toHaveProperty('password');
  });
});