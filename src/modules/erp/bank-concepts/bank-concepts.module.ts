import { Module } from '@nestjs/common';
import { BankConceptsController } from './bank-concepts.controller';
import { BankConceptsService } from './bank-concepts.service';

@Module({
  controllers: [BankConceptsController],
  providers: [BankConceptsService],
  exports: [BankConceptsService],
})
export class BankConceptsModule {}
