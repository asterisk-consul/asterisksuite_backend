import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type dispatch_ratesModel = runtime.Types.Result.DefaultSelection<Prisma.$dispatch_ratesPayload>;
export type AggregateDispatch_rates = {
    _count: Dispatch_ratesCountAggregateOutputType | null;
    _avg: Dispatch_ratesAvgAggregateOutputType | null;
    _sum: Dispatch_ratesSumAggregateOutputType | null;
    _min: Dispatch_ratesMinAggregateOutputType | null;
    _max: Dispatch_ratesMaxAggregateOutputType | null;
};
export type Dispatch_ratesAvgAggregateOutputType = {
    value: runtime.Decimal | null;
};
export type Dispatch_ratesSumAggregateOutputType = {
    value: runtime.Decimal | null;
};
export type Dispatch_ratesMinAggregateOutputType = {
    id: string | null;
    dispatch_id: string | null;
    rate_id: string | null;
    value: runtime.Decimal | null;
    created_at: Date | null;
};
export type Dispatch_ratesMaxAggregateOutputType = {
    id: string | null;
    dispatch_id: string | null;
    rate_id: string | null;
    value: runtime.Decimal | null;
    created_at: Date | null;
};
export type Dispatch_ratesCountAggregateOutputType = {
    id: number;
    dispatch_id: number;
    rate_id: number;
    value: number;
    created_at: number;
    _all: number;
};
export type Dispatch_ratesAvgAggregateInputType = {
    value?: true;
};
export type Dispatch_ratesSumAggregateInputType = {
    value?: true;
};
export type Dispatch_ratesMinAggregateInputType = {
    id?: true;
    dispatch_id?: true;
    rate_id?: true;
    value?: true;
    created_at?: true;
};
export type Dispatch_ratesMaxAggregateInputType = {
    id?: true;
    dispatch_id?: true;
    rate_id?: true;
    value?: true;
    created_at?: true;
};
export type Dispatch_ratesCountAggregateInputType = {
    id?: true;
    dispatch_id?: true;
    rate_id?: true;
    value?: true;
    created_at?: true;
    _all?: true;
};
export type Dispatch_ratesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.dispatch_ratesWhereInput;
    orderBy?: Prisma.dispatch_ratesOrderByWithRelationInput | Prisma.dispatch_ratesOrderByWithRelationInput[];
    cursor?: Prisma.dispatch_ratesWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Dispatch_ratesCountAggregateInputType;
    _avg?: Dispatch_ratesAvgAggregateInputType;
    _sum?: Dispatch_ratesSumAggregateInputType;
    _min?: Dispatch_ratesMinAggregateInputType;
    _max?: Dispatch_ratesMaxAggregateInputType;
};
export type GetDispatch_ratesAggregateType<T extends Dispatch_ratesAggregateArgs> = {
    [P in keyof T & keyof AggregateDispatch_rates]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDispatch_rates[P]> : Prisma.GetScalarType<T[P], AggregateDispatch_rates[P]>;
};
export type dispatch_ratesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.dispatch_ratesWhereInput;
    orderBy?: Prisma.dispatch_ratesOrderByWithAggregationInput | Prisma.dispatch_ratesOrderByWithAggregationInput[];
    by: Prisma.Dispatch_ratesScalarFieldEnum[] | Prisma.Dispatch_ratesScalarFieldEnum;
    having?: Prisma.dispatch_ratesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Dispatch_ratesCountAggregateInputType | true;
    _avg?: Dispatch_ratesAvgAggregateInputType;
    _sum?: Dispatch_ratesSumAggregateInputType;
    _min?: Dispatch_ratesMinAggregateInputType;
    _max?: Dispatch_ratesMaxAggregateInputType;
};
export type Dispatch_ratesGroupByOutputType = {
    id: string;
    dispatch_id: string;
    rate_id: string;
    value: runtime.Decimal;
    created_at: Date;
    _count: Dispatch_ratesCountAggregateOutputType | null;
    _avg: Dispatch_ratesAvgAggregateOutputType | null;
    _sum: Dispatch_ratesSumAggregateOutputType | null;
    _min: Dispatch_ratesMinAggregateOutputType | null;
    _max: Dispatch_ratesMaxAggregateOutputType | null;
};
export type GetDispatch_ratesGroupByPayload<T extends dispatch_ratesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Dispatch_ratesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Dispatch_ratesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Dispatch_ratesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Dispatch_ratesGroupByOutputType[P]>;
}>>;
export type dispatch_ratesWhereInput = {
    AND?: Prisma.dispatch_ratesWhereInput | Prisma.dispatch_ratesWhereInput[];
    OR?: Prisma.dispatch_ratesWhereInput[];
    NOT?: Prisma.dispatch_ratesWhereInput | Prisma.dispatch_ratesWhereInput[];
    id?: Prisma.UuidFilter<"dispatch_rates"> | string;
    dispatch_id?: Prisma.UuidFilter<"dispatch_rates"> | string;
    rate_id?: Prisma.UuidFilter<"dispatch_rates"> | string;
    value?: Prisma.DecimalFilter<"dispatch_rates"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFilter<"dispatch_rates"> | Date | string;
    dispatch_orders?: Prisma.XOR<Prisma.Dispatch_ordersScalarRelationFilter, Prisma.dispatch_ordersWhereInput>;
    transfer_rates?: Prisma.XOR<Prisma.Transfer_ratesScalarRelationFilter, Prisma.transfer_ratesWhereInput>;
};
export type dispatch_ratesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    dispatch_id?: Prisma.SortOrder;
    rate_id?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    dispatch_orders?: Prisma.dispatch_ordersOrderByWithRelationInput;
    transfer_rates?: Prisma.transfer_ratesOrderByWithRelationInput;
};
export type dispatch_ratesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.dispatch_ratesWhereInput | Prisma.dispatch_ratesWhereInput[];
    OR?: Prisma.dispatch_ratesWhereInput[];
    NOT?: Prisma.dispatch_ratesWhereInput | Prisma.dispatch_ratesWhereInput[];
    dispatch_id?: Prisma.UuidFilter<"dispatch_rates"> | string;
    rate_id?: Prisma.UuidFilter<"dispatch_rates"> | string;
    value?: Prisma.DecimalFilter<"dispatch_rates"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFilter<"dispatch_rates"> | Date | string;
    dispatch_orders?: Prisma.XOR<Prisma.Dispatch_ordersScalarRelationFilter, Prisma.dispatch_ordersWhereInput>;
    transfer_rates?: Prisma.XOR<Prisma.Transfer_ratesScalarRelationFilter, Prisma.transfer_ratesWhereInput>;
}, "id">;
export type dispatch_ratesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    dispatch_id?: Prisma.SortOrder;
    rate_id?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.dispatch_ratesCountOrderByAggregateInput;
    _avg?: Prisma.dispatch_ratesAvgOrderByAggregateInput;
    _max?: Prisma.dispatch_ratesMaxOrderByAggregateInput;
    _min?: Prisma.dispatch_ratesMinOrderByAggregateInput;
    _sum?: Prisma.dispatch_ratesSumOrderByAggregateInput;
};
export type dispatch_ratesScalarWhereWithAggregatesInput = {
    AND?: Prisma.dispatch_ratesScalarWhereWithAggregatesInput | Prisma.dispatch_ratesScalarWhereWithAggregatesInput[];
    OR?: Prisma.dispatch_ratesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.dispatch_ratesScalarWhereWithAggregatesInput | Prisma.dispatch_ratesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"dispatch_rates"> | string;
    dispatch_id?: Prisma.UuidWithAggregatesFilter<"dispatch_rates"> | string;
    rate_id?: Prisma.UuidWithAggregatesFilter<"dispatch_rates"> | string;
    value?: Prisma.DecimalWithAggregatesFilter<"dispatch_rates"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"dispatch_rates"> | Date | string;
};
export type dispatch_ratesCreateInput = {
    id?: string;
    value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    dispatch_orders: Prisma.dispatch_ordersCreateNestedOneWithoutDispatch_ratesInput;
    transfer_rates: Prisma.transfer_ratesCreateNestedOneWithoutDispatch_ratesInput;
};
export type dispatch_ratesUncheckedCreateInput = {
    id?: string;
    dispatch_id: string;
    rate_id: string;
    value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
};
export type dispatch_ratesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dispatch_orders?: Prisma.dispatch_ordersUpdateOneRequiredWithoutDispatch_ratesNestedInput;
    transfer_rates?: Prisma.transfer_ratesUpdateOneRequiredWithoutDispatch_ratesNestedInput;
};
export type dispatch_ratesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dispatch_id?: Prisma.StringFieldUpdateOperationsInput | string;
    rate_id?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type dispatch_ratesCreateManyInput = {
    id?: string;
    dispatch_id: string;
    rate_id: string;
    value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
};
export type dispatch_ratesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type dispatch_ratesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dispatch_id?: Prisma.StringFieldUpdateOperationsInput | string;
    rate_id?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type Dispatch_ratesListRelationFilter = {
    every?: Prisma.dispatch_ratesWhereInput;
    some?: Prisma.dispatch_ratesWhereInput;
    none?: Prisma.dispatch_ratesWhereInput;
};
export type dispatch_ratesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type dispatch_ratesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    dispatch_id?: Prisma.SortOrder;
    rate_id?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type dispatch_ratesAvgOrderByAggregateInput = {
    value?: Prisma.SortOrder;
};
export type dispatch_ratesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    dispatch_id?: Prisma.SortOrder;
    rate_id?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type dispatch_ratesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    dispatch_id?: Prisma.SortOrder;
    rate_id?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type dispatch_ratesSumOrderByAggregateInput = {
    value?: Prisma.SortOrder;
};
export type dispatch_ratesCreateNestedManyWithoutDispatch_ordersInput = {
    create?: Prisma.XOR<Prisma.dispatch_ratesCreateWithoutDispatch_ordersInput, Prisma.dispatch_ratesUncheckedCreateWithoutDispatch_ordersInput> | Prisma.dispatch_ratesCreateWithoutDispatch_ordersInput[] | Prisma.dispatch_ratesUncheckedCreateWithoutDispatch_ordersInput[];
    connectOrCreate?: Prisma.dispatch_ratesCreateOrConnectWithoutDispatch_ordersInput | Prisma.dispatch_ratesCreateOrConnectWithoutDispatch_ordersInput[];
    createMany?: Prisma.dispatch_ratesCreateManyDispatch_ordersInputEnvelope;
    connect?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
};
export type dispatch_ratesUncheckedCreateNestedManyWithoutDispatch_ordersInput = {
    create?: Prisma.XOR<Prisma.dispatch_ratesCreateWithoutDispatch_ordersInput, Prisma.dispatch_ratesUncheckedCreateWithoutDispatch_ordersInput> | Prisma.dispatch_ratesCreateWithoutDispatch_ordersInput[] | Prisma.dispatch_ratesUncheckedCreateWithoutDispatch_ordersInput[];
    connectOrCreate?: Prisma.dispatch_ratesCreateOrConnectWithoutDispatch_ordersInput | Prisma.dispatch_ratesCreateOrConnectWithoutDispatch_ordersInput[];
    createMany?: Prisma.dispatch_ratesCreateManyDispatch_ordersInputEnvelope;
    connect?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
};
export type dispatch_ratesUpdateManyWithoutDispatch_ordersNestedInput = {
    create?: Prisma.XOR<Prisma.dispatch_ratesCreateWithoutDispatch_ordersInput, Prisma.dispatch_ratesUncheckedCreateWithoutDispatch_ordersInput> | Prisma.dispatch_ratesCreateWithoutDispatch_ordersInput[] | Prisma.dispatch_ratesUncheckedCreateWithoutDispatch_ordersInput[];
    connectOrCreate?: Prisma.dispatch_ratesCreateOrConnectWithoutDispatch_ordersInput | Prisma.dispatch_ratesCreateOrConnectWithoutDispatch_ordersInput[];
    upsert?: Prisma.dispatch_ratesUpsertWithWhereUniqueWithoutDispatch_ordersInput | Prisma.dispatch_ratesUpsertWithWhereUniqueWithoutDispatch_ordersInput[];
    createMany?: Prisma.dispatch_ratesCreateManyDispatch_ordersInputEnvelope;
    set?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    disconnect?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    delete?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    connect?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    update?: Prisma.dispatch_ratesUpdateWithWhereUniqueWithoutDispatch_ordersInput | Prisma.dispatch_ratesUpdateWithWhereUniqueWithoutDispatch_ordersInput[];
    updateMany?: Prisma.dispatch_ratesUpdateManyWithWhereWithoutDispatch_ordersInput | Prisma.dispatch_ratesUpdateManyWithWhereWithoutDispatch_ordersInput[];
    deleteMany?: Prisma.dispatch_ratesScalarWhereInput | Prisma.dispatch_ratesScalarWhereInput[];
};
export type dispatch_ratesUncheckedUpdateManyWithoutDispatch_ordersNestedInput = {
    create?: Prisma.XOR<Prisma.dispatch_ratesCreateWithoutDispatch_ordersInput, Prisma.dispatch_ratesUncheckedCreateWithoutDispatch_ordersInput> | Prisma.dispatch_ratesCreateWithoutDispatch_ordersInput[] | Prisma.dispatch_ratesUncheckedCreateWithoutDispatch_ordersInput[];
    connectOrCreate?: Prisma.dispatch_ratesCreateOrConnectWithoutDispatch_ordersInput | Prisma.dispatch_ratesCreateOrConnectWithoutDispatch_ordersInput[];
    upsert?: Prisma.dispatch_ratesUpsertWithWhereUniqueWithoutDispatch_ordersInput | Prisma.dispatch_ratesUpsertWithWhereUniqueWithoutDispatch_ordersInput[];
    createMany?: Prisma.dispatch_ratesCreateManyDispatch_ordersInputEnvelope;
    set?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    disconnect?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    delete?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    connect?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    update?: Prisma.dispatch_ratesUpdateWithWhereUniqueWithoutDispatch_ordersInput | Prisma.dispatch_ratesUpdateWithWhereUniqueWithoutDispatch_ordersInput[];
    updateMany?: Prisma.dispatch_ratesUpdateManyWithWhereWithoutDispatch_ordersInput | Prisma.dispatch_ratesUpdateManyWithWhereWithoutDispatch_ordersInput[];
    deleteMany?: Prisma.dispatch_ratesScalarWhereInput | Prisma.dispatch_ratesScalarWhereInput[];
};
export type dispatch_ratesCreateNestedManyWithoutTransfer_ratesInput = {
    create?: Prisma.XOR<Prisma.dispatch_ratesCreateWithoutTransfer_ratesInput, Prisma.dispatch_ratesUncheckedCreateWithoutTransfer_ratesInput> | Prisma.dispatch_ratesCreateWithoutTransfer_ratesInput[] | Prisma.dispatch_ratesUncheckedCreateWithoutTransfer_ratesInput[];
    connectOrCreate?: Prisma.dispatch_ratesCreateOrConnectWithoutTransfer_ratesInput | Prisma.dispatch_ratesCreateOrConnectWithoutTransfer_ratesInput[];
    createMany?: Prisma.dispatch_ratesCreateManyTransfer_ratesInputEnvelope;
    connect?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
};
export type dispatch_ratesUncheckedCreateNestedManyWithoutTransfer_ratesInput = {
    create?: Prisma.XOR<Prisma.dispatch_ratesCreateWithoutTransfer_ratesInput, Prisma.dispatch_ratesUncheckedCreateWithoutTransfer_ratesInput> | Prisma.dispatch_ratesCreateWithoutTransfer_ratesInput[] | Prisma.dispatch_ratesUncheckedCreateWithoutTransfer_ratesInput[];
    connectOrCreate?: Prisma.dispatch_ratesCreateOrConnectWithoutTransfer_ratesInput | Prisma.dispatch_ratesCreateOrConnectWithoutTransfer_ratesInput[];
    createMany?: Prisma.dispatch_ratesCreateManyTransfer_ratesInputEnvelope;
    connect?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
};
export type dispatch_ratesUpdateManyWithoutTransfer_ratesNestedInput = {
    create?: Prisma.XOR<Prisma.dispatch_ratesCreateWithoutTransfer_ratesInput, Prisma.dispatch_ratesUncheckedCreateWithoutTransfer_ratesInput> | Prisma.dispatch_ratesCreateWithoutTransfer_ratesInput[] | Prisma.dispatch_ratesUncheckedCreateWithoutTransfer_ratesInput[];
    connectOrCreate?: Prisma.dispatch_ratesCreateOrConnectWithoutTransfer_ratesInput | Prisma.dispatch_ratesCreateOrConnectWithoutTransfer_ratesInput[];
    upsert?: Prisma.dispatch_ratesUpsertWithWhereUniqueWithoutTransfer_ratesInput | Prisma.dispatch_ratesUpsertWithWhereUniqueWithoutTransfer_ratesInput[];
    createMany?: Prisma.dispatch_ratesCreateManyTransfer_ratesInputEnvelope;
    set?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    disconnect?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    delete?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    connect?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    update?: Prisma.dispatch_ratesUpdateWithWhereUniqueWithoutTransfer_ratesInput | Prisma.dispatch_ratesUpdateWithWhereUniqueWithoutTransfer_ratesInput[];
    updateMany?: Prisma.dispatch_ratesUpdateManyWithWhereWithoutTransfer_ratesInput | Prisma.dispatch_ratesUpdateManyWithWhereWithoutTransfer_ratesInput[];
    deleteMany?: Prisma.dispatch_ratesScalarWhereInput | Prisma.dispatch_ratesScalarWhereInput[];
};
export type dispatch_ratesUncheckedUpdateManyWithoutTransfer_ratesNestedInput = {
    create?: Prisma.XOR<Prisma.dispatch_ratesCreateWithoutTransfer_ratesInput, Prisma.dispatch_ratesUncheckedCreateWithoutTransfer_ratesInput> | Prisma.dispatch_ratesCreateWithoutTransfer_ratesInput[] | Prisma.dispatch_ratesUncheckedCreateWithoutTransfer_ratesInput[];
    connectOrCreate?: Prisma.dispatch_ratesCreateOrConnectWithoutTransfer_ratesInput | Prisma.dispatch_ratesCreateOrConnectWithoutTransfer_ratesInput[];
    upsert?: Prisma.dispatch_ratesUpsertWithWhereUniqueWithoutTransfer_ratesInput | Prisma.dispatch_ratesUpsertWithWhereUniqueWithoutTransfer_ratesInput[];
    createMany?: Prisma.dispatch_ratesCreateManyTransfer_ratesInputEnvelope;
    set?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    disconnect?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    delete?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    connect?: Prisma.dispatch_ratesWhereUniqueInput | Prisma.dispatch_ratesWhereUniqueInput[];
    update?: Prisma.dispatch_ratesUpdateWithWhereUniqueWithoutTransfer_ratesInput | Prisma.dispatch_ratesUpdateWithWhereUniqueWithoutTransfer_ratesInput[];
    updateMany?: Prisma.dispatch_ratesUpdateManyWithWhereWithoutTransfer_ratesInput | Prisma.dispatch_ratesUpdateManyWithWhereWithoutTransfer_ratesInput[];
    deleteMany?: Prisma.dispatch_ratesScalarWhereInput | Prisma.dispatch_ratesScalarWhereInput[];
};
export type dispatch_ratesCreateWithoutDispatch_ordersInput = {
    id?: string;
    value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    transfer_rates: Prisma.transfer_ratesCreateNestedOneWithoutDispatch_ratesInput;
};
export type dispatch_ratesUncheckedCreateWithoutDispatch_ordersInput = {
    id?: string;
    rate_id: string;
    value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
};
export type dispatch_ratesCreateOrConnectWithoutDispatch_ordersInput = {
    where: Prisma.dispatch_ratesWhereUniqueInput;
    create: Prisma.XOR<Prisma.dispatch_ratesCreateWithoutDispatch_ordersInput, Prisma.dispatch_ratesUncheckedCreateWithoutDispatch_ordersInput>;
};
export type dispatch_ratesCreateManyDispatch_ordersInputEnvelope = {
    data: Prisma.dispatch_ratesCreateManyDispatch_ordersInput | Prisma.dispatch_ratesCreateManyDispatch_ordersInput[];
    skipDuplicates?: boolean;
};
export type dispatch_ratesUpsertWithWhereUniqueWithoutDispatch_ordersInput = {
    where: Prisma.dispatch_ratesWhereUniqueInput;
    update: Prisma.XOR<Prisma.dispatch_ratesUpdateWithoutDispatch_ordersInput, Prisma.dispatch_ratesUncheckedUpdateWithoutDispatch_ordersInput>;
    create: Prisma.XOR<Prisma.dispatch_ratesCreateWithoutDispatch_ordersInput, Prisma.dispatch_ratesUncheckedCreateWithoutDispatch_ordersInput>;
};
export type dispatch_ratesUpdateWithWhereUniqueWithoutDispatch_ordersInput = {
    where: Prisma.dispatch_ratesWhereUniqueInput;
    data: Prisma.XOR<Prisma.dispatch_ratesUpdateWithoutDispatch_ordersInput, Prisma.dispatch_ratesUncheckedUpdateWithoutDispatch_ordersInput>;
};
export type dispatch_ratesUpdateManyWithWhereWithoutDispatch_ordersInput = {
    where: Prisma.dispatch_ratesScalarWhereInput;
    data: Prisma.XOR<Prisma.dispatch_ratesUpdateManyMutationInput, Prisma.dispatch_ratesUncheckedUpdateManyWithoutDispatch_ordersInput>;
};
export type dispatch_ratesScalarWhereInput = {
    AND?: Prisma.dispatch_ratesScalarWhereInput | Prisma.dispatch_ratesScalarWhereInput[];
    OR?: Prisma.dispatch_ratesScalarWhereInput[];
    NOT?: Prisma.dispatch_ratesScalarWhereInput | Prisma.dispatch_ratesScalarWhereInput[];
    id?: Prisma.UuidFilter<"dispatch_rates"> | string;
    dispatch_id?: Prisma.UuidFilter<"dispatch_rates"> | string;
    rate_id?: Prisma.UuidFilter<"dispatch_rates"> | string;
    value?: Prisma.DecimalFilter<"dispatch_rates"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFilter<"dispatch_rates"> | Date | string;
};
export type dispatch_ratesCreateWithoutTransfer_ratesInput = {
    id?: string;
    value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    dispatch_orders: Prisma.dispatch_ordersCreateNestedOneWithoutDispatch_ratesInput;
};
export type dispatch_ratesUncheckedCreateWithoutTransfer_ratesInput = {
    id?: string;
    dispatch_id: string;
    value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
};
export type dispatch_ratesCreateOrConnectWithoutTransfer_ratesInput = {
    where: Prisma.dispatch_ratesWhereUniqueInput;
    create: Prisma.XOR<Prisma.dispatch_ratesCreateWithoutTransfer_ratesInput, Prisma.dispatch_ratesUncheckedCreateWithoutTransfer_ratesInput>;
};
export type dispatch_ratesCreateManyTransfer_ratesInputEnvelope = {
    data: Prisma.dispatch_ratesCreateManyTransfer_ratesInput | Prisma.dispatch_ratesCreateManyTransfer_ratesInput[];
    skipDuplicates?: boolean;
};
export type dispatch_ratesUpsertWithWhereUniqueWithoutTransfer_ratesInput = {
    where: Prisma.dispatch_ratesWhereUniqueInput;
    update: Prisma.XOR<Prisma.dispatch_ratesUpdateWithoutTransfer_ratesInput, Prisma.dispatch_ratesUncheckedUpdateWithoutTransfer_ratesInput>;
    create: Prisma.XOR<Prisma.dispatch_ratesCreateWithoutTransfer_ratesInput, Prisma.dispatch_ratesUncheckedCreateWithoutTransfer_ratesInput>;
};
export type dispatch_ratesUpdateWithWhereUniqueWithoutTransfer_ratesInput = {
    where: Prisma.dispatch_ratesWhereUniqueInput;
    data: Prisma.XOR<Prisma.dispatch_ratesUpdateWithoutTransfer_ratesInput, Prisma.dispatch_ratesUncheckedUpdateWithoutTransfer_ratesInput>;
};
export type dispatch_ratesUpdateManyWithWhereWithoutTransfer_ratesInput = {
    where: Prisma.dispatch_ratesScalarWhereInput;
    data: Prisma.XOR<Prisma.dispatch_ratesUpdateManyMutationInput, Prisma.dispatch_ratesUncheckedUpdateManyWithoutTransfer_ratesInput>;
};
export type dispatch_ratesCreateManyDispatch_ordersInput = {
    id?: string;
    rate_id: string;
    value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
};
export type dispatch_ratesUpdateWithoutDispatch_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transfer_rates?: Prisma.transfer_ratesUpdateOneRequiredWithoutDispatch_ratesNestedInput;
};
export type dispatch_ratesUncheckedUpdateWithoutDispatch_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rate_id?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type dispatch_ratesUncheckedUpdateManyWithoutDispatch_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rate_id?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type dispatch_ratesCreateManyTransfer_ratesInput = {
    id?: string;
    dispatch_id: string;
    value: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
};
export type dispatch_ratesUpdateWithoutTransfer_ratesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dispatch_orders?: Prisma.dispatch_ordersUpdateOneRequiredWithoutDispatch_ratesNestedInput;
};
export type dispatch_ratesUncheckedUpdateWithoutTransfer_ratesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dispatch_id?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type dispatch_ratesUncheckedUpdateManyWithoutTransfer_ratesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dispatch_id?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type dispatch_ratesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    dispatch_id?: boolean;
    rate_id?: boolean;
    value?: boolean;
    created_at?: boolean;
    dispatch_orders?: boolean | Prisma.dispatch_ordersDefaultArgs<ExtArgs>;
    transfer_rates?: boolean | Prisma.transfer_ratesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["dispatch_rates"]>;
