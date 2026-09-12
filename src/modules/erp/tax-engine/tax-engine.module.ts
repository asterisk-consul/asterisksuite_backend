import { Module } from '@nestjs/common'
import { PrismaModule } from '@/prisma/prisma.module'
import { TaxEngineController } from './controllers/tax-engine.controller'
import { TaxCategoriesController } from './controllers/tax-categories.controller'
import { CompanyTaxSettingsController } from './controllers/company-tax-settings.controller'
import { TaxResolutionService } from './services/tax-resolution.service'
import { TaxCalculationService } from './services/tax-calculation.service'
import { PrismaTaxRepository } from './repositories/prisma/prisma-tax.repository'
import { PrismaTaxCategoryRepository } from './repositories/prisma/prisma-tax-category.repository'
import { PrismaCompanyTaxSettingsRepository } from './repositories/prisma/prisma-company-tax-settings.repository'
import { PrismaOperationTaxRepository } from './repositories/prisma/prisma-operation-tax.repository'
import { PrismaProductRepository } from './repositories/prisma/prisma-product.repository'

@Module({
  imports: [PrismaModule],
  controllers: [TaxEngineController, TaxCategoriesController, CompanyTaxSettingsController],
  providers: [
    TaxResolutionService,
    TaxCalculationService,
    { provide: 'ITaxRepository', useClass: PrismaTaxRepository },
    { provide: 'ITaxCategoryRepository', useClass: PrismaTaxCategoryRepository },
    { provide: 'ICompanyTaxSettingsRepository', useClass: PrismaCompanyTaxSettingsRepository },
    { provide: 'IOperationTaxRepository', useClass: PrismaOperationTaxRepository },
    { provide: 'IProductRepository', useClass: PrismaProductRepository },
  ],
  exports: [TaxResolutionService, TaxCalculationService],
})
export class TaxEngineModule {}
