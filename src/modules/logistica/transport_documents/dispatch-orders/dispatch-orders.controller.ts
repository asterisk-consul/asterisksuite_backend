import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { DispatchOrdersService } from './dispatch-orders.service';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import {
  CreateDispatchOrderDto,
  UpdateDispatchOrderDto,
} from './dto/dispatch-order.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@Controller('dispatch-orders')
@UseGuards(JwtAuthGuard)
export class DispatchOrdersController {
  constructor(private readonly service: DispatchOrdersService) {}

  // controller
  @Post()
  create(@Body() dto: CreateDispatchOrderDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user.id); // ✅ user.id confirmado
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
  update(@Param('id') id: string, @Body() dto: UpdateDispatchOrderDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
