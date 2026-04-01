import { PickingService } from './picking.service';
import { CreatePickingOrderDto } from './dto/create-picking-order.dto';
import { ExecutePickingDto } from './dto/execute-picking-order.dto';
import { TransferPalletDto } from './dto/transfer-pallet.dto';
export declare class PickingController {
    private readonly pickingService;
    constructor(pickingService: PickingService);
    createOrder(dto: CreatePickingOrderDto): Promise<{
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
    execute(pickingOrderId: string, dto: ExecutePickingDto): Promise<{
        completed: boolean;
    }>;
    transfer(dto: TransferPalletDto): Promise<{
        transferred: boolean;
    }>;
}
