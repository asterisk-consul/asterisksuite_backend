import { PrismaService } from '@/prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
export declare class DriversService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        driverDocuments: ({
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
            driver_id: string;
        })[];
    } & {
        id: string;
        created_at: Date;
        active: boolean;
        phone: string | null;
        first_name: string;
        last_name: string;
        document: string | null;
    })[]>;
    findOne(id: string): Promise<{
        driverDocuments: ({
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
            driver_id: string;
        })[];
    } & {
        id: string;
        created_at: Date;
        active: boolean;
        phone: string | null;
        first_name: string;
        last_name: string;
        document: string | null;
    }>;
    create(dto: CreateDriverDto): Promise<{
        driverDocuments: ({
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
            driver_id: string;
        })[];
    } & {
        id: string;
        created_at: Date;
        active: boolean;
        phone: string | null;
        first_name: string;
        last_name: string;
        document: string | null;
    }>;
    update(id: string, dto: UpdateDriverDto): Promise<({
        driverDocuments: ({
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
            driver_id: string;
        })[];
    } & {
        id: string;
        created_at: Date;
        active: boolean;
        phone: string | null;
        first_name: string;
        last_name: string;
        document: string | null;
    }) | null>;
    activate(id: string): Promise<{
        deleted: boolean;
    }>;
    desactivate(id: string): Promise<{
        id: string;
        created_at: Date;
        active: boolean;
        phone: string | null;
        first_name: string;
        last_name: string;
        document: string | null;
    }>;
}
