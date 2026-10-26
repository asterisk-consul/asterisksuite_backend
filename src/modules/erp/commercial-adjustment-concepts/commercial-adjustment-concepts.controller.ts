import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CreateCommercialAdjustmentConceptDto } from './dto/create-commercial-adjustment-concept.dto';
import { UpdateCommercialAdjustmentConceptDto } from './dto/update-commercial-adjustment-concept.dto';
import { CommercialAdjustmentConceptsService } from './commercial-adjustment-concepts.service';

@UseGuards(JwtAuthGuard)
@Controller('erp/commercial-adjustment-concepts')
export class CommercialAdjustmentConceptsController {
  constructor(private readonly service: CommercialAdjustmentConceptsService) {}

  @Get()
  @RequirePermissions('commercial_adjustment_concepts.read')
  findAll(@Query('module') module?: string, @Query('include_inactive') includeInactive?: string) {
    return this.service.findAll(module, includeInactive === 'true');
  }

  @Get(':id')
  @RequirePermissions('commercial_adjustment_concepts.read')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @RequirePermissions('commercial_adjustment_concepts.create')
  create(@Body() dto: CreateCommercialAdjustmentConceptDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('commercial_adjustment_concepts.update')
  update(@Param('id') id: string, @Body() dto: UpdateCommercialAdjustmentConceptDto) {
    return this.service.update(id, dto);
  }
}
