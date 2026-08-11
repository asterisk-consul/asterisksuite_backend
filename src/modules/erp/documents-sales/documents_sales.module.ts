import { Module } from '@nestjs/common';
import { DocumentsSalesService } from './documents_sales.services';
import { DocumentsSalesController } from './documents_sales.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductPricingModule } from '../pricing/product-pricing/product-pricing.module';
import { SalesReportModule } from './sales-reports/sales_reports.module';
import { DocumentsSalesItemsService } from './documents-sales-items.service';
import { DocumentsSalesTotalsService } from './documents-sales-totals.service';
import { CurrentAccountsModule } from '../current-accounts/current-accounts.module';
import { TaxEngineModule } from '../tax-engine/tax-engine.module';
import { CurrenciesModule } from '../currencies/currencies.module';
import { CommonErpModule } from '@/common/common-erp.module';

@Module({
  imports: [PrismaModule, ProductPricingModule, SalesReportModule, CurrentAccountsModule, TaxEngineModule, CurrenciesModule, CommonErpModule],
  controllers: [DocumentsSalesController],
  providers: [
    DocumentsSalesService,
    DocumentsSalesItemsService,
    DocumentsSalesTotalsService,
  ],
  exports: [DocumentsSalesService],
})
export class DocumentsSalesModule {}
