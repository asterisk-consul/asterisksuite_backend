import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema-logistica.prisma',
  migrations: {
    path: 'prisma/migrations-logistica',
  },
  datasource: {
    url: env('DATABASE_LOGISTICA_URL'),
  },
});
