import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type trip_stopsModel = runtime.Types.Result.DefaultSelection<Prisma.$trip_stopsPayload>;
export type AggregateTrip_stops = {
    _count: Trip_stopsCountAggregateOutputType | null;
    _avg: Trip_stopsAvgAggregateOutputType | null;
    _sum: Trip_stopsSumAggregateOutputType | null;
    _min: Trip_stopsMinAggregateOutputType | null;
    _max: Trip_stopsMaxAggregateOutputType | null;
};
export type Trip_stopsAvgAggregateOutputType = {
    stop_order: number | null;
};
export type Trip_stopsSumAggregateOutputType = {
    stop_order: number | null;
};
export type Trip_stopsMinAggregateOutputType = {
    id: string | null;
    trip_id: string | null;
    location_id: string | null;
    stop_order: number | null;
    stop_type: string | null;
    created_at: Date | null;
};
export type Trip_stopsMaxAggregateOutputType = {
    id: string | null;
    trip_id: string | null;
    location_id: string | null;
    stop_order: number | null;
    stop_type: string | null;
    created_at: Date | null;
};
export type Trip_stopsCountAggregateOutputType = {
    id: number;
    trip_id: number;
    location_id: number;
    stop_order: number;
    stop_type: number;
    created_at: number;
    _all: number;
};
export type Trip_stopsAvgAggregateInputType = {
    stop_order?: true;
};
export type Trip_stopsSumAggregateInputType = {
    stop_order?: true;
};
export type Trip_stopsMinAggregateInputType = {
    id?: true;
    trip_id?: true;
    location_id?: true;
    stop_order?: true;
    stop_type?: true;
    created_at?: true;
};
export type Trip_stopsMaxAggregateInputType = {
    id?: true;
    trip_id?: true;
    location_id?: true;
    stop_order?: true;
    stop_type?: true;
    created_at?: true;
};
export type Trip_stopsCountAggregateInputType = {
    id?: true;
    trip_id?: true;
    location_id?: true;
    stop_order?: true;
    stop_type?: true;
    created_at?: true;
    _all?: true;
};
export type Trip_stopsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.trip_stopsWhereInput;
    orderBy?: Prisma.trip_stopsOrderByWithRelationInput | Prisma.trip_stopsOrderByWithRelationInput[];
    cursor?: Prisma.trip_stopsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Trip_stopsCountAggregateInputType;
    _avg?: Trip_stopsAvgAggregateInputType;
    _sum?: Trip_stopsSumAggregateInputType;
    _min?: Trip_stopsMinAggregateInputType;
    _max?: Trip_stopsMaxAggregateInputType;
};
export type GetTrip_stopsAggregateType<T extends Trip_stopsAggregateArgs> = {
    [P in keyof T & keyof AggregateTrip_stops]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTrip_stops[P]> : Prisma.GetScalarType<T[P], AggregateTrip_stops[P]>;
};
export type trip_stopsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.trip_stopsWhereInput;
    orderBy?: Prisma.trip_stopsOrderByWithAggregationInput | Prisma.trip_stopsOrderByWithAggregationInput[];
    by: Prisma.Trip_stopsScalarFieldEnum[] | Prisma.Trip_stopsScalarFieldEnum;
    having?: Prisma.trip_stopsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Trip_stopsCountAggregateInputType | true;
    _avg?: Trip_stopsAvgAggregateInputType;
    _sum?: Trip_stopsSumAggregateInputType;
    _min?: Trip_stopsMinAggregateInputType;
    _max?: Trip_stopsMaxAggregateInputType;
};
export type Trip_stopsGroupByOutputType = {
    id: string;
    trip_id: string;
    location_id: string;
    stop_order: number;
    stop_type: string | null;
    created_at: Date;
    _count: Trip_stopsCountAggregateOutputType | null;
    _avg: Trip_stopsAvgAggregateOutputType | null;
    _sum: Trip_stopsSumAggregateOutputType | null;
    _min: Trip_stopsMinAggregateOutputType | null;
    _max: Trip_stopsMaxAggregateOutputType | null;
};
export type GetTrip_stopsGroupByPayload<T extends trip_stopsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Trip_stopsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Trip_stopsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Trip_stopsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Trip_stopsGroupByOutputType[P]>;
}>>;
export type trip_stopsWhereInput = {
    AND?: Prisma.trip_stopsWhereInput | Prisma.trip_stopsWhereInput[];
    OR?: Prisma.trip_stopsWhereInput[];
    NOT?: Prisma.trip_stopsWhereInput | Prisma.trip_stopsWhereInput[];
    id?: Prisma.UuidFilter<"trip_stops"> | string;
    trip_id?: Prisma.UuidFilter<"trip_stops"> | string;
    location_id?: Prisma.UuidFilter<"trip_stops"> | string;
    stop_order?: Prisma.IntFilter<"trip_stops"> | number;
    stop_type?: Prisma.StringNullableFilter<"trip_stops"> | string | null;
    created_at?: Prisma.DateTimeFilter<"trip_stops"> | Date | string;
    trip?: Prisma.XOR<Prisma.TripsScalarRelationFilter, Prisma.tripsWhereInput>;
    location?: Prisma.XOR<Prisma.LocationsScalarRelationFilter, Prisma.locationsWhereInput>;
    trip_orders?: Prisma.Trip_stop_ordersListRelationFilter;
};
export type trip_stopsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    trip_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    stop_order?: Prisma.SortOrder;
    stop_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    trip?: Prisma.tripsOrderByWithRelationInput;
    location?: Prisma.locationsOrderByWithRelationInput;
    trip_orders?: Prisma.trip_stop_ordersOrderByRelationAggregateInput;
};
export type trip_stopsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.trip_stopsWhereInput | Prisma.trip_stopsWhereInput[];
    OR?: Prisma.trip_stopsWhereInput[];
    NOT?: Prisma.trip_stopsWhereInput | Prisma.trip_stopsWhereInput[];
    trip_id?: Prisma.UuidFilter<"trip_stops"> | string;
    location_id?: Prisma.UuidFilter<"trip_stops"> | string;
    stop_order?: Prisma.IntFilter<"trip_stops"> | number;
    stop_type?: Prisma.StringNullableFilter<"trip_stops"> | string | null;
    created_at?: Prisma.DateTimeFilter<"trip_stops"> | Date | string;
    trip?: Prisma.XOR<Prisma.TripsScalarRelationFilter, Prisma.tripsWhereInput>;
    location?: Prisma.XOR<Prisma.LocationsScalarRelationFilter, Prisma.locationsWhereInput>;
    trip_orders?: Prisma.Trip_stop_ordersListRelationFilter;
}, "id">;
export type trip_stopsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    trip_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    stop_order?: Prisma.SortOrder;
    stop_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.trip_stopsCountOrderByAggregateInput;
    _avg?: Prisma.trip_stopsAvgOrderByAggregateInput;
    _max?: Prisma.trip_stopsMaxOrderByAggregateInput;
    _min?: Prisma.trip_stopsMinOrderByAggregateInput;
    _sum?: Prisma.trip_stopsSumOrderByAggregateInput;
};
export type trip_stopsScalarWhereWithAggregatesInput = {
    AND?: Prisma.trip_stopsScalarWhereWithAggregatesInput | Prisma.trip_stopsScalarWhereWithAggregatesInput[];
    OR?: Prisma.trip_stopsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.trip_stopsScalarWhereWithAggregatesInput | Prisma.trip_stopsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"trip_stops"> | string;
    trip_id?: Prisma.UuidWithAggregatesFilter<"trip_stops"> | string;
    location_id?: Prisma.UuidWithAggregatesFilter<"trip_stops"> | string;
    stop_order?: Prisma.IntWithAggregatesFilter<"trip_stops"> | number;
    stop_type?: Prisma.StringNullableWithAggregatesFilter<"trip_stops"> | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"trip_stops"> | Date | string;
};
export type trip_stopsCreateInput = {
    id?: string;
    stop_order: number;
    stop_type?: string | null;
    created_at?: Date | string;
    trip: Prisma.tripsCreateNestedOneWithoutTrip_stopsInput;
    location: Prisma.locationsCreateNestedOneWithoutTripStopsInput;
    trip_orders?: Prisma.trip_stop_ordersCreateNestedManyWithoutTrip_stopInput;
};
export type trip_stopsUncheckedCreateInput = {
    id?: string;
    trip_id: string;
    location_id: string;
    stop_order: number;
    stop_type?: string | null;
    created_at?: Date | string;
    trip_orders?: Prisma.trip_stop_ordersUncheckedCreateNestedManyWithoutTrip_stopInput;
};
export type trip_stopsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trip?: Prisma.tripsUpdateOneRequiredWithoutTrip_stopsNestedInput;
    location?: Prisma.locationsUpdateOneRequiredWithoutTripStopsNestedInput;
    trip_orders?: Prisma.trip_stop_ordersUpdateManyWithoutTrip_stopNestedInput;
};
export type trip_stopsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trip_id?: Prisma.StringFieldUpdateOperationsInput | string;
    location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trip_orders?: Prisma.trip_stop_ordersUncheckedUpdateManyWithoutTrip_stopNestedInput;
};
export type trip_stopsCreateManyInput = {
    id?: string;
    trip_id: string;
    location_id: string;
    stop_order: number;
    stop_type?: string | null;
    created_at?: Date | string;
};
export type trip_stopsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type trip_stopsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trip_id?: Prisma.StringFieldUpdateOperationsInput | string;
    location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type Trip_stopsListRelationFilter = {
    every?: Prisma.trip_stopsWhereInput;
    some?: Prisma.trip_stopsWhereInput;
    none?: Prisma.trip_stopsWhereInput;
};
export type trip_stopsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type trip_stopsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    trip_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    stop_order?: Prisma.SortOrder;
    stop_type?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type trip_stopsAvgOrderByAggregateInput = {
    stop_order?: Prisma.SortOrder;
};
export type trip_stopsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    trip_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    stop_order?: Prisma.SortOrder;
    stop_type?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type trip_stopsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    trip_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    stop_order?: Prisma.SortOrder;
    stop_type?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type trip_stopsSumOrderByAggregateInput = {
    stop_order?: Prisma.SortOrder;
};
export type Trip_stopsScalarRelationFilter = {
    is?: Prisma.trip_stopsWhereInput;
    isNot?: Prisma.trip_stopsWhereInput;
};
export type trip_stopsCreateNestedManyWithoutLocationInput = {
    create?: Prisma.XOR<Prisma.trip_stopsCreateWithoutLocationInput, Prisma.trip_stopsUncheckedCreateWithoutLocationInput> | Prisma.trip_stopsCreateWithoutLocationInput[] | Prisma.trip_stopsUncheckedCreateWithoutLocationInput[];
    connectOrCreate?: Prisma.trip_stopsCreateOrConnectWithoutLocationInput | Prisma.trip_stopsCreateOrConnectWithoutLocationInput[];
    createMany?: Prisma.trip_stopsCreateManyLocationInputEnvelope;
    connect?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
};
export type trip_stopsUncheckedCreateNestedManyWithoutLocationInput = {
    create?: Prisma.XOR<Prisma.trip_stopsCreateWithoutLocationInput, Prisma.trip_stopsUncheckedCreateWithoutLocationInput> | Prisma.trip_stopsCreateWithoutLocationInput[] | Prisma.trip_stopsUncheckedCreateWithoutLocationInput[];
    connectOrCreate?: Prisma.trip_stopsCreateOrConnectWithoutLocationInput | Prisma.trip_stopsCreateOrConnectWithoutLocationInput[];
    createMany?: Prisma.trip_stopsCreateManyLocationInputEnvelope;
    connect?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
};
export type trip_stopsUpdateManyWithoutLocationNestedInput = {
    create?: Prisma.XOR<Prisma.trip_stopsCreateWithoutLocationInput, Prisma.trip_stopsUncheckedCreateWithoutLocationInput> | Prisma.trip_stopsCreateWithoutLocationInput[] | Prisma.trip_stopsUncheckedCreateWithoutLocationInput[];
    connectOrCreate?: Prisma.trip_stopsCreateOrConnectWithoutLocationInput | Prisma.trip_stopsCreateOrConnectWithoutLocationInput[];
    upsert?: Prisma.trip_stopsUpsertWithWhereUniqueWithoutLocationInput | Prisma.trip_stopsUpsertWithWhereUniqueWithoutLocationInput[];
    createMany?: Prisma.trip_stopsCreateManyLocationInputEnvelope;
    set?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    disconnect?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    delete?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    connect?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    update?: Prisma.trip_stopsUpdateWithWhereUniqueWithoutLocationInput | Prisma.trip_stopsUpdateWithWhereUniqueWithoutLocationInput[];
    updateMany?: Prisma.trip_stopsUpdateManyWithWhereWithoutLocationInput | Prisma.trip_stopsUpdateManyWithWhereWithoutLocationInput[];
    deleteMany?: Prisma.trip_stopsScalarWhereInput | Prisma.trip_stopsScalarWhereInput[];
};
export type trip_stopsUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: Prisma.XOR<Prisma.trip_stopsCreateWithoutLocationInput, Prisma.trip_stopsUncheckedCreateWithoutLocationInput> | Prisma.trip_stopsCreateWithoutLocationInput[] | Prisma.trip_stopsUncheckedCreateWithoutLocationInput[];
    connectOrCreate?: Prisma.trip_stopsCreateOrConnectWithoutLocationInput | Prisma.trip_stopsCreateOrConnectWithoutLocationInput[];
    upsert?: Prisma.trip_stopsUpsertWithWhereUniqueWithoutLocationInput | Prisma.trip_stopsUpsertWithWhereUniqueWithoutLocationInput[];
    createMany?: Prisma.trip_stopsCreateManyLocationInputEnvelope;
    set?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    disconnect?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    delete?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    connect?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    update?: Prisma.trip_stopsUpdateWithWhereUniqueWithoutLocationInput | Prisma.trip_stopsUpdateWithWhereUniqueWithoutLocationInput[];
    updateMany?: Prisma.trip_stopsUpdateManyWithWhereWithoutLocationInput | Prisma.trip_stopsUpdateManyWithWhereWithoutLocationInput[];
    deleteMany?: Prisma.trip_stopsScalarWhereInput | Prisma.trip_stopsScalarWhereInput[];
};
export type trip_stopsCreateNestedManyWithoutTripInput = {
    create?: Prisma.XOR<Prisma.trip_stopsCreateWithoutTripInput, Prisma.trip_stopsUncheckedCreateWithoutTripInput> | Prisma.trip_stopsCreateWithoutTripInput[] | Prisma.trip_stopsUncheckedCreateWithoutTripInput[];
    connectOrCreate?: Prisma.trip_stopsCreateOrConnectWithoutTripInput | Prisma.trip_stopsCreateOrConnectWithoutTripInput[];
    createMany?: Prisma.trip_stopsCreateManyTripInputEnvelope;
    connect?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
};
export type trip_stopsUncheckedCreateNestedManyWithoutTripInput = {
    create?: Prisma.XOR<Prisma.trip_stopsCreateWithoutTripInput, Prisma.trip_stopsUncheckedCreateWithoutTripInput> | Prisma.trip_stopsCreateWithoutTripInput[] | Prisma.trip_stopsUncheckedCreateWithoutTripInput[];
    connectOrCreate?: Prisma.trip_stopsCreateOrConnectWithoutTripInput | Prisma.trip_stopsCreateOrConnectWithoutTripInput[];
    createMany?: Prisma.trip_stopsCreateManyTripInputEnvelope;
    connect?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
};
export type trip_stopsUpdateManyWithoutTripNestedInput = {
    create?: Prisma.XOR<Prisma.trip_stopsCreateWithoutTripInput, Prisma.trip_stopsUncheckedCreateWithoutTripInput> | Prisma.trip_stopsCreateWithoutTripInput[] | Prisma.trip_stopsUncheckedCreateWithoutTripInput[];
    connectOrCreate?: Prisma.trip_stopsCreateOrConnectWithoutTripInput | Prisma.trip_stopsCreateOrConnectWithoutTripInput[];
    upsert?: Prisma.trip_stopsUpsertWithWhereUniqueWithoutTripInput | Prisma.trip_stopsUpsertWithWhereUniqueWithoutTripInput[];
    createMany?: Prisma.trip_stopsCreateManyTripInputEnvelope;
    set?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    disconnect?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    delete?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    connect?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    update?: Prisma.trip_stopsUpdateWithWhereUniqueWithoutTripInput | Prisma.trip_stopsUpdateWithWhereUniqueWithoutTripInput[];
    updateMany?: Prisma.trip_stopsUpdateManyWithWhereWithoutTripInput | Prisma.trip_stopsUpdateManyWithWhereWithoutTripInput[];
    deleteMany?: Prisma.trip_stopsScalarWhereInput | Prisma.trip_stopsScalarWhereInput[];
};
export type trip_stopsUncheckedUpdateManyWithoutTripNestedInput = {
    create?: Prisma.XOR<Prisma.trip_stopsCreateWithoutTripInput, Prisma.trip_stopsUncheckedCreateWithoutTripInput> | Prisma.trip_stopsCreateWithoutTripInput[] | Prisma.trip_stopsUncheckedCreateWithoutTripInput[];
    connectOrCreate?: Prisma.trip_stopsCreateOrConnectWithoutTripInput | Prisma.trip_stopsCreateOrConnectWithoutTripInput[];
    upsert?: Prisma.trip_stopsUpsertWithWhereUniqueWithoutTripInput | Prisma.trip_stopsUpsertWithWhereUniqueWithoutTripInput[];
    createMany?: Prisma.trip_stopsCreateManyTripInputEnvelope;
    set?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    disconnect?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    delete?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    connect?: Prisma.trip_stopsWhereUniqueInput | Prisma.trip_stopsWhereUniqueInput[];
    update?: Prisma.trip_stopsUpdateWithWhereUniqueWithoutTripInput | Prisma.trip_stopsUpdateWithWhereUniqueWithoutTripInput[];
    updateMany?: Prisma.trip_stopsUpdateManyWithWhereWithoutTripInput | Prisma.trip_stopsUpdateManyWithWhereWithoutTripInput[];
    deleteMany?: Prisma.trip_stopsScalarWhereInput | Prisma.trip_stopsScalarWhereInput[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type trip_stopsCreateNestedOneWithoutTrip_ordersInput = {
    create?: Prisma.XOR<Prisma.trip_stopsCreateWithoutTrip_ordersInput, Prisma.trip_stopsUncheckedCreateWithoutTrip_ordersInput>;
    connectOrCreate?: Prisma.trip_stopsCreateOrConnectWithoutTrip_ordersInput;
    connect?: Prisma.trip_stopsWhereUniqueInput;
};
export type trip_stopsUpdateOneRequiredWithoutTrip_ordersNestedInput = {
    create?: Prisma.XOR<Prisma.trip_stopsCreateWithoutTrip_ordersInput, Prisma.trip_stopsUncheckedCreateWithoutTrip_ordersInput>;
    connectOrCreate?: Prisma.trip_stopsCreateOrConnectWithoutTrip_ordersInput;
    upsert?: Prisma.trip_stopsUpsertWithoutTrip_ordersInput;
    connect?: Prisma.trip_stopsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.trip_stopsUpdateToOneWithWhereWithoutTrip_ordersInput, Prisma.trip_stopsUpdateWithoutTrip_ordersInput>, Prisma.trip_stopsUncheckedUpdateWithoutTrip_ordersInput>;
};
export type trip_stopsCreateWithoutLocationInput = {
    id?: string;
    stop_order: number;
    stop_type?: string | null;
    created_at?: Date | string;
    trip: Prisma.tripsCreateNestedOneWithoutTrip_stopsInput;
    trip_orders?: Prisma.trip_stop_ordersCreateNestedManyWithoutTrip_stopInput;
};
export type trip_stopsUncheckedCreateWithoutLocationInput = {
    id?: string;
    trip_id: string;
    stop_order: number;
    stop_type?: string | null;
    created_at?: Date | string;
    trip_orders?: Prisma.trip_stop_ordersUncheckedCreateNestedManyWithoutTrip_stopInput;
};
export type trip_stopsCreateOrConnectWithoutLocationInput = {
    where: Prisma.trip_stopsWhereUniqueInput;
    create: Prisma.XOR<Prisma.trip_stopsCreateWithoutLocationInput, Prisma.trip_stopsUncheckedCreateWithoutLocationInput>;
};
export type trip_stopsCreateManyLocationInputEnvelope = {
    data: Prisma.trip_stopsCreateManyLocationInput | Prisma.trip_stopsCreateManyLocationInput[];
    skipDuplicates?: boolean;
};
export type trip_stopsUpsertWithWhereUniqueWithoutLocationInput = {
    where: Prisma.trip_stopsWhereUniqueInput;
    update: Prisma.XOR<Prisma.trip_stopsUpdateWithoutLocationInput, Prisma.trip_stopsUncheckedUpdateWithoutLocationInput>;
    create: Prisma.XOR<Prisma.trip_stopsCreateWithoutLocationInput, Prisma.trip_stopsUncheckedCreateWithoutLocationInput>;
};
export type trip_stopsUpdateWithWhereUniqueWithoutLocationInput = {
    where: Prisma.trip_stopsWhereUniqueInput;
    data: Prisma.XOR<Prisma.trip_stopsUpdateWithoutLocationInput, Prisma.trip_stopsUncheckedUpdateWithoutLocationInput>;
};
export type trip_stopsUpdateManyWithWhereWithoutLocationInput = {
    where: Prisma.trip_stopsScalarWhereInput;
    data: Prisma.XOR<Prisma.trip_stopsUpdateManyMutationInput, Prisma.trip_stopsUncheckedUpdateManyWithoutLocationInput>;
};
export type trip_stopsScalarWhereInput = {
    AND?: Prisma.trip_stopsScalarWhereInput | Prisma.trip_stopsScalarWhereInput[];
    OR?: Prisma.trip_stopsScalarWhereInput[];
    NOT?: Prisma.trip_stopsScalarWhereInput | Prisma.trip_stopsScalarWhereInput[];
    id?: Prisma.UuidFilter<"trip_stops"> | string;
    trip_id?: Prisma.UuidFilter<"trip_stops"> | string;
    location_id?: Prisma.UuidFilter<"trip_stops"> | string;
    stop_order?: Prisma.IntFilter<"trip_stops"> | number;
    stop_type?: Prisma.StringNullableFilter<"trip_stops"> | string | null;
    created_at?: Prisma.DateTimeFilter<"trip_stops"> | Date | string;
};
export type trip_stopsCreateWithoutTripInput = {
    id?: string;
    stop_order: number;
    stop_type?: string | null;
    created_at?: Date | string;
    location: Prisma.locationsCreateNestedOneWithoutTripStopsInput;
    trip_orders?: Prisma.trip_stop_ordersCreateNestedManyWithoutTrip_stopInput;
};
export type trip_stopsUncheckedCreateWithoutTripInput = {
    id?: string;
    location_id: string;
    stop_order: number;
    stop_type?: string | null;
    created_at?: Date | string;
    trip_orders?: Prisma.trip_stop_ordersUncheckedCreateNestedManyWithoutTrip_stopInput;
};
export type trip_stopsCreateOrConnectWithoutTripInput = {
    where: Prisma.trip_stopsWhereUniqueInput;
    create: Prisma.XOR<Prisma.trip_stopsCreateWithoutTripInput, Prisma.trip_stopsUncheckedCreateWithoutTripInput>;
};
export type trip_stopsCreateManyTripInputEnvelope = {
    data: Prisma.trip_stopsCreateManyTripInput | Prisma.trip_stopsCreateManyTripInput[];
    skipDuplicates?: boolean;
};
export type trip_stopsUpsertWithWhereUniqueWithoutTripInput = {
    where: Prisma.trip_stopsWhereUniqueInput;
    update: Prisma.XOR<Prisma.trip_stopsUpdateWithoutTripInput, Prisma.trip_stopsUncheckedUpdateWithoutTripInput>;
    create: Prisma.XOR<Prisma.trip_stopsCreateWithoutTripInput, Prisma.trip_stopsUncheckedCreateWithoutTripInput>;
};
export type trip_stopsUpdateWithWhereUniqueWithoutTripInput = {
    where: Prisma.trip_stopsWhereUniqueInput;
    data: Prisma.XOR<Prisma.trip_stopsUpdateWithoutTripInput, Prisma.trip_stopsUncheckedUpdateWithoutTripInput>;
};
export type trip_stopsUpdateManyWithWhereWithoutTripInput = {
    where: Prisma.trip_stopsScalarWhereInput;
    data: Prisma.XOR<Prisma.trip_stopsUpdateManyMutationInput, Prisma.trip_stopsUncheckedUpdateManyWithoutTripInput>;
};
export type trip_stopsCreateWithoutTrip_ordersInput = {
    id?: string;
    stop_order: number;
    stop_type?: string | null;
    created_at?: Date | string;
    trip: Prisma.tripsCreateNestedOneWithoutTrip_stopsInput;
    location: Prisma.locationsCreateNestedOneWithoutTripStopsInput;
};
export type trip_stopsUncheckedCreateWithoutTrip_ordersInput = {
    id?: string;
    trip_id: string;
    location_id: string;
    stop_order: number;
    stop_type?: string | null;
    created_at?: Date | string;
};
export type trip_stopsCreateOrConnectWithoutTrip_ordersInput = {
    where: Prisma.trip_stopsWhereUniqueInput;
    create: Prisma.XOR<Prisma.trip_stopsCreateWithoutTrip_ordersInput, Prisma.trip_stopsUncheckedCreateWithoutTrip_ordersInput>;
};
export type trip_stopsUpsertWithoutTrip_ordersInput = {
    update: Prisma.XOR<Prisma.trip_stopsUpdateWithoutTrip_ordersInput, Prisma.trip_stopsUncheckedUpdateWithoutTrip_ordersInput>;
    create: Prisma.XOR<Prisma.trip_stopsCreateWithoutTrip_ordersInput, Prisma.trip_stopsUncheckedCreateWithoutTrip_ordersInput>;
    where?: Prisma.trip_stopsWhereInput;
};
export type trip_stopsUpdateToOneWithWhereWithoutTrip_ordersInput = {
    where?: Prisma.trip_stopsWhereInput;
    data: Prisma.XOR<Prisma.trip_stopsUpdateWithoutTrip_ordersInput, Prisma.trip_stopsUncheckedUpdateWithoutTrip_ordersInput>;
};
export type trip_stopsUpdateWithoutTrip_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trip?: Prisma.tripsUpdateOneRequiredWithoutTrip_stopsNestedInput;
    location?: Prisma.locationsUpdateOneRequiredWithoutTripStopsNestedInput;
};
export type trip_stopsUncheckedUpdateWithoutTrip_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trip_id?: Prisma.StringFieldUpdateOperationsInput | string;
    location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type trip_stopsCreateManyLocationInput = {
    id?: string;
    trip_id: string;
    stop_order: number;
    stop_type?: string | null;
    created_at?: Date | string;
};
export type trip_stopsUpdateWithoutLocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trip?: Prisma.tripsUpdateOneRequiredWithoutTrip_stopsNestedInput;
    trip_orders?: Prisma.trip_stop_ordersUpdateManyWithoutTrip_stopNestedInput;
};
export type trip_stopsUncheckedUpdateWithoutLocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trip_id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trip_orders?: Prisma.trip_stop_ordersUncheckedUpdateManyWithoutTrip_stopNestedInput;
};
export type trip_stopsUncheckedUpdateManyWithoutLocationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trip_id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type trip_stopsCreateManyTripInput = {
    id?: string;
    location_id: string;
    stop_order: number;
    stop_type?: string | null;
    created_at?: Date | string;
};
export type trip_stopsUpdateWithoutTripInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    location?: Prisma.locationsUpdateOneRequiredWithoutTripStopsNestedInput;
    trip_orders?: Prisma.trip_stop_ordersUpdateManyWithoutTrip_stopNestedInput;
};
export type trip_stopsUncheckedUpdateWithoutTripInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trip_orders?: Prisma.trip_stop_ordersUncheckedUpdateManyWithoutTrip_stopNestedInput;
};
export type trip_stopsUncheckedUpdateManyWithoutTripInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    stop_order?: Prisma.IntFieldUpdateOperationsInput | number;
    stop_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type Trip_stopsCountOutputType = {
    trip_orders: number;
};
export type Trip_stopsCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trip_orders?: boolean | Trip_stopsCountOutputTypeCountTrip_ordersArgs;
};
export type Trip_stopsCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.Trip_stopsCountOutputTypeSelect<ExtArgs> | null;
};
export type Trip_stopsCountOutputTypeCountTrip_ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.trip_stop_ordersWhereInput;
};
export type trip_stopsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    trip_id?: boolean;
    location_id?: boolean;
    stop_order?: boolean;
    stop_type?: boolean;
    created_at?: boolean;
    trip?: boolean | Prisma.tripsDefaultArgs<ExtArgs>;
    location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    trip_orders?: boolean | Prisma.trip_stops$trip_ordersArgs<ExtArgs>;
    _count?: boolean | Prisma.Trip_stopsCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["trip_stops"]>;
