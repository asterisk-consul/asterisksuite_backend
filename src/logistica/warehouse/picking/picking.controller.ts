import { Controller, Post, Body, Patch } from '@nestjs/common';
import { PickingService } from './picking.service';
import { CreatePickingDto } from './dto/create-picking.dto';
import { TransferPalletDto } from './dto/transfer-pallet.dto';

@Controller('logistica/picking')
export class PickingController {
  constructor(private readonly pickingService: PickingService) {}

  /**
   * Crear operación de picking
   * Descuenta stock del depósito
   */
  @Post()
  async create(@Body() dto: CreatePickingDto) {
    return this.pickingService.create(dto);
  }

  /**
   * Transferir pallet entre depósitos
   */
  @Patch('transfer')
  async transfer(@Body() dto: TransferPalletDto) {
    return this.pickingService.transfer(dto);
  }
}
