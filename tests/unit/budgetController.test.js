const request = require('supertest');
const app = require('../../src/index');
const mongoose = require('mongoose');
const Budget = require('../../src/models/budgetModel');
const User = require('../../src/models/userModel');

jest.setTimeout(30000);

let validToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user@example.com', password: 'password' });
  validToken = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET /api/budgets/getbudgets', () => {
  it('should fetch budgets with valid token', async () => {
    const res = await request(app)
      .get('/api/budgets/getbudgets')
      .set('Authorization', `Bearer ${validToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});

describe('POST /api/budgets/createbudget', () => {
  it('should create a budget with valid data', async () => {
    const newBudget = {
      category: 'Food',
      currency: 'USD',
      period: 'Monthly'
    };

    const res = await request(app)
      .post('/api/budgets/createbudget')
      .set('Authorization', `Bearer ${validToken}`)
      .send(newBudget);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Budget created successfully');
  });
});

describe('PUT /api/budgets/updatebudget/:id', () => {
  it('should update a budget', async () => {
    const budget = await Budget.findOne();
    const res = await request(app)
      .put(`/api/budgets/updatebudget/${budget._id}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({ category: 'Updated Category' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Budget updated');
  });
});

describe('DELETE /api/budgets/deletebudget/:id', () => {
  it('should delete a budget', async () => {
    const budget = await Budget.findOne();
    const res = await request(app)
      .delete(`/api/budgets/deletebudget/${budget._id}`)
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Budget deleted');
  });
});