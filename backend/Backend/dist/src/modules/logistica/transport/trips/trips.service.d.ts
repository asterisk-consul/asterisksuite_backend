import { PrismaService } from '@/prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
export declare class TripsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        trip_stops: ({
            location: {
                id: string;
                created_at: Date;
                address: string | null;
                city: string | null;
                province: string | null;
                country: string | null;
                latitude: import("@prisma/client/runtime/client").Decimal | null;
                longitude: import("@prisma/client/runtime/client").Decimal | null;
                postal_code: string | null;
            };
            trip_orders: ({
                dispatch_order: {
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
                    status: string;
                    order_number: string;
                    requires_stock: boolean;
                    planned_date: Date | null;
                    confirmed_at: Date | null;
                    customer_id: string | null;
                    origin_location_id: string | null;
                    corridor_id: string | null;
                    created_by: string | null;
                    destination_location_id: string | null;
                };
            } & {
                id: string;
                created_at: Date;
                dispatch_order_id: string;
                trip_stop_id: string;
                action: string;
            })[];
        } & {
            id: string;
            created_at: Date;
            location_id: string;
            stop_order: number;
            stop_type: string | null;
            trip_id: string;
        })[];
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
            valid_from: Date;
            valid_until: Date | null;
            unit_number: string | null;
            deleted_by: string | null;
            trailer_id: string | null;
            driver_id: string | null;
            tractor_id: string;
        }) | null;
    } & {
        id: string;
        created_at: Date;
        week: string | null;
        status: string;
        notes: string | null;
        origin_location_id: string | null;
        corridor_id: string | null;
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
        dispatch_ordersId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        trip_stops: ({
            location: {
                id: string;
                created_at: Date;
                address: string | null;
                city: string | null;
                province: string | null;
                country: string | null;
                latitude: import("@prisma/client/runtime/client").Decimal | null;
                longitude: import("@prisma/client/runtime/client").Decimal | null;
                postal_code: string | null;
            };
            trip_orders: ({
                dispatch_order: {
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
                    status: string;
                    order_number: string;
                    requires_stock: boolean;
                    planned_date: Date | null;
                    confirmed_at: Date | null;
                    customer_id: string | null;
                    origin_location_id: string | null;
                    corridor_id: string | null;
                    created_by: string | null;
                    destination_location_id: string | null;
                };
            } & {
                id: string;
                created_at: Date;
                dispatch_order_id: string;
                trip_stop_id: string;
                action: string;
            })[];
        } & {
            id: string;
            created_at: Date;
            location_id: string;
            stop_order: number;
            stop_type: string | null;
            trip_id: string;
        })[];
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
            valid_from: Date;
            valid_until: Date | null;
            unit_number: string | null;
            deleted_by: string | null;
            trailer_id: string | null;
            driver_id: string | null;
            tractor_id: string;
        }) | null;
    } & {
        id: string;
        created_at: Date;
        week: string | null;
        status: string;
        notes: string | null;
        origin_location_id: string | null;
        corridor_id: string | null;
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
        dispatch_ordersId: string | null;
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
            valid_from: Date;
            valid_until: Date | null;
            unit_number: string | null;
            deleted_by: string | null;
            trailer_id: string | null;
            driver_id: string | null;
            tractor_id: string;
        }) | null;
    } & {
        id: string;
        created_at: Date;
        week: string | null;
        status: string;
        notes: string | null;
        origin_location_id: string | null;
        corridor_id: string | null;
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
        dispatch_ordersId: string | null;
    }>;
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
            valid_from: Date;
            valid_until: Date | null;
            unit_number: string | null;
            deleted_by: string | null;
            trailer_id: string | null;
            driver_id: string | null;
            tractor_id: string;
        }) | null;
    } & {
        id: string;
        created_at: Date;
        week: string | null;
        status: string;
        notes: string | null;
        origin_location_id: string | null;
        corridor_id: string | null;
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
        dispatch_ordersId: string | null;
    }>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        created_at: Date;
        week: string | null;
        status: string;
        notes: string | null;
        origin_location_id: string | null;
        corridor_id: string | null;
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
        dispatch_ordersId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        created_at: Date;
        week: string | null;
        status: string;
        notes: string | null;
        origin_location_id: string | null;
        corridor_id: string | null;
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
        dispatch_ordersId: string | null;
    }>;
    assignOrders(tripId: string, dto: {
        stops: {
            location_id: string;
            stop_order: number;
            stop_type?: string;
            orders: {
                dispatch_order_id: string;
                action: string;
            }[];
        }[];
    }): Promise<{
        success: boolean;
    }>;
}
