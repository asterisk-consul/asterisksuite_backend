import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { TreasuryReportsController } from './treasury-reports.controller';
import { TreasuryReportsService } from './treasury-reports.service';

@Module({
  imports: [PrismaModule],
  controllers: [TreasuryReportsController],
  providers: [TreasuryReportsService],
})
export class TreasuryReportsModule {}
