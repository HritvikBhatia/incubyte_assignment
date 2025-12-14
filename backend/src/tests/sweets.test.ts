// backend/src/tests/sweets.test.ts
import request from 'supertest';
import app from '../index';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Helper to generate tokens
const generateToken = (role: string) => {
  return jwt.sign({ userId: 1, role }, JWT_SECRET);
};

describe('Sweets API', () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    adminToken = generateToken('admin');
    userToken = generateToken('user');
    
    // Seed a sweet for testing
    await prisma.sweet.deleteMany();
    await prisma.sweet.create({
      data: { id: 1, name: 'Chocolate Bar', category: 'Choco', price: 2.5, quantity: 10 }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Requirement: GET /api/sweets [cite: 17]
  it('GET /api/sweets - should return all sweets', async () => {
    const res = await request(app).get('/api/sweets');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // Requirement: POST /api/sweets (Admin only) [cite: 16]
  it('POST /api/sweets - should fail for non-admins', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Candy', category: 'Hard', price: 1, quantity: 50 });
    expect(res.statusCode).toEqual(403);
  });

  it('POST /api/sweets - should succeed for admins', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Lollipop', category: 'Hard', price: 0.5, quantity: 100 });
    expect(res.statusCode).toEqual(201);
  });

  // Requirement: PUT /api/sweets/:id [cite: 19]
  it('PUT /api/sweets/:id - should update sweet details', async () => {
    const res = await request(app)
      .put('/api/sweets/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 3.0 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.price).toEqual(3.0);
  });

  // Requirement: Purchase Logic [cite: 22]
  it('POST /api/sweets/:id/purchase - should decrease quantity', async () => {
    const res = await request(app)
      .post('/api/sweets/1/purchase')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    // Check DB to verify quantity dropped from 10 to 9
    const sweet = await prisma.sweet.findUnique({ where: { id: 1 }});
    expect(sweet?.quantity).toEqual(9);
  });
  
  // Requirement: Restock Logic (Admin only) [cite: 23]
  it('POST /api/sweets/:id/restock - should increase quantity', async () => {
    const res = await request(app)
      .post('/api/sweets/1/restock')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });
      
    expect(res.statusCode).toEqual(200);
    const sweet = await prisma.sweet.findUnique({ where: { id: 1 }});
    expect(sweet?.quantity).toEqual(14); // 9 + 5
  });
});