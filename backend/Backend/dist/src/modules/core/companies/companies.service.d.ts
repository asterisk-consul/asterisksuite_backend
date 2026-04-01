import { PrismaService } from '@/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createCompanyDto: CreateCompanyDto): Promise<{
        name: string;
        id: string;
        created_at: Date;
        tax_id: string | null;
        phone: string | null;
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        created_at: Date;
        tax_id: string | null;
        phone: string | null;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        created_at: Date;
        tax_id: string | null;
        phone: string | null;
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<{
        name: string;
        id: string;
        created_at: Date;
        tax_id: string | null;
        phone: string | null;
    }>;
    deactivate(): void;
}
