import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from "pg"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role: role || 'user' },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered', token });
  } catch (error) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;