import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { BankMovementsModule } from '../bank-movements/bank-movements.module';
import { FinancialInvestmentsController } from './financial-investments.controller';
import { FinancialInvestmentsService } from './financial-investments.service';

@Module({ imports: [PrismaModule, BankMovementsModule], controllers: [FinancialInvestmentsController], providers: [FinancialInvestmentsService], exports: [FinancialInvestmentsService] })
export class FinancialInvestmentsModule {}
