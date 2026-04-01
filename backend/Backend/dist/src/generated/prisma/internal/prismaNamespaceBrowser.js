"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document_typesScalarFieldEnum = exports.Document_taxesScalarFieldEnum = exports.Document_itemsScalarFieldEnum = exports.Document_item_taxesScalarFieldEnum = exports.Dispatch_ratesScalarFieldEnum = exports.Transfer_ratesScalarFieldEnum = exports.Documents_driverScalarFieldEnum = exports.Documents_vehicleScalarFieldEnum = exports.Transport_document_typesScalarFieldEnum = exports.Refresh_tokensScalarFieldEnum = exports.Document_sequencesScalarFieldEnum = exports.WarehousesScalarFieldEnum = exports.Warehouse_stock_movementsScalarFieldEnum = exports.Warehouse_stockScalarFieldEnum = exports.Vehicle_combinationsScalarFieldEnum = exports.VehiclesScalarFieldEnum = exports.UsersScalarFieldEnum = exports.Corridor_stopsScalarFieldEnum = exports.CorridorsScalarFieldEnum = exports.Trip_stop_ordersScalarFieldEnum = exports.Trip_stopsScalarFieldEnum = exports.TripsScalarFieldEnum = exports.Dispatch_ordersScalarFieldEnum = exports.Trip_temperature_logsScalarFieldEnum = exports.Trip_cargoScalarFieldEnum = exports.ProductsScalarFieldEnum = exports.Picking_sourcesScalarFieldEnum = exports.Picking_resultsScalarFieldEnum = exports.Picking_ordersScalarFieldEnum = exports.Picking_itemsScalarFieldEnum = exports.Party_contactsScalarFieldEnum = exports.Party_locationsScalarFieldEnum = exports.PalletsScalarFieldEnum = exports.Pallet_itemsScalarFieldEnum = exports.LocationsScalarFieldEnum = exports.FilesScalarFieldEnum = exports.Entity_photosScalarFieldEnum = exports.DriversScalarFieldEnum = exports.Delivery_notesScalarFieldEnum = exports.CompaniesScalarFieldEnum = exports.Cargo_transfersScalarFieldEnum = exports.Cargo_transfer_itemsScalarFieldEnum = exports.Business_partiesScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
exports.NullsOrder = exports.QueryMode = exports.SortOrder = exports.TaxesScalarFieldEnum = exports.Product_taxesScalarFieldEnum = exports.DocumentsScalarFieldEnum = void 0;
const runtime = __importStar(require("@prisma/client/runtime/index-browser"));
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    business_parties: 'business_parties',
    cargo_transfer_items: 'cargo_transfer_items',
    cargo_transfers: 'cargo_transfers',
    companies: 'companies',
    delivery_notes: 'delivery_notes',
    drivers: 'drivers',
    entity_photos: 'entity_photos',
    files: 'files',
    locations: 'locations',
    pallet_items: 'pallet_items',
    pallets: 'pallets',
    party_locations: 'party_locations',
    party_contacts: 'party_contacts',
    picking_items: 'picking_items',
    picking_orders: 'picking_orders',
    picking_results: 'picking_results',
    picking_sources: 'picking_sources',
    products: 'products',
    trip_cargo: 'trip_cargo',
    trip_temperature_logs: 'trip_temperature_logs',
    dispatch_orders: 'dispatch_orders',
    trips: 'trips',
    trip_stops: 'trip_stops',
    trip_stop_orders: 'trip_stop_orders',
    corridors: 'corridors',
    corridor_stops: 'corridor_stops',
    users: 'users',
    vehicles: 'vehicles',
    vehicle_combinations: 'vehicle_combinations',
    warehouse_stock: 'warehouse_stock',
    warehouse_stock_movements: 'warehouse_stock_movements',
    warehouses: 'warehouses',
    document_sequences: 'document_sequences',
    refresh_tokens: 'refresh_tokens',
    transport_document_types: 'transport_document_types',
    documents_vehicle: 'documents_vehicle',
    documents_driver: 'documents_driver',
    transfer_rates: 'transfer_rates',
    dispatch_rates: 'dispatch_rates',
    document_item_taxes: 'document_item_taxes',
    document_items: 'document_items',
    document_taxes: 'document_taxes',
    document_types: 'document_types',
    documents: 'documents',
    product_taxes: 'product_taxes',
    taxes: 'taxes'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.Business_partiesScalarFieldEnum = {
    id: 'id',
    type: 'type',
    name: 'name',
    tax_id: 'tax_id',
    active: 'active',
    created_at: 'created_at'
};
exports.Cargo_transfer_itemsScalarFieldEnum = {
    id: 'id',
    transfer_id: 'transfer_id',
    pallet_id: 'pallet_id',
    delivery_note_id: 'delivery_note_id',
    quantity: 'quantity'
};
exports.Cargo_transfersScalarFieldEnum = {
    id: 'id',
    from_trip_id: 'from_trip_id',
    to_trip_id: 'to_trip_id',
    location_id: 'location_id',
    transfer_time: 'transfer_time',
    performed_by: 'performed_by',
    notes: 'notes'
};
exports.CompaniesScalarFieldEnum = {
    id: 'id',
    name: 'name',
    tax_id: 'tax_id',
    phone: 'phone',
    created_at: 'created_at'
};
exports.Delivery_notesScalarFieldEnum = {
    id: 'id',
    type: 'type',
    number: 'number',
    status: 'status',
    party_id: 'party_id',
    trip_id: 'trip_id',
    created_by: 'created_by',
    deleted_at: 'deleted_at',
    created_at: 'created_at',
    dispatch_order_id: 'dispatch_order_id'
};
exports.DriversScalarFieldEnum = {
    id: 'id',
    first_name: 'first_name',
    last_name: 'last_name',
    document: 'document',
    phone: 'phone',
    active: 'active',
    created_at: 'created_at'
};
exports.Entity_photosScalarFieldEnum = {
    id: 'id',
    entity_type: 'entity_type',
    entity_id: 'entity_id',
    file_id: 'file_id',
    photo_type: 'photo_type',
    created_at: 'created_at'
};
exports.FilesScalarFieldEnum = {
    id: 'id',
    storage_provider: 'storage_provider',
    file_path: 'file_path',
    public_url: 'public_url',
    file_name: 'file_name',
    mime_type: 'mime_type',
    file_size: 'file_size',
    uploaded_by: 'uploaded_by',
    created_at: 'created_at'
};
exports.LocationsScalarFieldEnum = {
    id: 'id',
    address: 'address',
    city: 'city',
    province: 'province',
    country: 'country',
    postal_code: 'postal_code',
    latitude: 'latitude',
    longitude: 'longitude',
    created_at: 'created_at'
};
exports.Pallet_itemsScalarFieldEnum = {
    id: 'id',
    pallet_id: 'pallet_id',
    product_id: 'product_id',
    quantity: 'quantity'
};
exports.PalletsScalarFieldEnum = {
    id: 'id',
    code: 'code',
    warehouse_id: 'warehouse_id',
    status: 'status',
    created_by: 'created_by',
    deleted_at: 'deleted_at',
    created_at: 'created_at'
};
exports.Party_locationsScalarFieldEnum = {
    id: 'id',
    party_id: 'party_id',
    location_id: 'location_id',
    label: 'label',
    created_at: 'created_at'
};
exports.Party_contactsScalarFieldEnum = {
    id: 'id',
    party_id: 'party_id',
    first_name: 'first_name',
    last_name: 'last_name',
    role: 'role',
    phone: 'phone',
    email: 'email',
    created_at: 'created_at'
};
exports.Picking_itemsScalarFieldEnum = {
    id: 'id',
    picking_order_id: 'picking_order_id',
    product_id: 'product_id',
    quantity_required: 'quantity_required',
    quantity_picked: 'quantity_picked'
};
exports.Picking_ordersScalarFieldEnum = {
    id: 'id',
    warehouse_id: 'warehouse_id',
    client_id: 'client_id',
    status: 'status',
    delivery_note_id: 'delivery_note_id',
    trip_id: 'trip_id',
    created_by: 'created_by',
    created_at: 'created_at',
    dispatch_order_id: 'dispatch_order_id'
};
exports.Picking_resultsScalarFieldEnum = {
    id: 'id',
    picking_order_id: 'picking_order_id',
    pallet_id: 'pallet_id'
};
exports.Picking_sourcesScalarFieldEnum = {
    id: 'id',
    picking_item_id: 'picking_item_id',
    pallet_id: 'pallet_id',
    quantity: 'quantity'
};
exports.ProductsScalarFieldEnum = {
    id: 'id',
    name: 'name',
    sku: 'sku',
    requires_refrigeration: 'requires_refrigeration',
    created_at: 'created_at'
};
exports.Trip_cargoScalarFieldEnum = {
    id: 'id',
    trip_id: 'trip_id',
    pallet_id: 'pallet_id',
    delivery_note_id: 'delivery_note_id',
    loaded_at: 'loaded_at',
    unloaded_at: 'unloaded_at'
};
exports.Trip_temperature_logsScalarFieldEnum = {
    id: 'id',
    trip_id: 'trip_id',
    temperature: 'temperature',
    recorded_at: 'recorded_at',
    recorded_by: 'recorded_by'
};
exports.Dispatch_ordersScalarFieldEnum = {
    id: 'id',
    order_number: 'order_number',
    status: 'status',
    requires_stock: 'requires_stock',
    planned_date: 'planned_date',
    confirmed_at: 'confirmed_at',
    customer_id: 'customer_id',
    origin_location_id: 'origin_location_id',
    destination_location_id: 'destination_location_id',
    corridor_id: 'corridor_id',
    created_by: 'created_by',
    created_at: 'created_at'
};
exports.TripsScalarFieldEnum = {
    id: 'id',
    reference_number: 'reference_number',
    week: 'week',
    vehicle_combination_id: 'vehicle_combination_id',
    origin_warehouse_id: 'origin_warehouse_id',
    destination_warehouse_id: 'destination_warehouse_id',
    origin_location_id: 'origin_location_id',
    destination_location_id: 'destination_location_id',
    departure_time: 'departure_time',
    arrival_time: 'arrival_time',
    status: 'status',
    notes: 'notes',
    created_by: 'created_by',
    deleted_at: 'deleted_at',
    created_at: 'created_at',
    kilometers: 'kilometers',
    corridor_id: 'corridor_id',
    dispatch_ordersId: 'dispatch_ordersId'
};
exports.Trip_stopsScalarFieldEnum = {
    id: 'id',
    trip_id: 'trip_id',
    location_id: 'location_id',
    stop_order: 'stop_order',
    stop_type: 'stop_type',
    created_at: 'created_at'
};
exports.Trip_stop_ordersScalarFieldEnum = {
    id: 'id',
    trip_stop_id: 'trip_stop_id',
    dispatch_order_id: 'dispatch_order_id',
    action: 'action',
    created_at: 'created_at'
};
exports.CorridorsScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    origin_location_id: 'origin_location_id',
    destination_location_id: 'destination_location_id',
    is_template: 'is_template',
    total_distance_km: 'total_distance_km',
    estimated_minutes: 'estimated_minutes',
    active: 'active',
    created_at: 'created_at'
};
exports.Corridor_stopsScalarFieldEnum = {
    id: 'id',
    corridor_id: 'corridor_id',
    location_id: 'location_id',
    stop_order: 'stop_order',
    stop_type: 'stop_type',
    distance_km: 'distance_km',
    estimated_minutes: 'estimated_minutes',
    created_at: 'created_at'
};
exports.UsersScalarFieldEnum = {
    id: 'id',
    name: 'name',
    email: 'email',
    password_hash: 'password_hash',
    role: 'role',
    active: 'active',
    created_at: 'created_at'
};
exports.VehiclesScalarFieldEnum = {
    id: 'id',
    type: 'type',
    plate: 'plate',
    brand: 'brand',
    model: 'model',
    year: 'year',
    max_weight: 'max_weight',
    max_volume: 'max_volume',
    refrigeration: 'refrigeration',
    active: 'active',
    created_at: 'created_at'
};
exports.Vehicle_combinationsScalarFieldEnum = {
    id: 'id',
    tractor_id: 'tractor_id',
    trailer_id: 'trailer_id',
    valid_from: 'valid_from',
    valid_until: 'valid_until',
    created_by: 'created_by',
    created_at: 'created_at',
    unit_number: 'unit_number',
    driver_id: 'driver_id',
    deleted_at: 'deleted_at',
    deleted_by: 'deleted_by'
};
exports.Warehouse_stockScalarFieldEnum = {
    id: 'id',
    warehouse_id: 'warehouse_id',
    product_id: 'product_id',
    quantity: 'quantity',
    reserved_quantity: 'reserved_quantity',
    updated_at: 'updated_at'
};
exports.Warehouse_stock_movementsScalarFieldEnum = {
    id: 'id',
    warehouse_id: 'warehouse_id',
    product_id: 'product_id',
    movement_type: 'movement_type',
    direction: 'direction',
    quantity: 'quantity',
    reference_type: 'reference_type',
    reference_id: 'reference_id',
    notes: 'notes',
    created_at: 'created_at',
    created_by: 'created_by'
};
exports.WarehousesScalarFieldEnum = {
    id: 'id',
    location_id: 'location_id',
    name: 'name',
    code: 'code',
    active: 'active',
    created_at: 'created_at'
};
exports.Document_sequencesScalarFieldEnum = {
    id: 'id',
    document_type: 'document_type',
    point_of_sale: 'point_of_sale',
    current_number: 'current_number',
    prefix: 'prefix',
    active: 'active',
    created_at: 'created_at'
};
exports.Refresh_tokensScalarFieldEnum = {
    id: 'id',
    user_id: 'user_id',
    token_hash: 'token_hash',
    expires_at: 'expires_at',
    revoked: 'revoked',
    revoked_at: 'revoked_at',
    created_at: 'created_at'
};
exports.Transport_document_typesScalarFieldEnum = {
    id: 'id',
    name: 'name',
    entity: 'entity',
    active: 'active',
    created_at: 'created_at'
};
exports.Documents_vehicleScalarFieldEnum = {
    id: 'id',
    vehicle_id: 'vehicle_id',
    document_type_id: 'document_type_id',
    expiration_date: 'expiration_date',
    created_at: 'created_at'
};
exports.Documents_driverScalarFieldEnum = {
    id: 'id',
    driver_id: 'driver_id',
    document_type_id: 'document_type_id',
    expiration_date: 'expiration_date',
    created_at: 'created_at'
};
exports.Transfer_ratesScalarFieldEnum = {
    id: 'id',
    name: 'name',
    rate_type: 'rate_type',
    description: 'description',
    active: 'active',
    created_at: 'created_at'
};
exports.Dispatch_ratesScalarFieldEnum = {
    id: 'id',
    dispatch_id: 'dispatch_id',
    rate_id: 'rate_id',
    value: 'value',
    created_at: 'created_at'
};
exports.Document_item_taxesScalarFieldEnum = {
    id: 'id',
    document_item_id: 'document_item_id',
    tax_id: 'tax_id',
    tax_rate: 'tax_rate',
    tax_amount: 'tax_amount',
    created_at: 'created_at'
};
exports.Document_itemsScalarFieldEnum = {
    id: 'id',
    document_id: 'document_id',
    product_id: 'product_id',
    quantity: 'quantity',
    price: 'price',
    created_at: 'created_at',
    unit_price: 'unit_price'
};
exports.Document_taxesScalarFieldEnum = {
    id: 'id',
    document_id: 'document_id',
    tax_id: 'tax_id',
    tax_rate: 'tax_rate',
    taxable_base: 'taxable_base',
    tax_amount: 'tax_amount',
    created_at: 'created_at'
};
exports.Document_typesScalarFieldEnum = {
    id: 'id',
    document_sequence_id: 'document_sequence_id',
    code: 'code',
    description: 'description',
    direction: 'direction',
    affects_stock: 'affects_stock',
    affects_accounting: 'affects_accounting',
    active: 'active'
};
exports.DocumentsScalarFieldEnum = {
    id: 'id',
    document_type_id: 'document_type_id',
    party_id: 'party_id',
    number: 'number',
    date: 'date',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at',
    subtotal: 'subtotal',
    total_taxes: 'total_taxes',
    total: 'total',
    descrip: 'descrip'
};
exports.Product_taxesScalarFieldEnum = {
    id: 'id',
    product_id: 'product_id',
    tax_id: 'tax_id',
    is_included_in_price: 'is_included_in_price',
    active: 'active',
    created_at: 'created_at'
};
exports.TaxesScalarFieldEnum = {
    id: 'id',
    code: 'code',
    name: 'name',
    tax_type: 'tax_type',
    rate: 'rate',
    is_percentage: 'is_percentage',
    active: 'active',
    created_at: 'created_at',
    calculation_level: 'calculation_level'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map