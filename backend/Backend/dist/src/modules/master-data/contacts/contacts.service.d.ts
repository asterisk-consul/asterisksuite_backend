import { PrismaService } from '@/prisma/prisma.service';
import { CreatePartyContactDto } from './dto/create-party-contact.dto';
import { UpdatePartyContactDto } from './dto/update-party-contact.dto';
export declare class PartyContactsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePartyContactDto): Promise<{
        email: string | null;
        role: string | null;
        id: string;
        created_at: Date;
        party_id: string | null;
        phone: string | null;
        first_name: string;
        last_name: string;
    }>;
    findAll(party_id?: string): Promise<({
        business_parties: {
            name: string;
            id: string;
            created_at: Date;
            active: boolean;
            type: string;
            tax_id: string | null;
        } | null;
    } & {
        email: string | null;
        role: string | null;
        id: string;
        created_at: Date;
        party_id: string | null;
        phone: string | null;
        first_name: string;
        last_name: string;
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
    } & {
        email: string | null;
        role: string | null;
        id: string;
        created_at: Date;
        party_id: string | null;
        phone: string | null;
        first_name: string;
        last_name: string;
    }>;
    update(id: string, dto: UpdatePartyContactDto): Promise<{
        email: string | null;
        role: string | null;
        id: string;
        created_at: Date;
        party_id: string | null;
        phone: string | null;
        first_name: string;
        last_name: string;
    }>;
    remove(id: string): Promise<{
        email: string | null;
        role: string | null;
        id: string;
        created_at: Date;
        party_id: string | null;
        phone: string | null;
        first_name: string;
        last_name: string;
    }>;
}
