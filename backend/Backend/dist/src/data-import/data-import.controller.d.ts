import { DataImportService } from './data-import.service';
export declare class DataImportController {
    private service;
    constructor(service: DataImportService);
    uploadArticuloPrecio(file: Express.Multer.File): Promise<{
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
    uploadCompras(file: Express.Multer.File): Promise<{
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
    debug(file: Express.Multer.File): Promise<unknown>;
}
