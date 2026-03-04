import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PickingService } from './picking.service';
import { CreatePickingOrderDto } from './dto/create-picking-order.dto';
import { ExecutePickingDto } from './dto/execute-picking-order.dto';
import { TransferPalletDto } from './dto/transfer-pallet.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('logistica/picking')
@UseGuards(JwtAuthGuard)
export class PickingController {
  constructor(private readonly pickingService: PickingService) {}

  /**
   * ETAPA 1
   * Crear orden de picking (reserva stock)
   */
  @Post('orders')
  async createOrder(@Body() dto: CreatePickingOrderDto) {
    return this.pickingService.createPickingOrder(dto);
  }

  /**
   * ETAPA 2
   * Ejecutar picking (descuenta stock real)
   */
  @Post('orders/:id/execute')
  async execute(
    @Param('id') pickingOrderId: string,
    @Body() dto: ExecutePickingDto,
  ) {
    return this.pickingService.executePicking({
      ...dto,
      picking_order_id: pickingOrderId,
    });
  }

  /**
   * Transferencia de pallet entre depósitos
   */
  @Patch('pallets/transfer')
  async transfer(@Body() dto: TransferPalletDto) {
    return this.pickingService.transfer(dto);
  }
}
