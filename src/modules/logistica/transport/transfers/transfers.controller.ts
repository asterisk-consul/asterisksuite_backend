import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('transport/transfers')
@UseGuards(JwtAuthGuard)
export class TransfersController {
  constructor(private readonly service: TransfersService) {}

  @RequirePermissions('transfers.create')
  @Post()
  create(@Body() dto: CreateTransferDto, @CurrentUser() user: AuthUser) {
    return this.service.create(dto, user.id);
  }

  @RequirePermissions('transfers.create')
  @Post(':id/items')
  addItem(
    @Param('id') id: string,
    @Body()
    body: {
      palletId?: string;
      deliveryNoteId?: string;
      quantity?: number;
    },
  ) {
    return this.service.addItem(
      id,
      body.palletId,
      body.deliveryNoteId,
      body.quantity,
    );
  }
}
