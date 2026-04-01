import { PrismaService } from '@/prisma/prisma.service';
import { CreatePickingDto } from './dto/create-picking.dto';
import { CreatePickingOrderDto } from './dto/create-picking-order.dto';
import { ExecutePickingDto } from './dto/execute-picking-order.dto';
import { TransferPalletDto } from './dto/transfer-pallet.dto';
export declare class PickingService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePickingDto): Promise<{
        success: boolean;
    }>;
    transfer(dto: TransferPalletDto): Promise<{
        transferred: boolean;
    }>;
    executePicking(dto: ExecutePickingDto): Promise<{
        completed: boolean;
    }>;
    createPickingOrder(dto: CreatePickingOrderDto): Promise<{
        id: string;
        created_at: Date;
        status: string;
        created_by: string | null;
        trip_id: string | null;
        warehouse_id: string;
        dispatch_order_id: string | null;
        client_id: string | null;
        delivery_note_id: string | null;
    }>;
}
