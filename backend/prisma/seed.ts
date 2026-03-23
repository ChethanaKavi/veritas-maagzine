import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user if it doesn't exist
  let adminUser = await prisma.adminUser.findUnique({ where: { username: 'admin' } });
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    adminUser = await prisma.adminUser.create({
      data: {
        username: 'admin',
        email: 'admin@veritas.com',
        passwordHash: hashedPassword,
        role: 'admin',
      },
    });
    console.log('✓ Admin user created (username: admin, password: admin123)');
  }

  // Create test magazines
  let mag1 = await prisma.magazine.findFirst({ where: { title: 'Tech Innovator' } });
  if (!mag1) {
    mag1 = await prisma.magazine.create({
      data: {
        title: 'Tech Innovator',
        description: 'Exploring the latest technological breakthroughs and innovations shaping our digital future.',
        coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=600&fit=crop',
        publishedAt: new Date('2026-03-10'),
        isPublished: true,
        isActive: true,
      },
    });
    console.log('✓ Magazine "Tech Innovator" created');
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
        isActive: true,
      },
    });
    console.log('✓ Magazine "Fashion Forward" created');
  }

  // Create test articles
  const article1Data = {
    title: 'The Future of AI',
    content: '<p>Artificial Intelligence is reshaping industries worldwide. From machine learning to deep learning, AI technologies are becoming more sophisticated every day.</p>',
    magazineId: mag1.id,
    publishedAt: new Date(),
    isPublished: true,
    isActive: true,
    viewCount: 1234,
  };

  let article1 = await prisma.article.findFirst({ where: { title: article1Data.title } });
  if (!article1) {
    article1 = await prisma.article.create({ data: article1Data });
    console.log('✓ Article "The Future of AI" created');
  }

  const article2Data = {
    title: 'Sustainable Fashion',
    content: '<p>The fashion industry is undergoing a green revolution. Sustainable materials and ethical production are now the norm.</p>',
    magazineId: mag2.id,
    publishedAt: new Date(),
    isPublished: true,
    isActive: true,
    viewCount: 856,
  };

  let article2 = await prisma.article.findFirst({ where: { title: article2Data.title } });
  if (!article2) {
    article2 = await prisma.article.create({ data: article2Data });
    console.log('✓ Article "Sustainable Fashion" created');
  }

  // Create placements if they don't exist
  const placements = [
    { value: 'top-bar-of-the-homepage', label: 'Top Bar of Homepage' },
    { value: 'footer', label: 'Footer' },
    { value: 'leftsidebar-in-the-articles-page', label: 'Left Sidebar - Articles Page' },
    { value: 'rightsidebar-in-the-articles-page', label: 'Right Sidebar - Articles Page' },
    { value: 'bottom-of-the-one-article', label: 'Bottom of Article' },
    { value: 'bottom-of-the-one-magazine', label: 'Bottom of Magazine' },
  ];

  for (const placement of placements) {
    const exists = await prisma.placement.findUnique({ where: { value: placement.value } });
    if (!exists) {
      await prisma.placement.create({ data: placement });
      console.log(`✓ Placement "${placement.label}" created`);
    }
  }

  // Create test advertisements for different placements
  const ads = [
    {
      topic: 'Homepage Banner Ad',
      description: 'Featured advertisement on homepage top bar',
      area: 'top-bar-of-the-homepage',
      link: 'https://example.com',
      webImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=400&fit=crop',
      tabImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=400&fit=crop',
      webImageWidth: 1200,
      tabImageWidth: 800,
      mobileImageWidth: 400,
      active: true,
    },
    {
      topic: 'Tech Product Launch',
      description: 'Check out our latest technology products',
      area: 'leftsidebar-in-the-articles-page',
      link: 'https://example.com/tech',
      webImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=400&fit=crop',
      tabImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=400&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=200&fit=crop',
      webImageWidth: 300,
      tabImageWidth: 300,
      mobileImageWidth: 300,
      active: true,
    },
    {
      topic: 'Fashion Sale',
      description: 'Seasonal fashion collection on sale',
      area: 'rightsidebar-in-the-articles-page',
      link: 'https://example.com/fashion',
      webImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop',
      tabImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      webImageWidth: 300,
      tabImageWidth: 300,
      mobileImageWidth: 300,
      active: true,
    },
    {
      topic: 'Related Articles Promo',
      description: 'Discover more articles like this one',
      area: 'bottom-of-the-one-article',
      link: 'https://example.com/articles',
      webImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=300&fit=crop',
      tabImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=300&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=200&fit=crop',
      webImageWidth: 1200,
      tabImageWidth: 600,
      mobileImageWidth: 400,
      active: true,
    },
    {
      topic: 'Magazine Series',
      description: 'Subscribe to our magazine series',
      area: 'bottom-of-the-one-magazine',
      link: 'https://example.com/subscribe',
      webImage: 'https://images.unsplash.com/photo-1607842620890-65b149d827c0?w=1200&h=300&fit=crop',
      tabImage: 'https://images.unsplash.com/photo-1607842620890-65b149d827c0?w=600&h=300&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1607842620890-65b149d827c0?w=400&h=200&fit=crop',
      webImageWidth: 1200,
      tabImageWidth: 600,
      mobileImageWidth: 400,
      active: true,
    },
    {
      topic: 'Footer Campaign',
      description: 'Join our community newsletter',
      area: 'footer',
      link: 'https://example.com/newsletter',
      webImage: 'https://images.unsplash.com/photo-1460925895917-adf4198c838d?w=1200&h=200&fit=crop',
      tabImage: 'https://images.unsplash.com/photo-1460925895917-adf4198c838d?w=800&h=200&fit=crop',
      mobileImage: 'https://images.unsplash.com/photo-1460925895917-adf4198c838d?w=400&h=200&fit=crop',
      webImageWidth: 1200,
      tabImageWidth: 800,
      mobileImageWidth: 400,
      active: true,
    },
  ];

  for (const ad of ads) {
    const exists = await prisma.advertisement.findFirst({
      where: { topic: ad.topic },
    });
    if (!exists) {
      await prisma.advertisement.create({ data: ad });
      console.log(`✓ Advertisement "${ad.topic}" created for area "${ad.area}"`);
    }
  }

  console.log('✓ Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
