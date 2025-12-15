import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { SshModule } from '../ssh/ssh.module.js';

@Module({
  imports: [SshModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule { }
