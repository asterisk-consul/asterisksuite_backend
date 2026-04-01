import { CorridorsService } from './corridors.service';
import { CreateCorridorDto } from './dto/create-corridor.dto';
import { UpdateCorridorDto } from './dto/update-corridor.dto';
export declare class CorridorsController {
    private readonly service;
    constructor(service: CorridorsService);
    create(dto: CreateCorridorDto): Promise<{
        corridorStops: {
            id: string;
            created_at: Date;
            location_id: string;
            corridor_id: string;
            estimated_minutes: number | null;
            stop_order: number;
            stop_type: string | null;
            distance_km: import("@prisma/client/runtime/client").Decimal | null;
        }[];
    } & {
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
    }>;
    findAll(): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        corridorStops: ({
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
        } & {
            id: string;
            created_at: Date;
            location_id: string;
            corridor_id: string;
            estimated_minutes: number | null;
            stop_order: number;
            stop_type: string | null;
            distance_km: import("@prisma/client/runtime/client").Decimal | null;
        })[];
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
        };
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
        };
    } & {
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
    })[]>;
    findTemplates(): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
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
    }[]>;
    findOne(id: string): import("../../../../generated/prisma/models").Prisma__corridorsClient<({
        corridorStops: ({
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
        } & {
            id: string;
            created_at: Date;
            location_id: string;
            corridor_id: string;
            estimated_minutes: number | null;
            stop_order: number;
            stop_type: string | null;
            distance_km: import("@prisma/client/runtime/client").Decimal | null;
        })[];
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
        };
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
        };
    } & {
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
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    getRoute(id: string): Promise<{
        id: string;
        name: string | null;
        total_distance_km: import("@prisma/client/runtime/client").Decimal | null;
        estimated_minutes: number | null;
        route: {
            id: string;
            created_at: Date;
            address: string | null;
            city: string | null;
            province: string | null;
            country: string | null;
            latitude: import("@prisma/client/runtime/client").Decimal | null;
            longitude: import("@prisma/client/runtime/client").Decimal | null;
            postal_code: string | null;
            type: string;
        }[];
    } | null>;
    update(id: string, dto: UpdateCorridorDto): Promise<{
        corridorStops: ({
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
        } & {
            id: string;
            created_at: Date;
            location_id: string;
            corridor_id: string;
            estimated_minutes: number | null;
            stop_order: number;
            stop_type: string | null;
            distance_km: import("@prisma/client/runtime/client").Decimal | null;
        })[];
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
        };
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
        };
    } & {
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
    }>;
    remove(id: string): import("../../../../generated/prisma/models").Prisma__corridorsClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
