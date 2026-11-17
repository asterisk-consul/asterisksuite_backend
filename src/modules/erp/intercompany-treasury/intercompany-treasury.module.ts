import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { BankMovementsModule } from '../bank-movements/bank-movements.module';
import { IntercompanyTreasuryController } from './intercompany-treasury.controller';
import { IntercompanyTreasuryService } from './intercompany-treasury.service';
import { IntercompanyOverviewService } from './intercompany-overview.service';
import { CashBoxesModule } from '@/modules/logistica/cash-boxes/cash-boxes.module';

@Module({
  imports: [PrismaModule, BankMovementsModule, CashBoxesModule],
  controllers: [IntercompanyTreasuryController],
  providers: [IntercompanyTreasuryService, IntercompanyOverviewService],
  exports: [IntercompanyTreasuryService, IntercompanyOverviewService],
})
export class IntercompanyTreasuryModule {}
