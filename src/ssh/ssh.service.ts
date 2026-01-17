import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTunnel } from 'tunnel-ssh';
import * as net from 'net';

@Injectable()
export class SshService implements OnModuleDestroy {
  private readonly logger = new Logger(SshService.name);

  private server: net.Server | null = null;
  private conn: any = null;

  private reconnecting = false;
  private isConnecting = false;

  // ===============================
  // READY STATE
  // ===============================
  private readyResolver!: () => void;
  private readyPromise = new Promise<void>((resolve) => {
    this.readyResolver = resolve;
  });

  constructor(private readonly config: ConfigService) {}

  // ===============================
  // PUBLIC
  // ===============================
  async waitUntilReady(): Promise<void> {
    return this.readyPromise;
  }

  // ============================================================
  // CREA EL TÚNEL SSH (solo expone el puerto cuando está listo)
  // ============================================================
  async createSSHTunnel(localPort: number): Promise<void> {
    if (this.isConnecting || this.conn) return;

    this.isConnecting = true;

    const sshHost = this.config.get<string>('SSH_HOST');
    const sshUser = this.config.get<string>('SSH_USER');
    const sshKey = this.config
      .get<string>('SSH_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n');

    if (!sshHost || !sshUser || !sshKey) {
      throw new Error('Variables de entorno SSH incompletas');
    }

    try {
      const [, sshConn] = await createTunnel(
        {
          autoClose: true,
          reconnectOnError: false,
        },
        {
          host: '127.0.0.1',
          port: localPort,
        },
        {
          host: sshHost,
          port: this.config.get('SSH_PORT', 22),
          username: sshUser,
          privateKey: sshKey,
          keepaliveInterval: 10000,
          keepaliveCountMax: 3,
        },
        {
          dstAddr: '127.0.0.1',
          dstPort: 5432,
        },
      );

      this.conn = sshConn;

      sshConn.on('error', (e) => this.handleTunnelClose(localPort, e));
      sshConn.on('end', () => this.handleTunnelClose(localPort, 'end'));
      sshConn.on('close', () => this.handleTunnelClose(localPort, 'close'));

      this.logger.log(
        `Túnel SSH activo en localhost:${localPort} → ${sshHost}:5432`,
      );

      this.readyResolver();
    } catch (err) {
      this.cleanup();
      throw err;
    } finally {
      this.isConnecting = false;
    }
  }

  // ============================================================
  // MANEJO DE CAÍDA Y RECONEXIÓN
  // ============================================================
  private async handleTunnelClose(localPort: number, reason: any) {
    if (this.reconnecting) return;
    this.reconnecting = true;

    this.logger.warn(`Túnel SSH caído: ${reason}`);

    this.cleanup();

    let delay = 2000;

    while (!this.conn) {
      this.logger.log(`Reintentando túnel SSH en ${delay / 1000}s...`);
      await new Promise((res) => setTimeout(res, delay));

      try {
        await this.createSSHTunnel(localPort);
      } catch {
        delay = Math.min(delay * 2, 60000);
      }
    }

    this.logger.log('Túnel SSH reconectado');
    this.reconnecting = false;
  }

  // ============================================================
  // CLEANUP
  // ============================================================
  private cleanup() {
    try {
      this.conn?.close?.();
      this.conn?.end?.();
    } catch {}
    this.conn = null;
  }

  // ============================================================
  // NEST HOOK
  // ============================================================
  async onModuleDestroy() {
    this.cleanup();
  }
}
