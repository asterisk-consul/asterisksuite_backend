import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SshModule } from '../ssh/ssh.module';

@Module({
  imports: [SshModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
