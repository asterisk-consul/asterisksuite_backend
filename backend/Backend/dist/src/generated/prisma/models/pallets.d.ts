import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type palletsModel = runtime.Types.Result.DefaultSelection<Prisma.$palletsPayload>;
export type AggregatePallets = {
    _count: PalletsCountAggregateOutputType | null;
    _min: PalletsMinAggregateOutputType | null;
    _max: PalletsMaxAggregateOutputType | null;
};
export type PalletsMinAggregateOutputType = {
    id: string | null;
    code: string | null;
    warehouse_id: string | null;
    status: string | null;
    created_by: string | null;
    deleted_at: Date | null;
    created_at: Date | null;
};
export type PalletsMaxAggregateOutputType = {
    id: string | null;
    code: string | null;
    warehouse_id: string | null;
    status: string | null;
    created_by: string | null;
    deleted_at: Date | null;
    created_at: Date | null;
};
export type PalletsCountAggregateOutputType = {
    id: number;
    code: number;
    warehouse_id: number;
    status: number;
    created_by: number;
    deleted_at: number;
    created_at: number;
    _all: number;
};
export type PalletsMinAggregateInputType = {
    id?: true;
    code?: true;
    warehouse_id?: true;
    status?: true;
    created_by?: true;
    deleted_at?: true;
    created_at?: true;
};
export type PalletsMaxAggregateInputType = {
    id?: true;
    code?: true;
    warehouse_id?: true;
    status?: true;
    created_by?: true;
    deleted_at?: true;
    created_at?: true;
};
export type PalletsCountAggregateInputType = {
    id?: true;
    code?: true;
    warehouse_id?: true;
    status?: true;
    created_by?: true;
    deleted_at?: true;
    created_at?: true;
    _all?: true;
};
export type PalletsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.palletsWhereInput;
    orderBy?: Prisma.palletsOrderByWithRelationInput | Prisma.palletsOrderByWithRelationInput[];
    cursor?: Prisma.palletsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PalletsCountAggregateInputType;
    _min?: PalletsMinAggregateInputType;
    _max?: PalletsMaxAggregateInputType;
};
export type GetPalletsAggregateType<T extends PalletsAggregateArgs> = {
    [P in keyof T & keyof AggregatePallets]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePallets[P]> : Prisma.GetScalarType<T[P], AggregatePallets[P]>;
};
export type palletsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.palletsWhereInput;
    orderBy?: Prisma.palletsOrderByWithAggregationInput | Prisma.palletsOrderByWithAggregationInput[];
    by: Prisma.PalletsScalarFieldEnum[] | Prisma.PalletsScalarFieldEnum;
    having?: Prisma.palletsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PalletsCountAggregateInputType | true;
    _min?: PalletsMinAggregateInputType;
    _max?: PalletsMaxAggregateInputType;
};
export type PalletsGroupByOutputType = {
    id: string;
    code: string;
    warehouse_id: string | null;
    status: string;
    created_by: string | null;
    deleted_at: Date | null;
    created_at: Date;
    _count: PalletsCountAggregateOutputType | null;
    _min: PalletsMinAggregateOutputType | null;
    _max: PalletsMaxAggregateOutputType | null;
};
export type GetPalletsGroupByPayload<T extends palletsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PalletsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PalletsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PalletsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PalletsGroupByOutputType[P]>;
}>>;
export type palletsWhereInput = {
    AND?: Prisma.palletsWhereInput | Prisma.palletsWhereInput[];
    OR?: Prisma.palletsWhereInput[];
    NOT?: Prisma.palletsWhereInput | Prisma.palletsWhereInput[];
    id?: Prisma.UuidFilter<"pallets"> | string;
    code?: Prisma.StringFilter<"pallets"> | string;
    warehouse_id?: Prisma.UuidNullableFilter<"pallets"> | string | null;
    status?: Prisma.StringFilter<"pallets"> | string;
    created_by?: Prisma.UuidNullableFilter<"pallets"> | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"pallets"> | Date | string | null;
    created_at?: Prisma.DateTimeFilter<"pallets"> | Date | string;
    cargo_transfer_items?: Prisma.Cargo_transfer_itemsListRelationFilter;
    pallet_items?: Prisma.Pallet_itemsListRelationFilter;
    users?: Prisma.XOR<Prisma.UsersNullableScalarRelationFilter, Prisma.usersWhereInput> | null;
    warehouses?: Prisma.XOR<Prisma.WarehousesNullableScalarRelationFilter, Prisma.warehousesWhereInput> | null;
    picking_results?: Prisma.Picking_resultsListRelationFilter;
    picking_sources?: Prisma.Picking_sourcesListRelationFilter;
    trip_cargo?: Prisma.Trip_cargoListRelationFilter;
};
export type palletsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsOrderByRelationAggregateInput;
    pallet_items?: Prisma.pallet_itemsOrderByRelationAggregateInput;
    users?: Prisma.usersOrderByWithRelationInput;
    warehouses?: Prisma.warehousesOrderByWithRelationInput;
    picking_results?: Prisma.picking_resultsOrderByRelationAggregateInput;
    picking_sources?: Prisma.picking_sourcesOrderByRelationAggregateInput;
    trip_cargo?: Prisma.trip_cargoOrderByRelationAggregateInput;
};
export type palletsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    code?: string;
    AND?: Prisma.palletsWhereInput | Prisma.palletsWhereInput[];
    OR?: Prisma.palletsWhereInput[];
    NOT?: Prisma.palletsWhereInput | Prisma.palletsWhereInput[];
    warehouse_id?: Prisma.UuidNullableFilter<"pallets"> | string | null;
    status?: Prisma.StringFilter<"pallets"> | string;
    created_by?: Prisma.UuidNullableFilter<"pallets"> | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"pallets"> | Date | string | null;
    created_at?: Prisma.DateTimeFilter<"pallets"> | Date | string;
    cargo_transfer_items?: Prisma.Cargo_transfer_itemsListRelationFilter;
    pallet_items?: Prisma.Pallet_itemsListRelationFilter;
    users?: Prisma.XOR<Prisma.UsersNullableScalarRelationFilter, Prisma.usersWhereInput> | null;
    warehouses?: Prisma.XOR<Prisma.WarehousesNullableScalarRelationFilter, Prisma.warehousesWhereInput> | null;
    picking_results?: Prisma.Picking_resultsListRelationFilter;
    picking_sources?: Prisma.Picking_sourcesListRelationFilter;
    trip_cargo?: Prisma.Trip_cargoListRelationFilter;
}, "id" | "code">;
export type palletsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.palletsCountOrderByAggregateInput;
    _max?: Prisma.palletsMaxOrderByAggregateInput;
    _min?: Prisma.palletsMinOrderByAggregateInput;
};
export type palletsScalarWhereWithAggregatesInput = {
    AND?: Prisma.palletsScalarWhereWithAggregatesInput | Prisma.palletsScalarWhereWithAggregatesInput[];
    OR?: Prisma.palletsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.palletsScalarWhereWithAggregatesInput | Prisma.palletsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"pallets"> | string;
    code?: Prisma.StringWithAggregatesFilter<"pallets"> | string;
    warehouse_id?: Prisma.UuidNullableWithAggregatesFilter<"pallets"> | string | null;
    status?: Prisma.StringWithAggregatesFilter<"pallets"> | string;
    created_by?: Prisma.UuidNullableWithAggregatesFilter<"pallets"> | string | null;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"pallets"> | Date | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"pallets"> | Date | string;
};
export type palletsCreateInput = {
    id?: string;
    code: string;
    status: string;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsCreateNestedManyWithoutPalletsInput;
    pallet_items?: Prisma.pallet_itemsCreateNestedManyWithoutPalletsInput;
    users?: Prisma.usersCreateNestedOneWithoutPalletsInput;
    warehouses?: Prisma.warehousesCreateNestedOneWithoutPalletsInput;
    picking_results?: Prisma.picking_resultsCreateNestedManyWithoutPalletsInput;
    picking_sources?: Prisma.picking_sourcesCreateNestedManyWithoutPalletsInput;
    trip_cargo?: Prisma.trip_cargoCreateNestedManyWithoutPalletsInput;
};
export type palletsUncheckedCreateInput = {
    id?: string;
    code: string;
    warehouse_id?: string | null;
    status: string;
    created_by?: string | null;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUncheckedCreateNestedManyWithoutPalletsInput;
    pallet_items?: Prisma.pallet_itemsUncheckedCreateNestedManyWithoutPalletsInput;
    picking_results?: Prisma.picking_resultsUncheckedCreateNestedManyWithoutPalletsInput;
    picking_sources?: Prisma.picking_sourcesUncheckedCreateNestedManyWithoutPalletsInput;
    trip_cargo?: Prisma.trip_cargoUncheckedCreateNestedManyWithoutPalletsInput;
};
export type palletsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUpdateManyWithoutPalletsNestedInput;
    pallet_items?: Prisma.pallet_itemsUpdateManyWithoutPalletsNestedInput;
    users?: Prisma.usersUpdateOneWithoutPalletsNestedInput;
    warehouses?: Prisma.warehousesUpdateOneWithoutPalletsNestedInput;
    picking_results?: Prisma.picking_resultsUpdateManyWithoutPalletsNestedInput;
    picking_sources?: Prisma.picking_sourcesUpdateManyWithoutPalletsNestedInput;
    trip_cargo?: Prisma.trip_cargoUpdateManyWithoutPalletsNestedInput;
};
export type palletsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUncheckedUpdateManyWithoutPalletsNestedInput;
    pallet_items?: Prisma.pallet_itemsUncheckedUpdateManyWithoutPalletsNestedInput;
    picking_results?: Prisma.picking_resultsUncheckedUpdateManyWithoutPalletsNestedInput;
    picking_sources?: Prisma.picking_sourcesUncheckedUpdateManyWithoutPalletsNestedInput;
    trip_cargo?: Prisma.trip_cargoUncheckedUpdateManyWithoutPalletsNestedInput;
};
export type palletsCreateManyInput = {
    id?: string;
    code: string;
    warehouse_id?: string | null;
    status: string;
    created_by?: string | null;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
};
export type palletsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type palletsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PalletsNullableScalarRelationFilter = {
    is?: Prisma.palletsWhereInput | null;
    isNot?: Prisma.palletsWhereInput | null;
};
export type PalletsScalarRelationFilter = {
    is?: Prisma.palletsWhereInput;
    isNot?: Prisma.palletsWhereInput;
};
export type palletsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_by?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type palletsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_by?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type palletsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_by?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type PalletsListRelationFilter = {
    every?: Prisma.palletsWhereInput;
    some?: Prisma.palletsWhereInput;
    none?: Prisma.palletsWhereInput;
};
export type palletsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type palletsCreateNestedOneWithoutCargo_transfer_itemsInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutCargo_transfer_itemsInput, Prisma.palletsUncheckedCreateWithoutCargo_transfer_itemsInput>;
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutCargo_transfer_itemsInput;
    connect?: Prisma.palletsWhereUniqueInput;
};
export type palletsUpdateOneWithoutCargo_transfer_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutCargo_transfer_itemsInput, Prisma.palletsUncheckedCreateWithoutCargo_transfer_itemsInput>;
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutCargo_transfer_itemsInput;
    upsert?: Prisma.palletsUpsertWithoutCargo_transfer_itemsInput;
    disconnect?: Prisma.palletsWhereInput | boolean;
    delete?: Prisma.palletsWhereInput | boolean;
    connect?: Prisma.palletsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.palletsUpdateToOneWithWhereWithoutCargo_transfer_itemsInput, Prisma.palletsUpdateWithoutCargo_transfer_itemsInput>, Prisma.palletsUncheckedUpdateWithoutCargo_transfer_itemsInput>;
};
export type palletsCreateNestedOneWithoutPallet_itemsInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutPallet_itemsInput, Prisma.palletsUncheckedCreateWithoutPallet_itemsInput>;
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutPallet_itemsInput;
    connect?: Prisma.palletsWhereUniqueInput;
};
export type palletsUpdateOneRequiredWithoutPallet_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutPallet_itemsInput, Prisma.palletsUncheckedCreateWithoutPallet_itemsInput>;
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutPallet_itemsInput;
    upsert?: Prisma.palletsUpsertWithoutPallet_itemsInput;
    connect?: Prisma.palletsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.palletsUpdateToOneWithWhereWithoutPallet_itemsInput, Prisma.palletsUpdateWithoutPallet_itemsInput>, Prisma.palletsUncheckedUpdateWithoutPallet_itemsInput>;
};
export type palletsCreateNestedOneWithoutPicking_resultsInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutPicking_resultsInput, Prisma.palletsUncheckedCreateWithoutPicking_resultsInput>;
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutPicking_resultsInput;
    connect?: Prisma.palletsWhereUniqueInput;
};
export type palletsUpdateOneRequiredWithoutPicking_resultsNestedInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutPicking_resultsInput, Prisma.palletsUncheckedCreateWithoutPicking_resultsInput>;
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutPicking_resultsInput;
    upsert?: Prisma.palletsUpsertWithoutPicking_resultsInput;
    connect?: Prisma.palletsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.palletsUpdateToOneWithWhereWithoutPicking_resultsInput, Prisma.palletsUpdateWithoutPicking_resultsInput>, Prisma.palletsUncheckedUpdateWithoutPicking_resultsInput>;
};
export type palletsCreateNestedOneWithoutPicking_sourcesInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutPicking_sourcesInput, Prisma.palletsUncheckedCreateWithoutPicking_sourcesInput>;
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutPicking_sourcesInput;
    connect?: Prisma.palletsWhereUniqueInput;
};
export type palletsUpdateOneRequiredWithoutPicking_sourcesNestedInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutPicking_sourcesInput, Prisma.palletsUncheckedCreateWithoutPicking_sourcesInput>;
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutPicking_sourcesInput;
    upsert?: Prisma.palletsUpsertWithoutPicking_sourcesInput;
    connect?: Prisma.palletsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.palletsUpdateToOneWithWhereWithoutPicking_sourcesInput, Prisma.palletsUpdateWithoutPicking_sourcesInput>, Prisma.palletsUncheckedUpdateWithoutPicking_sourcesInput>;
};
export type palletsCreateNestedOneWithoutTrip_cargoInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutTrip_cargoInput, Prisma.palletsUncheckedCreateWithoutTrip_cargoInput>;
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutTrip_cargoInput;
    connect?: Prisma.palletsWhereUniqueInput;
};
export type palletsUpdateOneWithoutTrip_cargoNestedInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutTrip_cargoInput, Prisma.palletsUncheckedCreateWithoutTrip_cargoInput>;
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutTrip_cargoInput;
    upsert?: Prisma.palletsUpsertWithoutTrip_cargoInput;
    disconnect?: Prisma.palletsWhereInput | boolean;
    delete?: Prisma.palletsWhereInput | boolean;
    connect?: Prisma.palletsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.palletsUpdateToOneWithWhereWithoutTrip_cargoInput, Prisma.palletsUpdateWithoutTrip_cargoInput>, Prisma.palletsUncheckedUpdateWithoutTrip_cargoInput>;
};
export type palletsCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutUsersInput, Prisma.palletsUncheckedCreateWithoutUsersInput> | Prisma.palletsCreateWithoutUsersInput[] | Prisma.palletsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutUsersInput | Prisma.palletsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.palletsCreateManyUsersInputEnvelope;
    connect?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
};
export type palletsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutUsersInput, Prisma.palletsUncheckedCreateWithoutUsersInput> | Prisma.palletsCreateWithoutUsersInput[] | Prisma.palletsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutUsersInput | Prisma.palletsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.palletsCreateManyUsersInputEnvelope;
    connect?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
};
export type palletsUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutUsersInput, Prisma.palletsUncheckedCreateWithoutUsersInput> | Prisma.palletsCreateWithoutUsersInput[] | Prisma.palletsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutUsersInput | Prisma.palletsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.palletsUpsertWithWhereUniqueWithoutUsersInput | Prisma.palletsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.palletsCreateManyUsersInputEnvelope;
    set?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    disconnect?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    delete?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    connect?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    update?: Prisma.palletsUpdateWithWhereUniqueWithoutUsersInput | Prisma.palletsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.palletsUpdateManyWithWhereWithoutUsersInput | Prisma.palletsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.palletsScalarWhereInput | Prisma.palletsScalarWhereInput[];
};
export type palletsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutUsersInput, Prisma.palletsUncheckedCreateWithoutUsersInput> | Prisma.palletsCreateWithoutUsersInput[] | Prisma.palletsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutUsersInput | Prisma.palletsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.palletsUpsertWithWhereUniqueWithoutUsersInput | Prisma.palletsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.palletsCreateManyUsersInputEnvelope;
    set?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    disconnect?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    delete?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    connect?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    update?: Prisma.palletsUpdateWithWhereUniqueWithoutUsersInput | Prisma.palletsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.palletsUpdateManyWithWhereWithoutUsersInput | Prisma.palletsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.palletsScalarWhereInput | Prisma.palletsScalarWhereInput[];
};
export type palletsCreateNestedManyWithoutWarehousesInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutWarehousesInput, Prisma.palletsUncheckedCreateWithoutWarehousesInput> | Prisma.palletsCreateWithoutWarehousesInput[] | Prisma.palletsUncheckedCreateWithoutWarehousesInput[];
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutWarehousesInput | Prisma.palletsCreateOrConnectWithoutWarehousesInput[];
    createMany?: Prisma.palletsCreateManyWarehousesInputEnvelope;
    connect?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
};
export type palletsUncheckedCreateNestedManyWithoutWarehousesInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutWarehousesInput, Prisma.palletsUncheckedCreateWithoutWarehousesInput> | Prisma.palletsCreateWithoutWarehousesInput[] | Prisma.palletsUncheckedCreateWithoutWarehousesInput[];
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutWarehousesInput | Prisma.palletsCreateOrConnectWithoutWarehousesInput[];
    createMany?: Prisma.palletsCreateManyWarehousesInputEnvelope;
    connect?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
};
export type palletsUpdateManyWithoutWarehousesNestedInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutWarehousesInput, Prisma.palletsUncheckedCreateWithoutWarehousesInput> | Prisma.palletsCreateWithoutWarehousesInput[] | Prisma.palletsUncheckedCreateWithoutWarehousesInput[];
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutWarehousesInput | Prisma.palletsCreateOrConnectWithoutWarehousesInput[];
    upsert?: Prisma.palletsUpsertWithWhereUniqueWithoutWarehousesInput | Prisma.palletsUpsertWithWhereUniqueWithoutWarehousesInput[];
    createMany?: Prisma.palletsCreateManyWarehousesInputEnvelope;
    set?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    disconnect?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    delete?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    connect?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    update?: Prisma.palletsUpdateWithWhereUniqueWithoutWarehousesInput | Prisma.palletsUpdateWithWhereUniqueWithoutWarehousesInput[];
    updateMany?: Prisma.palletsUpdateManyWithWhereWithoutWarehousesInput | Prisma.palletsUpdateManyWithWhereWithoutWarehousesInput[];
    deleteMany?: Prisma.palletsScalarWhereInput | Prisma.palletsScalarWhereInput[];
};
export type palletsUncheckedUpdateManyWithoutWarehousesNestedInput = {
    create?: Prisma.XOR<Prisma.palletsCreateWithoutWarehousesInput, Prisma.palletsUncheckedCreateWithoutWarehousesInput> | Prisma.palletsCreateWithoutWarehousesInput[] | Prisma.palletsUncheckedCreateWithoutWarehousesInput[];
    connectOrCreate?: Prisma.palletsCreateOrConnectWithoutWarehousesInput | Prisma.palletsCreateOrConnectWithoutWarehousesInput[];
    upsert?: Prisma.palletsUpsertWithWhereUniqueWithoutWarehousesInput | Prisma.palletsUpsertWithWhereUniqueWithoutWarehousesInput[];
    createMany?: Prisma.palletsCreateManyWarehousesInputEnvelope;
    set?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    disconnect?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    delete?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    connect?: Prisma.palletsWhereUniqueInput | Prisma.palletsWhereUniqueInput[];
    update?: Prisma.palletsUpdateWithWhereUniqueWithoutWarehousesInput | Prisma.palletsUpdateWithWhereUniqueWithoutWarehousesInput[];
    updateMany?: Prisma.palletsUpdateManyWithWhereWithoutWarehousesInput | Prisma.palletsUpdateManyWithWhereWithoutWarehousesInput[];
    deleteMany?: Prisma.palletsScalarWhereInput | Prisma.palletsScalarWhereInput[];
};
export type palletsCreateWithoutCargo_transfer_itemsInput = {
    id?: string;
    code: string;
    status: string;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    pallet_items?: Prisma.pallet_itemsCreateNestedManyWithoutPalletsInput;
    users?: Prisma.usersCreateNestedOneWithoutPalletsInput;
    warehouses?: Prisma.warehousesCreateNestedOneWithoutPalletsInput;
    picking_results?: Prisma.picking_resultsCreateNestedManyWithoutPalletsInput;
    picking_sources?: Prisma.picking_sourcesCreateNestedManyWithoutPalletsInput;
    trip_cargo?: Prisma.trip_cargoCreateNestedManyWithoutPalletsInput;
};
export type palletsUncheckedCreateWithoutCargo_transfer_itemsInput = {
    id?: string;
    code: string;
    warehouse_id?: string | null;
    status: string;
    created_by?: string | null;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    pallet_items?: Prisma.pallet_itemsUncheckedCreateNestedManyWithoutPalletsInput;
    picking_results?: Prisma.picking_resultsUncheckedCreateNestedManyWithoutPalletsInput;
    picking_sources?: Prisma.picking_sourcesUncheckedCreateNestedManyWithoutPalletsInput;
    trip_cargo?: Prisma.trip_cargoUncheckedCreateNestedManyWithoutPalletsInput;
};
export type palletsCreateOrConnectWithoutCargo_transfer_itemsInput = {
    where: Prisma.palletsWhereUniqueInput;
    create: Prisma.XOR<Prisma.palletsCreateWithoutCargo_transfer_itemsInput, Prisma.palletsUncheckedCreateWithoutCargo_transfer_itemsInput>;
};
export type palletsUpsertWithoutCargo_transfer_itemsInput = {
    update: Prisma.XOR<Prisma.palletsUpdateWithoutCargo_transfer_itemsInput, Prisma.palletsUncheckedUpdateWithoutCargo_transfer_itemsInput>;
    create: Prisma.XOR<Prisma.palletsCreateWithoutCargo_transfer_itemsInput, Prisma.palletsUncheckedCreateWithoutCargo_transfer_itemsInput>;
    where?: Prisma.palletsWhereInput;
};
export type palletsUpdateToOneWithWhereWithoutCargo_transfer_itemsInput = {
    where?: Prisma.palletsWhereInput;
    data: Prisma.XOR<Prisma.palletsUpdateWithoutCargo_transfer_itemsInput, Prisma.palletsUncheckedUpdateWithoutCargo_transfer_itemsInput>;
};
export type palletsUpdateWithoutCargo_transfer_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pallet_items?: Prisma.pallet_itemsUpdateManyWithoutPalletsNestedInput;
    users?: Prisma.usersUpdateOneWithoutPalletsNestedInput;
    warehouses?: Prisma.warehousesUpdateOneWithoutPalletsNestedInput;
    picking_results?: Prisma.picking_resultsUpdateManyWithoutPalletsNestedInput;
    picking_sources?: Prisma.picking_sourcesUpdateManyWithoutPalletsNestedInput;
    trip_cargo?: Prisma.trip_cargoUpdateManyWithoutPalletsNestedInput;
};
export type palletsUncheckedUpdateWithoutCargo_transfer_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pallet_items?: Prisma.pallet_itemsUncheckedUpdateManyWithoutPalletsNestedInput;
    picking_results?: Prisma.picking_resultsUncheckedUpdateManyWithoutPalletsNestedInput;
    picking_sources?: Prisma.picking_sourcesUncheckedUpdateManyWithoutPalletsNestedInput;
    trip_cargo?: Prisma.trip_cargoUncheckedUpdateManyWithoutPalletsNestedInput;
};
export type palletsCreateWithoutPallet_itemsInput = {
    id?: string;
    code: string;
    status: string;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsCreateNestedManyWithoutPalletsInput;
    users?: Prisma.usersCreateNestedOneWithoutPalletsInput;
    warehouses?: Prisma.warehousesCreateNestedOneWithoutPalletsInput;
    picking_results?: Prisma.picking_resultsCreateNestedManyWithoutPalletsInput;
    picking_sources?: Prisma.picking_sourcesCreateNestedManyWithoutPalletsInput;
    trip_cargo?: Prisma.trip_cargoCreateNestedManyWithoutPalletsInput;
};
export type palletsUncheckedCreateWithoutPallet_itemsInput = {
    id?: string;
    code: string;
    warehouse_id?: string | null;
    status: string;
    created_by?: string | null;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUncheckedCreateNestedManyWithoutPalletsInput;
    picking_results?: Prisma.picking_resultsUncheckedCreateNestedManyWithoutPalletsInput;
    picking_sources?: Prisma.picking_sourcesUncheckedCreateNestedManyWithoutPalletsInput;
    trip_cargo?: Prisma.trip_cargoUncheckedCreateNestedManyWithoutPalletsInput;
};
export type palletsCreateOrConnectWithoutPallet_itemsInput = {
    where: Prisma.palletsWhereUniqueInput;
    create: Prisma.XOR<Prisma.palletsCreateWithoutPallet_itemsInput, Prisma.palletsUncheckedCreateWithoutPallet_itemsInput>;
};
export type palletsUpsertWithoutPallet_itemsInput = {
    update: Prisma.XOR<Prisma.palletsUpdateWithoutPallet_itemsInput, Prisma.palletsUncheckedUpdateWithoutPallet_itemsInput>;
    create: Prisma.XOR<Prisma.palletsCreateWithoutPallet_itemsInput, Prisma.palletsUncheckedCreateWithoutPallet_itemsInput>;
    where?: Prisma.palletsWhereInput;
};
export type palletsUpdateToOneWithWhereWithoutPallet_itemsInput = {
    where?: Prisma.palletsWhereInput;
    data: Prisma.XOR<Prisma.palletsUpdateWithoutPallet_itemsInput, Prisma.palletsUncheckedUpdateWithoutPallet_itemsInput>;
};
export type palletsUpdateWithoutPallet_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUpdateManyWithoutPalletsNestedInput;
    users?: Prisma.usersUpdateOneWithoutPalletsNestedInput;
    warehouses?: Prisma.warehousesUpdateOneWithoutPalletsNestedInput;
    picking_results?: Prisma.picking_resultsUpdateManyWithoutPalletsNestedInput;
    picking_sources?: Prisma.picking_sourcesUpdateManyWithoutPalletsNestedInput;
    trip_cargo?: Prisma.trip_cargoUpdateManyWithoutPalletsNestedInput;
};
export type palletsUncheckedUpdateWithoutPallet_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUncheckedUpdateManyWithoutPalletsNestedInput;
    picking_results?: Prisma.picking_resultsUncheckedUpdateManyWithoutPalletsNestedInput;
    picking_sources?: Prisma.picking_sourcesUncheckedUpdateManyWithoutPalletsNestedInput;
    trip_cargo?: Prisma.trip_cargoUncheckedUpdateManyWithoutPalletsNestedInput;
};
export type palletsCreateWithoutPicking_resultsInput = {
    id?: string;
    code: string;
    status: string;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsCreateNestedManyWithoutPalletsInput;
    pallet_items?: Prisma.pallet_itemsCreateNestedManyWithoutPalletsInput;
    users?: Prisma.usersCreateNestedOneWithoutPalletsInput;
    warehouses?: Prisma.warehousesCreateNestedOneWithoutPalletsInput;
    picking_sources?: Prisma.picking_sourcesCreateNestedManyWithoutPalletsInput;
    trip_cargo?: Prisma.trip_cargoCreateNestedManyWithoutPalletsInput;
};
export type palletsUncheckedCreateWithoutPicking_resultsInput = {
    id?: string;
    code: string;
    warehouse_id?: string | null;
    status: string;
    created_by?: string | null;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUncheckedCreateNestedManyWithoutPalletsInput;
    pallet_items?: Prisma.pallet_itemsUncheckedCreateNestedManyWithoutPalletsInput;
    picking_sources?: Prisma.picking_sourcesUncheckedCreateNestedManyWithoutPalletsInput;
    trip_cargo?: Prisma.trip_cargoUncheckedCreateNestedManyWithoutPalletsInput;
};
export type palletsCreateOrConnectWithoutPicking_resultsInput = {
    where: Prisma.palletsWhereUniqueInput;
    create: Prisma.XOR<Prisma.palletsCreateWithoutPicking_resultsInput, Prisma.palletsUncheckedCreateWithoutPicking_resultsInput>;
};
export type palletsUpsertWithoutPicking_resultsInput = {
    update: Prisma.XOR<Prisma.palletsUpdateWithoutPicking_resultsInput, Prisma.palletsUncheckedUpdateWithoutPicking_resultsInput>;
    create: Prisma.XOR<Prisma.palletsCreateWithoutPicking_resultsInput, Prisma.palletsUncheckedCreateWithoutPicking_resultsInput>;
    where?: Prisma.palletsWhereInput;
};
export type palletsUpdateToOneWithWhereWithoutPicking_resultsInput = {
    where?: Prisma.palletsWhereInput;
    data: Prisma.XOR<Prisma.palletsUpdateWithoutPicking_resultsInput, Prisma.palletsUncheckedUpdateWithoutPicking_resultsInput>;
};
export type palletsUpdateWithoutPicking_resultsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUpdateManyWithoutPalletsNestedInput;
    pallet_items?: Prisma.pallet_itemsUpdateManyWithoutPalletsNestedInput;
    users?: Prisma.usersUpdateOneWithoutPalletsNestedInput;
    warehouses?: Prisma.warehousesUpdateOneWithoutPalletsNestedInput;
    picking_sources?: Prisma.picking_sourcesUpdateManyWithoutPalletsNestedInput;
    trip_cargo?: Prisma.trip_cargoUpdateManyWithoutPalletsNestedInput;
};
export type palletsUncheckedUpdateWithoutPicking_resultsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUncheckedUpdateManyWithoutPalletsNestedInput;
    pallet_items?: Prisma.pallet_itemsUncheckedUpdateManyWithoutPalletsNestedInput;
    picking_sources?: Prisma.picking_sourcesUncheckedUpdateManyWithoutPalletsNestedInput;
    trip_cargo?: Prisma.trip_cargoUncheckedUpdateManyWithoutPalletsNestedInput;
};
export type palletsCreateWithoutPicking_sourcesInput = {
    id?: string;
    code: string;
    status: string;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsCreateNestedManyWithoutPalletsInput;
    pallet_items?: Prisma.pallet_itemsCreateNestedManyWithoutPalletsInput;
    users?: Prisma.usersCreateNestedOneWithoutPalletsInput;
    warehouses?: Prisma.warehousesCreateNestedOneWithoutPalletsInput;
    picking_results?: Prisma.picking_resultsCreateNestedManyWithoutPalletsInput;
    trip_cargo?: Prisma.trip_cargoCreateNestedManyWithoutPalletsInput;
};
export type palletsUncheckedCreateWithoutPicking_sourcesInput = {
    id?: string;
    code: string;
    warehouse_id?: string | null;
    status: string;
    created_by?: string | null;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUncheckedCreateNestedManyWithoutPalletsInput;
    pallet_items?: Prisma.pallet_itemsUncheckedCreateNestedManyWithoutPalletsInput;
    picking_results?: Prisma.picking_resultsUncheckedCreateNestedManyWithoutPalletsInput;
    trip_cargo?: Prisma.trip_cargoUncheckedCreateNestedManyWithoutPalletsInput;
};
export type palletsCreateOrConnectWithoutPicking_sourcesInput = {
    where: Prisma.palletsWhereUniqueInput;
    create: Prisma.XOR<Prisma.palletsCreateWithoutPicking_sourcesInput, Prisma.palletsUncheckedCreateWithoutPicking_sourcesInput>;
};
export type palletsUpsertWithoutPicking_sourcesInput = {
    update: Prisma.XOR<Prisma.palletsUpdateWithoutPicking_sourcesInput, Prisma.palletsUncheckedUpdateWithoutPicking_sourcesInput>;
    create: Prisma.XOR<Prisma.palletsCreateWithoutPicking_sourcesInput, Prisma.palletsUncheckedCreateWithoutPicking_sourcesInput>;
    where?: Prisma.palletsWhereInput;
};
export type palletsUpdateToOneWithWhereWithoutPicking_sourcesInput = {
    where?: Prisma.palletsWhereInput;
    data: Prisma.XOR<Prisma.palletsUpdateWithoutPicking_sourcesInput, Prisma.palletsUncheckedUpdateWithoutPicking_sourcesInput>;
};
export type palletsUpdateWithoutPicking_sourcesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUpdateManyWithoutPalletsNestedInput;
    pallet_items?: Prisma.pallet_itemsUpdateManyWithoutPalletsNestedInput;
    users?: Prisma.usersUpdateOneWithoutPalletsNestedInput;
    warehouses?: Prisma.warehousesUpdateOneWithoutPalletsNestedInput;
    picking_results?: Prisma.picking_resultsUpdateManyWithoutPalletsNestedInput;
    trip_cargo?: Prisma.trip_cargoUpdateManyWithoutPalletsNestedInput;
};
export type palletsUncheckedUpdateWithoutPicking_sourcesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUncheckedUpdateManyWithoutPalletsNestedInput;
    pallet_items?: Prisma.pallet_itemsUncheckedUpdateManyWithoutPalletsNestedInput;
    picking_results?: Prisma.picking_resultsUncheckedUpdateManyWithoutPalletsNestedInput;
    trip_cargo?: Prisma.trip_cargoUncheckedUpdateManyWithoutPalletsNestedInput;
};
export type palletsCreateWithoutTrip_cargoInput = {
    id?: string;
    code: string;
    status: string;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsCreateNestedManyWithoutPalletsInput;
    pallet_items?: Prisma.pallet_itemsCreateNestedManyWithoutPalletsInput;
    users?: Prisma.usersCreateNestedOneWithoutPalletsInput;
    warehouses?: Prisma.warehousesCreateNestedOneWithoutPalletsInput;
    picking_results?: Prisma.picking_resultsCreateNestedManyWithoutPalletsInput;
    picking_sources?: Prisma.picking_sourcesCreateNestedManyWithoutPalletsInput;
};
export type palletsUncheckedCreateWithoutTrip_cargoInput = {
    id?: string;
    code: string;
    warehouse_id?: string | null;
    status: string;
    created_by?: string | null;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUncheckedCreateNestedManyWithoutPalletsInput;
    pallet_items?: Prisma.pallet_itemsUncheckedCreateNestedManyWithoutPalletsInput;
    picking_results?: Prisma.picking_resultsUncheckedCreateNestedManyWithoutPalletsInput;
    picking_sources?: Prisma.picking_sourcesUncheckedCreateNestedManyWithoutPalletsInput;
};
export type palletsCreateOrConnectWithoutTrip_cargoInput = {
    where: Prisma.palletsWhereUniqueInput;
    create: Prisma.XOR<Prisma.palletsCreateWithoutTrip_cargoInput, Prisma.palletsUncheckedCreateWithoutTrip_cargoInput>;
};
export type palletsUpsertWithoutTrip_cargoInput = {
    update: Prisma.XOR<Prisma.palletsUpdateWithoutTrip_cargoInput, Prisma.palletsUncheckedUpdateWithoutTrip_cargoInput>;
    create: Prisma.XOR<Prisma.palletsCreateWithoutTrip_cargoInput, Prisma.palletsUncheckedCreateWithoutTrip_cargoInput>;
    where?: Prisma.palletsWhereInput;
};
export type palletsUpdateToOneWithWhereWithoutTrip_cargoInput = {
    where?: Prisma.palletsWhereInput;
    data: Prisma.XOR<Prisma.palletsUpdateWithoutTrip_cargoInput, Prisma.palletsUncheckedUpdateWithoutTrip_cargoInput>;
};
export type palletsUpdateWithoutTrip_cargoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUpdateManyWithoutPalletsNestedInput;
    pallet_items?: Prisma.pallet_itemsUpdateManyWithoutPalletsNestedInput;
    users?: Prisma.usersUpdateOneWithoutPalletsNestedInput;
    warehouses?: Prisma.warehousesUpdateOneWithoutPalletsNestedInput;
    picking_results?: Prisma.picking_resultsUpdateManyWithoutPalletsNestedInput;
    picking_sources?: Prisma.picking_sourcesUpdateManyWithoutPalletsNestedInput;
};
export type palletsUncheckedUpdateWithoutTrip_cargoInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUncheckedUpdateManyWithoutPalletsNestedInput;
    pallet_items?: Prisma.pallet_itemsUncheckedUpdateManyWithoutPalletsNestedInput;
    picking_results?: Prisma.picking_resultsUncheckedUpdateManyWithoutPalletsNestedInput;
    picking_sources?: Prisma.picking_sourcesUncheckedUpdateManyWithoutPalletsNestedInput;
};
export type palletsCreateWithoutUsersInput = {
    id?: string;
    code: string;
    status: string;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsCreateNestedManyWithoutPalletsInput;
    pallet_items?: Prisma.pallet_itemsCreateNestedManyWithoutPalletsInput;
    warehouses?: Prisma.warehousesCreateNestedOneWithoutPalletsInput;
    picking_results?: Prisma.picking_resultsCreateNestedManyWithoutPalletsInput;
    picking_sources?: Prisma.picking_sourcesCreateNestedManyWithoutPalletsInput;
    trip_cargo?: Prisma.trip_cargoCreateNestedManyWithoutPalletsInput;
};
export type palletsUncheckedCreateWithoutUsersInput = {
    id?: string;
    code: string;
    warehouse_id?: string | null;
    status: string;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUncheckedCreateNestedManyWithoutPalletsInput;
    pallet_items?: Prisma.pallet_itemsUncheckedCreateNestedManyWithoutPalletsInput;
    picking_results?: Prisma.picking_resultsUncheckedCreateNestedManyWithoutPalletsInput;
    picking_sources?: Prisma.picking_sourcesUncheckedCreateNestedManyWithoutPalletsInput;
    trip_cargo?: Prisma.trip_cargoUncheckedCreateNestedManyWithoutPalletsInput;
};
export type palletsCreateOrConnectWithoutUsersInput = {
    where: Prisma.palletsWhereUniqueInput;
    create: Prisma.XOR<Prisma.palletsCreateWithoutUsersInput, Prisma.palletsUncheckedCreateWithoutUsersInput>;
};
export type palletsCreateManyUsersInputEnvelope = {
    data: Prisma.palletsCreateManyUsersInput | Prisma.palletsCreateManyUsersInput[];
    skipDuplicates?: boolean;
};
export type palletsUpsertWithWhereUniqueWithoutUsersInput = {
    where: Prisma.palletsWhereUniqueInput;
    update: Prisma.XOR<Prisma.palletsUpdateWithoutUsersInput, Prisma.palletsUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.palletsCreateWithoutUsersInput, Prisma.palletsUncheckedCreateWithoutUsersInput>;
};
export type palletsUpdateWithWhereUniqueWithoutUsersInput = {
    where: Prisma.palletsWhereUniqueInput;
    data: Prisma.XOR<Prisma.palletsUpdateWithoutUsersInput, Prisma.palletsUncheckedUpdateWithoutUsersInput>;
};
export type palletsUpdateManyWithWhereWithoutUsersInput = {
    where: Prisma.palletsScalarWhereInput;
    data: Prisma.XOR<Prisma.palletsUpdateManyMutationInput, Prisma.palletsUncheckedUpdateManyWithoutUsersInput>;
};
export type palletsScalarWhereInput = {
    AND?: Prisma.palletsScalarWhereInput | Prisma.palletsScalarWhereInput[];
    OR?: Prisma.palletsScalarWhereInput[];
    NOT?: Prisma.palletsScalarWhereInput | Prisma.palletsScalarWhereInput[];
    id?: Prisma.UuidFilter<"pallets"> | string;
    code?: Prisma.StringFilter<"pallets"> | string;
    warehouse_id?: Prisma.UuidNullableFilter<"pallets"> | string | null;
    status?: Prisma.StringFilter<"pallets"> | string;
    created_by?: Prisma.UuidNullableFilter<"pallets"> | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"pallets"> | Date | string | null;
    created_at?: Prisma.DateTimeFilter<"pallets"> | Date | string;
};
export type palletsCreateWithoutWarehousesInput = {
    id?: string;
    code: string;
    status: string;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsCreateNestedManyWithoutPalletsInput;
    pallet_items?: Prisma.pallet_itemsCreateNestedManyWithoutPalletsInput;
    users?: Prisma.usersCreateNestedOneWithoutPalletsInput;
    picking_results?: Prisma.picking_resultsCreateNestedManyWithoutPalletsInput;
    picking_sources?: Prisma.picking_sourcesCreateNestedManyWithoutPalletsInput;
    trip_cargo?: Prisma.trip_cargoCreateNestedManyWithoutPalletsInput;
};
export type palletsUncheckedCreateWithoutWarehousesInput = {
    id?: string;
    code: string;
    status: string;
    created_by?: string | null;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUncheckedCreateNestedManyWithoutPalletsInput;
    pallet_items?: Prisma.pallet_itemsUncheckedCreateNestedManyWithoutPalletsInput;
    picking_results?: Prisma.picking_resultsUncheckedCreateNestedManyWithoutPalletsInput;
    picking_sources?: Prisma.picking_sourcesUncheckedCreateNestedManyWithoutPalletsInput;
    trip_cargo?: Prisma.trip_cargoUncheckedCreateNestedManyWithoutPalletsInput;
};
export type palletsCreateOrConnectWithoutWarehousesInput = {
    where: Prisma.palletsWhereUniqueInput;
    create: Prisma.XOR<Prisma.palletsCreateWithoutWarehousesInput, Prisma.palletsUncheckedCreateWithoutWarehousesInput>;
};
export type palletsCreateManyWarehousesInputEnvelope = {
    data: Prisma.palletsCreateManyWarehousesInput | Prisma.palletsCreateManyWarehousesInput[];
    skipDuplicates?: boolean;
};
export type palletsUpsertWithWhereUniqueWithoutWarehousesInput = {
    where: Prisma.palletsWhereUniqueInput;
    update: Prisma.XOR<Prisma.palletsUpdateWithoutWarehousesInput, Prisma.palletsUncheckedUpdateWithoutWarehousesInput>;
    create: Prisma.XOR<Prisma.palletsCreateWithoutWarehousesInput, Prisma.palletsUncheckedCreateWithoutWarehousesInput>;
};
export type palletsUpdateWithWhereUniqueWithoutWarehousesInput = {
    where: Prisma.palletsWhereUniqueInput;
    data: Prisma.XOR<Prisma.palletsUpdateWithoutWarehousesInput, Prisma.palletsUncheckedUpdateWithoutWarehousesInput>;
};
export type palletsUpdateManyWithWhereWithoutWarehousesInput = {
    where: Prisma.palletsScalarWhereInput;
    data: Prisma.XOR<Prisma.palletsUpdateManyMutationInput, Prisma.palletsUncheckedUpdateManyWithoutWarehousesInput>;
};
export type palletsCreateManyUsersInput = {
    id?: string;
    code: string;
    warehouse_id?: string | null;
    status: string;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
};
export type palletsUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUpdateManyWithoutPalletsNestedInput;
    pallet_items?: Prisma.pallet_itemsUpdateManyWithoutPalletsNestedInput;
    warehouses?: Prisma.warehousesUpdateOneWithoutPalletsNestedInput;
    picking_results?: Prisma.picking_resultsUpdateManyWithoutPalletsNestedInput;
    picking_sources?: Prisma.picking_sourcesUpdateManyWithoutPalletsNestedInput;
    trip_cargo?: Prisma.trip_cargoUpdateManyWithoutPalletsNestedInput;
};
export type palletsUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUncheckedUpdateManyWithoutPalletsNestedInput;
    pallet_items?: Prisma.pallet_itemsUncheckedUpdateManyWithoutPalletsNestedInput;
    picking_results?: Prisma.picking_resultsUncheckedUpdateManyWithoutPalletsNestedInput;
    picking_sources?: Prisma.picking_sourcesUncheckedUpdateManyWithoutPalletsNestedInput;
    trip_cargo?: Prisma.trip_cargoUncheckedUpdateManyWithoutPalletsNestedInput;
};
export type palletsUncheckedUpdateManyWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type palletsCreateManyWarehousesInput = {
    id?: string;
    code: string;
    status: string;
    created_by?: string | null;
    deleted_at?: Date | string | null;
    created_at?: Date | string;
};
export type palletsUpdateWithoutWarehousesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUpdateManyWithoutPalletsNestedInput;
    pallet_items?: Prisma.pallet_itemsUpdateManyWithoutPalletsNestedInput;
    users?: Prisma.usersUpdateOneWithoutPalletsNestedInput;
    picking_results?: Prisma.picking_resultsUpdateManyWithoutPalletsNestedInput;
    picking_sources?: Prisma.picking_sourcesUpdateManyWithoutPalletsNestedInput;
    trip_cargo?: Prisma.trip_cargoUpdateManyWithoutPalletsNestedInput;
};
export type palletsUncheckedUpdateWithoutWarehousesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cargo_transfer_items?: Prisma.cargo_transfer_itemsUncheckedUpdateManyWithoutPalletsNestedInput;
    pallet_items?: Prisma.pallet_itemsUncheckedUpdateManyWithoutPalletsNestedInput;
    picking_results?: Prisma.picking_resultsUncheckedUpdateManyWithoutPalletsNestedInput;
    picking_sources?: Prisma.picking_sourcesUncheckedUpdateManyWithoutPalletsNestedInput;
    trip_cargo?: Prisma.trip_cargoUncheckedUpdateManyWithoutPalletsNestedInput;
};
export type palletsUncheckedUpdateManyWithoutWarehousesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PalletsCountOutputType = {
    cargo_transfer_items: number;
    pallet_items: number;
    picking_results: number;
    picking_sources: number;
    trip_cargo: number;
};
export type PalletsCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    cargo_transfer_items?: boolean | PalletsCountOutputTypeCountCargo_transfer_itemsArgs;
    pallet_items?: boolean | PalletsCountOutputTypeCountPallet_itemsArgs;
    picking_results?: boolean | PalletsCountOutputTypeCountPicking_resultsArgs;
    picking_sources?: boolean | PalletsCountOutputTypeCountPicking_sourcesArgs;
    trip_cargo?: boolean | PalletsCountOutputTypeCountTrip_cargoArgs;
};
export type PalletsCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PalletsCountOutputTypeSelect<ExtArgs> | null;
};
export type PalletsCountOutputTypeCountCargo_transfer_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.cargo_transfer_itemsWhereInput;
};
export type PalletsCountOutputTypeCountPallet_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.pallet_itemsWhereInput;
};
export type PalletsCountOutputTypeCountPicking_resultsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.picking_resultsWhereInput;
};
export type PalletsCountOutputTypeCountPicking_sourcesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.picking_sourcesWhereInput;
};
export type PalletsCountOutputTypeCountTrip_cargoArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.trip_cargoWhereInput;
};
export type palletsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    warehouse_id?: boolean;
    status?: boolean;
    created_by?: boolean;
    deleted_at?: boolean;
    created_at?: boolean;
    cargo_transfer_items?: boolean | Prisma.pallets$cargo_transfer_itemsArgs<ExtArgs>;
    pallet_items?: boolean | Prisma.pallets$pallet_itemsArgs<ExtArgs>;
    users?: boolean | Prisma.pallets$usersArgs<ExtArgs>;
    warehouses?: boolean | Prisma.pallets$warehousesArgs<ExtArgs>;
    picking_results?: boolean | Prisma.pallets$picking_resultsArgs<ExtArgs>;
    picking_sources?: boolean | Prisma.pallets$picking_sourcesArgs<ExtArgs>;
    trip_cargo?: boolean | Prisma.pallets$trip_cargoArgs<ExtArgs>;
    _count?: boolean | Prisma.PalletsCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["pallets"]>;
