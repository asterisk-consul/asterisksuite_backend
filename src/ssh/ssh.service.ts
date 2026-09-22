import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTunnel } from 'tunnel-ssh';
import * as net from 'net';
import { resolveSshPrivateKey } from '../config/ssh-key.loader';

@Injectable()
export class SshService implements OnModuleDestroy {
  private readonly logger = new Logger(SshService.name);

  private conn: net.Socket | null = null;

  private reconnecting = false;
  private isConnecting = false;

  // ===============================
  // READY STATE
  // ===============================
  private readySettled = false;
  private readyResolver!: () => void;
  private readyRejecter!: (err: Error) => void;
  private readyPromise = new Promise<void>((resolve, reject) => {
    this.readyResolver = resolve;
    this.readyRejecter = reject;
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
    const sshKey = resolveSshPrivateKey();

    if (!sshHost || !sshUser || !sshKey) {
      const err = new Error('Variables de entorno SSH incompletas');
      this.settleReady(err);
      throw err;
    }

    try {
      const tunnel = (await createTunnel(
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
          port: this.config.get<number>('SSH_PORT', 22),
          username: sshUser,
          privateKey: sshKey,
          keepaliveInterval: 10000,
          keepaliveCountMax: 3,
        },
        {
          dstAddr: '127.0.0.1',
          dstPort: 5432,
        },
      )) as unknown as [net.Server, net.Socket];

      const sshConn = tunnel[1];
      this.conn = sshConn;

      sshConn.on('error', (e: Error) => {
        void this.handleTunnelClose(localPort, e);
      });
      sshConn.on('end', () => {
        void this.handleTunnelClose(localPort, 'end');
      });
      sshConn.on('close', () => {
        void this.handleTunnelClose(localPort, 'close');
      });

      this.logger.log(
        `Túnel SSH activo en localhost:${localPort} → ${sshHost}:5432`,
      );

      this.settleReady();
    } catch (err) {
      this.cleanup();
      this.settleReady(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      this.isConnecting = false;
    }
  }

  // ============================================================
  // READY HELPERS
  // ============================================================
  private settleReady(error?: Error) {
    if (this.readySettled) return;
    this.readySettled = true;

    if (error) {
      this.readyRejecter(error);
    } else {
      this.readyResolver();
    }
  }

  // ============================================================
  // MANEJO DE CAÍDA Y RECONEXIÓN
  // ============================================================
  private async handleTunnelClose(localPort: number, reason: unknown) {
    if (this.reconnecting) return;
    this.reconnecting = true;

    this.logger.warn(`Túnel SSH caído: ${String(reason)}`);

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
      this.conn?.destroy();
    } catch {}
    this.conn = null;
  }

  // ============================================================
  // NEST HOOK
  // ============================================================
  onModuleDestroy() {
    this.cleanup();
  }
}
