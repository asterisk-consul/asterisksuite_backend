import { PrismaService } from '@/prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
export declare class WarehousesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateWarehouseDto): Promise<{
        name: string;
        id: string;
        created_at: Date;
        active: boolean;
        code: string | null;
        location_id: string | null;
    }>;
    findAll(): Promise<({
        locations: {
            id: string;
            created_at: Date;
            address: string | null;
            city: string | null;
            province: string | null;
            country: string | null;
            latitude: import("@prisma/client/runtime/client").Decimal | null;
            longitude: import("@prisma/client/runtime/client").Decimal | null;
            postal_code: string | null;
        } | null;
    } & {
        name: string;
        id: string;
        created_at: Date;
        active: boolean;
        code: string | null;
        location_id: string | null;
    })[]>;
    findOne(id: string): Promise<{
        locations: {
            id: string;
            created_at: Date;
            address: string | null;
            city: string | null;
            province: string | null;
            country: string | null;
            latitude: import("@prisma/client/runtime/client").Decimal | null;
            longitude: import("@prisma/client/runtime/client").Decimal | null;
            postal_code: string | null;
        } | null;
        warehouse_stock: {
            id: string;
            updated_at: Date;
            warehouse_id: string;
            product_id: string;
            quantity: import("@prisma/client/runtime/client").Decimal;
            reserved_quantity: import("@prisma/client/runtime/client").Decimal;
        }[];
    } & {
        name: string;
        id: string;
        created_at: Date;
        active: boolean;
        code: string | null;
        location_id: string | null;
    }>;
    update(id: string, data: UpdateWarehouseDto): Promise<{
        locations: {
            id: string;
            created_at: Date;
            address: string | null;
            city: string | null;
            province: string | null;
            country: string | null;
            latitude: import("@prisma/client/runtime/client").Decimal | null;
            longitude: import("@prisma/client/runtime/client").Decimal | null;
            postal_code: string | null;
        } | null;
    } & {
        name: string;
        id: string;
        created_at: Date;
        active: boolean;
        code: string | null;
        location_id: string | null;
    }>;
    desactivate(id: string): Promise<{
        name: string;
        id: string;
        created_at: Date;
        active: boolean;
        code: string | null;
        location_id: string | null;
    }>;
    active(id: string): Promise<{
        name: string;
        id: string;
        created_at: Date;
        active: boolean;
        code: string | null;
        location_id: string | null;
    }>;
}
