import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CashBoxRenditionsController } from './cash-box-renditions.controller';
import { CashBoxRenditionsService } from './cash-box-renditions.service';

@Module({
  controllers: [CashBoxRenditionsController],
  providers: [CashBoxRenditionsService, PrismaService],
  exports: [CashBoxRenditionsService],
})
export class CashBoxRenditionsModule {}
