# Backend (Prisma + PostgreSQL)

This folder contains a minimal Node + TypeScript + Prisma setup for the Senal project.

Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Seed sample data (optional):

```bash
npm run seed
```

5. Start dev server:

```bash
npm run dev
```

Files

- `prisma/schema.prisma` — Prisma schema with models: Magazine, Article, Author, ArticleView, Tag, Advertisement, AdPlacement, AdminUser.
- `prisma/seed.ts` — Simple seed script using Prisma Client.
- `src/index.ts` — Minimal Express server exposing `/magazines` and `/articles` endpoints.
