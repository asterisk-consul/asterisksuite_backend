import { Module } from '@nestjs/common';
import { TransferRatesService } from './transfer-rates.service';
import { TransferRatesController } from './transfer-rates.controller';

@Module({
  controllers: [TransferRatesController],
  providers: [TransferRatesService],
  exports: [TransferRatesService],
})
export class TransferRatesModule {}
