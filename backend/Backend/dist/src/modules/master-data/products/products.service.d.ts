import { PrismaService } from '@/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateProductDto): Promise<{
        name: string;
        id: string;
        created_at: Date;
        sku: string | null;
        requires_refrigeration: boolean | null;
    }>;
    findAll(): Promise<{
        name: string;
        id: string;
        created_at: Date;
        sku: string | null;
        requires_refrigeration: boolean | null;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        created_at: Date;
        sku: string | null;
        requires_refrigeration: boolean | null;
    }>;
    update(id: string, data: UpdateProductDto): Promise<{
        name: string;
        id: string;
        created_at: Date;
        sku: string | null;
        requires_refrigeration: boolean | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        created_at: Date;
        sku: string | null;
        requires_refrigeration: boolean | null;
    }>;
}
