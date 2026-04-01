import { PrismaService } from '@/prisma/prisma.service';
import { CreateBusinessPartyDto } from './dto/create-business-party.dto';
import { UpdateBusinessPartyDto } from './dto/update-business-party.dto';
export declare class BusinessPartiesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateBusinessPartyDto): Promise<{
        party_locations: ({
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
            };
        } & {
            id: string;
            created_at: Date;
            party_id: string;
            location_id: string;
            label: string | null;
        })[];
        party_contacts: {
            email: string | null;
            role: string | null;
            id: string;
            created_at: Date;
            party_id: string | null;
            phone: string | null;
            first_name: string;
            last_name: string;
        }[];
    } & {
        name: string;
        id: string;
        created_at: Date;
        active: boolean;
        type: string;
        tax_id: string | null;
    }>;
    findAll(): Promise<({
        party_locations: ({
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
            };
        } & {
            id: string;
            created_at: Date;
            party_id: string;
            location_id: string;
            label: string | null;
        })[];
        party_contacts: {
            email: string | null;
            role: string | null;
            id: string;
            created_at: Date;
            party_id: string | null;
            phone: string | null;
            first_name: string;
            last_name: string;
        }[];
    } & {
        name: string;
        id: string;
        created_at: Date;
        active: boolean;
        type: string;
        tax_id: string | null;
    })[]>;
    findOne(id: string): Promise<{
        party_locations: ({
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
            };
        } & {
            id: string;
            created_at: Date;
            party_id: string;
            location_id: string;
            label: string | null;
        })[];
        party_contacts: {
            email: string | null;
            role: string | null;
            id: string;
            created_at: Date;
            party_id: string | null;
            phone: string | null;
            first_name: string;
            last_name: string;
        }[];
    } & {
        name: string;
        id: string;
        created_at: Date;
        active: boolean;
        type: string;
        tax_id: string | null;
    }>;
    update(id: string, data: UpdateBusinessPartyDto): Promise<{
        party_locations: ({
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
            };
        } & {
            id: string;
            created_at: Date;
            party_id: string;
            location_id: string;
            label: string | null;
        })[];
        party_contacts: {
            email: string | null;
            role: string | null;
            id: string;
            created_at: Date;
            party_id: string | null;
            phone: string | null;
            first_name: string;
            last_name: string;
        }[];
    } & {
        name: string;
        id: string;
        created_at: Date;
        active: boolean;
        type: string;
        tax_id: string | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        created_at: Date;
        active: boolean;
        type: string;
        tax_id: string | null;
    }>;
    private fullInclude;
}
