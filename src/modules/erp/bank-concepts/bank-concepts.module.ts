import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { BankConceptsController } from './bank-concepts.controller';
import { BankConceptsService } from './bank-concepts.service';

@Module({
  controllers: [BankConceptsController],
  providers: [BankConceptsService, PrismaService],
  exports: [BankConceptsService],
})
export class BankConceptsModule {}
