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
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=600&fit=crop',
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
        coverImage: 'https://images.unsplash.com/photo-1595898657035-fe75002e9bbb?w=400&h=600&fit=crop',
        publishedAt: new Date('2026-02-15'),
        isPublished: true,
        isActive: true
      } 
    });
  }

  const article = await prisma.article.create({
    data: {
      title: 'The Future of AI',
      content: '<p>Intro</p>',
      magazineId: mag1.id,
      publishedAt: new Date(),
      viewCount: 1234,
    }
  });

  await prisma.articleView.create({ data: { articleId: article.id, views: 123, viewsAt: new Date() } });

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
