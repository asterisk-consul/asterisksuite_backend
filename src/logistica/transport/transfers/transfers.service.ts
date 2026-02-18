import { Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { LogisticaPrismaService } from 'src/prisma/prisma-logistica.service';

@Injectable()
export class TransfersService {
  constructor(private prisma: LogisticaPrismaService) {}

  create(dto: CreateTransferDto, userId: string) {
    return this.prisma.cargo_transfers.create({
      data: {
        from_trip_id: dto.fromTripId,
        to_trip_id: dto.toTripId,
        location_id: dto.locationId,
        notes: dto.notes,
        performed_by: userId,
      },
    });
  }

  addItem(
    transferId: string,
    palletId?: string,
    deliveryNoteId?: string,
    quantity?: number,
  ) {
    return this.prisma.cargo_transfer_items.create({
      data: {
        transfer_id: transferId,
        pallet_id: palletId,
        delivery_note_id: deliveryNoteId,
        quantity,
      },
    });
  }
}
