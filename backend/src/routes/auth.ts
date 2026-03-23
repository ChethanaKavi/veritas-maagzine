import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../prismaClient';

const router = Router();

router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user in database
    const adminUser = await prisma.adminUser.findUnique({ 
      where: { username } 
    });

    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, adminUser.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const expiresIn = '10m';
    const token = jwt.sign({ sub: username, userId: adminUser.id, role: adminUser.role }, secret, { expiresIn });

    // Persist session to database with expiry
    try {
      const now = Date.now();
      const expiresAt = new Date(now + 10 * 60 * 1000); // 10 minutes
      
      await prisma.adminSession.create({
        data: {
          token,
          adminUserId: adminUser.id,
          expiresAt,
        },
      });

      // Update last login
      await prisma.adminUser.update({
        where: { id: adminUser.id },
        data: { lastLogin: new Date() },
      });

      console.log(`✓ Admin user '${username}' logged in`);
    } catch (e) {
      console.error('Failed to persist admin session', e);
    }

    return res.json({ token, user: { username: adminUser.username, email: adminUser.email, role: adminUser.role } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Refresh token endpoint
router.post('/admin/refresh-token', async (req, res) => {
  try {
    const { token: oldToken } = req.body;

    if (!oldToken) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const secret = process.env.JWT_SECRET || 'dev-secret';

    // Verify old token (even if expired, we use ignoreExpiration)
    let payload: any;
    try {
      payload = jwt.verify(oldToken, secret, { ignoreExpiration: true });
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Find the user
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: payload.userId }
    });

    if (!adminUser) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check if old session exists and not revoked
    const oldSession = await prisma.adminSession.findUnique({ 
      where: { token: oldToken } 
    }).catch(() => null);

    if (oldSession?.revoked) {
      return res.status(401).json({ error: 'Session was revoked' });
    }

    // Revoke old session
    if (oldSession) {
      await prisma.adminSession.update({
        where: { token: oldToken },
        data: { revoked: true }
      }).catch(() => {});
    }

    // Generate new token
    const expiresIn = '10m';
    const newToken = jwt.sign({ sub: adminUser.username, userId: adminUser.id, role: adminUser.role }, secret, { expiresIn });

    // Create new session
    const now = Date.now();
    const expiresAt = new Date(now + 10 * 60 * 1000); // 10 minutes

    await prisma.adminSession.create({
      data: {
        token: newToken,
        adminUserId: adminUser.id,
        expiresAt,
      },
    });

    console.log(`✓ Token refreshed for user '${adminUser.username}'`);
    return res.json({ token: newToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({ error: 'An error occurred during token refresh' });
  }
});

export default router;
