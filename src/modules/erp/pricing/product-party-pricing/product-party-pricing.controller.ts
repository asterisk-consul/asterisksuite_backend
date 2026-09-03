import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { ProductPartyPricingService } from './product-party-pricing.service';
import { UpsertProductPartyPriceDto } from './dto/upsert-product-party-price.dto';

@Controller('pricing/party-prices')
@UseGuards(JwtAuthGuard)
export class ProductPartyPricingController {
  constructor(private readonly service: ProductPartyPricingService) {}

  @RequirePermissions('product-prices.read')
  @Get('party/:partyId')
  findByParty(@Param('partyId') partyId: string, @Query('operationType') operationType?: 'SALE' | 'PURCHASE') {
    return this.service.findByParty(partyId, operationType);
  }

  @RequirePermissions('product-prices.read')
  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string, @Query('operationType') operationType?: 'SALE' | 'PURCHASE') {
    return this.service.findByProduct(productId, operationType);
  }

  @RequirePermissions('product-prices.read')
  @Get('product/:productId/history')
  productHistory(
    @Param('productId') productId: string,
    @Query('operationType') operationType?: 'SALE' | 'PURCHASE',
  ) {
    return this.service.productHistory(productId, operationType);
  }

  @RequirePermissions('product-prices.read')
  @Get('party/:partyId/history')
  history(
    @Param('partyId') partyId: string,
    @Query('productId') productId?: string,
    @Query('operationType') operationType?: 'SALE' | 'PURCHASE',
  ) {
    return this.service.history(partyId, productId, operationType);
  }

  @RequirePermissions('product-prices.read')
  @Get('resolve')
  resolve(
    @Query('productId') productId: string,
    @Query('partyId') partyId: string,
    @Query('currencyCode') currencyCode: string,
    @Query('operationType') operationType: 'SALE' | 'PURCHASE',
  ) {
    return this.service.resolve(productId, partyId, currencyCode, operationType);
  }

  @RequirePermissions('product-prices.update')
  @Post()
  upsert(@Body() dto: UpsertProductPartyPriceDto, @CurrentUser() user: AuthUser) {
    return this.service.upsert(dto, user.id);
  }

  @RequirePermissions('product-prices.update')
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importPrices(
    @UploadedFile() file: Express.Multer.File,
    @Body('party_id') partyId: string,
    @Body('operation_type') operationType: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.service.importFromExcel(file.buffer, partyId, operationType, user.id);
  }

  @RequirePermissions('product-prices.delete')
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.remove(id, user.id);
  }
}
