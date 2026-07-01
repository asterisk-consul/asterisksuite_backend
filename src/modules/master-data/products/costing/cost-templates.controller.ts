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

// import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
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

  // @RequirePermissions('cost_templates.read')
  @Get('components')
  findAllComponents() {
    return this.service.findAllComponents();
  }

  // @RequirePermissions('cost_templates.create')
  @Post('components')
  createComponent(@Body() dto: CreateCostComponentDto) {
    return this.service.createComponent(dto);
  }

  // @RequirePermissions('cost_templates.update')
  @Patch('components/:id')
  updateComponent(
    @Param('id') id: string,
    @Body() dto: Partial<CreateCostComponentDto>,
  ) {
    return this.service.updateComponent(id, dto);
  }

  // @RequirePermissions('cost_templates.delete')
  @Delete('components/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComponent(@Param('id') id: string) {
    return this.service.deleteComponent(id);
  }

  // ─── Templates ────────────────────────────────────────────────────────────

  // @RequirePermissions('cost_templates.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // @RequirePermissions('cost_templates.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // @RequirePermissions('cost_templates.create')
  @Post()
  create(@Body() dto: CreateCostTemplateDto) {
    return this.service.create(dto);
  }

  // @RequirePermissions('cost_templates.update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<Omit<CreateCostTemplateDto, 'components'>>,
  ) {
    return this.service.update(id, dto);
  }

  // @RequirePermissions('cost_templates.delete')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  // ─── Componentes dentro de un template ───────────────────────────────────

  // @RequirePermissions('cost_templates.create')
  @Post(':id/components')
  addComponent(
    @Param('id') templateId: string,
    @Body()
    dto: { cost_component_id: string; value_override?: number; order: number },
  ) {
    return this.service.addComponent(templateId, dto);
  }

  // @RequirePermissions('cost_templates.update')
  @Patch(':id/components/:componentId')
  updateTemplateComponent(
    @Param('id') templateId: string,
    @Param('componentId') componentId: string,
    @Body() dto: UpdateTemplateComponentDto,
  ) {
    return this.service.updateTemplateComponent(templateId, componentId, dto);
  }

  // @RequirePermissions('cost_templates.delete')
  @Delete(':id/components/:componentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeComponent(
    @Param('id') templateId: string,
    @Param('componentId') componentId: string,
  ) {
    return this.service.removeComponent(templateId, componentId);
  }

  // ─── Asignación a productos ───────────────────────────────────────────────

  // @RequirePermissions('cost_templates.create')
  @Post(':id/products/:productId')
  assignToProduct(
    @Param('id') templateId: string,
    @Param('productId') productId: string,
  ) {
    return this.service.assignToProduct(productId, templateId);
  }

  // @RequirePermissions('cost_templates.delete')
  @Delete('products/:productId/template')
  removeFromProduct(@Param('productId') productId: string) {
    return this.service.removeFromProduct(productId);
  }
}
