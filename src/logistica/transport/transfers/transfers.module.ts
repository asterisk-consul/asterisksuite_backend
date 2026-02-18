import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';

@Module({
  controllers: [TransfersController],
  providers: [TransfersService, LogisticaPrismaService],
})
export class TransfersModule {}
