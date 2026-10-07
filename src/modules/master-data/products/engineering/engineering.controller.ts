import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { EngineeringService } from './engineering.service';
import { CreateEngineeringComponentDto } from './dto/create-engineering-component.dto';
import { ReorderComponentsDto } from './dto/reorder-components.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/engineering')
export class EngineeringController {
  constructor(private readonly engineeringService: EngineeringService) {}

  // =========================
  // TREE
  // =========================

  @RequirePermissions('engineering.read')
  @Get('tree/:productId')
  getEngineeringTree(@Param('productId', ParseUUIDPipe) productId: string, @Query('variantId') variantId?: string, @Query('currencyId') currencyId?: string) {
    return this.engineeringService.getEngineeringTree(productId, variantId, currencyId);
  }

  @RequirePermissions('engineering.read')
  @Get('tree/:productId/variants/:variantId/status')
  getVariantStructureStatus(@Param('productId', ParseUUIDPipe) productId: string, @Param('variantId', ParseUUIDPipe) variantId: string) {
    return this.engineeringService.getVariantStructureStatus(productId, variantId);
  }

  @RequirePermissions('engineering.update')
  @Post('tree/:productId/variants/:variantId/customize')
  customizeVariantStructure(@Param('productId', ParseUUIDPipe) productId: string, @Param('variantId', ParseUUIDPipe) variantId: string) {
    return this.engineeringService.customizeVariantStructure(productId, variantId);
  }

  // =========================
  // CALCULATE
  // =========================

  @RequirePermissions('engineering.create')
  @Post('calculate/:productId')
  calculate(@Param('productId', ParseUUIDPipe) productId: string, @Query('variantId') variantId?: string) {
    return this.engineeringService.calculate(productId, variantId);
  }

  // =========================
  // COMPONENTS CRUD
  // =========================

  @RequirePermissions('engineering.create')
  @Post('components')
  createComponent(@Body() dto: CreateEngineeringComponentDto) {
    return this.engineeringService.createComponent(dto);
  }

  // importANTE: rutas estáticas antes de las dinámicas (:id)

  @RequirePermissions('engineering.update')
  @Patch('components/reorder')
  reorderComponents(@Body() dto: ReorderComponentsDto) {
    return this.engineeringService.reorderComponents(dto.items);
  }

  @RequirePermissions('engineering.update')
  @Patch('components/:id/move')
  moveComponent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: { new_parent_product_id: string | null; product_root_id: string },
  ) {
    return this.engineeringService.moveComponent(id, dto.new_parent_product_id, dto.product_root_id);
  }

  @RequirePermissions('engineering.update')
  @Patch('components/:id')
  updateComponent(@Param('id', ParseUUIDPipe) id: string, @Body() dto: Partial<CreateEngineeringComponentDto>) {
    return this.engineeringService.updateComponent(id, dto);
  }

  @RequirePermissions('engineering.delete')
  @Delete('components/:id')
  deleteComponent(@Param('id', ParseUUIDPipe) id: string) {
    return this.engineeringService.deleteComponent(id);
  }
}
