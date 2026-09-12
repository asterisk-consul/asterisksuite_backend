import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TransferRatesService } from './transfer-rates.service';
import { CreateTransferRateDto } from './dto/create-transfer-rate.dto';
import { UpdateTransferRateDto } from './dto/update-transfer-rate.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('transfer-rates')
@UseGuards(JwtAuthGuard)
export class TransferRatesController {
  constructor(private readonly service: TransferRatesService) {}

  @RequirePermissions('transfer_rates.create')
  @Post()
  create(@Body() dto: CreateTransferRateDto) {
    return this.service.create(dto);
  }

  @RequirePermissions('transfer_rates.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @RequirePermissions('transfer_rates.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @RequirePermissions('transfer_rates.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransferRateDto) {
    return this.service.update(id, dto);
  }

  @RequirePermissions('transfer_rates.update')
  @Patch(':id/desactivate')
  deactivate(@Param('id') id: string) {
    return this.service.deactivate(id);
  }

  @RequirePermissions('transfer_rates.update')
  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.service.active(id);
  }
}
