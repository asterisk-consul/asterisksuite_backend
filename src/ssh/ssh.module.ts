// src/ssh/ssh.module.ts
import { Module } from '@nestjs/common';
import { SshService } from './ssh.service';

@Module({
  providers: [SshService],
  exports: [SshService],
})
export class SshModule {
  constructor(private readonly sshService: SshService) {}

  async onModuleInit() {
    await this.sshService.createSSHTunnel(5434);
  }
}
