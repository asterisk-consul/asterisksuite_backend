import { StockService } from './stock.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
export declare class StockController {
    private readonly service;
    constructor(service: StockService);
    getStock(warehouseId: string): Promise<({
        products: {
            name: string;
            id: string;
            created_at: Date;
            sku: string | null;
            requires_refrigeration: boolean | null;
        };
    } & {
        id: string;
        updated_at: Date;
        warehouse_id: string;
        product_id: string;
        quantity: import("@prisma/client/runtime/client").Decimal;
        reserved_quantity: import("@prisma/client/runtime/client").Decimal;
    })[]>;
    getMovements(warehouseId: string): Promise<({
        products: {
            name: string;
            id: string;
            created_at: Date;
            sku: string | null;
            requires_refrigeration: boolean | null;
        };
        users: {
            name: string;
            email: string;
            role: string | null;
            id: string;
            created_at: Date;
            password_hash: string | null;
            active: boolean | null;
        } | null;
    } & {
        id: string;
        created_at: Date;
        direction: string;
        notes: string | null;
        created_by: string | null;
        warehouse_id: string;
        product_id: string;
        movement_type: string;
        quantity: import("@prisma/client/runtime/client").Decimal;
        reference_type: string | null;
        reference_id: string | null;
    })[]>;
    createMovement(dto: CreateStockMovementDto): Promise<{
        id: string;
        created_at: Date;
        direction: string;
        notes: string | null;
        created_by: string | null;
        warehouse_id: string;
        product_id: string;
        movement_type: string;
        quantity: import("@prisma/client/runtime/client").Decimal;
        reference_type: string | null;
        reference_id: string | null;
    }>;
}
