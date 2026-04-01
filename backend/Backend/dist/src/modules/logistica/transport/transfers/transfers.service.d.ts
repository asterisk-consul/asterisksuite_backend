import { CreateTransferDto } from './dto/create-transfer.dto';
import { PrismaService } from '@/prisma/prisma.service';
export declare class TransfersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateTransferDto, userId: string): import("../../../../generated/prisma/models").Prisma__cargo_transfersClient<{
        id: string;
        location_id: string | null;
        transfer_time: Date;
        notes: string | null;
        from_trip_id: string | null;
        to_trip_id: string | null;
        performed_by: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    addItem(transferId: string, palletId?: string, deliveryNoteId?: string, quantity?: number): import("../../../../generated/prisma/models").Prisma__cargo_transfer_itemsClient<{
        id: string;
        quantity: import("@prisma/client/runtime/client").Decimal | null;
        pallet_id: string | null;
        delivery_note_id: string | null;
        transfer_id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
