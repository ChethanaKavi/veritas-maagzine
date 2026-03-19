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

// Provide a simple root route so visiting '/' returns a friendly message
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Backend is running. Try /health, /magazines or /articles' });
});

// Get all magazines
app.get('/magazines', async (req, res) => {
  const { published } = req.query;
  try {
    if (published === 'true') {
      const magazines = await prisma.magazine.findMany({
        where: {
          isActive: true,
          isPublished: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });
      res.json(magazines);
    } else {
      const magazines = await prisma.magazine.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      res.json(magazines);
    }
  } catch (error) {
    console.error('Error fetching magazines:', error);
    res.status(500).json({ error: 'An error occurred while fetching magazines' });
  }
});

// Get a single magazine by ID
app.get('/magazines/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const magazine = await prisma.magazine.findUnique({
      where: { id },
    });
    if (magazine) {
      res.json(magazine);
    } else {
      res.status(404).json({ error: 'Magazine not found' });
    }
  } catch (error) {
    console.error(`Error fetching magazine ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while fetching the magazine' });
  }
});

// Create a new magazine
app.post('/magazines', async (req, res) => {
  try {
    const { title, description, coverImage, publishedAt } = req.body;
    const publishedDate = publishedAt ? new Date(publishedAt) : null;
    const isPublishedComputed = publishedDate ? publishedDate <= new Date() : false;
    const newMagazine = await prisma.magazine.create({
      data: {
        title,
        description,
        coverImage,
        publishedAt: publishedDate,
        isPublished: isPublishedComputed,
      },
    });
    res.status(201).json(newMagazine);
  } catch (error) {
    console.error('Error creating magazine:', error);
    res.status(500).json({ error: 'An error occurred while creating the magazine' });
  }
});

// Update a magazine
app.put('/magazines/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { title, description, coverImage, publishedAt } = req.body;
    const publishedDate = publishedAt ? new Date(publishedAt) : null;
    const isPublishedComputed = publishedDate ? publishedDate <= new Date() : false;
    const updatedMagazine = await prisma.magazine.update({
      where: { id },
      data: {
        title,
        description,
        coverImage,
        publishedAt: publishedDate,
        isPublished: isPublishedComputed,
      },
    });
    res.json(updatedMagazine);
  } catch (error) {
    console.error(`Error updating magazine ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while updating the magazine' });
  }
});

// Soft delete a magazine
app.delete('/magazines/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.magazine.update({
      where: { id },
      data: { isActive: false },
    });
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting magazine ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while deleting the magazine' });
  }
});

// Activate a magazine
app.post('/magazines/:id/activate', async (req, res) => {
  const { id } = req.params;
  try {
    const activatedMagazine = await prisma.magazine.update({
      where: { id },
      data: { isActive: true },
    });
    res.json(activatedMagazine);
  } catch (error) {
    console.error(`Error activating magazine ${id}:`, error);
    res.status(500).json({ error: 'An error occurred while activating the magazine' });
  }
});

// Get articles for a specific magazine
app.get('/magazines/:magazineId/articles', async (req, res) => {
  const { magazineId } = req.params;
  try {
    const articles = await prisma.article.findMany({
      where: {
        magazineId: magazineId,
        isActive: true,
        isPublished: true,
      },
      include: { views: true, magazine: true },
      orderBy: {
        publishedAt: 'desc',
      },
    });
    res.json(articles);
  } catch (error) {
    console.error(`Error fetching articles for magazine ${magazineId}:`, error);
    res.status(500).json({ error: 'An error occurred while fetching articles for the magazine' });
  }
});

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

// Track an article view — increments viewCount in DB and logs to ArticleView table
app.post('/articles/:id/view', async (req, res) => {
  const { id } = req.params;
  try {
    const [articleView, article] = await prisma.$transaction([
      prisma.articleView.create({
        data: { articleId: id },
      }),
      prisma.article.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
        select: { id: true, title: true, viewCount: true },
      }),
    ]);
    console.log(`[VIEW] Article "${article.title}" | total views: ${article.viewCount}`);
    res.json({ viewCount: article.viewCount, logId: articleView.id });
  } catch (error) {
    console.error(`Error tracking article view ${id}:`, error);
    res.status(500).json({ error: 'Failed to track article view' });
  }
});

// Track a magazine view — increments viewCount in DB
app.post('/magazines/:id/view', async (req, res) => {
  const { id } = req.params;
  try {
    // viewCount is nullable — safely coalesce to 0 before incrementing
    const current = await prisma.magazine.findUnique({ where: { id }, select: { viewCount: true, title: true } });
    if (!current) return res.status(404).json({ error: 'Magazine not found' });
    const newCount = (current.viewCount ?? 0) + 1;
    const magazine = await prisma.magazine.update({
      where: { id },
      data: { viewCount: newCount },
      select: { id: true, title: true, viewCount: true },
    });
    console.log(`[VIEW] Magazine "${magazine.title}" | total views: ${magazine.viewCount}`);
    res.json({ viewCount: magazine.viewCount });
  } catch (error) {
    console.error(`Error tracking magazine view ${id}:`, error);
    res.status(500).json({ error: 'Failed to track magazine view' });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
