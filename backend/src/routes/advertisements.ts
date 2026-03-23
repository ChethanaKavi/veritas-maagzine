import { Router } from 'express';
import { prisma } from '../prismaClient';

const router = Router();

// Advertisements
router.get('/advertisements', async (req, res) => {
  try {
    const advertisements = await prisma.advertisement.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(advertisements);
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({ error: 'An error occurred while fetching advertisements' });
  }
});

router.get('/advertisements/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const ad = await prisma.advertisement.findUnique({ where: { id } });
    if (ad) return res.json(ad);
    return res.status(404).json({ error: 'Advertisement not found' });
  } catch (error) {
    console.error(`Error fetching advertisement ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while fetching the advertisement' });
  }
});

router.post('/advertisements', async (req, res) => {
  try {
    const { topic, description, webImage, tabImage, mobileImage, webImageWidth, tabImageWidth, mobileImageWidth, area, link } = req.body;
    const newAd = await prisma.advertisement.create({ data: { topic, description, webImage, tabImage, mobileImage, webImageWidth, tabImageWidth, mobileImageWidth, area, link } });
    res.status(201).json(newAd);
  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({ error: 'An error occurred while creating the advertisement' });
  }
});

router.put('/advertisements/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { topic, description, webImage, tabImage, mobileImage, webImageWidth, tabImageWidth, mobileImageWidth, area, link } = req.body;
    const updatedAd = await prisma.advertisement.update({ where: { id }, data: { topic, description, webImage, tabImage, mobileImage, webImageWidth, tabImageWidth, mobileImageWidth, area, link } });
    res.json(updatedAd);
  } catch (error) {
    console.error(`Error updating advertisement ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while updating the advertisement' });
  }
});

router.delete('/advertisements/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.advertisement.update({ where: { id }, data: { active: false } });
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting advertisement ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while deleting the advertisement' });
  }
});

router.post('/advertisements/:id/activate', async (req, res) => {
  const { id } = req.params;
  try {
    const activatedAd = await prisma.advertisement.update({ where: { id }, data: { active: true } });
    res.json(activatedAd);
  } catch (error) {
    console.error(`Error activating advertisement ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while activating the advertisement' });
  }
});

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

export default router;
