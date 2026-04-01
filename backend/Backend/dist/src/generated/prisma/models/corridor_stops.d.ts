import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type corridor_stopsModel = runtime.Types.Result.DefaultSelection<Prisma.$corridor_stopsPayload>;
export type AggregateCorridor_stops = {
    _count: Corridor_stopsCountAggregateOutputType | null;
    _avg: Corridor_stopsAvgAggregateOutputType | null;
    _sum: Corridor_stopsSumAggregateOutputType | null;
    _min: Corridor_stopsMinAggregateOutputType | null;
    _max: Corridor_stopsMaxAggregateOutputType | null;
};
export type Corridor_stopsAvgAggregateOutputType = {
    stop_order: number | null;
    distance_km: runtime.Decimal | null;
    estimated_minutes: number | null;
};
export type Corridor_stopsSumAggregateOutputType = {
    stop_order: number | null;
    distance_km: runtime.Decimal | null;
    estimated_minutes: number | null;
};
export type Corridor_stopsMinAggregateOutputType = {
    id: string | null;
    corridor_id: string | null;
    location_id: string | null;
    stop_order: number | null;
    stop_type: string | null;
    distance_km: runtime.Decimal | null;
    estimated_minutes: number | null;
    created_at: Date | null;
};
export type Corridor_stopsMaxAggregateOutputType = {
    id: string | null;
    corridor_id: string | null;
    location_id: string | null;
    stop_order: number | null;
    stop_type: string | null;
    distance_km: runtime.Decimal | null;
    estimated_minutes: number | null;
    created_at: Date | null;
};
export type Corridor_stopsCountAggregateOutputType = {
    id: number;
    corridor_id: number;
    location_id: number;
    stop_order: number;
    stop_type: number;
    distance_km: number;
    estimated_minutes: number;
    created_at: number;
    _all: number;
};
export type Corridor_stopsAvgAggregateInputType = {
    stop_order?: true;
    distance_km?: true;
    estimated_minutes?: true;
};
export type Corridor_stopsSumAggregateInputType = {
    stop_order?: true;
    distance_km?: true;
    estimated_minutes?: true;
};
export type Corridor_stopsMinAggregateInputType = {
    id?: true;
    corridor_id?: true;
    location_id?: true;
    stop_order?: true;
    stop_type?: true;
    distance_km?: true;
    estimated_minutes?: true;
    created_at?: true;
};
export type Corridor_stopsMaxAggregateInputType = {
    id?: true;
    corridor_id?: true;
    location_id?: true;
    stop_order?: true;
    stop_type?: true;
    distance_km?: true;
    estimated_minutes?: true;
    created_at?: true;
};
export type Corridor_stopsCountAggregateInputType = {
    id?: true;
    corridor_id?: true;
    location_id?: true;
    stop_order?: true;
    stop_type?: true;
    distance_km?: true;
    estimated_minutes?: true;
    created_at?: true;
    _all?: true;
};
export type Corridor_stopsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.corridor_stopsWhereInput;
    orderBy?: Prisma.corridor_stopsOrderByWithRelationInput | Prisma.corridor_stopsOrderByWithRelationInput[];
    cursor?: Prisma.corridor_stopsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Corridor_stopsCountAggregateInputType;
    _avg?: Corridor_stopsAvgAggregateInputType;
    _sum?: Corridor_stopsSumAggregateInputType;
    _min?: Corridor_stopsMinAggregateInputType;
    _max?: Corridor_stopsMaxAggregateInputType;
};
export type GetCorridor_stopsAggregateType<T extends Corridor_stopsAggregateArgs> = {
    [P in keyof T & keyof AggregateCorridor_stops]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCorridor_stops[P]> : Prisma.GetScalarType<T[P], AggregateCorridor_stops[P]>;
};
export type corridor_stopsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.corridor_stopsWhereInput;
    orderBy?: Prisma.corridor_stopsOrderByWithAggregationInput | Prisma.corridor_stopsOrderByWithAggregationInput[];
    by: Prisma.Corridor_stopsScalarFieldEnum[] | Prisma.Corridor_stopsScalarFieldEnum;
    having?: Prisma.corridor_stopsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Corridor_stopsCountAggregateInputType | true;
    _avg?: Corridor_stopsAvgAggregateInputType;
    _sum?: Corridor_stopsSumAggregateInputType;
    _min?: Corridor_stopsMinAggregateInputType;
    _max?: Corridor_stopsMaxAggregateInputType;
};
export type Corridor_stopsGroupByOutputType = {
    id: string;
    corridor_id: string;
    location_id: string;
    stop_order: number;
    stop_type: string | null;
    distance_km: runtime.Decimal | null;
    estimated_minutes: number | null;
    created_at: Date;
    _count: Corridor_stopsCountAggregateOutputType | null;
    _avg: Corridor_stopsAvgAggregateOutputType | null;
    _sum: Corridor_stopsSumAggregateOutputType | null;
    _min: Corridor_stopsMinAggregateOutputType | null;
    _max: Corridor_stopsMaxAggregateOutputType | null;
};
export type GetCorridor_stopsGroupByPayload<T extends corridor_stopsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Corridor_stopsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Corridor_stopsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Corridor_stopsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Corridor_stopsGroupByOutputType[P]>;
}>>;
export type corridor_stopsWhereInput = {
    AND?: Prisma.corridor_stopsWhereInput | Prisma.corridor_stopsWhereInput[];
    OR?: Prisma.corridor_stopsWhereInput[];
    NOT?: Prisma.corridor_stopsWhereInput | Prisma.corridor_stopsWhereInput[];
    id?: Prisma.UuidFilter<"corridor_stops"> | string;
    corridor_id?: Prisma.UuidFilter<"corridor_stops"> | string;
    location_id?: Prisma.UuidFilter<"corridor_stops"> | string;
    stop_order?: Prisma.IntFilter<"corridor_stops"> | number;
    stop_type?: Prisma.StringNullableFilter<"corridor_stops"> | string | null;
    distance_km?: Prisma.DecimalNullableFilter<"corridor_stops"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.IntNullableFilter<"corridor_stops"> | number | null;
    created_at?: Prisma.DateTimeFilter<"corridor_stops"> | Date | string;
    corridor?: Prisma.XOR<Prisma.CorridorsScalarRelationFilter, Prisma.corridorsWhereInput>;
    location?: Prisma.XOR<Prisma.LocationsScalarRelationFilter, Prisma.locationsWhereInput>;
};
export type corridor_stopsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    corridor_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    stop_order?: Prisma.SortOrder;
    stop_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    distance_km?: Prisma.SortOrderInput | Prisma.SortOrder;
    estimated_minutes?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    corridor?: Prisma.corridorsOrderByWithRelationInput;
    location?: Prisma.locationsOrderByWithRelationInput;
};
export type corridor_stopsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    corridor_id_stop_order?: Prisma.corridor_stopsCorridor_idStop_orderCompoundUniqueInput;
    AND?: Prisma.corridor_stopsWhereInput | Prisma.corridor_stopsWhereInput[];
    OR?: Prisma.corridor_stopsWhereInput[];
    NOT?: Prisma.corridor_stopsWhereInput | Prisma.corridor_stopsWhereInput[];
    corridor_id?: Prisma.UuidFilter<"corridor_stops"> | string;
    location_id?: Prisma.UuidFilter<"corridor_stops"> | string;
    stop_order?: Prisma.IntFilter<"corridor_stops"> | number;
    stop_type?: Prisma.StringNullableFilter<"corridor_stops"> | string | null;
    distance_km?: Prisma.DecimalNullableFilter<"corridor_stops"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.IntNullableFilter<"corridor_stops"> | number | null;
    created_at?: Prisma.DateTimeFilter<"corridor_stops"> | Date | string;
    corridor?: Prisma.XOR<Prisma.CorridorsScalarRelationFilter, Prisma.corridorsWhereInput>;
    location?: Prisma.XOR<Prisma.LocationsScalarRelationFilter, Prisma.locationsWhereInput>;
}, "id" | "corridor_id_stop_order">;
export type corridor_stopsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    corridor_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    stop_order?: Prisma.SortOrder;
    stop_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    distance_km?: Prisma.SortOrderInput | Prisma.SortOrder;
    estimated_minutes?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.corridor_stopsCountOrderByAggregateInput;
    _avg?: Prisma.corridor_stopsAvgOrderByAggregateInput;
    _max?: Prisma.corridor_stopsMaxOrderByAggregateInput;
    _min?: Prisma.corridor_stopsMinOrderByAggregateInput;
    _sum?: Prisma.corridor_stopsSumOrderByAggregateInput;
};
export type corridor_stopsScalarWhereWithAggregatesInput = {
    AND?: Prisma.corridor_stopsScalarWhereWithAggregatesInput | Prisma.corridor_stopsScalarWhereWithAggregatesInput[];
    OR?: Prisma.corridor_stopsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.corridor_stopsScalarWhereWithAggregatesInput | Prisma.corridor_stopsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"corridor_stops"> | string;
    corridor_id?: Prisma.UuidWithAggregatesFilter<"corridor_stops"> | string;
    location_id?: Prisma.UuidWithAggregatesFilter<"corridor_stops"> | string;
    stop_order?: Prisma.IntWithAggregatesFilter<"corridor_stops"> | number;
    stop_type?: Prisma.StringNullableWithAggregatesFilter<"corridor_stops"> | string | null;
    distance_km?: Prisma.DecimalNullableWithAggregatesFilter<"corridor_stops"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.IntNullableWithAggregatesFilter<"corridor_stops"> | number | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"corridor_stops"> | Date | string;
};
export type corridor_stopsCreateInput = {
    id?: string;
    stop_order: number;
    stop_type?: string | null;
    distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    created_at?: Date | string;
    corridor: Prisma.corridorsCreateNestedOneWithoutCorridorStopsInput;
    location: Prisma.locationsCreateNestedOneWithoutCorridorStopsInput;
};
export type corridor_stopsUncheckedCreateInput = {
    id?: string;
    corridor_id: string;
    location_id: string;
    stop_order: number;
    stop_type?: string | null;
    distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    created_at?: Date | string;
};
export type corridor_stopsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    corridor?: Prisma.corridorsUpdateOneRequiredWithoutCorridorStopsNestedInput;
    location?: Prisma.locationsUpdateOneRequiredWithoutCorridorStopsNestedInput;
};
export type corridor_stopsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    corridor_id?: Prisma.StringFieldUpdateOperationsInput | string;
    location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type corridor_stopsCreateManyInput = {
    id?: string;
    corridor_id: string;
    location_id: string;
    stop_order: number;
    stop_type?: string | null;
    distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    created_at?: Date | string;
};
export type corridor_stopsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type corridor_stopsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    corridor_id?: Prisma.StringFieldUpdateOperationsInput | string;
    location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type Corridor_stopsListRelationFilter = {
    every?: Prisma.corridor_stopsWhereInput;
    some?: Prisma.corridor_stopsWhereInput;
    none?: Prisma.corridor_stopsWhereInput;
};
export type corridor_stopsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type corridor_stopsCorridor_idStop_orderCompoundUniqueInput = {
    corridor_id: string;
    stop_order: number;
};
export type corridor_stopsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    corridor_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    stop_order?: Prisma.SortOrder;
    stop_type?: Prisma.SortOrder;
    distance_km?: Prisma.SortOrder;
    estimated_minutes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type corridor_stopsAvgOrderByAggregateInput = {
    stop_order?: Prisma.SortOrder;
    distance_km?: Prisma.SortOrder;
    estimated_minutes?: Prisma.SortOrder;
};
export type corridor_stopsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    corridor_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    stop_order?: Prisma.SortOrder;
    stop_type?: Prisma.SortOrder;
    distance_km?: Prisma.SortOrder;
    estimated_minutes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type corridor_stopsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    corridor_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    stop_order?: Prisma.SortOrder;
    stop_type?: Prisma.SortOrder;
    distance_km?: Prisma.SortOrder;
    estimated_minutes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type corridor_stopsSumOrderByAggregateInput = {
    stop_order?: Prisma.SortOrder;
    distance_km?: Prisma.SortOrder;
    estimated_minutes?: Prisma.SortOrder;
};
export type corridor_stopsCreateNestedManyWithoutLocationInput = {
    create?: Prisma.XOR<Prisma.corridor_stopsCreateWithoutLocationInput, Prisma.corridor_stopsUncheckedCreateWithoutLocationInput> | Prisma.corridor_stopsCreateWithoutLocationInput[] | Prisma.corridor_stopsUncheckedCreateWithoutLocationInput[];
    connectOrCreate?: Prisma.corridor_stopsCreateOrConnectWithoutLocationInput | Prisma.corridor_stopsCreateOrConnectWithoutLocationInput[];
    createMany?: Prisma.corridor_stopsCreateManyLocationInputEnvelope;
    connect?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
};
export type corridor_stopsUncheckedCreateNestedManyWithoutLocationInput = {
    create?: Prisma.XOR<Prisma.corridor_stopsCreateWithoutLocationInput, Prisma.corridor_stopsUncheckedCreateWithoutLocationInput> | Prisma.corridor_stopsCreateWithoutLocationInput[] | Prisma.corridor_stopsUncheckedCreateWithoutLocationInput[];
    connectOrCreate?: Prisma.corridor_stopsCreateOrConnectWithoutLocationInput | Prisma.corridor_stopsCreateOrConnectWithoutLocationInput[];
    createMany?: Prisma.corridor_stopsCreateManyLocationInputEnvelope;
    connect?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
};
export type corridor_stopsUpdateManyWithoutLocationNestedInput = {
    create?: Prisma.XOR<Prisma.corridor_stopsCreateWithoutLocationInput, Prisma.corridor_stopsUncheckedCreateWithoutLocationInput> | Prisma.corridor_stopsCreateWithoutLocationInput[] | Prisma.corridor_stopsUncheckedCreateWithoutLocationInput[];
    connectOrCreate?: Prisma.corridor_stopsCreateOrConnectWithoutLocationInput | Prisma.corridor_stopsCreateOrConnectWithoutLocationInput[];
    upsert?: Prisma.corridor_stopsUpsertWithWhereUniqueWithoutLocationInput | Prisma.corridor_stopsUpsertWithWhereUniqueWithoutLocationInput[];
    createMany?: Prisma.corridor_stopsCreateManyLocationInputEnvelope;
    set?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    disconnect?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    delete?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    connect?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    update?: Prisma.corridor_stopsUpdateWithWhereUniqueWithoutLocationInput | Prisma.corridor_stopsUpdateWithWhereUniqueWithoutLocationInput[];
    updateMany?: Prisma.corridor_stopsUpdateManyWithWhereWithoutLocationInput | Prisma.corridor_stopsUpdateManyWithWhereWithoutLocationInput[];
    deleteMany?: Prisma.corridor_stopsScalarWhereInput | Prisma.corridor_stopsScalarWhereInput[];
};
export type corridor_stopsUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: Prisma.XOR<Prisma.corridor_stopsCreateWithoutLocationInput, Prisma.corridor_stopsUncheckedCreateWithoutLocationInput> | Prisma.corridor_stopsCreateWithoutLocationInput[] | Prisma.corridor_stopsUncheckedCreateWithoutLocationInput[];
    connectOrCreate?: Prisma.corridor_stopsCreateOrConnectWithoutLocationInput | Prisma.corridor_stopsCreateOrConnectWithoutLocationInput[];
    upsert?: Prisma.corridor_stopsUpsertWithWhereUniqueWithoutLocationInput | Prisma.corridor_stopsUpsertWithWhereUniqueWithoutLocationInput[];
    createMany?: Prisma.corridor_stopsCreateManyLocationInputEnvelope;
    set?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    disconnect?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    delete?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    connect?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    update?: Prisma.corridor_stopsUpdateWithWhereUniqueWithoutLocationInput | Prisma.corridor_stopsUpdateWithWhereUniqueWithoutLocationInput[];
    updateMany?: Prisma.corridor_stopsUpdateManyWithWhereWithoutLocationInput | Prisma.corridor_stopsUpdateManyWithWhereWithoutLocationInput[];
    deleteMany?: Prisma.corridor_stopsScalarWhereInput | Prisma.corridor_stopsScalarWhereInput[];
};
export type corridor_stopsCreateNestedManyWithoutCorridorInput = {
    create?: Prisma.XOR<Prisma.corridor_stopsCreateWithoutCorridorInput, Prisma.corridor_stopsUncheckedCreateWithoutCorridorInput> | Prisma.corridor_stopsCreateWithoutCorridorInput[] | Prisma.corridor_stopsUncheckedCreateWithoutCorridorInput[];
    connectOrCreate?: Prisma.corridor_stopsCreateOrConnectWithoutCorridorInput | Prisma.corridor_stopsCreateOrConnectWithoutCorridorInput[];
    createMany?: Prisma.corridor_stopsCreateManyCorridorInputEnvelope;
    connect?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
};
export type corridor_stopsUncheckedCreateNestedManyWithoutCorridorInput = {
    create?: Prisma.XOR<Prisma.corridor_stopsCreateWithoutCorridorInput, Prisma.corridor_stopsUncheckedCreateWithoutCorridorInput> | Prisma.corridor_stopsCreateWithoutCorridorInput[] | Prisma.corridor_stopsUncheckedCreateWithoutCorridorInput[];
    connectOrCreate?: Prisma.corridor_stopsCreateOrConnectWithoutCorridorInput | Prisma.corridor_stopsCreateOrConnectWithoutCorridorInput[];
    createMany?: Prisma.corridor_stopsCreateManyCorridorInputEnvelope;
    connect?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
};
export type corridor_stopsUpdateManyWithoutCorridorNestedInput = {
    create?: Prisma.XOR<Prisma.corridor_stopsCreateWithoutCorridorInput, Prisma.corridor_stopsUncheckedCreateWithoutCorridorInput> | Prisma.corridor_stopsCreateWithoutCorridorInput[] | Prisma.corridor_stopsUncheckedCreateWithoutCorridorInput[];
    connectOrCreate?: Prisma.corridor_stopsCreateOrConnectWithoutCorridorInput | Prisma.corridor_stopsCreateOrConnectWithoutCorridorInput[];
    upsert?: Prisma.corridor_stopsUpsertWithWhereUniqueWithoutCorridorInput | Prisma.corridor_stopsUpsertWithWhereUniqueWithoutCorridorInput[];
    createMany?: Prisma.corridor_stopsCreateManyCorridorInputEnvelope;
    set?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    disconnect?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    delete?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    connect?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    update?: Prisma.corridor_stopsUpdateWithWhereUniqueWithoutCorridorInput | Prisma.corridor_stopsUpdateWithWhereUniqueWithoutCorridorInput[];
    updateMany?: Prisma.corridor_stopsUpdateManyWithWhereWithoutCorridorInput | Prisma.corridor_stopsUpdateManyWithWhereWithoutCorridorInput[];
    deleteMany?: Prisma.corridor_stopsScalarWhereInput | Prisma.corridor_stopsScalarWhereInput[];
};
export type corridor_stopsUncheckedUpdateManyWithoutCorridorNestedInput = {
    create?: Prisma.XOR<Prisma.corridor_stopsCreateWithoutCorridorInput, Prisma.corridor_stopsUncheckedCreateWithoutCorridorInput> | Prisma.corridor_stopsCreateWithoutCorridorInput[] | Prisma.corridor_stopsUncheckedCreateWithoutCorridorInput[];
    connectOrCreate?: Prisma.corridor_stopsCreateOrConnectWithoutCorridorInput | Prisma.corridor_stopsCreateOrConnectWithoutCorridorInput[];
    upsert?: Prisma.corridor_stopsUpsertWithWhereUniqueWithoutCorridorInput | Prisma.corridor_stopsUpsertWithWhereUniqueWithoutCorridorInput[];
    createMany?: Prisma.corridor_stopsCreateManyCorridorInputEnvelope;
    set?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    disconnect?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    delete?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    connect?: Prisma.corridor_stopsWhereUniqueInput | Prisma.corridor_stopsWhereUniqueInput[];
    update?: Prisma.corridor_stopsUpdateWithWhereUniqueWithoutCorridorInput | Prisma.corridor_stopsUpdateWithWhereUniqueWithoutCorridorInput[];
    updateMany?: Prisma.corridor_stopsUpdateManyWithWhereWithoutCorridorInput | Prisma.corridor_stopsUpdateManyWithWhereWithoutCorridorInput[];
    deleteMany?: Prisma.corridor_stopsScalarWhereInput | Prisma.corridor_stopsScalarWhereInput[];
};
export type corridor_stopsCreateWithoutLocationInput = {
    id?: string;
    stop_order: number;
    stop_type?: string | null;
    distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    created_at?: Date | string;
    corridor: Prisma.corridorsCreateNestedOneWithoutCorridorStopsInput;
};
export type corridor_stopsUncheckedCreateWithoutLocationInput = {
    id?: string;
    corridor_id: string;
    stop_order: number;
    stop_type?: string | null;
    distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    created_at?: Date | string;
};
export type corridor_stopsCreateOrConnectWithoutLocationInput = {
    where: Prisma.corridor_stopsWhereUniqueInput;
    create: Prisma.XOR<Prisma.corridor_stopsCreateWithoutLocationInput, Prisma.corridor_stopsUncheckedCreateWithoutLocationInput>;
};
export type corridor_stopsCreateManyLocationInputEnvelope = {
    data: Prisma.corridor_stopsCreateManyLocationInput | Prisma.corridor_stopsCreateManyLocationInput[];
    skipDuplicates?: boolean;
};
export type corridor_stopsUpsertWithWhereUniqueWithoutLocationInput = {
    where: Prisma.corridor_stopsWhereUniqueInput;
    update: Prisma.XOR<Prisma.corridor_stopsUpdateWithoutLocationInput, Prisma.corridor_stopsUncheckedUpdateWithoutLocationInput>;
    create: Prisma.XOR<Prisma.corridor_stopsCreateWithoutLocationInput, Prisma.corridor_stopsUncheckedCreateWithoutLocationInput>;
};
export type corridor_stopsUpdateWithWhereUniqueWithoutLocationInput = {
    where: Prisma.corridor_stopsWhereUniqueInput;
    data: Prisma.XOR<Prisma.corridor_stopsUpdateWithoutLocationInput, Prisma.corridor_stopsUncheckedUpdateWithoutLocationInput>;
};
export type corridor_stopsUpdateManyWithWhereWithoutLocationInput = {
    where: Prisma.corridor_stopsScalarWhereInput;
    data: Prisma.XOR<Prisma.corridor_stopsUpdateManyMutationInput, Prisma.corridor_stopsUncheckedUpdateManyWithoutLocationInput>;
};
export type corridor_stopsScalarWhereInput = {
    AND?: Prisma.corridor_stopsScalarWhereInput | Prisma.corridor_stopsScalarWhereInput[];
    OR?: Prisma.corridor_stopsScalarWhereInput[];
    NOT?: Prisma.corridor_stopsScalarWhereInput | Prisma.corridor_stopsScalarWhereInput[];
    id?: Prisma.UuidFilter<"corridor_stops"> | string;
    corridor_id?: Prisma.UuidFilter<"corridor_stops"> | string;
    location_id?: Prisma.UuidFilter<"corridor_stops"> | string;
    stop_order?: Prisma.IntFilter<"corridor_stops"> | number;
    stop_type?: Prisma.StringNullableFilter<"corridor_stops"> | string | null;
    distance_km?: Prisma.DecimalNullableFilter<"corridor_stops"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.IntNullableFilter<"corridor_stops"> | number | null;
    created_at?: Prisma.DateTimeFilter<"corridor_stops"> | Date | string;
};
export type corridor_stopsCreateWithoutCorridorInput = {
    id?: string;
    stop_order: number;
    stop_type?: string | null;
    distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    created_at?: Date | string;
    location: Prisma.locationsCreateNestedOneWithoutCorridorStopsInput;
};
export type corridor_stopsUncheckedCreateWithoutCorridorInput = {
    id?: string;
    location_id: string;
    stop_order: number;
    stop_type?: string | null;
    distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    created_at?: Date | string;
};
export type corridor_stopsCreateOrConnectWithoutCorridorInput = {
    where: Prisma.corridor_stopsWhereUniqueInput;
    create: Prisma.XOR<Prisma.corridor_stopsCreateWithoutCorridorInput, Prisma.corridor_stopsUncheckedCreateWithoutCorridorInput>;
};
export type corridor_stopsCreateManyCorridorInputEnvelope = {
    data: Prisma.corridor_stopsCreateManyCorridorInput | Prisma.corridor_stopsCreateManyCorridorInput[];
    skipDuplicates?: boolean;
};
export type corridor_stopsUpsertWithWhereUniqueWithoutCorridorInput = {
    where: Prisma.corridor_stopsWhereUniqueInput;
    update: Prisma.XOR<Prisma.corridor_stopsUpdateWithoutCorridorInput, Prisma.corridor_stopsUncheckedUpdateWithoutCorridorInput>;
    create: Prisma.XOR<Prisma.corridor_stopsCreateWithoutCorridorInput, Prisma.corridor_stopsUncheckedCreateWithoutCorridorInput>;
};
export type corridor_stopsUpdateWithWhereUniqueWithoutCorridorInput = {
    where: Prisma.corridor_stopsWhereUniqueInput;
    data: Prisma.XOR<Prisma.corridor_stopsUpdateWithoutCorridorInput, Prisma.corridor_stopsUncheckedUpdateWithoutCorridorInput>;
};
export type corridor_stopsUpdateManyWithWhereWithoutCorridorInput = {
    where: Prisma.corridor_stopsScalarWhereInput;
    data: Prisma.XOR<Prisma.corridor_stopsUpdateManyMutationInput, Prisma.corridor_stopsUncheckedUpdateManyWithoutCorridorInput>;
};
export type corridor_stopsCreateManyLocationInput = {
    id?: string;
    corridor_id: string;
    stop_order: number;
    stop_type?: string | null;
    distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    created_at?: Date | string;
};
export type corridor_stopsUpdateWithoutLocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    corridor?: Prisma.corridorsUpdateOneRequiredWithoutCorridorStopsNestedInput;
};
export type corridor_stopsUncheckedUpdateWithoutLocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    corridor_id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type corridor_stopsUncheckedUpdateManyWithoutLocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    corridor_id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type corridor_stopsCreateManyCorridorInput = {
    id?: string;
    location_id: string;
    stop_order: number;
    stop_type?: string | null;
    distance_km?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: number | null;
    created_at?: Date | string;
};
export type corridor_stopsUpdateWithoutCorridorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    location?: Prisma.locationsUpdateOneRequiredWithoutCorridorStopsNestedInput;
};
export type corridor_stopsUncheckedUpdateWithoutCorridorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type corridor_stopsUncheckedUpdateManyWithoutCorridorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    distance_km?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    estimated_minutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type corridor_stopsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    corridor_id?: boolean;
    location_id?: boolean;
    stop_order?: boolean;
    stop_type?: boolean;
    distance_km?: boolean;
    estimated_minutes?: boolean;
    created_at?: boolean;
    corridor?: boolean | Prisma.corridorsDefaultArgs<ExtArgs>;
    location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["corridor_stops"]>;
