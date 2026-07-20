import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestContextInterceptor } from './common/interceptors/request-context.interceptor.js';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');

  app.setGlobalPrefix('api');

  // ✅ Aumentar límite de body para uploads (50MB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // ✅ Servir archivos estáticos desde /uploads
  const uploadsPath = path.resolve(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Un solo enableCors con todos los orígenes
  app.enableCors({
    origin: [
      'http://localhost:3008',
      'http://localhost:3000',
      'http://192.168.18.13:3008',
      'https://dev.asterisksuite.cloud',
      'http://dev.asterisksuite.cloud',
      'https://donandres.asterisksuite.cloud',
      'http://donandres.asterisksuite.cloud',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new RequestContextInterceptor());

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3008;

  await app.listen(port, '0.0.0.0');
  logger.log(`Server running on port ${port}`);
}

bootstrap();
