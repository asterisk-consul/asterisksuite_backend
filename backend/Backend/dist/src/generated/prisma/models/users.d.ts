import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type usersModel = runtime.Types.Result.DefaultSelection<Prisma.$usersPayload>;
export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null;
    _min: UsersMinAggregateOutputType | null;
    _max: UsersMaxAggregateOutputType | null;
};
export type UsersMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    password_hash: string | null;
    role: string | null;
    active: boolean | null;
    created_at: Date | null;
};
export type UsersMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    email: string | null;
    password_hash: string | null;
    role: string | null;
    active: boolean | null;
    created_at: Date | null;
};
export type UsersCountAggregateOutputType = {
    id: number;
    name: number;
    email: number;
    password_hash: number;
    role: number;
    active: number;
    created_at: number;
    _all: number;
};
export type UsersMinAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    password_hash?: true;
    role?: true;
    active?: true;
    created_at?: true;
};
export type UsersMaxAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    password_hash?: true;
    role?: true;
    active?: true;
    created_at?: true;
};
export type UsersCountAggregateInputType = {
    id?: true;
    name?: true;
    email?: true;
    password_hash?: true;
    role?: true;
    active?: true;
    created_at?: true;
    _all?: true;
};
export type UsersAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.usersWhereInput;
    orderBy?: Prisma.usersOrderByWithRelationInput | Prisma.usersOrderByWithRelationInput[];
    cursor?: Prisma.usersWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UsersCountAggregateInputType;
    _min?: UsersMinAggregateInputType;
    _max?: UsersMaxAggregateInputType;
};
export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
    [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUsers[P]> : Prisma.GetScalarType<T[P], AggregateUsers[P]>;
};
export type usersGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.usersWhereInput;
    orderBy?: Prisma.usersOrderByWithAggregationInput | Prisma.usersOrderByWithAggregationInput[];
    by: Prisma.UsersScalarFieldEnum[] | Prisma.UsersScalarFieldEnum;
    having?: Prisma.usersScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UsersCountAggregateInputType | true;
    _min?: UsersMinAggregateInputType;
    _max?: UsersMaxAggregateInputType;
};
export type UsersGroupByOutputType = {
    id: string;
    name: string;
    email: string;
    password_hash: string | null;
    role: string | null;
    active: boolean | null;
    created_at: Date;
    _count: UsersCountAggregateOutputType | null;
    _min: UsersMinAggregateOutputType | null;
    _max: UsersMaxAggregateOutputType | null;
};
export type GetUsersGroupByPayload<T extends usersGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UsersGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UsersGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UsersGroupByOutputType[P]>;
}>>;
export type usersWhereInput = {
    AND?: Prisma.usersWhereInput | Prisma.usersWhereInput[];
    OR?: Prisma.usersWhereInput[];
    NOT?: Prisma.usersWhereInput | Prisma.usersWhereInput[];
    id?: Prisma.UuidFilter<"users"> | string;
    name?: Prisma.StringFilter<"users"> | string;
    email?: Prisma.StringFilter<"users"> | string;
    password_hash?: Prisma.StringNullableFilter<"users"> | string | null;
    role?: Prisma.StringNullableFilter<"users"> | string | null;
    active?: Prisma.BoolNullableFilter<"users"> | boolean | null;
    created_at?: Prisma.DateTimeFilter<"users"> | Date | string;
    cargo_transfers?: Prisma.Cargo_transfersListRelationFilter;
    delivery_notes?: Prisma.Delivery_notesListRelationFilter;
    dispatch_orders?: Prisma.Dispatch_ordersListRelationFilter;
    files?: Prisma.FilesListRelationFilter;
    pallets?: Prisma.PalletsListRelationFilter;
    picking_orders?: Prisma.Picking_ordersListRelationFilter;
    refreshTokens?: Prisma.Refresh_tokensListRelationFilter;
    trip_temperature_logs?: Prisma.Trip_temperature_logsListRelationFilter;
    trips?: Prisma.TripsListRelationFilter;
    vehicle_combinations?: Prisma.Vehicle_combinationsListRelationFilter;
    warehouse_stock_movements?: Prisma.Warehouse_stock_movementsListRelationFilter;
};
export type usersOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrderInput | Prisma.SortOrder;
    role?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    cargo_transfers?: Prisma.cargo_transfersOrderByRelationAggregateInput;
    delivery_notes?: Prisma.delivery_notesOrderByRelationAggregateInput;
    dispatch_orders?: Prisma.dispatch_ordersOrderByRelationAggregateInput;
    files?: Prisma.filesOrderByRelationAggregateInput;
    pallets?: Prisma.palletsOrderByRelationAggregateInput;
    picking_orders?: Prisma.picking_ordersOrderByRelationAggregateInput;
    refreshTokens?: Prisma.refresh_tokensOrderByRelationAggregateInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsOrderByRelationAggregateInput;
    trips?: Prisma.tripsOrderByRelationAggregateInput;
    vehicle_combinations?: Prisma.vehicle_combinationsOrderByRelationAggregateInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsOrderByRelationAggregateInput;
};
export type usersWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.usersWhereInput | Prisma.usersWhereInput[];
    OR?: Prisma.usersWhereInput[];
    NOT?: Prisma.usersWhereInput | Prisma.usersWhereInput[];
    name?: Prisma.StringFilter<"users"> | string;
    password_hash?: Prisma.StringNullableFilter<"users"> | string | null;
    role?: Prisma.StringNullableFilter<"users"> | string | null;
    active?: Prisma.BoolNullableFilter<"users"> | boolean | null;
    created_at?: Prisma.DateTimeFilter<"users"> | Date | string;
    cargo_transfers?: Prisma.Cargo_transfersListRelationFilter;
    delivery_notes?: Prisma.Delivery_notesListRelationFilter;
    dispatch_orders?: Prisma.Dispatch_ordersListRelationFilter;
    files?: Prisma.FilesListRelationFilter;
    pallets?: Prisma.PalletsListRelationFilter;
    picking_orders?: Prisma.Picking_ordersListRelationFilter;
    refreshTokens?: Prisma.Refresh_tokensListRelationFilter;
    trip_temperature_logs?: Prisma.Trip_temperature_logsListRelationFilter;
    trips?: Prisma.TripsListRelationFilter;
    vehicle_combinations?: Prisma.Vehicle_combinationsListRelationFilter;
    warehouse_stock_movements?: Prisma.Warehouse_stock_movementsListRelationFilter;
}, "id" | "email">;
export type usersOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrderInput | Prisma.SortOrder;
    role?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.usersCountOrderByAggregateInput;
    _max?: Prisma.usersMaxOrderByAggregateInput;
    _min?: Prisma.usersMinOrderByAggregateInput;
};
export type usersScalarWhereWithAggregatesInput = {
    AND?: Prisma.usersScalarWhereWithAggregatesInput | Prisma.usersScalarWhereWithAggregatesInput[];
    OR?: Prisma.usersScalarWhereWithAggregatesInput[];
    NOT?: Prisma.usersScalarWhereWithAggregatesInput | Prisma.usersScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"users"> | string;
    name?: Prisma.StringWithAggregatesFilter<"users"> | string;
    email?: Prisma.StringWithAggregatesFilter<"users"> | string;
    password_hash?: Prisma.StringNullableWithAggregatesFilter<"users"> | string | null;
    role?: Prisma.StringNullableWithAggregatesFilter<"users"> | string | null;
    active?: Prisma.BoolNullableWithAggregatesFilter<"users"> | boolean | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"users"> | Date | string;
};
export type usersCreateInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutUsersInput;
};
export type usersUncheckedCreateInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesUncheckedCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsUncheckedCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersUncheckedCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutUsersNestedInput;
};
export type usersUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUncheckedUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUncheckedUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateManyInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
};
export type usersUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type usersUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UsersNullableScalarRelationFilter = {
    is?: Prisma.usersWhereInput | null;
    isNot?: Prisma.usersWhereInput | null;
};
export type usersCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type usersMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type usersMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    password_hash?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type UsersScalarRelationFilter = {
    is?: Prisma.usersWhereInput;
    isNot?: Prisma.usersWhereInput;
};
export type usersCreateNestedOneWithoutCargo_transfersInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutCargo_transfersInput, Prisma.usersUncheckedCreateWithoutCargo_transfersInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutCargo_transfersInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneWithoutCargo_transfersNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutCargo_transfersInput, Prisma.usersUncheckedCreateWithoutCargo_transfersInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutCargo_transfersInput;
    upsert?: Prisma.usersUpsertWithoutCargo_transfersInput;
    disconnect?: Prisma.usersWhereInput | boolean;
    delete?: Prisma.usersWhereInput | boolean;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutCargo_transfersInput, Prisma.usersUpdateWithoutCargo_transfersInput>, Prisma.usersUncheckedUpdateWithoutCargo_transfersInput>;
};
export type usersCreateNestedOneWithoutDelivery_notesInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutDelivery_notesInput, Prisma.usersUncheckedCreateWithoutDelivery_notesInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutDelivery_notesInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneWithoutDelivery_notesNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutDelivery_notesInput, Prisma.usersUncheckedCreateWithoutDelivery_notesInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutDelivery_notesInput;
    upsert?: Prisma.usersUpsertWithoutDelivery_notesInput;
    disconnect?: Prisma.usersWhereInput | boolean;
    delete?: Prisma.usersWhereInput | boolean;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutDelivery_notesInput, Prisma.usersUpdateWithoutDelivery_notesInput>, Prisma.usersUncheckedUpdateWithoutDelivery_notesInput>;
};
export type usersCreateNestedOneWithoutFilesInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutFilesInput, Prisma.usersUncheckedCreateWithoutFilesInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutFilesInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneWithoutFilesNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutFilesInput, Prisma.usersUncheckedCreateWithoutFilesInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutFilesInput;
    upsert?: Prisma.usersUpsertWithoutFilesInput;
    disconnect?: Prisma.usersWhereInput | boolean;
    delete?: Prisma.usersWhereInput | boolean;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutFilesInput, Prisma.usersUpdateWithoutFilesInput>, Prisma.usersUncheckedUpdateWithoutFilesInput>;
};
export type usersCreateNestedOneWithoutPalletsInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutPalletsInput, Prisma.usersUncheckedCreateWithoutPalletsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutPalletsInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneWithoutPalletsNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutPalletsInput, Prisma.usersUncheckedCreateWithoutPalletsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutPalletsInput;
    upsert?: Prisma.usersUpsertWithoutPalletsInput;
    disconnect?: Prisma.usersWhereInput | boolean;
    delete?: Prisma.usersWhereInput | boolean;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutPalletsInput, Prisma.usersUpdateWithoutPalletsInput>, Prisma.usersUncheckedUpdateWithoutPalletsInput>;
};
export type usersCreateNestedOneWithoutPicking_ordersInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutPicking_ordersInput, Prisma.usersUncheckedCreateWithoutPicking_ordersInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutPicking_ordersInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneWithoutPicking_ordersNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutPicking_ordersInput, Prisma.usersUncheckedCreateWithoutPicking_ordersInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutPicking_ordersInput;
    upsert?: Prisma.usersUpsertWithoutPicking_ordersInput;
    disconnect?: Prisma.usersWhereInput | boolean;
    delete?: Prisma.usersWhereInput | boolean;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutPicking_ordersInput, Prisma.usersUpdateWithoutPicking_ordersInput>, Prisma.usersUncheckedUpdateWithoutPicking_ordersInput>;
};
export type usersCreateNestedOneWithoutTrip_temperature_logsInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutTrip_temperature_logsInput, Prisma.usersUncheckedCreateWithoutTrip_temperature_logsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutTrip_temperature_logsInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneWithoutTrip_temperature_logsNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutTrip_temperature_logsInput, Prisma.usersUncheckedCreateWithoutTrip_temperature_logsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutTrip_temperature_logsInput;
    upsert?: Prisma.usersUpsertWithoutTrip_temperature_logsInput;
    disconnect?: Prisma.usersWhereInput | boolean;
    delete?: Prisma.usersWhereInput | boolean;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutTrip_temperature_logsInput, Prisma.usersUpdateWithoutTrip_temperature_logsInput>, Prisma.usersUncheckedUpdateWithoutTrip_temperature_logsInput>;
};
export type usersCreateNestedOneWithoutDispatch_ordersInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutDispatch_ordersInput, Prisma.usersUncheckedCreateWithoutDispatch_ordersInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutDispatch_ordersInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneWithoutDispatch_ordersNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutDispatch_ordersInput, Prisma.usersUncheckedCreateWithoutDispatch_ordersInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutDispatch_ordersInput;
    upsert?: Prisma.usersUpsertWithoutDispatch_ordersInput;
    disconnect?: Prisma.usersWhereInput | boolean;
    delete?: Prisma.usersWhereInput | boolean;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutDispatch_ordersInput, Prisma.usersUpdateWithoutDispatch_ordersInput>, Prisma.usersUncheckedUpdateWithoutDispatch_ordersInput>;
};
export type usersCreateNestedOneWithoutTripsInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutTripsInput, Prisma.usersUncheckedCreateWithoutTripsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutTripsInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneWithoutTripsNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutTripsInput, Prisma.usersUncheckedCreateWithoutTripsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutTripsInput;
    upsert?: Prisma.usersUpsertWithoutTripsInput;
    disconnect?: Prisma.usersWhereInput | boolean;
    delete?: Prisma.usersWhereInput | boolean;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutTripsInput, Prisma.usersUpdateWithoutTripsInput>, Prisma.usersUncheckedUpdateWithoutTripsInput>;
};
export type usersCreateNestedOneWithoutVehicle_combinationsInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutVehicle_combinationsInput, Prisma.usersUncheckedCreateWithoutVehicle_combinationsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutVehicle_combinationsInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneWithoutVehicle_combinationsNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutVehicle_combinationsInput, Prisma.usersUncheckedCreateWithoutVehicle_combinationsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutVehicle_combinationsInput;
    upsert?: Prisma.usersUpsertWithoutVehicle_combinationsInput;
    disconnect?: Prisma.usersWhereInput | boolean;
    delete?: Prisma.usersWhereInput | boolean;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutVehicle_combinationsInput, Prisma.usersUpdateWithoutVehicle_combinationsInput>, Prisma.usersUncheckedUpdateWithoutVehicle_combinationsInput>;
};
export type usersCreateNestedOneWithoutWarehouse_stock_movementsInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutWarehouse_stock_movementsInput, Prisma.usersUncheckedCreateWithoutWarehouse_stock_movementsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutWarehouse_stock_movementsInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneWithoutWarehouse_stock_movementsNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutWarehouse_stock_movementsInput, Prisma.usersUncheckedCreateWithoutWarehouse_stock_movementsInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutWarehouse_stock_movementsInput;
    upsert?: Prisma.usersUpsertWithoutWarehouse_stock_movementsInput;
    disconnect?: Prisma.usersWhereInput | boolean;
    delete?: Prisma.usersWhereInput | boolean;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutWarehouse_stock_movementsInput, Prisma.usersUpdateWithoutWarehouse_stock_movementsInput>, Prisma.usersUncheckedUpdateWithoutWarehouse_stock_movementsInput>;
};
export type usersCreateNestedOneWithoutRefreshTokensInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutRefreshTokensInput, Prisma.usersUncheckedCreateWithoutRefreshTokensInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutRefreshTokensInput;
    connect?: Prisma.usersWhereUniqueInput;
};
export type usersUpdateOneRequiredWithoutRefreshTokensNestedInput = {
    create?: Prisma.XOR<Prisma.usersCreateWithoutRefreshTokensInput, Prisma.usersUncheckedCreateWithoutRefreshTokensInput>;
    connectOrCreate?: Prisma.usersCreateOrConnectWithoutRefreshTokensInput;
    upsert?: Prisma.usersUpsertWithoutRefreshTokensInput;
    connect?: Prisma.usersWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.usersUpdateToOneWithWhereWithoutRefreshTokensInput, Prisma.usersUpdateWithoutRefreshTokensInput>, Prisma.usersUncheckedUpdateWithoutRefreshTokensInput>;
};
export type usersCreateWithoutCargo_transfersInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutUsersInput;
};
export type usersUncheckedCreateWithoutCargo_transfersInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesUncheckedCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsUncheckedCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersUncheckedCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutCargo_transfersInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutCargo_transfersInput, Prisma.usersUncheckedCreateWithoutCargo_transfersInput>;
};
export type usersUpsertWithoutCargo_transfersInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutCargo_transfersInput, Prisma.usersUncheckedUpdateWithoutCargo_transfersInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutCargo_transfersInput, Prisma.usersUncheckedCreateWithoutCargo_transfersInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutCargo_transfersInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutCargo_transfersInput, Prisma.usersUncheckedUpdateWithoutCargo_transfersInput>;
};
export type usersUpdateWithoutCargo_transfersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutCargo_transfersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUncheckedUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUncheckedUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutDelivery_notesInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutUsersInput;
};
export type usersUncheckedCreateWithoutDelivery_notesInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesUncheckedCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsUncheckedCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersUncheckedCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutDelivery_notesInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutDelivery_notesInput, Prisma.usersUncheckedCreateWithoutDelivery_notesInput>;
};
export type usersUpsertWithoutDelivery_notesInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutDelivery_notesInput, Prisma.usersUncheckedUpdateWithoutDelivery_notesInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutDelivery_notesInput, Prisma.usersUncheckedCreateWithoutDelivery_notesInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutDelivery_notesInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutDelivery_notesInput, Prisma.usersUncheckedUpdateWithoutDelivery_notesInput>;
};
export type usersUpdateWithoutDelivery_notesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutDelivery_notesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUncheckedUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUncheckedUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutFilesInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutUsersInput;
};
export type usersUncheckedCreateWithoutFilesInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsUncheckedCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersUncheckedCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutFilesInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutFilesInput, Prisma.usersUncheckedCreateWithoutFilesInput>;
};
export type usersUpsertWithoutFilesInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutFilesInput, Prisma.usersUncheckedUpdateWithoutFilesInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutFilesInput, Prisma.usersUncheckedCreateWithoutFilesInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutFilesInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutFilesInput, Prisma.usersUncheckedUpdateWithoutFilesInput>;
};
export type usersUpdateWithoutFilesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutFilesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUncheckedUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutPalletsInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutUsersInput;
};
export type usersUncheckedCreateWithoutPalletsInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesUncheckedCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersUncheckedCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutPalletsInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutPalletsInput, Prisma.usersUncheckedCreateWithoutPalletsInput>;
};
export type usersUpsertWithoutPalletsInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutPalletsInput, Prisma.usersUncheckedUpdateWithoutPalletsInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutPalletsInput, Prisma.usersUncheckedCreateWithoutPalletsInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutPalletsInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutPalletsInput, Prisma.usersUncheckedUpdateWithoutPalletsInput>;
};
export type usersUpdateWithoutPalletsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutPalletsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUncheckedUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutPicking_ordersInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutUsersInput;
};
export type usersUncheckedCreateWithoutPicking_ordersInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesUncheckedCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsUncheckedCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutPicking_ordersInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutPicking_ordersInput, Prisma.usersUncheckedCreateWithoutPicking_ordersInput>;
};
export type usersUpsertWithoutPicking_ordersInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutPicking_ordersInput, Prisma.usersUncheckedUpdateWithoutPicking_ordersInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutPicking_ordersInput, Prisma.usersUncheckedCreateWithoutPicking_ordersInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutPicking_ordersInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutPicking_ordersInput, Prisma.usersUncheckedUpdateWithoutPicking_ordersInput>;
};
export type usersUpdateWithoutPicking_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutPicking_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUncheckedUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUncheckedUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutTrip_temperature_logsInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutUsersInput;
};
export type usersUncheckedCreateWithoutTrip_temperature_logsInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesUncheckedCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsUncheckedCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersUncheckedCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutTrip_temperature_logsInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutTrip_temperature_logsInput, Prisma.usersUncheckedCreateWithoutTrip_temperature_logsInput>;
};
export type usersUpsertWithoutTrip_temperature_logsInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutTrip_temperature_logsInput, Prisma.usersUncheckedUpdateWithoutTrip_temperature_logsInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutTrip_temperature_logsInput, Prisma.usersUncheckedCreateWithoutTrip_temperature_logsInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutTrip_temperature_logsInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutTrip_temperature_logsInput, Prisma.usersUncheckedUpdateWithoutTrip_temperature_logsInput>;
};
export type usersUpdateWithoutTrip_temperature_logsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutTrip_temperature_logsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUncheckedUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUncheckedUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutDispatch_ordersInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutUsersInput;
};
export type usersUncheckedCreateWithoutDispatch_ordersInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesUncheckedCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsUncheckedCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersUncheckedCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutDispatch_ordersInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutDispatch_ordersInput, Prisma.usersUncheckedCreateWithoutDispatch_ordersInput>;
};
export type usersUpsertWithoutDispatch_ordersInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutDispatch_ordersInput, Prisma.usersUncheckedUpdateWithoutDispatch_ordersInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutDispatch_ordersInput, Prisma.usersUncheckedCreateWithoutDispatch_ordersInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutDispatch_ordersInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutDispatch_ordersInput, Prisma.usersUncheckedUpdateWithoutDispatch_ordersInput>;
};
export type usersUpdateWithoutDispatch_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutDispatch_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUncheckedUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUncheckedUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutTripsInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutUsersInput;
};
export type usersUncheckedCreateWithoutTripsInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesUncheckedCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsUncheckedCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersUncheckedCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutTripsInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutTripsInput, Prisma.usersUncheckedCreateWithoutTripsInput>;
};
export type usersUpsertWithoutTripsInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutTripsInput, Prisma.usersUncheckedUpdateWithoutTripsInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutTripsInput, Prisma.usersUncheckedCreateWithoutTripsInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutTripsInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutTripsInput, Prisma.usersUncheckedUpdateWithoutTripsInput>;
};
export type usersUpdateWithoutTripsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutTripsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUncheckedUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUncheckedUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutVehicle_combinationsInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutUsersInput;
};
export type usersUncheckedCreateWithoutVehicle_combinationsInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesUncheckedCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsUncheckedCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersUncheckedCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutVehicle_combinationsInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutVehicle_combinationsInput, Prisma.usersUncheckedCreateWithoutVehicle_combinationsInput>;
};
export type usersUpsertWithoutVehicle_combinationsInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutVehicle_combinationsInput, Prisma.usersUncheckedUpdateWithoutVehicle_combinationsInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutVehicle_combinationsInput, Prisma.usersUncheckedCreateWithoutVehicle_combinationsInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutVehicle_combinationsInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutVehicle_combinationsInput, Prisma.usersUncheckedUpdateWithoutVehicle_combinationsInput>;
};
export type usersUpdateWithoutVehicle_combinationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutVehicle_combinationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUncheckedUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUncheckedUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutWarehouse_stock_movementsInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsCreateNestedManyWithoutUsersInput;
};
export type usersUncheckedCreateWithoutWarehouse_stock_movementsInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesUncheckedCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsUncheckedCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersUncheckedCreateNestedManyWithoutUsersInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutWarehouse_stock_movementsInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutWarehouse_stock_movementsInput, Prisma.usersUncheckedCreateWithoutWarehouse_stock_movementsInput>;
};
export type usersUpsertWithoutWarehouse_stock_movementsInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutWarehouse_stock_movementsInput, Prisma.usersUncheckedUpdateWithoutWarehouse_stock_movementsInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutWarehouse_stock_movementsInput, Prisma.usersUncheckedCreateWithoutWarehouse_stock_movementsInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutWarehouse_stock_movementsInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutWarehouse_stock_movementsInput, Prisma.usersUncheckedUpdateWithoutWarehouse_stock_movementsInput>;
};
export type usersUpdateWithoutWarehouse_stock_movementsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUpdateManyWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutWarehouse_stock_movementsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUncheckedUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUncheckedUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    refreshTokens?: Prisma.refresh_tokensUncheckedUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type usersCreateWithoutRefreshTokensInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutUsersInput;
};
export type usersUncheckedCreateWithoutRefreshTokensInput = {
    id?: string;
    name: string;
    email: string;
    password_hash?: string | null;
    role?: string | null;
    active?: boolean | null;
    created_at?: Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedCreateNestedManyWithoutUsersInput;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutUsersInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutUsersInput;
    files?: Prisma.filesUncheckedCreateNestedManyWithoutUsersInput;
    pallets?: Prisma.palletsUncheckedCreateNestedManyWithoutUsersInput;
    picking_orders?: Prisma.picking_ordersUncheckedCreateNestedManyWithoutUsersInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedCreateNestedManyWithoutUsersInput;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutUsersInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutUsersInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutUsersInput;
};
export type usersCreateOrConnectWithoutRefreshTokensInput = {
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateWithoutRefreshTokensInput, Prisma.usersUncheckedCreateWithoutRefreshTokensInput>;
};
export type usersUpsertWithoutRefreshTokensInput = {
    update: Prisma.XOR<Prisma.usersUpdateWithoutRefreshTokensInput, Prisma.usersUncheckedUpdateWithoutRefreshTokensInput>;
    create: Prisma.XOR<Prisma.usersCreateWithoutRefreshTokensInput, Prisma.usersUncheckedCreateWithoutRefreshTokensInput>;
    where?: Prisma.usersWhereInput;
};
export type usersUpdateToOneWithWhereWithoutRefreshTokensInput = {
    where?: Prisma.usersWhereInput;
    data: Prisma.XOR<Prisma.usersUpdateWithoutRefreshTokensInput, Prisma.usersUncheckedUpdateWithoutRefreshTokensInput>;
};
export type usersUpdateWithoutRefreshTokensInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutUsersNestedInput;
};
export type usersUncheckedUpdateWithoutRefreshTokensInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    password_hash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfers?: Prisma.cargo_transfersUncheckedUpdateManyWithoutUsersNestedInput;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutUsersNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    files?: Prisma.filesUncheckedUpdateManyWithoutUsersNestedInput;
    pallets?: Prisma.palletsUncheckedUpdateManyWithoutUsersNestedInput;
    picking_orders?: Prisma.picking_ordersUncheckedUpdateManyWithoutUsersNestedInput;
    trip_temperature_logs?: Prisma.trip_temperature_logsUncheckedUpdateManyWithoutUsersNestedInput;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutUsersNestedInput;
    vehicle_combinations?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutUsersNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutUsersNestedInput;
};
export type UsersCountOutputType = {
    cargo_transfers: number;
    delivery_notes: number;
    dispatch_orders: number;
    files: number;
    pallets: number;
    picking_orders: number;
    refreshTokens: number;
    trip_temperature_logs: number;
    trips: number;
    vehicle_combinations: number;
    warehouse_stock_movements: number;
};
export type UsersCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    cargo_transfers?: boolean | UsersCountOutputTypeCountCargo_transfersArgs;
    delivery_notes?: boolean | UsersCountOutputTypeCountDelivery_notesArgs;
    dispatch_orders?: boolean | UsersCountOutputTypeCountDispatch_ordersArgs;
    files?: boolean | UsersCountOutputTypeCountFilesArgs;
    pallets?: boolean | UsersCountOutputTypeCountPalletsArgs;
    picking_orders?: boolean | UsersCountOutputTypeCountPicking_ordersArgs;
    refreshTokens?: boolean | UsersCountOutputTypeCountRefreshTokensArgs;
    trip_temperature_logs?: boolean | UsersCountOutputTypeCountTrip_temperature_logsArgs;
    trips?: boolean | UsersCountOutputTypeCountTripsArgs;
    vehicle_combinations?: boolean | UsersCountOutputTypeCountVehicle_combinationsArgs;
    warehouse_stock_movements?: boolean | UsersCountOutputTypeCountWarehouse_stock_movementsArgs;
};
export type UsersCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UsersCountOutputTypeSelect<ExtArgs> | null;
};
export type UsersCountOutputTypeCountCargo_transfersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.cargo_transfersWhereInput;
};
export type UsersCountOutputTypeCountDelivery_notesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.delivery_notesWhereInput;
};
export type UsersCountOutputTypeCountDispatch_ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.dispatch_ordersWhereInput;
};
export type UsersCountOutputTypeCountFilesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.filesWhereInput;
};
export type UsersCountOutputTypeCountPalletsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.palletsWhereInput;
};
export type UsersCountOutputTypeCountPicking_ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.picking_ordersWhereInput;
};
export type UsersCountOutputTypeCountRefreshTokensArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.refresh_tokensWhereInput;
};
export type UsersCountOutputTypeCountTrip_temperature_logsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.trip_temperature_logsWhereInput;
};
export type UsersCountOutputTypeCountTripsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.tripsWhereInput;
};
export type UsersCountOutputTypeCountVehicle_combinationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.vehicle_combinationsWhereInput;
};
export type UsersCountOutputTypeCountWarehouse_stock_movementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.warehouse_stock_movementsWhereInput;
};
export type usersSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    email?: boolean;
    password_hash?: boolean;
    role?: boolean;
    active?: boolean;
    created_at?: boolean;
    cargo_transfers?: boolean | Prisma.users$cargo_transfersArgs<ExtArgs>;
    delivery_notes?: boolean | Prisma.users$delivery_notesArgs<ExtArgs>;
    dispatch_orders?: boolean | Prisma.users$dispatch_ordersArgs<ExtArgs>;
    files?: boolean | Prisma.users$filesArgs<ExtArgs>;
    pallets?: boolean | Prisma.users$palletsArgs<ExtArgs>;
    picking_orders?: boolean | Prisma.users$picking_ordersArgs<ExtArgs>;
    refreshTokens?: boolean | Prisma.users$refreshTokensArgs<ExtArgs>;
    trip_temperature_logs?: boolean | Prisma.users$trip_temperature_logsArgs<ExtArgs>;
    trips?: boolean | Prisma.users$tripsArgs<ExtArgs>;
    vehicle_combinations?: boolean | Prisma.users$vehicle_combinationsArgs<ExtArgs>;
    warehouse_stock_movements?: boolean | Prisma.users$warehouse_stock_movementsArgs<ExtArgs>;
    _count?: boolean | Prisma.UsersCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["users"]>;
