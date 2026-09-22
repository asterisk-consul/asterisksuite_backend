// src/app.module.ts
import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppConfigModule } from './config/config.module.js';
import { PrismaModule } from './prisma/prisma.module';
import { SshModule } from './ssh/ssh.module';
import { DataImportModule } from './data-import/data-import.module.js';

@Module({
  imports: [
    // 1. Cargar la configuración primero.
    AppConfigModule,
    // 2. Servir el frontend (SPA) sin interceptar /api.
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      exclude: ['/api/{*path}'],
    }),
    SshModule,
    PrismaModule,
    DataImportModule,
  ],
})
export class AppModule {}
