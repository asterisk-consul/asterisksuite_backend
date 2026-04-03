import { PrismaService } from '@/prisma/prisma.service';
import { CreateVehicleCombinationDto } from './dto/create-vehicle-combination.dto';
import { UpdateVehicleCombinationDto } from './dto/update-vehicle-combination.dto';
export declare class VehicleCombinationsService {
    private prisma;
    constructor(prisma: PrismaService);
    private validateActiveConflicts;
    private validateUnitNumber;
    create(dto: CreateVehicleCombinationDto, user_id?: string): Promise<{
        drivers: {
            id: string;
            created_at: Date;
            active: boolean;
            phone: string | null;
            first_name: string;
            last_name: string;
            document: string | null;
        } | null;
        tractor: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        };
        trailer: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        } | null;
    } & {
        id: string;
        created_at: Date;
        created_by: string | null;
        deleted_at: Date | null;
        tractor_id: string;
        trailer_id: string | null;
        valid_from: Date;
        valid_until: Date | null;
        unit_number: string | null;
        driver_id: string | null;
        deleted_by: string | null;
    }>;
    findAll(): Promise<({
        drivers: {
            id: string;
            created_at: Date;
            active: boolean;
            phone: string | null;
            first_name: string;
            last_name: string;
            document: string | null;
        } | null;
        tractor: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        };
        trailer: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        } | null;
    } & {
        id: string;
        created_at: Date;
        created_by: string | null;
        deleted_at: Date | null;
        tractor_id: string;
        trailer_id: string | null;
        valid_from: Date;
        valid_until: Date | null;
        unit_number: string | null;
        driver_id: string | null;
        deleted_by: string | null;
    })[]>;
    findActive(): Promise<({
        drivers: {
            id: string;
            created_at: Date;
            active: boolean;
            phone: string | null;
            first_name: string;
            last_name: string;
            document: string | null;
        } | null;
        tractor: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        };
        trailer: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        } | null;
    } & {
        id: string;
        created_at: Date;
        created_by: string | null;
        deleted_at: Date | null;
        tractor_id: string;
        trailer_id: string | null;
        valid_from: Date;
        valid_until: Date | null;
        unit_number: string | null;
        driver_id: string | null;
        deleted_by: string | null;
    })[]>;
    findAvailable(date: string): Promise<({
        drivers: {
            id: string;
            created_at: Date;
            active: boolean;
            phone: string | null;
            first_name: string;
            last_name: string;
            document: string | null;
        } | null;
        tractor: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        };
        trailer: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        } | null;
    } & {
        id: string;
        created_at: Date;
        created_by: string | null;
        deleted_at: Date | null;
        tractor_id: string;
        trailer_id: string | null;
        valid_from: Date;
        valid_until: Date | null;
        unit_number: string | null;
        driver_id: string | null;
        deleted_by: string | null;
    })[]>;
    findOne(id: string): Promise<{
        drivers: {
            id: string;
            created_at: Date;
            active: boolean;
            phone: string | null;
            first_name: string;
            last_name: string;
            document: string | null;
        } | null;
        trips: {
            id: string;
            created_at: Date;
            week: string | null;
            status: import("@/generated/prisma/client").TripStatus;
            notes: string | null;
            origin_location_id: string | null;
            created_by: string | null;
            destination_location_id: string | null;
            reference_number: string | null;
            departure_time: Date | null;
            arrival_time: Date | null;
            deleted_at: Date | null;
            kilometers: import("@prisma/client/runtime/client").Decimal | null;
            vehicle_combination_id: string | null;
            origin_warehouse_id: string | null;
            destination_warehouse_id: string | null;
        }[];
        tractor: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        };
        trailer: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        } | null;
    } & {
        id: string;
        created_at: Date;
        created_by: string | null;
        deleted_at: Date | null;
        tractor_id: string;
        trailer_id: string | null;
        valid_from: Date;
        valid_until: Date | null;
        unit_number: string | null;
        driver_id: string | null;
        deleted_by: string | null;
    }>;
    finish(id: string): Promise<{
        drivers: {
            id: string;
            created_at: Date;
            active: boolean;
            phone: string | null;
            first_name: string;
            last_name: string;
            document: string | null;
        } | null;
        tractor: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        };
        trailer: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        } | null;
    } & {
        id: string;
        created_at: Date;
        created_by: string | null;
        deleted_at: Date | null;
        tractor_id: string;
        trailer_id: string | null;
        valid_from: Date;
        valid_until: Date | null;
        unit_number: string | null;
        driver_id: string | null;
        deleted_by: string | null;
    }>;
    activate(id: string): Promise<{
        drivers: {
            id: string;
            created_at: Date;
            active: boolean;
            phone: string | null;
            first_name: string;
            last_name: string;
            document: string | null;
        } | null;
        tractor: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        };
        trailer: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        } | null;
    } & {
        id: string;
        created_at: Date;
        created_by: string | null;
        deleted_at: Date | null;
        tractor_id: string;
        trailer_id: string | null;
        valid_from: Date;
        valid_until: Date | null;
        unit_number: string | null;
        driver_id: string | null;
        deleted_by: string | null;
    }>;
    update(id: string, dto: UpdateVehicleCombinationDto): Promise<{
        drivers: {
            id: string;
            created_at: Date;
            active: boolean;
            phone: string | null;
            first_name: string;
            last_name: string;
            document: string | null;
        } | null;
        tractor: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        };
        trailer: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        } | null;
    } & {
        id: string;
        created_at: Date;
        created_by: string | null;
        deleted_at: Date | null;
        tractor_id: string;
        trailer_id: string | null;
        valid_from: Date;
        valid_until: Date | null;
        unit_number: string | null;
        driver_id: string | null;
        deleted_by: string | null;
    }>;
    findByVehicle(vehicle_id: string): Promise<({
        drivers: {
            id: string;
            created_at: Date;
            active: boolean;
            phone: string | null;
            first_name: string;
            last_name: string;
            document: string | null;
        } | null;
        tractor: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        };
        trailer: {
            id: string;
            created_at: Date;
            year: number | null;
            active: boolean;
            type: string;
            plate: string;
            brand: string | null;
            model: string | null;
            refrigeration: boolean | null;
            max_weight: import("@prisma/client/runtime/client").Decimal | null;
            max_volume: import("@prisma/client/runtime/client").Decimal | null;
        } | null;
    } & {
        id: string;
        created_at: Date;
        created_by: string | null;
        deleted_at: Date | null;
        tractor_id: string;
        trailer_id: string | null;
        valid_from: Date;
        valid_until: Date | null;
        unit_number: string | null;
        driver_id: string | null;
        deleted_by: string | null;
    })[]>;
    remove(id: string, user_id?: string): Promise<{
        id: string;
        created_at: Date;
        created_by: string | null;
        deleted_at: Date | null;
        tractor_id: string;
        trailer_id: string | null;
        valid_from: Date;
        valid_until: Date | null;
        unit_number: string | null;
        driver_id: string | null;
        deleted_by: string | null;
    }>;
}
