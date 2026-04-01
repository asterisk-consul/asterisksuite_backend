import { PrismaService } from '@/prisma/prisma.service';
import { CreateTransferRateDto } from './dto/create-transfer-rate.dto';
import { UpdateTransferRateDto } from './dto/update-transfer-rate.dto';
export declare class TransferRatesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateTransferRateDto): import("../../../../generated/prisma/models").Prisma__transfer_ratesClient<{
        name: string;
        id: string;
        created_at: Date | null;
        active: boolean | null;
        description: string | null;
        rate_type: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    findAll(): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        name: string;
        id: string;
        created_at: Date | null;
        active: boolean | null;
        description: string | null;
        rate_type: string;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        created_at: Date | null;
        active: boolean | null;
        description: string | null;
        rate_type: string;
    }>;
    update(id: string, data: UpdateTransferRateDto): Promise<{
        name: string;
        id: string;
        created_at: Date | null;
        active: boolean | null;
        description: string | null;
        rate_type: string;
    }>;
    deactivate(id: string): Promise<{
        name: string;
        id: string;
        created_at: Date | null;
        active: boolean | null;
        description: string | null;
        rate_type: string;
    }>;
    active(id: string): Promise<{
        name: string;
        id: string;
        created_at: Date | null;
        active: boolean | null;
        description: string | null;
        rate_type: string;
    }>;
}
