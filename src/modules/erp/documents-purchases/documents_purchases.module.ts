import { Module } from '@nestjs/common';
import { DocumentsPurchasesService } from './documents_purchases.service';
import { ProductPricingModule } from '../pricing/product-pricing/product-pricing.module';
import { DocumentsPurchasesController } from './documents_puerchases.controller';
import { DocumentsPurchasesItemsService } from './documents-purchases-items-services';
import { DocumentsPurchasesTotalsService } from './documents-purchases-totals';
import { PrismaModule } from '@/prisma/prisma.module';
import { CurrentAccountsModule } from '../current-accounts/current-accounts.module';
import { TaxEngineModule } from '../tax-engine/tax-engine.module';
import { CurrenciesModule } from '../currencies/currencies.module';
import { CommonErpModule } from '@/common/common-erp.module';

@Module({
  imports: [PrismaModule, ProductPricingModule, CurrentAccountsModule, TaxEngineModule, CurrenciesModule, CommonErpModule],
  controllers: [DocumentsPurchasesController],
  providers: [DocumentsPurchasesService, DocumentsPurchasesItemsService, DocumentsPurchasesTotalsService],
  exports: [DocumentsPurchasesService],
})
export class DocumentsPurchasesModule {}
