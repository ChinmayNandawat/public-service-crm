import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: { email: { contains: 'test' } }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/register', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        password: 'password123',
        role: 'citizen'
      };

      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User registered successfully.');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned

      // Verify password is hashed in database
      const user = await prisma.user.findUnique({
        where: { email: userData.email }
      });
      expect(user).toBeTruthy();
      expect(user!.password).not.toBe(userData.password);
      
      const isPasswordHashed = await bcrypt.compare(userData.password, user!.password);
      expect(isPasswordHashed).toBe(true);
    });

    it('should not create user with invalid role', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        password: 'password123',
        role: 'invalid_role'
      };

      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Invalid role.');
    });

    it('should not create user with duplicate email', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        password: 'password123',
        role: 'citizen'
      };

      // Create first user
      await request(app)
        .post('/api/register')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('User with this email already exists.');
    });
  });

  describe('POST /api/login', () => {
    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
          password: hashedPassword,
          role: 'citizen'
        }
      });
    });

    it('should login and return valid token', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Login successful.');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.user.password).toBeUndefined();

      // Verify token contains correct user data
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET!) as any;
      expect(decoded.id).toBeDefined();
      expect(decoded.role).toBe('citizen');
    });

    it('should not login with wrong password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials.');
    });

    it('should not login with non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials.');
    });
  });

  describe('GET /api/me', () => {
    let token: string;
    let userId: number;

    beforeEach(async () => {
      // Create a test user and get token
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await prisma.user.create({
        data: {
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
          password: hashedPassword,
          role: 'citizen'
        }
      });

      userId = user.id;
      token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );
    });

    it('should return current user with valid token', async () => {
      const response = await request(app)
        .get('/api/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.user.id).toBe(userId);
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.password).toBeUndefined();
    });

    it('should not return user without token', async () => {
      const response = await request(app)
        .get('/api/me')
        .expect(401);

      expect(response.body.error).toBe('Access denied. No token provided.');
    });

    it('should not return user with invalid token', async () => {
      const response = await request(app)
        .get('/api/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.error).toBe('Invalid token.');
    });
  });
});
