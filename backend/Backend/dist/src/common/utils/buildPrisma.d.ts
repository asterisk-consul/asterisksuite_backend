type AnyRecord = Record<string, unknown>;
export declare function omitUndefinedDeep<T>(obj: T): T;
type RelationArrayConfig<Item> = {
    type: 'array';
    map: (item: Item) => AnyRecord;
};
type RelationConfig<T> = {
    [K in keyof T]?: T[K] extends Array<infer U> ? RelationArrayConfig<U> : never;
};
export declare function buildPrismaUpdate<T extends object>(dto: T, relations?: RelationConfig<T>): AnyRecord;
export declare function buildPrismaCreate<T extends object>(dto: T): AnyRecord;
export {};
