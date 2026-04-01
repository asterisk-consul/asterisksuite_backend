import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class LocationsController {
    private readonly service;
    constructor(service: LocationsService);
    create(dto: CreateLocationDto): Promise<{
        id: string;
        created_at: Date;
        address: string | null;
        city: string | null;
        province: string | null;
        country: string | null;
        latitude: import("@prisma/client/runtime/client").Decimal | null;
        longitude: import("@prisma/client/runtime/client").Decimal | null;
        postal_code: string | null;
    }>;
    findAll(): Promise<{
        id: string;
        created_at: Date;
        address: string | null;
        city: string | null;
        province: string | null;
        country: string | null;
        latitude: import("@prisma/client/runtime/client").Decimal | null;
        longitude: import("@prisma/client/runtime/client").Decimal | null;
        postal_code: string | null;
    }[]>;
    findOne(id: string): Promise<{
        warehouses: {
            name: string;
            id: string;
            created_at: Date;
            active: boolean;
            code: string | null;
            location_id: string | null;
        }[];
    } & {
        id: string;
        created_at: Date;
        address: string | null;
        city: string | null;
        province: string | null;
        country: string | null;
        latitude: import("@prisma/client/runtime/client").Decimal | null;
        longitude: import("@prisma/client/runtime/client").Decimal | null;
        postal_code: string | null;
    }>;
    update(id: string, dto: UpdateLocationDto): Promise<{
        id: string;
        created_at: Date;
        address: string | null;
        city: string | null;
        province: string | null;
        country: string | null;
        latitude: import("@prisma/client/runtime/client").Decimal | null;
        longitude: import("@prisma/client/runtime/client").Decimal | null;
        postal_code: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        created_at: Date;
        address: string | null;
        city: string | null;
        province: string | null;
        country: string | null;
        latitude: import("@prisma/client/runtime/client").Decimal | null;
        longitude: import("@prisma/client/runtime/client").Decimal | null;
        postal_code: string | null;
    }>;
}