export type trip_stopsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    trip_id?: boolean;
    location_id?: boolean;
    stop_order?: boolean;
    stop_type?: boolean;
    created_at?: boolean;
    trip?: boolean | Prisma.tripsDefaultArgs<ExtArgs>;
    location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["trip_stops"]>;
export type trip_stopsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    trip_id?: boolean;
    location_id?: boolean;
    stop_order?: boolean;
    stop_type?: boolean;
    created_at?: boolean;
    trip?: boolean | Prisma.tripsDefaultArgs<ExtArgs>;
    location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["trip_stops"]>;
export type trip_stopsSelectScalar = {
    id?: boolean;
    trip_id?: boolean;
    location_id?: boolean;
    stop_order?: boolean;
    stop_type?: boolean;
    created_at?: boolean;
};
export type trip_stopsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "trip_id" | "location_id" | "stop_order" | "stop_type" | "created_at", ExtArgs["result"]["trip_stops"]>;
export type trip_stopsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trip?: boolean | Prisma.tripsDefaultArgs<ExtArgs>;
    location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    trip_orders?: boolean | Prisma.trip_stops$trip_ordersArgs<ExtArgs>;
    _count?: boolean | Prisma.Trip_stopsCountOutputTypeDefaultArgs<ExtArgs>;
};
export type trip_stopsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trip?: boolean | Prisma.tripsDefaultArgs<ExtArgs>;
    location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
};
export type trip_stopsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trip?: boolean | Prisma.tripsDefaultArgs<ExtArgs>;
    location?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
};
export type $trip_stopsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "trip_stops";
    objects: {
        trip: Prisma.$tripsPayload<ExtArgs>;
        location: Prisma.$locationsPayload<ExtArgs>;
        trip_orders: Prisma.$trip_stop_ordersPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        trip_id: string;
        location_id: string;
        stop_order: number;
        stop_type: string | null;
        created_at: Date;
    }, ExtArgs["result"]["trip_stops"]>;
    composites: {};
};
export type trip_stopsGetPayload<S extends boolean | null | undefined | trip_stopsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$trip_stopsPayload, S>;
export type trip_stopsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<trip_stopsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Trip_stopsCountAggregateInputType | true;
};
export interface trip_stopsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['trip_stops'];
        meta: {
            name: 'trip_stops';
        };
    };
    findUnique<T extends trip_stopsFindUniqueArgs>(args: Prisma.SelectSubset<T, trip_stopsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__trip_stopsClient<runtime.Types.Result.GetResult<Prisma.$trip_stopsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends trip_stopsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, trip_stopsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__trip_stopsClient<runtime.Types.Result.GetResult<Prisma.$trip_stopsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends trip_stopsFindFirstArgs>(args?: Prisma.SelectSubset<T, trip_stopsFindFirstArgs<ExtArgs>>): Prisma.Prisma__trip_stopsClient<runtime.Types.Result.GetResult<Prisma.$trip_stopsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends trip_stopsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, trip_stopsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__trip_stopsClient<runtime.Types.Result.GetResult<Prisma.$trip_stopsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends trip_stopsFindManyArgs>(args?: Prisma.SelectSubset<T, trip_stopsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$trip_stopsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends trip_stopsCreateArgs>(args: Prisma.SelectSubset<T, trip_stopsCreateArgs<ExtArgs>>): Prisma.Prisma__trip_stopsClient<runtime.Types.Result.GetResult<Prisma.$trip_stopsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends trip_stopsCreateManyArgs>(args?: Prisma.SelectSubset<T, trip_stopsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends trip_stopsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, trip_stopsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$trip_stopsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends trip_stopsDeleteArgs>(args: Prisma.SelectSubset<T, trip_stopsDeleteArgs<ExtArgs>>): Prisma.Prisma__trip_stopsClient<runtime.Types.Result.GetResult<Prisma.$trip_stopsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends trip_stopsUpdateArgs>(args: Prisma.SelectSubset<T, trip_stopsUpdateArgs<ExtArgs>>): Prisma.Prisma__trip_stopsClient<runtime.Types.Result.GetResult<Prisma.$trip_stopsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends trip_stopsDeleteManyArgs>(args?: Prisma.SelectSubset<T, trip_stopsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends trip_stopsUpdateManyArgs>(args: Prisma.SelectSubset<T, trip_stopsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends trip_stopsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, trip_stopsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$trip_stopsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends trip_stopsUpsertArgs>(args: Prisma.SelectSubset<T, trip_stopsUpsertArgs<ExtArgs>>): Prisma.Prisma__trip_stopsClient<runtime.Types.Result.GetResult<Prisma.$trip_stopsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends trip_stopsCountArgs>(args?: Prisma.Subset<T, trip_stopsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Trip_stopsCountAggregateOutputType> : number>;
    aggregate<T extends Trip_stopsAggregateArgs>(args: Prisma.Subset<T, Trip_stopsAggregateArgs>): Prisma.PrismaPromise<GetTrip_stopsAggregateType<T>>;
    groupBy<T extends trip_stopsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: trip_stopsGroupByArgs['orderBy'];
    } : {
        orderBy?: trip_stopsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, trip_stopsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrip_stopsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: trip_stopsFieldRefs;
}
export interface Prisma__trip_stopsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    trip<T extends Prisma.tripsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.tripsDefaultArgs<ExtArgs>>): Prisma.Prisma__tripsClient<runtime.Types.Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    location<T extends Prisma.locationsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.locationsDefaultArgs<ExtArgs>>): Prisma.Prisma__locationsClient<runtime.Types.Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    trip_orders<T extends Prisma.trip_stops$trip_ordersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.trip_stops$trip_ordersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$trip_stop_ordersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface trip_stopsFieldRefs {
    readonly id: Prisma.FieldRef<"trip_stops", 'String'>;
    readonly trip_id: Prisma.FieldRef<"trip_stops", 'String'>;
    readonly location_id: Prisma.FieldRef<"trip_stops", 'String'>;
    readonly stop_order: Prisma.FieldRef<"trip_stops", 'Int'>;
    readonly stop_type: Prisma.FieldRef<"trip_stops", 'String'>;
    readonly created_at: Prisma.FieldRef<"trip_stops", 'DateTime'>;
}
export type trip_stopsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stopsSelect<ExtArgs> | null;
    omit?: Prisma.trip_stopsOmit<ExtArgs> | null;
    include?: Prisma.trip_stopsInclude<ExtArgs> | null;
    where: Prisma.trip_stopsWhereUniqueInput;
};
export type trip_stopsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stopsSelect<ExtArgs> | null;
    omit?: Prisma.trip_stopsOmit<ExtArgs> | null;
    include?: Prisma.trip_stopsInclude<ExtArgs> | null;
    where: Prisma.trip_stopsWhereUniqueInput;
};
export type trip_stopsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stopsSelect<ExtArgs> | null;
    omit?: Prisma.trip_stopsOmit<ExtArgs> | null;
    include?: Prisma.trip_stopsInclude<ExtArgs> | null;
    where?: Prisma.trip_stopsWhereInput;
    orderBy?: Prisma.trip_stopsOrderByWithRelationInput | Prisma.trip_stopsOrderByWithRelationInput[];
    cursor?: Prisma.trip_stopsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Trip_stopsScalarFieldEnum | Prisma.Trip_stopsScalarFieldEnum[];
};
export type trip_stopsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stopsSelect<ExtArgs> | null;
    omit?: Prisma.trip_stopsOmit<ExtArgs> | null;
    include?: Prisma.trip_stopsInclude<ExtArgs> | null;
    where?: Prisma.trip_stopsWhereInput;
    orderBy?: Prisma.trip_stopsOrderByWithRelationInput | Prisma.trip_stopsOrderByWithRelationInput[];
    cursor?: Prisma.trip_stopsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Trip_stopsScalarFieldEnum | Prisma.Trip_stopsScalarFieldEnum[];
};
export type trip_stopsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stopsSelect<ExtArgs> | null;
    omit?: Prisma.trip_stopsOmit<ExtArgs> | null;
    include?: Prisma.trip_stopsInclude<ExtArgs> | null;
    where?: Prisma.trip_stopsWhereInput;
    orderBy?: Prisma.trip_stopsOrderByWithRelationInput | Prisma.trip_stopsOrderByWithRelationInput[];
    cursor?: Prisma.trip_stopsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Trip_stopsScalarFieldEnum | Prisma.Trip_stopsScalarFieldEnum[];
};
export type trip_stopsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stopsSelect<ExtArgs> | null;
    omit?: Prisma.trip_stopsOmit<ExtArgs> | null;
    include?: Prisma.trip_stopsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.trip_stopsCreateInput, Prisma.trip_stopsUncheckedCreateInput>;
};
export type trip_stopsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.trip_stopsCreateManyInput | Prisma.trip_stopsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type trip_stopsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stopsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.trip_stopsOmit<ExtArgs> | null;
    data: Prisma.trip_stopsCreateManyInput | Prisma.trip_stopsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.trip_stopsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type trip_stopsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stopsSelect<ExtArgs> | null;
    omit?: Prisma.trip_stopsOmit<ExtArgs> | null;
    include?: Prisma.trip_stopsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.trip_stopsUpdateInput, Prisma.trip_stopsUncheckedUpdateInput>;
    where: Prisma.trip_stopsWhereUniqueInput;
};
export type trip_stopsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.trip_stopsUpdateManyMutationInput, Prisma.trip_stopsUncheckedUpdateManyInput>;
    where?: Prisma.trip_stopsWhereInput;
    limit?: number;
};
export type trip_stopsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stopsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.trip_stopsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.trip_stopsUpdateManyMutationInput, Prisma.trip_stopsUncheckedUpdateManyInput>;
    where?: Prisma.trip_stopsWhereInput;
    limit?: number;
    include?: Prisma.trip_stopsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type trip_stopsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stopsSelect<ExtArgs> | null;
    omit?: Prisma.trip_stopsOmit<ExtArgs> | null;
    include?: Prisma.trip_stopsInclude<ExtArgs> | null;
    where: Prisma.trip_stopsWhereUniqueInput;
    create: Prisma.XOR<Prisma.trip_stopsCreateInput, Prisma.trip_stopsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.trip_stopsUpdateInput, Prisma.trip_stopsUncheckedUpdateInput>;
};
export type trip_stopsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stopsSelect<ExtArgs> | null;
    omit?: Prisma.trip_stopsOmit<ExtArgs> | null;
    include?: Prisma.trip_stopsInclude<ExtArgs> | null;
    where: Prisma.trip_stopsWhereUniqueInput;
};
export type trip_stopsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.trip_stopsWhereInput;
    limit?: number;
};
export type trip_stops$trip_ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stop_ordersSelect<ExtArgs> | null;
    omit?: Prisma.trip_stop_ordersOmit<ExtArgs> | null;
    include?: Prisma.trip_stop_ordersInclude<ExtArgs> | null;
    where?: Prisma.trip_stop_ordersWhereInput;
    orderBy?: Prisma.trip_stop_ordersOrderByWithRelationInput | Prisma.trip_stop_ordersOrderByWithRelationInput[];
    cursor?: Prisma.trip_stop_ordersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Trip_stop_ordersScalarFieldEnum | Prisma.Trip_stop_ordersScalarFieldEnum[];
};
export type trip_stopsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stopsSelect<ExtArgs> | null;
    omit?: Prisma.trip_stopsOmit<ExtArgs> | null;
    include?: Prisma.trip_stopsInclude<ExtArgs> | null;
};
