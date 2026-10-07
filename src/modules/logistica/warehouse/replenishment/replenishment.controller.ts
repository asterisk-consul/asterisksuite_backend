import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { ReplenishmentService } from './replenishment.service';
import { UpsertReplenishmentPolicyDto } from './dto/upsert-replenishment-policy.dto';

@Controller('warehouse/replenishment')
@UseGuards(JwtAuthGuard)
export class ReplenishmentController {
  constructor(private readonly service: ReplenishmentService) {}

  @Get('policies/product/:productId')
  @RequirePermissions('stock.replenishment.read')
  byProduct(@Param('productId') productId: string) { return this.service.listByProduct(productId); }

  @Post('policies')
  @RequirePermissions('stock.replenishment.configure')
  create(@Body() dto: UpsertReplenishmentPolicyDto) { return this.service.create(dto); }

  @Patch('policies/:id')
  @RequirePermissions('stock.replenishment.configure')
  update(@Param('id') id: string, @Body() dto: UpsertReplenishmentPolicyDto) { return this.service.update(id, dto); }

  @Delete('policies/:id')
  @RequirePermissions('stock.replenishment.configure')
  remove(@Param('id') id: string) { return this.service.remove(id); }

  @Get('report')
  @RequirePermissions('stock.replenishment.read')
  report(@Query() query: Record<string, string>) { return this.service.report(query); }
}
