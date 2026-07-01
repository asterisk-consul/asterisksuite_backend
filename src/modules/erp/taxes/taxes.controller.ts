import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
// import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';

@Controller('taxes')
@UseGuards(JwtAuthGuard)
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  // @RequirePermissions('taxes.create')
  @Post()
  create(@Body() dto: CreateTaxDto) {
    return this.taxesService.create(dto);
  }

  // @RequirePermissions('taxes.read')
  @Get()
  findAll() {
    return this.taxesService.findAll();
  }

  // @RequirePermissions('taxes.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaxDto) {
    return this.taxesService.update(id, dto);
  }

  // @RequirePermissions('taxes.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxesService.remove(id);
  }
}
