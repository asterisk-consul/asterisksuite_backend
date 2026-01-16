import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BigIntInterceptor } from './common/interceptors/bigint.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new BigIntInterceptor());

  app.enableCors({ origin: true, credentials: true });

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3008;

  // 🔑 CLAVE PARA DOCKER / DOCKPLOY
  await app.listen(port, '0.0.0.0');

  logger.log(`Server running on port ${port}`);
}

bootstrap();
