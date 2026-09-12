import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CashBoxTransfersController } from './cash-box-transfers.controller';
import { CashBoxTransfersService } from './cash-box-transfers.service';

@Module({
  controllers: [CashBoxTransfersController],
  providers: [CashBoxTransfersService, PrismaService],
  exports: [CashBoxTransfersService],
})
export class CashBoxTransfersModule {}
