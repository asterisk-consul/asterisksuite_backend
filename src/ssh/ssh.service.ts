import {
  Injectable,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
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

  constructor(private readonly config: ConfigService) { }

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
    this.logger.log(
      `Iniciando creación de túnel SSH en puerto ${localPort}...`,
    );

    const sshHost = this.config.get<string>('SSH_HOST');
    const sshUser = this.config.get<string>('SSH_USER');
    const sshKey = this.config
      .get<string>('SSH_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n');

    if (!sshHost || !sshUser || !sshKey) {
      throw new Error('Variables de entorno SSH incompletas');
    }

    // TCP server — NO listen todavía
    const server = net.createServer();
    this.server = server;

    server.on('connection', (socket) => {
      if (!this.conn) {
        socket.destroy();
        return;
      }

      this.conn.forwardOut(
        '127.0.0.1',
        0,
        '127.0.0.1',
        5432,
        (err, stream) => {
          if (err || !stream) {
            socket.destroy();
            return;
          }

          socket.pipe(stream);
          stream.pipe(socket);
        },
      );
    });

    try {
      const [_, sshConn] = await createTunnel(
        {
          autoClose: true,
          reconnectOnError: false,
        },
        { port: localPort },
        {
          host: sshHost,
          port: this.config.get('SSH_PORT', 22),
          username: sshUser,
          privateKey: sshKey,
          keepaliveInterval: 10000,
          keepaliveCountMax: 3,
        },
        {
          srcAddr: '127.0.0.1',
          srcPort: localPort,
          dstAddr: '127.0.0.1',
          dstPort: 5432,
        },
      );

      this.conn = sshConn;

      sshConn.on('error', (e) =>
        this.handleTunnelClose(localPort, e),
      );
      sshConn.on('end', () =>
        this.handleTunnelClose(localPort, 'end'),
      );
      sshConn.on('close', () =>
        this.handleTunnelClose(localPort, 'close'),
      );

      // 🔴 LISTEN SOLO CUANDO SSH ESTÁ LISTO
      server.listen(localPort, '127.0.0.1', () => {
        this.logger.log(
          `Túnel SSH activo en localhost:${localPort} → ${sshHost}:5432`,
        );

        // 🔴 RESUELVE READY
        this.readyResolver();
      });

      this.isConnecting = false;
    } catch (err) {
      this.logger.error('Error creando túnel SSH', err);
      this.cleanup();
      this.isConnecting = false;
      throw err;
    }
  }

  // ============================================================
  // MANEJO DE CAÍDA Y RECONEXIÓN
  // ============================================================
  private async handleTunnelClose(
    localPort: number,
    reason: any,
  ) {
    if (this.reconnecting) return;
    this.reconnecting = true;

    this.logger.warn(`Túnel SSH caído: ${reason}`);

    this.cleanup();

    let delay = 2000;

    while (!this.conn) {
      this.logger.log(
        `Reintentando túnel SSH en ${delay / 1000}s...`,
      );
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
      this.server?.close();
      this.conn?.end();
    } catch { }

    this.server = null;
    this.conn = null;
  }

  // ============================================================
  // NEST HOOK
  // ============================================================
  async onModuleDestroy() {
    this.cleanup();
  }
}
