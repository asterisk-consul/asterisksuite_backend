import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCardsService } from './credit-cards.service';
import { BankMovementsModule } from '../bank-movements/bank-movements.module';

@Module({ imports: [PrismaModule, BankMovementsModule], controllers: [CreditCardsController], providers: [CreditCardsService], exports: [CreditCardsService] })
export class CreditCardsModule {}
