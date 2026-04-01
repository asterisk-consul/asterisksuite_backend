import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
export declare class VehiclesController {
    private readonly service;
    constructor(service: VehiclesService);
    create(dto: CreateVehicleDto): Promise<({
        vehicleDocuments: ({
            transport_document_types: {
                name: string;
                id: string;
                created_at: Date | null;
                active: boolean | null;
                entity: string;
            };
        } & {
            id: string;
            created_at: Date | null;
            document_type_id: string;
            expiration_date: Date | null;
            vehicle_id: string;
        })[];
    } & {
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
    }) | null>;
    findAll(): Promise<({
        vehicleDocuments: ({
            transport_document_types: {
                name: string;
                id: string;
                created_at: Date | null;
                active: boolean | null;
                entity: string;
            };
        } & {
            id: string;
            created_at: Date | null;
            document_type_id: string;
            expiration_date: Date | null;
            vehicle_id: string;
        })[];
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        vehicleDocuments: ({
            transport_document_types: {
                name: string;
                id: string;
                created_at: Date | null;
                active: boolean | null;
                entity: string;
            };
        } & {
            id: string;
            created_at: Date | null;
            document_type_id: string;
            expiration_date: Date | null;
            vehicle_id: string;
        })[];
    } & {
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
    }>;
    update(id: string, dto: UpdateVehicleDto): Promise<({
        vehicleDocuments: ({
            transport_document_types: {
                name: string;
                id: string;
                created_at: Date | null;
                active: boolean | null;
                entity: string;
            };
        } & {
            id: string;
            created_at: Date | null;
            document_type_id: string;
            expiration_date: Date | null;
            vehicle_id: string;
        })[];
    } & {
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
    }) | null>;
    deactivate(id: string): Promise<({
        vehicleDocuments: ({
            transport_document_types: {
                name: string;
                id: string;
                created_at: Date | null;
                active: boolean | null;
                entity: string;
            };
        } & {
            id: string;
            created_at: Date | null;
            document_type_id: string;
            expiration_date: Date | null;
            vehicle_id: string;
        })[];
    } & {
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
    }) | null>;
    activate(id: string): Promise<({
        vehicleDocuments: ({
            transport_document_types: {
                name: string;
                id: string;
                created_at: Date | null;
                active: boolean | null;
                entity: string;
            };
        } & {
            id: string;
            created_at: Date | null;
            document_type_id: string;
            expiration_date: Date | null;
            vehicle_id: string;
        })[];
    } & {
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
    }) | null>;
}
