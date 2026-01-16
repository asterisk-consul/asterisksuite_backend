import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTunnel } from 'tunnel-ssh';

@Injectable()
export class SshService implements OnModuleDestroy {
  private readonly logger = new Logger(SshService.name);
  private conn: any;

  constructor(private readonly config: ConfigService) {}

  async createSSHTunnel(localPort: number) {
    if (this.conn) return;

    const sshKey = this.config
      .get<string>('SSH_PRIVATE_KEY')
      ?.replace(/\\n/g, '\n');

    const [server, sshConn] = await createTunnel(
      {
        autoClose: true,
        reconnectOnError: true, // 👈 USAR ESTO
      },
      {
        host: '127.0.0.1',
        port: localPort,
      },
      {
        host: this.config.get('SSH_HOST'),
        port: this.config.get<number>('SSH_PORT', 22),
        username: this.config.get('SSH_USER'),
        privateKey: sshKey,
        keepaliveInterval: 10000,
      },
      {
        dstAddr: '127.0.0.1',
        dstPort: 5432,
      },
    );

    this.conn = sshConn;

    sshConn.on('close', () => {
      this.logger.warn('Túnel SSH cerrado');
      this.conn = null;
    });

    this.logger.log(`Túnel SSH activo en localhost:${localPort}`);
  }

  onModuleDestroy() {
    try {
      this.conn?.end();
    } catch {}
  }
}
