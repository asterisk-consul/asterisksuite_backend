import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly service;
    constructor(service: ProductsService);
    create(dto: CreateProductDto): Promise<{
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
    update(id: string, dto: UpdateProductDto): Promise<{
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
