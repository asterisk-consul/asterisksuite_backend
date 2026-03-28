import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');

  app.setGlobalPrefix('api');

  // Un solo enableCors con todos los orígenes
  app.enableCors({
    origin: [
      'http://localhost:3008',
      'http://localhost:3001',
      'http://localhost:5500', // ← Live Server
      'http://127.0.0.1:5500', // ← Live Server (alternativo)
      'null',
      'http://192.168.18.13:3008',
      'https://dev.astreisksuite.cloud',
      'http://dev.astreisksuite.cloud',
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

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3008;

  await app.listen(port, '0.0.0.0');
  logger.log(`Server running on port ${port}`);
}

bootstrap();
