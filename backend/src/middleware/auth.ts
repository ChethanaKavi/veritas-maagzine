import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient';

// Minimal middleware: verifies Bearer token, checks session not revoked/expired
export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing Authorization' });
    const token = auth.replace('Bearer ', '').trim();
    const secret = process.env.JWT_SECRET || 'dev-secret';

    let payload: any;
    try {
      payload = jwt.verify(token, secret);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // check session exists and not revoked/expired
    const session = await prisma.adminSession.findUnique({ where: { token } }).catch(() => null);
    if (!session) return res.status(401).json({ error: 'Session not found' });
    if (session.revoked) return res.status(401).json({ error: 'Session revoked' });
    if (session.expiresAt && session.expiresAt < new Date()) return res.status(401).json({ error: 'Session expired' });

    // attach admin info to request for downstream handlers
    (req as any).admin = { payload, session };
    next();
  } catch (error) {
    console.error('Auth middleware error', error);
    res.status(500).json({ error: 'Auth middleware failure' });
  }
}
