import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type picking_itemsModel = runtime.Types.Result.DefaultSelection<Prisma.$picking_itemsPayload>;
export type AggregatePicking_items = {
    _count: Picking_itemsCountAggregateOutputType | null;
    _avg: Picking_itemsAvgAggregateOutputType | null;
    _sum: Picking_itemsSumAggregateOutputType | null;
    _min: Picking_itemsMinAggregateOutputType | null;
    _max: Picking_itemsMaxAggregateOutputType | null;
};
export type Picking_itemsAvgAggregateOutputType = {
    quantity_required: runtime.Decimal | null;
    quantity_picked: runtime.Decimal | null;
};
export type Picking_itemsSumAggregateOutputType = {
    quantity_required: runtime.Decimal | null;
    quantity_picked: runtime.Decimal | null;
};
export type Picking_itemsMinAggregateOutputType = {
    id: string | null;
    picking_order_id: string | null;
    product_id: string | null;
    quantity_required: runtime.Decimal | null;
    quantity_picked: runtime.Decimal | null;
};
export type Picking_itemsMaxAggregateOutputType = {
    id: string | null;
    picking_order_id: string | null;
    product_id: string | null;
    quantity_required: runtime.Decimal | null;
    quantity_picked: runtime.Decimal | null;
};
export type Picking_itemsCountAggregateOutputType = {
    id: number;
    picking_order_id: number;
    product_id: number;
    quantity_required: number;
    quantity_picked: number;
    _all: number;
};
export type Picking_itemsAvgAggregateInputType = {
    quantity_required?: true;
    quantity_picked?: true;
};
export type Picking_itemsSumAggregateInputType = {
    quantity_required?: true;
    quantity_picked?: true;
};
export type Picking_itemsMinAggregateInputType = {
    id?: true;
    picking_order_id?: true;
    product_id?: true;
    quantity_required?: true;
    quantity_picked?: true;
};
export type Picking_itemsMaxAggregateInputType = {
    id?: true;
    picking_order_id?: true;
    product_id?: true;
    quantity_required?: true;
    quantity_picked?: true;
};
export type Picking_itemsCountAggregateInputType = {
    id?: true;
    picking_order_id?: true;
    product_id?: true;
    quantity_required?: true;
    quantity_picked?: true;
    _all?: true;
};
export type Picking_itemsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.picking_itemsWhereInput;
    orderBy?: Prisma.picking_itemsOrderByWithRelationInput | Prisma.picking_itemsOrderByWithRelationInput[];
    cursor?: Prisma.picking_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Picking_itemsCountAggregateInputType;
    _avg?: Picking_itemsAvgAggregateInputType;
    _sum?: Picking_itemsSumAggregateInputType;
    _min?: Picking_itemsMinAggregateInputType;
    _max?: Picking_itemsMaxAggregateInputType;
};
export type GetPicking_itemsAggregateType<T extends Picking_itemsAggregateArgs> = {
    [P in keyof T & keyof AggregatePicking_items]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePicking_items[P]> : Prisma.GetScalarType<T[P], AggregatePicking_items[P]>;
};
export type picking_itemsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.picking_itemsWhereInput;
    orderBy?: Prisma.picking_itemsOrderByWithAggregationInput | Prisma.picking_itemsOrderByWithAggregationInput[];
    by: Prisma.Picking_itemsScalarFieldEnum[] | Prisma.Picking_itemsScalarFieldEnum;
    having?: Prisma.picking_itemsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Picking_itemsCountAggregateInputType | true;
    _avg?: Picking_itemsAvgAggregateInputType;
    _sum?: Picking_itemsSumAggregateInputType;
    _min?: Picking_itemsMinAggregateInputType;
    _max?: Picking_itemsMaxAggregateInputType;
};
export type Picking_itemsGroupByOutputType = {
    id: string;
    picking_order_id: string;
    product_id: string;
    quantity_required: runtime.Decimal;
    quantity_picked: runtime.Decimal | null;
    _count: Picking_itemsCountAggregateOutputType | null;
    _avg: Picking_itemsAvgAggregateOutputType | null;
    _sum: Picking_itemsSumAggregateOutputType | null;
    _min: Picking_itemsMinAggregateOutputType | null;
    _max: Picking_itemsMaxAggregateOutputType | null;
};
export type GetPicking_itemsGroupByPayload<T extends picking_itemsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Picking_itemsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Picking_itemsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Picking_itemsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Picking_itemsGroupByOutputType[P]>;
}>>;
export type picking_itemsWhereInput = {
    AND?: Prisma.picking_itemsWhereInput | Prisma.picking_itemsWhereInput[];
    OR?: Prisma.picking_itemsWhereInput[];
    NOT?: Prisma.picking_itemsWhereInput | Prisma.picking_itemsWhereInput[];
    id?: Prisma.UuidFilter<"picking_items"> | string;
    picking_order_id?: Prisma.UuidFilter<"picking_items"> | string;
    product_id?: Prisma.UuidFilter<"picking_items"> | string;
    quantity_required?: Prisma.DecimalFilter<"picking_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.DecimalNullableFilter<"picking_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    picking_orders?: Prisma.XOR<Prisma.Picking_ordersScalarRelationFilter, Prisma.picking_ordersWhereInput>;
    products?: Prisma.XOR<Prisma.ProductsScalarRelationFilter, Prisma.productsWhereInput>;
    picking_sources?: Prisma.Picking_sourcesListRelationFilter;
};
export type picking_itemsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    picking_order_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity_required?: Prisma.SortOrder;
    quantity_picked?: Prisma.SortOrderInput | Prisma.SortOrder;
    picking_orders?: Prisma.picking_ordersOrderByWithRelationInput;
    products?: Prisma.productsOrderByWithRelationInput;
    picking_sources?: Prisma.picking_sourcesOrderByRelationAggregateInput;
};
export type picking_itemsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.picking_itemsWhereInput | Prisma.picking_itemsWhereInput[];
    OR?: Prisma.picking_itemsWhereInput[];
    NOT?: Prisma.picking_itemsWhereInput | Prisma.picking_itemsWhereInput[];
    picking_order_id?: Prisma.UuidFilter<"picking_items"> | string;
    product_id?: Prisma.UuidFilter<"picking_items"> | string;
    quantity_required?: Prisma.DecimalFilter<"picking_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.DecimalNullableFilter<"picking_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    picking_orders?: Prisma.XOR<Prisma.Picking_ordersScalarRelationFilter, Prisma.picking_ordersWhereInput>;
    products?: Prisma.XOR<Prisma.ProductsScalarRelationFilter, Prisma.productsWhereInput>;
    picking_sources?: Prisma.Picking_sourcesListRelationFilter;
}, "id">;
export type picking_itemsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    picking_order_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity_required?: Prisma.SortOrder;
    quantity_picked?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.picking_itemsCountOrderByAggregateInput;
    _avg?: Prisma.picking_itemsAvgOrderByAggregateInput;
    _max?: Prisma.picking_itemsMaxOrderByAggregateInput;
    _min?: Prisma.picking_itemsMinOrderByAggregateInput;
    _sum?: Prisma.picking_itemsSumOrderByAggregateInput;
};
export type picking_itemsScalarWhereWithAggregatesInput = {
    AND?: Prisma.picking_itemsScalarWhereWithAggregatesInput | Prisma.picking_itemsScalarWhereWithAggregatesInput[];
    OR?: Prisma.picking_itemsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.picking_itemsScalarWhereWithAggregatesInput | Prisma.picking_itemsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"picking_items"> | string;
    picking_order_id?: Prisma.UuidWithAggregatesFilter<"picking_items"> | string;
    product_id?: Prisma.UuidWithAggregatesFilter<"picking_items"> | string;
    quantity_required?: Prisma.DecimalWithAggregatesFilter<"picking_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.DecimalNullableWithAggregatesFilter<"picking_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type picking_itemsCreateInput = {
    id?: string;
    quantity_required: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    picking_orders: Prisma.picking_ordersCreateNestedOneWithoutPicking_itemsInput;
    products: Prisma.productsCreateNestedOneWithoutPicking_itemsInput;
    picking_sources?: Prisma.picking_sourcesCreateNestedManyWithoutPicking_itemsInput;
};
export type picking_itemsUncheckedCreateInput = {
    id?: string;
    picking_order_id: string;
    product_id: string;
    quantity_required: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    picking_sources?: Prisma.picking_sourcesUncheckedCreateNestedManyWithoutPicking_itemsInput;
};
export type picking_itemsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_required?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    picking_orders?: Prisma.picking_ordersUpdateOneRequiredWithoutPicking_itemsNestedInput;
    products?: Prisma.productsUpdateOneRequiredWithoutPicking_itemsNestedInput;
    picking_sources?: Prisma.picking_sourcesUpdateManyWithoutPicking_itemsNestedInput;
};
export type picking_itemsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    picking_order_id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_required?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    picking_sources?: Prisma.picking_sourcesUncheckedUpdateManyWithoutPicking_itemsNestedInput;
};
export type picking_itemsCreateManyInput = {
    id?: string;
    picking_order_id: string;
    product_id: string;
    quantity_required: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type picking_itemsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_required?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type picking_itemsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    picking_order_id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_required?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type picking_itemsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    picking_order_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity_required?: Prisma.SortOrder;
    quantity_picked?: Prisma.SortOrder;
};
export type picking_itemsAvgOrderByAggregateInput = {
    quantity_required?: Prisma.SortOrder;
    quantity_picked?: Prisma.SortOrder;
};
export type picking_itemsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    picking_order_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity_required?: Prisma.SortOrder;
    quantity_picked?: Prisma.SortOrder;
};
export type picking_itemsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    picking_order_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity_required?: Prisma.SortOrder;
    quantity_picked?: Prisma.SortOrder;
};
export type picking_itemsSumOrderByAggregateInput = {
    quantity_required?: Prisma.SortOrder;
    quantity_picked?: Prisma.SortOrder;
};
export type Picking_itemsListRelationFilter = {
    every?: Prisma.picking_itemsWhereInput;
    some?: Prisma.picking_itemsWhereInput;
    none?: Prisma.picking_itemsWhereInput;
};
export type picking_itemsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type Picking_itemsScalarRelationFilter = {
    is?: Prisma.picking_itemsWhereInput;
    isNot?: Prisma.picking_itemsWhereInput;
};
export type picking_itemsCreateNestedManyWithoutPicking_ordersInput = {
    create?: Prisma.XOR<Prisma.picking_itemsCreateWithoutPicking_ordersInput, Prisma.picking_itemsUncheckedCreateWithoutPicking_ordersInput> | Prisma.picking_itemsCreateWithoutPicking_ordersInput[] | Prisma.picking_itemsUncheckedCreateWithoutPicking_ordersInput[];
    connectOrCreate?: Prisma.picking_itemsCreateOrConnectWithoutPicking_ordersInput | Prisma.picking_itemsCreateOrConnectWithoutPicking_ordersInput[];
    createMany?: Prisma.picking_itemsCreateManyPicking_ordersInputEnvelope;
    connect?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
};
export type picking_itemsUncheckedCreateNestedManyWithoutPicking_ordersInput = {
    create?: Prisma.XOR<Prisma.picking_itemsCreateWithoutPicking_ordersInput, Prisma.picking_itemsUncheckedCreateWithoutPicking_ordersInput> | Prisma.picking_itemsCreateWithoutPicking_ordersInput[] | Prisma.picking_itemsUncheckedCreateWithoutPicking_ordersInput[];
    connectOrCreate?: Prisma.picking_itemsCreateOrConnectWithoutPicking_ordersInput | Prisma.picking_itemsCreateOrConnectWithoutPicking_ordersInput[];
    createMany?: Prisma.picking_itemsCreateManyPicking_ordersInputEnvelope;
    connect?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
};
export type picking_itemsUpdateManyWithoutPicking_ordersNestedInput = {
    create?: Prisma.XOR<Prisma.picking_itemsCreateWithoutPicking_ordersInput, Prisma.picking_itemsUncheckedCreateWithoutPicking_ordersInput> | Prisma.picking_itemsCreateWithoutPicking_ordersInput[] | Prisma.picking_itemsUncheckedCreateWithoutPicking_ordersInput[];
    connectOrCreate?: Prisma.picking_itemsCreateOrConnectWithoutPicking_ordersInput | Prisma.picking_itemsCreateOrConnectWithoutPicking_ordersInput[];
    upsert?: Prisma.picking_itemsUpsertWithWhereUniqueWithoutPicking_ordersInput | Prisma.picking_itemsUpsertWithWhereUniqueWithoutPicking_ordersInput[];
    createMany?: Prisma.picking_itemsCreateManyPicking_ordersInputEnvelope;
    set?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    disconnect?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    delete?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    connect?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    update?: Prisma.picking_itemsUpdateWithWhereUniqueWithoutPicking_ordersInput | Prisma.picking_itemsUpdateWithWhereUniqueWithoutPicking_ordersInput[];
    updateMany?: Prisma.picking_itemsUpdateManyWithWhereWithoutPicking_ordersInput | Prisma.picking_itemsUpdateManyWithWhereWithoutPicking_ordersInput[];
    deleteMany?: Prisma.picking_itemsScalarWhereInput | Prisma.picking_itemsScalarWhereInput[];
};
export type picking_itemsUncheckedUpdateManyWithoutPicking_ordersNestedInput = {
    create?: Prisma.XOR<Prisma.picking_itemsCreateWithoutPicking_ordersInput, Prisma.picking_itemsUncheckedCreateWithoutPicking_ordersInput> | Prisma.picking_itemsCreateWithoutPicking_ordersInput[] | Prisma.picking_itemsUncheckedCreateWithoutPicking_ordersInput[];
    connectOrCreate?: Prisma.picking_itemsCreateOrConnectWithoutPicking_ordersInput | Prisma.picking_itemsCreateOrConnectWithoutPicking_ordersInput[];
    upsert?: Prisma.picking_itemsUpsertWithWhereUniqueWithoutPicking_ordersInput | Prisma.picking_itemsUpsertWithWhereUniqueWithoutPicking_ordersInput[];
    createMany?: Prisma.picking_itemsCreateManyPicking_ordersInputEnvelope;
    set?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    disconnect?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    delete?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    connect?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    update?: Prisma.picking_itemsUpdateWithWhereUniqueWithoutPicking_ordersInput | Prisma.picking_itemsUpdateWithWhereUniqueWithoutPicking_ordersInput[];
    updateMany?: Prisma.picking_itemsUpdateManyWithWhereWithoutPicking_ordersInput | Prisma.picking_itemsUpdateManyWithWhereWithoutPicking_ordersInput[];
    deleteMany?: Prisma.picking_itemsScalarWhereInput | Prisma.picking_itemsScalarWhereInput[];
};
export type picking_itemsCreateNestedOneWithoutPicking_sourcesInput = {
    create?: Prisma.XOR<Prisma.picking_itemsCreateWithoutPicking_sourcesInput, Prisma.picking_itemsUncheckedCreateWithoutPicking_sourcesInput>;
    connectOrCreate?: Prisma.picking_itemsCreateOrConnectWithoutPicking_sourcesInput;
    connect?: Prisma.picking_itemsWhereUniqueInput;
};
export type picking_itemsUpdateOneRequiredWithoutPicking_sourcesNestedInput = {
    create?: Prisma.XOR<Prisma.picking_itemsCreateWithoutPicking_sourcesInput, Prisma.picking_itemsUncheckedCreateWithoutPicking_sourcesInput>;
    connectOrCreate?: Prisma.picking_itemsCreateOrConnectWithoutPicking_sourcesInput;
    upsert?: Prisma.picking_itemsUpsertWithoutPicking_sourcesInput;
    connect?: Prisma.picking_itemsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.picking_itemsUpdateToOneWithWhereWithoutPicking_sourcesInput, Prisma.picking_itemsUpdateWithoutPicking_sourcesInput>, Prisma.picking_itemsUncheckedUpdateWithoutPicking_sourcesInput>;
};
export type picking_itemsCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.picking_itemsCreateWithoutProductsInput, Prisma.picking_itemsUncheckedCreateWithoutProductsInput> | Prisma.picking_itemsCreateWithoutProductsInput[] | Prisma.picking_itemsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.picking_itemsCreateOrConnectWithoutProductsInput | Prisma.picking_itemsCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.picking_itemsCreateManyProductsInputEnvelope;
    connect?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
};
export type picking_itemsUncheckedCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.picking_itemsCreateWithoutProductsInput, Prisma.picking_itemsUncheckedCreateWithoutProductsInput> | Prisma.picking_itemsCreateWithoutProductsInput[] | Prisma.picking_itemsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.picking_itemsCreateOrConnectWithoutProductsInput | Prisma.picking_itemsCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.picking_itemsCreateManyProductsInputEnvelope;
    connect?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
};
export type picking_itemsUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.picking_itemsCreateWithoutProductsInput, Prisma.picking_itemsUncheckedCreateWithoutProductsInput> | Prisma.picking_itemsCreateWithoutProductsInput[] | Prisma.picking_itemsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.picking_itemsCreateOrConnectWithoutProductsInput | Prisma.picking_itemsCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.picking_itemsUpsertWithWhereUniqueWithoutProductsInput | Prisma.picking_itemsUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.picking_itemsCreateManyProductsInputEnvelope;
    set?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    disconnect?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    delete?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    connect?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    update?: Prisma.picking_itemsUpdateWithWhereUniqueWithoutProductsInput | Prisma.picking_itemsUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.picking_itemsUpdateManyWithWhereWithoutProductsInput | Prisma.picking_itemsUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.picking_itemsScalarWhereInput | Prisma.picking_itemsScalarWhereInput[];
};
export type picking_itemsUncheckedUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.picking_itemsCreateWithoutProductsInput, Prisma.picking_itemsUncheckedCreateWithoutProductsInput> | Prisma.picking_itemsCreateWithoutProductsInput[] | Prisma.picking_itemsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.picking_itemsCreateOrConnectWithoutProductsInput | Prisma.picking_itemsCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.picking_itemsUpsertWithWhereUniqueWithoutProductsInput | Prisma.picking_itemsUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.picking_itemsCreateManyProductsInputEnvelope;
    set?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    disconnect?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    delete?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    connect?: Prisma.picking_itemsWhereUniqueInput | Prisma.picking_itemsWhereUniqueInput[];
    update?: Prisma.picking_itemsUpdateWithWhereUniqueWithoutProductsInput | Prisma.picking_itemsUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.picking_itemsUpdateManyWithWhereWithoutProductsInput | Prisma.picking_itemsUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.picking_itemsScalarWhereInput | Prisma.picking_itemsScalarWhereInput[];
};
export type picking_itemsCreateWithoutPicking_ordersInput = {
    id?: string;
    quantity_required: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    products: Prisma.productsCreateNestedOneWithoutPicking_itemsInput;
    picking_sources?: Prisma.picking_sourcesCreateNestedManyWithoutPicking_itemsInput;
};
export type picking_itemsUncheckedCreateWithoutPicking_ordersInput = {
    id?: string;
    product_id: string;
    quantity_required: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    picking_sources?: Prisma.picking_sourcesUncheckedCreateNestedManyWithoutPicking_itemsInput;
};
export type picking_itemsCreateOrConnectWithoutPicking_ordersInput = {
    where: Prisma.picking_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.picking_itemsCreateWithoutPicking_ordersInput, Prisma.picking_itemsUncheckedCreateWithoutPicking_ordersInput>;
};
export type picking_itemsCreateManyPicking_ordersInputEnvelope = {
    data: Prisma.picking_itemsCreateManyPicking_ordersInput | Prisma.picking_itemsCreateManyPicking_ordersInput[];
    skipDuplicates?: boolean;
};
export type picking_itemsUpsertWithWhereUniqueWithoutPicking_ordersInput = {
    where: Prisma.picking_itemsWhereUniqueInput;
    update: Prisma.XOR<Prisma.picking_itemsUpdateWithoutPicking_ordersInput, Prisma.picking_itemsUncheckedUpdateWithoutPicking_ordersInput>;
    create: Prisma.XOR<Prisma.picking_itemsCreateWithoutPicking_ordersInput, Prisma.picking_itemsUncheckedCreateWithoutPicking_ordersInput>;
};
export type picking_itemsUpdateWithWhereUniqueWithoutPicking_ordersInput = {
    where: Prisma.picking_itemsWhereUniqueInput;
    data: Prisma.XOR<Prisma.picking_itemsUpdateWithoutPicking_ordersInput, Prisma.picking_itemsUncheckedUpdateWithoutPicking_ordersInput>;
};
export type picking_itemsUpdateManyWithWhereWithoutPicking_ordersInput = {
    where: Prisma.picking_itemsScalarWhereInput;
    data: Prisma.XOR<Prisma.picking_itemsUpdateManyMutationInput, Prisma.picking_itemsUncheckedUpdateManyWithoutPicking_ordersInput>;
};
export type picking_itemsScalarWhereInput = {
    AND?: Prisma.picking_itemsScalarWhereInput | Prisma.picking_itemsScalarWhereInput[];
    OR?: Prisma.picking_itemsScalarWhereInput[];
    NOT?: Prisma.picking_itemsScalarWhereInput | Prisma.picking_itemsScalarWhereInput[];
    id?: Prisma.UuidFilter<"picking_items"> | string;
    picking_order_id?: Prisma.UuidFilter<"picking_items"> | string;
    product_id?: Prisma.UuidFilter<"picking_items"> | string;
    quantity_required?: Prisma.DecimalFilter<"picking_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.DecimalNullableFilter<"picking_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type picking_itemsCreateWithoutPicking_sourcesInput = {
    id?: string;
    quantity_required: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    picking_orders: Prisma.picking_ordersCreateNestedOneWithoutPicking_itemsInput;
    products: Prisma.productsCreateNestedOneWithoutPicking_itemsInput;
};
export type picking_itemsUncheckedCreateWithoutPicking_sourcesInput = {
    id?: string;
    picking_order_id: string;
    product_id: string;
    quantity_required: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type picking_itemsCreateOrConnectWithoutPicking_sourcesInput = {
    where: Prisma.picking_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.picking_itemsCreateWithoutPicking_sourcesInput, Prisma.picking_itemsUncheckedCreateWithoutPicking_sourcesInput>;
};
export type picking_itemsUpsertWithoutPicking_sourcesInput = {
    update: Prisma.XOR<Prisma.picking_itemsUpdateWithoutPicking_sourcesInput, Prisma.picking_itemsUncheckedUpdateWithoutPicking_sourcesInput>;
    create: Prisma.XOR<Prisma.picking_itemsCreateWithoutPicking_sourcesInput, Prisma.picking_itemsUncheckedCreateWithoutPicking_sourcesInput>;
    where?: Prisma.picking_itemsWhereInput;
};
export type picking_itemsUpdateToOneWithWhereWithoutPicking_sourcesInput = {
    where?: Prisma.picking_itemsWhereInput;
    data: Prisma.XOR<Prisma.picking_itemsUpdateWithoutPicking_sourcesInput, Prisma.picking_itemsUncheckedUpdateWithoutPicking_sourcesInput>;
};
export type picking_itemsUpdateWithoutPicking_sourcesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_required?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    picking_orders?: Prisma.picking_ordersUpdateOneRequiredWithoutPicking_itemsNestedInput;
    products?: Prisma.productsUpdateOneRequiredWithoutPicking_itemsNestedInput;
};
export type picking_itemsUncheckedUpdateWithoutPicking_sourcesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    picking_order_id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_required?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type picking_itemsCreateWithoutProductsInput = {
    id?: string;
    quantity_required: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    picking_orders: Prisma.picking_ordersCreateNestedOneWithoutPicking_itemsInput;
    picking_sources?: Prisma.picking_sourcesCreateNestedManyWithoutPicking_itemsInput;
};
export type picking_itemsUncheckedCreateWithoutProductsInput = {
    id?: string;
    picking_order_id: string;
    quantity_required: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    picking_sources?: Prisma.picking_sourcesUncheckedCreateNestedManyWithoutPicking_itemsInput;
};
export type picking_itemsCreateOrConnectWithoutProductsInput = {
    where: Prisma.picking_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.picking_itemsCreateWithoutProductsInput, Prisma.picking_itemsUncheckedCreateWithoutProductsInput>;
};
export type picking_itemsCreateManyProductsInputEnvelope = {
    data: Prisma.picking_itemsCreateManyProductsInput | Prisma.picking_itemsCreateManyProductsInput[];
    skipDuplicates?: boolean;
};
export type picking_itemsUpsertWithWhereUniqueWithoutProductsInput = {
    where: Prisma.picking_itemsWhereUniqueInput;
    update: Prisma.XOR<Prisma.picking_itemsUpdateWithoutProductsInput, Prisma.picking_itemsUncheckedUpdateWithoutProductsInput>;
    create: Prisma.XOR<Prisma.picking_itemsCreateWithoutProductsInput, Prisma.picking_itemsUncheckedCreateWithoutProductsInput>;
};
export type picking_itemsUpdateWithWhereUniqueWithoutProductsInput = {
    where: Prisma.picking_itemsWhereUniqueInput;
    data: Prisma.XOR<Prisma.picking_itemsUpdateWithoutProductsInput, Prisma.picking_itemsUncheckedUpdateWithoutProductsInput>;
};
export type picking_itemsUpdateManyWithWhereWithoutProductsInput = {
    where: Prisma.picking_itemsScalarWhereInput;
    data: Prisma.XOR<Prisma.picking_itemsUpdateManyMutationInput, Prisma.picking_itemsUncheckedUpdateManyWithoutProductsInput>;
};
export type picking_itemsCreateManyPicking_ordersInput = {
    id?: string;
    product_id: string;
    quantity_required: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type picking_itemsUpdateWithoutPicking_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_required?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    products?: Prisma.productsUpdateOneRequiredWithoutPicking_itemsNestedInput;
    picking_sources?: Prisma.picking_sourcesUpdateManyWithoutPicking_itemsNestedInput;
};
export type picking_itemsUncheckedUpdateWithoutPicking_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_required?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    picking_sources?: Prisma.picking_sourcesUncheckedUpdateManyWithoutPicking_itemsNestedInput;
};
export type picking_itemsUncheckedUpdateManyWithoutPicking_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_required?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type picking_itemsCreateManyProductsInput = {
    id?: string;
    picking_order_id: string;
    quantity_required: runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type picking_itemsUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_required?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    picking_orders?: Prisma.picking_ordersUpdateOneRequiredWithoutPicking_itemsNestedInput;
    picking_sources?: Prisma.picking_sourcesUpdateManyWithoutPicking_itemsNestedInput;
};
export type picking_itemsUncheckedUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    picking_order_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_required?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    picking_sources?: Prisma.picking_sourcesUncheckedUpdateManyWithoutPicking_itemsNestedInput;
};
export type picking_itemsUncheckedUpdateManyWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    picking_order_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity_required?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    quantity_picked?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type Picking_itemsCountOutputType = {
    picking_sources: number;
};
export type Picking_itemsCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    picking_sources?: boolean | Picking_itemsCountOutputTypeCountPicking_sourcesArgs;
};
export type Picking_itemsCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.Picking_itemsCountOutputTypeSelect<ExtArgs> | null;
};
export type Picking_itemsCountOutputTypeCountPicking_sourcesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.picking_sourcesWhereInput;
};
export type picking_itemsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    picking_order_id?: boolean;
    product_id?: boolean;
    quantity_required?: boolean;
    quantity_picked?: boolean;
    picking_orders?: boolean | Prisma.picking_ordersDefaultArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    picking_sources?: boolean | Prisma.picking_items$picking_sourcesArgs<ExtArgs>;
    _count?: boolean | Prisma.Picking_itemsCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["picking_items"]>;
