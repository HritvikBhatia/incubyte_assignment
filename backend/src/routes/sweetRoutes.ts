import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/sweets - List & Search
router.get('/', async (req, res) => {
  const { search } = req.query;
  const where: any = {};
  
  if (search) {
    where.OR = [
      { name: { contains: String(search) } },
      { category: { contains: String(search) } }
    ];
  }
  
  const sweets = await prisma.sweet.findMany({ where });
  res.json(sweets);
});

// POST /api/sweets - Create 
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  const { name, category, price, quantity } = req.body;
  const sweet = await prisma.sweet.create({
    data: { name, category, price: parseFloat(price), quantity: parseInt(quantity) }
  });
  res.status(201).json(sweet);
});

// PUT /api/sweets/:id - Update
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, category, price } = req.body;
  
  try {
    const updated = await prisma.sweet.update({
      where: { id: Number(id) },
      data: { name, category, price: price ? parseFloat(price) : undefined }
    });
    res.json(updated);
  } catch (e) {
    res.status(404).json({ error: 'Sweet not found' });
  }
});

// DELETE /api/sweets/:id - Delete (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    await prisma.sweet.delete({ where: { id: Number(id) } });
    res.json({ message: 'Sweet deleted' });
  } catch (e) {
    res.status(404).json({ error: 'Sweet not found' });
  }
});

// POST /api/sweets/:id/purchase - Decrease Stock
router.post('/:id/purchase', authenticateToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const sweet = await prisma.sweet.findUnique({ where: { id: Number(id) }});
    
    if (!sweet || sweet.quantity <= 0) {
      return res.status(400).json({ error: 'Out of stock' });
    }

    const updated = await prisma.sweet.update({
      where: { id: Number(id) },
      data: { quantity: sweet.quantity - 1 }
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Purchase failed' });
  }
});

// POST /api/sweets/:id/restock - Increase Stock (Admin)
router.post('/:id/restock', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { quantity } = req.body; // Amount to add
  
  try {
    const sweet = await prisma.sweet.update({
      where: { id: Number(id) },
      data: { quantity: { increment: parseInt(quantity) } }
    });
    res.json(sweet);
  } catch (e) {
    res.status(500).json({ error: 'Restock failed' });
  }
});

export default router;