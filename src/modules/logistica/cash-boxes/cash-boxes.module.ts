import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CashBoxesController } from './cash-boxes.controller';
import { CashBoxesService } from './cash-boxes.service';

@Module({
  controllers: [CashBoxesController],
  providers: [CashBoxesService, PrismaService],
  exports: [CashBoxesService],
})
export class CashBoxesModule {}
