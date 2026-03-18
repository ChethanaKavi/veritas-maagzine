import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  let mag1 = await prisma.magazine.findFirst({ where: { title: 'Tech Innovator' } });
  if (!mag1) {
    mag1 = await prisma.magazine.create({ 
      data: { 
        title: 'Tech Innovator', 
        description: 'Exploring the latest technological breakthroughs and innovations shaping our digital future. From AI to quantum computing, we cover it all.',
        coverImage: 'https://picsum.photos/seed/tech/400/600',
        publishedAt: new Date('2026-03-10'),
        isPublished: true,
        isActive: true
      } 
    });
  }

  let mag2 = await prisma.magazine.findFirst({ where: { title: 'Fashion Forward' } });
  if (!mag2) {
    mag2 = await prisma.magazine.create({ 
      data: { 
        title: 'Fashion Forward', 
        description: 'Latest trends and style insights from the fashion world.',
        coverImage: 'https://picsum.photos/seed/fashion/400/600',
        publishedAt: new Date('2026-02-15'),
        isPublished: true,
        isActive: true
      } 
    });
  }

  // Articles for Tech Innovator
  const articleTitles1 = [
    { title: 'The Future of AI: Beyond Machine Learning', content: '<h2>Introduction</h2><p>Artificial Intelligence has come a long way from simple rule-based systems.</p>', viewCount: 1234 },
    { title: 'Quantum Computing: The Next Revolution', content: '<h2>Understanding Quantum Computing</h2><p>Unlike classical computers that use bits, quantum computers use qubits.</p>', viewCount: 876 },
    { title: 'Sustainable Tech: Green Innovation for Tomorrow', content: '<h2>The Environmental Challenge</h2><p>The tech industry is transforming how it operates.</p>', viewCount: 654 },
  ];
  for (const art of articleTitles1) {
    const exists = await prisma.article.findFirst({ where: { title: art.title } });
    if (!exists) {
      const a = await prisma.article.create({
        data: {
          title: art.title,
          content: art.content,
          magazineId: mag1.id,
          publishedAt: new Date('2026-03-10'),
          isPublished: true,
          isActive: true,
          viewCount: art.viewCount,
        }
      });
      await prisma.articleView.create({ data: { articleId: a.id, views: art.viewCount, viewsAt: new Date() } });
    }
  }

  // Articles for Fashion Forward
  const articleTitles2 = [
    { title: 'Spring 2026 Runway Highlights', content: '<h2>The Season\'s Defining Trends</h2><p>Spring 2026 runways revealed bold creative expression.</p>', viewCount: 543 },
    { title: 'The Rise of Digital Fashion', content: '<h2>Fashion Meets Technology</h2><p>Digital fashion is reshaping how we think about clothing.</p>', viewCount: 421 },
    { title: 'Timeless Wardrobe Essentials', content: '<h2>The Case for Timeless Fashion</h2><p>Investing in timeless pieces is both economical and responsible.</p>', viewCount: 389 },
  ];
  for (const art of articleTitles2) {
    const exists = await prisma.article.findFirst({ where: { title: art.title } });
    if (!exists) {
      const a = await prisma.article.create({
        data: {
          title: art.title,
          content: art.content,
          magazineId: mag2.id,
          publishedAt: new Date('2026-02-15'),
          isPublished: true,
          isActive: true,
          viewCount: art.viewCount,
        }
      });
      await prisma.articleView.create({ data: { articleId: a.id, views: art.viewCount, viewsAt: new Date() } });
    }
  }

  await prisma.advertisement.create({
    data: {
      topic: 'Launch Ad',
      description: 'Ad for the new launch',
      area: 'sidebar',
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
