import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { SalesCommercialFlowService } from './sales-commercial-flow.service';
import { UpdateSalesFlowSettingsDto } from './sales-flow-settings.dto';
import { DocumentPrintTemplatesService } from './document-print-templates.service';
import { SaveDocumentPrintTemplateDto } from './document-print-template.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/sales-flow')
export class SalesCommercialFlowController {
  constructor(
    private readonly service: SalesCommercialFlowService,
    private readonly printTemplates: DocumentPrintTemplatesService,
  ) {}

  @Get('print-templates')
  @RequirePermissions('document_types.read')
  templates(@Query('category') category?: string) { return this.printTemplates.list(category); }

  @Post('print-templates')
  @RequirePermissions('document_types.update')
  createTemplate(@Body() dto: SaveDocumentPrintTemplateDto, @CurrentUser() user: AuthUser) {
    return this.printTemplates.create(dto, user.id);
  }

  @Patch('print-templates/:id')
  @RequirePermissions('document_types.update')
  updateTemplate(@Param('id') id: string, @Body() dto: SaveDocumentPrintTemplateDto, @CurrentUser() user: AuthUser) {
    return this.printTemplates.update(id, dto, user.id);
  }

  @Delete('print-templates/:id')
  @RequirePermissions('document_types.update')
  deleteTemplate(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.printTemplates.remove(id, user.id);
  }

  @Get('settings')
  @RequirePermissions('document_types.read')
  settings() { return this.service.getSettings(); }

  @Patch('settings')
  @RequirePermissions('document_types.update')
  updateSettings(@Body() dto: UpdateSalesFlowSettingsDto, @CurrentUser() user: AuthUser) {
    return this.service.updateSettings(dto, user.id);
  }

  @Get('delivery-queue')
  @RequirePermissions('sales.delivery_notes.read')
  queue() { return this.service.listDeliveryQueue(); }
}
