import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
export declare class DocumentSequencesService {
    private prisma;
    constructor(prisma: PrismaService);
    getNextNumber(tx: Prisma.TransactionClient, documentType: string, pointOfSale: string): Promise<string>;
}
