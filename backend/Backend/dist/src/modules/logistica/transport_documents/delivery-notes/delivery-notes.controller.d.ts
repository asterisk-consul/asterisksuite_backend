import { DeliveryNotesService } from './delivery-notes.service';
import { CreateDeliveryNoteDto } from './dto/create-delivery-note.dto';
import { UpdateDeliveryNoteDto } from './dto/update-delivery-note.dto';
import { QueryDeliveryNoteDto } from './dto/query-delivery-note.dto';
import type { AuthUser } from '@/auth/types/auth-user.interface';
export declare class DeliveryNotesController {
    private readonly service;
    constructor(service: DeliveryNotesService);
    create(dto: CreateDeliveryNoteDto, user: AuthUser): Promise<{
        number: string;
        id: string;
        created_at: Date;
        type: string;
        party_id: string | null;
        status: string;
        created_by: string | null;
        deleted_at: Date | null;
        trip_id: string | null;
        dispatch_order_id: string | null;
    }>;
    confirm(id: string): Promise<{
        number: string;
        id: string;
        created_at: Date;
        type: string;
        party_id: string | null;
        status: string;
        created_by: string | null;
        deleted_at: Date | null;
        trip_id: string | null;
        dispatch_order_id: string | null;
    }>;
    findAll(query: QueryDeliveryNoteDto): Promise<({
        business_parties: {
            name: string;
            id: string;
            created_at: Date;
            active: boolean;
            type: string;
            tax_id: string | null;
        } | null;
        trips: {
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
        } | null;
    } & {
        number: string;
        id: string;
        created_at: Date;
        type: string;
        party_id: string | null;
        status: string;
        created_by: string | null;
        deleted_at: Date | null;
        trip_id: string | null;
        dispatch_order_id: string | null;
    })[]>;
    findOne(id: string): Promise<{
        business_parties: {
            name: string;
            id: string;
            created_at: Date;
            active: boolean;
            type: string;
            tax_id: string | null;
        } | null;
        picking_orders: {
            id: string;
            created_at: Date;
            status: string;
            created_by: string | null;
            trip_id: string | null;
            warehouse_id: string;
            dispatch_order_id: string | null;
            client_id: string | null;
            delivery_note_id: string | null;
        }[];
        trip_cargo: {
            id: string;
            trip_id: string;
            pallet_id: string | null;
            delivery_note_id: string | null;
            loaded_at: Date | null;
            unloaded_at: Date | null;
        }[];
        trips: {
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
        } | null;
    } & {
        number: string;
        id: string;
        created_at: Date;
        type: string;
        party_id: string | null;
        status: string;
        created_by: string | null;
        deleted_at: Date | null;
        trip_id: string | null;
        dispatch_order_id: string | null;
    }>;
    update(id: string, dto: UpdateDeliveryNoteDto): Promise<{
        number: string;
        id: string;
        created_at: Date;
        type: string;
        party_id: string | null;
        status: string;
        created_by: string | null;
        deleted_at: Date | null;
        trip_id: string | null;
        dispatch_order_id: string | null;
    }>;
    remove(id: string): Promise<{
        number: string;
        id: string;
        created_at: Date;
        type: string;
        party_id: string | null;
        status: string;
        created_by: string | null;
        deleted_at: Date | null;
        trip_id: string | null;
        dispatch_order_id: string | null;
    }>;
}
