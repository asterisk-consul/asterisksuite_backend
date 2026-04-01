export interface DataSource {
    load(): Promise<unknown[]>;
}
export interface Parser<T> {
    parse(raw: unknown[]): T[];
    parseWithErrors?(raw: unknown[]): ParseResult<T>;
}
export interface ParseResult<T> {
    success: T[];
    errors: Array<{
        row: number;
        data: unknown;
        errors: string[];
    }>;
}
export interface Transformer<I, O> {
    transform(input: I[]): Promise<O[]>;
}
export interface Sink<T> {
    send(data: T[]): Promise<void>;
}
