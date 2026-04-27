import { Controller, Get, Query, Param } from '@nestjs/common';
import { TaxesPurchasesService } from '../documents_purchases/documents_purchases.service';
import { IndexTaxesPurchasesDto } from '../dto/taxes_purchases/index.dto';

@Controller('purchases/taxes')
export class TaxesPurchasesController {
  constructor(private readonly taxesPurchasesService: TaxesPurchasesService) {}

  // GET /purchases/taxes
  @Get()
  findAll(@Query() dto: IndexTaxesPurchasesDto) {
    return this.taxesPurchasesService.findAll(dto);
  }

  // GET /purchases/taxes/document-type/COM
  @Get('document-type/:code')
  getByDocumentType(@Param('code') code: string) {
    return this.taxesPurchasesService.getTaxesForDocumentType(code);
  }
}
