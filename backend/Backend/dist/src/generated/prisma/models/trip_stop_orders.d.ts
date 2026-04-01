import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type trip_stop_ordersModel = runtime.Types.Result.DefaultSelection<Prisma.$trip_stop_ordersPayload>;
export type AggregateTrip_stop_orders = {
    _count: Trip_stop_ordersCountAggregateOutputType | null;
    _min: Trip_stop_ordersMinAggregateOutputType | null;
    _max: Trip_stop_ordersMaxAggregateOutputType | null;
};
export type Trip_stop_ordersMinAggregateOutputType = {
    id: string | null;
    trip_stop_id: string | null;
    dispatch_order_id: string | null;
    action: string | null;
    created_at: Date | null;
};
export type Trip_stop_ordersMaxAggregateOutputType = {
    id: string | null;
    trip_stop_id: string | null;
    dispatch_order_id: string | null;
    action: string | null;
    created_at: Date | null;
};
export type Trip_stop_ordersCountAggregateOutputType = {
    id: number;
    trip_stop_id: number;
    dispatch_order_id: number;
    action: number;
    created_at: number;
    _all: number;
};
export type Trip_stop_ordersMinAggregateInputType = {
    id?: true;
    trip_stop_id?: true;
    dispatch_order_id?: true;
    action?: true;
    created_at?: true;
};
export type Trip_stop_ordersMaxAggregateInputType = {
    id?: true;
    trip_stop_id?: true;
    dispatch_order_id?: true;
    action?: true;
    created_at?: true;
};
export type Trip_stop_ordersCountAggregateInputType = {
    id?: true;
    trip_stop_id?: true;
    dispatch_order_id?: true;
    action?: true;
    created_at?: true;
    _all?: true;
};
export type Trip_stop_ordersAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.trip_stop_ordersWhereInput;
    orderBy?: Prisma.trip_stop_ordersOrderByWithRelationInput | Prisma.trip_stop_ordersOrderByWithRelationInput[];
    cursor?: Prisma.trip_stop_ordersWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Trip_stop_ordersCountAggregateInputType;
    _min?: Trip_stop_ordersMinAggregateInputType;
    _max?: Trip_stop_ordersMaxAggregateInputType;
};
export type GetTrip_stop_ordersAggregateType<T extends Trip_stop_ordersAggregateArgs> = {
    [P in keyof T & keyof AggregateTrip_stop_orders]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTrip_stop_orders[P]> : Prisma.GetScalarType<T[P], AggregateTrip_stop_orders[P]>;
};
export type trip_stop_ordersGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.trip_stop_ordersWhereInput;
    orderBy?: Prisma.trip_stop_ordersOrderByWithAggregationInput | Prisma.trip_stop_ordersOrderByWithAggregationInput[];
    by: Prisma.Trip_stop_ordersScalarFieldEnum[] | Prisma.Trip_stop_ordersScalarFieldEnum;
    having?: Prisma.trip_stop_ordersScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Trip_stop_ordersCountAggregateInputType | true;
    _min?: Trip_stop_ordersMinAggregateInputType;
    _max?: Trip_stop_ordersMaxAggregateInputType;
};
export type Trip_stop_ordersGroupByOutputType = {
    id: string;
    trip_stop_id: string;
    dispatch_order_id: string;
    action: string;
    created_at: Date;
    _count: Trip_stop_ordersCountAggregateOutputType | null;
    _min: Trip_stop_ordersMinAggregateOutputType | null;
    _max: Trip_stop_ordersMaxAggregateOutputType | null;
};
export type GetTrip_stop_ordersGroupByPayload<T extends trip_stop_ordersGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Trip_stop_ordersGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Trip_stop_ordersGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Trip_stop_ordersGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Trip_stop_ordersGroupByOutputType[P]>;
}>>;
export type trip_stop_ordersWhereInput = {
    AND?: Prisma.trip_stop_ordersWhereInput | Prisma.trip_stop_ordersWhereInput[];
    OR?: Prisma.trip_stop_ordersWhereInput[];
    NOT?: Prisma.trip_stop_ordersWhereInput | Prisma.trip_stop_ordersWhereInput[];
    id?: Prisma.UuidFilter<"trip_stop_orders"> | string;
    trip_stop_id?: Prisma.UuidFilter<"trip_stop_orders"> | string;
    dispatch_order_id?: Prisma.UuidFilter<"trip_stop_orders"> | string;
    action?: Prisma.StringFilter<"trip_stop_orders"> | string;
    created_at?: Prisma.DateTimeFilter<"trip_stop_orders"> | Date | string;
    trip_stop?: Prisma.XOR<Prisma.Trip_stopsScalarRelationFilter, Prisma.trip_stopsWhereInput>;
    dispatch_order?: Prisma.XOR<Prisma.Dispatch_ordersScalarRelationFilter, Prisma.dispatch_ordersWhereInput>;
};
export type trip_stop_ordersOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    trip_stop_id?: Prisma.SortOrder;
    dispatch_order_id?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    trip_stop?: Prisma.trip_stopsOrderByWithRelationInput;
    dispatch_order?: Prisma.dispatch_ordersOrderByWithRelationInput;
};
export type trip_stop_ordersWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.trip_stop_ordersWhereInput | Prisma.trip_stop_ordersWhereInput[];
    OR?: Prisma.trip_stop_ordersWhereInput[];
    NOT?: Prisma.trip_stop_ordersWhereInput | Prisma.trip_stop_ordersWhereInput[];
    trip_stop_id?: Prisma.UuidFilter<"trip_stop_orders"> | string;
    dispatch_order_id?: Prisma.UuidFilter<"trip_stop_orders"> | string;
    action?: Prisma.StringFilter<"trip_stop_orders"> | string;
    created_at?: Prisma.DateTimeFilter<"trip_stop_orders"> | Date | string;
    trip_stop?: Prisma.XOR<Prisma.Trip_stopsScalarRelationFilter, Prisma.trip_stopsWhereInput>;
    dispatch_order?: Prisma.XOR<Prisma.Dispatch_ordersScalarRelationFilter, Prisma.dispatch_ordersWhereInput>;
}, "id">;
export type trip_stop_ordersOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    trip_stop_id?: Prisma.SortOrder;
    dispatch_order_id?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.trip_stop_ordersCountOrderByAggregateInput;
    _max?: Prisma.trip_stop_ordersMaxOrderByAggregateInput;
    _min?: Prisma.trip_stop_ordersMinOrderByAggregateInput;
};
export type trip_stop_ordersScalarWhereWithAggregatesInput = {
    AND?: Prisma.trip_stop_ordersScalarWhereWithAggregatesInput | Prisma.trip_stop_ordersScalarWhereWithAggregatesInput[];
    OR?: Prisma.trip_stop_ordersScalarWhereWithAggregatesInput[];
    NOT?: Prisma.trip_stop_ordersScalarWhereWithAggregatesInput | Prisma.trip_stop_ordersScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"trip_stop_orders"> | string;
    trip_stop_id?: Prisma.UuidWithAggregatesFilter<"trip_stop_orders"> | string;
    dispatch_order_id?: Prisma.UuidWithAggregatesFilter<"trip_stop_orders"> | string;
    action?: Prisma.StringWithAggregatesFilter<"trip_stop_orders"> | string;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"trip_stop_orders"> | Date | string;
};
export type trip_stop_ordersCreateInput = {
    id?: string;
    action: string;
    created_at?: Date | string;
    trip_stop: Prisma.trip_stopsCreateNestedOneWithoutTrip_ordersInput;
    dispatch_order: Prisma.dispatch_ordersCreateNestedOneWithoutTripStopOrdersInput;
};
export type trip_stop_ordersUncheckedCreateInput = {
    id?: string;
    trip_stop_id: string;
    dispatch_order_id: string;
    action: string;
    created_at?: Date | string;
};
export type trip_stop_ordersUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trip_stop?: Prisma.trip_stopsUpdateOneRequiredWithoutTrip_ordersNestedInput;
    dispatch_order?: Prisma.dispatch_ordersUpdateOneRequiredWithoutTripStopOrdersNestedInput;
};
export type trip_stop_ordersUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trip_stop_id?: Prisma.StringFieldUpdateOperationsInput | string;
    dispatch_order_id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type trip_stop_ordersCreateManyInput = {
    id?: string;
    trip_stop_id: string;
    dispatch_order_id: string;
    action: string;
    created_at?: Date | string;
};
export type trip_stop_ordersUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type trip_stop_ordersUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trip_stop_id?: Prisma.StringFieldUpdateOperationsInput | string;
    dispatch_order_id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type Trip_stop_ordersListRelationFilter = {
    every?: Prisma.trip_stop_ordersWhereInput;
    some?: Prisma.trip_stop_ordersWhereInput;
    none?: Prisma.trip_stop_ordersWhereInput;
};
export type trip_stop_ordersOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type trip_stop_ordersCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    trip_stop_id?: Prisma.SortOrder;
    dispatch_order_id?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type trip_stop_ordersMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    trip_stop_id?: Prisma.SortOrder;
    dispatch_order_id?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type trip_stop_ordersMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    trip_stop_id?: Prisma.SortOrder;
    dispatch_order_id?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type trip_stop_ordersCreateNestedManyWithoutDispatch_orderInput = {
    create?: Prisma.XOR<Prisma.trip_stop_ordersCreateWithoutDispatch_orderInput, Prisma.trip_stop_ordersUncheckedCreateWithoutDispatch_orderInput> | Prisma.trip_stop_ordersCreateWithoutDispatch_orderInput[] | Prisma.trip_stop_ordersUncheckedCreateWithoutDispatch_orderInput[];
    connectOrCreate?: Prisma.trip_stop_ordersCreateOrConnectWithoutDispatch_orderInput | Prisma.trip_stop_ordersCreateOrConnectWithoutDispatch_orderInput[];
    createMany?: Prisma.trip_stop_ordersCreateManyDispatch_orderInputEnvelope;
    connect?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
};
export type trip_stop_ordersUncheckedCreateNestedManyWithoutDispatch_orderInput = {
    create?: Prisma.XOR<Prisma.trip_stop_ordersCreateWithoutDispatch_orderInput, Prisma.trip_stop_ordersUncheckedCreateWithoutDispatch_orderInput> | Prisma.trip_stop_ordersCreateWithoutDispatch_orderInput[] | Prisma.trip_stop_ordersUncheckedCreateWithoutDispatch_orderInput[];
    connectOrCreate?: Prisma.trip_stop_ordersCreateOrConnectWithoutDispatch_orderInput | Prisma.trip_stop_ordersCreateOrConnectWithoutDispatch_orderInput[];
    createMany?: Prisma.trip_stop_ordersCreateManyDispatch_orderInputEnvelope;
    connect?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
};
export type trip_stop_ordersUpdateManyWithoutDispatch_orderNestedInput = {
    create?: Prisma.XOR<Prisma.trip_stop_ordersCreateWithoutDispatch_orderInput, Prisma.trip_stop_ordersUncheckedCreateWithoutDispatch_orderInput> | Prisma.trip_stop_ordersCreateWithoutDispatch_orderInput[] | Prisma.trip_stop_ordersUncheckedCreateWithoutDispatch_orderInput[];
    connectOrCreate?: Prisma.trip_stop_ordersCreateOrConnectWithoutDispatch_orderInput | Prisma.trip_stop_ordersCreateOrConnectWithoutDispatch_orderInput[];
    upsert?: Prisma.trip_stop_ordersUpsertWithWhereUniqueWithoutDispatch_orderInput | Prisma.trip_stop_ordersUpsertWithWhereUniqueWithoutDispatch_orderInput[];
    createMany?: Prisma.trip_stop_ordersCreateManyDispatch_orderInputEnvelope;
    set?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    disconnect?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    delete?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    connect?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    update?: Prisma.trip_stop_ordersUpdateWithWhereUniqueWithoutDispatch_orderInput | Prisma.trip_stop_ordersUpdateWithWhereUniqueWithoutDispatch_orderInput[];
    updateMany?: Prisma.trip_stop_ordersUpdateManyWithWhereWithoutDispatch_orderInput | Prisma.trip_stop_ordersUpdateManyWithWhereWithoutDispatch_orderInput[];
    deleteMany?: Prisma.trip_stop_ordersScalarWhereInput | Prisma.trip_stop_ordersScalarWhereInput[];
};
export type trip_stop_ordersUncheckedUpdateManyWithoutDispatch_orderNestedInput = {
    create?: Prisma.XOR<Prisma.trip_stop_ordersCreateWithoutDispatch_orderInput, Prisma.trip_stop_ordersUncheckedCreateWithoutDispatch_orderInput> | Prisma.trip_stop_ordersCreateWithoutDispatch_orderInput[] | Prisma.trip_stop_ordersUncheckedCreateWithoutDispatch_orderInput[];
    connectOrCreate?: Prisma.trip_stop_ordersCreateOrConnectWithoutDispatch_orderInput | Prisma.trip_stop_ordersCreateOrConnectWithoutDispatch_orderInput[];
    upsert?: Prisma.trip_stop_ordersUpsertWithWhereUniqueWithoutDispatch_orderInput | Prisma.trip_stop_ordersUpsertWithWhereUniqueWithoutDispatch_orderInput[];
    createMany?: Prisma.trip_stop_ordersCreateManyDispatch_orderInputEnvelope;
    set?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    disconnect?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    delete?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    connect?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    update?: Prisma.trip_stop_ordersUpdateWithWhereUniqueWithoutDispatch_orderInput | Prisma.trip_stop_ordersUpdateWithWhereUniqueWithoutDispatch_orderInput[];
    updateMany?: Prisma.trip_stop_ordersUpdateManyWithWhereWithoutDispatch_orderInput | Prisma.trip_stop_ordersUpdateManyWithWhereWithoutDispatch_orderInput[];
    deleteMany?: Prisma.trip_stop_ordersScalarWhereInput | Prisma.trip_stop_ordersScalarWhereInput[];
};
export type trip_stop_ordersCreateNestedManyWithoutTrip_stopInput = {
    create?: Prisma.XOR<Prisma.trip_stop_ordersCreateWithoutTrip_stopInput, Prisma.trip_stop_ordersUncheckedCreateWithoutTrip_stopInput> | Prisma.trip_stop_ordersCreateWithoutTrip_stopInput[] | Prisma.trip_stop_ordersUncheckedCreateWithoutTrip_stopInput[];
    connectOrCreate?: Prisma.trip_stop_ordersCreateOrConnectWithoutTrip_stopInput | Prisma.trip_stop_ordersCreateOrConnectWithoutTrip_stopInput[];
    createMany?: Prisma.trip_stop_ordersCreateManyTrip_stopInputEnvelope;
    connect?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
};
export type trip_stop_ordersUncheckedCreateNestedManyWithoutTrip_stopInput = {
    create?: Prisma.XOR<Prisma.trip_stop_ordersCreateWithoutTrip_stopInput, Prisma.trip_stop_ordersUncheckedCreateWithoutTrip_stopInput> | Prisma.trip_stop_ordersCreateWithoutTrip_stopInput[] | Prisma.trip_stop_ordersUncheckedCreateWithoutTrip_stopInput[];
    connectOrCreate?: Prisma.trip_stop_ordersCreateOrConnectWithoutTrip_stopInput | Prisma.trip_stop_ordersCreateOrConnectWithoutTrip_stopInput[];
    createMany?: Prisma.trip_stop_ordersCreateManyTrip_stopInputEnvelope;
    connect?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
};
export type trip_stop_ordersUpdateManyWithoutTrip_stopNestedInput = {
    create?: Prisma.XOR<Prisma.trip_stop_ordersCreateWithoutTrip_stopInput, Prisma.trip_stop_ordersUncheckedCreateWithoutTrip_stopInput> | Prisma.trip_stop_ordersCreateWithoutTrip_stopInput[] | Prisma.trip_stop_ordersUncheckedCreateWithoutTrip_stopInput[];
    connectOrCreate?: Prisma.trip_stop_ordersCreateOrConnectWithoutTrip_stopInput | Prisma.trip_stop_ordersCreateOrConnectWithoutTrip_stopInput[];
    upsert?: Prisma.trip_stop_ordersUpsertWithWhereUniqueWithoutTrip_stopInput | Prisma.trip_stop_ordersUpsertWithWhereUniqueWithoutTrip_stopInput[];
    createMany?: Prisma.trip_stop_ordersCreateManyTrip_stopInputEnvelope;
    set?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    disconnect?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    delete?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    connect?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    update?: Prisma.trip_stop_ordersUpdateWithWhereUniqueWithoutTrip_stopInput | Prisma.trip_stop_ordersUpdateWithWhereUniqueWithoutTrip_stopInput[];
    updateMany?: Prisma.trip_stop_ordersUpdateManyWithWhereWithoutTrip_stopInput | Prisma.trip_stop_ordersUpdateManyWithWhereWithoutTrip_stopInput[];
    deleteMany?: Prisma.trip_stop_ordersScalarWhereInput | Prisma.trip_stop_ordersScalarWhereInput[];
};
export type trip_stop_ordersUncheckedUpdateManyWithoutTrip_stopNestedInput = {
    create?: Prisma.XOR<Prisma.trip_stop_ordersCreateWithoutTrip_stopInput, Prisma.trip_stop_ordersUncheckedCreateWithoutTrip_stopInput> | Prisma.trip_stop_ordersCreateWithoutTrip_stopInput[] | Prisma.trip_stop_ordersUncheckedCreateWithoutTrip_stopInput[];
    connectOrCreate?: Prisma.trip_stop_ordersCreateOrConnectWithoutTrip_stopInput | Prisma.trip_stop_ordersCreateOrConnectWithoutTrip_stopInput[];
    upsert?: Prisma.trip_stop_ordersUpsertWithWhereUniqueWithoutTrip_stopInput | Prisma.trip_stop_ordersUpsertWithWhereUniqueWithoutTrip_stopInput[];
    createMany?: Prisma.trip_stop_ordersCreateManyTrip_stopInputEnvelope;
    set?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    disconnect?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    delete?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    connect?: Prisma.trip_stop_ordersWhereUniqueInput | Prisma.trip_stop_ordersWhereUniqueInput[];
    update?: Prisma.trip_stop_ordersUpdateWithWhereUniqueWithoutTrip_stopInput | Prisma.trip_stop_ordersUpdateWithWhereUniqueWithoutTrip_stopInput[];
    updateMany?: Prisma.trip_stop_ordersUpdateManyWithWhereWithoutTrip_stopInput | Prisma.trip_stop_ordersUpdateManyWithWhereWithoutTrip_stopInput[];
    deleteMany?: Prisma.trip_stop_ordersScalarWhereInput | Prisma.trip_stop_ordersScalarWhereInput[];
};
export type trip_stop_ordersCreateWithoutDispatch_orderInput = {
    id?: string;
    action: string;
    created_at?: Date | string;
    trip_stop: Prisma.trip_stopsCreateNestedOneWithoutTrip_ordersInput;
};
export type trip_stop_ordersUncheckedCreateWithoutDispatch_orderInput = {
    id?: string;
    trip_stop_id: string;
    action: string;
    created_at?: Date | string;
};
export type trip_stop_ordersCreateOrConnectWithoutDispatch_orderInput = {
    where: Prisma.trip_stop_ordersWhereUniqueInput;
    create: Prisma.XOR<Prisma.trip_stop_ordersCreateWithoutDispatch_orderInput, Prisma.trip_stop_ordersUncheckedCreateWithoutDispatch_orderInput>;
};
export type trip_stop_ordersCreateManyDispatch_orderInputEnvelope = {
    data: Prisma.trip_stop_ordersCreateManyDispatch_orderInput | Prisma.trip_stop_ordersCreateManyDispatch_orderInput[];
    skipDuplicates?: boolean;
};
export type trip_stop_ordersUpsertWithWhereUniqueWithoutDispatch_orderInput = {
    where: Prisma.trip_stop_ordersWhereUniqueInput;
    update: Prisma.XOR<Prisma.trip_stop_ordersUpdateWithoutDispatch_orderInput, Prisma.trip_stop_ordersUncheckedUpdateWithoutDispatch_orderInput>;
    create: Prisma.XOR<Prisma.trip_stop_ordersCreateWithoutDispatch_orderInput, Prisma.trip_stop_ordersUncheckedCreateWithoutDispatch_orderInput>;
};
export type trip_stop_ordersUpdateWithWhereUniqueWithoutDispatch_orderInput = {
    where: Prisma.trip_stop_ordersWhereUniqueInput;
    data: Prisma.XOR<Prisma.trip_stop_ordersUpdateWithoutDispatch_orderInput, Prisma.trip_stop_ordersUncheckedUpdateWithoutDispatch_orderInput>;
};
export type trip_stop_ordersUpdateManyWithWhereWithoutDispatch_orderInput = {
    where: Prisma.trip_stop_ordersScalarWhereInput;
    data: Prisma.XOR<Prisma.trip_stop_ordersUpdateManyMutationInput, Prisma.trip_stop_ordersUncheckedUpdateManyWithoutDispatch_orderInput>;
};
export type trip_stop_ordersScalarWhereInput = {
    AND?: Prisma.trip_stop_ordersScalarWhereInput | Prisma.trip_stop_ordersScalarWhereInput[];
    OR?: Prisma.trip_stop_ordersScalarWhereInput[];
    NOT?: Prisma.trip_stop_ordersScalarWhereInput | Prisma.trip_stop_ordersScalarWhereInput[];
    id?: Prisma.UuidFilter<"trip_stop_orders"> | string;
    trip_stop_id?: Prisma.UuidFilter<"trip_stop_orders"> | string;
    dispatch_order_id?: Prisma.UuidFilter<"trip_stop_orders"> | string;
    action?: Prisma.StringFilter<"trip_stop_orders"> | string;
    created_at?: Prisma.DateTimeFilter<"trip_stop_orders"> | Date | string;
};
export type trip_stop_ordersCreateWithoutTrip_stopInput = {
    id?: string;
    action: string;
    created_at?: Date | string;
    dispatch_order: Prisma.dispatch_ordersCreateNestedOneWithoutTripStopOrdersInput;
};
export type trip_stop_ordersUncheckedCreateWithoutTrip_stopInput = {
    id?: string;
    dispatch_order_id: string;
    action: string;
    created_at?: Date | string;
};
export type trip_stop_ordersCreateOrConnectWithoutTrip_stopInput = {
    where: Prisma.trip_stop_ordersWhereUniqueInput;
    create: Prisma.XOR<Prisma.trip_stop_ordersCreateWithoutTrip_stopInput, Prisma.trip_stop_ordersUncheckedCreateWithoutTrip_stopInput>;
};
export type trip_stop_ordersCreateManyTrip_stopInputEnvelope = {
    data: Prisma.trip_stop_ordersCreateManyTrip_stopInput | Prisma.trip_stop_ordersCreateManyTrip_stopInput[];
    skipDuplicates?: boolean;
};
export type trip_stop_ordersUpsertWithWhereUniqueWithoutTrip_stopInput = {
    where: Prisma.trip_stop_ordersWhereUniqueInput;
    update: Prisma.XOR<Prisma.trip_stop_ordersUpdateWithoutTrip_stopInput, Prisma.trip_stop_ordersUncheckedUpdateWithoutTrip_stopInput>;
    create: Prisma.XOR<Prisma.trip_stop_ordersCreateWithoutTrip_stopInput, Prisma.trip_stop_ordersUncheckedCreateWithoutTrip_stopInput>;
};
export type trip_stop_ordersUpdateWithWhereUniqueWithoutTrip_stopInput = {
    where: Prisma.trip_stop_ordersWhereUniqueInput;
    data: Prisma.XOR<Prisma.trip_stop_ordersUpdateWithoutTrip_stopInput, Prisma.trip_stop_ordersUncheckedUpdateWithoutTrip_stopInput>;
};
export type trip_stop_ordersUpdateManyWithWhereWithoutTrip_stopInput = {
    where: Prisma.trip_stop_ordersScalarWhereInput;
    data: Prisma.XOR<Prisma.trip_stop_ordersUpdateManyMutationInput, Prisma.trip_stop_ordersUncheckedUpdateManyWithoutTrip_stopInput>;
};
export type trip_stop_ordersCreateManyDispatch_orderInput = {
    id?: string;
    trip_stop_id: string;
    action: string;
    created_at?: Date | string;
};
export type trip_stop_ordersUpdateWithoutDispatch_orderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trip_stop?: Prisma.trip_stopsUpdateOneRequiredWithoutTrip_ordersNestedInput;
};
export type trip_stop_ordersUncheckedUpdateWithoutDispatch_orderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trip_stop_id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type trip_stop_ordersUncheckedUpdateManyWithoutDispatch_orderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trip_stop_id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type trip_stop_ordersCreateManyTrip_stopInput = {
    id?: string;
    dispatch_order_id: string;
    action: string;
    created_at?: Date | string;
};
export type trip_stop_ordersUpdateWithoutTrip_stopInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dispatch_order?: Prisma.dispatch_ordersUpdateOneRequiredWithoutTripStopOrdersNestedInput;
};
export type trip_stop_ordersUncheckedUpdateWithoutTrip_stopInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dispatch_order_id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type trip_stop_ordersUncheckedUpdateManyWithoutTrip_stopInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dispatch_order_id?: Prisma.StringFieldUpdateOperationsInput | string;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type trip_stop_ordersSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    trip_stop_id?: boolean;
    dispatch_order_id?: boolean;
    action?: boolean;
    created_at?: boolean;
    trip_stop?: boolean | Prisma.trip_stopsDefaultArgs<ExtArgs>;
    dispatch_order?: boolean | Prisma.dispatch_ordersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["trip_stop_orders"]>;
