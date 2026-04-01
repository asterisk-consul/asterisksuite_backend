import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type picking_resultsModel = runtime.Types.Result.DefaultSelection<Prisma.$picking_resultsPayload>;
export type AggregatePicking_results = {
    _count: Picking_resultsCountAggregateOutputType | null;
    _min: Picking_resultsMinAggregateOutputType | null;
    _max: Picking_resultsMaxAggregateOutputType | null;
};
export type Picking_resultsMinAggregateOutputType = {
    id: string | null;
    picking_order_id: string | null;
    pallet_id: string | null;
};
export type Picking_resultsMaxAggregateOutputType = {
    id: string | null;
    picking_order_id: string | null;
    pallet_id: string | null;
};
export type Picking_resultsCountAggregateOutputType = {
    id: number;
    picking_order_id: number;
    pallet_id: number;
    _all: number;
};
export type Picking_resultsMinAggregateInputType = {
    id?: true;
    picking_order_id?: true;
    pallet_id?: true;
};
export type Picking_resultsMaxAggregateInputType = {
    id?: true;
    picking_order_id?: true;
    pallet_id?: true;
};
export type Picking_resultsCountAggregateInputType = {
    id?: true;
    picking_order_id?: true;
    pallet_id?: true;
    _all?: true;
};
export type Picking_resultsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.picking_resultsWhereInput;
    orderBy?: Prisma.picking_resultsOrderByWithRelationInput | Prisma.picking_resultsOrderByWithRelationInput[];
    cursor?: Prisma.picking_resultsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Picking_resultsCountAggregateInputType;
    _min?: Picking_resultsMinAggregateInputType;
    _max?: Picking_resultsMaxAggregateInputType;
};
export type GetPicking_resultsAggregateType<T extends Picking_resultsAggregateArgs> = {
    [P in keyof T & keyof AggregatePicking_results]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePicking_results[P]> : Prisma.GetScalarType<T[P], AggregatePicking_results[P]>;
};
export type picking_resultsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.picking_resultsWhereInput;
    orderBy?: Prisma.picking_resultsOrderByWithAggregationInput | Prisma.picking_resultsOrderByWithAggregationInput[];
    by: Prisma.Picking_resultsScalarFieldEnum[] | Prisma.Picking_resultsScalarFieldEnum;
    having?: Prisma.picking_resultsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Picking_resultsCountAggregateInputType | true;
    _min?: Picking_resultsMinAggregateInputType;
    _max?: Picking_resultsMaxAggregateInputType;
};
export type Picking_resultsGroupByOutputType = {
    id: string;
    picking_order_id: string;
    pallet_id: string;
    _count: Picking_resultsCountAggregateOutputType | null;
    _min: Picking_resultsMinAggregateOutputType | null;
    _max: Picking_resultsMaxAggregateOutputType | null;
};
export type GetPicking_resultsGroupByPayload<T extends picking_resultsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Picking_resultsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Picking_resultsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Picking_resultsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Picking_resultsGroupByOutputType[P]>;
}>>;
export type picking_resultsWhereInput = {
    AND?: Prisma.picking_resultsWhereInput | Prisma.picking_resultsWhereInput[];
    OR?: Prisma.picking_resultsWhereInput[];
    NOT?: Prisma.picking_resultsWhereInput | Prisma.picking_resultsWhereInput[];
    id?: Prisma.UuidFilter<"picking_results"> | string;
    picking_order_id?: Prisma.UuidFilter<"picking_results"> | string;
    pallet_id?: Prisma.UuidFilter<"picking_results"> | string;
    pallets?: Prisma.XOR<Prisma.PalletsScalarRelationFilter, Prisma.palletsWhereInput>;
    picking_orders?: Prisma.XOR<Prisma.Picking_ordersScalarRelationFilter, Prisma.picking_ordersWhereInput>;
};
export type picking_resultsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    picking_order_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    pallets?: Prisma.palletsOrderByWithRelationInput;
    picking_orders?: Prisma.picking_ordersOrderByWithRelationInput;
};
export type picking_resultsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.picking_resultsWhereInput | Prisma.picking_resultsWhereInput[];
    OR?: Prisma.picking_resultsWhereInput[];
    NOT?: Prisma.picking_resultsWhereInput | Prisma.picking_resultsWhereInput[];
    picking_order_id?: Prisma.UuidFilter<"picking_results"> | string;
    pallet_id?: Prisma.UuidFilter<"picking_results"> | string;
    pallets?: Prisma.XOR<Prisma.PalletsScalarRelationFilter, Prisma.palletsWhereInput>;
    picking_orders?: Prisma.XOR<Prisma.Picking_ordersScalarRelationFilter, Prisma.picking_ordersWhereInput>;
}, "id">;
export type picking_resultsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    picking_order_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    _count?: Prisma.picking_resultsCountOrderByAggregateInput;
    _max?: Prisma.picking_resultsMaxOrderByAggregateInput;
    _min?: Prisma.picking_resultsMinOrderByAggregateInput;
};
export type picking_resultsScalarWhereWithAggregatesInput = {
    AND?: Prisma.picking_resultsScalarWhereWithAggregatesInput | Prisma.picking_resultsScalarWhereWithAggregatesInput[];
    OR?: Prisma.picking_resultsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.picking_resultsScalarWhereWithAggregatesInput | Prisma.picking_resultsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"picking_results"> | string;
    picking_order_id?: Prisma.UuidWithAggregatesFilter<"picking_results"> | string;
    pallet_id?: Prisma.UuidWithAggregatesFilter<"picking_results"> | string;
};
export type picking_resultsCreateInput = {
    id?: string;
    pallets: Prisma.palletsCreateNestedOneWithoutPicking_resultsInput;
    picking_orders: Prisma.picking_ordersCreateNestedOneWithoutPicking_resultsInput;
};
export type picking_resultsUncheckedCreateInput = {
    id?: string;
    picking_order_id: string;
    pallet_id: string;
};
export type picking_resultsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallets?: Prisma.palletsUpdateOneRequiredWithoutPicking_resultsNestedInput;
    picking_orders?: Prisma.picking_ordersUpdateOneRequiredWithoutPicking_resultsNestedInput;
};
export type picking_resultsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    picking_order_id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type picking_resultsCreateManyInput = {
    id?: string;
    picking_order_id: string;
    pallet_id: string;
};
export type picking_resultsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type picking_resultsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    picking_order_id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type Picking_resultsListRelationFilter = {
    every?: Prisma.picking_resultsWhereInput;
    some?: Prisma.picking_resultsWhereInput;
    none?: Prisma.picking_resultsWhereInput;
};
export type picking_resultsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type picking_resultsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    picking_order_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
};
export type picking_resultsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    picking_order_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
};
export type picking_resultsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    picking_order_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
};
export type picking_resultsCreateNestedManyWithoutPalletsInput = {
    create?: Prisma.XOR<Prisma.picking_resultsCreateWithoutPalletsInput, Prisma.picking_resultsUncheckedCreateWithoutPalletsInput> | Prisma.picking_resultsCreateWithoutPalletsInput[] | Prisma.picking_resultsUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.picking_resultsCreateOrConnectWithoutPalletsInput | Prisma.picking_resultsCreateOrConnectWithoutPalletsInput[];
    createMany?: Prisma.picking_resultsCreateManyPalletsInputEnvelope;
    connect?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
};
export type picking_resultsUncheckedCreateNestedManyWithoutPalletsInput = {
    create?: Prisma.XOR<Prisma.picking_resultsCreateWithoutPalletsInput, Prisma.picking_resultsUncheckedCreateWithoutPalletsInput> | Prisma.picking_resultsCreateWithoutPalletsInput[] | Prisma.picking_resultsUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.picking_resultsCreateOrConnectWithoutPalletsInput | Prisma.picking_resultsCreateOrConnectWithoutPalletsInput[];
    createMany?: Prisma.picking_resultsCreateManyPalletsInputEnvelope;
    connect?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
};
export type picking_resultsUpdateManyWithoutPalletsNestedInput = {
    create?: Prisma.XOR<Prisma.picking_resultsCreateWithoutPalletsInput, Prisma.picking_resultsUncheckedCreateWithoutPalletsInput> | Prisma.picking_resultsCreateWithoutPalletsInput[] | Prisma.picking_resultsUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.picking_resultsCreateOrConnectWithoutPalletsInput | Prisma.picking_resultsCreateOrConnectWithoutPalletsInput[];
    upsert?: Prisma.picking_resultsUpsertWithWhereUniqueWithoutPalletsInput | Prisma.picking_resultsUpsertWithWhereUniqueWithoutPalletsInput[];
    createMany?: Prisma.picking_resultsCreateManyPalletsInputEnvelope;
    set?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    disconnect?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    delete?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    connect?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    update?: Prisma.picking_resultsUpdateWithWhereUniqueWithoutPalletsInput | Prisma.picking_resultsUpdateWithWhereUniqueWithoutPalletsInput[];
    updateMany?: Prisma.picking_resultsUpdateManyWithWhereWithoutPalletsInput | Prisma.picking_resultsUpdateManyWithWhereWithoutPalletsInput[];
    deleteMany?: Prisma.picking_resultsScalarWhereInput | Prisma.picking_resultsScalarWhereInput[];
};
export type picking_resultsUncheckedUpdateManyWithoutPalletsNestedInput = {
    create?: Prisma.XOR<Prisma.picking_resultsCreateWithoutPalletsInput, Prisma.picking_resultsUncheckedCreateWithoutPalletsInput> | Prisma.picking_resultsCreateWithoutPalletsInput[] | Prisma.picking_resultsUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.picking_resultsCreateOrConnectWithoutPalletsInput | Prisma.picking_resultsCreateOrConnectWithoutPalletsInput[];
    upsert?: Prisma.picking_resultsUpsertWithWhereUniqueWithoutPalletsInput | Prisma.picking_resultsUpsertWithWhereUniqueWithoutPalletsInput[];
    createMany?: Prisma.picking_resultsCreateManyPalletsInputEnvelope;
    set?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    disconnect?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    delete?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    connect?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    update?: Prisma.picking_resultsUpdateWithWhereUniqueWithoutPalletsInput | Prisma.picking_resultsUpdateWithWhereUniqueWithoutPalletsInput[];
    updateMany?: Prisma.picking_resultsUpdateManyWithWhereWithoutPalletsInput | Prisma.picking_resultsUpdateManyWithWhereWithoutPalletsInput[];
    deleteMany?: Prisma.picking_resultsScalarWhereInput | Prisma.picking_resultsScalarWhereInput[];
};
export type picking_resultsCreateNestedManyWithoutPicking_ordersInput = {
    create?: Prisma.XOR<Prisma.picking_resultsCreateWithoutPicking_ordersInput, Prisma.picking_resultsUncheckedCreateWithoutPicking_ordersInput> | Prisma.picking_resultsCreateWithoutPicking_ordersInput[] | Prisma.picking_resultsUncheckedCreateWithoutPicking_ordersInput[];
    connectOrCreate?: Prisma.picking_resultsCreateOrConnectWithoutPicking_ordersInput | Prisma.picking_resultsCreateOrConnectWithoutPicking_ordersInput[];
    createMany?: Prisma.picking_resultsCreateManyPicking_ordersInputEnvelope;
    connect?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
};
export type picking_resultsUncheckedCreateNestedManyWithoutPicking_ordersInput = {
    create?: Prisma.XOR<Prisma.picking_resultsCreateWithoutPicking_ordersInput, Prisma.picking_resultsUncheckedCreateWithoutPicking_ordersInput> | Prisma.picking_resultsCreateWithoutPicking_ordersInput[] | Prisma.picking_resultsUncheckedCreateWithoutPicking_ordersInput[];
    connectOrCreate?: Prisma.picking_resultsCreateOrConnectWithoutPicking_ordersInput | Prisma.picking_resultsCreateOrConnectWithoutPicking_ordersInput[];
    createMany?: Prisma.picking_resultsCreateManyPicking_ordersInputEnvelope;
    connect?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
};
export type picking_resultsUpdateManyWithoutPicking_ordersNestedInput = {
    create?: Prisma.XOR<Prisma.picking_resultsCreateWithoutPicking_ordersInput, Prisma.picking_resultsUncheckedCreateWithoutPicking_ordersInput> | Prisma.picking_resultsCreateWithoutPicking_ordersInput[] | Prisma.picking_resultsUncheckedCreateWithoutPicking_ordersInput[];
    connectOrCreate?: Prisma.picking_resultsCreateOrConnectWithoutPicking_ordersInput | Prisma.picking_resultsCreateOrConnectWithoutPicking_ordersInput[];
    upsert?: Prisma.picking_resultsUpsertWithWhereUniqueWithoutPicking_ordersInput | Prisma.picking_resultsUpsertWithWhereUniqueWithoutPicking_ordersInput[];
    createMany?: Prisma.picking_resultsCreateManyPicking_ordersInputEnvelope;
    set?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    disconnect?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    delete?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    connect?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    update?: Prisma.picking_resultsUpdateWithWhereUniqueWithoutPicking_ordersInput | Prisma.picking_resultsUpdateWithWhereUniqueWithoutPicking_ordersInput[];
    updateMany?: Prisma.picking_resultsUpdateManyWithWhereWithoutPicking_ordersInput | Prisma.picking_resultsUpdateManyWithWhereWithoutPicking_ordersInput[];
    deleteMany?: Prisma.picking_resultsScalarWhereInput | Prisma.picking_resultsScalarWhereInput[];
};
export type picking_resultsUncheckedUpdateManyWithoutPicking_ordersNestedInput = {
    create?: Prisma.XOR<Prisma.picking_resultsCreateWithoutPicking_ordersInput, Prisma.picking_resultsUncheckedCreateWithoutPicking_ordersInput> | Prisma.picking_resultsCreateWithoutPicking_ordersInput[] | Prisma.picking_resultsUncheckedCreateWithoutPicking_ordersInput[];
    connectOrCreate?: Prisma.picking_resultsCreateOrConnectWithoutPicking_ordersInput | Prisma.picking_resultsCreateOrConnectWithoutPicking_ordersInput[];
    upsert?: Prisma.picking_resultsUpsertWithWhereUniqueWithoutPicking_ordersInput | Prisma.picking_resultsUpsertWithWhereUniqueWithoutPicking_ordersInput[];
    createMany?: Prisma.picking_resultsCreateManyPicking_ordersInputEnvelope;
    set?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    disconnect?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    delete?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    connect?: Prisma.picking_resultsWhereUniqueInput | Prisma.picking_resultsWhereUniqueInput[];
    update?: Prisma.picking_resultsUpdateWithWhereUniqueWithoutPicking_ordersInput | Prisma.picking_resultsUpdateWithWhereUniqueWithoutPicking_ordersInput[];
    updateMany?: Prisma.picking_resultsUpdateManyWithWhereWithoutPicking_ordersInput | Prisma.picking_resultsUpdateManyWithWhereWithoutPicking_ordersInput[];
    deleteMany?: Prisma.picking_resultsScalarWhereInput | Prisma.picking_resultsScalarWhereInput[];
};
export type picking_resultsCreateWithoutPalletsInput = {
    id?: string;
    picking_orders: Prisma.picking_ordersCreateNestedOneWithoutPicking_resultsInput;
};
export type picking_resultsUncheckedCreateWithoutPalletsInput = {
    id?: string;
    picking_order_id: string;
};
export type picking_resultsCreateOrConnectWithoutPalletsInput = {
    where: Prisma.picking_resultsWhereUniqueInput;
    create: Prisma.XOR<Prisma.picking_resultsCreateWithoutPalletsInput, Prisma.picking_resultsUncheckedCreateWithoutPalletsInput>;
};
export type picking_resultsCreateManyPalletsInputEnvelope = {
    data: Prisma.picking_resultsCreateManyPalletsInput | Prisma.picking_resultsCreateManyPalletsInput[];
    skipDuplicates?: boolean;
};
export type picking_resultsUpsertWithWhereUniqueWithoutPalletsInput = {
    where: Prisma.picking_resultsWhereUniqueInput;
    update: Prisma.XOR<Prisma.picking_resultsUpdateWithoutPalletsInput, Prisma.picking_resultsUncheckedUpdateWithoutPalletsInput>;
    create: Prisma.XOR<Prisma.picking_resultsCreateWithoutPalletsInput, Prisma.picking_resultsUncheckedCreateWithoutPalletsInput>;
};
export type picking_resultsUpdateWithWhereUniqueWithoutPalletsInput = {
    where: Prisma.picking_resultsWhereUniqueInput;
    data: Prisma.XOR<Prisma.picking_resultsUpdateWithoutPalletsInput, Prisma.picking_resultsUncheckedUpdateWithoutPalletsInput>;
};
export type picking_resultsUpdateManyWithWhereWithoutPalletsInput = {
    where: Prisma.picking_resultsScalarWhereInput;
    data: Prisma.XOR<Prisma.picking_resultsUpdateManyMutationInput, Prisma.picking_resultsUncheckedUpdateManyWithoutPalletsInput>;
};
export type picking_resultsScalarWhereInput = {
    AND?: Prisma.picking_resultsScalarWhereInput | Prisma.picking_resultsScalarWhereInput[];
    OR?: Prisma.picking_resultsScalarWhereInput[];
    NOT?: Prisma.picking_resultsScalarWhereInput | Prisma.picking_resultsScalarWhereInput[];
    id?: Prisma.UuidFilter<"picking_results"> | string;
    picking_order_id?: Prisma.UuidFilter<"picking_results"> | string;
    pallet_id?: Prisma.UuidFilter<"picking_results"> | string;
};
export type picking_resultsCreateWithoutPicking_ordersInput = {
    id?: string;
    pallets: Prisma.palletsCreateNestedOneWithoutPicking_resultsInput;
};
export type picking_resultsUncheckedCreateWithoutPicking_ordersInput = {
    id?: string;
    pallet_id: string;
};
export type picking_resultsCreateOrConnectWithoutPicking_ordersInput = {
    where: Prisma.picking_resultsWhereUniqueInput;
    create: Prisma.XOR<Prisma.picking_resultsCreateWithoutPicking_ordersInput, Prisma.picking_resultsUncheckedCreateWithoutPicking_ordersInput>;
};
export type picking_resultsCreateManyPicking_ordersInputEnvelope = {
    data: Prisma.picking_resultsCreateManyPicking_ordersInput | Prisma.picking_resultsCreateManyPicking_ordersInput[];
    skipDuplicates?: boolean;
};
export type picking_resultsUpsertWithWhereUniqueWithoutPicking_ordersInput = {
    where: Prisma.picking_resultsWhereUniqueInput;
    update: Prisma.XOR<Prisma.picking_resultsUpdateWithoutPicking_ordersInput, Prisma.picking_resultsUncheckedUpdateWithoutPicking_ordersInput>;
    create: Prisma.XOR<Prisma.picking_resultsCreateWithoutPicking_ordersInput, Prisma.picking_resultsUncheckedCreateWithoutPicking_ordersInput>;
};
export type picking_resultsUpdateWithWhereUniqueWithoutPicking_ordersInput = {
    where: Prisma.picking_resultsWhereUniqueInput;
    data: Prisma.XOR<Prisma.picking_resultsUpdateWithoutPicking_ordersInput, Prisma.picking_resultsUncheckedUpdateWithoutPicking_ordersInput>;
};
export type picking_resultsUpdateManyWithWhereWithoutPicking_ordersInput = {
    where: Prisma.picking_resultsScalarWhereInput;
    data: Prisma.XOR<Prisma.picking_resultsUpdateManyMutationInput, Prisma.picking_resultsUncheckedUpdateManyWithoutPicking_ordersInput>;
};
export type picking_resultsCreateManyPalletsInput = {
    id?: string;
    picking_order_id: string;
};
export type picking_resultsUpdateWithoutPalletsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    picking_orders?: Prisma.picking_ordersUpdateOneRequiredWithoutPicking_resultsNestedInput;
};
export type picking_resultsUncheckedUpdateWithoutPalletsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    picking_order_id?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type picking_resultsUncheckedUpdateManyWithoutPalletsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    picking_order_id?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type picking_resultsCreateManyPicking_ordersInput = {
    id?: string;
    pallet_id: string;
};
export type picking_resultsUpdateWithoutPicking_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallets?: Prisma.palletsUpdateOneRequiredWithoutPicking_resultsNestedInput;
};
export type picking_resultsUncheckedUpdateWithoutPicking_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type picking_resultsUncheckedUpdateManyWithoutPicking_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type picking_resultsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    picking_order_id?: boolean;
    pallet_id?: boolean;
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    picking_orders?: boolean | Prisma.picking_ordersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["picking_results"]>;
export type picking_resultsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    picking_order_id?: boolean;
    pallet_id?: boolean;
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    picking_orders?: boolean | Prisma.picking_ordersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["picking_results"]>;
export type picking_resultsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    picking_order_id?: boolean;
    pallet_id?: boolean;
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    picking_orders?: boolean | Prisma.picking_ordersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["picking_results"]>;
export type picking_resultsSelectScalar = {
    id?: boolean;
    picking_order_id?: boolean;
    pallet_id?: boolean;
};
export type picking_resultsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "picking_order_id" | "pallet_id", ExtArgs["result"]["picking_results"]>;
export type picking_resultsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    picking_orders?: boolean | Prisma.picking_ordersDefaultArgs<ExtArgs>;
};
export type picking_resultsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    picking_orders?: boolean | Prisma.picking_ordersDefaultArgs<ExtArgs>;
};
export type picking_resultsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    picking_orders?: boolean | Prisma.picking_ordersDefaultArgs<ExtArgs>;
};
export type $picking_resultsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "picking_results";
    objects: {
        pallets: Prisma.$palletsPayload<ExtArgs>;
        picking_orders: Prisma.$picking_ordersPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        picking_order_id: string;
        pallet_id: string;
    }, ExtArgs["result"]["picking_results"]>;
    composites: {};
};
export type picking_resultsGetPayload<S extends boolean | null | undefined | picking_resultsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$picking_resultsPayload, S>;
export type picking_resultsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<picking_resultsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Picking_resultsCountAggregateInputType | true;
};
export interface picking_resultsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['picking_results'];
        meta: {
            name: 'picking_results';
        };
    };
    findUnique<T extends picking_resultsFindUniqueArgs>(args: Prisma.SelectSubset<T, picking_resultsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__picking_resultsClient<runtime.Types.Result.GetResult<Prisma.$picking_resultsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends picking_resultsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, picking_resultsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__picking_resultsClient<runtime.Types.Result.GetResult<Prisma.$picking_resultsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends picking_resultsFindFirstArgs>(args?: Prisma.SelectSubset<T, picking_resultsFindFirstArgs<ExtArgs>>): Prisma.Prisma__picking_resultsClient<runtime.Types.Result.GetResult<Prisma.$picking_resultsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends picking_resultsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, picking_resultsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__picking_resultsClient<runtime.Types.Result.GetResult<Prisma.$picking_resultsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends picking_resultsFindManyArgs>(args?: Prisma.SelectSubset<T, picking_resultsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$picking_resultsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends picking_resultsCreateArgs>(args: Prisma.SelectSubset<T, picking_resultsCreateArgs<ExtArgs>>): Prisma.Prisma__picking_resultsClient<runtime.Types.Result.GetResult<Prisma.$picking_resultsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends picking_resultsCreateManyArgs>(args?: Prisma.SelectSubset<T, picking_resultsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends picking_resultsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, picking_resultsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$picking_resultsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends picking_resultsDeleteArgs>(args: Prisma.SelectSubset<T, picking_resultsDeleteArgs<ExtArgs>>): Prisma.Prisma__picking_resultsClient<runtime.Types.Result.GetResult<Prisma.$picking_resultsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends picking_resultsUpdateArgs>(args: Prisma.SelectSubset<T, picking_resultsUpdateArgs<ExtArgs>>): Prisma.Prisma__picking_resultsClient<runtime.Types.Result.GetResult<Prisma.$picking_resultsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends picking_resultsDeleteManyArgs>(args?: Prisma.SelectSubset<T, picking_resultsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends picking_resultsUpdateManyArgs>(args: Prisma.SelectSubset<T, picking_resultsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends picking_resultsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, picking_resultsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$picking_resultsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends picking_resultsUpsertArgs>(args: Prisma.SelectSubset<T, picking_resultsUpsertArgs<ExtArgs>>): Prisma.Prisma__picking_resultsClient<runtime.Types.Result.GetResult<Prisma.$picking_resultsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends picking_resultsCountArgs>(args?: Prisma.Subset<T, picking_resultsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Picking_resultsCountAggregateOutputType> : number>;
    aggregate<T extends Picking_resultsAggregateArgs>(args: Prisma.Subset<T, Picking_resultsAggregateArgs>): Prisma.PrismaPromise<GetPicking_resultsAggregateType<T>>;
    groupBy<T extends picking_resultsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: picking_resultsGroupByArgs['orderBy'];
    } : {
        orderBy?: picking_resultsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, picking_resultsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPicking_resultsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: picking_resultsFieldRefs;
}
export interface Prisma__picking_resultsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    pallets<T extends Prisma.palletsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.palletsDefaultArgs<ExtArgs>>): Prisma.Prisma__palletsClient<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    picking_orders<T extends Prisma.picking_ordersDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.picking_ordersDefaultArgs<ExtArgs>>): Prisma.Prisma__picking_ordersClient<runtime.Types.Result.GetResult<Prisma.$picking_ordersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface picking_resultsFieldRefs {
    readonly id: Prisma.FieldRef<"picking_results", 'String'>;
    readonly picking_order_id: Prisma.FieldRef<"picking_results", 'String'>;
    readonly pallet_id: Prisma.FieldRef<"picking_results", 'String'>;
}
export type picking_resultsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_resultsSelect<ExtArgs> | null;
    omit?: Prisma.picking_resultsOmit<ExtArgs> | null;
    include?: Prisma.picking_resultsInclude<ExtArgs> | null;
    where: Prisma.picking_resultsWhereUniqueInput;
};
export type picking_resultsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_resultsSelect<ExtArgs> | null;
    omit?: Prisma.picking_resultsOmit<ExtArgs> | null;
    include?: Prisma.picking_resultsInclude<ExtArgs> | null;
    where: Prisma.picking_resultsWhereUniqueInput;
};
export type picking_resultsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type picking_resultsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type picking_resultsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type picking_resultsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_resultsSelect<ExtArgs> | null;
    omit?: Prisma.picking_resultsOmit<ExtArgs> | null;
    include?: Prisma.picking_resultsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.picking_resultsCreateInput, Prisma.picking_resultsUncheckedCreateInput>;
};
export type picking_resultsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.picking_resultsCreateManyInput | Prisma.picking_resultsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type picking_resultsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_resultsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.picking_resultsOmit<ExtArgs> | null;
    data: Prisma.picking_resultsCreateManyInput | Prisma.picking_resultsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.picking_resultsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type picking_resultsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_resultsSelect<ExtArgs> | null;
    omit?: Prisma.picking_resultsOmit<ExtArgs> | null;
    include?: Prisma.picking_resultsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.picking_resultsUpdateInput, Prisma.picking_resultsUncheckedUpdateInput>;
    where: Prisma.picking_resultsWhereUniqueInput;
};
export type picking_resultsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.picking_resultsUpdateManyMutationInput, Prisma.picking_resultsUncheckedUpdateManyInput>;
    where?: Prisma.picking_resultsWhereInput;
    limit?: number;
};
export type picking_resultsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_resultsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.picking_resultsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.picking_resultsUpdateManyMutationInput, Prisma.picking_resultsUncheckedUpdateManyInput>;
    where?: Prisma.picking_resultsWhereInput;
    limit?: number;
    include?: Prisma.picking_resultsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type picking_resultsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_resultsSelect<ExtArgs> | null;
    omit?: Prisma.picking_resultsOmit<ExtArgs> | null;
    include?: Prisma.picking_resultsInclude<ExtArgs> | null;
    where: Prisma.picking_resultsWhereUniqueInput;
    create: Prisma.XOR<Prisma.picking_resultsCreateInput, Prisma.picking_resultsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.picking_resultsUpdateInput, Prisma.picking_resultsUncheckedUpdateInput>;
};
export type picking_resultsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_resultsSelect<ExtArgs> | null;
    omit?: Prisma.picking_resultsOmit<ExtArgs> | null;
    include?: Prisma.picking_resultsInclude<ExtArgs> | null;
    where: Prisma.picking_resultsWhereUniqueInput;
};
export type picking_resultsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.picking_resultsWhereInput;
    limit?: number;
};
export type picking_resultsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_resultsSelect<ExtArgs> | null;
    omit?: Prisma.picking_resultsOmit<ExtArgs> | null;
    include?: Prisma.picking_resultsInclude<ExtArgs> | null;
};
