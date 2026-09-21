import { Module } from '@nestjs/common';
import { AccessControlModule } from '@/access-control/access-control.module';
import { DocumentAssignmentController } from '../documents/document-assignment.controller';
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
import { MySalesModule } from './my-sales/my-sales.module';
import { SalesCommercialFlowService } from './sales-commercial-flow.service';
import { SalesCommercialFlowController } from './sales-commercial-flow.controller';
import { FiscalAuthorizationsModule } from '../fiscal-authorizations/fiscal-authorizations.module';

@Module({
  imports: [AccessControlModule, PrismaModule, ProductPricingModule, SalesReportModule, CurrentAccountsModule, TaxEngineModule, CurrenciesModule, CommonErpModule, MySalesModule, FiscalAuthorizationsModule],
  controllers: [DocumentsSalesController, DocumentAssignmentController, SalesCommercialFlowController],
  providers: [
    DocumentsSalesService,
    DocumentsSalesItemsService,
    DocumentsSalesTotalsService,
    SalesCommercialFlowService,
  ],
  exports: [DocumentsSalesService, SalesCommercialFlowService, MySalesModule],
})
export class DocumentsSalesModule {}
