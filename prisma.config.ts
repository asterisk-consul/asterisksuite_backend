import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seeds/rbac.seed.ts', // ← aquí
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
