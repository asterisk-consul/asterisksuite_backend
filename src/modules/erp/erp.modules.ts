// erp.modules.ts

import { Module } from '@nestjs/common';

import { AccountsModule } from './accounts/accounts.module';
import { alarteModule } from './alerts/sales_alerts.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { CurrencyRatesModule } from './currency-rates/currency-rates.module';
// import { DocumentsSalesModule } from './documents-purchases/documents_purchases.module';
import { DocumentsSalesModule } from './documents-sales/documents_sales.module';
import { SalesReportModule } from './documents-sales/sales-reports/sales_reports.module';
import { DocumentsTypesErpModule } from './document_types/documents-types.module';
import { PricingEngineModule } from './pricing/pricing-engine.module';
import { ExchangeModule } from './pricing/exchange/exchange.module';
import { ProductPricingModule } from './pricing/product-pricing/product-pricing.module';
import { PurchasesModule } from './purchase/purchases.module';
import { RatePriceModule } from './services/rate-price.module';
import { TaxesModule } from './taxes/taxes.module';

@Module({
  imports: [
    AccountsModule,
    alarteModule,
    CurrenciesModule,
    CurrencyRatesModule,
    // DocumentsSalesModule,
    DocumentsSalesModule,
    SalesReportModule,
    DocumentsTypesErpModule,
    PricingEngineModule,
    ExchangeModule,
    ProductPricingModule,
    PurchasesModule,
    RatePriceModule,
    TaxesModule,
  ],
  exports: [
    AccountsModule,
    alarteModule,
    CurrenciesModule,
    CurrencyRatesModule,
    // DocumentsSalesModule,
    DocumentsSalesModule,
    SalesReportModule,
    DocumentsTypesErpModule,
    PricingEngineModule,
    ExchangeModule,
    ProductPricingModule,
    PurchasesModule,
    RatePriceModule,
    TaxesModule,
  ],
})
export class ErpModulesModule {}
