import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { HrController } from './hr.controller';
import { HrService } from './hr.service';
import { BankMovementsModule } from '../bank-movements/bank-movements.module';
import { IntercompanyTreasuryModule } from '../intercompany-treasury/intercompany-treasury.module';

@Module({
  imports: [PrismaModule, BankMovementsModule, IntercompanyTreasuryModule],
  controllers: [HrController],
  providers: [HrService],
  exports: [HrService],
})
export class HrModule {}
