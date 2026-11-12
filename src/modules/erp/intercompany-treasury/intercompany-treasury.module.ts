import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { BankMovementsModule } from '../bank-movements/bank-movements.module';
import { IntercompanyTreasuryController } from './intercompany-treasury.controller';
import { IntercompanyTreasuryService } from './intercompany-treasury.service';

@Module({
  imports: [PrismaModule, BankMovementsModule],
  controllers: [IntercompanyTreasuryController],
  providers: [IntercompanyTreasuryService],
  exports: [IntercompanyTreasuryService],
})
export class IntercompanyTreasuryModule {}