export type picking_itemsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    picking_order_id?: boolean;
    product_id?: boolean;
    quantity_required?: boolean;
    quantity_picked?: boolean;
    picking_orders?: boolean | Prisma.picking_ordersDefaultArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["picking_items"]>;
export type picking_itemsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    picking_order_id?: boolean;
    product_id?: boolean;
    quantity_required?: boolean;
    quantity_picked?: boolean;
    picking_orders?: boolean | Prisma.picking_ordersDefaultArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["picking_items"]>;
export type picking_itemsSelectScalar = {
    id?: boolean;
    picking_order_id?: boolean;
    product_id?: boolean;
    quantity_required?: boolean;
    quantity_picked?: boolean;
};
export type picking_itemsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "picking_order_id" | "product_id" | "quantity_required" | "quantity_picked", ExtArgs["result"]["picking_items"]>;
export type picking_itemsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    picking_orders?: boolean | Prisma.picking_ordersDefaultArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    picking_sources?: boolean | Prisma.picking_items$picking_sourcesArgs<ExtArgs>;
    _count?: boolean | Prisma.Picking_itemsCountOutputTypeDefaultArgs<ExtArgs>;
};
export type picking_itemsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    picking_orders?: boolean | Prisma.picking_ordersDefaultArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
};
export type picking_itemsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    picking_orders?: boolean | Prisma.picking_ordersDefaultArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
};
export type $picking_itemsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "picking_items";
    objects: {
        picking_orders: Prisma.$picking_ordersPayload<ExtArgs>;
        products: Prisma.$productsPayload<ExtArgs>;
        picking_sources: Prisma.$picking_sourcesPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        picking_order_id: string;
        product_id: string;
        quantity_required: runtime.Decimal;
        quantity_picked: runtime.Decimal | null;
    }, ExtArgs["result"]["picking_items"]>;
    composites: {};
};
export type picking_itemsGetPayload<S extends boolean | null | undefined | picking_itemsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$picking_itemsPayload, S>;
export type picking_itemsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<picking_itemsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Picking_itemsCountAggregateInputType | true;
};
export interface picking_itemsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['picking_items'];
        meta: {
            name: 'picking_items';
        };
    };
    findUnique<T extends picking_itemsFindUniqueArgs>(args: Prisma.SelectSubset<T, picking_itemsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__picking_itemsClient<runtime.Types.Result.GetResult<Prisma.$picking_itemsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends picking_itemsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, picking_itemsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__picking_itemsClient<runtime.Types.Result.GetResult<Prisma.$picking_itemsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends picking_itemsFindFirstArgs>(args?: Prisma.SelectSubset<T, picking_itemsFindFirstArgs<ExtArgs>>): Prisma.Prisma__picking_itemsClient<runtime.Types.Result.GetResult<Prisma.$picking_itemsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends picking_itemsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, picking_itemsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__picking_itemsClient<runtime.Types.Result.GetResult<Prisma.$picking_itemsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends picking_itemsFindManyArgs>(args?: Prisma.SelectSubset<T, picking_itemsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$picking_itemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends picking_itemsCreateArgs>(args: Prisma.SelectSubset<T, picking_itemsCreateArgs<ExtArgs>>): Prisma.Prisma__picking_itemsClient<runtime.Types.Result.GetResult<Prisma.$picking_itemsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends picking_itemsCreateManyArgs>(args?: Prisma.SelectSubset<T, picking_itemsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends picking_itemsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, picking_itemsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$picking_itemsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends picking_itemsDeleteArgs>(args: Prisma.SelectSubset<T, picking_itemsDeleteArgs<ExtArgs>>): Prisma.Prisma__picking_itemsClient<runtime.Types.Result.GetResult<Prisma.$picking_itemsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends picking_itemsUpdateArgs>(args: Prisma.SelectSubset<T, picking_itemsUpdateArgs<ExtArgs>>): Prisma.Prisma__picking_itemsClient<runtime.Types.Result.GetResult<Prisma.$picking_itemsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends picking_itemsDeleteManyArgs>(args?: Prisma.SelectSubset<T, picking_itemsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends picking_itemsUpdateManyArgs>(args: Prisma.SelectSubset<T, picking_itemsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends picking_itemsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, picking_itemsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$picking_itemsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends picking_itemsUpsertArgs>(args: Prisma.SelectSubset<T, picking_itemsUpsertArgs<ExtArgs>>): Prisma.Prisma__picking_itemsClient<runtime.Types.Result.GetResult<Prisma.$picking_itemsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends picking_itemsCountArgs>(args?: Prisma.Subset<T, picking_itemsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Picking_itemsCountAggregateOutputType> : number>;
    aggregate<T extends Picking_itemsAggregateArgs>(args: Prisma.Subset<T, Picking_itemsAggregateArgs>): Prisma.PrismaPromise<GetPicking_itemsAggregateType<T>>;
    groupBy<T extends picking_itemsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: picking_itemsGroupByArgs['orderBy'];
    } : {
        orderBy?: picking_itemsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, picking_itemsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPicking_itemsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: picking_itemsFieldRefs;
}
export interface Prisma__picking_itemsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    picking_orders<T extends Prisma.picking_ordersDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.picking_ordersDefaultArgs<ExtArgs>>): Prisma.Prisma__picking_ordersClient<runtime.Types.Result.GetResult<Prisma.$picking_ordersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    products<T extends Prisma.productsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.productsDefaultArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    picking_sources<T extends Prisma.picking_items$picking_sourcesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.picking_items$picking_sourcesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$picking_sourcesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface picking_itemsFieldRefs {
    readonly id: Prisma.FieldRef<"picking_items", 'String'>;
    readonly picking_order_id: Prisma.FieldRef<"picking_items", 'String'>;
    readonly product_id: Prisma.FieldRef<"picking_items", 'String'>;
    readonly quantity_required: Prisma.FieldRef<"picking_items", 'Decimal'>;
    readonly quantity_picked: Prisma.FieldRef<"picking_items", 'Decimal'>;
}
export type picking_itemsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_itemsSelect<ExtArgs> | null;
    omit?: Prisma.picking_itemsOmit<ExtArgs> | null;
    include?: Prisma.picking_itemsInclude<ExtArgs> | null;
    where: Prisma.picking_itemsWhereUniqueInput;
};
export type picking_itemsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_itemsSelect<ExtArgs> | null;
    omit?: Prisma.picking_itemsOmit<ExtArgs> | null;
    include?: Prisma.picking_itemsInclude<ExtArgs> | null;
    where: Prisma.picking_itemsWhereUniqueInput;
};
export type picking_itemsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_itemsSelect<ExtArgs> | null;
    omit?: Prisma.picking_itemsOmit<ExtArgs> | null;
    include?: Prisma.picking_itemsInclude<ExtArgs> | null;
    where?: Prisma.picking_itemsWhereInput;
    orderBy?: Prisma.picking_itemsOrderByWithRelationInput | Prisma.picking_itemsOrderByWithRelationInput[];
    cursor?: Prisma.picking_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Picking_itemsScalarFieldEnum | Prisma.Picking_itemsScalarFieldEnum[];
};
export type picking_itemsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_itemsSelect<ExtArgs> | null;
    omit?: Prisma.picking_itemsOmit<ExtArgs> | null;
    include?: Prisma.picking_itemsInclude<ExtArgs> | null;
    where?: Prisma.picking_itemsWhereInput;
    orderBy?: Prisma.picking_itemsOrderByWithRelationInput | Prisma.picking_itemsOrderByWithRelationInput[];
    cursor?: Prisma.picking_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Picking_itemsScalarFieldEnum | Prisma.Picking_itemsScalarFieldEnum[];
};
export type picking_itemsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_itemsSelect<ExtArgs> | null;
    omit?: Prisma.picking_itemsOmit<ExtArgs> | null;
    include?: Prisma.picking_itemsInclude<ExtArgs> | null;
    where?: Prisma.picking_itemsWhereInput;
    orderBy?: Prisma.picking_itemsOrderByWithRelationInput | Prisma.picking_itemsOrderByWithRelationInput[];
    cursor?: Prisma.picking_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Picking_itemsScalarFieldEnum | Prisma.Picking_itemsScalarFieldEnum[];
};
export type picking_itemsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_itemsSelect<ExtArgs> | null;
    omit?: Prisma.picking_itemsOmit<ExtArgs> | null;
    include?: Prisma.picking_itemsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.picking_itemsCreateInput, Prisma.picking_itemsUncheckedCreateInput>;
};
export type picking_itemsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.picking_itemsCreateManyInput | Prisma.picking_itemsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type picking_itemsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_itemsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.picking_itemsOmit<ExtArgs> | null;
    data: Prisma.picking_itemsCreateManyInput | Prisma.picking_itemsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.picking_itemsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type picking_itemsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_itemsSelect<ExtArgs> | null;
    omit?: Prisma.picking_itemsOmit<ExtArgs> | null;
    include?: Prisma.picking_itemsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.picking_itemsUpdateInput, Prisma.picking_itemsUncheckedUpdateInput>;
    where: Prisma.picking_itemsWhereUniqueInput;
};
export type picking_itemsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.picking_itemsUpdateManyMutationInput, Prisma.picking_itemsUncheckedUpdateManyInput>;
    where?: Prisma.picking_itemsWhereInput;
    limit?: number;
};
export type picking_itemsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_itemsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.picking_itemsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.picking_itemsUpdateManyMutationInput, Prisma.picking_itemsUncheckedUpdateManyInput>;
    where?: Prisma.picking_itemsWhereInput;
    limit?: number;
    include?: Prisma.picking_itemsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type picking_itemsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_itemsSelect<ExtArgs> | null;
    omit?: Prisma.picking_itemsOmit<ExtArgs> | null;
    include?: Prisma.picking_itemsInclude<ExtArgs> | null;
    where: Prisma.picking_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.picking_itemsCreateInput, Prisma.picking_itemsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.picking_itemsUpdateInput, Prisma.picking_itemsUncheckedUpdateInput>;
};
export type picking_itemsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_itemsSelect<ExtArgs> | null;
    omit?: Prisma.picking_itemsOmit<ExtArgs> | null;
    include?: Prisma.picking_itemsInclude<ExtArgs> | null;
    where: Prisma.picking_itemsWhereUniqueInput;
};
export type picking_itemsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.picking_itemsWhereInput;
    limit?: number;
};
export type picking_items$picking_sourcesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type picking_itemsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_itemsSelect<ExtArgs> | null;
    omit?: Prisma.picking_itemsOmit<ExtArgs> | null;
    include?: Prisma.picking_itemsInclude<ExtArgs> | null;
};
