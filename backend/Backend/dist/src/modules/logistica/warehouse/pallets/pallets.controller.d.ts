import { PalletsService } from './pallets.service';
import { CreatePalletDto } from './dto/create-pallet.dto';
import { UpdatePalletDto } from './dto/update-pallet.dto';
export declare class PalletsController {
    private readonly service;
    constructor(service: PalletsService);
    create(dto: CreatePalletDto): Promise<{
        id: string;
        created_at: Date;
        code: string;
        status: string;
        created_by: string | null;
        deleted_at: Date | null;
        warehouse_id: string | null;
    }>;
    findAll(): Promise<({
        pallet_items: ({
            products: {
                name: string;
                id: string;
                created_at: Date;
                sku: string | null;
                requires_refrigeration: boolean | null;
            };
        } & {
            id: string;
            product_id: string;
            quantity: import("@prisma/client/runtime/client").Decimal;
            pallet_id: string;
        })[];
        warehouses: {
            name: string;
            id: string;
            created_at: Date;
            active: boolean;
            code: string | null;
            location_id: string | null;
        } | null;
    } & {
        id: string;
        created_at: Date;
        code: string;
        status: string;
        created_by: string | null;
        deleted_at: Date | null;
        warehouse_id: string | null;
    })[]>;
    findOne(id: string): Promise<{
        pallet_items: ({
            products: {
                name: string;
                id: string;
                created_at: Date;
                sku: string | null;
                requires_refrigeration: boolean | null;
            };
        } & {
            id: string;
            product_id: string;
            quantity: import("@prisma/client/runtime/client").Decimal;
            pallet_id: string;
        })[];
        warehouses: {
            name: string;
            id: string;
            created_at: Date;
            active: boolean;
            code: string | null;
            location_id: string | null;
        } | null;
    } & {
        id: string;
        created_at: Date;
        code: string;
        status: string;
        created_by: string | null;
        deleted_at: Date | null;
        warehouse_id: string | null;
    }>;
    update(id: string, dto: UpdatePalletDto): Promise<{
        id: string;
        created_at: Date;
        code: string;
        status: string;
        created_by: string | null;
        deleted_at: Date | null;
        warehouse_id: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        created_at: Date;
        code: string;
        status: string;
        created_by: string | null;
        deleted_at: Date | null;
        warehouse_id: string | null;
    }>;
}
