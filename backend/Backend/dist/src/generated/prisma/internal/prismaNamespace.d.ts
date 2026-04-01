import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly business_parties: "business_parties";
    readonly cargo_transfer_items: "cargo_transfer_items";
    readonly cargo_transfers: "cargo_transfers";
    readonly companies: "companies";
    readonly delivery_notes: "delivery_notes";
    readonly drivers: "drivers";
    readonly entity_photos: "entity_photos";
    readonly files: "files";
    readonly locations: "locations";
    readonly pallet_items: "pallet_items";
    readonly pallets: "pallets";
    readonly party_locations: "party_locations";
    readonly party_contacts: "party_contacts";
    readonly picking_items: "picking_items";
    readonly picking_orders: "picking_orders";
    readonly picking_results: "picking_results";
    readonly picking_sources: "picking_sources";
    readonly products: "products";
    readonly trip_cargo: "trip_cargo";
    readonly trip_temperature_logs: "trip_temperature_logs";
    readonly dispatch_orders: "dispatch_orders";
    readonly trips: "trips";
    readonly trip_stops: "trip_stops";
    readonly trip_stop_orders: "trip_stop_orders";
    readonly corridors: "corridors";
    readonly corridor_stops: "corridor_stops";
    readonly users: "users";
    readonly vehicles: "vehicles";
    readonly vehicle_combinations: "vehicle_combinations";
    readonly warehouse_stock: "warehouse_stock";
    readonly warehouse_stock_movements: "warehouse_stock_movements";
    readonly warehouses: "warehouses";
    readonly document_sequences: "document_sequences";
    readonly refresh_tokens: "refresh_tokens";
    readonly transport_document_types: "transport_document_types";
    readonly documents_vehicle: "documents_vehicle";
    readonly documents_driver: "documents_driver";
    readonly transfer_rates: "transfer_rates";
    readonly dispatch_rates: "dispatch_rates";
    readonly document_item_taxes: "document_item_taxes";
    readonly document_items: "document_items";
    readonly document_taxes: "document_taxes";
    readonly document_types: "document_types";
    readonly documents: "documents";
    readonly product_taxes: "product_taxes";
    readonly taxes: "taxes";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "business_parties" | "cargo_transfer_items" | "cargo_transfers" | "companies" | "delivery_notes" | "drivers" | "entity_photos" | "files" | "locations" | "pallet_items" | "pallets" | "party_locations" | "party_contacts" | "picking_items" | "picking_orders" | "picking_results" | "picking_sources" | "products" | "trip_cargo" | "trip_temperature_logs" | "dispatch_orders" | "trips" | "trip_stops" | "trip_stop_orders" | "corridors" | "corridor_stops" | "users" | "vehicles" | "vehicle_combinations" | "warehouse_stock" | "warehouse_stock_movements" | "warehouses" | "document_sequences" | "refresh_tokens" | "transport_document_types" | "documents_vehicle" | "documents_driver" | "transfer_rates" | "dispatch_rates" | "document_item_taxes" | "document_items" | "document_taxes" | "document_types" | "documents" | "product_taxes" | "taxes";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        business_parties: {
            payload: Prisma.$business_partiesPayload<ExtArgs>;
            fields: Prisma.business_partiesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.business_partiesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$business_partiesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.business_partiesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$business_partiesPayload>;
                };
                findFirst: {
                    args: Prisma.business_partiesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$business_partiesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.business_partiesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$business_partiesPayload>;
                };
                findMany: {
                    args: Prisma.business_partiesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$business_partiesPayload>[];
                };
                create: {
                    args: Prisma.business_partiesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$business_partiesPayload>;
                };
                createMany: {
                    args: Prisma.business_partiesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.business_partiesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$business_partiesPayload>[];
                };
                delete: {
                    args: Prisma.business_partiesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$business_partiesPayload>;
                };
                update: {
                    args: Prisma.business_partiesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$business_partiesPayload>;
                };
                deleteMany: {
                    args: Prisma.business_partiesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.business_partiesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.business_partiesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$business_partiesPayload>[];
                };
                upsert: {
                    args: Prisma.business_partiesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$business_partiesPayload>;
                };
                aggregate: {
                    args: Prisma.Business_partiesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBusiness_parties>;
                };
                groupBy: {
                    args: Prisma.business_partiesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Business_partiesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.business_partiesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Business_partiesCountAggregateOutputType> | number;
                };
            };
        };
        cargo_transfer_items: {
            payload: Prisma.$cargo_transfer_itemsPayload<ExtArgs>;
            fields: Prisma.cargo_transfer_itemsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.cargo_transfer_itemsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfer_itemsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.cargo_transfer_itemsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfer_itemsPayload>;
                };
                findFirst: {
                    args: Prisma.cargo_transfer_itemsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfer_itemsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.cargo_transfer_itemsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfer_itemsPayload>;
                };
                findMany: {
                    args: Prisma.cargo_transfer_itemsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfer_itemsPayload>[];
                };
                create: {
                    args: Prisma.cargo_transfer_itemsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfer_itemsPayload>;
                };
                createMany: {
                    args: Prisma.cargo_transfer_itemsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.cargo_transfer_itemsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfer_itemsPayload>[];
                };
                delete: {
                    args: Prisma.cargo_transfer_itemsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfer_itemsPayload>;
                };
                update: {
                    args: Prisma.cargo_transfer_itemsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfer_itemsPayload>;
                };
                deleteMany: {
                    args: Prisma.cargo_transfer_itemsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.cargo_transfer_itemsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.cargo_transfer_itemsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfer_itemsPayload>[];
                };
                upsert: {
                    args: Prisma.cargo_transfer_itemsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfer_itemsPayload>;
                };
                aggregate: {
                    args: Prisma.Cargo_transfer_itemsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCargo_transfer_items>;
                };
                groupBy: {
                    args: Prisma.cargo_transfer_itemsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Cargo_transfer_itemsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.cargo_transfer_itemsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Cargo_transfer_itemsCountAggregateOutputType> | number;
                };
            };
        };
        cargo_transfers: {
            payload: Prisma.$cargo_transfersPayload<ExtArgs>;
            fields: Prisma.cargo_transfersFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.cargo_transfersFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfersPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.cargo_transfersFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfersPayload>;
                };
                findFirst: {
                    args: Prisma.cargo_transfersFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfersPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.cargo_transfersFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfersPayload>;
                };
                findMany: {
                    args: Prisma.cargo_transfersFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfersPayload>[];
                };
                create: {
                    args: Prisma.cargo_transfersCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfersPayload>;
                };
                createMany: {
                    args: Prisma.cargo_transfersCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.cargo_transfersCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfersPayload>[];
                };
                delete: {
                    args: Prisma.cargo_transfersDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfersPayload>;
                };
                update: {
                    args: Prisma.cargo_transfersUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfersPayload>;
                };
                deleteMany: {
                    args: Prisma.cargo_transfersDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.cargo_transfersUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.cargo_transfersUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfersPayload>[];
                };
                upsert: {
                    args: Prisma.cargo_transfersUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$cargo_transfersPayload>;
                };
                aggregate: {
                    args: Prisma.Cargo_transfersAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCargo_transfers>;
                };
                groupBy: {
                    args: Prisma.cargo_transfersGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Cargo_transfersGroupByOutputType>[];
                };
                count: {
                    args: Prisma.cargo_transfersCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Cargo_transfersCountAggregateOutputType> | number;
                };
            };
        };
        companies: {
            payload: Prisma.$companiesPayload<ExtArgs>;
            fields: Prisma.companiesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.companiesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$companiesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.companiesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$companiesPayload>;
                };
                findFirst: {
                    args: Prisma.companiesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$companiesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.companiesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$companiesPayload>;
                };
                findMany: {
                    args: Prisma.companiesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$companiesPayload>[];
                };
                create: {
                    args: Prisma.companiesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$companiesPayload>;
                };
                createMany: {
                    args: Prisma.companiesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.companiesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$companiesPayload>[];
                };
                delete: {
                    args: Prisma.companiesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$companiesPayload>;
                };
                update: {
                    args: Prisma.companiesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$companiesPayload>;
                };
                deleteMany: {
                    args: Prisma.companiesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.companiesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.companiesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$companiesPayload>[];
                };
                upsert: {
                    args: Prisma.companiesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$companiesPayload>;
                };
                aggregate: {
                    args: Prisma.CompaniesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCompanies>;
                };
                groupBy: {
                    args: Prisma.companiesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CompaniesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.companiesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CompaniesCountAggregateOutputType> | number;
                };
            };
        };
        delivery_notes: {
            payload: Prisma.$delivery_notesPayload<ExtArgs>;
            fields: Prisma.delivery_notesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.delivery_notesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$delivery_notesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.delivery_notesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$delivery_notesPayload>;
                };
                findFirst: {
                    args: Prisma.delivery_notesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$delivery_notesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.delivery_notesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$delivery_notesPayload>;
                };
                findMany: {
                    args: Prisma.delivery_notesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$delivery_notesPayload>[];
                };
                create: {
                    args: Prisma.delivery_notesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$delivery_notesPayload>;
                };
                createMany: {
                    args: Prisma.delivery_notesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.delivery_notesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$delivery_notesPayload>[];
                };
                delete: {
                    args: Prisma.delivery_notesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$delivery_notesPayload>;
                };
                update: {
                    args: Prisma.delivery_notesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$delivery_notesPayload>;
                };
                deleteMany: {
                    args: Prisma.delivery_notesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.delivery_notesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.delivery_notesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$delivery_notesPayload>[];
                };
                upsert: {
                    args: Prisma.delivery_notesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$delivery_notesPayload>;
                };
                aggregate: {
                    args: Prisma.Delivery_notesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDelivery_notes>;
                };
                groupBy: {
                    args: Prisma.delivery_notesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Delivery_notesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.delivery_notesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Delivery_notesCountAggregateOutputType> | number;
                };
            };
        };
        drivers: {
            payload: Prisma.$driversPayload<ExtArgs>;
            fields: Prisma.driversFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.driversFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$driversPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.driversFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$driversPayload>;
                };
                findFirst: {
                    args: Prisma.driversFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$driversPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.driversFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$driversPayload>;
                };
                findMany: {
                    args: Prisma.driversFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$driversPayload>[];
                };
                create: {
                    args: Prisma.driversCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$driversPayload>;
                };
                createMany: {
                    args: Prisma.driversCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.driversCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$driversPayload>[];
                };
                delete: {
                    args: Prisma.driversDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$driversPayload>;
                };
                update: {
                    args: Prisma.driversUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$driversPayload>;
                };
                deleteMany: {
                    args: Prisma.driversDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.driversUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.driversUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$driversPayload>[];
                };
                upsert: {
                    args: Prisma.driversUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$driversPayload>;
                };
                aggregate: {
                    args: Prisma.DriversAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDrivers>;
                };
                groupBy: {
                    args: Prisma.driversGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DriversGroupByOutputType>[];
                };
                count: {
                    args: Prisma.driversCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DriversCountAggregateOutputType> | number;
                };
            };
        };
        entity_photos: {
            payload: Prisma.$entity_photosPayload<ExtArgs>;
            fields: Prisma.entity_photosFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.entity_photosFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$entity_photosPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.entity_photosFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$entity_photosPayload>;
                };
                findFirst: {
                    args: Prisma.entity_photosFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$entity_photosPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.entity_photosFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$entity_photosPayload>;
                };
                findMany: {
                    args: Prisma.entity_photosFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$entity_photosPayload>[];
                };
                create: {
                    args: Prisma.entity_photosCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$entity_photosPayload>;
                };
                createMany: {
                    args: Prisma.entity_photosCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.entity_photosCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$entity_photosPayload>[];
                };
                delete: {
                    args: Prisma.entity_photosDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$entity_photosPayload>;
                };
                update: {
                    args: Prisma.entity_photosUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$entity_photosPayload>;
                };
                deleteMany: {
                    args: Prisma.entity_photosDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.entity_photosUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.entity_photosUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$entity_photosPayload>[];
                };
                upsert: {
                    args: Prisma.entity_photosUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$entity_photosPayload>;
                };
                aggregate: {
                    args: Prisma.Entity_photosAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEntity_photos>;
                };
                groupBy: {
                    args: Prisma.entity_photosGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Entity_photosGroupByOutputType>[];
                };
                count: {
                    args: Prisma.entity_photosCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Entity_photosCountAggregateOutputType> | number;
                };
            };
        };
        files: {
            payload: Prisma.$filesPayload<ExtArgs>;
            fields: Prisma.filesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.filesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$filesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.filesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$filesPayload>;
                };
                findFirst: {
                    args: Prisma.filesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$filesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.filesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$filesPayload>;
                };
                findMany: {
                    args: Prisma.filesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$filesPayload>[];
                };
                create: {
                    args: Prisma.filesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$filesPayload>;
                };
                createMany: {
                    args: Prisma.filesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.filesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$filesPayload>[];
                };
                delete: {
                    args: Prisma.filesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$filesPayload>;
                };
                update: {
                    args: Prisma.filesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$filesPayload>;
                };
                deleteMany: {
                    args: Prisma.filesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.filesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.filesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$filesPayload>[];
                };
                upsert: {
                    args: Prisma.filesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$filesPayload>;
                };
                aggregate: {
                    args: Prisma.FilesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFiles>;
                };
                groupBy: {
                    args: Prisma.filesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FilesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.filesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FilesCountAggregateOutputType> | number;
                };
            };
        };
        locations: {
            payload: Prisma.$locationsPayload<ExtArgs>;
            fields: Prisma.locationsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.locationsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$locationsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.locationsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$locationsPayload>;
                };
                findFirst: {
                    args: Prisma.locationsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$locationsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.locationsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$locationsPayload>;
                };
                findMany: {
                    args: Prisma.locationsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$locationsPayload>[];
                };
                create: {
                    args: Prisma.locationsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$locationsPayload>;
                };
                createMany: {
                    args: Prisma.locationsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.locationsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$locationsPayload>[];
                };
                delete: {
                    args: Prisma.locationsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$locationsPayload>;
                };
                update: {
                    args: Prisma.locationsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$locationsPayload>;
                };
                deleteMany: {
                    args: Prisma.locationsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.locationsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.locationsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$locationsPayload>[];
                };
                upsert: {
                    args: Prisma.locationsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$locationsPayload>;
                };
                aggregate: {
                    args: Prisma.LocationsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLocations>;
                };
                groupBy: {
                    args: Prisma.locationsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LocationsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.locationsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LocationsCountAggregateOutputType> | number;
                };
            };
        };
        pallet_items: {
            payload: Prisma.$pallet_itemsPayload<ExtArgs>;
            fields: Prisma.pallet_itemsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.pallet_itemsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$pallet_itemsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.pallet_itemsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$pallet_itemsPayload>;
                };
                findFirst: {
                    args: Prisma.pallet_itemsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$pallet_itemsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.pallet_itemsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$pallet_itemsPayload>;
                };
                findMany: {
                    args: Prisma.pallet_itemsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$pallet_itemsPayload>[];
                };
                create: {
                    args: Prisma.pallet_itemsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$pallet_itemsPayload>;
                };
                createMany: {
                    args: Prisma.pallet_itemsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.pallet_itemsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$pallet_itemsPayload>[];
                };
                delete: {
                    args: Prisma.pallet_itemsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$pallet_itemsPayload>;
                };
                update: {
                    args: Prisma.pallet_itemsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$pallet_itemsPayload>;
                };
                deleteMany: {
                    args: Prisma.pallet_itemsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.pallet_itemsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.pallet_itemsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$pallet_itemsPayload>[];
                };
                upsert: {
                    args: Prisma.pallet_itemsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$pallet_itemsPayload>;
                };
                aggregate: {
                    args: Prisma.Pallet_itemsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePallet_items>;
                };
                groupBy: {
                    args: Prisma.pallet_itemsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Pallet_itemsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.pallet_itemsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Pallet_itemsCountAggregateOutputType> | number;
                };
            };
        };
        pallets: {
            payload: Prisma.$palletsPayload<ExtArgs>;
            fields: Prisma.palletsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.palletsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$palletsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.palletsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$palletsPayload>;
                };
                findFirst: {
                    args: Prisma.palletsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$palletsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.palletsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$palletsPayload>;
                };
                findMany: {
                    args: Prisma.palletsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$palletsPayload>[];
                };
                create: {
                    args: Prisma.palletsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$palletsPayload>;
                };
                createMany: {
                    args: Prisma.palletsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.palletsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$palletsPayload>[];
                };
                delete: {
                    args: Prisma.palletsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$palletsPayload>;
                };
                update: {
                    args: Prisma.palletsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$palletsPayload>;
                };
                deleteMany: {
                    args: Prisma.palletsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.palletsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.palletsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$palletsPayload>[];
                };
                upsert: {
                    args: Prisma.palletsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$palletsPayload>;
                };
                aggregate: {
                    args: Prisma.PalletsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePallets>;
                };
                groupBy: {
                    args: Prisma.palletsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PalletsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.palletsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PalletsCountAggregateOutputType> | number;
                };
            };
        };
        party_locations: {
            payload: Prisma.$party_locationsPayload<ExtArgs>;
            fields: Prisma.party_locationsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.party_locationsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_locationsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.party_locationsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_locationsPayload>;
                };
                findFirst: {
                    args: Prisma.party_locationsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_locationsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.party_locationsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_locationsPayload>;
                };
                findMany: {
                    args: Prisma.party_locationsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_locationsPayload>[];
                };
                create: {
                    args: Prisma.party_locationsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_locationsPayload>;
                };
                createMany: {
                    args: Prisma.party_locationsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.party_locationsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_locationsPayload>[];
                };
                delete: {
                    args: Prisma.party_locationsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_locationsPayload>;
                };
                update: {
                    args: Prisma.party_locationsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_locationsPayload>;
                };
                deleteMany: {
                    args: Prisma.party_locationsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.party_locationsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.party_locationsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_locationsPayload>[];
                };
                upsert: {
                    args: Prisma.party_locationsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_locationsPayload>;
                };
                aggregate: {
                    args: Prisma.Party_locationsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateParty_locations>;
                };
                groupBy: {
                    args: Prisma.party_locationsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Party_locationsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.party_locationsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Party_locationsCountAggregateOutputType> | number;
                };
            };
        };
        party_contacts: {
            payload: Prisma.$party_contactsPayload<ExtArgs>;
            fields: Prisma.party_contactsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.party_contactsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_contactsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.party_contactsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_contactsPayload>;
                };
                findFirst: {
                    args: Prisma.party_contactsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_contactsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.party_contactsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_contactsPayload>;
                };
                findMany: {
                    args: Prisma.party_contactsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_contactsPayload>[];
                };
                create: {
                    args: Prisma.party_contactsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_contactsPayload>;
                };
                createMany: {
                    args: Prisma.party_contactsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.party_contactsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_contactsPayload>[];
                };
                delete: {
                    args: Prisma.party_contactsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_contactsPayload>;
                };
                update: {
                    args: Prisma.party_contactsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_contactsPayload>;
                };
                deleteMany: {
                    args: Prisma.party_contactsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.party_contactsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.party_contactsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_contactsPayload>[];
                };
                upsert: {
                    args: Prisma.party_contactsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$party_contactsPayload>;
                };
                aggregate: {
                    args: Prisma.Party_contactsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateParty_contacts>;
                };
                groupBy: {
                    args: Prisma.party_contactsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Party_contactsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.party_contactsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Party_contactsCountAggregateOutputType> | number;
                };
            };
        };
        picking_items: {
            payload: Prisma.$picking_itemsPayload<ExtArgs>;
            fields: Prisma.picking_itemsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.picking_itemsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_itemsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.picking_itemsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_itemsPayload>;
                };
                findFirst: {
                    args: Prisma.picking_itemsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_itemsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.picking_itemsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_itemsPayload>;
                };
                findMany: {
                    args: Prisma.picking_itemsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_itemsPayload>[];
                };
                create: {
                    args: Prisma.picking_itemsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_itemsPayload>;
                };
                createMany: {
                    args: Prisma.picking_itemsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.picking_itemsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_itemsPayload>[];
                };
                delete: {
                    args: Prisma.picking_itemsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_itemsPayload>;
                };
                update: {
                    args: Prisma.picking_itemsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_itemsPayload>;
                };
                deleteMany: {
                    args: Prisma.picking_itemsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.picking_itemsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.picking_itemsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_itemsPayload>[];
                };
                upsert: {
                    args: Prisma.picking_itemsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_itemsPayload>;
                };
                aggregate: {
                    args: Prisma.Picking_itemsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePicking_items>;
                };
                groupBy: {
                    args: Prisma.picking_itemsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Picking_itemsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.picking_itemsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Picking_itemsCountAggregateOutputType> | number;
                };
            };
        };
        picking_orders: {
            payload: Prisma.$picking_ordersPayload<ExtArgs>;
            fields: Prisma.picking_ordersFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.picking_ordersFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_ordersPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.picking_ordersFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_ordersPayload>;
                };
                findFirst: {
                    args: Prisma.picking_ordersFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_ordersPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.picking_ordersFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_ordersPayload>;
                };
                findMany: {
                    args: Prisma.picking_ordersFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_ordersPayload>[];
                };
                create: {
                    args: Prisma.picking_ordersCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_ordersPayload>;
                };
                createMany: {
                    args: Prisma.picking_ordersCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.picking_ordersCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_ordersPayload>[];
                };
                delete: {
                    args: Prisma.picking_ordersDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_ordersPayload>;
                };
                update: {
                    args: Prisma.picking_ordersUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_ordersPayload>;
                };
                deleteMany: {
                    args: Prisma.picking_ordersDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.picking_ordersUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.picking_ordersUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_ordersPayload>[];
                };
                upsert: {
                    args: Prisma.picking_ordersUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_ordersPayload>;
                };
                aggregate: {
                    args: Prisma.Picking_ordersAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePicking_orders>;
                };
                groupBy: {
                    args: Prisma.picking_ordersGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Picking_ordersGroupByOutputType>[];
                };
                count: {
                    args: Prisma.picking_ordersCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Picking_ordersCountAggregateOutputType> | number;
                };
            };
        };
        picking_results: {
            payload: Prisma.$picking_resultsPayload<ExtArgs>;
            fields: Prisma.picking_resultsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.picking_resultsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_resultsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.picking_resultsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_resultsPayload>;
                };
                findFirst: {
                    args: Prisma.picking_resultsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_resultsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.picking_resultsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_resultsPayload>;
                };
                findMany: {
                    args: Prisma.picking_resultsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_resultsPayload>[];
                };
                create: {
                    args: Prisma.picking_resultsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_resultsPayload>;
                };
                createMany: {
                    args: Prisma.picking_resultsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.picking_resultsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_resultsPayload>[];
                };
                delete: {
                    args: Prisma.picking_resultsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_resultsPayload>;
                };
                update: {
                    args: Prisma.picking_resultsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_resultsPayload>;
                };
                deleteMany: {
                    args: Prisma.picking_resultsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.picking_resultsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.picking_resultsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_resultsPayload>[];
                };
                upsert: {
                    args: Prisma.picking_resultsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_resultsPayload>;
                };
                aggregate: {
                    args: Prisma.Picking_resultsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePicking_results>;
                };
                groupBy: {
                    args: Prisma.picking_resultsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Picking_resultsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.picking_resultsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Picking_resultsCountAggregateOutputType> | number;
                };
            };
        };
        picking_sources: {
            payload: Prisma.$picking_sourcesPayload<ExtArgs>;
            fields: Prisma.picking_sourcesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.picking_sourcesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_sourcesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.picking_sourcesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_sourcesPayload>;
                };
                findFirst: {
                    args: Prisma.picking_sourcesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_sourcesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.picking_sourcesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_sourcesPayload>;
                };
                findMany: {
                    args: Prisma.picking_sourcesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_sourcesPayload>[];
                };
                create: {
                    args: Prisma.picking_sourcesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_sourcesPayload>;
                };
                createMany: {
                    args: Prisma.picking_sourcesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.picking_sourcesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_sourcesPayload>[];
                };
                delete: {
                    args: Prisma.picking_sourcesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_sourcesPayload>;
                };
                update: {
                    args: Prisma.picking_sourcesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_sourcesPayload>;
                };
                deleteMany: {
                    args: Prisma.picking_sourcesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.picking_sourcesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.picking_sourcesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_sourcesPayload>[];
                };
                upsert: {
                    args: Prisma.picking_sourcesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$picking_sourcesPayload>;
                };
                aggregate: {
                    args: Prisma.Picking_sourcesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePicking_sources>;
                };
                groupBy: {
                    args: Prisma.picking_sourcesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Picking_sourcesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.picking_sourcesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Picking_sourcesCountAggregateOutputType> | number;
                };
            };
        };
        products: {
            payload: Prisma.$productsPayload<ExtArgs>;
            fields: Prisma.productsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.productsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.productsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>;
                };
                findFirst: {
                    args: Prisma.productsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.productsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>;
                };
                findMany: {
                    args: Prisma.productsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>[];
                };
                create: {
                    args: Prisma.productsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>;
                };
                createMany: {
                    args: Prisma.productsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.productsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>[];
                };
                delete: {
                    args: Prisma.productsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>;
                };
                update: {
                    args: Prisma.productsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>;
                };
                deleteMany: {
                    args: Prisma.productsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.productsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.productsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>[];
                };
                upsert: {
                    args: Prisma.productsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$productsPayload>;
                };
                aggregate: {
                    args: Prisma.ProductsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProducts>;
                };
                groupBy: {
                    args: Prisma.productsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.productsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProductsCountAggregateOutputType> | number;
                };
            };
        };
        trip_cargo: {
            payload: Prisma.$trip_cargoPayload<ExtArgs>;
            fields: Prisma.trip_cargoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.trip_cargoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_cargoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.trip_cargoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_cargoPayload>;
                };
                findFirst: {
                    args: Prisma.trip_cargoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_cargoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.trip_cargoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_cargoPayload>;
                };
                findMany: {
                    args: Prisma.trip_cargoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_cargoPayload>[];
                };
                create: {
                    args: Prisma.trip_cargoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_cargoPayload>;
                };
                createMany: {
                    args: Prisma.trip_cargoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.trip_cargoCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_cargoPayload>[];
                };
                delete: {
                    args: Prisma.trip_cargoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_cargoPayload>;
                };
                update: {
                    args: Prisma.trip_cargoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_cargoPayload>;
                };
                deleteMany: {
                    args: Prisma.trip_cargoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.trip_cargoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.trip_cargoUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_cargoPayload>[];
                };
                upsert: {
                    args: Prisma.trip_cargoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_cargoPayload>;
                };
                aggregate: {
                    args: Prisma.Trip_cargoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTrip_cargo>;
                };
                groupBy: {
                    args: Prisma.trip_cargoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Trip_cargoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.trip_cargoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Trip_cargoCountAggregateOutputType> | number;
                };
            };
        };
        trip_temperature_logs: {
            payload: Prisma.$trip_temperature_logsPayload<ExtArgs>;
            fields: Prisma.trip_temperature_logsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.trip_temperature_logsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_temperature_logsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.trip_temperature_logsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_temperature_logsPayload>;
                };
                findFirst: {
                    args: Prisma.trip_temperature_logsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_temperature_logsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.trip_temperature_logsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_temperature_logsPayload>;
                };
                findMany: {
                    args: Prisma.trip_temperature_logsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_temperature_logsPayload>[];
                };
                create: {
                    args: Prisma.trip_temperature_logsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_temperature_logsPayload>;
                };
                createMany: {
                    args: Prisma.trip_temperature_logsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.trip_temperature_logsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_temperature_logsPayload>[];
                };
                delete: {
                    args: Prisma.trip_temperature_logsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_temperature_logsPayload>;
                };
                update: {
                    args: Prisma.trip_temperature_logsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_temperature_logsPayload>;
                };
                deleteMany: {
                    args: Prisma.trip_temperature_logsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.trip_temperature_logsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.trip_temperature_logsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_temperature_logsPayload>[];
                };
                upsert: {
                    args: Prisma.trip_temperature_logsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_temperature_logsPayload>;
                };
                aggregate: {
                    args: Prisma.Trip_temperature_logsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTrip_temperature_logs>;
                };
                groupBy: {
                    args: Prisma.trip_temperature_logsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Trip_temperature_logsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.trip_temperature_logsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Trip_temperature_logsCountAggregateOutputType> | number;
                };
            };
        };
        dispatch_orders: {
            payload: Prisma.$dispatch_ordersPayload<ExtArgs>;
            fields: Prisma.dispatch_ordersFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.dispatch_ordersFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ordersPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.dispatch_ordersFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ordersPayload>;
                };
                findFirst: {
                    args: Prisma.dispatch_ordersFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ordersPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.dispatch_ordersFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ordersPayload>;
                };
                findMany: {
                    args: Prisma.dispatch_ordersFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ordersPayload>[];
                };
                create: {
                    args: Prisma.dispatch_ordersCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ordersPayload>;
                };
                createMany: {
                    args: Prisma.dispatch_ordersCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.dispatch_ordersCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ordersPayload>[];
                };
                delete: {
                    args: Prisma.dispatch_ordersDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ordersPayload>;
                };
                update: {
                    args: Prisma.dispatch_ordersUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ordersPayload>;
                };
                deleteMany: {
                    args: Prisma.dispatch_ordersDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.dispatch_ordersUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.dispatch_ordersUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ordersPayload>[];
                };
                upsert: {
                    args: Prisma.dispatch_ordersUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ordersPayload>;
                };
                aggregate: {
                    args: Prisma.Dispatch_ordersAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDispatch_orders>;
                };
                groupBy: {
                    args: Prisma.dispatch_ordersGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Dispatch_ordersGroupByOutputType>[];
                };
                count: {
                    args: Prisma.dispatch_ordersCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Dispatch_ordersCountAggregateOutputType> | number;
                };
            };
        };
        trips: {
            payload: Prisma.$tripsPayload<ExtArgs>;
            fields: Prisma.tripsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.tripsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tripsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.tripsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tripsPayload>;
                };
                findFirst: {
                    args: Prisma.tripsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tripsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.tripsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tripsPayload>;
                };
                findMany: {
                    args: Prisma.tripsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tripsPayload>[];
                };
                create: {
                    args: Prisma.tripsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tripsPayload>;
                };
                createMany: {
                    args: Prisma.tripsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.tripsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tripsPayload>[];
                };
                delete: {
                    args: Prisma.tripsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tripsPayload>;
                };
                update: {
                    args: Prisma.tripsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tripsPayload>;
                };
                deleteMany: {
                    args: Prisma.tripsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.tripsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.tripsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tripsPayload>[];
                };
                upsert: {
                    args: Prisma.tripsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$tripsPayload>;
                };
                aggregate: {
                    args: Prisma.TripsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTrips>;
                };
                groupBy: {
                    args: Prisma.tripsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TripsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.tripsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TripsCountAggregateOutputType> | number;
                };
            };
        };
        trip_stops: {
            payload: Prisma.$trip_stopsPayload<ExtArgs>;
            fields: Prisma.trip_stopsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.trip_stopsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stopsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.trip_stopsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stopsPayload>;
                };
                findFirst: {
                    args: Prisma.trip_stopsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stopsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.trip_stopsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stopsPayload>;
                };
                findMany: {
                    args: Prisma.trip_stopsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stopsPayload>[];
                };
                create: {
                    args: Prisma.trip_stopsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stopsPayload>;
                };
                createMany: {
                    args: Prisma.trip_stopsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.trip_stopsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stopsPayload>[];
                };
                delete: {
                    args: Prisma.trip_stopsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stopsPayload>;
                };
                update: {
                    args: Prisma.trip_stopsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stopsPayload>;
                };
                deleteMany: {
                    args: Prisma.trip_stopsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.trip_stopsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.trip_stopsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stopsPayload>[];
                };
                upsert: {
                    args: Prisma.trip_stopsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stopsPayload>;
                };
                aggregate: {
                    args: Prisma.Trip_stopsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTrip_stops>;
                };
                groupBy: {
                    args: Prisma.trip_stopsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Trip_stopsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.trip_stopsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Trip_stopsCountAggregateOutputType> | number;
                };
            };
        };
        trip_stop_orders: {
            payload: Prisma.$trip_stop_ordersPayload<ExtArgs>;
            fields: Prisma.trip_stop_ordersFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.trip_stop_ordersFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stop_ordersPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.trip_stop_ordersFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stop_ordersPayload>;
                };
                findFirst: {
                    args: Prisma.trip_stop_ordersFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stop_ordersPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.trip_stop_ordersFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stop_ordersPayload>;
                };
                findMany: {
                    args: Prisma.trip_stop_ordersFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stop_ordersPayload>[];
                };
                create: {
                    args: Prisma.trip_stop_ordersCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stop_ordersPayload>;
                };
                createMany: {
                    args: Prisma.trip_stop_ordersCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.trip_stop_ordersCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stop_ordersPayload>[];
                };
                delete: {
                    args: Prisma.trip_stop_ordersDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stop_ordersPayload>;
                };
                update: {
                    args: Prisma.trip_stop_ordersUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stop_ordersPayload>;
                };
                deleteMany: {
                    args: Prisma.trip_stop_ordersDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.trip_stop_ordersUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.trip_stop_ordersUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stop_ordersPayload>[];
                };
                upsert: {
                    args: Prisma.trip_stop_ordersUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$trip_stop_ordersPayload>;
                };
                aggregate: {
                    args: Prisma.Trip_stop_ordersAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTrip_stop_orders>;
                };
                groupBy: {
                    args: Prisma.trip_stop_ordersGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Trip_stop_ordersGroupByOutputType>[];
                };
                count: {
                    args: Prisma.trip_stop_ordersCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Trip_stop_ordersCountAggregateOutputType> | number;
                };
            };
        };
        corridors: {
            payload: Prisma.$corridorsPayload<ExtArgs>;
            fields: Prisma.corridorsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.corridorsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridorsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.corridorsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridorsPayload>;
                };
                findFirst: {
                    args: Prisma.corridorsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridorsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.corridorsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridorsPayload>;
                };
                findMany: {
                    args: Prisma.corridorsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridorsPayload>[];
                };
                create: {
                    args: Prisma.corridorsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridorsPayload>;
                };
                createMany: {
                    args: Prisma.corridorsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.corridorsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridorsPayload>[];
                };
                delete: {
                    args: Prisma.corridorsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridorsPayload>;
                };
                update: {
                    args: Prisma.corridorsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridorsPayload>;
                };
                deleteMany: {
                    args: Prisma.corridorsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.corridorsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.corridorsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridorsPayload>[];
                };
                upsert: {
                    args: Prisma.corridorsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridorsPayload>;
                };
                aggregate: {
                    args: Prisma.CorridorsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCorridors>;
                };
                groupBy: {
                    args: Prisma.corridorsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CorridorsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.corridorsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CorridorsCountAggregateOutputType> | number;
                };
            };
        };
        corridor_stops: {
            payload: Prisma.$corridor_stopsPayload<ExtArgs>;
            fields: Prisma.corridor_stopsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.corridor_stopsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridor_stopsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.corridor_stopsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridor_stopsPayload>;
                };
                findFirst: {
                    args: Prisma.corridor_stopsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridor_stopsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.corridor_stopsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridor_stopsPayload>;
                };
                findMany: {
                    args: Prisma.corridor_stopsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridor_stopsPayload>[];
                };
                create: {
                    args: Prisma.corridor_stopsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridor_stopsPayload>;
                };
                createMany: {
                    args: Prisma.corridor_stopsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.corridor_stopsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridor_stopsPayload>[];
                };
                delete: {
                    args: Prisma.corridor_stopsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridor_stopsPayload>;
                };
                update: {
                    args: Prisma.corridor_stopsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridor_stopsPayload>;
                };
                deleteMany: {
                    args: Prisma.corridor_stopsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.corridor_stopsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.corridor_stopsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridor_stopsPayload>[];
                };
                upsert: {
                    args: Prisma.corridor_stopsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$corridor_stopsPayload>;
                };
                aggregate: {
                    args: Prisma.Corridor_stopsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCorridor_stops>;
                };
                groupBy: {
                    args: Prisma.corridor_stopsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Corridor_stopsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.corridor_stopsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Corridor_stopsCountAggregateOutputType> | number;
                };
            };
        };
        users: {
            payload: Prisma.$usersPayload<ExtArgs>;
            fields: Prisma.usersFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.usersFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>;
                };
                findFirst: {
                    args: Prisma.usersFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>;
                };
                findMany: {
                    args: Prisma.usersFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>[];
                };
                create: {
                    args: Prisma.usersCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>;
                };
                createMany: {
                    args: Prisma.usersCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.usersCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>[];
                };
                delete: {
                    args: Prisma.usersDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>;
                };
                update: {
                    args: Prisma.usersUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>;
                };
                deleteMany: {
                    args: Prisma.usersDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.usersUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.usersUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>[];
                };
                upsert: {
                    args: Prisma.usersUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$usersPayload>;
                };
                aggregate: {
                    args: Prisma.UsersAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUsers>;
                };
                groupBy: {
                    args: Prisma.usersGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UsersGroupByOutputType>[];
                };
                count: {
                    args: Prisma.usersCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UsersCountAggregateOutputType> | number;
                };
            };
        };
        vehicles: {
            payload: Prisma.$vehiclesPayload<ExtArgs>;
            fields: Prisma.vehiclesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.vehiclesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehiclesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.vehiclesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehiclesPayload>;
                };
                findFirst: {
                    args: Prisma.vehiclesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehiclesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.vehiclesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehiclesPayload>;
                };
                findMany: {
                    args: Prisma.vehiclesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehiclesPayload>[];
                };
                create: {
                    args: Prisma.vehiclesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehiclesPayload>;
                };
                createMany: {
                    args: Prisma.vehiclesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.vehiclesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehiclesPayload>[];
                };
                delete: {
                    args: Prisma.vehiclesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehiclesPayload>;
                };
                update: {
                    args: Prisma.vehiclesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehiclesPayload>;
                };
                deleteMany: {
                    args: Prisma.vehiclesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.vehiclesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.vehiclesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehiclesPayload>[];
                };
                upsert: {
                    args: Prisma.vehiclesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehiclesPayload>;
                };
                aggregate: {
                    args: Prisma.VehiclesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateVehicles>;
                };
                groupBy: {
                    args: Prisma.vehiclesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VehiclesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.vehiclesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.VehiclesCountAggregateOutputType> | number;
                };
            };
        };
        vehicle_combinations: {
            payload: Prisma.$vehicle_combinationsPayload<ExtArgs>;
            fields: Prisma.vehicle_combinationsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.vehicle_combinationsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehicle_combinationsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.vehicle_combinationsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehicle_combinationsPayload>;
                };
                findFirst: {
                    args: Prisma.vehicle_combinationsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehicle_combinationsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.vehicle_combinationsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehicle_combinationsPayload>;
                };
                findMany: {
                    args: Prisma.vehicle_combinationsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehicle_combinationsPayload>[];
                };
                create: {
                    args: Prisma.vehicle_combinationsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehicle_combinationsPayload>;
                };
                createMany: {
                    args: Prisma.vehicle_combinationsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.vehicle_combinationsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehicle_combinationsPayload>[];
                };
                delete: {
                    args: Prisma.vehicle_combinationsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehicle_combinationsPayload>;
                };
                update: {
                    args: Prisma.vehicle_combinationsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehicle_combinationsPayload>;
                };
                deleteMany: {
                    args: Prisma.vehicle_combinationsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.vehicle_combinationsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.vehicle_combinationsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehicle_combinationsPayload>[];
                };
                upsert: {
                    args: Prisma.vehicle_combinationsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$vehicle_combinationsPayload>;
                };
                aggregate: {
                    args: Prisma.Vehicle_combinationsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateVehicle_combinations>;
                };
                groupBy: {
                    args: Prisma.vehicle_combinationsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Vehicle_combinationsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.vehicle_combinationsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Vehicle_combinationsCountAggregateOutputType> | number;
                };
            };
        };
        warehouse_stock: {
            payload: Prisma.$warehouse_stockPayload<ExtArgs>;
            fields: Prisma.warehouse_stockFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.warehouse_stockFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stockPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.warehouse_stockFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stockPayload>;
                };
                findFirst: {
                    args: Prisma.warehouse_stockFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stockPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.warehouse_stockFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stockPayload>;
                };
                findMany: {
                    args: Prisma.warehouse_stockFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stockPayload>[];
                };
                create: {
                    args: Prisma.warehouse_stockCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stockPayload>;
                };
                createMany: {
                    args: Prisma.warehouse_stockCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.warehouse_stockCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stockPayload>[];
                };
                delete: {
                    args: Prisma.warehouse_stockDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stockPayload>;
                };
                update: {
                    args: Prisma.warehouse_stockUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stockPayload>;
                };
                deleteMany: {
                    args: Prisma.warehouse_stockDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.warehouse_stockUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.warehouse_stockUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stockPayload>[];
                };
                upsert: {
                    args: Prisma.warehouse_stockUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stockPayload>;
                };
                aggregate: {
                    args: Prisma.Warehouse_stockAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWarehouse_stock>;
                };
                groupBy: {
                    args: Prisma.warehouse_stockGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Warehouse_stockGroupByOutputType>[];
                };
                count: {
                    args: Prisma.warehouse_stockCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Warehouse_stockCountAggregateOutputType> | number;
                };
            };
        };
        warehouse_stock_movements: {
            payload: Prisma.$warehouse_stock_movementsPayload<ExtArgs>;
            fields: Prisma.warehouse_stock_movementsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.warehouse_stock_movementsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stock_movementsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.warehouse_stock_movementsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stock_movementsPayload>;
                };
                findFirst: {
                    args: Prisma.warehouse_stock_movementsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stock_movementsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.warehouse_stock_movementsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stock_movementsPayload>;
                };
                findMany: {
                    args: Prisma.warehouse_stock_movementsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stock_movementsPayload>[];
                };
                create: {
                    args: Prisma.warehouse_stock_movementsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stock_movementsPayload>;
                };
                createMany: {
                    args: Prisma.warehouse_stock_movementsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.warehouse_stock_movementsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stock_movementsPayload>[];
                };
                delete: {
                    args: Prisma.warehouse_stock_movementsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stock_movementsPayload>;
                };
                update: {
                    args: Prisma.warehouse_stock_movementsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stock_movementsPayload>;
                };
                deleteMany: {
                    args: Prisma.warehouse_stock_movementsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.warehouse_stock_movementsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.warehouse_stock_movementsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stock_movementsPayload>[];
                };
                upsert: {
                    args: Prisma.warehouse_stock_movementsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehouse_stock_movementsPayload>;
                };
                aggregate: {
                    args: Prisma.Warehouse_stock_movementsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWarehouse_stock_movements>;
                };
                groupBy: {
                    args: Prisma.warehouse_stock_movementsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Warehouse_stock_movementsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.warehouse_stock_movementsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Warehouse_stock_movementsCountAggregateOutputType> | number;
                };
            };
        };
        warehouses: {
            payload: Prisma.$warehousesPayload<ExtArgs>;
            fields: Prisma.warehousesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.warehousesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehousesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.warehousesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehousesPayload>;
                };
                findFirst: {
                    args: Prisma.warehousesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehousesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.warehousesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehousesPayload>;
                };
                findMany: {
                    args: Prisma.warehousesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehousesPayload>[];
                };
                create: {
                    args: Prisma.warehousesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehousesPayload>;
                };
                createMany: {
                    args: Prisma.warehousesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.warehousesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehousesPayload>[];
                };
                delete: {
                    args: Prisma.warehousesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehousesPayload>;
                };
                update: {
                    args: Prisma.warehousesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehousesPayload>;
                };
                deleteMany: {
                    args: Prisma.warehousesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.warehousesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.warehousesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehousesPayload>[];
                };
                upsert: {
                    args: Prisma.warehousesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$warehousesPayload>;
                };
                aggregate: {
                    args: Prisma.WarehousesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWarehouses>;
                };
                groupBy: {
                    args: Prisma.warehousesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WarehousesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.warehousesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WarehousesCountAggregateOutputType> | number;
                };
            };
        };
        document_sequences: {
            payload: Prisma.$document_sequencesPayload<ExtArgs>;
            fields: Prisma.document_sequencesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.document_sequencesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_sequencesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.document_sequencesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_sequencesPayload>;
                };
                findFirst: {
                    args: Prisma.document_sequencesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_sequencesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.document_sequencesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_sequencesPayload>;
                };
                findMany: {
                    args: Prisma.document_sequencesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_sequencesPayload>[];
                };
                create: {
                    args: Prisma.document_sequencesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_sequencesPayload>;
                };
                createMany: {
                    args: Prisma.document_sequencesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.document_sequencesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_sequencesPayload>[];
                };
                delete: {
                    args: Prisma.document_sequencesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_sequencesPayload>;
                };
                update: {
                    args: Prisma.document_sequencesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_sequencesPayload>;
                };
                deleteMany: {
                    args: Prisma.document_sequencesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.document_sequencesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.document_sequencesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_sequencesPayload>[];
                };
                upsert: {
                    args: Prisma.document_sequencesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_sequencesPayload>;
                };
                aggregate: {
                    args: Prisma.Document_sequencesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDocument_sequences>;
                };
                groupBy: {
                    args: Prisma.document_sequencesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Document_sequencesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.document_sequencesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Document_sequencesCountAggregateOutputType> | number;
                };
            };
        };
        refresh_tokens: {
            payload: Prisma.$refresh_tokensPayload<ExtArgs>;
            fields: Prisma.refresh_tokensFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.refresh_tokensFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$refresh_tokensPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.refresh_tokensFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$refresh_tokensPayload>;
                };
                findFirst: {
                    args: Prisma.refresh_tokensFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$refresh_tokensPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.refresh_tokensFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$refresh_tokensPayload>;
                };
                findMany: {
                    args: Prisma.refresh_tokensFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$refresh_tokensPayload>[];
                };
                create: {
                    args: Prisma.refresh_tokensCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$refresh_tokensPayload>;
                };
                createMany: {
                    args: Prisma.refresh_tokensCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.refresh_tokensCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$refresh_tokensPayload>[];
                };
                delete: {
                    args: Prisma.refresh_tokensDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$refresh_tokensPayload>;
                };
                update: {
                    args: Prisma.refresh_tokensUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$refresh_tokensPayload>;
                };
                deleteMany: {
                    args: Prisma.refresh_tokensDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.refresh_tokensUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.refresh_tokensUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$refresh_tokensPayload>[];
                };
                upsert: {
                    args: Prisma.refresh_tokensUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$refresh_tokensPayload>;
                };
                aggregate: {
                    args: Prisma.Refresh_tokensAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRefresh_tokens>;
                };
                groupBy: {
                    args: Prisma.refresh_tokensGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Refresh_tokensGroupByOutputType>[];
                };
                count: {
                    args: Prisma.refresh_tokensCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Refresh_tokensCountAggregateOutputType> | number;
                };
            };
        };
        transport_document_types: {
            payload: Prisma.$transport_document_typesPayload<ExtArgs>;
            fields: Prisma.transport_document_typesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.transport_document_typesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transport_document_typesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.transport_document_typesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transport_document_typesPayload>;
                };
                findFirst: {
                    args: Prisma.transport_document_typesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transport_document_typesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.transport_document_typesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transport_document_typesPayload>;
                };
                findMany: {
                    args: Prisma.transport_document_typesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transport_document_typesPayload>[];
                };
                create: {
                    args: Prisma.transport_document_typesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transport_document_typesPayload>;
                };
                createMany: {
                    args: Prisma.transport_document_typesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.transport_document_typesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transport_document_typesPayload>[];
                };
                delete: {
                    args: Prisma.transport_document_typesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transport_document_typesPayload>;
                };
                update: {
                    args: Prisma.transport_document_typesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transport_document_typesPayload>;
                };
                deleteMany: {
                    args: Prisma.transport_document_typesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.transport_document_typesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.transport_document_typesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transport_document_typesPayload>[];
                };
                upsert: {
                    args: Prisma.transport_document_typesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transport_document_typesPayload>;
                };
                aggregate: {
                    args: Prisma.Transport_document_typesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTransport_document_types>;
                };
                groupBy: {
                    args: Prisma.transport_document_typesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Transport_document_typesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.transport_document_typesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Transport_document_typesCountAggregateOutputType> | number;
                };
            };
        };
        documents_vehicle: {
            payload: Prisma.$documents_vehiclePayload<ExtArgs>;
            fields: Prisma.documents_vehicleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.documents_vehicleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_vehiclePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.documents_vehicleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_vehiclePayload>;
                };
                findFirst: {
                    args: Prisma.documents_vehicleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_vehiclePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.documents_vehicleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_vehiclePayload>;
                };
                findMany: {
                    args: Prisma.documents_vehicleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_vehiclePayload>[];
                };
                create: {
                    args: Prisma.documents_vehicleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_vehiclePayload>;
                };
                createMany: {
                    args: Prisma.documents_vehicleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.documents_vehicleCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_vehiclePayload>[];
                };
                delete: {
                    args: Prisma.documents_vehicleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_vehiclePayload>;
                };
                update: {
                    args: Prisma.documents_vehicleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_vehiclePayload>;
                };
                deleteMany: {
                    args: Prisma.documents_vehicleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.documents_vehicleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.documents_vehicleUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_vehiclePayload>[];
                };
                upsert: {
                    args: Prisma.documents_vehicleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_vehiclePayload>;
                };
                aggregate: {
                    args: Prisma.Documents_vehicleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDocuments_vehicle>;
                };
                groupBy: {
                    args: Prisma.documents_vehicleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Documents_vehicleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.documents_vehicleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Documents_vehicleCountAggregateOutputType> | number;
                };
            };
        };
        documents_driver: {
            payload: Prisma.$documents_driverPayload<ExtArgs>;
            fields: Prisma.documents_driverFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.documents_driverFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_driverPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.documents_driverFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_driverPayload>;
                };
                findFirst: {
                    args: Prisma.documents_driverFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_driverPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.documents_driverFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_driverPayload>;
                };
                findMany: {
                    args: Prisma.documents_driverFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_driverPayload>[];
                };
                create: {
                    args: Prisma.documents_driverCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_driverPayload>;
                };
                createMany: {
                    args: Prisma.documents_driverCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.documents_driverCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_driverPayload>[];
                };
                delete: {
                    args: Prisma.documents_driverDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_driverPayload>;
                };
                update: {
                    args: Prisma.documents_driverUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_driverPayload>;
                };
                deleteMany: {
                    args: Prisma.documents_driverDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.documents_driverUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.documents_driverUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_driverPayload>[];
                };
                upsert: {
                    args: Prisma.documents_driverUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documents_driverPayload>;
                };
                aggregate: {
                    args: Prisma.Documents_driverAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDocuments_driver>;
                };
                groupBy: {
                    args: Prisma.documents_driverGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Documents_driverGroupByOutputType>[];
                };
                count: {
                    args: Prisma.documents_driverCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Documents_driverCountAggregateOutputType> | number;
                };
            };
        };
        transfer_rates: {
            payload: Prisma.$transfer_ratesPayload<ExtArgs>;
            fields: Prisma.transfer_ratesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.transfer_ratesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transfer_ratesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.transfer_ratesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transfer_ratesPayload>;
                };
                findFirst: {
                    args: Prisma.transfer_ratesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transfer_ratesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.transfer_ratesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transfer_ratesPayload>;
                };
                findMany: {
                    args: Prisma.transfer_ratesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transfer_ratesPayload>[];
                };
                create: {
                    args: Prisma.transfer_ratesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transfer_ratesPayload>;
                };
                createMany: {
                    args: Prisma.transfer_ratesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.transfer_ratesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transfer_ratesPayload>[];
                };
                delete: {
                    args: Prisma.transfer_ratesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transfer_ratesPayload>;
                };
                update: {
                    args: Prisma.transfer_ratesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transfer_ratesPayload>;
                };
                deleteMany: {
                    args: Prisma.transfer_ratesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.transfer_ratesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.transfer_ratesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transfer_ratesPayload>[];
                };
                upsert: {
                    args: Prisma.transfer_ratesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$transfer_ratesPayload>;
                };
                aggregate: {
                    args: Prisma.Transfer_ratesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTransfer_rates>;
                };
                groupBy: {
                    args: Prisma.transfer_ratesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Transfer_ratesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.transfer_ratesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Transfer_ratesCountAggregateOutputType> | number;
                };
            };
        };
        dispatch_rates: {
            payload: Prisma.$dispatch_ratesPayload<ExtArgs>;
            fields: Prisma.dispatch_ratesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.dispatch_ratesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ratesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.dispatch_ratesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ratesPayload>;
                };
                findFirst: {
                    args: Prisma.dispatch_ratesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ratesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.dispatch_ratesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ratesPayload>;
                };
                findMany: {
                    args: Prisma.dispatch_ratesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ratesPayload>[];
                };
                create: {
                    args: Prisma.dispatch_ratesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ratesPayload>;
                };
                createMany: {
                    args: Prisma.dispatch_ratesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.dispatch_ratesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ratesPayload>[];
                };
                delete: {
                    args: Prisma.dispatch_ratesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ratesPayload>;
                };
                update: {
                    args: Prisma.dispatch_ratesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ratesPayload>;
                };
                deleteMany: {
                    args: Prisma.dispatch_ratesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.dispatch_ratesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.dispatch_ratesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ratesPayload>[];
                };
                upsert: {
                    args: Prisma.dispatch_ratesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$dispatch_ratesPayload>;
                };
                aggregate: {
                    args: Prisma.Dispatch_ratesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDispatch_rates>;
                };
                groupBy: {
                    args: Prisma.dispatch_ratesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Dispatch_ratesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.dispatch_ratesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Dispatch_ratesCountAggregateOutputType> | number;
                };
            };
        };
        document_item_taxes: {
            payload: Prisma.$document_item_taxesPayload<ExtArgs>;
            fields: Prisma.document_item_taxesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.document_item_taxesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_item_taxesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.document_item_taxesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_item_taxesPayload>;
                };
                findFirst: {
                    args: Prisma.document_item_taxesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_item_taxesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.document_item_taxesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_item_taxesPayload>;
                };
                findMany: {
                    args: Prisma.document_item_taxesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_item_taxesPayload>[];
                };
                create: {
                    args: Prisma.document_item_taxesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_item_taxesPayload>;
                };
                createMany: {
                    args: Prisma.document_item_taxesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.document_item_taxesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_item_taxesPayload>[];
                };
                delete: {
                    args: Prisma.document_item_taxesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_item_taxesPayload>;
                };
                update: {
                    args: Prisma.document_item_taxesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_item_taxesPayload>;
                };
                deleteMany: {
                    args: Prisma.document_item_taxesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.document_item_taxesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.document_item_taxesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_item_taxesPayload>[];
                };
                upsert: {
                    args: Prisma.document_item_taxesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_item_taxesPayload>;
                };
                aggregate: {
                    args: Prisma.Document_item_taxesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDocument_item_taxes>;
                };
                groupBy: {
                    args: Prisma.document_item_taxesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Document_item_taxesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.document_item_taxesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Document_item_taxesCountAggregateOutputType> | number;
                };
            };
        };
        document_items: {
            payload: Prisma.$document_itemsPayload<ExtArgs>;
            fields: Prisma.document_itemsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.document_itemsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_itemsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.document_itemsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_itemsPayload>;
                };
                findFirst: {
                    args: Prisma.document_itemsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_itemsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.document_itemsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_itemsPayload>;
                };
                findMany: {
                    args: Prisma.document_itemsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_itemsPayload>[];
                };
                create: {
                    args: Prisma.document_itemsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_itemsPayload>;
                };
                createMany: {
                    args: Prisma.document_itemsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.document_itemsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_itemsPayload>[];
                };
                delete: {
                    args: Prisma.document_itemsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_itemsPayload>;
                };
                update: {
                    args: Prisma.document_itemsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_itemsPayload>;
                };
                deleteMany: {
                    args: Prisma.document_itemsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.document_itemsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.document_itemsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_itemsPayload>[];
                };
                upsert: {
                    args: Prisma.document_itemsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_itemsPayload>;
                };
                aggregate: {
                    args: Prisma.Document_itemsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDocument_items>;
                };
                groupBy: {
                    args: Prisma.document_itemsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Document_itemsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.document_itemsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Document_itemsCountAggregateOutputType> | number;
                };
            };
        };
        document_taxes: {
            payload: Prisma.$document_taxesPayload<ExtArgs>;
            fields: Prisma.document_taxesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.document_taxesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_taxesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.document_taxesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_taxesPayload>;
                };
                findFirst: {
                    args: Prisma.document_taxesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_taxesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.document_taxesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_taxesPayload>;
                };
                findMany: {
                    args: Prisma.document_taxesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_taxesPayload>[];
                };
                create: {
                    args: Prisma.document_taxesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_taxesPayload>;
                };
                createMany: {
                    args: Prisma.document_taxesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.document_taxesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_taxesPayload>[];
                };
                delete: {
                    args: Prisma.document_taxesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_taxesPayload>;
                };
                update: {
                    args: Prisma.document_taxesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_taxesPayload>;
                };
                deleteMany: {
                    args: Prisma.document_taxesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.document_taxesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.document_taxesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_taxesPayload>[];
                };
                upsert: {
                    args: Prisma.document_taxesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_taxesPayload>;
                };
                aggregate: {
                    args: Prisma.Document_taxesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDocument_taxes>;
                };
                groupBy: {
                    args: Prisma.document_taxesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Document_taxesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.document_taxesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Document_taxesCountAggregateOutputType> | number;
                };
            };
        };
        document_types: {
            payload: Prisma.$document_typesPayload<ExtArgs>;
            fields: Prisma.document_typesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.document_typesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_typesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.document_typesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_typesPayload>;
                };
                findFirst: {
                    args: Prisma.document_typesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_typesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.document_typesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_typesPayload>;
                };
                findMany: {
                    args: Prisma.document_typesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_typesPayload>[];
                };
                create: {
                    args: Prisma.document_typesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_typesPayload>;
                };
                createMany: {
                    args: Prisma.document_typesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.document_typesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_typesPayload>[];
                };
                delete: {
                    args: Prisma.document_typesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_typesPayload>;
                };
                update: {
                    args: Prisma.document_typesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_typesPayload>;
                };
                deleteMany: {
                    args: Prisma.document_typesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.document_typesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.document_typesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_typesPayload>[];
                };
                upsert: {
                    args: Prisma.document_typesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$document_typesPayload>;
                };
                aggregate: {
                    args: Prisma.Document_typesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDocument_types>;
                };
                groupBy: {
                    args: Prisma.document_typesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Document_typesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.document_typesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Document_typesCountAggregateOutputType> | number;
                };
            };
        };
        documents: {
            payload: Prisma.$documentsPayload<ExtArgs>;
            fields: Prisma.documentsFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.documentsFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documentsPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.documentsFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documentsPayload>;
                };
                findFirst: {
                    args: Prisma.documentsFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documentsPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.documentsFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documentsPayload>;
                };
                findMany: {
                    args: Prisma.documentsFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documentsPayload>[];
                };
                create: {
                    args: Prisma.documentsCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documentsPayload>;
                };
                createMany: {
                    args: Prisma.documentsCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.documentsCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documentsPayload>[];
                };
                delete: {
                    args: Prisma.documentsDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documentsPayload>;
                };
                update: {
                    args: Prisma.documentsUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documentsPayload>;
                };
                deleteMany: {
                    args: Prisma.documentsDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.documentsUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.documentsUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documentsPayload>[];
                };
                upsert: {
                    args: Prisma.documentsUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$documentsPayload>;
                };
                aggregate: {
                    args: Prisma.DocumentsAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDocuments>;
                };
                groupBy: {
                    args: Prisma.documentsGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DocumentsGroupByOutputType>[];
                };
                count: {
                    args: Prisma.documentsCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DocumentsCountAggregateOutputType> | number;
                };
            };
        };
        product_taxes: {
            payload: Prisma.$product_taxesPayload<ExtArgs>;
            fields: Prisma.product_taxesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.product_taxesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_taxesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.product_taxesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_taxesPayload>;
                };
                findFirst: {
                    args: Prisma.product_taxesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_taxesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.product_taxesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_taxesPayload>;
                };
                findMany: {
                    args: Prisma.product_taxesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_taxesPayload>[];
                };
                create: {
                    args: Prisma.product_taxesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_taxesPayload>;
                };
                createMany: {
                    args: Prisma.product_taxesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.product_taxesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_taxesPayload>[];
                };
                delete: {
                    args: Prisma.product_taxesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_taxesPayload>;
                };
                update: {
                    args: Prisma.product_taxesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_taxesPayload>;
                };
                deleteMany: {
                    args: Prisma.product_taxesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.product_taxesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.product_taxesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_taxesPayload>[];
                };
                upsert: {
                    args: Prisma.product_taxesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$product_taxesPayload>;
                };
                aggregate: {
                    args: Prisma.Product_taxesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProduct_taxes>;
                };
                groupBy: {
                    args: Prisma.product_taxesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Product_taxesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.product_taxesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.Product_taxesCountAggregateOutputType> | number;
                };
            };
        };
        taxes: {
            payload: Prisma.$taxesPayload<ExtArgs>;
            fields: Prisma.taxesFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.taxesFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$taxesPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.taxesFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$taxesPayload>;
                };
                findFirst: {
                    args: Prisma.taxesFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$taxesPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.taxesFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$taxesPayload>;
                };
                findMany: {
                    args: Prisma.taxesFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$taxesPayload>[];
                };
                create: {
                    args: Prisma.taxesCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$taxesPayload>;
                };
                createMany: {
                    args: Prisma.taxesCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.taxesCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$taxesPayload>[];
                };
                delete: {
                    args: Prisma.taxesDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$taxesPayload>;
                };
                update: {
                    args: Prisma.taxesUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$taxesPayload>;
                };
                deleteMany: {
                    args: Prisma.taxesDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.taxesUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.taxesUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$taxesPayload>[];
                };
                upsert: {
                    args: Prisma.taxesUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$taxesPayload>;
                };
                aggregate: {
                    args: Prisma.TaxesAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTaxes>;
                };
                groupBy: {
                    args: Prisma.taxesGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaxesGroupByOutputType>[];
                };
                count: {
                    args: Prisma.taxesCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TaxesCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const Business_partiesScalarFieldEnum: {
    readonly id: "id";
    readonly type: "type";
    readonly name: "name";
    readonly tax_id: "tax_id";
    readonly active: "active";
    readonly created_at: "created_at";
};
export type Business_partiesScalarFieldEnum = (typeof Business_partiesScalarFieldEnum)[keyof typeof Business_partiesScalarFieldEnum];
export declare const Cargo_transfer_itemsScalarFieldEnum: {
    readonly id: "id";
    readonly transfer_id: "transfer_id";
    readonly pallet_id: "pallet_id";
    readonly delivery_note_id: "delivery_note_id";
    readonly quantity: "quantity";
};
export type Cargo_transfer_itemsScalarFieldEnum = (typeof Cargo_transfer_itemsScalarFieldEnum)[keyof typeof Cargo_transfer_itemsScalarFieldEnum];
export declare const Cargo_transfersScalarFieldEnum: {
    readonly id: "id";
    readonly from_trip_id: "from_trip_id";
    readonly to_trip_id: "to_trip_id";
    readonly location_id: "location_id";
    readonly transfer_time: "transfer_time";
    readonly performed_by: "performed_by";
    readonly notes: "notes";
};
export type Cargo_transfersScalarFieldEnum = (typeof Cargo_transfersScalarFieldEnum)[keyof typeof Cargo_transfersScalarFieldEnum];
export declare const CompaniesScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly tax_id: "tax_id";
    readonly phone: "phone";
    readonly created_at: "created_at";
};
export type CompaniesScalarFieldEnum = (typeof CompaniesScalarFieldEnum)[keyof typeof CompaniesScalarFieldEnum];
export declare const Delivery_notesScalarFieldEnum: {
    readonly id: "id";
    readonly type: "type";
    readonly number: "number";
    readonly status: "status";
    readonly party_id: "party_id";
    readonly trip_id: "trip_id";
    readonly created_by: "created_by";
    readonly deleted_at: "deleted_at";
    readonly created_at: "created_at";
    readonly dispatch_order_id: "dispatch_order_id";
};
export type Delivery_notesScalarFieldEnum = (typeof Delivery_notesScalarFieldEnum)[keyof typeof Delivery_notesScalarFieldEnum];
export declare const DriversScalarFieldEnum: {
    readonly id: "id";
    readonly first_name: "first_name";
    readonly last_name: "last_name";
    readonly document: "document";
    readonly phone: "phone";
    readonly active: "active";
    readonly created_at: "created_at";
};
export type DriversScalarFieldEnum = (typeof DriversScalarFieldEnum)[keyof typeof DriversScalarFieldEnum];
export declare const Entity_photosScalarFieldEnum: {
    readonly id: "id";
    readonly entity_type: "entity_type";
    readonly entity_id: "entity_id";
    readonly file_id: "file_id";
    readonly photo_type: "photo_type";
    readonly created_at: "created_at";
};
export type Entity_photosScalarFieldEnum = (typeof Entity_photosScalarFieldEnum)[keyof typeof Entity_photosScalarFieldEnum];
export declare const FilesScalarFieldEnum: {
    readonly id: "id";
    readonly storage_provider: "storage_provider";
    readonly file_path: "file_path";
    readonly public_url: "public_url";
    readonly file_name: "file_name";
    readonly mime_type: "mime_type";
    readonly file_size: "file_size";
    readonly uploaded_by: "uploaded_by";
    readonly created_at: "created_at";
};
export type FilesScalarFieldEnum = (typeof FilesScalarFieldEnum)[keyof typeof FilesScalarFieldEnum];
export declare const LocationsScalarFieldEnum: {
    readonly id: "id";
    readonly address: "address";
    readonly city: "city";
    readonly province: "province";
    readonly country: "country";
    readonly postal_code: "postal_code";
    readonly latitude: "latitude";
    readonly longitude: "longitude";
    readonly created_at: "created_at";
};
export type LocationsScalarFieldEnum = (typeof LocationsScalarFieldEnum)[keyof typeof LocationsScalarFieldEnum];
export declare const Pallet_itemsScalarFieldEnum: {
    readonly id: "id";
    readonly pallet_id: "pallet_id";
    readonly product_id: "product_id";
    readonly quantity: "quantity";
};
export type Pallet_itemsScalarFieldEnum = (typeof Pallet_itemsScalarFieldEnum)[keyof typeof Pallet_itemsScalarFieldEnum];
export declare const PalletsScalarFieldEnum: {
    readonly id: "id";
    readonly code: "code";
    readonly warehouse_id: "warehouse_id";
    readonly status: "status";
    readonly created_by: "created_by";
    readonly deleted_at: "deleted_at";
    readonly created_at: "created_at";
};
export type PalletsScalarFieldEnum = (typeof PalletsScalarFieldEnum)[keyof typeof PalletsScalarFieldEnum];
export declare const Party_locationsScalarFieldEnum: {
    readonly id: "id";
    readonly party_id: "party_id";
    readonly location_id: "location_id";
    readonly label: "label";
    readonly created_at: "created_at";
};
export type Party_locationsScalarFieldEnum = (typeof Party_locationsScalarFieldEnum)[keyof typeof Party_locationsScalarFieldEnum];
export declare const Party_contactsScalarFieldEnum: {
    readonly id: "id";
    readonly party_id: "party_id";
    readonly first_name: "first_name";
    readonly last_name: "last_name";
    readonly role: "role";
    readonly phone: "phone";
    readonly email: "email";
    readonly created_at: "created_at";
};
export type Party_contactsScalarFieldEnum = (typeof Party_contactsScalarFieldEnum)[keyof typeof Party_contactsScalarFieldEnum];
export declare const Picking_itemsScalarFieldEnum: {
    readonly id: "id";
    readonly picking_order_id: "picking_order_id";
    readonly product_id: "product_id";
    readonly quantity_required: "quantity_required";
    readonly quantity_picked: "quantity_picked";
};
export type Picking_itemsScalarFieldEnum = (typeof Picking_itemsScalarFieldEnum)[keyof typeof Picking_itemsScalarFieldEnum];
export declare const Picking_ordersScalarFieldEnum: {
    readonly id: "id";
    readonly warehouse_id: "warehouse_id";
    readonly client_id: "client_id";
    readonly status: "status";
    readonly delivery_note_id: "delivery_note_id";
    readonly trip_id: "trip_id";
    readonly created_by: "created_by";
    readonly created_at: "created_at";
    readonly dispatch_order_id: "dispatch_order_id";
};
export type Picking_ordersScalarFieldEnum = (typeof Picking_ordersScalarFieldEnum)[keyof typeof Picking_ordersScalarFieldEnum];
export declare const Picking_resultsScalarFieldEnum: {
    readonly id: "id";
    readonly picking_order_id: "picking_order_id";
    readonly pallet_id: "pallet_id";
};
export type Picking_resultsScalarFieldEnum = (typeof Picking_resultsScalarFieldEnum)[keyof typeof Picking_resultsScalarFieldEnum];
export declare const Picking_sourcesScalarFieldEnum: {
    readonly id: "id";
    readonly picking_item_id: "picking_item_id";
    readonly pallet_id: "pallet_id";
    readonly quantity: "quantity";
};
export type Picking_sourcesScalarFieldEnum = (typeof Picking_sourcesScalarFieldEnum)[keyof typeof Picking_sourcesScalarFieldEnum];
export declare const ProductsScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly sku: "sku";
    readonly requires_refrigeration: "requires_refrigeration";
    readonly created_at: "created_at";
};
export type ProductsScalarFieldEnum = (typeof ProductsScalarFieldEnum)[keyof typeof ProductsScalarFieldEnum];
export declare const Trip_cargoScalarFieldEnum: {
    readonly id: "id";
    readonly trip_id: "trip_id";
    readonly pallet_id: "pallet_id";
    readonly delivery_note_id: "delivery_note_id";
    readonly loaded_at: "loaded_at";
    readonly unloaded_at: "unloaded_at";
};
export type Trip_cargoScalarFieldEnum = (typeof Trip_cargoScalarFieldEnum)[keyof typeof Trip_cargoScalarFieldEnum];
export declare const Trip_temperature_logsScalarFieldEnum: {
    readonly id: "id";
    readonly trip_id: "trip_id";
    readonly temperature: "temperature";
    readonly recorded_at: "recorded_at";
    readonly recorded_by: "recorded_by";
};
export type Trip_temperature_logsScalarFieldEnum = (typeof Trip_temperature_logsScalarFieldEnum)[keyof typeof Trip_temperature_logsScalarFieldEnum];
export declare const Dispatch_ordersScalarFieldEnum: {
    readonly id: "id";
    readonly order_number: "order_number";
    readonly status: "status";
    readonly requires_stock: "requires_stock";
    readonly planned_date: "planned_date";
    readonly confirmed_at: "confirmed_at";
    readonly customer_id: "customer_id";
    readonly origin_location_id: "origin_location_id";
    readonly destination_location_id: "destination_location_id";
    readonly corridor_id: "corridor_id";
    readonly created_by: "created_by";
    readonly created_at: "created_at";
};
export type Dispatch_ordersScalarFieldEnum = (typeof Dispatch_ordersScalarFieldEnum)[keyof typeof Dispatch_ordersScalarFieldEnum];
export declare const TripsScalarFieldEnum: {
    readonly id: "id";
    readonly reference_number: "reference_number";
    readonly week: "week";
    readonly vehicle_combination_id: "vehicle_combination_id";
    readonly origin_warehouse_id: "origin_warehouse_id";
    readonly destination_warehouse_id: "destination_warehouse_id";
    readonly origin_location_id: "origin_location_id";
    readonly destination_location_id: "destination_location_id";
    readonly departure_time: "departure_time";
    readonly arrival_time: "arrival_time";
    readonly status: "status";
    readonly notes: "notes";
    readonly created_by: "created_by";
    readonly deleted_at: "deleted_at";
    readonly created_at: "created_at";
    readonly kilometers: "kilometers";
    readonly corridor_id: "corridor_id";
    readonly dispatch_ordersId: "dispatch_ordersId";
};
export type TripsScalarFieldEnum = (typeof TripsScalarFieldEnum)[keyof typeof TripsScalarFieldEnum];
export declare const Trip_stopsScalarFieldEnum: {
    readonly id: "id";
    readonly trip_id: "trip_id";
    readonly location_id: "location_id";
    readonly stop_order: "stop_order";
    readonly stop_type: "stop_type";
    readonly created_at: "created_at";
};
export type Trip_stopsScalarFieldEnum = (typeof Trip_stopsScalarFieldEnum)[keyof typeof Trip_stopsScalarFieldEnum];
export declare const Trip_stop_ordersScalarFieldEnum: {
    readonly id: "id";
    readonly trip_stop_id: "trip_stop_id";
    readonly dispatch_order_id: "dispatch_order_id";
    readonly action: "action";
    readonly created_at: "created_at";
};
export type Trip_stop_ordersScalarFieldEnum = (typeof Trip_stop_ordersScalarFieldEnum)[keyof typeof Trip_stop_ordersScalarFieldEnum];
export declare const CorridorsScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly origin_location_id: "origin_location_id";
    readonly destination_location_id: "destination_location_id";
    readonly is_template: "is_template";
    readonly total_distance_km: "total_distance_km";
    readonly estimated_minutes: "estimated_minutes";
    readonly active: "active";
    readonly created_at: "created_at";
};
export type CorridorsScalarFieldEnum = (typeof CorridorsScalarFieldEnum)[keyof typeof CorridorsScalarFieldEnum];
export declare const Corridor_stopsScalarFieldEnum: {
    readonly id: "id";
    readonly corridor_id: "corridor_id";
    readonly location_id: "location_id";
    readonly stop_order: "stop_order";
    readonly stop_type: "stop_type";
    readonly distance_km: "distance_km";
    readonly estimated_minutes: "estimated_minutes";
    readonly created_at: "created_at";
};
export type Corridor_stopsScalarFieldEnum = (typeof Corridor_stopsScalarFieldEnum)[keyof typeof Corridor_stopsScalarFieldEnum];
export declare const UsersScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly password_hash: "password_hash";
    readonly role: "role";
    readonly active: "active";
    readonly created_at: "created_at";
};
export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum];
export declare const VehiclesScalarFieldEnum: {
    readonly id: "id";
    readonly type: "type";
    readonly plate: "plate";
    readonly brand: "brand";
    readonly model: "model";
    readonly year: "year";
    readonly max_weight: "max_weight";
    readonly max_volume: "max_volume";
    readonly refrigeration: "refrigeration";
    readonly active: "active";
    readonly created_at: "created_at";
};
export type VehiclesScalarFieldEnum = (typeof VehiclesScalarFieldEnum)[keyof typeof VehiclesScalarFieldEnum];
export declare const Vehicle_combinationsScalarFieldEnum: {
    readonly id: "id";
    readonly tractor_id: "tractor_id";
    readonly trailer_id: "trailer_id";
    readonly valid_from: "valid_from";
    readonly valid_until: "valid_until";
    readonly created_by: "created_by";
    readonly created_at: "created_at";
    readonly unit_number: "unit_number";
    readonly driver_id: "driver_id";
    readonly deleted_at: "deleted_at";
    readonly deleted_by: "deleted_by";
};
export type Vehicle_combinationsScalarFieldEnum = (typeof Vehicle_combinationsScalarFieldEnum)[keyof typeof Vehicle_combinationsScalarFieldEnum];
export declare const Warehouse_stockScalarFieldEnum: {
    readonly id: "id";
    readonly warehouse_id: "warehouse_id";
    readonly product_id: "product_id";
    readonly quantity: "quantity";
    readonly reserved_quantity: "reserved_quantity";
    readonly updated_at: "updated_at";
};
export type Warehouse_stockScalarFieldEnum = (typeof Warehouse_stockScalarFieldEnum)[keyof typeof Warehouse_stockScalarFieldEnum];
export declare const Warehouse_stock_movementsScalarFieldEnum: {
    readonly id: "id";
    readonly warehouse_id: "warehouse_id";
    readonly product_id: "product_id";
    readonly movement_type: "movement_type";
    readonly direction: "direction";
    readonly quantity: "quantity";
    readonly reference_type: "reference_type";
    readonly reference_id: "reference_id";
    readonly notes: "notes";
    readonly created_at: "created_at";
    readonly created_by: "created_by";
};
export type Warehouse_stock_movementsScalarFieldEnum = (typeof Warehouse_stock_movementsScalarFieldEnum)[keyof typeof Warehouse_stock_movementsScalarFieldEnum];
export declare const WarehousesScalarFieldEnum: {
    readonly id: "id";
    readonly location_id: "location_id";
    readonly name: "name";
    readonly code: "code";
    readonly active: "active";
    readonly created_at: "created_at";
};
export type WarehousesScalarFieldEnum = (typeof WarehousesScalarFieldEnum)[keyof typeof WarehousesScalarFieldEnum];
export declare const Document_sequencesScalarFieldEnum: {
    readonly id: "id";
    readonly document_type: "document_type";
    readonly point_of_sale: "point_of_sale";
    readonly current_number: "current_number";
    readonly prefix: "prefix";
    readonly active: "active";
    readonly created_at: "created_at";
};
export type Document_sequencesScalarFieldEnum = (typeof Document_sequencesScalarFieldEnum)[keyof typeof Document_sequencesScalarFieldEnum];
export declare const Refresh_tokensScalarFieldEnum: {
    readonly id: "id";
    readonly user_id: "user_id";
    readonly token_hash: "token_hash";
    readonly expires_at: "expires_at";
    readonly revoked: "revoked";
    readonly revoked_at: "revoked_at";
    readonly created_at: "created_at";
};
export type Refresh_tokensScalarFieldEnum = (typeof Refresh_tokensScalarFieldEnum)[keyof typeof Refresh_tokensScalarFieldEnum];
export declare const Transport_document_typesScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly entity: "entity";
    readonly active: "active";
    readonly created_at: "created_at";
};
export type Transport_document_typesScalarFieldEnum = (typeof Transport_document_typesScalarFieldEnum)[keyof typeof Transport_document_typesScalarFieldEnum];
export declare const Documents_vehicleScalarFieldEnum: {
    readonly id: "id";
    readonly vehicle_id: "vehicle_id";
    readonly document_type_id: "document_type_id";
    readonly expiration_date: "expiration_date";
    readonly created_at: "created_at";
};
export type Documents_vehicleScalarFieldEnum = (typeof Documents_vehicleScalarFieldEnum)[keyof typeof Documents_vehicleScalarFieldEnum];
export declare const Documents_driverScalarFieldEnum: {
    readonly id: "id";
    readonly driver_id: "driver_id";
    readonly document_type_id: "document_type_id";
    readonly expiration_date: "expiration_date";
    readonly created_at: "created_at";
};
export type Documents_driverScalarFieldEnum = (typeof Documents_driverScalarFieldEnum)[keyof typeof Documents_driverScalarFieldEnum];
export declare const Transfer_ratesScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly rate_type: "rate_type";
    readonly description: "description";
    readonly active: "active";
    readonly created_at: "created_at";
};
export type Transfer_ratesScalarFieldEnum = (typeof Transfer_ratesScalarFieldEnum)[keyof typeof Transfer_ratesScalarFieldEnum];
export declare const Dispatch_ratesScalarFieldEnum: {
    readonly id: "id";
    readonly dispatch_id: "dispatch_id";
    readonly rate_id: "rate_id";
    readonly value: "value";
    readonly created_at: "created_at";
};
export type Dispatch_ratesScalarFieldEnum = (typeof Dispatch_ratesScalarFieldEnum)[keyof typeof Dispatch_ratesScalarFieldEnum];
export declare const Document_item_taxesScalarFieldEnum: {
    readonly id: "id";
    readonly document_item_id: "document_item_id";
    readonly tax_id: "tax_id";
    readonly tax_rate: "tax_rate";
    readonly tax_amount: "tax_amount";
    readonly created_at: "created_at";
};
export type Document_item_taxesScalarFieldEnum = (typeof Document_item_taxesScalarFieldEnum)[keyof typeof Document_item_taxesScalarFieldEnum];
export declare const Document_itemsScalarFieldEnum: {
    readonly id: "id";
    readonly document_id: "document_id";
    readonly product_id: "product_id";
    readonly quantity: "quantity";
    readonly price: "price";
    readonly created_at: "created_at";
    readonly unit_price: "unit_price";
};
export type Document_itemsScalarFieldEnum = (typeof Document_itemsScalarFieldEnum)[keyof typeof Document_itemsScalarFieldEnum];
export declare const Document_taxesScalarFieldEnum: {
    readonly id: "id";
    readonly document_id: "document_id";
    readonly tax_id: "tax_id";
    readonly tax_rate: "tax_rate";
    readonly taxable_base: "taxable_base";
    readonly tax_amount: "tax_amount";
    readonly created_at: "created_at";
};
export type Document_taxesScalarFieldEnum = (typeof Document_taxesScalarFieldEnum)[keyof typeof Document_taxesScalarFieldEnum];
export declare const Document_typesScalarFieldEnum: {
    readonly id: "id";
    readonly document_sequence_id: "document_sequence_id";
    readonly code: "code";
    readonly description: "description";
    readonly direction: "direction";
    readonly affects_stock: "affects_stock";
    readonly affects_accounting: "affects_accounting";
    readonly active: "active";
};
export type Document_typesScalarFieldEnum = (typeof Document_typesScalarFieldEnum)[keyof typeof Document_typesScalarFieldEnum];
export declare const DocumentsScalarFieldEnum: {
    readonly id: "id";
    readonly document_type_id: "document_type_id";
    readonly party_id: "party_id";
    readonly number: "number";
    readonly date: "date";
    readonly status: "status";
    readonly created_at: "created_at";
    readonly updated_at: "updated_at";
    readonly subtotal: "subtotal";
    readonly total_taxes: "total_taxes";
    readonly total: "total";
    readonly descrip: "descrip";
};
export type DocumentsScalarFieldEnum = (typeof DocumentsScalarFieldEnum)[keyof typeof DocumentsScalarFieldEnum];
export declare const Product_taxesScalarFieldEnum: {
    readonly id: "id";
    readonly product_id: "product_id";
    readonly tax_id: "tax_id";
    readonly is_included_in_price: "is_included_in_price";
    readonly active: "active";
    readonly created_at: "created_at";
};
export type Product_taxesScalarFieldEnum = (typeof Product_taxesScalarFieldEnum)[keyof typeof Product_taxesScalarFieldEnum];
export declare const TaxesScalarFieldEnum: {
    readonly id: "id";
    readonly code: "code";
    readonly name: "name";
    readonly tax_type: "tax_type";
    readonly rate: "rate";
    readonly is_percentage: "is_percentage";
    readonly active: "active";
    readonly created_at: "created_at";
    readonly calculation_level: "calculation_level";
};
export type TaxesScalarFieldEnum = (typeof TaxesScalarFieldEnum)[keyof typeof TaxesScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    accelerateUrl: string;
    adapter?: never;
}) & {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
};
export type GlobalOmitConfig = {
    business_parties?: Prisma.business_partiesOmit;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsOmit;
    cargo_transfers?: Prisma.cargo_transfersOmit;
    companies?: Prisma.companiesOmit;
    delivery_notes?: Prisma.delivery_notesOmit;
    drivers?: Prisma.driversOmit;
    entity_photos?: Prisma.entity_photosOmit;
    files?: Prisma.filesOmit;
    locations?: Prisma.locationsOmit;
    pallet_items?: Prisma.pallet_itemsOmit;
    pallets?: Prisma.palletsOmit;
    party_locations?: Prisma.party_locationsOmit;
    party_contacts?: Prisma.party_contactsOmit;
    picking_items?: Prisma.picking_itemsOmit;
    picking_orders?: Prisma.picking_ordersOmit;
    picking_results?: Prisma.picking_resultsOmit;
    picking_sources?: Prisma.picking_sourcesOmit;
    products?: Prisma.productsOmit;
    trip_cargo?: Prisma.trip_cargoOmit;
    trip_temperature_logs?: Prisma.trip_temperature_logsOmit;
    dispatch_orders?: Prisma.dispatch_ordersOmit;
    trips?: Prisma.tripsOmit;
    trip_stops?: Prisma.trip_stopsOmit;
    trip_stop_orders?: Prisma.trip_stop_ordersOmit;
    corridors?: Prisma.corridorsOmit;
    corridor_stops?: Prisma.corridor_stopsOmit;
    users?: Prisma.usersOmit;
    vehicles?: Prisma.vehiclesOmit;
    vehicle_combinations?: Prisma.vehicle_combinationsOmit;
    warehouse_stock?: Prisma.warehouse_stockOmit;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsOmit;
    warehouses?: Prisma.warehousesOmit;
    document_sequences?: Prisma.document_sequencesOmit;
    refresh_tokens?: Prisma.refresh_tokensOmit;
    transport_document_types?: Prisma.transport_document_typesOmit;
    documents_vehicle?: Prisma.documents_vehicleOmit;
    documents_driver?: Prisma.documents_driverOmit;
    transfer_rates?: Prisma.transfer_ratesOmit;
    dispatch_rates?: Prisma.dispatch_ratesOmit;
    document_item_taxes?: Prisma.document_item_taxesOmit;
    document_items?: Prisma.document_itemsOmit;
    document_taxes?: Prisma.document_taxesOmit;
    document_types?: Prisma.document_typesOmit;
    documents?: Prisma.documentsOmit;
    product_taxes?: Prisma.product_taxesOmit;
    taxes?: Prisma.taxesOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
