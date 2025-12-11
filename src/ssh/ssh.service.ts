import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTunnel } from 'tunnel-ssh';
import * as net from 'net';

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
  private reconnecting = false;

  constructor(private configService: ConfigService) {}

  // ============================================================
  // LIBERA EL PUERTO SI ESTÁ EN USO
  // ============================================================
  private async freePort(port: number): Promise<void> {
    this.logger.log(`Verificando si el puerto ${port} está libre...`);

    return new Promise((resolve) => {
      const tester = net.createServer();

      tester.once('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          this.logger.warn(`Puerto ${port} ocupado. Intentando liberarlo...`);
          try {
            const client = net.connect({ port }, () => {
              client.destroy();
            });
            client.on('close', () => resolve(undefined));
          } catch (_) {
            resolve(undefined);
          }
        } else {
          resolve(undefined);
        }
      });

      tester.once('listening', () => {
        tester.close(() => resolve(undefined));
      });

      tester.listen(port);
    });
  }

  // ============================================================
  // MÉTODO PRINCIPAL: CREA EL TÚNEL SSH
  // ============================================================
  async createSSHTunnel(localPort: number): Promise<TunnelInstance> {
    if (this.tunnelInstance) {
      this.logger.log('Túnel SSH existente, reutilizando');
      return this.tunnelInstance;
    }

    if (this.isConnecting) {
      this.logger.log('Esperando conexión SSH existente...');
      while (this.isConnecting) {
        await new Promise((res) => setTimeout(res, 100));
      }
      if (!this.tunnelInstance) {
        throw new Error('No se pudo crear el túnel tras esperar');
      }
      return this.tunnelInstance;
    }

    const sshHost = this.configService.get<string>('SSH_HOST');
    const sshUsername = this.configService.get<string>('SSH_USER');
    const sshPrivateKey = this.configService.get<string>('SSH_PRIVATE_KEY');

    if (!sshHost || !sshUsername || !sshPrivateKey) {
      throw new Error('Faltan variables de entorno SSH');
    }

    this.isConnecting = true;

    // Liberar puerto antes de abrir el túnel
    await this.freePort(localPort);

    const sshOptions = {
      host: sshHost,
      port: this.configService.get<number>('SSH_PORT', 22),
      username: sshUsername,
      privateKey: sshPrivateKey.replace(/\\n/g, '\n'),
      keepaliveInterval: 10000,
      keepaliveCountMax: 3,
      readyTimeout: 20000,
    };

    const forwardOptions = {
      srcAddr: '127.0.0.1',
      srcPort: localPort,
      dstAddr: '127.0.0.1',
      dstPort: 5432,
    };

    const tunnelOptions = {
      autoClose: false,
      reconnectOnError: false,
    };

    const serverOptions = { port: localPort };

    try {
      this.logger.log(`Creando túnel SSH a ${sshHost}:${sshOptions.port}...`);

      const [server, conn] = await createTunnel(
        tunnelOptions,
        serverOptions,
        sshOptions,
        forwardOptions,
      );

      this.tunnelInstance = { server, conn };

      // ------------------------------------------------------------
      // LISTENERS DE RECONEXIÓN
      // ------------------------------------------------------------
      conn.on('error', (err) => {
        this.logger.error('Error en conexión SSH:', err);
        this.handleTunnelClose(localPort, 'error');
      });

      conn.on('end', () => {
        this.logger.warn('Conexión SSH terminada');
        this.handleTunnelClose(localPort, 'end');
      });

      conn.on('close', () => {
        this.logger.warn('Conexión SSH cerrada');
        this.handleTunnelClose(localPort, 'close');
      });

      // Errores del servidor TCP
      server.on('error', (err: NodeError) => {
        this.logger.error('Error en servidor del túnel:', err);
        if (err.code === 'EADDRINUSE') {
          this.logger.error(`Puerto ${localPort} en uso`);
        }
      });

      server.on('close', () => {
        this.logger.log('Servidor del túnel cerrado');
      });

      this.logger.log(
        `Túnel SSH creado correctamente: localhost:${localPort} -> ${sshHost}:5432`,
      );

      this.isConnecting = false;
      return this.tunnelInstance;
    } catch (err) {
      this.logger.error('Error creando túnel SSH:', err);
      this.tunnelInstance = null;
      this.isConnecting = false;
      throw err;
    }
  }

  // ============================================================
  // MANEJO DE CIERRE + RECONEXIÓN AUTOMÁTICA
  // ============================================================
  private async handleTunnelClose(localPort: number, reason: string) {
    if (this.reconnecting) return;

    this.logger.warn(`Túnel SSH caído por: ${reason}`);
    this.tunnelInstance = null;
    this.reconnecting = true;

    let delay = 2000; // 2 segundos
    const maxDelay = 60000; // 1 minuto

    while (!this.tunnelInstance) {
      try {
        this.logger.log(`Reintentando conexión SSH en ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));

        await this.createSSHTunnel(localPort);

        this.logger.log('Túnel SSH reconectado correctamente');
        break;
      } catch (err) {
        this.logger.error('Falló reconexión del túnel:', err);
        delay = Math.min(delay * 2, maxDelay);
      }
    }

    this.reconnecting = false;
  }

  // ============================================================
  // ESTADO DEL TÚNEL
  // ============================================================
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

  // ============================================================
  // CIERRE MANUAL
  // ============================================================
  async closeSSHTunnel(): Promise<void> {
    if (!this.tunnelInstance) {
      this.logger.log('No hay túnel SSH activo para cerrar');
      return;
    }

    this.logger.log('Cerrando túnel SSH manualmente');

    try {
      this.tunnelInstance.server?.close();
      this.tunnelInstance.conn?.end();
      this.tunnelInstance = null;

      this.logger.log('Túnel SSH cerrado manualmente');
    } catch (err) {
      this.logger.error('Error cerrando túnel manualmente:', err);
      throw err;
    }
  }

  // ============================================================
  // HOOK NESTJS
  // ============================================================
  async onModuleDestroy(): Promise<void> {
    if (this.tunnelInstance) {
      this.logger.log('Cerrando túnel SSH por apagado de la app...');
      try {
        this.tunnelInstance.server?.close();
        this.tunnelInstance.conn?.end();
        this.tunnelInstance = null;
        this.logger.log('Túnel SSH cerrado correctamente');
      } catch (err) {
        this.logger.error('Error cerrando túnel:', err);
      }
    }
  }
}
