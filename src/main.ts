import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestContextInterceptor } from './common/interceptors/request-context.interceptor.js';
import * as express from 'express';
import * as path from 'path';
import { mcpAuthRouter } from '@modelcontextprotocol/sdk/server/auth/router.js';
import { McpOAuthProvider } from './modules/mcp/mcp-oauth.provider.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');
  const config = app.get(ConfigService);

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
      exceptionFactory: (errors) => {
        console.log('[VALIDATION] Errors:', JSON.stringify(errors.map(e => ({
          field: e.property,
          constraints: e.constraints,
          value: e.value
        }))))
        return new BadRequestException(errors)
      }
    }),
  );

  app.useGlobalInterceptors(new RequestContextInterceptor());

  const apiDocsSetting = config.get<string>('ENABLE_API_DOCS');
  const enableApiDocs = apiDocsSetting == null
    ? config.get<string>('NODE_ENV') !== 'production'
    : apiDocsSetting === 'true';
  if (enableApiDocs) {
    const [{ SwaggerModule, DocumentBuilder }, { apiReference }] = await Promise.all([
      import('@nestjs/swagger'),
      import('@scalar/nestjs-api-reference'),
    ]);
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Asterisk Suite API')
      .setDescription('Multi-tenant ERP/Logistics API for Argentina')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    app.use(
      '/api/docs',
      apiReference({ content: document, theme: 'purple', layout: 'modern' }),
    );
  }

  if (config.get<string>('MCP_ENABLED') === 'true') {
    const issuerUrl = new URL(config.getOrThrow<string>('MCP_AUTH_ISSUER_URL'));
    const resourceUrl = new URL(config.getOrThrow<string>('MCP_PUBLIC_URL'));
    const authorizeUrl = new URL(config.getOrThrow<string>('MCP_APP_AUTHORIZE_URL'));
    const accessTokenSecret = config.getOrThrow<string>('MCP_ACCESS_TOKEN_SECRET');
    if (accessTokenSecret.length < 32) {
      throw new Error('MCP_ACCESS_TOKEN_SECRET debe tener al menos 32 caracteres aleatorios.');
    }
    if (config.get<string>('NODE_ENV') === 'production'
      && [issuerUrl, resourceUrl, authorizeUrl].some((url) => url.protocol !== 'https:')) {
      throw new Error('Las URLs públicas de MCP deben usar HTTPS en producción.');
    }
    if (issuerUrl.pathname !== '/' || issuerUrl.search || issuerUrl.hash || issuerUrl.username || issuerUrl.password) {
      throw new Error('MCP_AUTH_ISSUER_URL debe ser el origen público, sin ruta, credenciales, query ni fragmento.');
    }
    if (resourceUrl.pathname.replace(/\/+$/, '') !== '/api/mcp') {
      throw new Error('MCP_PUBLIC_URL debe apuntar a la ruta /api/mcp.');
    }
    if (authorizeUrl.pathname.replace(/\/+$/, '') !== '/mcp/authorize') {
      throw new Error('MCP_APP_AUTHORIZE_URL debe apuntar a la pantalla /mcp/authorize.');
    }

    const oauth = app.get(McpOAuthProvider);
    app.use(mcpAuthRouter({
      provider: oauth,
      issuerUrl,
      baseUrl: resourceUrl,
      resourceServerUrl: resourceUrl,
      resourceName: 'Asterisk Suite ERP',
      scopesSupported: ['erp:read', 'intake:files.read', 'purchases:drafts.write'],
    }));
    logger.log(`MCP OAuth habilitado para ${resourceUrl.href}`);
  }

  const port = config.get<number>('PORT') ?? 3008;

  await app.listen(port, '0.0.0.0');
  logger.log(`Server running on port ${port}`);
}

bootstrap();
