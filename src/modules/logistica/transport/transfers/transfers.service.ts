import { Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TransfersService {
  constructor(private prisma: PrismaService) {}

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
