import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { DispatchOrdersService } from './dispatch-orders.service';
import {
  CreateDispatchOrderDto,
  UpdateDispatchOrderDto,
} from './dto/dispatch-order.dto';

@Controller('dispatch-orders')
export class DispatchOrdersController {
  constructor(private readonly service: DispatchOrdersService) {}

  @Post()
  create(@Body() dto: CreateDispatchOrderDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('company_id') companyId?: string) {
    return this.service.findAll(companyId);
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
