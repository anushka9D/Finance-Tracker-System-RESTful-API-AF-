const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const app = require("../../src/index"); 
const User = require("../../src/models/userModel");


describe('User Authentication', () => {

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });


    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    password: 'testpass',
                    role: 'user'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully');

            const user = await User.findOne({ username: 'testuser' });
            expect(user).toBeTruthy();
            expect(user.role).toBe('user');
        });

        it('should prevent duplicate usernames', async () => {
            await request(app)
                .post('/api/auth/register')
                .send({ username: 'testuser', password: 'testpass', role: 'user' });

            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'testuser', password: 'testpass', role: 'user' });

            expect(res.statusCode).toEqual(500);
            expect(res.body.error).toMatch(/duplicate key error/);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({ username: 'testuser', password: 'testpass', role: 'user' });
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'testuser', password: 'testpass' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should reject invalid password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'testuser', password: 'wrongpass' });

            expect(res.statusCode).toEqual(404);
            expect(res.body.error).toBe('Invalid username or password');
        });
    });

    let token;


    jest.setTimeout(10000);

    beforeAll(async () => {
        console.log("Connecting to the database...");
        try {
            const admin = await userModel.create({
                username: 'admin@gmail.com',
                password: 'password123',
                role: 'admin',
            });

            token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log("Admin user created and token generated.");
        } catch (error) {
            console.error("Error creating admin user:", error);
        }
    });

    describe('GET /api/auth/getusers', () => {
    
        it('should fetch all users successfully when the user is admin', async () => {
            const res = await request(app)
                .get('/api/auth/getusers')
                .set('Authorization', `Bearer ${token}`);
    
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf('all users');
            expect(Array.isArray(res.body.allUsers)).toBeTruthy();
        });
    
        it('should return 401 if no token is provided', async () => {
            const res = await request(app)
                .get('/api/users/getallusers')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(500);
            expect(res.body.message).toEqual('couldnt fetch all the users');
            expect(res.body.error).toEqual('Database failure');
        });
    });
    
    
    describe('PUT /api/users/:id', () => {
        let userId;
        let token;
    

        beforeAll(async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'testuser', password: 'testpass', role: 'user' });
    
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ username: 'testuser', password: 'testpass' });
    
            token = loginRes.body.token;
    
            const user = await User.findOne({ username: 'testuser' });
            userId = user._id;
        });
    
        it('should update a user with valid data', async () => {
            const updatedData = {
                username: 'updateduser',
                role: 'admin'
            };
    
            const res = await request(app)
                .put(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);
    
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('User updated successfully');
    

            const updatedUser = await User.findById(userId);
            expect(updatedUser.username).toBe(updatedData.username);
            expect(updatedUser.role).toBe(updatedData.role);
        });
    
        it('should return 401 if no token is provided', async () => {
            const updatedData = {
                username: 'updateduser',
                role: 'admin'
            };
    
            const res = await request(app)
                .put(`/api/users/${userId}`)
                .send(updatedData);
    
            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toBe('Authorization required');
        });
    });
    
    
    
    describe('DELETE /api/users/:id', () => {
        let userId;
        let token;
    
        beforeAll(async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'testuser', password: 'testpass', role: 'user' });
    
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({ username: 'testuser', password: 'testpass' });
    
            token = loginRes.body.token;
    
            const user = await User.findOne({ username: 'testuser' });
            userId = user._id;
        });
    
        it('should delete a user with valid token', async () => {
            const res = await request(app)
                .delete(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);
    
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('User deleted successfully');
    

            const deletedUser = await User.findById(userId);
            expect(deletedUser).toBeNull();
        });
    
        it('should return 401 if no token is provided', async () => {
            const res = await request(app)
                .delete(`/api/users/${userId}`);
    
            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toBe('Authorization required');
        });
    });
    

});


