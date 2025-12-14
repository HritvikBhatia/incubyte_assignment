import request from 'supertest';
import app from '../index';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Helper to generate tokens
const generateToken = (role: string) => {
  return jwt.sign({ userId: 1, role }, JWT_SECRET);
};

describe('Sweets API - Admin Operations', () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    adminToken = generateToken('admin');
    userToken = generateToken('user');
    
    // Clear database
    await prisma.sweet.deleteMany();

    // Seed Sweet #1 for Restock Test
    await prisma.sweet.create({
      data: { id: 1, name: 'Restock Sweet', category: 'Test', price: 10, quantity: 5 }
    });

    // Seed Sweet #2 for Delete Test
    await prisma.sweet.create({
      data: { id: 2, name: 'Delete Sweet', category: 'Test', price: 10, quantity: 5 }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Requirement: Restock a sweet, increasing its quantity (Admin only)
  describe('POST /api/sweets/:id/restock', () => {
    it('should fail for non-admins', async () => {
      const res = await request(app)
        .post('/api/sweets/1/restock')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });
      expect(res.statusCode).toEqual(403);
    });

    it('should increase quantity for admins', async () => {
      const res = await request(app)
        .post('/api/sweets/1/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });
      
      expect(res.statusCode).toEqual(200);
      
      // Verify database update
      const sweet = await prisma.sweet.findUnique({ where: { id: 1 }});
      expect(sweet?.quantity).toEqual(10); // 5 (initial) + 5 (added)
    });
  });

  // Requirement: Delete a sweet (Admin only)
  describe('DELETE /api/sweets/:id', () => {
    it('should fail for non-admins', async () => {
      const res = await request(app)
        .delete('/api/sweets/2')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
    });

    it('should delete the sweet for admins', async () => {
      const res = await request(app)
        .delete('/api/sweets/2')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.statusCode).toEqual(200);
      
      // Verify deletion in database
      const sweet = await prisma.sweet.findUnique({ where: { id: 2 }});
      expect(sweet).toBeNull();
    });
  });
});