export type trip_stop_ordersSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    trip_stop_id?: boolean;
    dispatch_order_id?: boolean;
    action?: boolean;
    created_at?: boolean;
    trip_stop?: boolean | Prisma.trip_stopsDefaultArgs<ExtArgs>;
    dispatch_order?: boolean | Prisma.dispatch_ordersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["trip_stop_orders"]>;
export type trip_stop_ordersSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    trip_stop_id?: boolean;
    dispatch_order_id?: boolean;
    action?: boolean;
    created_at?: boolean;
    trip_stop?: boolean | Prisma.trip_stopsDefaultArgs<ExtArgs>;
    dispatch_order?: boolean | Prisma.dispatch_ordersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["trip_stop_orders"]>;
export type trip_stop_ordersSelectScalar = {
    id?: boolean;
    trip_stop_id?: boolean;
    dispatch_order_id?: boolean;
    action?: boolean;
    created_at?: boolean;
};
export type trip_stop_ordersOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "trip_stop_id" | "dispatch_order_id" | "action" | "created_at", ExtArgs["result"]["trip_stop_orders"]>;
export type trip_stop_ordersInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trip_stop?: boolean | Prisma.trip_stopsDefaultArgs<ExtArgs>;
    dispatch_order?: boolean | Prisma.dispatch_ordersDefaultArgs<ExtArgs>;
};
export type trip_stop_ordersIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trip_stop?: boolean | Prisma.trip_stopsDefaultArgs<ExtArgs>;
    dispatch_order?: boolean | Prisma.dispatch_ordersDefaultArgs<ExtArgs>;
};
export type trip_stop_ordersIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trip_stop?: boolean | Prisma.trip_stopsDefaultArgs<ExtArgs>;
    dispatch_order?: boolean | Prisma.dispatch_ordersDefaultArgs<ExtArgs>;
};
export type $trip_stop_ordersPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "trip_stop_orders";
    objects: {
        trip_stop: Prisma.$trip_stopsPayload<ExtArgs>;
        dispatch_order: Prisma.$dispatch_ordersPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        trip_stop_id: string;
        dispatch_order_id: string;
        action: string;
        created_at: Date;
    }, ExtArgs["result"]["trip_stop_orders"]>;
    composites: {};
};
export type trip_stop_ordersGetPayload<S extends boolean | null | undefined | trip_stop_ordersDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$trip_stop_ordersPayload, S>;
export type trip_stop_ordersCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<trip_stop_ordersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Trip_stop_ordersCountAggregateInputType | true;
};
export interface trip_stop_ordersDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['trip_stop_orders'];
        meta: {
            name: 'trip_stop_orders';
        };
    };
    findUnique<T extends trip_stop_ordersFindUniqueArgs>(args: Prisma.SelectSubset<T, trip_stop_ordersFindUniqueArgs<ExtArgs>>): Prisma.Prisma__trip_stop_ordersClient<runtime.Types.Result.GetResult<Prisma.$trip_stop_ordersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends trip_stop_ordersFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, trip_stop_ordersFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__trip_stop_ordersClient<runtime.Types.Result.GetResult<Prisma.$trip_stop_ordersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends trip_stop_ordersFindFirstArgs>(args?: Prisma.SelectSubset<T, trip_stop_ordersFindFirstArgs<ExtArgs>>): Prisma.Prisma__trip_stop_ordersClient<runtime.Types.Result.GetResult<Prisma.$trip_stop_ordersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends trip_stop_ordersFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, trip_stop_ordersFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__trip_stop_ordersClient<runtime.Types.Result.GetResult<Prisma.$trip_stop_ordersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends trip_stop_ordersFindManyArgs>(args?: Prisma.SelectSubset<T, trip_stop_ordersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$trip_stop_ordersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends trip_stop_ordersCreateArgs>(args: Prisma.SelectSubset<T, trip_stop_ordersCreateArgs<ExtArgs>>): Prisma.Prisma__trip_stop_ordersClient<runtime.Types.Result.GetResult<Prisma.$trip_stop_ordersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends trip_stop_ordersCreateManyArgs>(args?: Prisma.SelectSubset<T, trip_stop_ordersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends trip_stop_ordersCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, trip_stop_ordersCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$trip_stop_ordersPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends trip_stop_ordersDeleteArgs>(args: Prisma.SelectSubset<T, trip_stop_ordersDeleteArgs<ExtArgs>>): Prisma.Prisma__trip_stop_ordersClient<runtime.Types.Result.GetResult<Prisma.$trip_stop_ordersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends trip_stop_ordersUpdateArgs>(args: Prisma.SelectSubset<T, trip_stop_ordersUpdateArgs<ExtArgs>>): Prisma.Prisma__trip_stop_ordersClient<runtime.Types.Result.GetResult<Prisma.$trip_stop_ordersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends trip_stop_ordersDeleteManyArgs>(args?: Prisma.SelectSubset<T, trip_stop_ordersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends trip_stop_ordersUpdateManyArgs>(args: Prisma.SelectSubset<T, trip_stop_ordersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends trip_stop_ordersUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, trip_stop_ordersUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$trip_stop_ordersPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends trip_stop_ordersUpsertArgs>(args: Prisma.SelectSubset<T, trip_stop_ordersUpsertArgs<ExtArgs>>): Prisma.Prisma__trip_stop_ordersClient<runtime.Types.Result.GetResult<Prisma.$trip_stop_ordersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends trip_stop_ordersCountArgs>(args?: Prisma.Subset<T, trip_stop_ordersCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Trip_stop_ordersCountAggregateOutputType> : number>;
    aggregate<T extends Trip_stop_ordersAggregateArgs>(args: Prisma.Subset<T, Trip_stop_ordersAggregateArgs>): Prisma.PrismaPromise<GetTrip_stop_ordersAggregateType<T>>;
    groupBy<T extends trip_stop_ordersGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: trip_stop_ordersGroupByArgs['orderBy'];
    } : {
        orderBy?: trip_stop_ordersGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, trip_stop_ordersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrip_stop_ordersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: trip_stop_ordersFieldRefs;
}
export interface Prisma__trip_stop_ordersClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    trip_stop<T extends Prisma.trip_stopsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.trip_stopsDefaultArgs<ExtArgs>>): Prisma.Prisma__trip_stopsClient<runtime.Types.Result.GetResult<Prisma.$trip_stopsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    dispatch_order<T extends Prisma.dispatch_ordersDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.dispatch_ordersDefaultArgs<ExtArgs>>): Prisma.Prisma__dispatch_ordersClient<runtime.Types.Result.GetResult<Prisma.$dispatch_ordersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface trip_stop_ordersFieldRefs {
    readonly id: Prisma.FieldRef<"trip_stop_orders", 'String'>;
    readonly trip_stop_id: Prisma.FieldRef<"trip_stop_orders", 'String'>;
    readonly dispatch_order_id: Prisma.FieldRef<"trip_stop_orders", 'String'>;
    readonly action: Prisma.FieldRef<"trip_stop_orders", 'String'>;
    readonly created_at: Prisma.FieldRef<"trip_stop_orders", 'DateTime'>;
}
export type trip_stop_ordersFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stop_ordersSelect<ExtArgs> | null;
    omit?: Prisma.trip_stop_ordersOmit<ExtArgs> | null;
    include?: Prisma.trip_stop_ordersInclude<ExtArgs> | null;
    where: Prisma.trip_stop_ordersWhereUniqueInput;
};
export type trip_stop_ordersFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stop_ordersSelect<ExtArgs> | null;
    omit?: Prisma.trip_stop_ordersOmit<ExtArgs> | null;
    include?: Prisma.trip_stop_ordersInclude<ExtArgs> | null;
    where: Prisma.trip_stop_ordersWhereUniqueInput;
};
export type trip_stop_ordersFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type trip_stop_ordersFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type trip_stop_ordersFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type trip_stop_ordersCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stop_ordersSelect<ExtArgs> | null;
    omit?: Prisma.trip_stop_ordersOmit<ExtArgs> | null;
    include?: Prisma.trip_stop_ordersInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.trip_stop_ordersCreateInput, Prisma.trip_stop_ordersUncheckedCreateInput>;
};
export type trip_stop_ordersCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.trip_stop_ordersCreateManyInput | Prisma.trip_stop_ordersCreateManyInput[];
    skipDuplicates?: boolean;
};
export type trip_stop_ordersCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stop_ordersSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.trip_stop_ordersOmit<ExtArgs> | null;
    data: Prisma.trip_stop_ordersCreateManyInput | Prisma.trip_stop_ordersCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.trip_stop_ordersIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type trip_stop_ordersUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stop_ordersSelect<ExtArgs> | null;
    omit?: Prisma.trip_stop_ordersOmit<ExtArgs> | null;
    include?: Prisma.trip_stop_ordersInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.trip_stop_ordersUpdateInput, Prisma.trip_stop_ordersUncheckedUpdateInput>;
    where: Prisma.trip_stop_ordersWhereUniqueInput;
};
export type trip_stop_ordersUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.trip_stop_ordersUpdateManyMutationInput, Prisma.trip_stop_ordersUncheckedUpdateManyInput>;
    where?: Prisma.trip_stop_ordersWhereInput;
    limit?: number;
};
export type trip_stop_ordersUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stop_ordersSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.trip_stop_ordersOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.trip_stop_ordersUpdateManyMutationInput, Prisma.trip_stop_ordersUncheckedUpdateManyInput>;
    where?: Prisma.trip_stop_ordersWhereInput;
    limit?: number;
    include?: Prisma.trip_stop_ordersIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type trip_stop_ordersUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stop_ordersSelect<ExtArgs> | null;
    omit?: Prisma.trip_stop_ordersOmit<ExtArgs> | null;
    include?: Prisma.trip_stop_ordersInclude<ExtArgs> | null;
    where: Prisma.trip_stop_ordersWhereUniqueInput;
    create: Prisma.XOR<Prisma.trip_stop_ordersCreateInput, Prisma.trip_stop_ordersUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.trip_stop_ordersUpdateInput, Prisma.trip_stop_ordersUncheckedUpdateInput>;
};
export type trip_stop_ordersDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stop_ordersSelect<ExtArgs> | null;
    omit?: Prisma.trip_stop_ordersOmit<ExtArgs> | null;
    include?: Prisma.trip_stop_ordersInclude<ExtArgs> | null;
    where: Prisma.trip_stop_ordersWhereUniqueInput;
};
export type trip_stop_ordersDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.trip_stop_ordersWhereInput;
    limit?: number;
};
export type trip_stop_ordersDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_stop_ordersSelect<ExtArgs> | null;
    omit?: Prisma.trip_stop_ordersOmit<ExtArgs> | null;
    include?: Prisma.trip_stop_ordersInclude<ExtArgs> | null;
};
