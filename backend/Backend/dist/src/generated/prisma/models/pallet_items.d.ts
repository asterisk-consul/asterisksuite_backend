import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type pallet_itemsModel = runtime.Types.Result.DefaultSelection<Prisma.$pallet_itemsPayload>;
export type AggregatePallet_items = {
    _count: Pallet_itemsCountAggregateOutputType | null;
    _avg: Pallet_itemsAvgAggregateOutputType | null;
    _sum: Pallet_itemsSumAggregateOutputType | null;
    _min: Pallet_itemsMinAggregateOutputType | null;
    _max: Pallet_itemsMaxAggregateOutputType | null;
};
export type Pallet_itemsAvgAggregateOutputType = {
    quantity: runtime.Decimal | null;
};
export type Pallet_itemsSumAggregateOutputType = {
    quantity: runtime.Decimal | null;
};
export type Pallet_itemsMinAggregateOutputType = {
    id: string | null;
    pallet_id: string | null;
    product_id: string | null;
    quantity: runtime.Decimal | null;
};
export type Pallet_itemsMaxAggregateOutputType = {
    id: string | null;
    pallet_id: string | null;
    product_id: string | null;
    quantity: runtime.Decimal | null;
};
export type Pallet_itemsCountAggregateOutputType = {
    id: number;
    pallet_id: number;
    product_id: number;
    quantity: number;
    _all: number;
};
export type Pallet_itemsAvgAggregateInputType = {
    quantity?: true;
};
export type Pallet_itemsSumAggregateInputType = {
    quantity?: true;
};
export type Pallet_itemsMinAggregateInputType = {
    id?: true;
    pallet_id?: true;
    product_id?: true;
    quantity?: true;
};
export type Pallet_itemsMaxAggregateInputType = {
    id?: true;
    pallet_id?: true;
    product_id?: true;
    quantity?: true;
};
export type Pallet_itemsCountAggregateInputType = {
    id?: true;
    pallet_id?: true;
    product_id?: true;
    quantity?: true;
    _all?: true;
};
export type Pallet_itemsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.pallet_itemsWhereInput;
    orderBy?: Prisma.pallet_itemsOrderByWithRelationInput | Prisma.pallet_itemsOrderByWithRelationInput[];
    cursor?: Prisma.pallet_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Pallet_itemsCountAggregateInputType;
    _avg?: Pallet_itemsAvgAggregateInputType;
    _sum?: Pallet_itemsSumAggregateInputType;
    _min?: Pallet_itemsMinAggregateInputType;
    _max?: Pallet_itemsMaxAggregateInputType;
};
export type GetPallet_itemsAggregateType<T extends Pallet_itemsAggregateArgs> = {
    [P in keyof T & keyof AggregatePallet_items]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePallet_items[P]> : Prisma.GetScalarType<T[P], AggregatePallet_items[P]>;
};
export type pallet_itemsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.pallet_itemsWhereInput;
    orderBy?: Prisma.pallet_itemsOrderByWithAggregationInput | Prisma.pallet_itemsOrderByWithAggregationInput[];
    by: Prisma.Pallet_itemsScalarFieldEnum[] | Prisma.Pallet_itemsScalarFieldEnum;
    having?: Prisma.pallet_itemsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Pallet_itemsCountAggregateInputType | true;
    _avg?: Pallet_itemsAvgAggregateInputType;
    _sum?: Pallet_itemsSumAggregateInputType;
    _min?: Pallet_itemsMinAggregateInputType;
    _max?: Pallet_itemsMaxAggregateInputType;
};
export type Pallet_itemsGroupByOutputType = {
    id: string;
    pallet_id: string;
    product_id: string;
    quantity: runtime.Decimal;
    _count: Pallet_itemsCountAggregateOutputType | null;
    _avg: Pallet_itemsAvgAggregateOutputType | null;
    _sum: Pallet_itemsSumAggregateOutputType | null;
    _min: Pallet_itemsMinAggregateOutputType | null;
    _max: Pallet_itemsMaxAggregateOutputType | null;
};
export type GetPallet_itemsGroupByPayload<T extends pallet_itemsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Pallet_itemsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Pallet_itemsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Pallet_itemsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Pallet_itemsGroupByOutputType[P]>;
}>>;
export type pallet_itemsWhereInput = {
    AND?: Prisma.pallet_itemsWhereInput | Prisma.pallet_itemsWhereInput[];
    OR?: Prisma.pallet_itemsWhereInput[];
    NOT?: Prisma.pallet_itemsWhereInput | Prisma.pallet_itemsWhereInput[];
    id?: Prisma.UuidFilter<"pallet_items"> | string;
    pallet_id?: Prisma.UuidFilter<"pallet_items"> | string;
    product_id?: Prisma.UuidFilter<"pallet_items"> | string;
    quantity?: Prisma.DecimalFilter<"pallet_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    pallets?: Prisma.XOR<Prisma.PalletsScalarRelationFilter, Prisma.palletsWhereInput>;
    products?: Prisma.XOR<Prisma.ProductsScalarRelationFilter, Prisma.productsWhereInput>;
};
export type pallet_itemsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    pallets?: Prisma.palletsOrderByWithRelationInput;
    products?: Prisma.productsOrderByWithRelationInput;
};
export type pallet_itemsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    pallet_id_product_id?: Prisma.pallet_itemsPallet_idProduct_idCompoundUniqueInput;
    AND?: Prisma.pallet_itemsWhereInput | Prisma.pallet_itemsWhereInput[];
    OR?: Prisma.pallet_itemsWhereInput[];
    NOT?: Prisma.pallet_itemsWhereInput | Prisma.pallet_itemsWhereInput[];
    pallet_id?: Prisma.UuidFilter<"pallet_items"> | string;
    product_id?: Prisma.UuidFilter<"pallet_items"> | string;
    quantity?: Prisma.DecimalFilter<"pallet_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    pallets?: Prisma.XOR<Prisma.PalletsScalarRelationFilter, Prisma.palletsWhereInput>;
    products?: Prisma.XOR<Prisma.ProductsScalarRelationFilter, Prisma.productsWhereInput>;
}, "id" | "pallet_id_product_id">;
export type pallet_itemsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    _count?: Prisma.pallet_itemsCountOrderByAggregateInput;
    _avg?: Prisma.pallet_itemsAvgOrderByAggregateInput;
    _max?: Prisma.pallet_itemsMaxOrderByAggregateInput;
    _min?: Prisma.pallet_itemsMinOrderByAggregateInput;
    _sum?: Prisma.pallet_itemsSumOrderByAggregateInput;
};
export type pallet_itemsScalarWhereWithAggregatesInput = {
    AND?: Prisma.pallet_itemsScalarWhereWithAggregatesInput | Prisma.pallet_itemsScalarWhereWithAggregatesInput[];
    OR?: Prisma.pallet_itemsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.pallet_itemsScalarWhereWithAggregatesInput | Prisma.pallet_itemsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"pallet_items"> | string;
    pallet_id?: Prisma.UuidWithAggregatesFilter<"pallet_items"> | string;
    product_id?: Prisma.UuidWithAggregatesFilter<"pallet_items"> | string;
    quantity?: Prisma.DecimalWithAggregatesFilter<"pallet_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsCreateInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    pallets: Prisma.palletsCreateNestedOneWithoutPallet_itemsInput;
    products: Prisma.productsCreateNestedOneWithoutPallet_itemsInput;
};
export type pallet_itemsUncheckedCreateInput = {
    id?: string;
    pallet_id: string;
    product_id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    pallets?: Prisma.palletsUpdateOneRequiredWithoutPallet_itemsNestedInput;
    products?: Prisma.productsUpdateOneRequiredWithoutPallet_itemsNestedInput;
};
export type pallet_itemsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsCreateManyInput = {
    id?: string;
    pallet_id: string;
    product_id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsPallet_idProduct_idCompoundUniqueInput = {
    pallet_id: string;
    product_id: string;
};
export type pallet_itemsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type pallet_itemsAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type pallet_itemsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type pallet_itemsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type pallet_itemsSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type Pallet_itemsListRelationFilter = {
    every?: Prisma.pallet_itemsWhereInput;
    some?: Prisma.pallet_itemsWhereInput;
    none?: Prisma.pallet_itemsWhereInput;
};
export type pallet_itemsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsCreateNestedManyWithoutPalletsInput = {
    create?: Prisma.XOR<Prisma.pallet_itemsCreateWithoutPalletsInput, Prisma.pallet_itemsUncheckedCreateWithoutPalletsInput> | Prisma.pallet_itemsCreateWithoutPalletsInput[] | Prisma.pallet_itemsUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.pallet_itemsCreateOrConnectWithoutPalletsInput | Prisma.pallet_itemsCreateOrConnectWithoutPalletsInput[];
    createMany?: Prisma.pallet_itemsCreateManyPalletsInputEnvelope;
    connect?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
};
export type pallet_itemsUncheckedCreateNestedManyWithoutPalletsInput = {
    create?: Prisma.XOR<Prisma.pallet_itemsCreateWithoutPalletsInput, Prisma.pallet_itemsUncheckedCreateWithoutPalletsInput> | Prisma.pallet_itemsCreateWithoutPalletsInput[] | Prisma.pallet_itemsUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.pallet_itemsCreateOrConnectWithoutPalletsInput | Prisma.pallet_itemsCreateOrConnectWithoutPalletsInput[];
    createMany?: Prisma.pallet_itemsCreateManyPalletsInputEnvelope;
    connect?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
};
export type pallet_itemsUpdateManyWithoutPalletsNestedInput = {
    create?: Prisma.XOR<Prisma.pallet_itemsCreateWithoutPalletsInput, Prisma.pallet_itemsUncheckedCreateWithoutPalletsInput> | Prisma.pallet_itemsCreateWithoutPalletsInput[] | Prisma.pallet_itemsUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.pallet_itemsCreateOrConnectWithoutPalletsInput | Prisma.pallet_itemsCreateOrConnectWithoutPalletsInput[];
    upsert?: Prisma.pallet_itemsUpsertWithWhereUniqueWithoutPalletsInput | Prisma.pallet_itemsUpsertWithWhereUniqueWithoutPalletsInput[];
    createMany?: Prisma.pallet_itemsCreateManyPalletsInputEnvelope;
    set?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    disconnect?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    delete?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    connect?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    update?: Prisma.pallet_itemsUpdateWithWhereUniqueWithoutPalletsInput | Prisma.pallet_itemsUpdateWithWhereUniqueWithoutPalletsInput[];
    updateMany?: Prisma.pallet_itemsUpdateManyWithWhereWithoutPalletsInput | Prisma.pallet_itemsUpdateManyWithWhereWithoutPalletsInput[];
    deleteMany?: Prisma.pallet_itemsScalarWhereInput | Prisma.pallet_itemsScalarWhereInput[];
};
export type pallet_itemsUncheckedUpdateManyWithoutPalletsNestedInput = {
    create?: Prisma.XOR<Prisma.pallet_itemsCreateWithoutPalletsInput, Prisma.pallet_itemsUncheckedCreateWithoutPalletsInput> | Prisma.pallet_itemsCreateWithoutPalletsInput[] | Prisma.pallet_itemsUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.pallet_itemsCreateOrConnectWithoutPalletsInput | Prisma.pallet_itemsCreateOrConnectWithoutPalletsInput[];
    upsert?: Prisma.pallet_itemsUpsertWithWhereUniqueWithoutPalletsInput | Prisma.pallet_itemsUpsertWithWhereUniqueWithoutPalletsInput[];
    createMany?: Prisma.pallet_itemsCreateManyPalletsInputEnvelope;
    set?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    disconnect?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    delete?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    connect?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    update?: Prisma.pallet_itemsUpdateWithWhereUniqueWithoutPalletsInput | Prisma.pallet_itemsUpdateWithWhereUniqueWithoutPalletsInput[];
    updateMany?: Prisma.pallet_itemsUpdateManyWithWhereWithoutPalletsInput | Prisma.pallet_itemsUpdateManyWithWhereWithoutPalletsInput[];
    deleteMany?: Prisma.pallet_itemsScalarWhereInput | Prisma.pallet_itemsScalarWhereInput[];
};
export type pallet_itemsCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.pallet_itemsCreateWithoutProductsInput, Prisma.pallet_itemsUncheckedCreateWithoutProductsInput> | Prisma.pallet_itemsCreateWithoutProductsInput[] | Prisma.pallet_itemsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.pallet_itemsCreateOrConnectWithoutProductsInput | Prisma.pallet_itemsCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.pallet_itemsCreateManyProductsInputEnvelope;
    connect?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
};
export type pallet_itemsUncheckedCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.pallet_itemsCreateWithoutProductsInput, Prisma.pallet_itemsUncheckedCreateWithoutProductsInput> | Prisma.pallet_itemsCreateWithoutProductsInput[] | Prisma.pallet_itemsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.pallet_itemsCreateOrConnectWithoutProductsInput | Prisma.pallet_itemsCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.pallet_itemsCreateManyProductsInputEnvelope;
    connect?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
};
export type pallet_itemsUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.pallet_itemsCreateWithoutProductsInput, Prisma.pallet_itemsUncheckedCreateWithoutProductsInput> | Prisma.pallet_itemsCreateWithoutProductsInput[] | Prisma.pallet_itemsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.pallet_itemsCreateOrConnectWithoutProductsInput | Prisma.pallet_itemsCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.pallet_itemsUpsertWithWhereUniqueWithoutProductsInput | Prisma.pallet_itemsUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.pallet_itemsCreateManyProductsInputEnvelope;
    set?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    disconnect?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    delete?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    connect?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    update?: Prisma.pallet_itemsUpdateWithWhereUniqueWithoutProductsInput | Prisma.pallet_itemsUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.pallet_itemsUpdateManyWithWhereWithoutProductsInput | Prisma.pallet_itemsUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.pallet_itemsScalarWhereInput | Prisma.pallet_itemsScalarWhereInput[];
};
export type pallet_itemsUncheckedUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.pallet_itemsCreateWithoutProductsInput, Prisma.pallet_itemsUncheckedCreateWithoutProductsInput> | Prisma.pallet_itemsCreateWithoutProductsInput[] | Prisma.pallet_itemsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.pallet_itemsCreateOrConnectWithoutProductsInput | Prisma.pallet_itemsCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.pallet_itemsUpsertWithWhereUniqueWithoutProductsInput | Prisma.pallet_itemsUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.pallet_itemsCreateManyProductsInputEnvelope;
    set?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    disconnect?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    delete?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    connect?: Prisma.pallet_itemsWhereUniqueInput | Prisma.pallet_itemsWhereUniqueInput[];
    update?: Prisma.pallet_itemsUpdateWithWhereUniqueWithoutProductsInput | Prisma.pallet_itemsUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.pallet_itemsUpdateManyWithWhereWithoutProductsInput | Prisma.pallet_itemsUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.pallet_itemsScalarWhereInput | Prisma.pallet_itemsScalarWhereInput[];
};
export type pallet_itemsCreateWithoutPalletsInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    products: Prisma.productsCreateNestedOneWithoutPallet_itemsInput;
};
export type pallet_itemsUncheckedCreateWithoutPalletsInput = {
    id?: string;
    product_id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsCreateOrConnectWithoutPalletsInput = {
    where: Prisma.pallet_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.pallet_itemsCreateWithoutPalletsInput, Prisma.pallet_itemsUncheckedCreateWithoutPalletsInput>;
};
export type pallet_itemsCreateManyPalletsInputEnvelope = {
    data: Prisma.pallet_itemsCreateManyPalletsInput | Prisma.pallet_itemsCreateManyPalletsInput[];
    skipDuplicates?: boolean;
};
export type pallet_itemsUpsertWithWhereUniqueWithoutPalletsInput = {
    where: Prisma.pallet_itemsWhereUniqueInput;
    update: Prisma.XOR<Prisma.pallet_itemsUpdateWithoutPalletsInput, Prisma.pallet_itemsUncheckedUpdateWithoutPalletsInput>;
    create: Prisma.XOR<Prisma.pallet_itemsCreateWithoutPalletsInput, Prisma.pallet_itemsUncheckedCreateWithoutPalletsInput>;
};
export type pallet_itemsUpdateWithWhereUniqueWithoutPalletsInput = {
    where: Prisma.pallet_itemsWhereUniqueInput;
    data: Prisma.XOR<Prisma.pallet_itemsUpdateWithoutPalletsInput, Prisma.pallet_itemsUncheckedUpdateWithoutPalletsInput>;
};
export type pallet_itemsUpdateManyWithWhereWithoutPalletsInput = {
    where: Prisma.pallet_itemsScalarWhereInput;
    data: Prisma.XOR<Prisma.pallet_itemsUpdateManyMutationInput, Prisma.pallet_itemsUncheckedUpdateManyWithoutPalletsInput>;
};
export type pallet_itemsScalarWhereInput = {
    AND?: Prisma.pallet_itemsScalarWhereInput | Prisma.pallet_itemsScalarWhereInput[];
    OR?: Prisma.pallet_itemsScalarWhereInput[];
    NOT?: Prisma.pallet_itemsScalarWhereInput | Prisma.pallet_itemsScalarWhereInput[];
    id?: Prisma.UuidFilter<"pallet_items"> | string;
    pallet_id?: Prisma.UuidFilter<"pallet_items"> | string;
    product_id?: Prisma.UuidFilter<"pallet_items"> | string;
    quantity?: Prisma.DecimalFilter<"pallet_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsCreateWithoutProductsInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    pallets: Prisma.palletsCreateNestedOneWithoutPallet_itemsInput;
};
export type pallet_itemsUncheckedCreateWithoutProductsInput = {
    id?: string;
    pallet_id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsCreateOrConnectWithoutProductsInput = {
    where: Prisma.pallet_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.pallet_itemsCreateWithoutProductsInput, Prisma.pallet_itemsUncheckedCreateWithoutProductsInput>;
};
export type pallet_itemsCreateManyProductsInputEnvelope = {
    data: Prisma.pallet_itemsCreateManyProductsInput | Prisma.pallet_itemsCreateManyProductsInput[];
    skipDuplicates?: boolean;
};
export type pallet_itemsUpsertWithWhereUniqueWithoutProductsInput = {
    where: Prisma.pallet_itemsWhereUniqueInput;
    update: Prisma.XOR<Prisma.pallet_itemsUpdateWithoutProductsInput, Prisma.pallet_itemsUncheckedUpdateWithoutProductsInput>;
    create: Prisma.XOR<Prisma.pallet_itemsCreateWithoutProductsInput, Prisma.pallet_itemsUncheckedCreateWithoutProductsInput>;
};
export type pallet_itemsUpdateWithWhereUniqueWithoutProductsInput = {
    where: Prisma.pallet_itemsWhereUniqueInput;
    data: Prisma.XOR<Prisma.pallet_itemsUpdateWithoutProductsInput, Prisma.pallet_itemsUncheckedUpdateWithoutProductsInput>;
};
export type pallet_itemsUpdateManyWithWhereWithoutProductsInput = {
    where: Prisma.pallet_itemsScalarWhereInput;
    data: Prisma.XOR<Prisma.pallet_itemsUpdateManyMutationInput, Prisma.pallet_itemsUncheckedUpdateManyWithoutProductsInput>;
};
export type pallet_itemsCreateManyPalletsInput = {
    id?: string;
    product_id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsUpdateWithoutPalletsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    products?: Prisma.productsUpdateOneRequiredWithoutPallet_itemsNestedInput;
};
export type pallet_itemsUncheckedUpdateWithoutPalletsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsUncheckedUpdateManyWithoutPalletsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsCreateManyProductsInput = {
    id?: string;
    pallet_id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    pallets?: Prisma.palletsUpdateOneRequiredWithoutPallet_itemsNestedInput;
};
export type pallet_itemsUncheckedUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsUncheckedUpdateManyWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type pallet_itemsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    pallet_id?: boolean;
    product_id?: boolean;
    quantity?: boolean;
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["pallet_items"]>;
export type pallet_itemsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    pallet_id?: boolean;
    product_id?: boolean;
    quantity?: boolean;
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["pallet_items"]>;
export type pallet_itemsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    pallet_id?: boolean;
    product_id?: boolean;
    quantity?: boolean;
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["pallet_items"]>;
export type pallet_itemsSelectScalar = {
    id?: boolean;
    pallet_id?: boolean;
    product_id?: boolean;
    quantity?: boolean;
};
export type pallet_itemsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "pallet_id" | "product_id" | "quantity", ExtArgs["result"]["pallet_items"]>;
export type pallet_itemsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
};
export type pallet_itemsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
};
export type pallet_itemsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
};
export type $pallet_itemsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "pallet_items";
    objects: {
        pallets: Prisma.$palletsPayload<ExtArgs>;
        products: Prisma.$productsPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        pallet_id: string;
        product_id: string;
        quantity: runtime.Decimal;
    }, ExtArgs["result"]["pallet_items"]>;
    composites: {};
};
export type pallet_itemsGetPayload<S extends boolean | null | undefined | pallet_itemsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$pallet_itemsPayload, S>;
export type pallet_itemsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<pallet_itemsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Pallet_itemsCountAggregateInputType | true;
};
export interface pallet_itemsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['pallet_items'];
        meta: {
            name: 'pallet_items';
        };
    };
    findUnique<T extends pallet_itemsFindUniqueArgs>(args: Prisma.SelectSubset<T, pallet_itemsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__pallet_itemsClient<runtime.Types.Result.GetResult<Prisma.$pallet_itemsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends pallet_itemsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, pallet_itemsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__pallet_itemsClient<runtime.Types.Result.GetResult<Prisma.$pallet_itemsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends pallet_itemsFindFirstArgs>(args?: Prisma.SelectSubset<T, pallet_itemsFindFirstArgs<ExtArgs>>): Prisma.Prisma__pallet_itemsClient<runtime.Types.Result.GetResult<Prisma.$pallet_itemsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends pallet_itemsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, pallet_itemsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__pallet_itemsClient<runtime.Types.Result.GetResult<Prisma.$pallet_itemsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends pallet_itemsFindManyArgs>(args?: Prisma.SelectSubset<T, pallet_itemsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$pallet_itemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends pallet_itemsCreateArgs>(args: Prisma.SelectSubset<T, pallet_itemsCreateArgs<ExtArgs>>): Prisma.Prisma__pallet_itemsClient<runtime.Types.Result.GetResult<Prisma.$pallet_itemsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends pallet_itemsCreateManyArgs>(args?: Prisma.SelectSubset<T, pallet_itemsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends pallet_itemsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, pallet_itemsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$pallet_itemsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends pallet_itemsDeleteArgs>(args: Prisma.SelectSubset<T, pallet_itemsDeleteArgs<ExtArgs>>): Prisma.Prisma__pallet_itemsClient<runtime.Types.Result.GetResult<Prisma.$pallet_itemsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends pallet_itemsUpdateArgs>(args: Prisma.SelectSubset<T, pallet_itemsUpdateArgs<ExtArgs>>): Prisma.Prisma__pallet_itemsClient<runtime.Types.Result.GetResult<Prisma.$pallet_itemsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends pallet_itemsDeleteManyArgs>(args?: Prisma.SelectSubset<T, pallet_itemsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends pallet_itemsUpdateManyArgs>(args: Prisma.SelectSubset<T, pallet_itemsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends pallet_itemsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, pallet_itemsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$pallet_itemsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends pallet_itemsUpsertArgs>(args: Prisma.SelectSubset<T, pallet_itemsUpsertArgs<ExtArgs>>): Prisma.Prisma__pallet_itemsClient<runtime.Types.Result.GetResult<Prisma.$pallet_itemsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends pallet_itemsCountArgs>(args?: Prisma.Subset<T, pallet_itemsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Pallet_itemsCountAggregateOutputType> : number>;
    aggregate<T extends Pallet_itemsAggregateArgs>(args: Prisma.Subset<T, Pallet_itemsAggregateArgs>): Prisma.PrismaPromise<GetPallet_itemsAggregateType<T>>;
    groupBy<T extends pallet_itemsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: pallet_itemsGroupByArgs['orderBy'];
    } : {
        orderBy?: pallet_itemsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, pallet_itemsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPallet_itemsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: pallet_itemsFieldRefs;
}
export interface Prisma__pallet_itemsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    pallets<T extends Prisma.palletsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.palletsDefaultArgs<ExtArgs>>): Prisma.Prisma__palletsClient<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    products<T extends Prisma.productsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.productsDefaultArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface pallet_itemsFieldRefs {
    readonly id: Prisma.FieldRef<"pallet_items", 'String'>;
    readonly pallet_id: Prisma.FieldRef<"pallet_items", 'String'>;
    readonly product_id: Prisma.FieldRef<"pallet_items", 'String'>;
    readonly quantity: Prisma.FieldRef<"pallet_items", 'Decimal'>;
}
export type pallet_itemsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.pallet_itemsSelect<ExtArgs> | null;
    omit?: Prisma.pallet_itemsOmit<ExtArgs> | null;
    include?: Prisma.pallet_itemsInclude<ExtArgs> | null;
    where: Prisma.pallet_itemsWhereUniqueInput;
};
export type pallet_itemsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.pallet_itemsSelect<ExtArgs> | null;
    omit?: Prisma.pallet_itemsOmit<ExtArgs> | null;
    include?: Prisma.pallet_itemsInclude<ExtArgs> | null;
    where: Prisma.pallet_itemsWhereUniqueInput;
};
export type pallet_itemsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type pallet_itemsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type pallet_itemsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type pallet_itemsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.pallet_itemsSelect<ExtArgs> | null;
    omit?: Prisma.pallet_itemsOmit<ExtArgs> | null;
    include?: Prisma.pallet_itemsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.pallet_itemsCreateInput, Prisma.pallet_itemsUncheckedCreateInput>;
};
export type pallet_itemsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.pallet_itemsCreateManyInput | Prisma.pallet_itemsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type pallet_itemsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.pallet_itemsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.pallet_itemsOmit<ExtArgs> | null;
    data: Prisma.pallet_itemsCreateManyInput | Prisma.pallet_itemsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.pallet_itemsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type pallet_itemsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.pallet_itemsSelect<ExtArgs> | null;
    omit?: Prisma.pallet_itemsOmit<ExtArgs> | null;
    include?: Prisma.pallet_itemsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.pallet_itemsUpdateInput, Prisma.pallet_itemsUncheckedUpdateInput>;
    where: Prisma.pallet_itemsWhereUniqueInput;
};
export type pallet_itemsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.pallet_itemsUpdateManyMutationInput, Prisma.pallet_itemsUncheckedUpdateManyInput>;
    where?: Prisma.pallet_itemsWhereInput;
    limit?: number;
};
export type pallet_itemsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.pallet_itemsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.pallet_itemsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.pallet_itemsUpdateManyMutationInput, Prisma.pallet_itemsUncheckedUpdateManyInput>;
    where?: Prisma.pallet_itemsWhereInput;
    limit?: number;
    include?: Prisma.pallet_itemsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type pallet_itemsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.pallet_itemsSelect<ExtArgs> | null;
    omit?: Prisma.pallet_itemsOmit<ExtArgs> | null;
    include?: Prisma.pallet_itemsInclude<ExtArgs> | null;
    where: Prisma.pallet_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.pallet_itemsCreateInput, Prisma.pallet_itemsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.pallet_itemsUpdateInput, Prisma.pallet_itemsUncheckedUpdateInput>;
};
export type pallet_itemsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.pallet_itemsSelect<ExtArgs> | null;
    omit?: Prisma.pallet_itemsOmit<ExtArgs> | null;
    include?: Prisma.pallet_itemsInclude<ExtArgs> | null;
    where: Prisma.pallet_itemsWhereUniqueInput;
};
export type pallet_itemsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.pallet_itemsWhereInput;
    limit?: number;
};
export type pallet_itemsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.pallet_itemsSelect<ExtArgs> | null;
    omit?: Prisma.pallet_itemsOmit<ExtArgs> | null;
    include?: Prisma.pallet_itemsInclude<ExtArgs> | null;
};
