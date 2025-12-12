import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTunnel } from 'tunnel-ssh';
import * as net from 'net';

@Injectable()
export class SshService implements OnModuleDestroy {
  private readonly logger = new Logger(SshService.name);

  private server: net.Server | null = null;
  private conn: any = null; // ssh2 client
  private reconnecting = false;
  private isConnecting = false;

  constructor(private readonly config: ConfigService) {}

  // ============================================================
  // CREA EL TÚNEL SSH DE FORMA SEGURA (no abre server antes de SSH)
  // ============================================================
  async createSSHTunnel(localPort: number): Promise<void> {
    if (this.isConnecting) return;
    if (this.conn) return; // ya activo

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

    // Server TCP manual — NO LISTEN TODAVÍA
    const server = net.createServer();
    this.server = server;

    server.on('connection', (socket) => {
      if (!this.conn) {
        socket.destroy(); // evita forwardOut con SSH no conectado
        return;
      }

      this.conn.forwardOut('127.0.0.1', 0, '127.0.0.1', 5432, (err, stream) => {
        if (err || !stream) {
          socket.destroy();
          return;
        }
        socket.pipe(stream);
        stream.pipe(socket);
      });
    });

    // ============================================================
    // Creación del túnel SSH
    // ============================================================
    try {
      const [sshServer, sshConn] = await createTunnel(
        {
          autoClose: true,
          reconnectOnError: false,
        },
        { port: localPort }, // pero NO hacemos listen aquí
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

      // Guardamos conexión SSH
      this.conn = sshConn;

      // Listeners de reconexión
      sshConn.on('error', (e) => this.handleTunnelClose(localPort, e));
      sshConn.on('end', () => this.handleTunnelClose(localPort, 'end'));
      sshConn.on('close', () => this.handleTunnelClose(localPort, 'close'));

      // CUANDO SSH ESTÁ LISTO → AHORA SÍ abrir el server TCP
      server.listen(localPort, '127.0.0.1', () => {
        this.logger.log(
          `Túnel SSH activo en localhost:${localPort} → ${sshHost}:5432`,
        );
      });

      this.isConnecting = false;
    } catch (err) {
      this.logger.error('Error creando túnel SSH:', err);
      this.isConnecting = false;
      this.server?.close();
      this.server = null;
      this.conn = null;
      throw err;
    }
  }

  // ============================================================
  // MANEJO DE CAÍDA CON RECONEXIÓN
  // ============================================================
  private async handleTunnelClose(localPort: number, reason: any) {
    if (this.reconnecting) return;
    this.reconnecting = true;

    this.logger.warn(`Túnel SSH caído: ${reason}`);

    // Mata todo antes de reconectar
    if (this.server) {
      try {
        this.server.close();
      } catch {}
      this.server = null;
    }

    if (this.conn) {
      try {
        this.conn.end();
      } catch {}
      this.conn = null;
    }

    let delay = 2000;

    while (!this.conn) {
      this.logger.log(`Reintentando túnel SSH en ${delay / 1000}s...`);
      await new Promise((res) => setTimeout(res, delay));

      try {
        await this.createSSHTunnel(localPort);
      } catch (err) {
        delay = Math.min(delay * 2, 60000);
      }
    }

    this.logger.log('Túnel SSH reconectado exitosamente');
    this.reconnecting = false;
  }

  // ============================================================
  // CIERRE MANUAL
  // ============================================================
  async closeSSHTunnel() {
    this.logger.log('Cerrando túnel SSH...');
    try {
      this.server?.close();
      this.conn?.end();
    } catch {}
    this.server = null;
    this.conn = null;
  }

  // ============================================================
  // HOOK NEST
  // ============================================================
  async onModuleDestroy() {
    await this.closeSSHTunnel();
  }
}
