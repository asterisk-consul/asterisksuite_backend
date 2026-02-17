import { Module } from '@nestjs/common';
import { LogisticaPrismaService } from './prisma-logistica.service';

@Module({
  imports: [],
  providers: [LogisticaPrismaService],
  exports: [LogisticaPrismaService],
})
export class LogisticaPrismaModule {}
