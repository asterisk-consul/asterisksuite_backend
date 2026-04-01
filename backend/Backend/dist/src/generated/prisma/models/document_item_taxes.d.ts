import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type document_item_taxesModel = runtime.Types.Result.DefaultSelection<Prisma.$document_item_taxesPayload>;
export type AggregateDocument_item_taxes = {
    _count: Document_item_taxesCountAggregateOutputType | null;
    _avg: Document_item_taxesAvgAggregateOutputType | null;
    _sum: Document_item_taxesSumAggregateOutputType | null;
    _min: Document_item_taxesMinAggregateOutputType | null;
    _max: Document_item_taxesMaxAggregateOutputType | null;
};
export type Document_item_taxesAvgAggregateOutputType = {
    tax_rate: runtime.Decimal | null;
    tax_amount: runtime.Decimal | null;
};
export type Document_item_taxesSumAggregateOutputType = {
    tax_rate: runtime.Decimal | null;
    tax_amount: runtime.Decimal | null;
};
export type Document_item_taxesMinAggregateOutputType = {
    id: string | null;
    document_item_id: string | null;
    tax_id: string | null;
    tax_rate: runtime.Decimal | null;
    tax_amount: runtime.Decimal | null;
    created_at: Date | null;
};
export type Document_item_taxesMaxAggregateOutputType = {
    id: string | null;
    document_item_id: string | null;
    tax_id: string | null;
    tax_rate: runtime.Decimal | null;
    tax_amount: runtime.Decimal | null;
    created_at: Date | null;
};
export type Document_item_taxesCountAggregateOutputType = {
    id: number;
    document_item_id: number;
    tax_id: number;
    tax_rate: number;
    tax_amount: number;
    created_at: number;
    _all: number;
};
export type Document_item_taxesAvgAggregateInputType = {
    tax_rate?: true;
    tax_amount?: true;
};
export type Document_item_taxesSumAggregateInputType = {
    tax_rate?: true;
    tax_amount?: true;
};
export type Document_item_taxesMinAggregateInputType = {
    id?: true;
    document_item_id?: true;
    tax_id?: true;
    tax_rate?: true;
    tax_amount?: true;
    created_at?: true;
};
export type Document_item_taxesMaxAggregateInputType = {
    id?: true;
    document_item_id?: true;
    tax_id?: true;
    tax_rate?: true;
    tax_amount?: true;
    created_at?: true;
};
export type Document_item_taxesCountAggregateInputType = {
    id?: true;
    document_item_id?: true;
    tax_id?: true;
    tax_rate?: true;
    tax_amount?: true;
    created_at?: true;
    _all?: true;
};
export type Document_item_taxesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_item_taxesWhereInput;
    orderBy?: Prisma.document_item_taxesOrderByWithRelationInput | Prisma.document_item_taxesOrderByWithRelationInput[];
    cursor?: Prisma.document_item_taxesWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Document_item_taxesCountAggregateInputType;
    _avg?: Document_item_taxesAvgAggregateInputType;
    _sum?: Document_item_taxesSumAggregateInputType;
    _min?: Document_item_taxesMinAggregateInputType;
    _max?: Document_item_taxesMaxAggregateInputType;
};
export type GetDocument_item_taxesAggregateType<T extends Document_item_taxesAggregateArgs> = {
    [P in keyof T & keyof AggregateDocument_item_taxes]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocument_item_taxes[P]> : Prisma.GetScalarType<T[P], AggregateDocument_item_taxes[P]>;
};
export type document_item_taxesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_item_taxesWhereInput;
    orderBy?: Prisma.document_item_taxesOrderByWithAggregationInput | Prisma.document_item_taxesOrderByWithAggregationInput[];
    by: Prisma.Document_item_taxesScalarFieldEnum[] | Prisma.Document_item_taxesScalarFieldEnum;
    having?: Prisma.document_item_taxesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Document_item_taxesCountAggregateInputType | true;
    _avg?: Document_item_taxesAvgAggregateInputType;
    _sum?: Document_item_taxesSumAggregateInputType;
    _min?: Document_item_taxesMinAggregateInputType;
    _max?: Document_item_taxesMaxAggregateInputType;
};
export type Document_item_taxesGroupByOutputType = {
    id: string;
    document_item_id: string;
    tax_id: string;
    tax_rate: runtime.Decimal;
    tax_amount: runtime.Decimal;
    created_at: Date | null;
    _count: Document_item_taxesCountAggregateOutputType | null;
    _avg: Document_item_taxesAvgAggregateOutputType | null;
    _sum: Document_item_taxesSumAggregateOutputType | null;
    _min: Document_item_taxesMinAggregateOutputType | null;
    _max: Document_item_taxesMaxAggregateOutputType | null;
};
export type GetDocument_item_taxesGroupByPayload<T extends document_item_taxesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Document_item_taxesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Document_item_taxesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Document_item_taxesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Document_item_taxesGroupByOutputType[P]>;
}>>;
export type document_item_taxesWhereInput = {
    AND?: Prisma.document_item_taxesWhereInput | Prisma.document_item_taxesWhereInput[];
    OR?: Prisma.document_item_taxesWhereInput[];
    NOT?: Prisma.document_item_taxesWhereInput | Prisma.document_item_taxesWhereInput[];
    id?: Prisma.UuidFilter<"document_item_taxes"> | string;
    document_item_id?: Prisma.UuidFilter<"document_item_taxes"> | string;
    tax_id?: Prisma.UuidFilter<"document_item_taxes"> | string;
    tax_rate?: Prisma.DecimalFilter<"document_item_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFilter<"document_item_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeNullableFilter<"document_item_taxes"> | Date | string | null;
    document_items?: Prisma.XOR<Prisma.Document_itemsScalarRelationFilter, Prisma.document_itemsWhereInput>;
    taxes?: Prisma.XOR<Prisma.TaxesScalarRelationFilter, Prisma.taxesWhereInput>;
};
export type document_item_taxesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    document_item_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    tax_rate?: Prisma.SortOrder;
    tax_amount?: Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    document_items?: Prisma.document_itemsOrderByWithRelationInput;
    taxes?: Prisma.taxesOrderByWithRelationInput;
};
export type document_item_taxesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.document_item_taxesWhereInput | Prisma.document_item_taxesWhereInput[];
    OR?: Prisma.document_item_taxesWhereInput[];
    NOT?: Prisma.document_item_taxesWhereInput | Prisma.document_item_taxesWhereInput[];
    document_item_id?: Prisma.UuidFilter<"document_item_taxes"> | string;
    tax_id?: Prisma.UuidFilter<"document_item_taxes"> | string;
    tax_rate?: Prisma.DecimalFilter<"document_item_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFilter<"document_item_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeNullableFilter<"document_item_taxes"> | Date | string | null;
    document_items?: Prisma.XOR<Prisma.Document_itemsScalarRelationFilter, Prisma.document_itemsWhereInput>;
    taxes?: Prisma.XOR<Prisma.TaxesScalarRelationFilter, Prisma.taxesWhereInput>;
}, "id">;
export type document_item_taxesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    document_item_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    tax_rate?: Prisma.SortOrder;
    tax_amount?: Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.document_item_taxesCountOrderByAggregateInput;
    _avg?: Prisma.document_item_taxesAvgOrderByAggregateInput;
    _max?: Prisma.document_item_taxesMaxOrderByAggregateInput;
    _min?: Prisma.document_item_taxesMinOrderByAggregateInput;
    _sum?: Prisma.document_item_taxesSumOrderByAggregateInput;
};
export type document_item_taxesScalarWhereWithAggregatesInput = {
    AND?: Prisma.document_item_taxesScalarWhereWithAggregatesInput | Prisma.document_item_taxesScalarWhereWithAggregatesInput[];
    OR?: Prisma.document_item_taxesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.document_item_taxesScalarWhereWithAggregatesInput | Prisma.document_item_taxesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"document_item_taxes"> | string;
    document_item_id?: Prisma.UuidWithAggregatesFilter<"document_item_taxes"> | string;
    tax_id?: Prisma.UuidWithAggregatesFilter<"document_item_taxes"> | string;
    tax_rate?: Prisma.DecimalWithAggregatesFilter<"document_item_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalWithAggregatesFilter<"document_item_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"document_item_taxes"> | Date | string | null;
};
export type document_item_taxesCreateInput = {
    id?: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string | null;
    document_items: Prisma.document_itemsCreateNestedOneWithoutDocument_item_taxesInput;
    taxes: Prisma.taxesCreateNestedOneWithoutDocument_item_taxesInput;
};
export type document_item_taxesUncheckedCreateInput = {
    id?: string;
    document_item_id: string;
    tax_id: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string | null;
};
export type document_item_taxesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    document_items?: Prisma.document_itemsUpdateOneRequiredWithoutDocument_item_taxesNestedInput;
    taxes?: Prisma.taxesUpdateOneRequiredWithoutDocument_item_taxesNestedInput;
};
export type document_item_taxesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_item_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type document_item_taxesCreateManyInput = {
    id?: string;
    document_item_id: string;
    tax_id: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string | null;
};
export type document_item_taxesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type document_item_taxesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_item_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type document_item_taxesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_item_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    tax_rate?: Prisma.SortOrder;
    tax_amount?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type document_item_taxesAvgOrderByAggregateInput = {
    tax_rate?: Prisma.SortOrder;
    tax_amount?: Prisma.SortOrder;
};
export type document_item_taxesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_item_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    tax_rate?: Prisma.SortOrder;
    tax_amount?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type document_item_taxesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_item_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    tax_rate?: Prisma.SortOrder;
    tax_amount?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type document_item_taxesSumOrderByAggregateInput = {
    tax_rate?: Prisma.SortOrder;
    tax_amount?: Prisma.SortOrder;
};
export type Document_item_taxesListRelationFilter = {
    every?: Prisma.document_item_taxesWhereInput;
    some?: Prisma.document_item_taxesWhereInput;
    none?: Prisma.document_item_taxesWhereInput;
};
export type document_item_taxesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type document_item_taxesCreateNestedManyWithoutDocument_itemsInput = {
    create?: Prisma.XOR<Prisma.document_item_taxesCreateWithoutDocument_itemsInput, Prisma.document_item_taxesUncheckedCreateWithoutDocument_itemsInput> | Prisma.document_item_taxesCreateWithoutDocument_itemsInput[] | Prisma.document_item_taxesUncheckedCreateWithoutDocument_itemsInput[];
    connectOrCreate?: Prisma.document_item_taxesCreateOrConnectWithoutDocument_itemsInput | Prisma.document_item_taxesCreateOrConnectWithoutDocument_itemsInput[];
    createMany?: Prisma.document_item_taxesCreateManyDocument_itemsInputEnvelope;
    connect?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
};
export type document_item_taxesUncheckedCreateNestedManyWithoutDocument_itemsInput = {
    create?: Prisma.XOR<Prisma.document_item_taxesCreateWithoutDocument_itemsInput, Prisma.document_item_taxesUncheckedCreateWithoutDocument_itemsInput> | Prisma.document_item_taxesCreateWithoutDocument_itemsInput[] | Prisma.document_item_taxesUncheckedCreateWithoutDocument_itemsInput[];
    connectOrCreate?: Prisma.document_item_taxesCreateOrConnectWithoutDocument_itemsInput | Prisma.document_item_taxesCreateOrConnectWithoutDocument_itemsInput[];
    createMany?: Prisma.document_item_taxesCreateManyDocument_itemsInputEnvelope;
    connect?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
};
export type document_item_taxesUpdateManyWithoutDocument_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.document_item_taxesCreateWithoutDocument_itemsInput, Prisma.document_item_taxesUncheckedCreateWithoutDocument_itemsInput> | Prisma.document_item_taxesCreateWithoutDocument_itemsInput[] | Prisma.document_item_taxesUncheckedCreateWithoutDocument_itemsInput[];
    connectOrCreate?: Prisma.document_item_taxesCreateOrConnectWithoutDocument_itemsInput | Prisma.document_item_taxesCreateOrConnectWithoutDocument_itemsInput[];
    upsert?: Prisma.document_item_taxesUpsertWithWhereUniqueWithoutDocument_itemsInput | Prisma.document_item_taxesUpsertWithWhereUniqueWithoutDocument_itemsInput[];
    createMany?: Prisma.document_item_taxesCreateManyDocument_itemsInputEnvelope;
    set?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    disconnect?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    delete?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    connect?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    update?: Prisma.document_item_taxesUpdateWithWhereUniqueWithoutDocument_itemsInput | Prisma.document_item_taxesUpdateWithWhereUniqueWithoutDocument_itemsInput[];
    updateMany?: Prisma.document_item_taxesUpdateManyWithWhereWithoutDocument_itemsInput | Prisma.document_item_taxesUpdateManyWithWhereWithoutDocument_itemsInput[];
    deleteMany?: Prisma.document_item_taxesScalarWhereInput | Prisma.document_item_taxesScalarWhereInput[];
};
export type document_item_taxesUncheckedUpdateManyWithoutDocument_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.document_item_taxesCreateWithoutDocument_itemsInput, Prisma.document_item_taxesUncheckedCreateWithoutDocument_itemsInput> | Prisma.document_item_taxesCreateWithoutDocument_itemsInput[] | Prisma.document_item_taxesUncheckedCreateWithoutDocument_itemsInput[];
    connectOrCreate?: Prisma.document_item_taxesCreateOrConnectWithoutDocument_itemsInput | Prisma.document_item_taxesCreateOrConnectWithoutDocument_itemsInput[];
    upsert?: Prisma.document_item_taxesUpsertWithWhereUniqueWithoutDocument_itemsInput | Prisma.document_item_taxesUpsertWithWhereUniqueWithoutDocument_itemsInput[];
    createMany?: Prisma.document_item_taxesCreateManyDocument_itemsInputEnvelope;
    set?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    disconnect?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    delete?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    connect?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    update?: Prisma.document_item_taxesUpdateWithWhereUniqueWithoutDocument_itemsInput | Prisma.document_item_taxesUpdateWithWhereUniqueWithoutDocument_itemsInput[];
    updateMany?: Prisma.document_item_taxesUpdateManyWithWhereWithoutDocument_itemsInput | Prisma.document_item_taxesUpdateManyWithWhereWithoutDocument_itemsInput[];
    deleteMany?: Prisma.document_item_taxesScalarWhereInput | Prisma.document_item_taxesScalarWhereInput[];
};
export type document_item_taxesCreateNestedManyWithoutTaxesInput = {
    create?: Prisma.XOR<Prisma.document_item_taxesCreateWithoutTaxesInput, Prisma.document_item_taxesUncheckedCreateWithoutTaxesInput> | Prisma.document_item_taxesCreateWithoutTaxesInput[] | Prisma.document_item_taxesUncheckedCreateWithoutTaxesInput[];
    connectOrCreate?: Prisma.document_item_taxesCreateOrConnectWithoutTaxesInput | Prisma.document_item_taxesCreateOrConnectWithoutTaxesInput[];
    createMany?: Prisma.document_item_taxesCreateManyTaxesInputEnvelope;
    connect?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
};
export type document_item_taxesUncheckedCreateNestedManyWithoutTaxesInput = {
    create?: Prisma.XOR<Prisma.document_item_taxesCreateWithoutTaxesInput, Prisma.document_item_taxesUncheckedCreateWithoutTaxesInput> | Prisma.document_item_taxesCreateWithoutTaxesInput[] | Prisma.document_item_taxesUncheckedCreateWithoutTaxesInput[];
    connectOrCreate?: Prisma.document_item_taxesCreateOrConnectWithoutTaxesInput | Prisma.document_item_taxesCreateOrConnectWithoutTaxesInput[];
    createMany?: Prisma.document_item_taxesCreateManyTaxesInputEnvelope;
    connect?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
};
export type document_item_taxesUpdateManyWithoutTaxesNestedInput = {
    create?: Prisma.XOR<Prisma.document_item_taxesCreateWithoutTaxesInput, Prisma.document_item_taxesUncheckedCreateWithoutTaxesInput> | Prisma.document_item_taxesCreateWithoutTaxesInput[] | Prisma.document_item_taxesUncheckedCreateWithoutTaxesInput[];
    connectOrCreate?: Prisma.document_item_taxesCreateOrConnectWithoutTaxesInput | Prisma.document_item_taxesCreateOrConnectWithoutTaxesInput[];
    upsert?: Prisma.document_item_taxesUpsertWithWhereUniqueWithoutTaxesInput | Prisma.document_item_taxesUpsertWithWhereUniqueWithoutTaxesInput[];
    createMany?: Prisma.document_item_taxesCreateManyTaxesInputEnvelope;
    set?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    disconnect?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    delete?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    connect?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    update?: Prisma.document_item_taxesUpdateWithWhereUniqueWithoutTaxesInput | Prisma.document_item_taxesUpdateWithWhereUniqueWithoutTaxesInput[];
    updateMany?: Prisma.document_item_taxesUpdateManyWithWhereWithoutTaxesInput | Prisma.document_item_taxesUpdateManyWithWhereWithoutTaxesInput[];
    deleteMany?: Prisma.document_item_taxesScalarWhereInput | Prisma.document_item_taxesScalarWhereInput[];
};
export type document_item_taxesUncheckedUpdateManyWithoutTaxesNestedInput = {
    create?: Prisma.XOR<Prisma.document_item_taxesCreateWithoutTaxesInput, Prisma.document_item_taxesUncheckedCreateWithoutTaxesInput> | Prisma.document_item_taxesCreateWithoutTaxesInput[] | Prisma.document_item_taxesUncheckedCreateWithoutTaxesInput[];
    connectOrCreate?: Prisma.document_item_taxesCreateOrConnectWithoutTaxesInput | Prisma.document_item_taxesCreateOrConnectWithoutTaxesInput[];
    upsert?: Prisma.document_item_taxesUpsertWithWhereUniqueWithoutTaxesInput | Prisma.document_item_taxesUpsertWithWhereUniqueWithoutTaxesInput[];
    createMany?: Prisma.document_item_taxesCreateManyTaxesInputEnvelope;
    set?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    disconnect?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    delete?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    connect?: Prisma.document_item_taxesWhereUniqueInput | Prisma.document_item_taxesWhereUniqueInput[];
    update?: Prisma.document_item_taxesUpdateWithWhereUniqueWithoutTaxesInput | Prisma.document_item_taxesUpdateWithWhereUniqueWithoutTaxesInput[];
    updateMany?: Prisma.document_item_taxesUpdateManyWithWhereWithoutTaxesInput | Prisma.document_item_taxesUpdateManyWithWhereWithoutTaxesInput[];
    deleteMany?: Prisma.document_item_taxesScalarWhereInput | Prisma.document_item_taxesScalarWhereInput[];
};
export type document_item_taxesCreateWithoutDocument_itemsInput = {
    id?: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string | null;
    taxes: Prisma.taxesCreateNestedOneWithoutDocument_item_taxesInput;
};
export type document_item_taxesUncheckedCreateWithoutDocument_itemsInput = {
    id?: string;
    tax_id: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string | null;
};
export type document_item_taxesCreateOrConnectWithoutDocument_itemsInput = {
    where: Prisma.document_item_taxesWhereUniqueInput;
    create: Prisma.XOR<Prisma.document_item_taxesCreateWithoutDocument_itemsInput, Prisma.document_item_taxesUncheckedCreateWithoutDocument_itemsInput>;
};
export type document_item_taxesCreateManyDocument_itemsInputEnvelope = {
    data: Prisma.document_item_taxesCreateManyDocument_itemsInput | Prisma.document_item_taxesCreateManyDocument_itemsInput[];
    skipDuplicates?: boolean;
};
export type document_item_taxesUpsertWithWhereUniqueWithoutDocument_itemsInput = {
    where: Prisma.document_item_taxesWhereUniqueInput;
    update: Prisma.XOR<Prisma.document_item_taxesUpdateWithoutDocument_itemsInput, Prisma.document_item_taxesUncheckedUpdateWithoutDocument_itemsInput>;
    create: Prisma.XOR<Prisma.document_item_taxesCreateWithoutDocument_itemsInput, Prisma.document_item_taxesUncheckedCreateWithoutDocument_itemsInput>;
};
export type document_item_taxesUpdateWithWhereUniqueWithoutDocument_itemsInput = {
    where: Prisma.document_item_taxesWhereUniqueInput;
    data: Prisma.XOR<Prisma.document_item_taxesUpdateWithoutDocument_itemsInput, Prisma.document_item_taxesUncheckedUpdateWithoutDocument_itemsInput>;
};
export type document_item_taxesUpdateManyWithWhereWithoutDocument_itemsInput = {
    where: Prisma.document_item_taxesScalarWhereInput;
    data: Prisma.XOR<Prisma.document_item_taxesUpdateManyMutationInput, Prisma.document_item_taxesUncheckedUpdateManyWithoutDocument_itemsInput>;
};
export type document_item_taxesScalarWhereInput = {
    AND?: Prisma.document_item_taxesScalarWhereInput | Prisma.document_item_taxesScalarWhereInput[];
    OR?: Prisma.document_item_taxesScalarWhereInput[];
    NOT?: Prisma.document_item_taxesScalarWhereInput | Prisma.document_item_taxesScalarWhereInput[];
    id?: Prisma.UuidFilter<"document_item_taxes"> | string;
    document_item_id?: Prisma.UuidFilter<"document_item_taxes"> | string;
    tax_id?: Prisma.UuidFilter<"document_item_taxes"> | string;
    tax_rate?: Prisma.DecimalFilter<"document_item_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFilter<"document_item_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeNullableFilter<"document_item_taxes"> | Date | string | null;
};
export type document_item_taxesCreateWithoutTaxesInput = {
    id?: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string | null;
    document_items: Prisma.document_itemsCreateNestedOneWithoutDocument_item_taxesInput;
};
export type document_item_taxesUncheckedCreateWithoutTaxesInput = {
    id?: string;
    document_item_id: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string | null;
};
export type document_item_taxesCreateOrConnectWithoutTaxesInput = {
    where: Prisma.document_item_taxesWhereUniqueInput;
    create: Prisma.XOR<Prisma.document_item_taxesCreateWithoutTaxesInput, Prisma.document_item_taxesUncheckedCreateWithoutTaxesInput>;
};
export type document_item_taxesCreateManyTaxesInputEnvelope = {
    data: Prisma.document_item_taxesCreateManyTaxesInput | Prisma.document_item_taxesCreateManyTaxesInput[];
    skipDuplicates?: boolean;
};
export type document_item_taxesUpsertWithWhereUniqueWithoutTaxesInput = {
    where: Prisma.document_item_taxesWhereUniqueInput;
    update: Prisma.XOR<Prisma.document_item_taxesUpdateWithoutTaxesInput, Prisma.document_item_taxesUncheckedUpdateWithoutTaxesInput>;
    create: Prisma.XOR<Prisma.document_item_taxesCreateWithoutTaxesInput, Prisma.document_item_taxesUncheckedCreateWithoutTaxesInput>;
};
export type document_item_taxesUpdateWithWhereUniqueWithoutTaxesInput = {
    where: Prisma.document_item_taxesWhereUniqueInput;
    data: Prisma.XOR<Prisma.document_item_taxesUpdateWithoutTaxesInput, Prisma.document_item_taxesUncheckedUpdateWithoutTaxesInput>;
};
export type document_item_taxesUpdateManyWithWhereWithoutTaxesInput = {
    where: Prisma.document_item_taxesScalarWhereInput;
    data: Prisma.XOR<Prisma.document_item_taxesUpdateManyMutationInput, Prisma.document_item_taxesUncheckedUpdateManyWithoutTaxesInput>;
};
export type document_item_taxesCreateManyDocument_itemsInput = {
    id?: string;
    tax_id: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string | null;
};
export type document_item_taxesUpdateWithoutDocument_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    taxes?: Prisma.taxesUpdateOneRequiredWithoutDocument_item_taxesNestedInput;
};
export type document_item_taxesUncheckedUpdateWithoutDocument_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type document_item_taxesUncheckedUpdateManyWithoutDocument_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type document_item_taxesCreateManyTaxesInput = {
    id?: string;
    document_item_id: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string | null;
};
export type document_item_taxesUpdateWithoutTaxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    document_items?: Prisma.document_itemsUpdateOneRequiredWithoutDocument_item_taxesNestedInput;
};
export type document_item_taxesUncheckedUpdateWithoutTaxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_item_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type document_item_taxesUncheckedUpdateManyWithoutTaxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_item_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type document_item_taxesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_item_id?: boolean;
    tax_id?: boolean;
    tax_rate?: boolean;
    tax_amount?: boolean;
    created_at?: boolean;
    document_items?: boolean | Prisma.document_itemsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["document_item_taxes"]>;
