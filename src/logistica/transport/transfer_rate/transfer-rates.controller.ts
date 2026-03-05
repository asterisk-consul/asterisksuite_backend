import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransferRatesService } from './transfer-rates.service';
import { CreateTransferRateDto } from './dto/create-transfer-rate.dto';
import { UpdateTransferRateDto } from './dto/update-transfer-rate.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('transfer-rates')
@UseGuards(JwtAuthGuard)
export class TransferRatesController {
  constructor(private readonly service: TransferRatesService) {}

  @Post()
  create(@Body() dto: CreateTransferRateDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('company_id') company_id: string) {
    return this.service.findAll(company_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransferRateDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.deactivate(id);
  }
}
