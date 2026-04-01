import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace.js";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined, in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    $connect(): runtime.Types.Utils.JsPromise<void>;
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    get business_parties(): Prisma.business_partiesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get cargo_transfer_items(): Prisma.cargo_transfer_itemsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get cargo_transfers(): Prisma.cargo_transfersDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get companies(): Prisma.companiesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get delivery_notes(): Prisma.delivery_notesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get drivers(): Prisma.driversDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get entity_photos(): Prisma.entity_photosDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get files(): Prisma.filesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get locations(): Prisma.locationsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get pallet_items(): Prisma.pallet_itemsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get pallets(): Prisma.palletsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get party_locations(): Prisma.party_locationsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get party_contacts(): Prisma.party_contactsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get picking_items(): Prisma.picking_itemsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get picking_orders(): Prisma.picking_ordersDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get picking_results(): Prisma.picking_resultsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get picking_sources(): Prisma.picking_sourcesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get products(): Prisma.productsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get trip_cargo(): Prisma.trip_cargoDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get trip_temperature_logs(): Prisma.trip_temperature_logsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get dispatch_orders(): Prisma.dispatch_ordersDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get trips(): Prisma.tripsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get trip_stops(): Prisma.trip_stopsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get trip_stop_orders(): Prisma.trip_stop_ordersDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get corridors(): Prisma.corridorsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get corridor_stops(): Prisma.corridor_stopsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get users(): Prisma.usersDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get vehicles(): Prisma.vehiclesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get vehicle_combinations(): Prisma.vehicle_combinationsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get warehouse_stock(): Prisma.warehouse_stockDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get warehouse_stock_movements(): Prisma.warehouse_stock_movementsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get warehouses(): Prisma.warehousesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get document_sequences(): Prisma.document_sequencesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get refresh_tokens(): Prisma.refresh_tokensDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get transport_document_types(): Prisma.transport_document_typesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get documents_vehicle(): Prisma.documents_vehicleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get documents_driver(): Prisma.documents_driverDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get transfer_rates(): Prisma.transfer_ratesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get dispatch_rates(): Prisma.dispatch_ratesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get document_item_taxes(): Prisma.document_item_taxesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get document_items(): Prisma.document_itemsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get document_taxes(): Prisma.document_taxesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get document_types(): Prisma.document_typesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get documents(): Prisma.documentsDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get product_taxes(): Prisma.product_taxesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get taxes(): Prisma.taxesDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
