import { Sink } from '../../core/interfaces';
import { PrismaService } from '../../../prisma/prisma.service';
import { ComprasTransformado } from '../transformer/compras.transformer';
export declare class FacturaSink implements Sink<ComprasTransformado> {
    private prisma;
    constructor(prisma: PrismaService);
    send(data: ComprasTransformado[]): Promise<void>;
}
