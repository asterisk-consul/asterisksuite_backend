import { DataSource, Parser, Transformer, Sink } from './interfaces';
export declare class ImportPipeline<TRaw, TTransformed> {
    private source;
    private parser;
    private transformer;
    private sink;
    constructor(source: DataSource, parser: Parser<TRaw>, transformer: Transformer<TRaw, TTransformed>, sink: Sink<TTransformed>);
    run(): Promise<{
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
