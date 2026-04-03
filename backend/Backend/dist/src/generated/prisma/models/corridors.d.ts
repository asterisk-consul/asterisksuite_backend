import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type corridorsModel = runtime.Types.Result.DefaultSelection<Prisma.$corridorsPayload>;
export type AggregateCorridors = {
    _count: CorridorsCountAggregateOutputType | null;
    _avg: CorridorsAvgAggregateOutputType | null;
    _sum: CorridorsSumAggregateOutputType | null;
    _min: CorridorsMinAggregateOutputType | null;
    _max: CorridorsMaxAggregateOutputType | null;
};
export type CorridorsAvgAggregateOutputType = {
    total_distance_km: runtime.Decimal | null;
    estimated_minutes: number | null;
};
export type CorridorsSumAggregateOutputType = {
    total_distance_km: runtime.Decimal | null;
    estimated_minutes: number | null;
};
export type CorridorsMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    origin_location_id: string | null;
    destination_location_id: string | null;
    is_template: boolean | null;
    total_distance_km: runtime.Decimal | null;
    estimated_minutes: number | null;
    active: boolean | null;
    created_at: Date | null;
};
export type CorridorsMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    origin_location_id: string | null;
    destination_location_id: string | null;
    is_template: boolean | null;
    total_distance_km: runtime.Decimal | null;
    estimated_minutes: number | null;
    active: boolean | null;
    created_at: Date | null;
};
export type CorridorsCountAggregateOutputType = {
    id: number;
    name: number;
    description: number;
    origin_location_id: number;
    destination_location_id: number;
    is_template: number;
    total_distance_km: number;
    estimated_minutes: number;
    active: number;
    created_at: number;
    _all: number;
};
export type CorridorsAvgAggregateInputType = {
    total_distance_km?: true;
    estimated_minutes?: true;
};
export type CorridorsSumAggregateInputType = {
    total_distance_km?: true;
    estimated_minutes?: true;
};
export type CorridorsMinAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    origin_location_id?: true;
    destination_location_id?: true;
    is_template?: true;
    total_distance_km?: true;
    estimated_minutes?: true;
    active?: true;
    created_at?: true;
};
export type CorridorsMaxAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    origin_location_id?: true;
    destination_location_id?: true;
    is_template?: true;
    total_distance_km?: true;
    estimated_minutes?: true;
    active?: true;
    created_at?: true;
};
export type CorridorsCountAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    origin_location_id?: true;
    destination_location_id?: true;
    is_template?: true;
    total_distance_km?: true;
    estimated_minutes?: true;
    active?: true;
    created_at?: true;
    _all?: true;
};
export type CorridorsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.corridorsWhereInput;
    orderBy?: Prisma.corridorsOrderByWithRelationInput | Prisma.corridorsOrderByWithRelationInput[];
    cursor?: Prisma.corridorsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CorridorsCountAggregateInputType;
    _avg?: CorridorsAvgAggregateInputType;
    _sum?: CorridorsSumAggregateInputType;
    _min?: CorridorsMinAggregateInputType;
    _max?: CorridorsMaxAggregateInputType;
};
export type GetCorridorsAggregateType<T extends CorridorsAggregateArgs> = {
    [P in keyof T & keyof AggregateCorridors]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCorridors[P]> : Prisma.GetScalarType<T[P], AggregateCorridors[P]>;
};
export type corridorsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.corridorsWhereInput;
    orderBy?: Prisma.corridorsOrderByWithAggregationInput | Prisma.corridorsOrderByWithAggregationInput[];
    by: Prisma.CorridorsScalarFieldEnum[] | Prisma.CorridorsScalarFieldEnum;
    having?: Prisma.corridorsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CorridorsCountAggregateInputType | true;
    _avg?: CorridorsAvgAggregateInputType;
    _sum?: CorridorsSumAggregateInputType;
    _min?: CorridorsMinAggregateInputType;
    _max?: CorridorsMaxAggregateInputType;
};
export type CorridorsGroupByOutputType = {
    id: string;
    name: string | null;
    description: string | null;
    origin_location_id: string;
    destination_location_id: string;
    is_template: boolean;
    total_distance_km: runtime.Decimal | null;
    estimated_minutes: number | null;
    active: boolean;
    created_at: Date;
    _count: CorridorsCountAggregateOutputType | null;
    _avg: CorridorsAvgAggregateOutputType | null;
    _sum: CorridorsSumAggregateOutputType | null;
    _min: CorridorsMinAggregateOutputType | null;
    _max: CorridorsMaxAggregateOutputType | null;
};
export type GetCorridorsGroupByPayload<T extends corridorsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CorridorsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CorridorsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CorridorsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CorridorsGroupByOutputType[P]>;
}>>;
export type corridorsWhereInput = {
    AND?: Prisma.corridorsWhereInput | Prisma.corridorsWhereInput[];
    OR?: Prisma.corridorsWhereInput[];
    NOT?: Prisma.corridorsWhereInput | Prisma.corridorsWhereInput[];
    id?: Prisma.UuidFilter<"corridors"> | string;
    name?: Prisma.StringNullableFilter<"corridors"> | string | null;
    description?: Prisma.StringNullableFilter<"corridors"> | string | null;
    origin_location_id?: Prisma.UuidFilter<"corridors"> | string;
    destination_location_id?: Prisma.UuidFilter<"corridors"> | string;
    is_template?: Prisma.BoolFilter<"corridors"> | boolean;
    total_distance_km?: Prisma.DecimalNullableFilter<"corridors"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.IntNullableFilter<"corridors"> | number | null;
    active?: Prisma.BoolFilter<"corridors"> | boolean;
    created_at?: Prisma.DateTimeFilter<"corridors"> | Date | string;
    origin_location?: Prisma.XOR<Prisma.LocationsScalarRelationFilter, Prisma.locationsWhereInput>;
    destination_location?: Prisma.XOR<Prisma.LocationsScalarRelationFilter, Prisma.locationsWhereInput>;
    corridorStops?: Prisma.Corridor_stopsListRelationFilter;
    dispatchOrders?: Prisma.Dispatch_ordersListRelationFilter;
};
export type corridorsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    origin_location_id?: Prisma.SortOrder;
    destination_location_id?: Prisma.SortOrder;
    is_template?: Prisma.SortOrder;
    total_distance_km?: Prisma.SortOrderInput | Prisma.SortOrder;
    estimated_minutes?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    origin_location?: Prisma.locationsOrderByWithRelationInput;
    destination_location?: Prisma.locationsOrderByWithRelationInput;
    corridorStops?: Prisma.corridor_stopsOrderByRelationAggregateInput;
    dispatchOrders?: Prisma.dispatch_ordersOrderByRelationAggregateInput;
};
export type corridorsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.corridorsWhereInput | Prisma.corridorsWhereInput[];
    OR?: Prisma.corridorsWhereInput[];
    NOT?: Prisma.corridorsWhereInput | Prisma.corridorsWhereInput[];
    name?: Prisma.StringNullableFilter<"corridors"> | string | null;
    description?: Prisma.StringNullableFilter<"corridors"> | string | null;
    origin_location_id?: Prisma.UuidFilter<"corridors"> | string;
    destination_location_id?: Prisma.UuidFilter<"corridors"> | string;
    is_template?: Prisma.BoolFilter<"corridors"> | boolean;
    total_distance_km?: Prisma.DecimalNullableFilter<"corridors"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.IntNullableFilter<"corridors"> | number | null;
    active?: Prisma.BoolFilter<"corridors"> | boolean;
    created_at?: Prisma.DateTimeFilter<"corridors"> | Date | string;
    origin_location?: Prisma.XOR<Prisma.LocationsScalarRelationFilter, Prisma.locationsWhereInput>;
    destination_location?: Prisma.XOR<Prisma.LocationsScalarRelationFilter, Prisma.locationsWhereInput>;
    corridorStops?: Prisma.Corridor_stopsListRelationFilter;
    dispatchOrders?: Prisma.Dispatch_ordersListRelationFilter;
}, "id">;
export type corridorsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    origin_location_id?: Prisma.SortOrder;
    destination_location_id?: Prisma.SortOrder;
    is_template?: Prisma.SortOrder;
    total_distance_km?: Prisma.SortOrderInput | Prisma.SortOrder;
    estimated_minutes?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.corridorsCountOrderByAggregateInput;
    _avg?: Prisma.corridorsAvgOrderByAggregateInput;
    _max?: Prisma.corridorsMaxOrderByAggregateInput;
    _min?: Prisma.corridorsMinOrderByAggregateInput;
    _sum?: Prisma.corridorsSumOrderByAggregateInput;
};
export type corridorsScalarWhereWithAggregatesInput = {
    AND?: Prisma.corridorsScalarWhereWithAggregatesInput | Prisma.corridorsScalarWhereWithAggregatesInput[];
    OR?: Prisma.corridorsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.corridorsScalarWhereWithAggregatesInput | Prisma.corridorsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"corridors"> | string;
    name?: Prisma.StringNullableWithAggregatesFilter<"corridors"> | string | null;
    description?: Prisma.StringNullableWithAggregatesFilter<"corridors"> | string | null;
    origin_location_id?: Prisma.UuidWithAggregatesFilter<"corridors"> | string;
    destination_location_id?: Prisma.UuidWithAggregatesFilter<"corridors"> | string;
    is_template?: Prisma.BoolWithAggregatesFilter<"corridors"> | boolean;
    total_distance_km?: Prisma.DecimalNullableWithAggregatesFilter<"corridors"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.IntNullableWithAggregatesFilter<"corridors"> | number | null;
    active?: Prisma.BoolWithAggregatesFilter<"corridors"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"corridors"> | Date | string;
};
export type corridorsCreateInput = {
    id?: string;
    name?: string | null;
    description?: string | null;
    is_template?: boolean;
    total_distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    active?: boolean;
    created_at?: Date | string;
    origin_location: Prisma.locationsCreateNestedOneWithoutCorridor_originInput;
    destination_location: Prisma.locationsCreateNestedOneWithoutCorridor_destinationInput;
    corridorStops?: Prisma.corridor_stopsCreateNestedManyWithoutCorridorInput;
    dispatchOrders?: Prisma.dispatch_ordersCreateNestedManyWithoutCorridorsInput;
};
export type corridorsUncheckedCreateInput = {
    id?: string;
    name?: string | null;
    description?: string | null;
    origin_location_id: string;
    destination_location_id: string;
    is_template?: boolean;
    total_distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    active?: boolean;
    created_at?: Date | string;
    corridorStops?: Prisma.corridor_stopsUncheckedCreateNestedManyWithoutCorridorInput;
    dispatchOrders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutCorridorsInput;
};
export type corridorsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_template?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    origin_location?: Prisma.locationsUpdateOneRequiredWithoutCorridor_originNestedInput;
    destination_location?: Prisma.locationsUpdateOneRequiredWithoutCorridor_destinationNestedInput;
    corridorStops?: Prisma.corridor_stopsUpdateManyWithoutCorridorNestedInput;
    dispatchOrders?: Prisma.dispatch_ordersUpdateManyWithoutCorridorsNestedInput;
};
export type corridorsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    origin_location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    destination_location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_template?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    corridorStops?: Prisma.corridor_stopsUncheckedUpdateManyWithoutCorridorNestedInput;
    dispatchOrders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutCorridorsNestedInput;
};
export type corridorsCreateManyInput = {
    id?: string;
    name?: string | null;
    description?: string | null;
    origin_location_id: string;
    destination_location_id: string;
    is_template?: boolean;
    total_distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    active?: boolean;
    created_at?: Date | string;
};
export type corridorsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_template?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type corridorsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    origin_location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    destination_location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_template?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CorridorsListRelationFilter = {
    every?: Prisma.corridorsWhereInput;
    some?: Prisma.corridorsWhereInput;
    none?: Prisma.corridorsWhereInput;
};
export type corridorsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CorridorsNullableScalarRelationFilter = {
    is?: Prisma.corridorsWhereInput | null;
    isNot?: Prisma.corridorsWhereInput | null;
};
export type corridorsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    origin_location_id?: Prisma.SortOrder;
    destination_location_id?: Prisma.SortOrder;
    is_template?: Prisma.SortOrder;
    total_distance_km?: Prisma.SortOrder;
    estimated_minutes?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type corridorsAvgOrderByAggregateInput = {
    total_distance_km?: Prisma.SortOrder;
    estimated_minutes?: Prisma.SortOrder;
};
export type corridorsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    origin_location_id?: Prisma.SortOrder;
    destination_location_id?: Prisma.SortOrder;
    is_template?: Prisma.SortOrder;
    total_distance_km?: Prisma.SortOrder;
    estimated_minutes?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type corridorsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    origin_location_id?: Prisma.SortOrder;
    destination_location_id?: Prisma.SortOrder;
    is_template?: Prisma.SortOrder;
    total_distance_km?: Prisma.SortOrder;
    estimated_minutes?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type corridorsSumOrderByAggregateInput = {
    total_distance_km?: Prisma.SortOrder;
    estimated_minutes?: Prisma.SortOrder;
};
export type CorridorsScalarRelationFilter = {
    is?: Prisma.corridorsWhereInput;
    isNot?: Prisma.corridorsWhereInput;
};
export type corridorsCreateNestedManyWithoutOrigin_locationInput = {
    create?: Prisma.XOR<Prisma.corridorsCreateWithoutOrigin_locationInput, Prisma.corridorsUncheckedCreateWithoutOrigin_locationInput> | Prisma.corridorsCreateWithoutOrigin_locationInput[] | Prisma.corridorsUncheckedCreateWithoutOrigin_locationInput[];
    connectOrCreate?: Prisma.corridorsCreateOrConnectWithoutOrigin_locationInput | Prisma.corridorsCreateOrConnectWithoutOrigin_locationInput[];
    createMany?: Prisma.corridorsCreateManyOrigin_locationInputEnvelope;
    connect?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
};
export type corridorsCreateNestedManyWithoutDestination_locationInput = {
    create?: Prisma.XOR<Prisma.corridorsCreateWithoutDestination_locationInput, Prisma.corridorsUncheckedCreateWithoutDestination_locationInput> | Prisma.corridorsCreateWithoutDestination_locationInput[] | Prisma.corridorsUncheckedCreateWithoutDestination_locationInput[];
    connectOrCreate?: Prisma.corridorsCreateOrConnectWithoutDestination_locationInput | Prisma.corridorsCreateOrConnectWithoutDestination_locationInput[];
    createMany?: Prisma.corridorsCreateManyDestination_locationInputEnvelope;
    connect?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
};
export type corridorsUncheckedCreateNestedManyWithoutOrigin_locationInput = {
    create?: Prisma.XOR<Prisma.corridorsCreateWithoutOrigin_locationInput, Prisma.corridorsUncheckedCreateWithoutOrigin_locationInput> | Prisma.corridorsCreateWithoutOrigin_locationInput[] | Prisma.corridorsUncheckedCreateWithoutOrigin_locationInput[];
    connectOrCreate?: Prisma.corridorsCreateOrConnectWithoutOrigin_locationInput | Prisma.corridorsCreateOrConnectWithoutOrigin_locationInput[];
    createMany?: Prisma.corridorsCreateManyOrigin_locationInputEnvelope;
    connect?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
};
export type corridorsUncheckedCreateNestedManyWithoutDestination_locationInput = {
    create?: Prisma.XOR<Prisma.corridorsCreateWithoutDestination_locationInput, Prisma.corridorsUncheckedCreateWithoutDestination_locationInput> | Prisma.corridorsCreateWithoutDestination_locationInput[] | Prisma.corridorsUncheckedCreateWithoutDestination_locationInput[];
    connectOrCreate?: Prisma.corridorsCreateOrConnectWithoutDestination_locationInput | Prisma.corridorsCreateOrConnectWithoutDestination_locationInput[];
    createMany?: Prisma.corridorsCreateManyDestination_locationInputEnvelope;
    connect?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
};
export type corridorsUpdateManyWithoutOrigin_locationNestedInput = {
    create?: Prisma.XOR<Prisma.corridorsCreateWithoutOrigin_locationInput, Prisma.corridorsUncheckedCreateWithoutOrigin_locationInput> | Prisma.corridorsCreateWithoutOrigin_locationInput[] | Prisma.corridorsUncheckedCreateWithoutOrigin_locationInput[];
    connectOrCreate?: Prisma.corridorsCreateOrConnectWithoutOrigin_locationInput | Prisma.corridorsCreateOrConnectWithoutOrigin_locationInput[];
    upsert?: Prisma.corridorsUpsertWithWhereUniqueWithoutOrigin_locationInput | Prisma.corridorsUpsertWithWhereUniqueWithoutOrigin_locationInput[];
    createMany?: Prisma.corridorsCreateManyOrigin_locationInputEnvelope;
    set?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    disconnect?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    delete?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    connect?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    update?: Prisma.corridorsUpdateWithWhereUniqueWithoutOrigin_locationInput | Prisma.corridorsUpdateWithWhereUniqueWithoutOrigin_locationInput[];
    updateMany?: Prisma.corridorsUpdateManyWithWhereWithoutOrigin_locationInput | Prisma.corridorsUpdateManyWithWhereWithoutOrigin_locationInput[];
    deleteMany?: Prisma.corridorsScalarWhereInput | Prisma.corridorsScalarWhereInput[];
};
export type corridorsUpdateManyWithoutDestination_locationNestedInput = {
    create?: Prisma.XOR<Prisma.corridorsCreateWithoutDestination_locationInput, Prisma.corridorsUncheckedCreateWithoutDestination_locationInput> | Prisma.corridorsCreateWithoutDestination_locationInput[] | Prisma.corridorsUncheckedCreateWithoutDestination_locationInput[];
    connectOrCreate?: Prisma.corridorsCreateOrConnectWithoutDestination_locationInput | Prisma.corridorsCreateOrConnectWithoutDestination_locationInput[];
    upsert?: Prisma.corridorsUpsertWithWhereUniqueWithoutDestination_locationInput | Prisma.corridorsUpsertWithWhereUniqueWithoutDestination_locationInput[];
    createMany?: Prisma.corridorsCreateManyDestination_locationInputEnvelope;
    set?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    disconnect?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    delete?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    connect?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    update?: Prisma.corridorsUpdateWithWhereUniqueWithoutDestination_locationInput | Prisma.corridorsUpdateWithWhereUniqueWithoutDestination_locationInput[];
    updateMany?: Prisma.corridorsUpdateManyWithWhereWithoutDestination_locationInput | Prisma.corridorsUpdateManyWithWhereWithoutDestination_locationInput[];
    deleteMany?: Prisma.corridorsScalarWhereInput | Prisma.corridorsScalarWhereInput[];
};
export type corridorsUncheckedUpdateManyWithoutOrigin_locationNestedInput = {
    create?: Prisma.XOR<Prisma.corridorsCreateWithoutOrigin_locationInput, Prisma.corridorsUncheckedCreateWithoutOrigin_locationInput> | Prisma.corridorsCreateWithoutOrigin_locationInput[] | Prisma.corridorsUncheckedCreateWithoutOrigin_locationInput[];
    connectOrCreate?: Prisma.corridorsCreateOrConnectWithoutOrigin_locationInput | Prisma.corridorsCreateOrConnectWithoutOrigin_locationInput[];
    upsert?: Prisma.corridorsUpsertWithWhereUniqueWithoutOrigin_locationInput | Prisma.corridorsUpsertWithWhereUniqueWithoutOrigin_locationInput[];
    createMany?: Prisma.corridorsCreateManyOrigin_locationInputEnvelope;
    set?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    disconnect?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    delete?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    connect?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    update?: Prisma.corridorsUpdateWithWhereUniqueWithoutOrigin_locationInput | Prisma.corridorsUpdateWithWhereUniqueWithoutOrigin_locationInput[];
    updateMany?: Prisma.corridorsUpdateManyWithWhereWithoutOrigin_locationInput | Prisma.corridorsUpdateManyWithWhereWithoutOrigin_locationInput[];
    deleteMany?: Prisma.corridorsScalarWhereInput | Prisma.corridorsScalarWhereInput[];
};
export type corridorsUncheckedUpdateManyWithoutDestination_locationNestedInput = {
    create?: Prisma.XOR<Prisma.corridorsCreateWithoutDestination_locationInput, Prisma.corridorsUncheckedCreateWithoutDestination_locationInput> | Prisma.corridorsCreateWithoutDestination_locationInput[] | Prisma.corridorsUncheckedCreateWithoutDestination_locationInput[];
    connectOrCreate?: Prisma.corridorsCreateOrConnectWithoutDestination_locationInput | Prisma.corridorsCreateOrConnectWithoutDestination_locationInput[];
    upsert?: Prisma.corridorsUpsertWithWhereUniqueWithoutDestination_locationInput | Prisma.corridorsUpsertWithWhereUniqueWithoutDestination_locationInput[];
    createMany?: Prisma.corridorsCreateManyDestination_locationInputEnvelope;
    set?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    disconnect?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    delete?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    connect?: Prisma.corridorsWhereUniqueInput | Prisma.corridorsWhereUniqueInput[];
    update?: Prisma.corridorsUpdateWithWhereUniqueWithoutDestination_locationInput | Prisma.corridorsUpdateWithWhereUniqueWithoutDestination_locationInput[];
    updateMany?: Prisma.corridorsUpdateManyWithWhereWithoutDestination_locationInput | Prisma.corridorsUpdateManyWithWhereWithoutDestination_locationInput[];
    deleteMany?: Prisma.corridorsScalarWhereInput | Prisma.corridorsScalarWhereInput[];
};
export type corridorsCreateNestedOneWithoutDispatchOrdersInput = {
    create?: Prisma.XOR<Prisma.corridorsCreateWithoutDispatchOrdersInput, Prisma.corridorsUncheckedCreateWithoutDispatchOrdersInput>;
    connectOrCreate?: Prisma.corridorsCreateOrConnectWithoutDispatchOrdersInput;
    connect?: Prisma.corridorsWhereUniqueInput;
};
export type corridorsUpdateOneWithoutDispatchOrdersNestedInput = {
    create?: Prisma.XOR<Prisma.corridorsCreateWithoutDispatchOrdersInput, Prisma.corridorsUncheckedCreateWithoutDispatchOrdersInput>;
    connectOrCreate?: Prisma.corridorsCreateOrConnectWithoutDispatchOrdersInput;
    upsert?: Prisma.corridorsUpsertWithoutDispatchOrdersInput;
    disconnect?: Prisma.corridorsWhereInput | boolean;
    delete?: Prisma.corridorsWhereInput | boolean;
    connect?: Prisma.corridorsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.corridorsUpdateToOneWithWhereWithoutDispatchOrdersInput, Prisma.corridorsUpdateWithoutDispatchOrdersInput>, Prisma.corridorsUncheckedUpdateWithoutDispatchOrdersInput>;
};
export type corridorsCreateNestedOneWithoutCorridorStopsInput = {
    create?: Prisma.XOR<Prisma.corridorsCreateWithoutCorridorStopsInput, Prisma.corridorsUncheckedCreateWithoutCorridorStopsInput>;
    connectOrCreate?: Prisma.corridorsCreateOrConnectWithoutCorridorStopsInput;
    connect?: Prisma.corridorsWhereUniqueInput;
};
export type corridorsUpdateOneRequiredWithoutCorridorStopsNestedInput = {
    create?: Prisma.XOR<Prisma.corridorsCreateWithoutCorridorStopsInput, Prisma.corridorsUncheckedCreateWithoutCorridorStopsInput>;
    connectOrCreate?: Prisma.corridorsCreateOrConnectWithoutCorridorStopsInput;
    upsert?: Prisma.corridorsUpsertWithoutCorridorStopsInput;
    connect?: Prisma.corridorsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.corridorsUpdateToOneWithWhereWithoutCorridorStopsInput, Prisma.corridorsUpdateWithoutCorridorStopsInput>, Prisma.corridorsUncheckedUpdateWithoutCorridorStopsInput>;
};
export type corridorsCreateWithoutOrigin_locationInput = {
    id?: string;
    name?: string | null;
    description?: string | null;
    is_template?: boolean;
    total_distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    active?: boolean;
    created_at?: Date | string;
    destination_location: Prisma.locationsCreateNestedOneWithoutCorridor_destinationInput;
    corridorStops?: Prisma.corridor_stopsCreateNestedManyWithoutCorridorInput;
    dispatchOrders?: Prisma.dispatch_ordersCreateNestedManyWithoutCorridorsInput;
};
export type corridorsUncheckedCreateWithoutOrigin_locationInput = {
    id?: string;
    name?: string | null;
    description?: string | null;
    destination_location_id: string;
    is_template?: boolean;
    total_distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    active?: boolean;
    created_at?: Date | string;
    corridorStops?: Prisma.corridor_stopsUncheckedCreateNestedManyWithoutCorridorInput;
    dispatchOrders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutCorridorsInput;
};
export type corridorsCreateOrConnectWithoutOrigin_locationInput = {
    where: Prisma.corridorsWhereUniqueInput;
    create: Prisma.XOR<Prisma.corridorsCreateWithoutOrigin_locationInput, Prisma.corridorsUncheckedCreateWithoutOrigin_locationInput>;
};
export type corridorsCreateManyOrigin_locationInputEnvelope = {
    data: Prisma.corridorsCreateManyOrigin_locationInput | Prisma.corridorsCreateManyOrigin_locationInput[];
    skipDuplicates?: boolean;
};
export type corridorsCreateWithoutDestination_locationInput = {
    id?: string;
    name?: string | null;
    description?: string | null;
    is_template?: boolean;
    total_distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    active?: boolean;
    created_at?: Date | string;
    origin_location: Prisma.locationsCreateNestedOneWithoutCorridor_originInput;
    corridorStops?: Prisma.corridor_stopsCreateNestedManyWithoutCorridorInput;
    dispatchOrders?: Prisma.dispatch_ordersCreateNestedManyWithoutCorridorsInput;
};
export type corridorsUncheckedCreateWithoutDestination_locationInput = {
    id?: string;
    name?: string | null;
    description?: string | null;
    origin_location_id: string;
    is_template?: boolean;
    total_distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    active?: boolean;
    created_at?: Date | string;
    corridorStops?: Prisma.corridor_stopsUncheckedCreateNestedManyWithoutCorridorInput;
    dispatchOrders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutCorridorsInput;
};
export type corridorsCreateOrConnectWithoutDestination_locationInput = {
    where: Prisma.corridorsWhereUniqueInput;
    create: Prisma.XOR<Prisma.corridorsCreateWithoutDestination_locationInput, Prisma.corridorsUncheckedCreateWithoutDestination_locationInput>;
};
export type corridorsCreateManyDestination_locationInputEnvelope = {
    data: Prisma.corridorsCreateManyDestination_locationInput | Prisma.corridorsCreateManyDestination_locationInput[];
    skipDuplicates?: boolean;
};
export type corridorsUpsertWithWhereUniqueWithoutOrigin_locationInput = {
    where: Prisma.corridorsWhereUniqueInput;
    update: Prisma.XOR<Prisma.corridorsUpdateWithoutOrigin_locationInput, Prisma.corridorsUncheckedUpdateWithoutOrigin_locationInput>;
    create: Prisma.XOR<Prisma.corridorsCreateWithoutOrigin_locationInput, Prisma.corridorsUncheckedCreateWithoutOrigin_locationInput>;
};
export type corridorsUpdateWithWhereUniqueWithoutOrigin_locationInput = {
    where: Prisma.corridorsWhereUniqueInput;
    data: Prisma.XOR<Prisma.corridorsUpdateWithoutOrigin_locationInput, Prisma.corridorsUncheckedUpdateWithoutOrigin_locationInput>;
};
export type corridorsUpdateManyWithWhereWithoutOrigin_locationInput = {
    where: Prisma.corridorsScalarWhereInput;
    data: Prisma.XOR<Prisma.corridorsUpdateManyMutationInput, Prisma.corridorsUncheckedUpdateManyWithoutOrigin_locationInput>;
};
export type corridorsScalarWhereInput = {
    AND?: Prisma.corridorsScalarWhereInput | Prisma.corridorsScalarWhereInput[];
    OR?: Prisma.corridorsScalarWhereInput[];
    NOT?: Prisma.corridorsScalarWhereInput | Prisma.corridorsScalarWhereInput[];
    id?: Prisma.UuidFilter<"corridors"> | string;
    name?: Prisma.StringNullableFilter<"corridors"> | string | null;
    description?: Prisma.StringNullableFilter<"corridors"> | string | null;
    origin_location_id?: Prisma.UuidFilter<"corridors"> | string;
    destination_location_id?: Prisma.UuidFilter<"corridors"> | string;
    is_template?: Prisma.BoolFilter<"corridors"> | boolean;
    total_distance_km?: Prisma.DecimalNullableFilter<"corridors"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.IntNullableFilter<"corridors"> | number | null;
    active?: Prisma.BoolFilter<"corridors"> | boolean;
    created_at?: Prisma.DateTimeFilter<"corridors"> | Date | string;
};
export type corridorsUpsertWithWhereUniqueWithoutDestination_locationInput = {
    where: Prisma.corridorsWhereUniqueInput;
    update: Prisma.XOR<Prisma.corridorsUpdateWithoutDestination_locationInput, Prisma.corridorsUncheckedUpdateWithoutDestination_locationInput>;
    create: Prisma.XOR<Prisma.corridorsCreateWithoutDestination_locationInput, Prisma.corridorsUncheckedCreateWithoutDestination_locationInput>;
};
export type corridorsUpdateWithWhereUniqueWithoutDestination_locationInput = {
    where: Prisma.corridorsWhereUniqueInput;
    data: Prisma.XOR<Prisma.corridorsUpdateWithoutDestination_locationInput, Prisma.corridorsUncheckedUpdateWithoutDestination_locationInput>;
};
export type corridorsUpdateManyWithWhereWithoutDestination_locationInput = {
    where: Prisma.corridorsScalarWhereInput;
    data: Prisma.XOR<Prisma.corridorsUpdateManyMutationInput, Prisma.corridorsUncheckedUpdateManyWithoutDestination_locationInput>;
};
export type corridorsCreateWithoutDispatchOrdersInput = {
    id?: string;
    name?: string | null;
    description?: string | null;
    is_template?: boolean;
    total_distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    active?: boolean;
    created_at?: Date | string;
    origin_location: Prisma.locationsCreateNestedOneWithoutCorridor_originInput;
    destination_location: Prisma.locationsCreateNestedOneWithoutCorridor_destinationInput;
    corridorStops?: Prisma.corridor_stopsCreateNestedManyWithoutCorridorInput;
};
export type corridorsUncheckedCreateWithoutDispatchOrdersInput = {
    id?: string;
    name?: string | null;
    description?: string | null;
    origin_location_id: string;
    destination_location_id: string;
    is_template?: boolean;
    total_distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    active?: boolean;
    created_at?: Date | string;
    corridorStops?: Prisma.corridor_stopsUncheckedCreateNestedManyWithoutCorridorInput;
};
export type corridorsCreateOrConnectWithoutDispatchOrdersInput = {
    where: Prisma.corridorsWhereUniqueInput;
    create: Prisma.XOR<Prisma.corridorsCreateWithoutDispatchOrdersInput, Prisma.corridorsUncheckedCreateWithoutDispatchOrdersInput>;
};
export type corridorsUpsertWithoutDispatchOrdersInput = {
    update: Prisma.XOR<Prisma.corridorsUpdateWithoutDispatchOrdersInput, Prisma.corridorsUncheckedUpdateWithoutDispatchOrdersInput>;
    create: Prisma.XOR<Prisma.corridorsCreateWithoutDispatchOrdersInput, Prisma.corridorsUncheckedCreateWithoutDispatchOrdersInput>;
    where?: Prisma.corridorsWhereInput;
};
export type corridorsUpdateToOneWithWhereWithoutDispatchOrdersInput = {
    where?: Prisma.corridorsWhereInput;
    data: Prisma.XOR<Prisma.corridorsUpdateWithoutDispatchOrdersInput, Prisma.corridorsUncheckedUpdateWithoutDispatchOrdersInput>;
};
export type corridorsUpdateWithoutDispatchOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_template?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    origin_location?: Prisma.locationsUpdateOneRequiredWithoutCorridor_originNestedInput;
    destination_location?: Prisma.locationsUpdateOneRequiredWithoutCorridor_destinationNestedInput;
    corridorStops?: Prisma.corridor_stopsUpdateManyWithoutCorridorNestedInput;
};
export type corridorsUncheckedUpdateWithoutDispatchOrdersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    origin_location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    destination_location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_template?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    corridorStops?: Prisma.corridor_stopsUncheckedUpdateManyWithoutCorridorNestedInput;
};
export type corridorsCreateWithoutCorridorStopsInput = {
    id?: string;
    name?: string | null;
    description?: string | null;
    is_template?: boolean;
    total_distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    active?: boolean;
    created_at?: Date | string;
    origin_location: Prisma.locationsCreateNestedOneWithoutCorridor_originInput;
    destination_location: Prisma.locationsCreateNestedOneWithoutCorridor_destinationInput;
    dispatchOrders?: Prisma.dispatch_ordersCreateNestedManyWithoutCorridorsInput;
};
export type corridorsUncheckedCreateWithoutCorridorStopsInput = {
    id?: string;
    name?: string | null;
    description?: string | null;
    origin_location_id: string;
    destination_location_id: string;
    is_template?: boolean;
    total_distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    active?: boolean;
    created_at?: Date | string;
    dispatchOrders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutCorridorsInput;
};
export type corridorsCreateOrConnectWithoutCorridorStopsInput = {
    where: Prisma.corridorsWhereUniqueInput;
    create: Prisma.XOR<Prisma.corridorsCreateWithoutCorridorStopsInput, Prisma.corridorsUncheckedCreateWithoutCorridorStopsInput>;
};
export type corridorsUpsertWithoutCorridorStopsInput = {
    update: Prisma.XOR<Prisma.corridorsUpdateWithoutCorridorStopsInput, Prisma.corridorsUncheckedUpdateWithoutCorridorStopsInput>;
    create: Prisma.XOR<Prisma.corridorsCreateWithoutCorridorStopsInput, Prisma.corridorsUncheckedCreateWithoutCorridorStopsInput>;
    where?: Prisma.corridorsWhereInput;
};
export type corridorsUpdateToOneWithWhereWithoutCorridorStopsInput = {
    where?: Prisma.corridorsWhereInput;
    data: Prisma.XOR<Prisma.corridorsUpdateWithoutCorridorStopsInput, Prisma.corridorsUncheckedUpdateWithoutCorridorStopsInput>;
};
export type corridorsUpdateWithoutCorridorStopsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_template?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    origin_location?: Prisma.locationsUpdateOneRequiredWithoutCorridor_originNestedInput;
    destination_location?: Prisma.locationsUpdateOneRequiredWithoutCorridor_destinationNestedInput;
    dispatchOrders?: Prisma.dispatch_ordersUpdateManyWithoutCorridorsNestedInput;
};
export type corridorsUncheckedUpdateWithoutCorridorStopsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    origin_location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    destination_location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_template?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dispatchOrders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutCorridorsNestedInput;
};
export type corridorsCreateManyOrigin_locationInput = {
    id?: string;
    name?: string | null;
    description?: string | null;
    destination_location_id: string;
    is_template?: boolean;
    total_distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    active?: boolean;
    created_at?: Date | string;
};
export type corridorsCreateManyDestination_locationInput = {
    id?: string;
    name?: string | null;
    description?: string | null;
    origin_location_id: string;
    is_template?: boolean;
    total_distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    active?: boolean;
    created_at?: Date | string;
};
export type corridorsUpdateWithoutOrigin_locationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_template?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    destination_location?: Prisma.locationsUpdateOneRequiredWithoutCorridor_destinationNestedInput;
    corridorStops?: Prisma.corridor_stopsUpdateManyWithoutCorridorNestedInput;
    dispatchOrders?: Prisma.dispatch_ordersUpdateManyWithoutCorridorsNestedInput;
};
export type corridorsUncheckedUpdateWithoutOrigin_locationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    destination_location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_template?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    corridorStops?: Prisma.corridor_stopsUncheckedUpdateManyWithoutCorridorNestedInput;
    dispatchOrders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutCorridorsNestedInput;
};
export type corridorsUncheckedUpdateManyWithoutOrigin_locationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    destination_location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_template?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type corridorsUpdateWithoutDestination_locationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    is_template?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    origin_location?: Prisma.locationsUpdateOneRequiredWithoutCorridor_originNestedInput;
    corridorStops?: Prisma.corridor_stopsUpdateManyWithoutCorridorNestedInput;
    dispatchOrders?: Prisma.dispatch_ordersUpdateManyWithoutCorridorsNestedInput;
};
export type corridorsUncheckedUpdateWithoutDestination_locationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    origin_location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_template?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    corridorStops?: Prisma.corridor_stopsUncheckedUpdateManyWithoutCorridorNestedInput;
    dispatchOrders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutCorridorsNestedInput;
};
export type corridorsUncheckedUpdateManyWithoutDestination_locationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    origin_location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_template?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    total_distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CorridorsCountOutputType = {
    corridorStops: number;
    dispatchOrders: number;
};
export type CorridorsCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    corridorStops?: boolean | CorridorsCountOutputTypeCountCorridorStopsArgs;
    dispatchOrders?: boolean | CorridorsCountOutputTypeCountDispatchOrdersArgs;
};
export type CorridorsCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CorridorsCountOutputTypeSelect<ExtArgs> | null;
};
export type CorridorsCountOutputTypeCountCorridorStopsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.corridor_stopsWhereInput;
};
export type CorridorsCountOutputTypeCountDispatchOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.dispatch_ordersWhereInput;
};
export type corridorsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    origin_location_id?: boolean;
    destination_location_id?: boolean;
    is_template?: boolean;
    total_distance_km?: boolean;
    estimated_minutes?: boolean;
    active?: boolean;
    created_at?: boolean;
    origin_location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    destination_location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    corridorStops?: boolean | Prisma.corridors$corridorStopsArgs<ExtArgs>;
    dispatchOrders?: boolean | Prisma.corridors$dispatchOrdersArgs<ExtArgs>;
    _count?: boolean | Prisma.CorridorsCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["corridors"]>;
