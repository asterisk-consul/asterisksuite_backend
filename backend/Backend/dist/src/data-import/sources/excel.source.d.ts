import { DataSource } from '../core/interfaces';
export declare class ExcelSource implements DataSource {
    private file;
    constructor(file: Express.Multer.File);
    load(): Promise<unknown[]>;
}
