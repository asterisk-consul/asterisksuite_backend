import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

import { EngineeringService } from './engineering.service';

import { CreateEngineeringComponentDto } from './dto/create-engineering-component.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/engineering')
export class EngineeringController {
  constructor(private readonly engineeringService: EngineeringService) {}

  @Post('components')
  createComponent(@Body() dto: CreateEngineeringComponentDto) {
    return this.engineeringService.createComponent(dto);
  }

  @Get('tree/:productId')
  getEngineeringTree(@Param('productId') productId: string) {
    return this.engineeringService.getEngineeringTree(productId);
  }

  @Post('calculate/:productId')
  calculate(@Param('productId') productId: string) {
    return this.engineeringService.calculate(productId);
  }
}
