import { DispatchOrdersService } from './dispatch-orders.service';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { CreateDispatchOrderDto, UpdateDispatchOrderDto } from './dto/dispatch-order.dto';
export declare class DispatchOrdersController {
    private readonly service;
    constructor(service: DispatchOrdersService);
    create(dto: CreateDispatchOrderDto, user: AuthUser): Promise<{
        corridors: {
            name: string | null;
            id: string;
            created_at: Date;
            active: boolean;
            description: string | null;
            origin_location_id: string;
            destination_location_id: string;
            is_template: boolean;
            total_distance_km: import("@prisma/client/runtime/client").Decimal | null;
            estimated_minutes: number | null;
        } | null;
        dispatch_rates: ({
            transfer_rates: {
                name: string;
                id: string;
                created_at: Date | null;
                active: boolean | null;
                description: string | null;
                rate_type: string;
            };
        } & {
            id: string;
            created_at: Date;
            rate_id: string;
            value: import("@prisma/client/runtime/client").Decimal;
            dispatch_id: string;
        })[];
        customers: {
            name: string;
            id: string;
            created_at: Date;
            active: boolean;
            type: string;
            tax_id: string | null;
        } | null;
        origin_location: {
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
        destination_location: {
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
        id: string;
        created_at: Date;
        status: import("../../../../generated/prisma/enums").DispatchStatus;
        order_number: string;
        requires_stock: boolean;
        planned_date: Date | null;
        confirmed_at: Date | null;
        customer_id: string | null;
        origin_location_id: string | null;
        corridor_id: string | null;
        created_by: string | null;
        destination_location_id: string | null;
    }>;
    findAll(): Promise<({
        corridors: {
            name: string | null;
            id: string;
            created_at: Date;
            active: boolean;
            description: string | null;
            origin_location_id: string;
            destination_location_id: string;
            is_template: boolean;
            total_distance_km: import("@prisma/client/runtime/client").Decimal | null;
            estimated_minutes: number | null;
        } | null;
        dispatch_rates: {
            id: string;
            created_at: Date;
            rate_id: string;
            value: import("@prisma/client/runtime/client").Decimal;
            dispatch_id: string;
        }[];
        customers: {
            name: string;
            id: string;
            created_at: Date;
            active: boolean;
            type: string;
            tax_id: string | null;
        } | null;
        origin_location: {
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
        tripStopOrders: ({
            trip_stop: {
                trip: {
                    id: string;
                    created_at: Date;
                    week: string | null;
                    status: import("../../../../generated/prisma/enums").TripStatus;
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
                };
            } & {
                id: string;
                created_at: Date;
                location_id: string;
                stop_order: number;
                stop_type: string | null;
                trip_id: string;
            };
        } & {
            id: string;
            created_at: Date;
            dispatch_order_id: string;
            trip_stop_id: string;
            action: string;
        })[];
        destination_location: {
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
        id: string;
        created_at: Date;
        status: import("../../../../generated/prisma/enums").DispatchStatus;
        order_number: string;
        requires_stock: boolean;
        planned_date: Date | null;
        confirmed_at: Date | null;
        customer_id: string | null;
        origin_location_id: string | null;
        corridor_id: string | null;
        created_by: string | null;
        destination_location_id: string | null;
    })[]>;
    findOne(id: string): Promise<{
        corridors: {
            name: string | null;
            id: string;
            created_at: Date;
            active: boolean;
            description: string | null;
            origin_location_id: string;
            destination_location_id: string;
            is_template: boolean;
            total_distance_km: import("@prisma/client/runtime/client").Decimal | null;
            estimated_minutes: number | null;
        } | null;
        dispatch_rates: {
            id: string;
            created_at: Date;
            rate_id: string;
            value: import("@prisma/client/runtime/client").Decimal;
            dispatch_id: string;
        }[];
        customers: {
            name: string;
            id: string;
            created_at: Date;
            active: boolean;
            type: string;
            tax_id: string | null;
        } | null;
        origin_location: {
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
        tripStopOrders: ({
            trip_stop: {
                trip: {
                    id: string;
                    created_at: Date;
                    week: string | null;
                    status: import("../../../../generated/prisma/enums").TripStatus;
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
                };
            } & {
                id: string;
                created_at: Date;
                location_id: string;
                stop_order: number;
                stop_type: string | null;
                trip_id: string;
            };
        } & {
            id: string;
            created_at: Date;
            dispatch_order_id: string;
            trip_stop_id: string;
            action: string;
        })[];
        destination_location: {
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
        id: string;
        created_at: Date;
        status: import("../../../../generated/prisma/enums").DispatchStatus;
        order_number: string;
        requires_stock: boolean;
        planned_date: Date | null;
        confirmed_at: Date | null;
        customer_id: string | null;
        origin_location_id: string | null;
        corridor_id: string | null;
        created_by: string | null;
        destination_location_id: string | null;
    }>;
    update(id: string, dto: UpdateDispatchOrderDto): Promise<{
        id: string;
        created_at: Date;
        status: import("../../../../generated/prisma/enums").DispatchStatus;
        order_number: string;
        requires_stock: boolean;
        planned_date: Date | null;
        confirmed_at: Date | null;
        customer_id: string | null;
        origin_location_id: string | null;
        corridor_id: string | null;
        created_by: string | null;
        destination_location_id: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        created_at: Date;
        status: import("../../../../generated/prisma/enums").DispatchStatus;
        order_number: string;
        requires_stock: boolean;
        planned_date: Date | null;
        confirmed_at: Date | null;
        customer_id: string | null;
        origin_location_id: string | null;
        corridor_id: string | null;
        created_by: string | null;
        destination_location_id: string | null;
    }>;
}