export type document_item_taxesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_item_id?: boolean;
    tax_id?: boolean;
    tax_rate?: boolean;
    tax_amount?: boolean;
    created_at?: boolean;
    document_items?: boolean | Prisma.document_itemsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["document_item_taxes"]>;
export type document_item_taxesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_item_id?: boolean;
    tax_id?: boolean;
    tax_rate?: boolean;
    tax_amount?: boolean;
    created_at?: boolean;
    document_items?: boolean | Prisma.document_itemsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["document_item_taxes"]>;
export type document_item_taxesSelectScalar = {
    id?: boolean;
    document_item_id?: boolean;
    tax_id?: boolean;
    tax_rate?: boolean;
    tax_amount?: boolean;
    created_at?: boolean;
};
export type document_item_taxesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "document_item_id" | "tax_id" | "tax_rate" | "tax_amount" | "created_at", ExtArgs["result"]["document_item_taxes"]>;
export type document_item_taxesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_items?: boolean | Prisma.document_itemsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
};
export type document_item_taxesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_items?: boolean | Prisma.document_itemsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
};
export type document_item_taxesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_items?: boolean | Prisma.document_itemsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
};
export type $document_item_taxesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "document_item_taxes";
    objects: {
        document_items: Prisma.$document_itemsPayload<ExtArgs>;
        taxes: Prisma.$taxesPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        document_item_id: string;
        tax_id: string;
        tax_rate: runtime.Decimal;
        tax_amount: runtime.Decimal;
        created_at: Date | null;
    }, ExtArgs["result"]["document_item_taxes"]>;
    composites: {};
};
export type document_item_taxesGetPayload<S extends boolean | null | undefined | document_item_taxesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$document_item_taxesPayload, S>;
export type document_item_taxesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<document_item_taxesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Document_item_taxesCountAggregateInputType | true;
};
export interface document_item_taxesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['document_item_taxes'];
        meta: {
            name: 'document_item_taxes';
        };
    };
    findUnique<T extends document_item_taxesFindUniqueArgs>(args: Prisma.SelectSubset<T, document_item_taxesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__document_item_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_item_taxesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends document_item_taxesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, document_item_taxesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__document_item_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_item_taxesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends document_item_taxesFindFirstArgs>(args?: Prisma.SelectSubset<T, document_item_taxesFindFirstArgs<ExtArgs>>): Prisma.Prisma__document_item_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_item_taxesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends document_item_taxesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, document_item_taxesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__document_item_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_item_taxesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends document_item_taxesFindManyArgs>(args?: Prisma.SelectSubset<T, document_item_taxesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_item_taxesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends document_item_taxesCreateArgs>(args: Prisma.SelectSubset<T, document_item_taxesCreateArgs<ExtArgs>>): Prisma.Prisma__document_item_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_item_taxesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends document_item_taxesCreateManyArgs>(args?: Prisma.SelectSubset<T, document_item_taxesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends document_item_taxesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, document_item_taxesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_item_taxesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends document_item_taxesDeleteArgs>(args: Prisma.SelectSubset<T, document_item_taxesDeleteArgs<ExtArgs>>): Prisma.Prisma__document_item_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_item_taxesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends document_item_taxesUpdateArgs>(args: Prisma.SelectSubset<T, document_item_taxesUpdateArgs<ExtArgs>>): Prisma.Prisma__document_item_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_item_taxesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends document_item_taxesDeleteManyArgs>(args?: Prisma.SelectSubset<T, document_item_taxesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends document_item_taxesUpdateManyArgs>(args: Prisma.SelectSubset<T, document_item_taxesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends document_item_taxesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, document_item_taxesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_item_taxesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends document_item_taxesUpsertArgs>(args: Prisma.SelectSubset<T, document_item_taxesUpsertArgs<ExtArgs>>): Prisma.Prisma__document_item_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_item_taxesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends document_item_taxesCountArgs>(args?: Prisma.Subset<T, document_item_taxesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Document_item_taxesCountAggregateOutputType> : number>;
    aggregate<T extends Document_item_taxesAggregateArgs>(args: Prisma.Subset<T, Document_item_taxesAggregateArgs>): Prisma.PrismaPromise<GetDocument_item_taxesAggregateType<T>>;
    groupBy<T extends document_item_taxesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: document_item_taxesGroupByArgs['orderBy'];
    } : {
        orderBy?: document_item_taxesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, document_item_taxesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocument_item_taxesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: document_item_taxesFieldRefs;
}
export interface Prisma__document_item_taxesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    document_items<T extends Prisma.document_itemsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.document_itemsDefaultArgs<ExtArgs>>): Prisma.Prisma__document_itemsClient<runtime.Types.Result.GetResult<Prisma.$document_itemsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    taxes<T extends Prisma.taxesDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.taxesDefaultArgs<ExtArgs>>): Prisma.Prisma__taxesClient<runtime.Types.Result.GetResult<Prisma.$taxesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface document_item_taxesFieldRefs {
    readonly id: Prisma.FieldRef<"document_item_taxes", 'String'>;
    readonly document_item_id: Prisma.FieldRef<"document_item_taxes", 'String'>;
    readonly tax_id: Prisma.FieldRef<"document_item_taxes", 'String'>;
    readonly tax_rate: Prisma.FieldRef<"document_item_taxes", 'Decimal'>;
    readonly tax_amount: Prisma.FieldRef<"document_item_taxes", 'Decimal'>;
    readonly created_at: Prisma.FieldRef<"document_item_taxes", 'DateTime'>;
}
export type document_item_taxesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_item_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_item_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_item_taxesInclude<ExtArgs> | null;
    where: Prisma.document_item_taxesWhereUniqueInput;
};
export type document_item_taxesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_item_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_item_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_item_taxesInclude<ExtArgs> | null;
    where: Prisma.document_item_taxesWhereUniqueInput;
};
export type document_item_taxesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_item_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_item_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_item_taxesInclude<ExtArgs> | null;
    where?: Prisma.document_item_taxesWhereInput;
    orderBy?: Prisma.document_item_taxesOrderByWithRelationInput | Prisma.document_item_taxesOrderByWithRelationInput[];
    cursor?: Prisma.document_item_taxesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_item_taxesScalarFieldEnum | Prisma.Document_item_taxesScalarFieldEnum[];
};
export type document_item_taxesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_item_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_item_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_item_taxesInclude<ExtArgs> | null;
    where?: Prisma.document_item_taxesWhereInput;
    orderBy?: Prisma.document_item_taxesOrderByWithRelationInput | Prisma.document_item_taxesOrderByWithRelationInput[];
    cursor?: Prisma.document_item_taxesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_item_taxesScalarFieldEnum | Prisma.Document_item_taxesScalarFieldEnum[];
};
export type document_item_taxesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_item_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_item_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_item_taxesInclude<ExtArgs> | null;
    where?: Prisma.document_item_taxesWhereInput;
    orderBy?: Prisma.document_item_taxesOrderByWithRelationInput | Prisma.document_item_taxesOrderByWithRelationInput[];
    cursor?: Prisma.document_item_taxesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_item_taxesScalarFieldEnum | Prisma.Document_item_taxesScalarFieldEnum[];
};
export type document_item_taxesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_item_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_item_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_item_taxesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_item_taxesCreateInput, Prisma.document_item_taxesUncheckedCreateInput>;
};
export type document_item_taxesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.document_item_taxesCreateManyInput | Prisma.document_item_taxesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type document_item_taxesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_item_taxesSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.document_item_taxesOmit<ExtArgs> | null;
    data: Prisma.document_item_taxesCreateManyInput | Prisma.document_item_taxesCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.document_item_taxesIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type document_item_taxesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_item_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_item_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_item_taxesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_item_taxesUpdateInput, Prisma.document_item_taxesUncheckedUpdateInput>;
    where: Prisma.document_item_taxesWhereUniqueInput;
};
export type document_item_taxesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.document_item_taxesUpdateManyMutationInput, Prisma.document_item_taxesUncheckedUpdateManyInput>;
    where?: Prisma.document_item_taxesWhereInput;
    limit?: number;
};
export type document_item_taxesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_item_taxesSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.document_item_taxesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_item_taxesUpdateManyMutationInput, Prisma.document_item_taxesUncheckedUpdateManyInput>;
    where?: Prisma.document_item_taxesWhereInput;
    limit?: number;
    include?: Prisma.document_item_taxesIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type document_item_taxesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_item_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_item_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_item_taxesInclude<ExtArgs> | null;
    where: Prisma.document_item_taxesWhereUniqueInput;
    create: Prisma.XOR<Prisma.document_item_taxesCreateInput, Prisma.document_item_taxesUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.document_item_taxesUpdateInput, Prisma.document_item_taxesUncheckedUpdateInput>;
};
export type document_item_taxesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_item_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_item_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_item_taxesInclude<ExtArgs> | null;
    where: Prisma.document_item_taxesWhereUniqueInput;
};
export type document_item_taxesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_item_taxesWhereInput;
    limit?: number;
};
export type document_item_taxesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_item_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_item_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_item_taxesInclude<ExtArgs> | null;
};
