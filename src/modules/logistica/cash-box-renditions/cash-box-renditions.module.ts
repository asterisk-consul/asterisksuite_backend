import { Module } from '@nestjs/common';
import { CashBoxRenditionsController } from './cash-box-renditions.controller';
import { CashBoxRenditionsService } from './cash-box-renditions.service';

@Module({
  controllers: [CashBoxRenditionsController],
  providers: [CashBoxRenditionsService],
  exports: [CashBoxRenditionsService],
})
export class CashBoxRenditionsModule {}