export type usersSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    email?: boolean;
    password_hash?: boolean;
    role?: boolean;
    active?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["users"]>;
export type usersSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    email?: boolean;
    password_hash?: boolean;
    role?: boolean;
    active?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["users"]>;
export type usersSelectScalar = {
    id?: boolean;
    name?: boolean;
    email?: boolean;
    password_hash?: boolean;
    role?: boolean;
    active?: boolean;
    created_at?: boolean;
};
export type usersOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "email" | "password_hash" | "role" | "active" | "created_at", ExtArgs["result"]["users"]>;
export type usersInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    cargo_transfers?: boolean | Prisma.users$cargo_transfersArgs<ExtArgs>;
    delivery_notes?: boolean | Prisma.users$delivery_notesArgs<ExtArgs>;
    dispatch_orders?: boolean | Prisma.users$dispatch_ordersArgs<ExtArgs>;
    files?: boolean | Prisma.users$filesArgs<ExtArgs>;
    pallets?: boolean | Prisma.users$palletsArgs<ExtArgs>;
    picking_orders?: boolean | Prisma.users$picking_ordersArgs<ExtArgs>;
    refreshTokens?: boolean | Prisma.users$refreshTokensArgs<ExtArgs>;
    trip_temperature_logs?: boolean | Prisma.users$trip_temperature_logsArgs<ExtArgs>;
    trips?: boolean | Prisma.users$tripsArgs<ExtArgs>;
    vehicle_combinations?: boolean | Prisma.users$vehicle_combinationsArgs<ExtArgs>;
    warehouse_stock_movements?: boolean | Prisma.users$warehouse_stock_movementsArgs<ExtArgs>;
    _count?: boolean | Prisma.UsersCountOutputTypeDefaultArgs<ExtArgs>;
};
export type usersIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type usersIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $usersPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "users";
    objects: {
        cargo_transfers: Prisma.$cargo_transfersPayload<ExtArgs>[];
        delivery_notes: Prisma.$delivery_notesPayload<ExtArgs>[];
        dispatch_orders: Prisma.$dispatch_ordersPayload<ExtArgs>[];
        files: Prisma.$filesPayload<ExtArgs>[];
        pallets: Prisma.$palletsPayload<ExtArgs>[];
        picking_orders: Prisma.$picking_ordersPayload<ExtArgs>[];
        refreshTokens: Prisma.$refresh_tokensPayload<ExtArgs>[];
        trip_temperature_logs: Prisma.$trip_temperature_logsPayload<ExtArgs>[];
        trips: Prisma.$tripsPayload<ExtArgs>[];
        vehicle_combinations: Prisma.$vehicle_combinationsPayload<ExtArgs>[];
        warehouse_stock_movements: Prisma.$warehouse_stock_movementsPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        email: string;
        password_hash: string | null;
        role: string | null;
        active: boolean | null;
        created_at: Date;
    }, ExtArgs["result"]["users"]>;
    composites: {};
};
export type usersGetPayload<S extends boolean | null | undefined | usersDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$usersPayload, S>;
export type usersCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<usersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UsersCountAggregateInputType | true;
};
export interface usersDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['users'];
        meta: {
            name: 'users';
        };
    };
    findUnique<T extends usersFindUniqueArgs>(args: Prisma.SelectSubset<T, usersFindUniqueArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends usersFindFirstArgs>(args?: Prisma.SelectSubset<T, usersFindFirstArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends usersFindManyArgs>(args?: Prisma.SelectSubset<T, usersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends usersCreateArgs>(args: Prisma.SelectSubset<T, usersCreateArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends usersCreateManyArgs>(args?: Prisma.SelectSubset<T, usersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends usersCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, usersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends usersDeleteArgs>(args: Prisma.SelectSubset<T, usersDeleteArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends usersUpdateArgs>(args: Prisma.SelectSubset<T, usersUpdateArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends usersDeleteManyArgs>(args?: Prisma.SelectSubset<T, usersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends usersUpdateManyArgs>(args: Prisma.SelectSubset<T, usersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends usersUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, usersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends usersUpsertArgs>(args: Prisma.SelectSubset<T, usersUpsertArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends usersCountArgs>(args?: Prisma.Subset<T, usersCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UsersCountAggregateOutputType> : number>;
    aggregate<T extends UsersAggregateArgs>(args: Prisma.Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>;
    groupBy<T extends usersGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: usersGroupByArgs['orderBy'];
    } : {
        orderBy?: usersGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: usersFieldRefs;
}
export interface Prisma__usersClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    cargo_transfers<T extends Prisma.users$cargo_transfersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$cargo_transfersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$cargo_transfersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    delivery_notes<T extends Prisma.users$delivery_notesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$delivery_notesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$delivery_notesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    dispatch_orders<T extends Prisma.users$dispatch_ordersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$dispatch_ordersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$dispatch_ordersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    files<T extends Prisma.users$filesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$filesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    pallets<T extends Prisma.users$palletsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$palletsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    picking_orders<T extends Prisma.users$picking_ordersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$picking_ordersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$picking_ordersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    refreshTokens<T extends Prisma.users$refreshTokensArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$refreshTokensArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$refresh_tokensPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    trip_temperature_logs<T extends Prisma.users$trip_temperature_logsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$trip_temperature_logsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$trip_temperature_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    trips<T extends Prisma.users$tripsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$tripsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    vehicle_combinations<T extends Prisma.users$vehicle_combinationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$vehicle_combinationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    warehouse_stock_movements<T extends Prisma.users$warehouse_stock_movementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.users$warehouse_stock_movementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$warehouse_stock_movementsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface usersFieldRefs {
    readonly id: Prisma.FieldRef<"users", 'String'>;
    readonly name: Prisma.FieldRef<"users", 'String'>;
    readonly email: Prisma.FieldRef<"users", 'String'>;
    readonly password_hash: Prisma.FieldRef<"users", 'String'>;
    readonly role: Prisma.FieldRef<"users", 'String'>;
    readonly active: Prisma.FieldRef<"users", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"users", 'DateTime'>;
}
export type usersFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
    where: Prisma.usersWhereUniqueInput;
};
export type usersFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
    where: Prisma.usersWhereUniqueInput;
};
export type usersFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
    where?: Prisma.usersWhereInput;
    orderBy?: Prisma.usersOrderByWithRelationInput | Prisma.usersOrderByWithRelationInput[];
    cursor?: Prisma.usersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UsersScalarFieldEnum | Prisma.UsersScalarFieldEnum[];
};
export type usersFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
    where?: Prisma.usersWhereInput;
    orderBy?: Prisma.usersOrderByWithRelationInput | Prisma.usersOrderByWithRelationInput[];
    cursor?: Prisma.usersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UsersScalarFieldEnum | Prisma.UsersScalarFieldEnum[];
};
export type usersFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
    where?: Prisma.usersWhereInput;
    orderBy?: Prisma.usersOrderByWithRelationInput | Prisma.usersOrderByWithRelationInput[];
    cursor?: Prisma.usersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UsersScalarFieldEnum | Prisma.UsersScalarFieldEnum[];
};
export type usersCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.usersCreateInput, Prisma.usersUncheckedCreateInput>;
};
export type usersCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.usersCreateManyInput | Prisma.usersCreateManyInput[];
    skipDuplicates?: boolean;
};
export type usersCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    data: Prisma.usersCreateManyInput | Prisma.usersCreateManyInput[];
    skipDuplicates?: boolean;
};
export type usersUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.usersUpdateInput, Prisma.usersUncheckedUpdateInput>;
    where: Prisma.usersWhereUniqueInput;
};
export type usersUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.usersUpdateManyMutationInput, Prisma.usersUncheckedUpdateManyInput>;
    where?: Prisma.usersWhereInput;
    limit?: number;
};
export type usersUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.usersUpdateManyMutationInput, Prisma.usersUncheckedUpdateManyInput>;
    where?: Prisma.usersWhereInput;
    limit?: number;
};
export type usersUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
    where: Prisma.usersWhereUniqueInput;
    create: Prisma.XOR<Prisma.usersCreateInput, Prisma.usersUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.usersUpdateInput, Prisma.usersUncheckedUpdateInput>;
};
export type usersDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
    where: Prisma.usersWhereUniqueInput;
};
export type usersDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.usersWhereInput;
    limit?: number;
};
export type users$cargo_transfersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.cargo_transfersSelect<ExtArgs> | null;
    omit?: Prisma.cargo_transfersOmit<ExtArgs> | null;
    include?: Prisma.cargo_transfersInclude<ExtArgs> | null;
    where?: Prisma.cargo_transfersWhereInput;
    orderBy?: Prisma.cargo_transfersOrderByWithRelationInput | Prisma.cargo_transfersOrderByWithRelationInput[];
    cursor?: Prisma.cargo_transfersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Cargo_transfersScalarFieldEnum | Prisma.Cargo_transfersScalarFieldEnum[];
};
export type users$delivery_notesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.delivery_notesSelect<ExtArgs> | null;
    omit?: Prisma.delivery_notesOmit<ExtArgs> | null;
    include?: Prisma.delivery_notesInclude<ExtArgs> | null;
    where?: Prisma.delivery_notesWhereInput;
    orderBy?: Prisma.delivery_notesOrderByWithRelationInput | Prisma.delivery_notesOrderByWithRelationInput[];
    cursor?: Prisma.delivery_notesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Delivery_notesScalarFieldEnum | Prisma.Delivery_notesScalarFieldEnum[];
};
export type users$dispatch_ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ordersSelect<ExtArgs> | null;
    omit?: Prisma.dispatch_ordersOmit<ExtArgs> | null;
    include?: Prisma.dispatch_ordersInclude<ExtArgs> | null;
    where?: Prisma.dispatch_ordersWhereInput;
    orderBy?: Prisma.dispatch_ordersOrderByWithRelationInput | Prisma.dispatch_ordersOrderByWithRelationInput[];
    cursor?: Prisma.dispatch_ordersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Dispatch_ordersScalarFieldEnum | Prisma.Dispatch_ordersScalarFieldEnum[];
};
export type users$filesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.filesSelect<ExtArgs> | null;
    omit?: Prisma.filesOmit<ExtArgs> | null;
    include?: Prisma.filesInclude<ExtArgs> | null;
    where?: Prisma.filesWhereInput;
    orderBy?: Prisma.filesOrderByWithRelationInput | Prisma.filesOrderByWithRelationInput[];
    cursor?: Prisma.filesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FilesScalarFieldEnum | Prisma.FilesScalarFieldEnum[];
};
export type users$palletsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.palletsSelect<ExtArgs> | null;
    omit?: Prisma.palletsOmit<ExtArgs> | null;
    include?: Prisma.palletsInclude<ExtArgs> | null;
    where?: Prisma.palletsWhereInput;
    orderBy?: Prisma.palletsOrderByWithRelationInput | Prisma.palletsOrderByWithRelationInput[];
    cursor?: Prisma.palletsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PalletsScalarFieldEnum | Prisma.PalletsScalarFieldEnum[];
};
export type users$picking_ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_ordersSelect<ExtArgs> | null;
    omit?: Prisma.picking_ordersOmit<ExtArgs> | null;
    include?: Prisma.picking_ordersInclude<ExtArgs> | null;
    where?: Prisma.picking_ordersWhereInput;
    orderBy?: Prisma.picking_ordersOrderByWithRelationInput | Prisma.picking_ordersOrderByWithRelationInput[];
    cursor?: Prisma.picking_ordersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Picking_ordersScalarFieldEnum | Prisma.Picking_ordersScalarFieldEnum[];
};
export type users$refreshTokensArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.refresh_tokensSelect<ExtArgs> | null;
    omit?: Prisma.refresh_tokensOmit<ExtArgs> | null;
    include?: Prisma.refresh_tokensInclude<ExtArgs> | null;
    where?: Prisma.refresh_tokensWhereInput;
    orderBy?: Prisma.refresh_tokensOrderByWithRelationInput | Prisma.refresh_tokensOrderByWithRelationInput[];
    cursor?: Prisma.refresh_tokensWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Refresh_tokensScalarFieldEnum | Prisma.Refresh_tokensScalarFieldEnum[];
};
export type users$trip_temperature_logsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_temperature_logsSelect<ExtArgs> | null;
    omit?: Prisma.trip_temperature_logsOmit<ExtArgs> | null;
    include?: Prisma.trip_temperature_logsInclude<ExtArgs> | null;
    where?: Prisma.trip_temperature_logsWhereInput;
    orderBy?: Prisma.trip_temperature_logsOrderByWithRelationInput | Prisma.trip_temperature_logsOrderByWithRelationInput[];
    cursor?: Prisma.trip_temperature_logsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Trip_temperature_logsScalarFieldEnum | Prisma.Trip_temperature_logsScalarFieldEnum[];
};
export type users$tripsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.tripsSelect<ExtArgs> | null;
    omit?: Prisma.tripsOmit<ExtArgs> | null;
    include?: Prisma.tripsInclude<ExtArgs> | null;
    where?: Prisma.tripsWhereInput;
    orderBy?: Prisma.tripsOrderByWithRelationInput | Prisma.tripsOrderByWithRelationInput[];
    cursor?: Prisma.tripsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TripsScalarFieldEnum | Prisma.TripsScalarFieldEnum[];
};
export type users$vehicle_combinationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehicle_combinationsSelect<ExtArgs> | null;
    omit?: Prisma.vehicle_combinationsOmit<ExtArgs> | null;
    include?: Prisma.vehicle_combinationsInclude<ExtArgs> | null;
    where?: Prisma.vehicle_combinationsWhereInput;
    orderBy?: Prisma.vehicle_combinationsOrderByWithRelationInput | Prisma.vehicle_combinationsOrderByWithRelationInput[];
    cursor?: Prisma.vehicle_combinationsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Vehicle_combinationsScalarFieldEnum | Prisma.Vehicle_combinationsScalarFieldEnum[];
};
export type users$warehouse_stock_movementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stock_movementsSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stock_movementsOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stock_movementsInclude<ExtArgs> | null;
    where?: Prisma.warehouse_stock_movementsWhereInput;
    orderBy?: Prisma.warehouse_stock_movementsOrderByWithRelationInput | Prisma.warehouse_stock_movementsOrderByWithRelationInput[];
    cursor?: Prisma.warehouse_stock_movementsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Warehouse_stock_movementsScalarFieldEnum | Prisma.Warehouse_stock_movementsScalarFieldEnum[];
};
export type usersDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
};
