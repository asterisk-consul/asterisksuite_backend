import { TransferRatesService } from './transfer-rates.service';
import { CreateTransferRateDto } from './dto/create-transfer-rate.dto';
import { UpdateTransferRateDto } from './dto/update-transfer-rate.dto';
export declare class TransferRatesController {
    private readonly service;
    constructor(service: TransferRatesService);
    create(dto: CreateTransferRateDto): import("../../../../generated/prisma/models").Prisma__transfer_ratesClient<{
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
    update(id: string, dto: UpdateTransferRateDto): Promise<{
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
    activate(id: string): Promise<{
        name: string;
        id: string;
        created_at: Date | null;
        active: boolean | null;
        description: string | null;
        rate_type: string;
    }>;
}
