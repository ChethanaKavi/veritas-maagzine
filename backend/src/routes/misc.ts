import { Router } from 'express';
import { prisma } from '../prismaClient';

const router = Router();

// Placements
router.get('/placements', async (req, res) => {
  try {
    const placements = await prisma.placement.findMany({ orderBy: { createdAt: 'asc' } });
    res.json(placements);
  } catch (error) {
    console.error('Error fetching placements:', error);
    res.status(500).json({ error: 'An error occurred while fetching placements' });
  }
});

router.post('/placements', async (req, res) => {
  try {
    const { value, label } = req.body;
    if (!value || !label) return res.status(400).json({ error: 'value and label are required' });
    const existing = await prisma.placement.findUnique({ where: { value } });
    if (existing) return res.status(409).json({ error: 'Placement already exists' });
    const placement = await prisma.placement.create({ data: { value, label } });
    res.status(201).json(placement);
  } catch (error) {
    console.error('Error creating placement:', error);
    res.status(500).json({ error: 'An error occurred while creating placement' });
  }
});

// Dashboard Stats (admin)
router.get('/dashboard-stats', async (req, res) => {
  try {
    const totalMagazines = await prisma.magazine.count();
    const totalArticles = await prisma.article.count();
    const totalViews = await prisma.article.aggregate({
      _sum: { viewCount: true },
    });

    const recentArticles = await prisma.article.findMany({
      take: 5,
      orderBy: { publishedAt: 'desc' },
      include: { magazine: true },
    });

    const recentMagazines = await prisma.magazine.findMany({
      take: 5,
      orderBy: { publishedAt: 'desc' },
    });

    res.json({
      totalMagazines,
      totalArticles,
      totalViews: totalViews._sum.viewCount || 0,
      recentArticles,
      recentMagazines,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'An error occurred while fetching dashboard stats' });
  }
});

export default router;
