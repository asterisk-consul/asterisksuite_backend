import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type picking_sourcesModel = runtime.Types.Result.DefaultSelection<Prisma.$picking_sourcesPayload>;
export type AggregatePicking_sources = {
    _count: Picking_sourcesCountAggregateOutputType | null;
    _avg: Picking_sourcesAvgAggregateOutputType | null;
    _sum: Picking_sourcesSumAggregateOutputType | null;
    _min: Picking_sourcesMinAggregateOutputType | null;
    _max: Picking_sourcesMaxAggregateOutputType | null;
};
export type Picking_sourcesAvgAggregateOutputType = {
    quantity: runtime.Decimal | null;
};
export type Picking_sourcesSumAggregateOutputType = {
    quantity: runtime.Decimal | null;
};
export type Picking_sourcesMinAggregateOutputType = {
    id: string | null;
    picking_item_id: string | null;
    pallet_id: string | null;
    quantity: runtime.Decimal | null;
};
export type Picking_sourcesMaxAggregateOutputType = {
    id: string | null;
    picking_item_id: string | null;
    pallet_id: string | null;
    quantity: runtime.Decimal | null;
};
export type Picking_sourcesCountAggregateOutputType = {
    id: number;
    picking_item_id: number;
    pallet_id: number;
    quantity: number;
    _all: number;
};
export type Picking_sourcesAvgAggregateInputType = {
    quantity?: true;
};
export type Picking_sourcesSumAggregateInputType = {
    quantity?: true;
};
export type Picking_sourcesMinAggregateInputType = {
    id?: true;
    picking_item_id?: true;
    pallet_id?: true;
    quantity?: true;
};
export type Picking_sourcesMaxAggregateInputType = {
    id?: true;
    picking_item_id?: true;
    pallet_id?: true;
    quantity?: true;
};
export type Picking_sourcesCountAggregateInputType = {
    id?: true;
    picking_item_id?: true;
    pallet_id?: true;
    quantity?: true;
    _all?: true;
};
export type Picking_sourcesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.picking_sourcesWhereInput;
    orderBy?: Prisma.picking_sourcesOrderByWithRelationInput | Prisma.picking_sourcesOrderByWithRelationInput[];
    cursor?: Prisma.picking_sourcesWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Picking_sourcesCountAggregateInputType;
    _avg?: Picking_sourcesAvgAggregateInputType;
    _sum?: Picking_sourcesSumAggregateInputType;
    _min?: Picking_sourcesMinAggregateInputType;
    _max?: Picking_sourcesMaxAggregateInputType;
};
export type GetPicking_sourcesAggregateType<T extends Picking_sourcesAggregateArgs> = {
    [P in keyof T & keyof AggregatePicking_sources]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePicking_sources[P]> : Prisma.GetScalarType<T[P], AggregatePicking_sources[P]>;
};
export type picking_sourcesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.picking_sourcesWhereInput;
    orderBy?: Prisma.picking_sourcesOrderByWithAggregationInput | Prisma.picking_sourcesOrderByWithAggregationInput[];
    by: Prisma.Picking_sourcesScalarFieldEnum[] | Prisma.Picking_sourcesScalarFieldEnum;
    having?: Prisma.picking_sourcesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Picking_sourcesCountAggregateInputType | true;
    _avg?: Picking_sourcesAvgAggregateInputType;
    _sum?: Picking_sourcesSumAggregateInputType;
    _min?: Picking_sourcesMinAggregateInputType;
    _max?: Picking_sourcesMaxAggregateInputType;
};
export type Picking_sourcesGroupByOutputType = {
    id: string;
    picking_item_id: string;
    pallet_id: string;
    quantity: runtime.Decimal;
    _count: Picking_sourcesCountAggregateOutputType | null;
    _avg: Picking_sourcesAvgAggregateOutputType | null;
    _sum: Picking_sourcesSumAggregateOutputType | null;
    _min: Picking_sourcesMinAggregateOutputType | null;
    _max: Picking_sourcesMaxAggregateOutputType | null;
};
export type GetPicking_sourcesGroupByPayload<T extends picking_sourcesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Picking_sourcesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Picking_sourcesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Picking_sourcesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Picking_sourcesGroupByOutputType[P]>;
}>>;
export type picking_sourcesWhereInput = {
    AND?: Prisma.picking_sourcesWhereInput | Prisma.picking_sourcesWhereInput[];
    OR?: Prisma.picking_sourcesWhereInput[];
    NOT?: Prisma.picking_sourcesWhereInput | Prisma.picking_sourcesWhereInput[];
    id?: Prisma.UuidFilter<"picking_sources"> | string;
    picking_item_id?: Prisma.UuidFilter<"picking_sources"> | string;
    pallet_id?: Prisma.UuidFilter<"picking_sources"> | string;
    quantity?: Prisma.DecimalFilter<"picking_sources"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    pallets?: Prisma.XOR<Prisma.PalletsScalarRelationFilter, Prisma.palletsWhereInput>;
    picking_items?: Prisma.XOR<Prisma.Picking_itemsScalarRelationFilter, Prisma.picking_itemsWhereInput>;
};
export type picking_sourcesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    picking_item_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    pallets?: Prisma.palletsOrderByWithRelationInput;
    picking_items?: Prisma.picking_itemsOrderByWithRelationInput;
};
export type picking_sourcesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.picking_sourcesWhereInput | Prisma.picking_sourcesWhereInput[];
    OR?: Prisma.picking_sourcesWhereInput[];
    NOT?: Prisma.picking_sourcesWhereInput | Prisma.picking_sourcesWhereInput[];
    picking_item_id?: Prisma.UuidFilter<"picking_sources"> | string;
    pallet_id?: Prisma.UuidFilter<"picking_sources"> | string;
    quantity?: Prisma.DecimalFilter<"picking_sources"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    pallets?: Prisma.XOR<Prisma.PalletsScalarRelationFilter, Prisma.palletsWhereInput>;
    picking_items?: Prisma.XOR<Prisma.Picking_itemsScalarRelationFilter, Prisma.picking_itemsWhereInput>;
}, "id">;
export type picking_sourcesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    picking_item_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    _count?: Prisma.picking_sourcesCountOrderByAggregateInput;
    _avg?: Prisma.picking_sourcesAvgOrderByAggregateInput;
    _max?: Prisma.picking_sourcesMaxOrderByAggregateInput;
    _min?: Prisma.picking_sourcesMinOrderByAggregateInput;
    _sum?: Prisma.picking_sourcesSumOrderByAggregateInput;
};
export type picking_sourcesScalarWhereWithAggregatesInput = {
    AND?: Prisma.picking_sourcesScalarWhereWithAggregatesInput | Prisma.picking_sourcesScalarWhereWithAggregatesInput[];
    OR?: Prisma.picking_sourcesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.picking_sourcesScalarWhereWithAggregatesInput | Prisma.picking_sourcesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"picking_sources"> | string;
    picking_item_id?: Prisma.UuidWithAggregatesFilter<"picking_sources"> | string;
    pallet_id?: Prisma.UuidWithAggregatesFilter<"picking_sources"> | string;
    quantity?: Prisma.DecimalWithAggregatesFilter<"picking_sources"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type picking_sourcesCreateInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    pallets: Prisma.palletsCreateNestedOneWithoutPicking_sourcesInput;
    picking_items: Prisma.picking_itemsCreateNestedOneWithoutPicking_sourcesInput;
};
export type picking_sourcesUncheckedCreateInput = {
    id?: string;
    picking_item_id: string;
    pallet_id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type picking_sourcesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    pallets?: Prisma.palletsUpdateOneRequiredWithoutPicking_sourcesNestedInput;
    picking_items?: Prisma.picking_itemsUpdateOneRequiredWithoutPicking_sourcesNestedInput;
};
export type picking_sourcesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    picking_item_id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type picking_sourcesCreateManyInput = {
    id?: string;
    picking_item_id: string;
    pallet_id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type picking_sourcesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type picking_sourcesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    picking_item_id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type Picking_sourcesListRelationFilter = {
    every?: Prisma.picking_sourcesWhereInput;
    some?: Prisma.picking_sourcesWhereInput;
    none?: Prisma.picking_sourcesWhereInput;
};
export type picking_sourcesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type picking_sourcesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    picking_item_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type picking_sourcesAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type picking_sourcesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    picking_item_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type picking_sourcesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    picking_item_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type picking_sourcesSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type picking_sourcesCreateNestedManyWithoutPalletsInput = {
    create?: Prisma.XOR<Prisma.picking_sourcesCreateWithoutPalletsInput, Prisma.picking_sourcesUncheckedCreateWithoutPalletsInput> | Prisma.picking_sourcesCreateWithoutPalletsInput[] | Prisma.picking_sourcesUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.picking_sourcesCreateOrConnectWithoutPalletsInput | Prisma.picking_sourcesCreateOrConnectWithoutPalletsInput[];
    createMany?: Prisma.picking_sourcesCreateManyPalletsInputEnvelope;
    connect?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
};
export type picking_sourcesUncheckedCreateNestedManyWithoutPalletsInput = {
    create?: Prisma.XOR<Prisma.picking_sourcesCreateWithoutPalletsInput, Prisma.picking_sourcesUncheckedCreateWithoutPalletsInput> | Prisma.picking_sourcesCreateWithoutPalletsInput[] | Prisma.picking_sourcesUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.picking_sourcesCreateOrConnectWithoutPalletsInput | Prisma.picking_sourcesCreateOrConnectWithoutPalletsInput[];
    createMany?: Prisma.picking_sourcesCreateManyPalletsInputEnvelope;
    connect?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
};
export type picking_sourcesUpdateManyWithoutPalletsNestedInput = {
    create?: Prisma.XOR<Prisma.picking_sourcesCreateWithoutPalletsInput, Prisma.picking_sourcesUncheckedCreateWithoutPalletsInput> | Prisma.picking_sourcesCreateWithoutPalletsInput[] | Prisma.picking_sourcesUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.picking_sourcesCreateOrConnectWithoutPalletsInput | Prisma.picking_sourcesCreateOrConnectWithoutPalletsInput[];
    upsert?: Prisma.picking_sourcesUpsertWithWhereUniqueWithoutPalletsInput | Prisma.picking_sourcesUpsertWithWhereUniqueWithoutPalletsInput[];
    createMany?: Prisma.picking_sourcesCreateManyPalletsInputEnvelope;
    set?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    disconnect?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    delete?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    connect?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    update?: Prisma.picking_sourcesUpdateWithWhereUniqueWithoutPalletsInput | Prisma.picking_sourcesUpdateWithWhereUniqueWithoutPalletsInput[];
    updateMany?: Prisma.picking_sourcesUpdateManyWithWhereWithoutPalletsInput | Prisma.picking_sourcesUpdateManyWithWhereWithoutPalletsInput[];
    deleteMany?: Prisma.picking_sourcesScalarWhereInput | Prisma.picking_sourcesScalarWhereInput[];
};
export type picking_sourcesUncheckedUpdateManyWithoutPalletsNestedInput = {
    create?: Prisma.XOR<Prisma.picking_sourcesCreateWithoutPalletsInput, Prisma.picking_sourcesUncheckedCreateWithoutPalletsInput> | Prisma.picking_sourcesCreateWithoutPalletsInput[] | Prisma.picking_sourcesUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.picking_sourcesCreateOrConnectWithoutPalletsInput | Prisma.picking_sourcesCreateOrConnectWithoutPalletsInput[];
    upsert?: Prisma.picking_sourcesUpsertWithWhereUniqueWithoutPalletsInput | Prisma.picking_sourcesUpsertWithWhereUniqueWithoutPalletsInput[];
    createMany?: Prisma.picking_sourcesCreateManyPalletsInputEnvelope;
    set?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    disconnect?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    delete?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    connect?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    update?: Prisma.picking_sourcesUpdateWithWhereUniqueWithoutPalletsInput | Prisma.picking_sourcesUpdateWithWhereUniqueWithoutPalletsInput[];
    updateMany?: Prisma.picking_sourcesUpdateManyWithWhereWithoutPalletsInput | Prisma.picking_sourcesUpdateManyWithWhereWithoutPalletsInput[];
    deleteMany?: Prisma.picking_sourcesScalarWhereInput | Prisma.picking_sourcesScalarWhereInput[];
};
export type picking_sourcesCreateNestedManyWithoutPicking_itemsInput = {
    create?: Prisma.XOR<Prisma.picking_sourcesCreateWithoutPicking_itemsInput, Prisma.picking_sourcesUncheckedCreateWithoutPicking_itemsInput> | Prisma.picking_sourcesCreateWithoutPicking_itemsInput[] | Prisma.picking_sourcesUncheckedCreateWithoutPicking_itemsInput[];
    connectOrCreate?: Prisma.picking_sourcesCreateOrConnectWithoutPicking_itemsInput | Prisma.picking_sourcesCreateOrConnectWithoutPicking_itemsInput[];
    createMany?: Prisma.picking_sourcesCreateManyPicking_itemsInputEnvelope;
    connect?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
};
export type picking_sourcesUncheckedCreateNestedManyWithoutPicking_itemsInput = {
    create?: Prisma.XOR<Prisma.picking_sourcesCreateWithoutPicking_itemsInput, Prisma.picking_sourcesUncheckedCreateWithoutPicking_itemsInput> | Prisma.picking_sourcesCreateWithoutPicking_itemsInput[] | Prisma.picking_sourcesUncheckedCreateWithoutPicking_itemsInput[];
    connectOrCreate?: Prisma.picking_sourcesCreateOrConnectWithoutPicking_itemsInput | Prisma.picking_sourcesCreateOrConnectWithoutPicking_itemsInput[];
    createMany?: Prisma.picking_sourcesCreateManyPicking_itemsInputEnvelope;
    connect?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
};
export type picking_sourcesUpdateManyWithoutPicking_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.picking_sourcesCreateWithoutPicking_itemsInput, Prisma.picking_sourcesUncheckedCreateWithoutPicking_itemsInput> | Prisma.picking_sourcesCreateWithoutPicking_itemsInput[] | Prisma.picking_sourcesUncheckedCreateWithoutPicking_itemsInput[];
    connectOrCreate?: Prisma.picking_sourcesCreateOrConnectWithoutPicking_itemsInput | Prisma.picking_sourcesCreateOrConnectWithoutPicking_itemsInput[];
    upsert?: Prisma.picking_sourcesUpsertWithWhereUniqueWithoutPicking_itemsInput | Prisma.picking_sourcesUpsertWithWhereUniqueWithoutPicking_itemsInput[];
    createMany?: Prisma.picking_sourcesCreateManyPicking_itemsInputEnvelope;
    set?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    disconnect?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    delete?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    connect?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    update?: Prisma.picking_sourcesUpdateWithWhereUniqueWithoutPicking_itemsInput | Prisma.picking_sourcesUpdateWithWhereUniqueWithoutPicking_itemsInput[];
    updateMany?: Prisma.picking_sourcesUpdateManyWithWhereWithoutPicking_itemsInput | Prisma.picking_sourcesUpdateManyWithWhereWithoutPicking_itemsInput[];
    deleteMany?: Prisma.picking_sourcesScalarWhereInput | Prisma.picking_sourcesScalarWhereInput[];
};
export type picking_sourcesUncheckedUpdateManyWithoutPicking_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.picking_sourcesCreateWithoutPicking_itemsInput, Prisma.picking_sourcesUncheckedCreateWithoutPicking_itemsInput> | Prisma.picking_sourcesCreateWithoutPicking_itemsInput[] | Prisma.picking_sourcesUncheckedCreateWithoutPicking_itemsInput[];
    connectOrCreate?: Prisma.picking_sourcesCreateOrConnectWithoutPicking_itemsInput | Prisma.picking_sourcesCreateOrConnectWithoutPicking_itemsInput[];
    upsert?: Prisma.picking_sourcesUpsertWithWhereUniqueWithoutPicking_itemsInput | Prisma.picking_sourcesUpsertWithWhereUniqueWithoutPicking_itemsInput[];
    createMany?: Prisma.picking_sourcesCreateManyPicking_itemsInputEnvelope;
    set?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    disconnect?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    delete?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    connect?: Prisma.picking_sourcesWhereUniqueInput | Prisma.picking_sourcesWhereUniqueInput[];
    update?: Prisma.picking_sourcesUpdateWithWhereUniqueWithoutPicking_itemsInput | Prisma.picking_sourcesUpdateWithWhereUniqueWithoutPicking_itemsInput[];
    updateMany?: Prisma.picking_sourcesUpdateManyWithWhereWithoutPicking_itemsInput | Prisma.picking_sourcesUpdateManyWithWhereWithoutPicking_itemsInput[];
    deleteMany?: Prisma.picking_sourcesScalarWhereInput | Prisma.picking_sourcesScalarWhereInput[];
};
export type picking_sourcesCreateWithoutPalletsInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    picking_items: Prisma.picking_itemsCreateNestedOneWithoutPicking_sourcesInput;
};
export type picking_sourcesUncheckedCreateWithoutPalletsInput = {
    id?: string;
    picking_item_id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type picking_sourcesCreateOrConnectWithoutPalletsInput = {
    where: Prisma.picking_sourcesWhereUniqueInput;
    create: Prisma.XOR<Prisma.picking_sourcesCreateWithoutPalletsInput, Prisma.picking_sourcesUncheckedCreateWithoutPalletsInput>;
};
export type picking_sourcesCreateManyPalletsInputEnvelope = {
    data: Prisma.picking_sourcesCreateManyPalletsInput | Prisma.picking_sourcesCreateManyPalletsInput[];
    skipDuplicates?: boolean;
};
export type picking_sourcesUpsertWithWhereUniqueWithoutPalletsInput = {
    where: Prisma.picking_sourcesWhereUniqueInput;
    update: Prisma.XOR<Prisma.picking_sourcesUpdateWithoutPalletsInput, Prisma.picking_sourcesUncheckedUpdateWithoutPalletsInput>;
    create: Prisma.XOR<Prisma.picking_sourcesCreateWithoutPalletsInput, Prisma.picking_sourcesUncheckedCreateWithoutPalletsInput>;
};
export type picking_sourcesUpdateWithWhereUniqueWithoutPalletsInput = {
    where: Prisma.picking_sourcesWhereUniqueInput;
    data: Prisma.XOR<Prisma.picking_sourcesUpdateWithoutPalletsInput, Prisma.picking_sourcesUncheckedUpdateWithoutPalletsInput>;
};
export type picking_sourcesUpdateManyWithWhereWithoutPalletsInput = {
    where: Prisma.picking_sourcesScalarWhereInput;
    data: Prisma.XOR<Prisma.picking_sourcesUpdateManyMutationInput, Prisma.picking_sourcesUncheckedUpdateManyWithoutPalletsInput>;
};
export type picking_sourcesScalarWhereInput = {
    AND?: Prisma.picking_sourcesScalarWhereInput | Prisma.picking_sourcesScalarWhereInput[];
    OR?: Prisma.picking_sourcesScalarWhereInput[];
    NOT?: Prisma.picking_sourcesScalarWhereInput | Prisma.picking_sourcesScalarWhereInput[];
    id?: Prisma.UuidFilter<"picking_sources"> | string;
    picking_item_id?: Prisma.UuidFilter<"picking_sources"> | string;
    pallet_id?: Prisma.UuidFilter<"picking_sources"> | string;
    quantity?: Prisma.DecimalFilter<"picking_sources"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type picking_sourcesCreateWithoutPicking_itemsInput = {
    id?: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    pallets: Prisma.palletsCreateNestedOneWithoutPicking_sourcesInput;
};
export type picking_sourcesUncheckedCreateWithoutPicking_itemsInput = {
    id?: string;
    pallet_id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type picking_sourcesCreateOrConnectWithoutPicking_itemsInput = {
    where: Prisma.picking_sourcesWhereUniqueInput;
    create: Prisma.XOR<Prisma.picking_sourcesCreateWithoutPicking_itemsInput, Prisma.picking_sourcesUncheckedCreateWithoutPicking_itemsInput>;
};
export type picking_sourcesCreateManyPicking_itemsInputEnvelope = {
    data: Prisma.picking_sourcesCreateManyPicking_itemsInput | Prisma.picking_sourcesCreateManyPicking_itemsInput[];
    skipDuplicates?: boolean;
};
export type picking_sourcesUpsertWithWhereUniqueWithoutPicking_itemsInput = {
    where: Prisma.picking_sourcesWhereUniqueInput;
    update: Prisma.XOR<Prisma.picking_sourcesUpdateWithoutPicking_itemsInput, Prisma.picking_sourcesUncheckedUpdateWithoutPicking_itemsInput>;
    create: Prisma.XOR<Prisma.picking_sourcesCreateWithoutPicking_itemsInput, Prisma.picking_sourcesUncheckedCreateWithoutPicking_itemsInput>;
};
export type picking_sourcesUpdateWithWhereUniqueWithoutPicking_itemsInput = {
    where: Prisma.picking_sourcesWhereUniqueInput;
    data: Prisma.XOR<Prisma.picking_sourcesUpdateWithoutPicking_itemsInput, Prisma.picking_sourcesUncheckedUpdateWithoutPicking_itemsInput>;
};
export type picking_sourcesUpdateManyWithWhereWithoutPicking_itemsInput = {
    where: Prisma.picking_sourcesScalarWhereInput;
    data: Prisma.XOR<Prisma.picking_sourcesUpdateManyMutationInput, Prisma.picking_sourcesUncheckedUpdateManyWithoutPicking_itemsInput>;
};
export type picking_sourcesCreateManyPalletsInput = {
    id?: string;
    picking_item_id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type picking_sourcesUpdateWithoutPalletsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    picking_items?: Prisma.picking_itemsUpdateOneRequiredWithoutPicking_sourcesNestedInput;
};
export type picking_sourcesUncheckedUpdateWithoutPalletsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    picking_item_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type picking_sourcesUncheckedUpdateManyWithoutPalletsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    picking_item_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type picking_sourcesCreateManyPicking_itemsInput = {
    id?: string;
    pallet_id: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type picking_sourcesUpdateWithoutPicking_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    pallets?: Prisma.palletsUpdateOneRequiredWithoutPicking_sourcesNestedInput;
};
export type picking_sourcesUncheckedUpdateWithoutPicking_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type picking_sourcesUncheckedUpdateManyWithoutPicking_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type picking_sourcesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    picking_item_id?: boolean;
    pallet_id?: boolean;
    quantity?: boolean;
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    picking_items?: boolean | Prisma.picking_itemsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["picking_sources"]>;
export type picking_sourcesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    picking_item_id?: boolean;
    pallet_id?: boolean;
    quantity?: boolean;
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    picking_items?: boolean | Prisma.picking_itemsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["picking_sources"]>;
export type picking_sourcesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    picking_item_id?: boolean;
    pallet_id?: boolean;
    quantity?: boolean;
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    picking_items?: boolean | Prisma.picking_itemsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["picking_sources"]>;
export type picking_sourcesSelectScalar = {
    id?: boolean;
    picking_item_id?: boolean;
    pallet_id?: boolean;
    quantity?: boolean;
};
export type picking_sourcesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "picking_item_id" | "pallet_id" | "quantity", ExtArgs["result"]["picking_sources"]>;
export type picking_sourcesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    picking_items?: boolean | Prisma.picking_itemsDefaultArgs<ExtArgs>;
};
export type picking_sourcesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    picking_items?: boolean | Prisma.picking_itemsDefaultArgs<ExtArgs>;
};
export type picking_sourcesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pallets?: boolean | Prisma.palletsDefaultArgs<ExtArgs>;
    picking_items?: boolean | Prisma.picking_itemsDefaultArgs<ExtArgs>;
};
export type $picking_sourcesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "picking_sources";
    objects: {
        pallets: Prisma.$palletsPayload<ExtArgs>;
        picking_items: Prisma.$picking_itemsPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        picking_item_id: string;
        pallet_id: string;
        quantity: runtime.Decimal;
    }, ExtArgs["result"]["picking_sources"]>;
    composites: {};
};
export type picking_sourcesGetPayload<S extends boolean | null | undefined | picking_sourcesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$picking_sourcesPayload, S>;
export type picking_sourcesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<picking_sourcesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Picking_sourcesCountAggregateInputType | true;
};
export interface picking_sourcesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['picking_sources'];
        meta: {
            name: 'picking_sources';
        };
    };
    findUnique<T extends picking_sourcesFindUniqueArgs>(args: Prisma.SelectSubset<T, picking_sourcesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__picking_sourcesClient<runtime.Types.Result.GetResult<Prisma.$picking_sourcesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends picking_sourcesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, picking_sourcesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__picking_sourcesClient<runtime.Types.Result.GetResult<Prisma.$picking_sourcesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends picking_sourcesFindFirstArgs>(args?: Prisma.SelectSubset<T, picking_sourcesFindFirstArgs<ExtArgs>>): Prisma.Prisma__picking_sourcesClient<runtime.Types.Result.GetResult<Prisma.$picking_sourcesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends picking_sourcesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, picking_sourcesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__picking_sourcesClient<runtime.Types.Result.GetResult<Prisma.$picking_sourcesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends picking_sourcesFindManyArgs>(args?: Prisma.SelectSubset<T, picking_sourcesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$picking_sourcesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends picking_sourcesCreateArgs>(args: Prisma.SelectSubset<T, picking_sourcesCreateArgs<ExtArgs>>): Prisma.Prisma__picking_sourcesClient<runtime.Types.Result.GetResult<Prisma.$picking_sourcesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends picking_sourcesCreateManyArgs>(args?: Prisma.SelectSubset<T, picking_sourcesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends picking_sourcesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, picking_sourcesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$picking_sourcesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends picking_sourcesDeleteArgs>(args: Prisma.SelectSubset<T, picking_sourcesDeleteArgs<ExtArgs>>): Prisma.Prisma__picking_sourcesClient<runtime.Types.Result.GetResult<Prisma.$picking_sourcesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends picking_sourcesUpdateArgs>(args: Prisma.SelectSubset<T, picking_sourcesUpdateArgs<ExtArgs>>): Prisma.Prisma__picking_sourcesClient<runtime.Types.Result.GetResult<Prisma.$picking_sourcesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends picking_sourcesDeleteManyArgs>(args?: Prisma.SelectSubset<T, picking_sourcesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends picking_sourcesUpdateManyArgs>(args: Prisma.SelectSubset<T, picking_sourcesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends picking_sourcesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, picking_sourcesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$picking_sourcesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends picking_sourcesUpsertArgs>(args: Prisma.SelectSubset<T, picking_sourcesUpsertArgs<ExtArgs>>): Prisma.Prisma__picking_sourcesClient<runtime.Types.Result.GetResult<Prisma.$picking_sourcesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends picking_sourcesCountArgs>(args?: Prisma.Subset<T, picking_sourcesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Picking_sourcesCountAggregateOutputType> : number>;
    aggregate<T extends Picking_sourcesAggregateArgs>(args: Prisma.Subset<T, Picking_sourcesAggregateArgs>): Prisma.PrismaPromise<GetPicking_sourcesAggregateType<T>>;
    groupBy<T extends picking_sourcesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: picking_sourcesGroupByArgs['orderBy'];
    } : {
        orderBy?: picking_sourcesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, picking_sourcesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPicking_sourcesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: picking_sourcesFieldRefs;
}
export interface Prisma__picking_sourcesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    pallets<T extends Prisma.palletsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.palletsDefaultArgs<ExtArgs>>): Prisma.Prisma__palletsClient<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    picking_items<T extends Prisma.picking_itemsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.picking_itemsDefaultArgs<ExtArgs>>): Prisma.Prisma__picking_itemsClient<runtime.Types.Result.GetResult<Prisma.$picking_itemsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface picking_sourcesFieldRefs {
    readonly id: Prisma.FieldRef<"picking_sources", 'String'>;
    readonly picking_item_id: Prisma.FieldRef<"picking_sources", 'String'>;
    readonly pallet_id: Prisma.FieldRef<"picking_sources", 'String'>;
    readonly quantity: Prisma.FieldRef<"picking_sources", 'Decimal'>;
}
export type picking_sourcesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_sourcesSelect<ExtArgs> | null;
    omit?: Prisma.picking_sourcesOmit<ExtArgs> | null;
    include?: Prisma.picking_sourcesInclude<ExtArgs> | null;
    where: Prisma.picking_sourcesWhereUniqueInput;
};
export type picking_sourcesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_sourcesSelect<ExtArgs> | null;
    omit?: Prisma.picking_sourcesOmit<ExtArgs> | null;
    include?: Prisma.picking_sourcesInclude<ExtArgs> | null;
    where: Prisma.picking_sourcesWhereUniqueInput;
};
export type picking_sourcesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type picking_sourcesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type picking_sourcesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type picking_sourcesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_sourcesSelect<ExtArgs> | null;
    omit?: Prisma.picking_sourcesOmit<ExtArgs> | null;
    include?: Prisma.picking_sourcesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.picking_sourcesCreateInput, Prisma.picking_sourcesUncheckedCreateInput>;
};
export type picking_sourcesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.picking_sourcesCreateManyInput | Prisma.picking_sourcesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type picking_sourcesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_sourcesSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.picking_sourcesOmit<ExtArgs> | null;
    data: Prisma.picking_sourcesCreateManyInput | Prisma.picking_sourcesCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.picking_sourcesIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type picking_sourcesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_sourcesSelect<ExtArgs> | null;
    omit?: Prisma.picking_sourcesOmit<ExtArgs> | null;
    include?: Prisma.picking_sourcesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.picking_sourcesUpdateInput, Prisma.picking_sourcesUncheckedUpdateInput>;
    where: Prisma.picking_sourcesWhereUniqueInput;
};
export type picking_sourcesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.picking_sourcesUpdateManyMutationInput, Prisma.picking_sourcesUncheckedUpdateManyInput>;
    where?: Prisma.picking_sourcesWhereInput;
    limit?: number;
};
export type picking_sourcesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_sourcesSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.picking_sourcesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.picking_sourcesUpdateManyMutationInput, Prisma.picking_sourcesUncheckedUpdateManyInput>;
    where?: Prisma.picking_sourcesWhereInput;
    limit?: number;
    include?: Prisma.picking_sourcesIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type picking_sourcesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_sourcesSelect<ExtArgs> | null;
    omit?: Prisma.picking_sourcesOmit<ExtArgs> | null;
    include?: Prisma.picking_sourcesInclude<ExtArgs> | null;
    where: Prisma.picking_sourcesWhereUniqueInput;
    create: Prisma.XOR<Prisma.picking_sourcesCreateInput, Prisma.picking_sourcesUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.picking_sourcesUpdateInput, Prisma.picking_sourcesUncheckedUpdateInput>;
};
export type picking_sourcesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_sourcesSelect<ExtArgs> | null;
    omit?: Prisma.picking_sourcesOmit<ExtArgs> | null;
    include?: Prisma.picking_sourcesInclude<ExtArgs> | null;
    where: Prisma.picking_sourcesWhereUniqueInput;
};
export type picking_sourcesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.picking_sourcesWhereInput;
    limit?: number;
};
export type picking_sourcesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_sourcesSelect<ExtArgs> | null;
    omit?: Prisma.picking_sourcesOmit<ExtArgs> | null;
    include?: Prisma.picking_sourcesInclude<ExtArgs> | null;
};
