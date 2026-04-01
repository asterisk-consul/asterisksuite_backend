import { PrismaService } from '../prisma/prisma.service';
export declare class DataImportService {
    private prisma;
    constructor(prisma: PrismaService);
    importArticuloPrecio(file: Express.Multer.File): Promise<{
        success: boolean;
        total: number;
        parsed: number;
        saved: number;
        failed: number;
        errors: {
            row: number;
            data: unknown;
            errors: string[];
        }[];
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        total: number;
        parsed: number;
        saved: number;
        failed: number;
        message: any;
        error: any;
        errors?: undefined;
    }>;
    importCompras(file: Express.Multer.File): Promise<{
        success: boolean;
        total: number;
        parsed: number;
        saved: number;
        failed: number;
        errors: {
            row: number;
            data: unknown;
            errors: string[];
        }[];
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        total: number;
        parsed: number;
        saved: number;
        failed: number;
        message: any;
        error: any;
        errors?: undefined;
    }>;
}