export type corridor_stopsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    corridor_id?: boolean;
    location_id?: boolean;
    stop_order?: boolean;
    stop_type?: boolean;
    distance_km?: boolean;
    estimated_minutes?: boolean;
    created_at?: boolean;
    corridor?: boolean | Prisma.corridorsDefaultArgs<ExtArgs>;
    location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["corridor_stops"]>;
export type corridor_stopsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    corridor_id?: boolean;
    location_id?: boolean;
    stop_order?: boolean;
    stop_type?: boolean;
    distance_km?: boolean;
    estimated_minutes?: boolean;
    created_at?: boolean;
    corridor?: boolean | Prisma.corridorsDefaultArgs<ExtArgs>;
    location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["corridor_stops"]>;
export type corridor_stopsSelectScalar = {
    id?: boolean;
    corridor_id?: boolean;
    location_id?: boolean;
    stop_order?: boolean;
    stop_type?: boolean;
    distance_km?: boolean;
    estimated_minutes?: boolean;
    created_at?: boolean;
};
export type corridor_stopsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "corridor_id" | "location_id" | "stop_order" | "stop_type" | "distance_km" | "estimated_minutes" | "created_at", ExtArgs["result"]["corridor_stops"]>;
export type corridor_stopsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    corridor?: boolean | Prisma.corridorsDefaultArgs<ExtArgs>;
    location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
};
export type corridor_stopsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    corridor?: boolean | Prisma.corridorsDefaultArgs<ExtArgs>;
    location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
};
export type corridor_stopsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    corridor?: boolean | Prisma.corridorsDefaultArgs<ExtArgs>;
    location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
};
export type $corridor_stopsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "corridor_stops";
    objects: {
        corridor: Prisma.$corridorsPayload<ExtArgs>;
        location: Prisma.$locationsPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        corridor_id: string;
        location_id: string;
        stop_order: number;
        stop_type: string | null;
        distance_km: runtime.Decimal | null;
        estimated_minutes: number | null;
        created_at: Date;
    }, ExtArgs["result"]["corridor_stops"]>;
    composites: {};
};
export type corridor_stopsGetPayload<S extends boolean | null | undefined | corridor_stopsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$corridor_stopsPayload, S>;
export type corridor_stopsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<corridor_stopsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Corridor_stopsCountAggregateInputType | true;
};
export interface corridor_stopsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['corridor_stops'];
        meta: {
            name: 'corridor_stops';
        };
    };
    findUnique<T extends corridor_stopsFindUniqueArgs>(args: Prisma.SelectSubset<T, corridor_stopsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__corridor_stopsClient<runtime.Types.Result.GetResult<Prisma.$corridor_stopsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends corridor_stopsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, corridor_stopsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__corridor_stopsClient<runtime.Types.Result.GetResult<Prisma.$corridor_stopsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends corridor_stopsFindFirstArgs>(args?: Prisma.SelectSubset<T, corridor_stopsFindFirstArgs<ExtArgs>>): Prisma.Prisma__corridor_stopsClient<runtime.Types.Result.GetResult<Prisma.$corridor_stopsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends corridor_stopsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, corridor_stopsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__corridor_stopsClient<runtime.Types.Result.GetResult<Prisma.$corridor_stopsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends corridor_stopsFindManyArgs>(args?: Prisma.SelectSubset<T, corridor_stopsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$corridor_stopsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends corridor_stopsCreateArgs>(args: Prisma.SelectSubset<T, corridor_stopsCreateArgs<ExtArgs>>): Prisma.Prisma__corridor_stopsClient<runtime.Types.Result.GetResult<Prisma.$corridor_stopsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends corridor_stopsCreateManyArgs>(args?: Prisma.SelectSubset<T, corridor_stopsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends corridor_stopsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, corridor_stopsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$corridor_stopsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends corridor_stopsDeleteArgs>(args: Prisma.SelectSubset<T, corridor_stopsDeleteArgs<ExtArgs>>): Prisma.Prisma__corridor_stopsClient<runtime.Types.Result.GetResult<Prisma.$corridor_stopsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends corridor_stopsUpdateArgs>(args: Prisma.SelectSubset<T, corridor_stopsUpdateArgs<ExtArgs>>): Prisma.Prisma__corridor_stopsClient<runtime.Types.Result.GetResult<Prisma.$corridor_stopsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends corridor_stopsDeleteManyArgs>(args?: Prisma.SelectSubset<T, corridor_stopsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends corridor_stopsUpdateManyArgs>(args: Prisma.SelectSubset<T, corridor_stopsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends corridor_stopsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, corridor_stopsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$corridor_stopsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends corridor_stopsUpsertArgs>(args: Prisma.SelectSubset<T, corridor_stopsUpsertArgs<ExtArgs>>): Prisma.Prisma__corridor_stopsClient<runtime.Types.Result.GetResult<Prisma.$corridor_stopsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends corridor_stopsCountArgs>(args?: Prisma.Subset<T, corridor_stopsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Corridor_stopsCountAggregateOutputType> : number>;
    aggregate<T extends Corridor_stopsAggregateArgs>(args: Prisma.Subset<T, Corridor_stopsAggregateArgs>): Prisma.PrismaPromise<GetCorridor_stopsAggregateType<T>>;
    groupBy<T extends corridor_stopsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: corridor_stopsGroupByArgs['orderBy'];
    } : {
        orderBy?: corridor_stopsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, corridor_stopsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCorridor_stopsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: corridor_stopsFieldRefs;
}
export interface Prisma__corridor_stopsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    corridor<T extends Prisma.corridorsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.corridorsDefaultArgs<ExtArgs>>): Prisma.Prisma__corridorsClient<runtime.Types.Result.GetResult<Prisma.$corridorsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    location<T extends Prisma.locationsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.locationsDefaultArgs<ExtArgs>>): Prisma.Prisma__locationsClient<runtime.Types.Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface corridor_stopsFieldRefs {
    readonly id: Prisma.FieldRef<"corridor_stops", 'String'>;
    readonly corridor_id: Prisma.FieldRef<"corridor_stops", 'String'>;
    readonly location_id: Prisma.FieldRef<"corridor_stops", 'String'>;
    readonly stop_order: Prisma.FieldRef<"corridor_stops", 'Int'>;
    readonly stop_type: Prisma.FieldRef<"corridor_stops", 'String'>;
    readonly distance_km: Prisma.FieldRef<"corridor_stops", 'Decimal'>;
    readonly estimated_minutes: Prisma.FieldRef<"corridor_stops", 'Int'>;
    readonly created_at: Prisma.FieldRef<"corridor_stops", 'DateTime'>;
}
export type corridor_stopsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridor_stopsSelect<ExtArgs> | null;
    omit?: Prisma.corridor_stopsOmit<ExtArgs> | null;
    include?: Prisma.corridor_stopsInclude<ExtArgs> | null;
    where: Prisma.corridor_stopsWhereUniqueInput;
};
export type corridor_stopsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridor_stopsSelect<ExtArgs> | null;
    omit?: Prisma.corridor_stopsOmit<ExtArgs> | null;
    include?: Prisma.corridor_stopsInclude<ExtArgs> | null;
    where: Prisma.corridor_stopsWhereUniqueInput;
};
export type corridor_stopsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type corridor_stopsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type corridor_stopsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type corridor_stopsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridor_stopsSelect<ExtArgs> | null;
    omit?: Prisma.corridor_stopsOmit<ExtArgs> | null;
    include?: Prisma.corridor_stopsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.corridor_stopsCreateInput, Prisma.corridor_stopsUncheckedCreateInput>;
};
export type corridor_stopsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.corridor_stopsCreateManyInput | Prisma.corridor_stopsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type corridor_stopsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridor_stopsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.corridor_stopsOmit<ExtArgs> | null;
    data: Prisma.corridor_stopsCreateManyInput | Prisma.corridor_stopsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.corridor_stopsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type corridor_stopsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridor_stopsSelect<ExtArgs> | null;
    omit?: Prisma.corridor_stopsOmit<ExtArgs> | null;
    include?: Prisma.corridor_stopsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.corridor_stopsUpdateInput, Prisma.corridor_stopsUncheckedUpdateInput>;
    where: Prisma.corridor_stopsWhereUniqueInput;
};
export type corridor_stopsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.corridor_stopsUpdateManyMutationInput, Prisma.corridor_stopsUncheckedUpdateManyInput>;
    where?: Prisma.corridor_stopsWhereInput;
    limit?: number;
};
export type corridor_stopsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridor_stopsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.corridor_stopsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.corridor_stopsUpdateManyMutationInput, Prisma.corridor_stopsUncheckedUpdateManyInput>;
    where?: Prisma.corridor_stopsWhereInput;
    limit?: number;
    include?: Prisma.corridor_stopsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type corridor_stopsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridor_stopsSelect<ExtArgs> | null;
    omit?: Prisma.corridor_stopsOmit<ExtArgs> | null;
    include?: Prisma.corridor_stopsInclude<ExtArgs> | null;
    where: Prisma.corridor_stopsWhereUniqueInput;
    create: Prisma.XOR<Prisma.corridor_stopsCreateInput, Prisma.corridor_stopsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.corridor_stopsUpdateInput, Prisma.corridor_stopsUncheckedUpdateInput>;
};
export type corridor_stopsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridor_stopsSelect<ExtArgs> | null;
    omit?: Prisma.corridor_stopsOmit<ExtArgs> | null;
    include?: Prisma.corridor_stopsInclude<ExtArgs> | null;
    where: Prisma.corridor_stopsWhereUniqueInput;
};
export type corridor_stopsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.corridor_stopsWhereInput;
    limit?: number;
};
export type corridor_stopsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.corridor_stopsSelect<ExtArgs> | null;
    omit?: Prisma.corridor_stopsOmit<ExtArgs> | null;
    include?: Prisma.corridor_stopsInclude<ExtArgs> | null;
};
