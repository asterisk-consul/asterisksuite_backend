import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TiresService } from './tires.service';
import { CreateTireDto, UpdateTireDto, InstallTireDto, RemoveTireDto, RotateTireDto, RepairTireDto, ScrapTireDto, SellTireDto, FilterTiresDto } from './dto/tire.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';

@Controller('logistica/maintenance/tires')
@UseGuards(JwtAuthGuard)
export class TiresController {
  constructor(private readonly service: TiresService) {}

  @Get()
  @RequirePermissions('maintenance.tires.read')
  async findAll(@Query() filters: FilterTiresDto) {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @RequirePermissions('maintenance.tires.read')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @RequirePermissions('maintenance.tires.create')
  async create(@Body() dto: CreateTireDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.id);
  }

  @Post('from-purchase-line/:purchaseLineId')
  @RequirePermissions('maintenance.tires.create')
  async createFromPurchaseLine(
    @Param('purchaseLineId') purchaseLineId: string,
    @Body('serial_numbers') serialNumbers: string[],
    @CurrentUser() user: any
  ) {
    return this.service.createFromPurchaseLine(purchaseLineId, serialNumbers, user.id);
  }

  @Patch(':id')
  @RequirePermissions('maintenance.tires.update')
  async update(@Param('id') id: string, @Body() dto: UpdateTireDto, @CurrentUser() user: any) {
    return this.service.update(id, dto, user.id);
  }

  @Post(':id/install')
  @RequirePermissions('maintenance.tires.execute')
  async install(@Param('id') id: string, @Body() dto: InstallTireDto, @CurrentUser() user: any) {
    return this.service.install(id, dto, user.id);
  }

  @Post(':id/remove')
  @RequirePermissions('maintenance.tires.execute')
  async remove(@Param('id') id: string, @Body() dto: RemoveTireDto, @CurrentUser() user: any) {
    return this.service.remove(id, dto, user.id);
  }

  @Post(':id/rotate')
  @RequirePermissions('maintenance.tires.execute')
  async rotate(@Param('id') id: string, @Body() dto: RotateTireDto, @CurrentUser() user: any) {
    return this.service.rotate(id, dto, user.id);
  }

  @Post(':id/repair')
  @RequirePermissions('maintenance.tires.execute')
  async repair(@Param('id') id: string, @Body() dto: RepairTireDto, @CurrentUser() user: any) {
    return this.service.repair(id, dto, user.id);
  }

  @Post(':id/scrap')
  @RequirePermissions('maintenance.tires.execute')
  async scrap(@Param('id') id: string, @Body() dto: ScrapTireDto, @CurrentUser() user: any) {
    return this.service.scrap(id, dto, user.id);
  }

  @Post(':id/sell')
  @RequirePermissions('maintenance.tires.execute')
  async sell(@Param('id') id: string, @Body() dto: SellTireDto, @CurrentUser() user: any) {
    return this.service.sell(id, dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('maintenance.tires.delete')
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.softDelete(id, user.id);
  }
}
