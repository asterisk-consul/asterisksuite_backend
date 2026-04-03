import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripStatus } from '@/generated/prisma/enums';
export declare class TripsController {
    private readonly service;
    constructor(service: TripsService);
    findOne(id: string): Promise<any>;
    updateStatus(id: string, status: TripStatus): Promise<{
        id: string;
        created_at: Date;
        week: string | null;
        status: TripStatus;
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
    }>;
    findAll(): Promise<any[]>;
    update(id: string, dto: UpdateTripDto): Promise<{
        vehicle_combination: ({
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
        }) | null;
    } & {
        id: string;
        created_at: Date;
        week: string | null;
        status: TripStatus;
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
    }>;
    remove(id: string): Promise<{
        id: string;
        created_at: Date;
        week: string | null;
        status: TripStatus;
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
    }>;
    assignOrders(id: string, dto: any): Promise<{
        success: boolean;
    }>;
    create(dto: CreateTripDto): Promise<{
        vehicle_combination: ({
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
        }) | null;
    } & {
        id: string;
        created_at: Date;
        week: string | null;
        status: TripStatus;
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
    }>;
}