export type palletsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    warehouse_id?: boolean;
    status?: boolean;
    created_by?: boolean;
    deleted_at?: boolean;
    created_at?: boolean;
    users?: boolean | Prisma.pallets$usersArgs<ExtArgs>;
    warehouses?: boolean | Prisma.pallets$warehousesArgs<ExtArgs>;
}, ExtArgs["result"]["pallets"]>;
export type palletsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    warehouse_id?: boolean;
    status?: boolean;
    created_by?: boolean;
    deleted_at?: boolean;
    created_at?: boolean;
    users?: boolean | Prisma.pallets$usersArgs<ExtArgs>;
    warehouses?: boolean | Prisma.pallets$warehousesArgs<ExtArgs>;
}, ExtArgs["result"]["pallets"]>;
export type palletsSelectScalar = {
    id?: boolean;
    code?: boolean;
    warehouse_id?: boolean;
    status?: boolean;
    created_by?: boolean;
    deleted_at?: boolean;
    created_at?: boolean;
};
export type palletsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "code" | "warehouse_id" | "status" | "created_by" | "deleted_at" | "created_at", ExtArgs["result"]["pallets"]>;
export type palletsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    cargo_transfer_items?: boolean | Prisma.pallets$cargo_transfer_itemsArgs<ExtArgs>;
    pallet_items?: boolean | Prisma.pallets$pallet_itemsArgs<ExtArgs>;
    users?: boolean | Prisma.pallets$usersArgs<ExtArgs>;
    warehouses?: boolean | Prisma.pallets$warehousesArgs<ExtArgs>;
    picking_results?: boolean | Prisma.pallets$picking_resultsArgs<ExtArgs>;
    picking_sources?: boolean | Prisma.pallets$picking_sourcesArgs<ExtArgs>;
    trip_cargo?: boolean | Prisma.pallets$trip_cargoArgs<ExtArgs>;
    _count?: boolean | Prisma.PalletsCountOutputTypeDefaultArgs<ExtArgs>;
};
export type palletsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.pallets$usersArgs<ExtArgs>;
    warehouses?: boolean | Prisma.pallets$warehousesArgs<ExtArgs>;
};
export type palletsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.pallets$usersArgs<ExtArgs>;
    warehouses?: boolean | Prisma.pallets$warehousesArgs<ExtArgs>;
};
export type $palletsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "pallets";
    objects: {
        cargo_transfer_items: Prisma.$cargo_transfer_itemsPayload<ExtArgs>[];
        pallet_items: Prisma.$pallet_itemsPayload<ExtArgs>[];
        users: Prisma.$usersPayload<ExtArgs> | null;
        warehouses: Prisma.$warehousesPayload<ExtArgs> | null;
        picking_results: Prisma.$picking_resultsPayload<ExtArgs>[];
        picking_sources: Prisma.$picking_sourcesPayload<ExtArgs>[];
        trip_cargo: Prisma.$trip_cargoPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        code: string;
        warehouse_id: string | null;
        status: string;
        created_by: string | null;
        deleted_at: Date | null;
        created_at: Date;
    }, ExtArgs["result"]["pallets"]>;
    composites: {};
};
export type palletsGetPayload<S extends boolean | null | undefined | palletsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$palletsPayload, S>;
export type palletsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<palletsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PalletsCountAggregateInputType | true;
};
export interface palletsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['pallets'];
        meta: {
            name: 'pallets';
        };
    };
    findUnique<T extends palletsFindUniqueArgs>(args: Prisma.SelectSubset<T, palletsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__palletsClient<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends palletsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, palletsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__palletsClient<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends palletsFindFirstArgs>(args?: Prisma.SelectSubset<T, palletsFindFirstArgs<ExtArgs>>): Prisma.Prisma__palletsClient<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends palletsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, palletsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__palletsClient<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends palletsFindManyArgs>(args?: Prisma.SelectSubset<T, palletsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends palletsCreateArgs>(args: Prisma.SelectSubset<T, palletsCreateArgs<ExtArgs>>): Prisma.Prisma__palletsClient<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends palletsCreateManyArgs>(args?: Prisma.SelectSubset<T, palletsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends palletsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, palletsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends palletsDeleteArgs>(args: Prisma.SelectSubset<T, palletsDeleteArgs<ExtArgs>>): Prisma.Prisma__palletsClient<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends palletsUpdateArgs>(args: Prisma.SelectSubset<T, palletsUpdateArgs<ExtArgs>>): Prisma.Prisma__palletsClient<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends palletsDeleteManyArgs>(args?: Prisma.SelectSubset<T, palletsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends palletsUpdateManyArgs>(args: Prisma.SelectSubset<T, palletsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends palletsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, palletsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends palletsUpsertArgs>(args: Prisma.SelectSubset<T, palletsUpsertArgs<ExtArgs>>): Prisma.Prisma__palletsClient<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends palletsCountArgs>(args?: Prisma.Subset<T, palletsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PalletsCountAggregateOutputType> : number>;
    aggregate<T extends PalletsAggregateArgs>(args: Prisma.Subset<T, PalletsAggregateArgs>): Prisma.PrismaPromise<GetPalletsAggregateType<T>>;
    groupBy<T extends palletsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: palletsGroupByArgs['orderBy'];
    } : {
        orderBy?: palletsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, palletsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPalletsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: palletsFieldRefs;
}
export interface Prisma__palletsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    cargo_transfer_items<T extends Prisma.pallets$cargo_transfer_itemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.pallets$cargo_transfer_itemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$cargo_transfer_itemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    pallet_items<T extends Prisma.pallets$pallet_itemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.pallets$pallet_itemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$pallet_itemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    users<T extends Prisma.pallets$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.pallets$usersArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    warehouses<T extends Prisma.pallets$warehousesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.pallets$warehousesArgs<ExtArgs>>): Prisma.Prisma__warehousesClient<runtime.Types.Result.GetResult<Prisma.$warehousesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    picking_results<T extends Prisma.pallets$picking_resultsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.pallets$picking_resultsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$picking_resultsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    picking_sources<T extends Prisma.pallets$picking_sourcesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.pallets$picking_sourcesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$picking_sourcesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    trip_cargo<T extends Prisma.pallets$trip_cargoArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.pallets$trip_cargoArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$trip_cargoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface palletsFieldRefs {
    readonly id: Prisma.FieldRef<"pallets", 'String'>;
    readonly code: Prisma.FieldRef<"pallets", 'String'>;
    readonly warehouse_id: Prisma.FieldRef<"pallets", 'String'>;
    readonly status: Prisma.FieldRef<"pallets", 'String'>;
    readonly created_by: Prisma.FieldRef<"pallets", 'String'>;
    readonly deleted_at: Prisma.FieldRef<"pallets", 'DateTime'>;
    readonly created_at: Prisma.FieldRef<"pallets", 'DateTime'>;
}
export type palletsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.palletsSelect<ExtArgs> | null;
    omit?: Prisma.palletsOmit<ExtArgs> | null;
    include?: Prisma.palletsInclude<ExtArgs> | null;
    where: Prisma.palletsWhereUniqueInput;
};
export type palletsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.palletsSelect<ExtArgs> | null;
    omit?: Prisma.palletsOmit<ExtArgs> | null;
    include?: Prisma.palletsInclude<ExtArgs> | null;
    where: Prisma.palletsWhereUniqueInput;
};
export type palletsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type palletsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type palletsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type palletsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.palletsSelect<ExtArgs> | null;
    omit?: Prisma.palletsOmit<ExtArgs> | null;
    include?: Prisma.palletsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.palletsCreateInput, Prisma.palletsUncheckedCreateInput>;
};
export type palletsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.palletsCreateManyInput | Prisma.palletsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type palletsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.palletsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.palletsOmit<ExtArgs> | null;
    data: Prisma.palletsCreateManyInput | Prisma.palletsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.palletsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type palletsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.palletsSelect<ExtArgs> | null;
    omit?: Prisma.palletsOmit<ExtArgs> | null;
    include?: Prisma.palletsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.palletsUpdateInput, Prisma.palletsUncheckedUpdateInput>;
    where: Prisma.palletsWhereUniqueInput;
};
export type palletsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.palletsUpdateManyMutationInput, Prisma.palletsUncheckedUpdateManyInput>;
    where?: Prisma.palletsWhereInput;
    limit?: number;
};
export type palletsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.palletsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.palletsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.palletsUpdateManyMutationInput, Prisma.palletsUncheckedUpdateManyInput>;
    where?: Prisma.palletsWhereInput;
    limit?: number;
    include?: Prisma.palletsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type palletsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.palletsSelect<ExtArgs> | null;
    omit?: Prisma.palletsOmit<ExtArgs> | null;
    include?: Prisma.palletsInclude<ExtArgs> | null;
    where: Prisma.palletsWhereUniqueInput;
    create: Prisma.XOR<Prisma.palletsCreateInput, Prisma.palletsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.palletsUpdateInput, Prisma.palletsUncheckedUpdateInput>;
};
export type palletsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.palletsSelect<ExtArgs> | null;
    omit?: Prisma.palletsOmit<ExtArgs> | null;
    include?: Prisma.palletsInclude<ExtArgs> | null;
    where: Prisma.palletsWhereUniqueInput;
};
export type palletsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.palletsWhereInput;
    limit?: number;
};
export type pallets$cargo_transfer_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.cargo_transfer_itemsSelect<ExtArgs> | null;
    omit?: Prisma.cargo_transfer_itemsOmit<ExtArgs> | null;
    include?: Prisma.cargo_transfer_itemsInclude<ExtArgs> | null;
    where?: Prisma.cargo_transfer_itemsWhereInput;
    orderBy?: Prisma.cargo_transfer_itemsOrderByWithRelationInput | Prisma.cargo_transfer_itemsOrderByWithRelationInput[];
    cursor?: Prisma.cargo_transfer_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Cargo_transfer_itemsScalarFieldEnum | Prisma.Cargo_transfer_itemsScalarFieldEnum[];
};
export type pallets$pallet_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.pallet_itemsSelect<ExtArgs> | null;
    omit?: Prisma.pallet_itemsOmit<ExtArgs> | null;
    include?: Prisma.pallet_itemsInclude<ExtArgs> | null;
    where?: Prisma.pallet_itemsWhereInput;
    orderBy?: Prisma.pallet_itemsOrderByWithRelationInput | Prisma.pallet_itemsOrderByWithRelationInput[];
    cursor?: Prisma.pallet_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Pallet_itemsScalarFieldEnum | Prisma.Pallet_itemsScalarFieldEnum[];
};
export type pallets$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
    where?: Prisma.usersWhereInput;
};
export type pallets$warehousesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehousesSelect<ExtArgs> | null;
    omit?: Prisma.warehousesOmit<ExtArgs> | null;
    include?: Prisma.warehousesInclude<ExtArgs> | null;
    where?: Prisma.warehousesWhereInput;
};
export type pallets$picking_resultsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_resultsSelect<ExtArgs> | null;
    omit?: Prisma.picking_resultsOmit<ExtArgs> | null;
    include?: Prisma.picking_resultsInclude<ExtArgs> | null;
    where?: Prisma.picking_resultsWhereInput;
    orderBy?: Prisma.picking_resultsOrderByWithRelationInput | Prisma.picking_resultsOrderByWithRelationInput[];
    cursor?: Prisma.picking_resultsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Picking_resultsScalarFieldEnum | Prisma.Picking_resultsScalarFieldEnum[];
};
export type pallets$picking_sourcesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_sourcesSelect<ExtArgs> | null;
    omit?: Prisma.picking_sourcesOmit<ExtArgs> | null;
    include?: Prisma.picking_sourcesInclude<ExtArgs> | null;
    where?: Prisma.picking_sourcesWhereInput;
    orderBy?: Prisma.picking_sourcesOrderByWithRelationInput | Prisma.picking_sourcesOrderByWithRelationInput[];
    cursor?: Prisma.picking_sourcesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Picking_sourcesScalarFieldEnum | Prisma.Picking_sourcesScalarFieldEnum[];
};
export type pallets$trip_cargoArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_cargoSelect<ExtArgs> | null;
    omit?: Prisma.trip_cargoOmit<ExtArgs> | null;
    include?: Prisma.trip_cargoInclude<ExtArgs> | null;
    where?: Prisma.trip_cargoWhereInput;
    orderBy?: Prisma.trip_cargoOrderByWithRelationInput | Prisma.trip_cargoOrderByWithRelationInput[];
    cursor?: Prisma.trip_cargoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Trip_cargoScalarFieldEnum | Prisma.Trip_cargoScalarFieldEnum[];
};
export type palletsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.palletsSelect<ExtArgs> | null;
    omit?: Prisma.palletsOmit<ExtArgs> | null;
    include?: Prisma.palletsInclude<ExtArgs> | null;
};
