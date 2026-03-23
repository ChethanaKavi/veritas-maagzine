import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { prisma } from './prismaClient';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
// Serve uploaded/static files from the backend at /uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (req, res) => res.json({ ok: true }));

// Admin login - development helper. In production replace with proper user store.
import authRouter from './routes/auth';
import magazinesRouter from './routes/magazines';
import articlesRouter from './routes/articles';
import advertisementsRouter from './routes/advertisements';
import miscRouter from './routes/misc';
import uploadsRouter from './routes/uploads';
import authMiddleware from './middleware/auth';

// Provide a simple root route so visiting '/' returns a friendly message
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Backend is running. Try /health or /api/* endpoints' });
});

// Mount modular routers at root. Vite dev proxy rewrites `/api/*` -> `/*` when forwarding,
// so keep backend routes rooted at `/` to match requests from the dev server.
app.use('/', authRouter);
app.use('/', magazinesRouter);
app.use('/', articlesRouter);
app.use('/', advertisementsRouter);
app.use('/', miscRouter);
app.use('/', uploadsRouter);

// Example of protecting admin-only API endpoints with middleware
// Use `authMiddleware` on routes that require admin privileges, for example:
// app.use('/api/admin', authMiddleware, adminRouter);

app.get('/articles', async (req, res) => {
  const { published } = req.query;
  try {
    if (published === 'true') {
      const arts = await prisma.article.findMany({
        where: {
          isActive: true,
          isPublished: true,
        },
        include: { views: true, magazine: true },
        orderBy: {
          publishedAt: 'desc',
        },
      });
      res.json(arts);
    } else {
      const arts = await prisma.article.findMany({
        include: { views: true, magazine: true },
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.json(arts);
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'An error occurred while fetching articles' });
  }
});

// Get a single article by ID
app.get('/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: { views: true, magazine: true },
    });
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while fetching the article' });
  }
});

// Create a new article
app.post('/articles', async (req, res) => {
  try {
    const { title, content, coverImgUrl, magazineId, publishedAt } = req.body;
    const publishedDate = publishedAt ? new Date(publishedAt) : null;
    const isPublishedComputed = publishedDate ? publishedDate <= new Date() : false;
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        coverImgUrl,
        magazineId,
        publishedAt: publishedDate,
        isPublished: isPublishedComputed,
      },
      include: { },
    });
    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'An error occurred while creating the article' });
  }
});

// Update an article
app.put('/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { title, content, coverImgUrl, magazineId,  publishedAt } = req.body;
    const publishedDate = publishedAt ? new Date(publishedAt) : null;
    const isPublishedComputed = publishedDate ? publishedDate <= new Date() : false;
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        coverImgUrl,
        magazineId,
        publishedAt: publishedDate,
        isPublished: isPublishedComputed,
      },
      include: { },
    });
    res.json(updatedArticle);
  } catch (error) {
    console.error(`Error updating article ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while updating the article' });
  }
});

// Delete an article (soft delete - set isActive to false)
app.delete('/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        isActive: false,
      },
      include: { },
    });
    res.status(204).send();
  } catch (error) {
    console.error(`Error deactivating article ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while deactivating the article' });
  }
});

// Activate an article
app.post('/articles/:id/activate', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        isActive: true,
      },
      include: { },
    });
    res.json(updatedArticle);
  } catch (error) {
    console.error(`Error activating article ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while activating the article' });
  }
});

// Publish an article
app.post('/articles/:id/publish', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
      include: { },
    });
    res.json(updatedArticle);
  } catch (error) {
    console.error(`Error publishing article ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while publishing the article' });
  }
});

// Advertisement CRUD
app.get('/advertisements', async (req, res) => {
  try {
    const advertisements = await prisma.advertisement.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(advertisements);
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({ error: 'An error occurred while fetching advertisements' });
  }
});

// Placements CRUD
app.get('/placements', async (req, res) => {
  try {
    const placements = await prisma.placement.findMany({ orderBy: { createdAt: 'asc' } });
    res.json(placements);
  } catch (error) {
    console.error('Error fetching placements:', error);
    res.status(500).json({ error: 'An error occurred while fetching placements' });
  }
});

app.post('/placements', async (req, res) => {
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

app.get('/advertisements/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const ad = await prisma.advertisement.findUnique({ where: { id } });
    if (ad) {
      res.json(ad);
    } else {
      res.status(404).json({ error: 'Advertisement not found' });
    }
  } catch (error) {
    console.error(`Error fetching advertisement ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while fetching the advertisement' });
  }
});

app.post('/advertisements', async (req, res) => {
  try {
    const { topic, description, webImage, tabImage, mobileImage, webImageWidth, tabImageWidth, mobileImageWidth, area, link } = req.body;
    const newAd = await prisma.advertisement.create({
      data: {
        topic,
        description,
        webImage,
        tabImage,
        mobileImage,
        webImageWidth,
        tabImageWidth,
        mobileImageWidth,
        area,
        link,
      },
    });
    res.status(201).json(newAd);
  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({ error: 'An error occurred while creating the advertisement' });
  }
});

app.put('/advertisements/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { topic, description, webImage, tabImage, mobileImage, webImageWidth, tabImageWidth, mobileImageWidth, area, link } = req.body;
    const updatedAd = await prisma.advertisement.update({
      where: { id },
      data: {
        topic,
        description,
        webImage,
        tabImage,
        mobileImage,
        webImageWidth,
        tabImageWidth,
        mobileImageWidth,
        area,
        link,
      },
    });
    res.json(updatedAd);
  } catch (error) {
    console.error(`Error updating advertisement ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while updating the advertisement' });
  }
});

app.delete('/advertisements/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.advertisement.update({
      where: { id },
      data: { active: false },
    });
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting advertisement ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while deleting the advertisement' });
  }
});

app.post('/advertisements/:id/activate', async (req, res) => {
  const { id } = req.params;
  try {
    const activatedAd = await prisma.advertisement.update({
      where: { id },
      data: { active: true },
    });
    res.json(activatedAd);
  } catch (error) {
    console.error(`Error activating advertisement ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while activating the advertisement' });
  }
});

// Dashboard Stats
app.get('/dashboard-stats', async (req, res) => {
  try {
    const totalMagazines = await prisma.magazine.count();
    const totalArticles = await prisma.article.count();
    const totalViews = await prisma.article.aggregate({
      _sum: {
        viewCount: true,
      },
    });

    const recentArticles = await prisma.article.findMany({
      take: 5,
      orderBy: {
        publishedAt: 'desc',
      },
      include: {
        magazine: true,
      },
    });

    const recentMagazines = await prisma.magazine.findMany({
      take: 5,
      orderBy: {
        publishedAt: 'desc',
      },
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

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
