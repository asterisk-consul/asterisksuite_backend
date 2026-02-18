import { Controller, Post, Body, Param } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('transport/transfers')
export class TransfersController {
  constructor(private readonly service: TransfersService) {}

  @Post()
  create(@Body() dto: CreateTransferDto) {
    const userId = 'HARDCODE_USER_ID';
    return this.service.create(dto, userId);
  }

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
