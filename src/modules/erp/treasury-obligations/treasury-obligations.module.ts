import { Module } from '@nestjs/common';
import { AccessControlModule } from '@/access-control/access-control.module';
import { TreasuryObligationsController } from './treasury-obligations.controller';
import { TreasuryObligationsService } from './treasury-obligations.service';

@Module({
  imports: [AccessControlModule],
  controllers: [TreasuryObligationsController],
  providers: [TreasuryObligationsService],
  exports: [TreasuryObligationsService],
})
export class TreasuryObligationsModule {}
