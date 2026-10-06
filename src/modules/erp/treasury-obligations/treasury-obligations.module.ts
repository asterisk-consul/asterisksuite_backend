import { Module } from '@nestjs/common';
import { TreasuryObligationsController } from './treasury-obligations.controller';
import { TreasuryObligationsService } from './treasury-obligations.service';

@Module({ controllers: [TreasuryObligationsController], providers: [TreasuryObligationsService], exports: [TreasuryObligationsService] })
export class TreasuryObligationsModule {}
