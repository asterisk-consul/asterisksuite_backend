import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type cargo_transfer_itemsModel = runtime.Types.Result.DefaultSelection<Prisma.$cargo_transfer_itemsPayload>;
export type AggregateCargo_transfer_items = {
    _count: Cargo_transfer_itemsCountAggregateOutputType | null;
    _avg: Cargo_transfer_itemsAvgAggregateOutputType | null;
    _sum: Cargo_transfer_itemsSumAggregateOutputType | null;
    _min: Cargo_transfer_itemsMinAggregateOutputType | null;
    _max: Cargo_transfer_itemsMaxAggregateOutputType | null;
};
export type Cargo_transfer_itemsAvgAggregateOutputType = {
    quantity: runtime.Decimal | null;
};
export type Cargo_transfer_itemsSumAggregateOutputType = {
    quantity: runtime.Decimal | null;
};
export type Cargo_transfer_itemsMinAggregateOutputType = {
    id: string | null;
    transfer_id: string | null;
    pallet_id: string | null;
    delivery_note_id: string | null;
    quantity: runtime.Decimal | null;
};
export type Cargo_transfer_itemsMaxAggregateOutputType = {
    id: string | null;
    transfer_id: string | null;
    pallet_id: string | null;
    delivery_note_id: string | null;
    quantity: runtime.Decimal | null;
};
export type Cargo_transfer_itemsCountAggregateOutputType = {
    id: number;
    transfer_id: number;
    pallet_id: number;
    delivery_note_id: number;
    quantity: number;
    _all: number;
};
export type Cargo_transfer_itemsAvgAggregateInputType = {
    quantity?: true;
};
export type Cargo_transfer_itemsSumAggregateInputType = {
    quantity?: true;
};
export type Cargo_transfer_itemsMinAggregateInputType = {
    id?: true;
    transfer_id?: true;
    pallet_id?: true;
    delivery_note_id?: true;
    quantity?: true;
};
export type Cargo_transfer_itemsMaxAggregateInputType = {
    id?: true;
    transfer_id?: true;
    pallet_id?: true;
    delivery_note_id?: true;
    quantity?: true;
};
export type Cargo_transfer_itemsCountAggregateInputType = {
    id?: true;
    transfer_id?: true;
    pallet_id?: true;
    delivery_note_id?: true;
    quantity?: true;
    _all?: true;
};
export type Cargo_transfer_itemsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.cargo_transfer_itemsWhereInput;
    orderBy?: Prisma.cargo_transfer_itemsOrderByWithRelationInput | Prisma.cargo_transfer_itemsOrderByWithRelationInput[];
    cursor?: Prisma.cargo_transfer_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Cargo_transfer_itemsCountAggregateInputType;
    _avg?: Cargo_transfer_itemsAvgAggregateInputType;
    _sum?: Cargo_transfer_itemsSumAggregateInputType;
    _min?: Cargo_transfer_itemsMinAggregateInputType;
    _max?: Cargo_transfer_itemsMaxAggregateInputType;
};
export type GetCargo_transfer_itemsAggregateType<T extends Cargo_transfer_itemsAggregateArgs> = {
    [P in keyof T & keyof AggregateCargo_transfer_items]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCargo_transfer_items[P]> : Prisma.GetScalarType<T[P], AggregateCargo_transfer_items[P]>;
};
export type cargo_transfer_itemsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.cargo_transfer_itemsWhereInput;
    orderBy?: Prisma.cargo_transfer_itemsOrderByWithAggregationInput | Prisma.cargo_transfer_itemsOrderByWithAggregationInput[];
    by: Prisma.Cargo_transfer_itemsScalarFieldEnum[] | Prisma.Cargo_transfer_itemsScalarFieldEnum;
    having?: Prisma.cargo_transfer_itemsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Cargo_transfer_itemsCountAggregateInputType | true;
    _avg?: Cargo_transfer_itemsAvgAggregateInputType;
    _sum?: Cargo_transfer_itemsSumAggregateInputType;
    _min?: Cargo_transfer_itemsMinAggregateInputType;
    _max?: Cargo_transfer_itemsMaxAggregateInputType;
};
export type Cargo_transfer_itemsGroupByOutputType = {
    id: string;
    transfer_id: string;
    pallet_id: string | null;
    delivery_note_id: string | null;
    quantity: runtime.Decimal | null;
    _count: Cargo_transfer_itemsCountAggregateOutputType | null;
    _avg: Cargo_transfer_itemsAvgAggregateOutputType | null;
    _sum: Cargo_transfer_itemsSumAggregateOutputType | null;
    _min: Cargo_transfer_itemsMinAggregateOutputType | null;
    _max: Cargo_transfer_itemsMaxAggregateOutputType | null;
};
export type GetCargo_transfer_itemsGroupByPayload<T extends cargo_transfer_itemsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Cargo_transfer_itemsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Cargo_transfer_itemsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Cargo_transfer_itemsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Cargo_transfer_itemsGroupByOutputType[P]>;
}>>;
export type cargo_transfer_itemsWhereInput = {
    AND?: Prisma.cargo_transfer_itemsWhereInput | Prisma.cargo_transfer_itemsWhereInput[];
    OR?: Prisma.cargo_transfer_itemsWhereInput[];
    NOT?: Prisma.cargo_transfer_itemsWhereInput | Prisma.cargo_transfer_itemsWhereInput[];
    id?: Prisma.UuidFilter<"cargo_transfer_items"> | string;
    transfer_id?: Prisma.UuidFilter<"cargo_transfer_items"> | string;
    pallet_id?: Prisma.UuidNullableFilter<"cargo_transfer_items"> | string | null;
    delivery_note_id?: Prisma.UuidNullableFilter<"cargo_transfer_items"> | string | null;
    quantity?: Prisma.DecimalNullableFilter<"cargo_transfer_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    delivery_notes?: Prisma.XOR<Prisma.Delivery_notesNullableScalarRelationFilter, Prisma.delivery_notesWhereInput> | null;
    pallets?: Prisma.XOR<Prisma.PalletsNullableScalarRelationFilter, Prisma.palletsWhereInput> | null;
    cargo_transfers?: Prisma.XOR<Prisma.Cargo_transfersScalarRelationFilter, Prisma.cargo_transfersWhereInput>;
};
export type cargo_transfer_itemsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    transfer_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    delivery_note_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrderInput | Prisma.SortOrder;
    delivery_notes?: Prisma.delivery_notesOrderByWithRelationInput;
    pallets?: Prisma.palletsOrderByWithRelationInput;
    cargo_transfers?: Prisma.cargo_transfersOrderByWithRelationInput;
};
export type cargo_transfer_itemsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.cargo_transfer_itemsWhereInput | Prisma.cargo_transfer_itemsWhereInput[];
    OR?: Prisma.cargo_transfer_itemsWhereInput[];
    NOT?: Prisma.cargo_transfer_itemsWhereInput | Prisma.cargo_transfer_itemsWhereInput[];
    transfer_id?: Prisma.UuidFilter<"cargo_transfer_items"> | string;
    pallet_id?: Prisma.UuidNullableFilter<"cargo_transfer_items"> | string | null;
    delivery_note_id?: Prisma.UuidNullableFilter<"cargo_transfer_items"> | string | null;
    quantity?: Prisma.DecimalNullableFilter<"cargo_transfer_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    delivery_notes?: Prisma.XOR<Prisma.Delivery_notesNullableScalarRelationFilter, Prisma.delivery_notesWhereInput> | null;
    pallets?: Prisma.XOR<Prisma.PalletsNullableScalarRelationFilter, Prisma.palletsWhereInput> | null;
    cargo_transfers?: Prisma.XOR<Prisma.Cargo_transfersScalarRelationFilter, Prisma.cargo_transfersWhereInput>;
}, "id">;
export type cargo_transfer_itemsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    transfer_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    delivery_note_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.cargo_transfer_itemsCountOrderByAggregateInput;
    _avg?: Prisma.cargo_transfer_itemsAvgOrderByAggregateInput;
    _max?: Prisma.cargo_transfer_itemsMaxOrderByAggregateInput;
    _min?: Prisma.cargo_transfer_itemsMinOrderByAggregateInput;
    _sum?: Prisma.cargo_transfer_itemsSumOrderByAggregateInput;
};
export type cargo_transfer_itemsScalarWhereWithAggregatesInput = {
    AND?: Prisma.cargo_transfer_itemsScalarWhereWithAggregatesInput | Prisma.cargo_transfer_itemsScalarWhereWithAggregatesInput[];
    OR?: Prisma.cargo_transfer_itemsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.cargo_transfer_itemsScalarWhereWithAggregatesInput | Prisma.cargo_transfer_itemsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"cargo_transfer_items"> | string;
    transfer_id?: Prisma.UuidWithAggregatesFilter<"cargo_transfer_items"> | string;
    pallet_id?: Prisma.UuidNullableWithAggregatesFilter<"cargo_transfer_items"> | string | null;
    delivery_note_id?: Prisma.UuidNullableWithAggregatesFilter<"cargo_transfer_items"> | string | null;
    quantity?: Prisma.DecimalNullableWithAggregatesFilter<"cargo_transfer_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsCreateInput = {
    id?: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    delivery_notes?: Prisma.delivery_notesCreateNestedOneWithoutCargo_transfer_itemsInput;
    pallets?: Prisma.palletsCreateNestedOneWithoutCargo_transfer_itemsInput;
    cargo_transfers: Prisma.cargo_transfersCreateNestedOneWithoutCargo_transfer_itemsInput;
};
export type cargo_transfer_itemsUncheckedCreateInput = {
    id?: string;
    transfer_id: string;
    pallet_id?: string | null;
    delivery_note_id?: string | null;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    delivery_notes?: Prisma.delivery_notesUpdateOneWithoutCargo_transfer_itemsNestedInput;
    pallets?: Prisma.palletsUpdateOneWithoutCargo_transfer_itemsNestedInput;
    cargo_transfers?: Prisma.cargo_transfersUpdateOneRequiredWithoutCargo_transfer_itemsNestedInput;
};
export type cargo_transfer_itemsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    transfer_id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    delivery_note_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsCreateManyInput = {
    id?: string;
    transfer_id: string;
    pallet_id?: string | null;
    delivery_note_id?: string | null;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    transfer_id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    delivery_note_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    transfer_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    delivery_note_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type cargo_transfer_itemsAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type cargo_transfer_itemsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    transfer_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    delivery_note_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type cargo_transfer_itemsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    transfer_id?: Prisma.SortOrder;
    pallet_id?: Prisma.SortOrder;
    delivery_note_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
};
export type cargo_transfer_itemsSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type Cargo_transfer_itemsListRelationFilter = {
    every?: Prisma.cargo_transfer_itemsWhereInput;
    some?: Prisma.cargo_transfer_itemsWhereInput;
    none?: Prisma.cargo_transfer_itemsWhereInput;
};
export type cargo_transfer_itemsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type NullableDecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type cargo_transfer_itemsCreateNestedManyWithoutCargo_transfersInput = {
    create?: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutCargo_transfersInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutCargo_transfersInput> | Prisma.cargo_transfer_itemsCreateWithoutCargo_transfersInput[] | Prisma.cargo_transfer_itemsUncheckedCreateWithoutCargo_transfersInput[];
    connectOrCreate?: Prisma.cargo_transfer_itemsCreateOrConnectWithoutCargo_transfersInput | Prisma.cargo_transfer_itemsCreateOrConnectWithoutCargo_transfersInput[];
    createMany?: Prisma.cargo_transfer_itemsCreateManyCargo_transfersInputEnvelope;
    connect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
};
export type cargo_transfer_itemsUncheckedCreateNestedManyWithoutCargo_transfersInput = {
    create?: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutCargo_transfersInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutCargo_transfersInput> | Prisma.cargo_transfer_itemsCreateWithoutCargo_transfersInput[] | Prisma.cargo_transfer_itemsUncheckedCreateWithoutCargo_transfersInput[];
    connectOrCreate?: Prisma.cargo_transfer_itemsCreateOrConnectWithoutCargo_transfersInput | Prisma.cargo_transfer_itemsCreateOrConnectWithoutCargo_transfersInput[];
    createMany?: Prisma.cargo_transfer_itemsCreateManyCargo_transfersInputEnvelope;
    connect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
};
export type cargo_transfer_itemsUpdateManyWithoutCargo_transfersNestedInput = {
    create?: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutCargo_transfersInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutCargo_transfersInput> | Prisma.cargo_transfer_itemsCreateWithoutCargo_transfersInput[] | Prisma.cargo_transfer_itemsUncheckedCreateWithoutCargo_transfersInput[];
    connectOrCreate?: Prisma.cargo_transfer_itemsCreateOrConnectWithoutCargo_transfersInput | Prisma.cargo_transfer_itemsCreateOrConnectWithoutCargo_transfersInput[];
    upsert?: Prisma.cargo_transfer_itemsUpsertWithWhereUniqueWithoutCargo_transfersInput | Prisma.cargo_transfer_itemsUpsertWithWhereUniqueWithoutCargo_transfersInput[];
    createMany?: Prisma.cargo_transfer_itemsCreateManyCargo_transfersInputEnvelope;
    set?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    disconnect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    delete?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    connect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    update?: Prisma.cargo_transfer_itemsUpdateWithWhereUniqueWithoutCargo_transfersInput | Prisma.cargo_transfer_itemsUpdateWithWhereUniqueWithoutCargo_transfersInput[];
    updateMany?: Prisma.cargo_transfer_itemsUpdateManyWithWhereWithoutCargo_transfersInput | Prisma.cargo_transfer_itemsUpdateManyWithWhereWithoutCargo_transfersInput[];
    deleteMany?: Prisma.cargo_transfer_itemsScalarWhereInput | Prisma.cargo_transfer_itemsScalarWhereInput[];
};
export type cargo_transfer_itemsUncheckedUpdateManyWithoutCargo_transfersNestedInput = {
    create?: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutCargo_transfersInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutCargo_transfersInput> | Prisma.cargo_transfer_itemsCreateWithoutCargo_transfersInput[] | Prisma.cargo_transfer_itemsUncheckedCreateWithoutCargo_transfersInput[];
    connectOrCreate?: Prisma.cargo_transfer_itemsCreateOrConnectWithoutCargo_transfersInput | Prisma.cargo_transfer_itemsCreateOrConnectWithoutCargo_transfersInput[];
    upsert?: Prisma.cargo_transfer_itemsUpsertWithWhereUniqueWithoutCargo_transfersInput | Prisma.cargo_transfer_itemsUpsertWithWhereUniqueWithoutCargo_transfersInput[];
    createMany?: Prisma.cargo_transfer_itemsCreateManyCargo_transfersInputEnvelope;
    set?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    disconnect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    delete?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    connect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    update?: Prisma.cargo_transfer_itemsUpdateWithWhereUniqueWithoutCargo_transfersInput | Prisma.cargo_transfer_itemsUpdateWithWhereUniqueWithoutCargo_transfersInput[];
    updateMany?: Prisma.cargo_transfer_itemsUpdateManyWithWhereWithoutCargo_transfersInput | Prisma.cargo_transfer_itemsUpdateManyWithWhereWithoutCargo_transfersInput[];
    deleteMany?: Prisma.cargo_transfer_itemsScalarWhereInput | Prisma.cargo_transfer_itemsScalarWhereInput[];
};
export type cargo_transfer_itemsCreateNestedManyWithoutDelivery_notesInput = {
    create?: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutDelivery_notesInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutDelivery_notesInput> | Prisma.cargo_transfer_itemsCreateWithoutDelivery_notesInput[] | Prisma.cargo_transfer_itemsUncheckedCreateWithoutDelivery_notesInput[];
    connectOrCreate?: Prisma.cargo_transfer_itemsCreateOrConnectWithoutDelivery_notesInput | Prisma.cargo_transfer_itemsCreateOrConnectWithoutDelivery_notesInput[];
    createMany?: Prisma.cargo_transfer_itemsCreateManyDelivery_notesInputEnvelope;
    connect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
};
export type cargo_transfer_itemsUncheckedCreateNestedManyWithoutDelivery_notesInput = {
    create?: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutDelivery_notesInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutDelivery_notesInput> | Prisma.cargo_transfer_itemsCreateWithoutDelivery_notesInput[] | Prisma.cargo_transfer_itemsUncheckedCreateWithoutDelivery_notesInput[];
    connectOrCreate?: Prisma.cargo_transfer_itemsCreateOrConnectWithoutDelivery_notesInput | Prisma.cargo_transfer_itemsCreateOrConnectWithoutDelivery_notesInput[];
    createMany?: Prisma.cargo_transfer_itemsCreateManyDelivery_notesInputEnvelope;
    connect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
};
export type cargo_transfer_itemsUpdateManyWithoutDelivery_notesNestedInput = {
    create?: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutDelivery_notesInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutDelivery_notesInput> | Prisma.cargo_transfer_itemsCreateWithoutDelivery_notesInput[] | Prisma.cargo_transfer_itemsUncheckedCreateWithoutDelivery_notesInput[];
    connectOrCreate?: Prisma.cargo_transfer_itemsCreateOrConnectWithoutDelivery_notesInput | Prisma.cargo_transfer_itemsCreateOrConnectWithoutDelivery_notesInput[];
    upsert?: Prisma.cargo_transfer_itemsUpsertWithWhereUniqueWithoutDelivery_notesInput | Prisma.cargo_transfer_itemsUpsertWithWhereUniqueWithoutDelivery_notesInput[];
    createMany?: Prisma.cargo_transfer_itemsCreateManyDelivery_notesInputEnvelope;
    set?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    disconnect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    delete?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    connect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    update?: Prisma.cargo_transfer_itemsUpdateWithWhereUniqueWithoutDelivery_notesInput | Prisma.cargo_transfer_itemsUpdateWithWhereUniqueWithoutDelivery_notesInput[];
    updateMany?: Prisma.cargo_transfer_itemsUpdateManyWithWhereWithoutDelivery_notesInput | Prisma.cargo_transfer_itemsUpdateManyWithWhereWithoutDelivery_notesInput[];
    deleteMany?: Prisma.cargo_transfer_itemsScalarWhereInput | Prisma.cargo_transfer_itemsScalarWhereInput[];
};
export type cargo_transfer_itemsUncheckedUpdateManyWithoutDelivery_notesNestedInput = {
    create?: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutDelivery_notesInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutDelivery_notesInput> | Prisma.cargo_transfer_itemsCreateWithoutDelivery_notesInput[] | Prisma.cargo_transfer_itemsUncheckedCreateWithoutDelivery_notesInput[];
    connectOrCreate?: Prisma.cargo_transfer_itemsCreateOrConnectWithoutDelivery_notesInput | Prisma.cargo_transfer_itemsCreateOrConnectWithoutDelivery_notesInput[];
    upsert?: Prisma.cargo_transfer_itemsUpsertWithWhereUniqueWithoutDelivery_notesInput | Prisma.cargo_transfer_itemsUpsertWithWhereUniqueWithoutDelivery_notesInput[];
    createMany?: Prisma.cargo_transfer_itemsCreateManyDelivery_notesInputEnvelope;
    set?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    disconnect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    delete?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    connect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    update?: Prisma.cargo_transfer_itemsUpdateWithWhereUniqueWithoutDelivery_notesInput | Prisma.cargo_transfer_itemsUpdateWithWhereUniqueWithoutDelivery_notesInput[];
    updateMany?: Prisma.cargo_transfer_itemsUpdateManyWithWhereWithoutDelivery_notesInput | Prisma.cargo_transfer_itemsUpdateManyWithWhereWithoutDelivery_notesInput[];
    deleteMany?: Prisma.cargo_transfer_itemsScalarWhereInput | Prisma.cargo_transfer_itemsScalarWhereInput[];
};
export type cargo_transfer_itemsCreateNestedManyWithoutPalletsInput = {
    create?: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutPalletsInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutPalletsInput> | Prisma.cargo_transfer_itemsCreateWithoutPalletsInput[] | Prisma.cargo_transfer_itemsUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.cargo_transfer_itemsCreateOrConnectWithoutPalletsInput | Prisma.cargo_transfer_itemsCreateOrConnectWithoutPalletsInput[];
    createMany?: Prisma.cargo_transfer_itemsCreateManyPalletsInputEnvelope;
    connect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
};
export type cargo_transfer_itemsUncheckedCreateNestedManyWithoutPalletsInput = {
    create?: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutPalletsInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutPalletsInput> | Prisma.cargo_transfer_itemsCreateWithoutPalletsInput[] | Prisma.cargo_transfer_itemsUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.cargo_transfer_itemsCreateOrConnectWithoutPalletsInput | Prisma.cargo_transfer_itemsCreateOrConnectWithoutPalletsInput[];
    createMany?: Prisma.cargo_transfer_itemsCreateManyPalletsInputEnvelope;
    connect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
};
export type cargo_transfer_itemsUpdateManyWithoutPalletsNestedInput = {
    create?: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutPalletsInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutPalletsInput> | Prisma.cargo_transfer_itemsCreateWithoutPalletsInput[] | Prisma.cargo_transfer_itemsUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.cargo_transfer_itemsCreateOrConnectWithoutPalletsInput | Prisma.cargo_transfer_itemsCreateOrConnectWithoutPalletsInput[];
    upsert?: Prisma.cargo_transfer_itemsUpsertWithWhereUniqueWithoutPalletsInput | Prisma.cargo_transfer_itemsUpsertWithWhereUniqueWithoutPalletsInput[];
    createMany?: Prisma.cargo_transfer_itemsCreateManyPalletsInputEnvelope;
    set?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    disconnect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    delete?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    connect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    update?: Prisma.cargo_transfer_itemsUpdateWithWhereUniqueWithoutPalletsInput | Prisma.cargo_transfer_itemsUpdateWithWhereUniqueWithoutPalletsInput[];
    updateMany?: Prisma.cargo_transfer_itemsUpdateManyWithWhereWithoutPalletsInput | Prisma.cargo_transfer_itemsUpdateManyWithWhereWithoutPalletsInput[];
    deleteMany?: Prisma.cargo_transfer_itemsScalarWhereInput | Prisma.cargo_transfer_itemsScalarWhereInput[];
};
export type cargo_transfer_itemsUncheckedUpdateManyWithoutPalletsNestedInput = {
    create?: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutPalletsInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutPalletsInput> | Prisma.cargo_transfer_itemsCreateWithoutPalletsInput[] | Prisma.cargo_transfer_itemsUncheckedCreateWithoutPalletsInput[];
    connectOrCreate?: Prisma.cargo_transfer_itemsCreateOrConnectWithoutPalletsInput | Prisma.cargo_transfer_itemsCreateOrConnectWithoutPalletsInput[];
    upsert?: Prisma.cargo_transfer_itemsUpsertWithWhereUniqueWithoutPalletsInput | Prisma.cargo_transfer_itemsUpsertWithWhereUniqueWithoutPalletsInput[];
    createMany?: Prisma.cargo_transfer_itemsCreateManyPalletsInputEnvelope;
    set?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    disconnect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    delete?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    connect?: Prisma.cargo_transfer_itemsWhereUniqueInput | Prisma.cargo_transfer_itemsWhereUniqueInput[];
    update?: Prisma.cargo_transfer_itemsUpdateWithWhereUniqueWithoutPalletsInput | Prisma.cargo_transfer_itemsUpdateWithWhereUniqueWithoutPalletsInput[];
    updateMany?: Prisma.cargo_transfer_itemsUpdateManyWithWhereWithoutPalletsInput | Prisma.cargo_transfer_itemsUpdateManyWithWhereWithoutPalletsInput[];
    deleteMany?: Prisma.cargo_transfer_itemsScalarWhereInput | Prisma.cargo_transfer_itemsScalarWhereInput[];
};
export type cargo_transfer_itemsCreateWithoutCargo_transfersInput = {
    id?: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    delivery_notes?: Prisma.delivery_notesCreateNestedOneWithoutCargo_transfer_itemsInput;
    pallets?: Prisma.palletsCreateNestedOneWithoutCargo_transfer_itemsInput;
};
export type cargo_transfer_itemsUncheckedCreateWithoutCargo_transfersInput = {
    id?: string;
    pallet_id?: string | null;
    delivery_note_id?: string | null;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsCreateOrConnectWithoutCargo_transfersInput = {
    where: Prisma.cargo_transfer_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutCargo_transfersInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutCargo_transfersInput>;
};
export type cargo_transfer_itemsCreateManyCargo_transfersInputEnvelope = {
    data: Prisma.cargo_transfer_itemsCreateManyCargo_transfersInput | Prisma.cargo_transfer_itemsCreateManyCargo_transfersInput[];
    skipDuplicates?: boolean;
};
export type cargo_transfer_itemsUpsertWithWhereUniqueWithoutCargo_transfersInput = {
    where: Prisma.cargo_transfer_itemsWhereUniqueInput;
    update: Prisma.XOR<Prisma.cargo_transfer_itemsUpdateWithoutCargo_transfersInput, Prisma.cargo_transfer_itemsUncheckedUpdateWithoutCargo_transfersInput>;
    create: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutCargo_transfersInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutCargo_transfersInput>;
};
export type cargo_transfer_itemsUpdateWithWhereUniqueWithoutCargo_transfersInput = {
    where: Prisma.cargo_transfer_itemsWhereUniqueInput;
    data: Prisma.XOR<Prisma.cargo_transfer_itemsUpdateWithoutCargo_transfersInput, Prisma.cargo_transfer_itemsUncheckedUpdateWithoutCargo_transfersInput>;
};
export type cargo_transfer_itemsUpdateManyWithWhereWithoutCargo_transfersInput = {
    where: Prisma.cargo_transfer_itemsScalarWhereInput;
    data: Prisma.XOR<Prisma.cargo_transfer_itemsUpdateManyMutationInput, Prisma.cargo_transfer_itemsUncheckedUpdateManyWithoutCargo_transfersInput>;
};
export type cargo_transfer_itemsScalarWhereInput = {
    AND?: Prisma.cargo_transfer_itemsScalarWhereInput | Prisma.cargo_transfer_itemsScalarWhereInput[];
    OR?: Prisma.cargo_transfer_itemsScalarWhereInput[];
    NOT?: Prisma.cargo_transfer_itemsScalarWhereInput | Prisma.cargo_transfer_itemsScalarWhereInput[];
    id?: Prisma.UuidFilter<"cargo_transfer_items"> | string;
    transfer_id?: Prisma.UuidFilter<"cargo_transfer_items"> | string;
    pallet_id?: Prisma.UuidNullableFilter<"cargo_transfer_items"> | string | null;
    delivery_note_id?: Prisma.UuidNullableFilter<"cargo_transfer_items"> | string | null;
    quantity?: Prisma.DecimalNullableFilter<"cargo_transfer_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsCreateWithoutDelivery_notesInput = {
    id?: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    pallets?: Prisma.palletsCreateNestedOneWithoutCargo_transfer_itemsInput;
    cargo_transfers: Prisma.cargo_transfersCreateNestedOneWithoutCargo_transfer_itemsInput;
};
export type cargo_transfer_itemsUncheckedCreateWithoutDelivery_notesInput = {
    id?: string;
    transfer_id: string;
    pallet_id?: string | null;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsCreateOrConnectWithoutDelivery_notesInput = {
    where: Prisma.cargo_transfer_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutDelivery_notesInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutDelivery_notesInput>;
};
export type cargo_transfer_itemsCreateManyDelivery_notesInputEnvelope = {
    data: Prisma.cargo_transfer_itemsCreateManyDelivery_notesInput | Prisma.cargo_transfer_itemsCreateManyDelivery_notesInput[];
    skipDuplicates?: boolean;
};
export type cargo_transfer_itemsUpsertWithWhereUniqueWithoutDelivery_notesInput = {
    where: Prisma.cargo_transfer_itemsWhereUniqueInput;
    update: Prisma.XOR<Prisma.cargo_transfer_itemsUpdateWithoutDelivery_notesInput, Prisma.cargo_transfer_itemsUncheckedUpdateWithoutDelivery_notesInput>;
    create: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutDelivery_notesInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutDelivery_notesInput>;
};
export type cargo_transfer_itemsUpdateWithWhereUniqueWithoutDelivery_notesInput = {
    where: Prisma.cargo_transfer_itemsWhereUniqueInput;
    data: Prisma.XOR<Prisma.cargo_transfer_itemsUpdateWithoutDelivery_notesInput, Prisma.cargo_transfer_itemsUncheckedUpdateWithoutDelivery_notesInput>;
};
export type cargo_transfer_itemsUpdateManyWithWhereWithoutDelivery_notesInput = {
    where: Prisma.cargo_transfer_itemsScalarWhereInput;
    data: Prisma.XOR<Prisma.cargo_transfer_itemsUpdateManyMutationInput, Prisma.cargo_transfer_itemsUncheckedUpdateManyWithoutDelivery_notesInput>;
};
export type cargo_transfer_itemsCreateWithoutPalletsInput = {
    id?: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    delivery_notes?: Prisma.delivery_notesCreateNestedOneWithoutCargo_transfer_itemsInput;
    cargo_transfers: Prisma.cargo_transfersCreateNestedOneWithoutCargo_transfer_itemsInput;
};
export type cargo_transfer_itemsUncheckedCreateWithoutPalletsInput = {
    id?: string;
    transfer_id: string;
    delivery_note_id?: string | null;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsCreateOrConnectWithoutPalletsInput = {
    where: Prisma.cargo_transfer_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutPalletsInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutPalletsInput>;
};
export type cargo_transfer_itemsCreateManyPalletsInputEnvelope = {
    data: Prisma.cargo_transfer_itemsCreateManyPalletsInput | Prisma.cargo_transfer_itemsCreateManyPalletsInput[];
    skipDuplicates?: boolean;
};
export type cargo_transfer_itemsUpsertWithWhereUniqueWithoutPalletsInput = {
    where: Prisma.cargo_transfer_itemsWhereUniqueInput;
    update: Prisma.XOR<Prisma.cargo_transfer_itemsUpdateWithoutPalletsInput, Prisma.cargo_transfer_itemsUncheckedUpdateWithoutPalletsInput>;
    create: Prisma.XOR<Prisma.cargo_transfer_itemsCreateWithoutPalletsInput, Prisma.cargo_transfer_itemsUncheckedCreateWithoutPalletsInput>;
};
export type cargo_transfer_itemsUpdateWithWhereUniqueWithoutPalletsInput = {
    where: Prisma.cargo_transfer_itemsWhereUniqueInput;
    data: Prisma.XOR<Prisma.cargo_transfer_itemsUpdateWithoutPalletsInput, Prisma.cargo_transfer_itemsUncheckedUpdateWithoutPalletsInput>;
};
export type cargo_transfer_itemsUpdateManyWithWhereWithoutPalletsInput = {
    where: Prisma.cargo_transfer_itemsScalarWhereInput;
    data: Prisma.XOR<Prisma.cargo_transfer_itemsUpdateManyMutationInput, Prisma.cargo_transfer_itemsUncheckedUpdateManyWithoutPalletsInput>;
};
export type cargo_transfer_itemsCreateManyCargo_transfersInput = {
    id?: string;
    pallet_id?: string | null;
    delivery_note_id?: string | null;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsUpdateWithoutCargo_transfersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    delivery_notes?: Prisma.delivery_notesUpdateOneWithoutCargo_transfer_itemsNestedInput;
    pallets?: Prisma.palletsUpdateOneWithoutCargo_transfer_itemsNestedInput;
};
export type cargo_transfer_itemsUncheckedUpdateWithoutCargo_transfersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    delivery_note_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsUncheckedUpdateManyWithoutCargo_transfersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    delivery_note_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsCreateManyDelivery_notesInput = {
    id?: string;
    transfer_id: string;
    pallet_id?: string | null;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsUpdateWithoutDelivery_notesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    pallets?: Prisma.palletsUpdateOneWithoutCargo_transfer_itemsNestedInput;
    cargo_transfers?: Prisma.cargo_transfersUpdateOneRequiredWithoutCargo_transfer_itemsNestedInput;
};
export type cargo_transfer_itemsUncheckedUpdateWithoutDelivery_notesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    transfer_id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsUncheckedUpdateManyWithoutDelivery_notesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    transfer_id?: Prisma.StringFieldUpdateOperationsInput | string;
    pallet_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsCreateManyPalletsInput = {
    id?: string;
    transfer_id: string;
    delivery_note_id?: string | null;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsUpdateWithoutPalletsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    delivery_notes?: Prisma.delivery_notesUpdateOneWithoutCargo_transfer_itemsNestedInput;
    cargo_transfers?: Prisma.cargo_transfersUpdateOneRequiredWithoutCargo_transfer_itemsNestedInput;
};
export type cargo_transfer_itemsUncheckedUpdateWithoutPalletsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    transfer_id?: Prisma.StringFieldUpdateOperationsInput | string;
    delivery_note_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsUncheckedUpdateManyWithoutPalletsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    transfer_id?: Prisma.StringFieldUpdateOperationsInput | string;
    delivery_note_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type cargo_transfer_itemsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    transfer_id?: boolean;
    pallet_id?: boolean;
    delivery_note_id?: boolean;
    quantity?: boolean;
    delivery_notes?: boolean | Prisma.cargo_transfer_items$delivery_notesArgs<ExtArgs>;
    pallets?: boolean | Prisma.cargo_transfer_items$palletsArgs<ExtArgs>;
    cargo_transfers?: boolean | Prisma.cargo_transfersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cargo_transfer_items"]>;
export type cargo_transfer_itemsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    transfer_id?: boolean;
    pallet_id?: boolean;
    delivery_note_id?: boolean;
    quantity?: boolean;
    delivery_notes?: boolean | Prisma.cargo_transfer_items$delivery_notesArgs<ExtArgs>;
    pallets?: boolean | Prisma.cargo_transfer_items$palletsArgs<ExtArgs>;
    cargo_transfers?: boolean | Prisma.cargo_transfersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cargo_transfer_items"]>;
export type cargo_transfer_itemsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    transfer_id?: boolean;
    pallet_id?: boolean;
    delivery_note_id?: boolean;
    quantity?: boolean;
    delivery_notes?: boolean | Prisma.cargo_transfer_items$delivery_notesArgs<ExtArgs>;
    pallets?: boolean | Prisma.cargo_transfer_items$palletsArgs<ExtArgs>;
    cargo_transfers?: boolean | Prisma.cargo_transfersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["cargo_transfer_items"]>;
export type cargo_transfer_itemsSelectScalar = {
    id?: boolean;
    transfer_id?: boolean;
    pallet_id?: boolean;
    delivery_note_id?: boolean;
    quantity?: boolean;
};
export type cargo_transfer_itemsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "transfer_id" | "pallet_id" | "delivery_note_id" | "quantity", ExtArgs["result"]["cargo_transfer_items"]>;
export type cargo_transfer_itemsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    delivery_notes?: boolean | Prisma.cargo_transfer_items$delivery_notesArgs<ExtArgs>;
    pallets?: boolean | Prisma.cargo_transfer_items$palletsArgs<ExtArgs>;
    cargo_transfers?: boolean | Prisma.cargo_transfersDefaultArgs<ExtArgs>;
};
export type cargo_transfer_itemsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    delivery_notes?: boolean | Prisma.cargo_transfer_items$delivery_notesArgs<ExtArgs>;
    pallets?: boolean | Prisma.cargo_transfer_items$palletsArgs<ExtArgs>;
    cargo_transfers?: boolean | Prisma.cargo_transfersDefaultArgs<ExtArgs>;
};
export type cargo_transfer_itemsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    delivery_notes?: boolean | Prisma.cargo_transfer_items$delivery_notesArgs<ExtArgs>;
    pallets?: boolean | Prisma.cargo_transfer_items$palletsArgs<ExtArgs>;
    cargo_transfers?: boolean | Prisma.cargo_transfersDefaultArgs<ExtArgs>;
};
export type $cargo_transfer_itemsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "cargo_transfer_items";
    objects: {
        delivery_notes: Prisma.$delivery_notesPayload<ExtArgs> | null;
        pallets: Prisma.$palletsPayload<ExtArgs> | null;
        cargo_transfers: Prisma.$cargo_transfersPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        transfer_id: string;
        pallet_id: string | null;
        delivery_note_id: string | null;
        quantity: runtime.Decimal | null;
    }, ExtArgs["result"]["cargo_transfer_items"]>;
    composites: {};
};
export type cargo_transfer_itemsGetPayload<S extends boolean | null | undefined | cargo_transfer_itemsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$cargo_transfer_itemsPayload, S>;
export type cargo_transfer_itemsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<cargo_transfer_itemsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Cargo_transfer_itemsCountAggregateInputType | true;
};
export interface cargo_transfer_itemsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['cargo_transfer_items'];
        meta: {
            name: 'cargo_transfer_items';
        };
    };
    findUnique<T extends cargo_transfer_itemsFindUniqueArgs>(args: Prisma.SelectSubset<T, cargo_transfer_itemsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__cargo_transfer_itemsClient<runtime.Types.Result.GetResult<Prisma.$cargo_transfer_itemsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends cargo_transfer_itemsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, cargo_transfer_itemsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__cargo_transfer_itemsClient<runtime.Types.Result.GetResult<Prisma.$cargo_transfer_itemsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends cargo_transfer_itemsFindFirstArgs>(args?: Prisma.SelectSubset<T, cargo_transfer_itemsFindFirstArgs<ExtArgs>>): Prisma.Prisma__cargo_transfer_itemsClient<runtime.Types.Result.GetResult<Prisma.$cargo_transfer_itemsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends cargo_transfer_itemsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, cargo_transfer_itemsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__cargo_transfer_itemsClient<runtime.Types.Result.GetResult<Prisma.$cargo_transfer_itemsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends cargo_transfer_itemsFindManyArgs>(args?: Prisma.SelectSubset<T, cargo_transfer_itemsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$cargo_transfer_itemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends cargo_transfer_itemsCreateArgs>(args: Prisma.SelectSubset<T, cargo_transfer_itemsCreateArgs<ExtArgs>>): Prisma.Prisma__cargo_transfer_itemsClient<runtime.Types.Result.GetResult<Prisma.$cargo_transfer_itemsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends cargo_transfer_itemsCreateManyArgs>(args?: Prisma.SelectSubset<T, cargo_transfer_itemsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends cargo_transfer_itemsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, cargo_transfer_itemsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$cargo_transfer_itemsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends cargo_transfer_itemsDeleteArgs>(args: Prisma.SelectSubset<T, cargo_transfer_itemsDeleteArgs<ExtArgs>>): Prisma.Prisma__cargo_transfer_itemsClient<runtime.Types.Result.GetResult<Prisma.$cargo_transfer_itemsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends cargo_transfer_itemsUpdateArgs>(args: Prisma.SelectSubset<T, cargo_transfer_itemsUpdateArgs<ExtArgs>>): Prisma.Prisma__cargo_transfer_itemsClient<runtime.Types.Result.GetResult<Prisma.$cargo_transfer_itemsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends cargo_transfer_itemsDeleteManyArgs>(args?: Prisma.SelectSubset<T, cargo_transfer_itemsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends cargo_transfer_itemsUpdateManyArgs>(args: Prisma.SelectSubset<T, cargo_transfer_itemsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends cargo_transfer_itemsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, cargo_transfer_itemsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$cargo_transfer_itemsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends cargo_transfer_itemsUpsertArgs>(args: Prisma.SelectSubset<T, cargo_transfer_itemsUpsertArgs<ExtArgs>>): Prisma.Prisma__cargo_transfer_itemsClient<runtime.Types.Result.GetResult<Prisma.$cargo_transfer_itemsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends cargo_transfer_itemsCountArgs>(args?: Prisma.Subset<T, cargo_transfer_itemsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Cargo_transfer_itemsCountAggregateOutputType> : number>;
    aggregate<T extends Cargo_transfer_itemsAggregateArgs>(args: Prisma.Subset<T, Cargo_transfer_itemsAggregateArgs>): Prisma.PrismaPromise<GetCargo_transfer_itemsAggregateType<T>>;
    groupBy<T extends cargo_transfer_itemsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: cargo_transfer_itemsGroupByArgs['orderBy'];
    } : {
        orderBy?: cargo_transfer_itemsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, cargo_transfer_itemsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCargo_transfer_itemsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: cargo_transfer_itemsFieldRefs;
}
export interface Prisma__cargo_transfer_itemsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    delivery_notes<T extends Prisma.cargo_transfer_items$delivery_notesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.cargo_transfer_items$delivery_notesArgs<ExtArgs>>): Prisma.Prisma__delivery_notesClient<runtime.Types.Result.GetResult<Prisma.$delivery_notesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    pallets<T extends Prisma.cargo_transfer_items$palletsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.cargo_transfer_items$palletsArgs<ExtArgs>>): Prisma.Prisma__palletsClient<runtime.Types.Result.GetResult<Prisma.$palletsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    cargo_transfers<T extends Prisma.cargo_transfersDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.cargo_transfersDefaultArgs<ExtArgs>>): Prisma.Prisma__cargo_transfersClient<runtime.Types.Result.GetResult<Prisma.$cargo_transfersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface cargo_transfer_itemsFieldRefs {
    readonly id: Prisma.FieldRef<"cargo_transfer_items", 'String'>;
    readonly transfer_id: Prisma.FieldRef<"cargo_transfer_items", 'String'>;
    readonly pallet_id: Prisma.FieldRef<"cargo_transfer_items", 'String'>;
    readonly delivery_note_id: Prisma.FieldRef<"cargo_transfer_items", 'String'>;
    readonly quantity: Prisma.FieldRef<"cargo_transfer_items", 'Decimal'>;
}
export type cargo_transfer_itemsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.cargo_transfer_itemsSelect<ExtArgs> | null;
    omit?: Prisma.cargo_transfer_itemsOmit<ExtArgs> | null;
    include?: Prisma.cargo_transfer_itemsInclude<ExtArgs> | null;
    where: Prisma.cargo_transfer_itemsWhereUniqueInput;
};
export type cargo_transfer_itemsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.cargo_transfer_itemsSelect<ExtArgs> | null;
    omit?: Prisma.cargo_transfer_itemsOmit<ExtArgs> | null;
    include?: Prisma.cargo_transfer_itemsInclude<ExtArgs> | null;
    where: Prisma.cargo_transfer_itemsWhereUniqueInput;
};
export type cargo_transfer_itemsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type cargo_transfer_itemsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type cargo_transfer_itemsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type cargo_transfer_itemsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.cargo_transfer_itemsSelect<ExtArgs> | null;
    omit?: Prisma.cargo_transfer_itemsOmit<ExtArgs> | null;
    include?: Prisma.cargo_transfer_itemsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.cargo_transfer_itemsCreateInput, Prisma.cargo_transfer_itemsUncheckedCreateInput>;
};
export type cargo_transfer_itemsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.cargo_transfer_itemsCreateManyInput | Prisma.cargo_transfer_itemsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type cargo_transfer_itemsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.cargo_transfer_itemsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.cargo_transfer_itemsOmit<ExtArgs> | null;
    data: Prisma.cargo_transfer_itemsCreateManyInput | Prisma.cargo_transfer_itemsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.cargo_transfer_itemsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type cargo_transfer_itemsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.cargo_transfer_itemsSelect<ExtArgs> | null;
    omit?: Prisma.cargo_transfer_itemsOmit<ExtArgs> | null;
    include?: Prisma.cargo_transfer_itemsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.cargo_transfer_itemsUpdateInput, Prisma.cargo_transfer_itemsUncheckedUpdateInput>;
    where: Prisma.cargo_transfer_itemsWhereUniqueInput;
};
export type cargo_transfer_itemsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.cargo_transfer_itemsUpdateManyMutationInput, Prisma.cargo_transfer_itemsUncheckedUpdateManyInput>;
    where?: Prisma.cargo_transfer_itemsWhereInput;
    limit?: number;
};
export type cargo_transfer_itemsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.cargo_transfer_itemsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.cargo_transfer_itemsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.cargo_transfer_itemsUpdateManyMutationInput, Prisma.cargo_transfer_itemsUncheckedUpdateManyInput>;
    where?: Prisma.cargo_transfer_itemsWhereInput;
    limit?: number;
    include?: Prisma.cargo_transfer_itemsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type cargo_transfer_itemsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.cargo_transfer_itemsSelect<ExtArgs> | null;
    omit?: Prisma.cargo_transfer_itemsOmit<ExtArgs> | null;
    include?: Prisma.cargo_transfer_itemsInclude<ExtArgs> | null;
    where: Prisma.cargo_transfer_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.cargo_transfer_itemsCreateInput, Prisma.cargo_transfer_itemsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.cargo_transfer_itemsUpdateInput, Prisma.cargo_transfer_itemsUncheckedUpdateInput>;
};
export type cargo_transfer_itemsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.cargo_transfer_itemsSelect<ExtArgs> | null;
    omit?: Prisma.cargo_transfer_itemsOmit<ExtArgs> | null;
    include?: Prisma.cargo_transfer_itemsInclude<ExtArgs> | null;
    where: Prisma.cargo_transfer_itemsWhereUniqueInput;
};
export type cargo_transfer_itemsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.cargo_transfer_itemsWhereInput;
    limit?: number;
};
export type cargo_transfer_items$delivery_notesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.delivery_notesSelect<ExtArgs> | null;
    omit?: Prisma.delivery_notesOmit<ExtArgs> | null;
    include?: Prisma.delivery_notesInclude<ExtArgs> | null;
    where?: Prisma.delivery_notesWhereInput;
};
export type cargo_transfer_items$palletsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.palletsSelect<ExtArgs> | null;
    omit?: Prisma.palletsOmit<ExtArgs> | null;
    include?: Prisma.palletsInclude<ExtArgs> | null;
    where?: Prisma.palletsWhereInput;
};
export type cargo_transfer_itemsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.cargo_transfer_itemsSelect<ExtArgs> | null;
    omit?: Prisma.cargo_transfer_itemsOmit<ExtArgs> | null;
    include?: Prisma.cargo_transfer_itemsInclude<ExtArgs> | null;
};
