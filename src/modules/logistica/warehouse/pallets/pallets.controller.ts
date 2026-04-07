import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PalletsService } from './pallets.service';
import { CreatePalletDto } from './dto/create-pallet.dto';
import { UpdatePalletDto } from './dto/update-pallet.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@Controller('warehouse/pallets')
@UseGuards(JwtAuthGuard)
export class PalletsController {
  constructor(private readonly service: PalletsService) {}

  @Post()
  create(@Body() dto: CreatePalletDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePalletDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