export type dispatch_ratesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    dispatch_id?: boolean;
    rate_id?: boolean;
    value?: boolean;
    created_at?: boolean;
    dispatch_orders?: boolean | Prisma.dispatch_ordersDefaultArgs<ExtArgs>;
    transfer_rates?: boolean | Prisma.transfer_ratesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["dispatch_rates"]>;
export type dispatch_ratesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    dispatch_id?: boolean;
    rate_id?: boolean;
    value?: boolean;
    created_at?: boolean;
    dispatch_orders?: boolean | Prisma.dispatch_ordersDefaultArgs<ExtArgs>;
    transfer_rates?: boolean | Prisma.transfer_ratesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["dispatch_rates"]>;
export type dispatch_ratesSelectScalar = {
    id?: boolean;
    dispatch_id?: boolean;
    rate_id?: boolean;
    value?: boolean;
    created_at?: boolean;
};
export type dispatch_ratesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "dispatch_id" | "rate_id" | "value" | "created_at", ExtArgs["result"]["dispatch_rates"]>;
export type dispatch_ratesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    dispatch_orders?: boolean | Prisma.dispatch_ordersDefaultArgs<ExtArgs>;
    transfer_rates?: boolean | Prisma.transfer_ratesDefaultArgs<ExtArgs>;
};
export type dispatch_ratesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    dispatch_orders?: boolean | Prisma.dispatch_ordersDefaultArgs<ExtArgs>;
    transfer_rates?: boolean | Prisma.transfer_ratesDefaultArgs<ExtArgs>;
};
export type dispatch_ratesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    dispatch_orders?: boolean | Prisma.dispatch_ordersDefaultArgs<ExtArgs>;
    transfer_rates?: boolean | Prisma.transfer_ratesDefaultArgs<ExtArgs>;
};
export type $dispatch_ratesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "dispatch_rates";
    objects: {
        dispatch_orders: Prisma.$dispatch_ordersPayload<ExtArgs>;
        transfer_rates: Prisma.$transfer_ratesPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        dispatch_id: string;
        rate_id: string;
        value: runtime.Decimal;
        created_at: Date;
    }, ExtArgs["result"]["dispatch_rates"]>;
    composites: {};
};
export type dispatch_ratesGetPayload<S extends boolean | null | undefined | dispatch_ratesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$dispatch_ratesPayload, S>;
export type dispatch_ratesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<dispatch_ratesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Dispatch_ratesCountAggregateInputType | true;
};
export interface dispatch_ratesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['dispatch_rates'];
        meta: {
            name: 'dispatch_rates';
        };
    };
    findUnique<T extends dispatch_ratesFindUniqueArgs>(args: Prisma.SelectSubset<T, dispatch_ratesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__dispatch_ratesClient<runtime.Types.Result.GetResult<Prisma.$dispatch_ratesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends dispatch_ratesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, dispatch_ratesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__dispatch_ratesClient<runtime.Types.Result.GetResult<Prisma.$dispatch_ratesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends dispatch_ratesFindFirstArgs>(args?: Prisma.SelectSubset<T, dispatch_ratesFindFirstArgs<ExtArgs>>): Prisma.Prisma__dispatch_ratesClient<runtime.Types.Result.GetResult<Prisma.$dispatch_ratesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends dispatch_ratesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, dispatch_ratesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__dispatch_ratesClient<runtime.Types.Result.GetResult<Prisma.$dispatch_ratesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends dispatch_ratesFindManyArgs>(args?: Prisma.SelectSubset<T, dispatch_ratesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$dispatch_ratesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends dispatch_ratesCreateArgs>(args: Prisma.SelectSubset<T, dispatch_ratesCreateArgs<ExtArgs>>): Prisma.Prisma__dispatch_ratesClient<runtime.Types.Result.GetResult<Prisma.$dispatch_ratesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends dispatch_ratesCreateManyArgs>(args?: Prisma.SelectSubset<T, dispatch_ratesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends dispatch_ratesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, dispatch_ratesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$dispatch_ratesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends dispatch_ratesDeleteArgs>(args: Prisma.SelectSubset<T, dispatch_ratesDeleteArgs<ExtArgs>>): Prisma.Prisma__dispatch_ratesClient<runtime.Types.Result.GetResult<Prisma.$dispatch_ratesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends dispatch_ratesUpdateArgs>(args: Prisma.SelectSubset<T, dispatch_ratesUpdateArgs<ExtArgs>>): Prisma.Prisma__dispatch_ratesClient<runtime.Types.Result.GetResult<Prisma.$dispatch_ratesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends dispatch_ratesDeleteManyArgs>(args?: Prisma.SelectSubset<T, dispatch_ratesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends dispatch_ratesUpdateManyArgs>(args: Prisma.SelectSubset<T, dispatch_ratesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends dispatch_ratesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, dispatch_ratesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$dispatch_ratesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends dispatch_ratesUpsertArgs>(args: Prisma.SelectSubset<T, dispatch_ratesUpsertArgs<ExtArgs>>): Prisma.Prisma__dispatch_ratesClient<runtime.Types.Result.GetResult<Prisma.$dispatch_ratesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends dispatch_ratesCountArgs>(args?: Prisma.Subset<T, dispatch_ratesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Dispatch_ratesCountAggregateOutputType> : number>;
    aggregate<T extends Dispatch_ratesAggregateArgs>(args: Prisma.Subset<T, Dispatch_ratesAggregateArgs>): Prisma.PrismaPromise<GetDispatch_ratesAggregateType<T>>;
    groupBy<T extends dispatch_ratesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: dispatch_ratesGroupByArgs['orderBy'];
    } : {
        orderBy?: dispatch_ratesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, dispatch_ratesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDispatch_ratesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: dispatch_ratesFieldRefs;
}
export interface Prisma__dispatch_ratesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    dispatch_orders<T extends Prisma.dispatch_ordersDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.dispatch_ordersDefaultArgs<ExtArgs>>): Prisma.Prisma__dispatch_ordersClient<runtime.Types.Result.GetResult<Prisma.$dispatch_ordersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    transfer_rates<T extends Prisma.transfer_ratesDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.transfer_ratesDefaultArgs<ExtArgs>>): Prisma.Prisma__transfer_ratesClient<runtime.Types.Result.GetResult<Prisma.$transfer_ratesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface dispatch_ratesFieldRefs {
    readonly id: Prisma.FieldRef<"dispatch_rates", 'String'>;
    readonly dispatch_id: Prisma.FieldRef<"dispatch_rates", 'String'>;
    readonly rate_id: Prisma.FieldRef<"dispatch_rates", 'String'>;
    readonly value: Prisma.FieldRef<"dispatch_rates", 'Decimal'>;
    readonly created_at: Prisma.FieldRef<"dispatch_rates", 'DateTime'>;
}
export type dispatch_ratesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ratesSelect<ExtArgs> | null;
    omit?: Prisma.dispatch_ratesOmit<ExtArgs> | null;
    include?: Prisma.dispatch_ratesInclude<ExtArgs> | null;
    where: Prisma.dispatch_ratesWhereUniqueInput;
};
export type dispatch_ratesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ratesSelect<ExtArgs> | null;
    omit?: Prisma.dispatch_ratesOmit<ExtArgs> | null;
    include?: Prisma.dispatch_ratesInclude<ExtArgs> | null;
    where: Prisma.dispatch_ratesWhereUniqueInput;
};
export type dispatch_ratesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ratesSelect<ExtArgs> | null;
    omit?: Prisma.dispatch_ratesOmit<ExtArgs> | null;
    include?: Prisma.dispatch_ratesInclude<ExtArgs> | null;
    where?: Prisma.dispatch_ratesWhereInput;
    orderBy?: Prisma.dispatch_ratesOrderByWithRelationInput | Prisma.dispatch_ratesOrderByWithRelationInput[];
    cursor?: Prisma.dispatch_ratesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Dispatch_ratesScalarFieldEnum | Prisma.Dispatch_ratesScalarFieldEnum[];
};
export type dispatch_ratesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ratesSelect<ExtArgs> | null;
    omit?: Prisma.dispatch_ratesOmit<ExtArgs> | null;
    include?: Prisma.dispatch_ratesInclude<ExtArgs> | null;
    where?: Prisma.dispatch_ratesWhereInput;
    orderBy?: Prisma.dispatch_ratesOrderByWithRelationInput | Prisma.dispatch_ratesOrderByWithRelationInput[];
    cursor?: Prisma.dispatch_ratesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Dispatch_ratesScalarFieldEnum | Prisma.Dispatch_ratesScalarFieldEnum[];
};
export type dispatch_ratesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ratesSelect<ExtArgs> | null;
    omit?: Prisma.dispatch_ratesOmit<ExtArgs> | null;
    include?: Prisma.dispatch_ratesInclude<ExtArgs> | null;
    where?: Prisma.dispatch_ratesWhereInput;
    orderBy?: Prisma.dispatch_ratesOrderByWithRelationInput | Prisma.dispatch_ratesOrderByWithRelationInput[];
    cursor?: Prisma.dispatch_ratesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Dispatch_ratesScalarFieldEnum | Prisma.Dispatch_ratesScalarFieldEnum[];
};
export type dispatch_ratesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ratesSelect<ExtArgs> | null;
    omit?: Prisma.dispatch_ratesOmit<ExtArgs> | null;
    include?: Prisma.dispatch_ratesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.dispatch_ratesCreateInput, Prisma.dispatch_ratesUncheckedCreateInput>;
};
export type dispatch_ratesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.dispatch_ratesCreateManyInput | Prisma.dispatch_ratesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type dispatch_ratesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ratesSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.dispatch_ratesOmit<ExtArgs> | null;
    data: Prisma.dispatch_ratesCreateManyInput | Prisma.dispatch_ratesCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.dispatch_ratesIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type dispatch_ratesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ratesSelect<ExtArgs> | null;
    omit?: Prisma.dispatch_ratesOmit<ExtArgs> | null;
    include?: Prisma.dispatch_ratesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.dispatch_ratesUpdateInput, Prisma.dispatch_ratesUncheckedUpdateInput>;
    where: Prisma.dispatch_ratesWhereUniqueInput;
};
export type dispatch_ratesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.dispatch_ratesUpdateManyMutationInput, Prisma.dispatch_ratesUncheckedUpdateManyInput>;
    where?: Prisma.dispatch_ratesWhereInput;
    limit?: number;
};
export type dispatch_ratesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ratesSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.dispatch_ratesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.dispatch_ratesUpdateManyMutationInput, Prisma.dispatch_ratesUncheckedUpdateManyInput>;
    where?: Prisma.dispatch_ratesWhereInput;
    limit?: number;
    include?: Prisma.dispatch_ratesIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type dispatch_ratesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ratesSelect<ExtArgs> | null;
    omit?: Prisma.dispatch_ratesOmit<ExtArgs> | null;
    include?: Prisma.dispatch_ratesInclude<ExtArgs> | null;
    where: Prisma.dispatch_ratesWhereUniqueInput;
    create: Prisma.XOR<Prisma.dispatch_ratesCreateInput, Prisma.dispatch_ratesUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.dispatch_ratesUpdateInput, Prisma.dispatch_ratesUncheckedUpdateInput>;
};
export type dispatch_ratesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ratesSelect<ExtArgs> | null;
    omit?: Prisma.dispatch_ratesOmit<ExtArgs> | null;
    include?: Prisma.dispatch_ratesInclude<ExtArgs> | null;
    where: Prisma.dispatch_ratesWhereUniqueInput;
};
export type dispatch_ratesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.dispatch_ratesWhereInput;
    limit?: number;
};
export type dispatch_ratesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ratesSelect<ExtArgs> | null;
    omit?: Prisma.dispatch_ratesOmit<ExtArgs> | null;
    include?: Prisma.dispatch_ratesInclude<ExtArgs> | null;
};
