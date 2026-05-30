import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { CostTemplatesService } from './cost-templates.service';

import type {
  CreateCostComponentDto,
  CreateCostTemplateDto,
  UpdateTemplateComponentDto,
} from './cost-templates.service';

@Controller('cost-templates')
export class CostTemplatesController {
  constructor(private readonly service: CostTemplatesService) {}

  // ─── Componentes globales ─────────────────────────────────────────────────

  @Get('components')
  findAllComponents() {
    return this.service.findAllComponents();
  }

  @Post('components')
  createComponent(@Body() dto: CreateCostComponentDto) {
    return this.service.createComponent(dto);
  }

  @Patch('components/:id')
  updateComponent(
    @Param('id') id: string,
    @Body() dto: Partial<CreateCostComponentDto>,
  ) {
    return this.service.updateComponent(id, dto);
  }

  @Delete('components/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComponent(@Param('id') id: string) {
    return this.service.deleteComponent(id);
  }

  // ─── Templates ────────────────────────────────────────────────────────────

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCostTemplateDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<Omit<CreateCostTemplateDto, 'components'>>,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  // ─── Componentes dentro de un template ───────────────────────────────────

  @Post(':id/components')
  addComponent(
    @Param('id') templateId: string,
    @Body()
    dto: { cost_component_id: string; value_override?: number; order: number },
  ) {
    return this.service.addComponent(templateId, dto);
  }

  @Patch(':id/components/:componentId')
  updateTemplateComponent(
    @Param('id') templateId: string,
    @Param('componentId') componentId: string,
    @Body() dto: UpdateTemplateComponentDto,
  ) {
    return this.service.updateTemplateComponent(templateId, componentId, dto);
  }

  @Delete(':id/components/:componentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeComponent(
    @Param('id') templateId: string,
    @Param('componentId') componentId: string,
  ) {
    return this.service.removeComponent(templateId, componentId);
  }

  // ─── Asignación a productos ───────────────────────────────────────────────

  @Post(':id/products/:productId')
  assignToProduct(
    @Param('id') templateId: string,
    @Param('productId') productId: string,
  ) {
    return this.service.assignToProduct(productId, templateId);
  }

  @Delete('products/:productId/template')
  removeFromProduct(@Param('productId') productId: string) {
    return this.service.removeFromProduct(productId);
  }
}
