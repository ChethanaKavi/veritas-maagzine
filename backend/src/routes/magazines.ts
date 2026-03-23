import { Router } from 'express';
import { prisma } from '../prismaClient';

const router = Router();

router.get('/magazines', async (req, res) => {
  const { published } = req.query;
  try {
    if (published === 'true') {
      const magazines = await prisma.magazine.findMany({
        where: { isActive: true, isPublished: true },
        orderBy: { publishedAt: 'desc' },
      });
      return res.json(magazines);
    }
    const magazines = await prisma.magazine.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(magazines);
  } catch (error) {
    console.error('Error fetching magazines:', error);
    res.status(500).json({ error: 'An error occurred while fetching magazines' });
  }
});

router.get('/magazines/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const magazine = await prisma.magazine.findUnique({ where: { id } });
    if (magazine) return res.json(magazine);
    return res.status(404).json({ error: 'Magazine not found' });
  } catch (error) {
    console.error(`Error fetching magazine ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while fetching the magazine' });
  }
});

router.post('/magazines', async (req, res) => {
  try {
    const { title, description, coverImage, publishedAt } = req.body;
    const publishedDate = publishedAt ? new Date(publishedAt) : null;
    const isPublishedComputed = publishedDate ? publishedDate <= new Date() : false;
    const newMagazine = await prisma.magazine.create({
      data: { title, description, coverImage, publishedAt: publishedDate, isPublished: isPublishedComputed },
    });
    res.status(201).json(newMagazine);
  } catch (error) {
    console.error('Error creating magazine:', error);
    res.status(500).json({ error: 'An error occurred while creating the magazine' });
  }
});

router.put('/magazines/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { title, description, coverImage, publishedAt } = req.body;
    const publishedDate = publishedAt ? new Date(publishedAt) : null;
    const isPublishedComputed = publishedDate ? publishedDate <= new Date() : false;
    const updatedMagazine = await prisma.magazine.update({
      where: { id },
      data: { title, description, coverImage, publishedAt: publishedDate, isPublished: isPublishedComputed },
    });
    res.json(updatedMagazine);
  } catch (error) {
    console.error(`Error updating magazine ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while updating the magazine' });
  }
});

router.delete('/magazines/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.magazine.update({ where: { id }, data: { isActive: false } });
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting magazine ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while deleting the magazine' });
  }
});

router.post('/magazines/:id/activate', async (req, res) => {
  const { id } = req.params;
  try {
    const activatedMagazine = await prisma.magazine.update({ where: { id }, data: { isActive: true } });
    res.json(activatedMagazine);
  } catch (error) {
    console.error(`Error activating magazine ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while activating the magazine' });
  }
});

router.get('/magazines/:magazineId/articles', async (req, res) => {
  const { magazineId } = req.params;
  try {
    const articles = await prisma.article.findMany({
      where: { magazineId, isActive: true, isPublished: true },
      include: { views: true, magazine: true },
      orderBy: { publishedAt: 'desc' },
    });
    res.json(articles);
  } catch (error) {
    console.error(`Error fetching articles for magazine ${magazineId}:`, error);
    res.status(500).json({ error: 'An error occurred while fetching articles for the magazine' });
  }
});

export default router;
