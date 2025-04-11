const mongoose = require('mongoose');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/index');
const User = require('../../src/models/userModel');
const Budget = require('../../src/models/budgetModel');
const Transaction = require('../../src/models/transactionModel');

describe('Transaction Tests', () => {
  let user;
  let token;
  let budget;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }, 30000);

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {

    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      role: 'user'
    });

    budget = await Budget.create({
      userId: user._id,
      amount: 1000,
      currentSpending: 0,
      category: 'General',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });


    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }, 10000);

  afterEach(async () => {
    await User.deleteMany({});
    await Budget.deleteMany({});
    await Transaction.deleteMany({});
  });

  describe('Transaction Model', () => {
    it('should create and save a transaction successfully', async () => {
      const transactionData = {
        userId: user._id,
        title: 'Test Transaction',
        amount: 100,
        currency: 'USD',
        type: 'expense',
        category: 'Food',
        tag: 'groceries',
        date: new Date()
      };

      const validTransaction = new Transaction(transactionData);
      const savedTransaction = await validTransaction.save();

      expect(savedTransaction._id).toBeDefined();
      expect(savedTransaction.title).toBe(transactionData.title);
      expect(savedTransaction.amount).toBe(transactionData.amount);
      expect(savedTransaction.type).toBe(transactionData.type);
    });

    it('should fail when required fields are missing', async () => {
      const transactionData = {
        userId: user._id,

        amount: 100,
        type: 'expense'
      };

      const invalidTransaction = new Transaction(transactionData);
      let error;
      try {
        await invalidTransaction.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.title).toBeDefined();
    });
  });

  describe('Transaction API Endpoints', () => {
    it('POST /api/transactions/createtransaction - should create transaction and update budget (income)', async () => {
      const response = await request(app)
        .post('/api/transactions/createtransaction')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Salary',
          amount: 2000,
          currency: 'USD',
          type: 'income',
          category: 'Salary',
          tag: 'income',
          date: new Date()
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Transaction created successfully');


      const transaction = await Transaction.findOne({ userId: user._id });
      expect(transaction).toBeTruthy();


      const updatedBudget = await Budget.findById(budget._id);
      expect(updatedBudget.amount).toBe(1000 + 2000);
    });

    it('POST /api/transactions/createtransaction - should create transaction and update budget (expense)', async () => {
      const response = await request(app)
        .post('/api/transactions/createtransaction')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Groceries',
          amount: 150,
          currency: 'USD',
          type: 'expense',
          category: 'Food',
          tag: 'groceries',
          date: new Date()
        });

      expect(response.statusCode).toBe(201);

      const updatedBudget = await Budget.findById(budget._id);
      expect(updatedBudget.currentSpending).toBe(150);
    });

    it('POST /api/transactions/createtransaction - should handle missing user', async () => {
      await User.deleteMany({});

      const response = await request(app)
        .post('/api/transactions/createtransaction')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test',
          amount: 100,
          type: 'expense'
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('POST /api/transactions/createtransaction - should validate required fields', async () => {
      const response = await request(app)
        .post('/api/transactions/createtransaction')
        .set('Authorization', `Bearer ${token}`)
        .send({

          type: 'expense'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: 'title' }),
          expect.objectContaining({ path: 'amount' })
        ])
      );
    });

    it('POST /api/transactions/createtransaction - should handle unauthorized access', async () => {
      const response = await request(app)
        .post('/api/transactions/createtransaction')
        .send({
          title: 'Test',
          amount: 100,
          type: 'expense'
        });

      expect(response.statusCode).toBe(401);
    });
  });
});