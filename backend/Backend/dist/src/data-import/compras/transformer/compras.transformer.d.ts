import { Transformer } from '../../core/interfaces';
import { PrismaService } from '../../../prisma/prisma.service';
import { FacturaCompraRaw } from '../schemas/compras.schema';
export type ComprasTransformado = {
    ref: string;
    document_type_id: string;
    party_id: string;
    number: number;
    date: Date;
    status: number;
    subtotal: number;
    total_taxes: number;
    total: number;
    document_taxes: {
        tax_id: string;
        tax_rate: number;
        taxable_base: number;
        tax_amount: number;
    }[];
    document_items: {
        product_id: string;
        quantity: number;
        price: number;
    }[];
};
export declare class ComprasTransformer implements Transformer<FacturaCompraRaw, ComprasTransformado> {
    private prisma;
    constructor(prisma: PrismaService);
    transform(documents: FacturaCompraRaw[]): Promise<ComprasTransformado[]>;
}
