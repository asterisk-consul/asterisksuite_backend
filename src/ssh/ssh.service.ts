// src/ssh/ssh.service.ts
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTunnel } from 'tunnel-ssh';

interface TunnelInstance {
  server: any;
  conn: any;
}

interface TunnelStatus {
  active: boolean;
  connecting: boolean;
  details: {
    hasServer: boolean;
    hasConnection: boolean;
  } | null;
}

interface NodeError extends Error {
  code?: string;
}

@Injectable()
export class SshService implements OnModuleDestroy {
  private readonly logger = new Logger(SshService.name);
  private tunnelInstance: TunnelInstance | null = null;
  private isConnecting = false;

  constructor(private configService: ConfigService) {}

  async createSSHTunnel(localPort: number): Promise<TunnelInstance> {
    // Si ya existe un túnel, verificar que esté activo
    if (this.tunnelInstance) {
      this.logger.log('✅ Túnel SSH ya existe, reutilizando conexión');
      return this.tunnelInstance;
    }

    // Evitar múltiples conexiones simultáneas
    if (this.isConnecting) {
      this.logger.log('⏳ Ya hay una conexión SSH en proceso, esperando...');
      // Esperar hasta que termine la conexión actual
      while (this.isConnecting) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      // Después de esperar, verificar que el túnel se haya creado
      if (!this.tunnelInstance) {
        throw new Error(
          '❌ Error: El túnel no se pudo crear mientras esperaba',
        );
      }
      return this.tunnelInstance;
    }

    // Validar configuración
    const sshHost = this.configService.get<string>('SSH_HOST');
    const sshUsername = this.configService.get<string>('SSH_USER');
    const sshPrivateKey = this.configService.get<string>('SSH_PRIVATE_KEY');

    if (!sshHost || !sshUsername || !sshPrivateKey) {
      throw new Error('❌ Faltan variables de entorno de SSH');
    }

    this.isConnecting = true;

    const sshOptions = {
      host: sshHost,
      port: this.configService.get<number>('SSH_PORT', 22),
      username: sshUsername,
      privateKey: sshPrivateKey.replace(/\\n/g, '\n'),
      keepaliveInterval: 10000, // mantener la conexión viva
      keepaliveCountMax: 3,
      readyTimeout: 20000, // timeout de 20s para establecer conexión
    };

    const forwardOptions = {
      srcAddr: '127.0.0.1',
      srcPort: localPort,
      dstAddr: '127.0.0.1',
      dstPort: 5432,
    };

    const tunnelOptions = {
      autoClose: false, // NO cerrar automáticamente el túnel
      reconnectOnError: false, // No reconectar automáticamente en errores
    };

    const serverOptions = {
      port: localPort,
    };

    try {
      this.logger.log(`🔌 Creando túnel SSH a ${sshHost}:${sshOptions.port}`);

      const [server, conn] = await createTunnel(
        tunnelOptions,
        serverOptions,
        sshOptions,
        forwardOptions,
      );

      this.tunnelInstance = { server, conn };

      // Configurar listeners de eventos para monitorear el túnel
      conn.on('error', (err) => {
        this.logger.error('❌ Error en conexión SSH:', err);
        this.tunnelInstance = null;
      });

      conn.on('end', () => {
        this.logger.warn('⚠️ Conexión SSH terminada');
        this.tunnelInstance = null;
      });

      conn.on('close', () => {
        this.logger.warn('⚠️ Conexión SSH cerrada');
        this.tunnelInstance = null;
      });

      server.on('error', (err: NodeError) => {
        this.logger.error('❌ Error en servidor del túnel:', err);
        if (err.code === 'EADDRINUSE') {
          this.logger.error(`❌ El puerto ${localPort} ya está en uso`);
        }
      });

      server.on('close', () => {
        this.logger.log('🔴 Servidor del túnel cerrado');
      });

      this.logger.log(
        `✅ Túnel SSH creado: localhost:${localPort} -> ${sshHost}:5432`,
      );

      this.isConnecting = false;
      return this.tunnelInstance;
    } catch (err) {
      this.logger.error('❌ Error creando túnel SSH:', err);
      this.tunnelInstance = null;
      this.isConnecting = false;
      throw err;
    }
  }

  async closeSSHTunnel(): Promise<void> {
    if (this.tunnelInstance) {
      this.logger.log('🔌 Cerrando túnel SSH manualmente');
      try {
        if (this.tunnelInstance.server) {
          this.tunnelInstance.server.close();
        }
        if (this.tunnelInstance.conn) {
          this.tunnelInstance.conn.end();
        }
        this.tunnelInstance = null;
        this.logger.log('✅ Túnel SSH cerrado manualmente');
      } catch (err) {
        this.logger.error('❌ Error cerrando túnel manualmente:', err);
        throw err;
      }
    } else {
      this.logger.log('ℹ️ No hay túnel SSH activo para cerrar');
    }
  }

  getTunnelStatus(): TunnelStatus {
    return {
      active: this.tunnelInstance !== null,
      connecting: this.isConnecting,
      details: this.tunnelInstance
        ? {
            hasServer: !!this.tunnelInstance.server,
            hasConnection: !!this.tunnelInstance.conn,
          }
        : null,
    };
  }

  // Función para reconectar el túnel si se cae
  async ensureTunnelActive(localPort: number): Promise<TunnelInstance> {
    const status = this.getTunnelStatus();

    if (!status.active && !status.connecting) {
      this.logger.warn('⚠️ Túnel no activo, reconectando...');
      return await this.createSSHTunnel(localPort);
    }

    // Si llegamos aquí, el túnel debería estar activo o conectándose
    if (!this.tunnelInstance) {
      throw new Error('❌ Error: Túnel en estado inconsistente');
    }

    return this.tunnelInstance;
  }

  // Hook del ciclo de vida de NestJS - se ejecuta al cerrar la aplicación
  async onModuleDestroy(): Promise<void> {
    if (this.tunnelInstance) {
      this.logger.log('🛑 Cerrando túnel SSH...');
      try {
        if (this.tunnelInstance.server) {
          this.tunnelInstance.server.close();
        }
        if (this.tunnelInstance.conn) {
          this.tunnelInstance.conn.end();
        }
        this.tunnelInstance = null;
        this.logger.log('✅ Túnel SSH cerrado correctamente');
      } catch (err) {
        this.logger.error('❌ Error cerrando túnel:', err);
      }
    }
  }
}
