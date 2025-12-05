// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SshService } from './ssh/ssh.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    // Crear la aplicación NestJS
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Obtener servicios necesarios
    const configService = app.get(ConfigService);
    const sshService = app.get(SshService);

    // Configurar pipes globales
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Elimina propiedades no definidas en el DTO
        forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
        transform: true, // Transforma los payloads a instancias de DTO
      }),
    );

    // Configurar CORS si es necesario
    app.enableCors({
      origin: true, // En desarrollo, permite todos los orígenes
      credentials: true,
    });

    // Crear túnel SSH antes de iniciar el servidor
    // Usar SSH_LOCAL_PORT si está disponible, sino usar PG_PORT
    const localPort = configService.get<number>('SSH_LOCAL_PORT') ||
      configService.get<number>('PG_PORT', 5433);

    logger.log('🔐 Iniciando túnel SSH...');
    try {
      await sshService.createSSHTunnel(localPort);
      logger.log('✅ Túnel SSH establecido correctamente');
    } catch (error) {
      logger.error('❌ Error al crear túnel SSH:', error);
      logger.error('⚠️ La aplicación continuará sin túnel SSH');
      // Dependiendo de tu lógica, podrías decidir si continuar o no
      // throw error; // Descomenta si quieres que la app no inicie sin túnel
    }

    // Obtener puerto de la aplicación
    const port = configService.get<number>('PORT', 3000);

    // Iniciar el servidor
    await app.listen(port);

    logger.log(`🚀 Aplicación corriendo en: http://localhost:${port}`);
    logger.log(`🔧 Ambiente: ${configService.get('NODE_ENV', 'development')}`);
    logger.log(`📊 Túnel SSH: localhost:${localPort} -> PostgreSQL`);

    // Verificar estado del túnel
    const tunnelStatus = sshService.getTunnelStatus();
    logger.log(`🔌 Estado del túnel: ${tunnelStatus.active ? 'Activo ✅' : 'Inactivo ❌'}`);

    // Configurar manejadores de cierre graceful
    setupGracefulShutdown(app, logger);

  } catch (error) {
    logger.error('❌ Error fatal al iniciar la aplicación:', error);
    process.exit(1);
  }
}

function setupGracefulShutdown(app: any, logger: Logger) {
  // Manejar señales de terminación
  const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

  signals.forEach((signal) => {
    process.on(signal, async () => {
      logger.log(`\n⚠️ Señal ${signal} recibida, cerrando aplicación...`);

      try {
        // NestJS se encargará de llamar onModuleDestroy en todos los servicios
        await app.close();
        logger.log('✅ Aplicación cerrada correctamente');
        process.exit(0);
      } catch (error) {
        logger.error('❌ Error al cerrar la aplicación:', error);
        process.exit(1);
      }
    });
  });

  // Manejar errores no capturados
  process.on('uncaughtException', (error) => {
    logger.error('❌ Excepción no capturada:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('❌ Promise rechazada no manejada:', { reason, promise });
    process.exit(1);
  });
}

bootstrap();