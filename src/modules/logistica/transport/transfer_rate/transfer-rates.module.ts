import { Module } from '@nestjs/common';
import { TransferRatesService } from './transfer-rates.service';
import { TransferRatesController } from './transfer-rates.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [TransferRatesController],
  providers: [TransferRatesService, PrismaService],
  exports: [TransferRatesService],
})
export class TransferRatesModule {}