export type corridorsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    origin_location_id?: boolean;
    destination_location_id?: boolean;
    is_template?: boolean;
    total_distance_km?: boolean;
    estimated_minutes?: boolean;
    active?: boolean;
    created_at?: boolean;
    origin_location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    destination_location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["corridors"]>;
export type corridorsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    origin_location_id?: boolean;
    destination_location_id?: boolean;
    is_template?: boolean;
    total_distance_km?: boolean;
    estimated_minutes?: boolean;
    active?: boolean;
    created_at?: boolean;
    origin_location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    destination_location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["corridors"]>;
export type corridorsSelectScalar = {
    id?: boolean;
    name?: boolean;
    description?: boolean;
    origin_location_id?: boolean;
    destination_location_id?: boolean;
    is_template?: boolean;
    total_distance_km?: boolean;
    estimated_minutes?: boolean;
    active?: boolean;
    created_at?: boolean;
};
export type corridorsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "description" | "origin_location_id" | "destination_location_id" | "is_template" | "total_distance_km" | "estimated_minutes" | "active" | "created_at", ExtArgs["result"]["corridors"]>;
export type corridorsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    origin_location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    destination_location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    corridorStops?: boolean | Prisma.corridors$corridorStopsArgs<ExtArgs>;
    dispatchOrders?: boolean | Prisma.corridors$dispatchOrdersArgs<ExtArgs>;
    _count?: boolean | Prisma.CorridorsCountOutputTypeDefaultArgs<ExtArgs>;
};
export type corridorsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    origin_location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    destination_location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
};
export type corridorsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    origin_location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    destination_location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
};
export type $corridorsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "corridors";
    objects: {
        origin_location: Prisma.$locationsPayload<ExtArgs>;
        destination_location: Prisma.$locationsPayload<ExtArgs>;
        corridorStops: Prisma.$corridor_stopsPayload<ExtArgs>[];
        dispatchOrders: Prisma.$dispatch_ordersPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string | null;
        description: string | null;
        origin_location_id: string;
        destination_location_id: string;
        is_template: boolean;
        total_distance_km: runtime.Decimal | null;
        estimated_minutes: number | null;
        active: boolean;
        created_at: Date;
    }, ExtArgs["result"]["corridors"]>;
    composites: {};
};
export type corridorsGetPayload<S extends boolean | null | undefined | corridorsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$corridorsPayload, S>;
export type corridorsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<corridorsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CorridorsCountAggregateInputType | true;
};
export interface corridorsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['corridors'];
        meta: {
            name: 'corridors';
        };
    };
    findUnique<T extends corridorsFindUniqueArgs>(args: Prisma.SelectSubset<T, corridorsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__corridorsClient<runtime.Types.Result.GetResult<Prisma.$corridorsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends corridorsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, corridorsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__corridorsClient<runtime.Types.Result.GetResult<Prisma.$corridorsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends corridorsFindFirstArgs>(args?: Prisma.SelectSubset<T, corridorsFindFirstArgs<ExtArgs>>): Prisma.Prisma__corridorsClient<runtime.Types.Result.GetResult<Prisma.$corridorsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends corridorsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, corridorsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__corridorsClient<runtime.Types.Result.GetResult<Prisma.$corridorsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends corridorsFindManyArgs>(args?: Prisma.SelectSubset<T, corridorsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$corridorsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends corridorsCreateArgs>(args: Prisma.SelectSubset<T, corridorsCreateArgs<ExtArgs>>): Prisma.Prisma__corridorsClient<runtime.Types.Result.GetResult<Prisma.$corridorsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends corridorsCreateManyArgs>(args?: Prisma.SelectSubset<T, corridorsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends corridorsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, corridorsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$corridorsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends corridorsDeleteArgs>(args: Prisma.SelectSubset<T, corridorsDeleteArgs<ExtArgs>>): Prisma.Prisma__corridorsClient<runtime.Types.Result.GetResult<Prisma.$corridorsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends corridorsUpdateArgs>(args: Prisma.SelectSubset<T, corridorsUpdateArgs<ExtArgs>>): Prisma.Prisma__corridorsClient<runtime.Types.Result.GetResult<Prisma.$corridorsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends corridorsDeleteManyArgs>(args?: Prisma.SelectSubset<T, corridorsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends corridorsUpdateManyArgs>(args: Prisma.SelectSubset<T, corridorsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends corridorsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, corridorsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$corridorsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends corridorsUpsertArgs>(args: Prisma.SelectSubset<T, corridorsUpsertArgs<ExtArgs>>): Prisma.Prisma__corridorsClient<runtime.Types.Result.GetResult<Prisma.$corridorsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends corridorsCountArgs>(args?: Prisma.Subset<T, corridorsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CorridorsCountAggregateOutputType> : number>;
    aggregate<T extends CorridorsAggregateArgs>(args: Prisma.Subset<T, CorridorsAggregateArgs>): Prisma.PrismaPromise<GetCorridorsAggregateType<T>>;
    groupBy<T extends corridorsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: corridorsGroupByArgs['orderBy'];
    } : {
        orderBy?: corridorsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, corridorsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCorridorsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: corridorsFieldRefs;
}
export interface Prisma__corridorsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    origin_location<T extends Prisma.locationsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.locationsDefaultArgs<ExtArgs>>): Prisma.Prisma__locationsClient<runtime.Types.Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    destination_location<T extends Prisma.locationsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.locationsDefaultArgs<ExtArgs>>): Prisma.Prisma__locationsClient<runtime.Types.Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    corridorStops<T extends Prisma.corridors$corridorStopsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.corridors$corridorStopsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$corridor_stopsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    dispatchOrders<T extends Prisma.corridors$dispatchOrdersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.corridors$dispatchOrdersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$dispatch_ordersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface corridorsFieldRefs {
    readonly id: Prisma.FieldRef<"corridors", 'String'>;
    readonly name: Prisma.FieldRef<"corridors", 'String'>;
    readonly description: Prisma.FieldRef<"corridors", 'String'>;
    readonly origin_location_id: Prisma.FieldRef<"corridors", 'String'>;
    readonly destination_location_id: Prisma.FieldRef<"corridors", 'String'>;
    readonly is_template: Prisma.FieldRef<"corridors", 'Boolean'>;
    readonly total_distance_km: Prisma.FieldRef<"corridors", 'Decimal'>;
    readonly estimated_minutes: Prisma.FieldRef<"corridors", 'Int'>;
    readonly active: Prisma.FieldRef<"corridors", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"corridors", 'DateTime'>;
}
export type corridorsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridorsSelect<ExtArgs> | null;
    omit?: Prisma.corridorsOmit<ExtArgs> | null;
    include?: Prisma.corridorsInclude<ExtArgs> | null;
    where: Prisma.corridorsWhereUniqueInput;
};
export type corridorsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridorsSelect<ExtArgs> | null;
    omit?: Prisma.corridorsOmit<ExtArgs> | null;
    include?: Prisma.corridorsInclude<ExtArgs> | null;
    where: Prisma.corridorsWhereUniqueInput;
};
export type corridorsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridorsSelect<ExtArgs> | null;
    omit?: Prisma.corridorsOmit<ExtArgs> | null;
    include?: Prisma.corridorsInclude<ExtArgs> | null;
    where?: Prisma.corridorsWhereInput;
    orderBy?: Prisma.corridorsOrderByWithRelationInput | Prisma.corridorsOrderByWithRelationInput[];
    cursor?: Prisma.corridorsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CorridorsScalarFieldEnum | Prisma.CorridorsScalarFieldEnum[];
};
export type corridorsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridorsSelect<ExtArgs> | null;
    omit?: Prisma.corridorsOmit<ExtArgs> | null;
    include?: Prisma.corridorsInclude<ExtArgs> | null;
    where?: Prisma.corridorsWhereInput;
    orderBy?: Prisma.corridorsOrderByWithRelationInput | Prisma.corridorsOrderByWithRelationInput[];
    cursor?: Prisma.corridorsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CorridorsScalarFieldEnum | Prisma.CorridorsScalarFieldEnum[];
};
export type corridorsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridorsSelect<ExtArgs> | null;
    omit?: Prisma.corridorsOmit<ExtArgs> | null;
    include?: Prisma.corridorsInclude<ExtArgs> | null;
    where?: Prisma.corridorsWhereInput;
    orderBy?: Prisma.corridorsOrderByWithRelationInput | Prisma.corridorsOrderByWithRelationInput[];
    cursor?: Prisma.corridorsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CorridorsScalarFieldEnum | Prisma.CorridorsScalarFieldEnum[];
};
export type corridorsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridorsSelect<ExtArgs> | null;
    omit?: Prisma.corridorsOmit<ExtArgs> | null;
    include?: Prisma.corridorsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.corridorsCreateInput, Prisma.corridorsUncheckedCreateInput>;
};
export type corridorsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.corridorsCreateManyInput | Prisma.corridorsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type corridorsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridorsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.corridorsOmit<ExtArgs> | null;
    data: Prisma.corridorsCreateManyInput | Prisma.corridorsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.corridorsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type corridorsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridorsSelect<ExtArgs> | null;
    omit?: Prisma.corridorsOmit<ExtArgs> | null;
    include?: Prisma.corridorsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.corridorsUpdateInput, Prisma.corridorsUncheckedUpdateInput>;
    where: Prisma.corridorsWhereUniqueInput;
};
export type corridorsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.corridorsUpdateManyMutationInput, Prisma.corridorsUncheckedUpdateManyInput>;
    where?: Prisma.corridorsWhereInput;
    limit?: number;
};
export type corridorsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridorsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.corridorsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.corridorsUpdateManyMutationInput, Prisma.corridorsUncheckedUpdateManyInput>;
    where?: Prisma.corridorsWhereInput;
    limit?: number;
    include?: Prisma.corridorsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type corridorsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridorsSelect<ExtArgs> | null;
    omit?: Prisma.corridorsOmit<ExtArgs> | null;
    include?: Prisma.corridorsInclude<ExtArgs> | null;
    where: Prisma.corridorsWhereUniqueInput;
    create: Prisma.XOR<Prisma.corridorsCreateInput, Prisma.corridorsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.corridorsUpdateInput, Prisma.corridorsUncheckedUpdateInput>;
};
export type corridorsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridorsSelect<ExtArgs> | null;
    omit?: Prisma.corridorsOmit<ExtArgs> | null;
    include?: Prisma.corridorsInclude<ExtArgs> | null;
    where: Prisma.corridorsWhereUniqueInput;
};
export type corridorsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.corridorsWhereInput;
    limit?: number;
};
export type corridors$corridorStopsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridor_stopsSelect<ExtArgs> | null;
    omit?: Prisma.corridor_stopsOmit<ExtArgs> | null;
    include?: Prisma.corridor_stopsInclude<ExtArgs> | null;
    where?: Prisma.corridor_stopsWhereInput;
    orderBy?: Prisma.corridor_stopsOrderByWithRelationInput | Prisma.corridor_stopsOrderByWithRelationInput[];
    cursor?: Prisma.corridor_stopsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Corridor_stopsScalarFieldEnum | Prisma.Corridor_stopsScalarFieldEnum[];
};
export type corridors$dispatchOrdersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type corridorsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridorsSelect<ExtArgs> | null;
    omit?: Prisma.corridorsOmit<ExtArgs> | null;
    include?: Prisma.corridorsInclude<ExtArgs> | null;
};
