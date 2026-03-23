import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient';

const router = Router();

router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body || {};
  const DEV_USER = process.env.DEV_ADMIN_USER || 'admin';
  const DEV_PASS = process.env.DEV_ADMIN_PASS || 'admin123';
  if (username === DEV_USER && password === DEV_PASS) {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const expiresIn = '7d';
    const token = jwt.sign({ sub: username, role: 'admin' }, secret, { expiresIn });

    // persist session to database with expiry
    try {
      const now = Date.now();
      const expiresAt = new Date(now + 7 * 24 * 60 * 60 * 1000);
      const adminUser = await prisma.adminUser.findUnique({ where: { username: DEV_USER } }).catch(() => null);
      await prisma.adminSession.create({
        data: {
          token,
          adminUserId: adminUser ? adminUser.id : undefined,
          expiresAt,
        },
      }).catch((e) => console.error('Failed to persist admin session', e));
    } catch (e) {
      console.error('Error creating admin session', e);
    }

    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

export default router;
