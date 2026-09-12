import { Module } from '@nestjs/common';
import { TireMovementsService } from './tire-movements.service';
import { TireMovementsController } from './tire-movements.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [TireMovementsController],
  providers: [TireMovementsService, PrismaService],
  exports: [TireMovementsService],
})
export class TireMovementsModule {}