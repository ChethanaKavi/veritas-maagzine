import { Router } from 'express';
import { prisma } from '../prismaClient';

const router = Router();

router.get('/articles', async (req, res) => {
  const { published } = req.query;
  try {
    if (published === 'true') {
      const arts = await prisma.article.findMany({
        where: { isActive: true, isPublished: true },
        include: { views: true, magazine: true },
        orderBy: { publishedAt: 'desc' },
      });
      return res.json(arts);
    }
    const arts = await prisma.article.findMany({ include: { views: true, magazine: true }, orderBy: { createdAt: 'desc' } });
    res.json(arts);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'An error occurred while fetching articles' });
  }
});

router.get('/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const article = await prisma.article.findUnique({ where: { id }, include: { views: true, magazine: true } });
    if (article) return res.json(article);
    return res.status(404).json({ error: 'Article not found' });
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while fetching the article' });
  }
});

router.post('/articles', async (req, res) => {
  try {
    const { title, content, coverImgUrl, magazineId, publishedAt } = req.body;
    const publishedDate = publishedAt ? new Date(publishedAt) : null;
    const isPublishedComputed = publishedDate ? publishedDate <= new Date() : false;
    const newArticle = await prisma.article.create({ data: { title, content, coverImgUrl, magazineId, publishedAt: publishedDate, isPublished: isPublishedComputed }, include: { magazine: true, views: true } });
    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'An error occurred while creating the article' });
  }
});

router.put('/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { title, content, coverImgUrl, magazineId, publishedAt } = req.body;
    const publishedDate = publishedAt ? new Date(publishedAt) : null;
    const isPublishedComputed = publishedDate ? publishedDate <= new Date() : false;
    const updatedArticle = await prisma.article.update({ where: { id }, data: { title, content, coverImgUrl, magazineId, publishedAt: publishedDate, isPublished: isPublishedComputed }, include: { magazine: true, views: true } });
    res.json(updatedArticle);
  } catch (error) {
    console.error(`Error updating article ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while updating the article' });
  }
});

router.delete('/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.article.update({ where: { id }, data: { isActive: false } });
    res.status(204).send();
  } catch (error) {
    console.error(`Error deactivating article ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while deactivating the article' });
  }
});

router.post('/articles/:id/activate', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedArticle = await prisma.article.update({ where: { id }, data: { isActive: true }, include: { magazine: true, views: true } });
    res.json(updatedArticle);
  } catch (error) {
    console.error(`Error activating article ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while activating the article' });
  }
});

router.post('/articles/:id/publish', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedArticle = await prisma.article.update({ where: { id }, data: { isPublished: true, publishedAt: new Date() } });
    res.json(updatedArticle);
  } catch (error) {
    console.error(`Error publishing article ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while publishing the article' });
  }
});

export default router;
