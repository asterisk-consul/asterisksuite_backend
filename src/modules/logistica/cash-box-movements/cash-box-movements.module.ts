import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CashBoxMovementsController } from './cash-box-movements.controller';
import { CashBoxMovementsService } from './cash-box-movements.service';

@Module({
  controllers: [CashBoxMovementsController],
  providers: [CashBoxMovementsService, PrismaService],
  exports: [CashBoxMovementsService],
})
export class CashBoxMovementsModule {}
