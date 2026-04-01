import { PrismaService } from '@/prisma/prisma.service';
import { CreateDocumentsTypesDto } from './dto/create-documentsTypes.dto';
export declare class DocumentTypesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateDocumentsTypesDto): Promise<{
        id: string;
        active: boolean;
        code: string;
        document_sequence_id: string | null;
        description: string;
        direction: number;
        affects_stock: boolean;
        affects_accounting: boolean;
    }>;
}
