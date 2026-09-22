// src/ssh/ssh.module.ts
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SshService } from './ssh.service';

@Module({
  providers: [SshService],
  exports: [SshService],
})
export class SshModule implements OnModuleInit {
  private readonly logger = new Logger(SshModule.name);

  constructor(
    private readonly sshService: SshService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const port = this.config.get<number>('SSH_LOCAL_PORT') ?? 5433;

    this.logger.log('Creando túnel SSH...');
    await this.sshService.createSSHTunnel(port);
    this.logger.log('Túnel SSH creado');
  }
}
