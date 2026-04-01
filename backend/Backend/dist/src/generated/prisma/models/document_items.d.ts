import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type document_itemsModel = runtime.Types.Result.DefaultSelection<Prisma.$document_itemsPayload>;
export type AggregateDocument_items = {
    _count: Document_itemsCountAggregateOutputType | null;
    _avg: Document_itemsAvgAggregateOutputType | null;
    _sum: Document_itemsSumAggregateOutputType | null;
    _min: Document_itemsMinAggregateOutputType | null;
    _max: Document_itemsMaxAggregateOutputType | null;
};
export type Document_itemsAvgAggregateOutputType = {
    quantity: runtime.Decimal | null;
    price: runtime.Decimal | null;
    unit_price: runtime.Decimal | null;
};
export type Document_itemsSumAggregateOutputType = {
    quantity: runtime.Decimal | null;
    price: runtime.Decimal | null;
    unit_price: runtime.Decimal | null;
};
export type Document_itemsMinAggregateOutputType = {
    id: string | null;
    document_id: string | null;
    product_id: string | null;
    quantity: runtime.Decimal | null;
    price: runtime.Decimal | null;
    created_at: Date | null;
    unit_price: runtime.Decimal | null;
};
export type Document_itemsMaxAggregateOutputType = {
    id: string | null;
    document_id: string | null;
    product_id: string | null;
    quantity: runtime.Decimal | null;
    price: runtime.Decimal | null;
    created_at: Date | null;
    unit_price: runtime.Decimal | null;
};
export type Document_itemsCountAggregateOutputType = {
    id: number;
    document_id: number;
    product_id: number;
    quantity: number;
    price: number;
    created_at: number;
    unit_price: number;
    _all: number;
};
export type Document_itemsAvgAggregateInputType = {
    quantity?: true;
    price?: true;
    unit_price?: true;
};
export type Document_itemsSumAggregateInputType = {
    quantity?: true;
    price?: true;
    unit_price?: true;
};
export type Document_itemsMinAggregateInputType = {
    id?: true;
    document_id?: true;
    product_id?: true;
    quantity?: true;
    price?: true;
    created_at?: true;
    unit_price?: true;
};
export type Document_itemsMaxAggregateInputType = {
    id?: true;
    document_id?: true;
    product_id?: true;
    quantity?: true;
    price?: true;
    created_at?: true;
    unit_price?: true;
};
export type Document_itemsCountAggregateInputType = {
    id?: true;
    document_id?: true;
    product_id?: true;
    quantity?: true;
    price?: true;
    created_at?: true;
    unit_price?: true;
    _all?: true;
};
export type Document_itemsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_itemsWhereInput;
    orderBy?: Prisma.document_itemsOrderByWithRelationInput | Prisma.document_itemsOrderByWithRelationInput[];
    cursor?: Prisma.document_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Document_itemsCountAggregateInputType;
    _avg?: Document_itemsAvgAggregateInputType;
    _sum?: Document_itemsSumAggregateInputType;
    _min?: Document_itemsMinAggregateInputType;
    _max?: Document_itemsMaxAggregateInputType;
};
export type GetDocument_itemsAggregateType<T extends Document_itemsAggregateArgs> = {
    [P in keyof T & keyof AggregateDocument_items]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocument_items[P]> : Prisma.GetScalarType<T[P], AggregateDocument_items[P]>;
};
export type document_itemsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_itemsWhereInput;
    orderBy?: Prisma.document_itemsOrderByWithAggregationInput | Prisma.document_itemsOrderByWithAggregationInput[];
    by: Prisma.Document_itemsScalarFieldEnum[] | Prisma.Document_itemsScalarFieldEnum;
    having?: Prisma.document_itemsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Document_itemsCountAggregateInputType | true;
    _avg?: Document_itemsAvgAggregateInputType;
    _sum?: Document_itemsSumAggregateInputType;
    _min?: Document_itemsMinAggregateInputType;
    _max?: Document_itemsMaxAggregateInputType;
};
export type Document_itemsGroupByOutputType = {
    id: string;
    document_id: string;
    product_id: string | null;
    quantity: runtime.Decimal;
    price: runtime.Decimal;
    created_at: Date;
    unit_price: runtime.Decimal;
    _count: Document_itemsCountAggregateOutputType | null;
    _avg: Document_itemsAvgAggregateOutputType | null;
    _sum: Document_itemsSumAggregateOutputType | null;
    _min: Document_itemsMinAggregateOutputType | null;
    _max: Document_itemsMaxAggregateOutputType | null;
};
export type GetDocument_itemsGroupByPayload<T extends document_itemsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Document_itemsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Document_itemsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Document_itemsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Document_itemsGroupByOutputType[P]>;
}>>;
export type document_itemsWhereInput = {
    AND?: Prisma.document_itemsWhereInput | Prisma.document_itemsWhereInput[];
    OR?: Prisma.document_itemsWhereInput[];
    NOT?: Prisma.document_itemsWhereInput | Prisma.document_itemsWhereInput[];
    id?: Prisma.UuidFilter<"document_items"> | string;
    document_id?: Prisma.UuidFilter<"document_items"> | string;
    product_id?: Prisma.UuidNullableFilter<"document_items"> | string | null;
    quantity?: Prisma.DecimalFilter<"document_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    price?: Prisma.DecimalFilter<"document_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFilter<"document_items"> | Date | string;
    unit_price?: Prisma.DecimalFilter<"document_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    document_item_taxes?: Prisma.Document_item_taxesListRelationFilter;
    documents?: Prisma.XOR<Prisma.DocumentsScalarRelationFilter, Prisma.documentsWhereInput>;
};
export type document_itemsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    document_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    unit_price?: Prisma.SortOrder;
    document_item_taxes?: Prisma.document_item_taxesOrderByRelationAggregateInput;
    documents?: Prisma.documentsOrderByWithRelationInput;
};
export type document_itemsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.document_itemsWhereInput | Prisma.document_itemsWhereInput[];
    OR?: Prisma.document_itemsWhereInput[];
    NOT?: Prisma.document_itemsWhereInput | Prisma.document_itemsWhereInput[];
    document_id?: Prisma.UuidFilter<"document_items"> | string;
    product_id?: Prisma.UuidNullableFilter<"document_items"> | string | null;
    quantity?: Prisma.DecimalFilter<"document_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    price?: Prisma.DecimalFilter<"document_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFilter<"document_items"> | Date | string;
    unit_price?: Prisma.DecimalFilter<"document_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    document_item_taxes?: Prisma.Document_item_taxesListRelationFilter;
    documents?: Prisma.XOR<Prisma.DocumentsScalarRelationFilter, Prisma.documentsWhereInput>;
}, "id">;
export type document_itemsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    document_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    unit_price?: Prisma.SortOrder;
    _count?: Prisma.document_itemsCountOrderByAggregateInput;
    _avg?: Prisma.document_itemsAvgOrderByAggregateInput;
    _max?: Prisma.document_itemsMaxOrderByAggregateInput;
    _min?: Prisma.document_itemsMinOrderByAggregateInput;
    _sum?: Prisma.document_itemsSumOrderByAggregateInput;
};
export type document_itemsScalarWhereWithAggregatesInput = {
    AND?: Prisma.document_itemsScalarWhereWithAggregatesInput | Prisma.document_itemsScalarWhereWithAggregatesInput[];
    OR?: Prisma.document_itemsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.document_itemsScalarWhereWithAggregatesInput | Prisma.document_itemsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"document_items"> | string;
    document_id?: Prisma.UuidWithAggregatesFilter<"document_items"> | string;
    product_id?: Prisma.UuidNullableWithAggregatesFilter<"document_items"> | string | null;
    quantity?: Prisma.DecimalWithAggregatesFilter<"document_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    price?: Prisma.DecimalWithAggregatesFilter<"document_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"document_items"> | Date | string;
    unit_price?: Prisma.DecimalWithAggregatesFilter<"document_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type document_itemsCreateInput = {
    id?: string;
    product_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    document_item_taxes?: Prisma.document_item_taxesCreateNestedManyWithoutDocument_itemsInput;
    documents: Prisma.documentsCreateNestedOneWithoutDocument_itemsInput;
};
export type document_itemsUncheckedCreateInput = {
    id?: string;
    document_id: string;
    product_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    document_item_taxes?: Prisma.document_item_taxesUncheckedCreateNestedManyWithoutDocument_itemsInput;
};
export type document_itemsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    document_item_taxes?: Prisma.document_item_taxesUpdateManyWithoutDocument_itemsNestedInput;
    documents?: Prisma.documentsUpdateOneRequiredWithoutDocument_itemsNestedInput;
};
export type document_itemsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    document_item_taxes?: Prisma.document_item_taxesUncheckedUpdateManyWithoutDocument_itemsNestedInput;
};
export type document_itemsCreateManyInput = {
    id?: string;
    document_id: string;
    product_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type document_itemsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type document_itemsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type Document_itemsScalarRelationFilter = {
    is?: Prisma.document_itemsWhereInput;
    isNot?: Prisma.document_itemsWhereInput;
};
export type document_itemsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    unit_price?: Prisma.SortOrder;
};
export type document_itemsAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    unit_price?: Prisma.SortOrder;
};
export type document_itemsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    unit_price?: Prisma.SortOrder;
};
export type document_itemsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    unit_price?: Prisma.SortOrder;
};
export type document_itemsSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    unit_price?: Prisma.SortOrder;
};
export type Document_itemsListRelationFilter = {
    every?: Prisma.document_itemsWhereInput;
    some?: Prisma.document_itemsWhereInput;
    none?: Prisma.document_itemsWhereInput;
};
export type document_itemsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type document_itemsCreateNestedOneWithoutDocument_item_taxesInput = {
    create?: Prisma.XOR<Prisma.document_itemsCreateWithoutDocument_item_taxesInput, Prisma.document_itemsUncheckedCreateWithoutDocument_item_taxesInput>;
    connectOrCreate?: Prisma.document_itemsCreateOrConnectWithoutDocument_item_taxesInput;
    connect?: Prisma.document_itemsWhereUniqueInput;
};
export type document_itemsUpdateOneRequiredWithoutDocument_item_taxesNestedInput = {
    create?: Prisma.XOR<Prisma.document_itemsCreateWithoutDocument_item_taxesInput, Prisma.document_itemsUncheckedCreateWithoutDocument_item_taxesInput>;
    connectOrCreate?: Prisma.document_itemsCreateOrConnectWithoutDocument_item_taxesInput;
    upsert?: Prisma.document_itemsUpsertWithoutDocument_item_taxesInput;
    connect?: Prisma.document_itemsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.document_itemsUpdateToOneWithWhereWithoutDocument_item_taxesInput, Prisma.document_itemsUpdateWithoutDocument_item_taxesInput>, Prisma.document_itemsUncheckedUpdateWithoutDocument_item_taxesInput>;
};
export type document_itemsCreateNestedManyWithoutDocumentsInput = {
    create?: Prisma.XOR<Prisma.document_itemsCreateWithoutDocumentsInput, Prisma.document_itemsUncheckedCreateWithoutDocumentsInput> | Prisma.document_itemsCreateWithoutDocumentsInput[] | Prisma.document_itemsUncheckedCreateWithoutDocumentsInput[];
    connectOrCreate?: Prisma.document_itemsCreateOrConnectWithoutDocumentsInput | Prisma.document_itemsCreateOrConnectWithoutDocumentsInput[];
    createMany?: Prisma.document_itemsCreateManyDocumentsInputEnvelope;
    connect?: Prisma.document_itemsWhereUniqueInput | Prisma.document_itemsWhereUniqueInput[];
};
export type document_itemsUncheckedCreateNestedManyWithoutDocumentsInput = {
    create?: Prisma.XOR<Prisma.document_itemsCreateWithoutDocumentsInput, Prisma.document_itemsUncheckedCreateWithoutDocumentsInput> | Prisma.document_itemsCreateWithoutDocumentsInput[] | Prisma.document_itemsUncheckedCreateWithoutDocumentsInput[];
    connectOrCreate?: Prisma.document_itemsCreateOrConnectWithoutDocumentsInput | Prisma.document_itemsCreateOrConnectWithoutDocumentsInput[];
    createMany?: Prisma.document_itemsCreateManyDocumentsInputEnvelope;
    connect?: Prisma.document_itemsWhereUniqueInput | Prisma.document_itemsWhereUniqueInput[];
};
export type document_itemsUpdateManyWithoutDocumentsNestedInput = {
    create?: Prisma.XOR<Prisma.document_itemsCreateWithoutDocumentsInput, Prisma.document_itemsUncheckedCreateWithoutDocumentsInput> | Prisma.document_itemsCreateWithoutDocumentsInput[] | Prisma.document_itemsUncheckedCreateWithoutDocumentsInput[];
    connectOrCreate?: Prisma.document_itemsCreateOrConnectWithoutDocumentsInput | Prisma.document_itemsCreateOrConnectWithoutDocumentsInput[];
    upsert?: Prisma.document_itemsUpsertWithWhereUniqueWithoutDocumentsInput | Prisma.document_itemsUpsertWithWhereUniqueWithoutDocumentsInput[];
    createMany?: Prisma.document_itemsCreateManyDocumentsInputEnvelope;
    set?: Prisma.document_itemsWhereUniqueInput | Prisma.document_itemsWhereUniqueInput[];
    disconnect?: Prisma.document_itemsWhereUniqueInput | Prisma.document_itemsWhereUniqueInput[];
    delete?: Prisma.document_itemsWhereUniqueInput | Prisma.document_itemsWhereUniqueInput[];
    connect?: Prisma.document_itemsWhereUniqueInput | Prisma.document_itemsWhereUniqueInput[];
    update?: Prisma.document_itemsUpdateWithWhereUniqueWithoutDocumentsInput | Prisma.document_itemsUpdateWithWhereUniqueWithoutDocumentsInput[];
    updateMany?: Prisma.document_itemsUpdateManyWithWhereWithoutDocumentsInput | Prisma.document_itemsUpdateManyWithWhereWithoutDocumentsInput[];
    deleteMany?: Prisma.document_itemsScalarWhereInput | Prisma.document_itemsScalarWhereInput[];
};
export type document_itemsUncheckedUpdateManyWithoutDocumentsNestedInput = {
    create?: Prisma.XOR<Prisma.document_itemsCreateWithoutDocumentsInput, Prisma.document_itemsUncheckedCreateWithoutDocumentsInput> | Prisma.document_itemsCreateWithoutDocumentsInput[] | Prisma.document_itemsUncheckedCreateWithoutDocumentsInput[];
    connectOrCreate?: Prisma.document_itemsCreateOrConnectWithoutDocumentsInput | Prisma.document_itemsCreateOrConnectWithoutDocumentsInput[];
    upsert?: Prisma.document_itemsUpsertWithWhereUniqueWithoutDocumentsInput | Prisma.document_itemsUpsertWithWhereUniqueWithoutDocumentsInput[];
    createMany?: Prisma.document_itemsCreateManyDocumentsInputEnvelope;
    set?: Prisma.document_itemsWhereUniqueInput | Prisma.document_itemsWhereUniqueInput[];
    disconnect?: Prisma.document_itemsWhereUniqueInput | Prisma.document_itemsWhereUniqueInput[];
    delete?: Prisma.document_itemsWhereUniqueInput | Prisma.document_itemsWhereUniqueInput[];
    connect?: Prisma.document_itemsWhereUniqueInput | Prisma.document_itemsWhereUniqueInput[];
    update?: Prisma.document_itemsUpdateWithWhereUniqueWithoutDocumentsInput | Prisma.document_itemsUpdateWithWhereUniqueWithoutDocumentsInput[];
    updateMany?: Prisma.document_itemsUpdateManyWithWhereWithoutDocumentsInput | Prisma.document_itemsUpdateManyWithWhereWithoutDocumentsInput[];
    deleteMany?: Prisma.document_itemsScalarWhereInput | Prisma.document_itemsScalarWhereInput[];
};
export type document_itemsCreateWithoutDocument_item_taxesInput = {
    id?: string;
    product_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    documents: Prisma.documentsCreateNestedOneWithoutDocument_itemsInput;
};
export type document_itemsUncheckedCreateWithoutDocument_item_taxesInput = {
    id?: string;
    document_id: string;
    product_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type document_itemsCreateOrConnectWithoutDocument_item_taxesInput = {
    where: Prisma.document_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.document_itemsCreateWithoutDocument_item_taxesInput, Prisma.document_itemsUncheckedCreateWithoutDocument_item_taxesInput>;
};
export type document_itemsUpsertWithoutDocument_item_taxesInput = {
    update: Prisma.XOR<Prisma.document_itemsUpdateWithoutDocument_item_taxesInput, Prisma.document_itemsUncheckedUpdateWithoutDocument_item_taxesInput>;
    create: Prisma.XOR<Prisma.document_itemsCreateWithoutDocument_item_taxesInput, Prisma.document_itemsUncheckedCreateWithoutDocument_item_taxesInput>;
    where?: Prisma.document_itemsWhereInput;
};
export type document_itemsUpdateToOneWithWhereWithoutDocument_item_taxesInput = {
    where?: Prisma.document_itemsWhereInput;
    data: Prisma.XOR<Prisma.document_itemsUpdateWithoutDocument_item_taxesInput, Prisma.document_itemsUncheckedUpdateWithoutDocument_item_taxesInput>;
};
export type document_itemsUpdateWithoutDocument_item_taxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    documents?: Prisma.documentsUpdateOneRequiredWithoutDocument_itemsNestedInput;
};
export type document_itemsUncheckedUpdateWithoutDocument_item_taxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type document_itemsCreateWithoutDocumentsInput = {
    id?: string;
    product_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    document_item_taxes?: Prisma.document_item_taxesCreateNestedManyWithoutDocument_itemsInput;
};
export type document_itemsUncheckedCreateWithoutDocumentsInput = {
    id?: string;
    product_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    document_item_taxes?: Prisma.document_item_taxesUncheckedCreateNestedManyWithoutDocument_itemsInput;
};
export type document_itemsCreateOrConnectWithoutDocumentsInput = {
    where: Prisma.document_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.document_itemsCreateWithoutDocumentsInput, Prisma.document_itemsUncheckedCreateWithoutDocumentsInput>;
};
export type document_itemsCreateManyDocumentsInputEnvelope = {
    data: Prisma.document_itemsCreateManyDocumentsInput | Prisma.document_itemsCreateManyDocumentsInput[];
    skipDuplicates?: boolean;
};
export type document_itemsUpsertWithWhereUniqueWithoutDocumentsInput = {
    where: Prisma.document_itemsWhereUniqueInput;
    update: Prisma.XOR<Prisma.document_itemsUpdateWithoutDocumentsInput, Prisma.document_itemsUncheckedUpdateWithoutDocumentsInput>;
    create: Prisma.XOR<Prisma.document_itemsCreateWithoutDocumentsInput, Prisma.document_itemsUncheckedCreateWithoutDocumentsInput>;
};
export type document_itemsUpdateWithWhereUniqueWithoutDocumentsInput = {
    where: Prisma.document_itemsWhereUniqueInput;
    data: Prisma.XOR<Prisma.document_itemsUpdateWithoutDocumentsInput, Prisma.document_itemsUncheckedUpdateWithoutDocumentsInput>;
};
export type document_itemsUpdateManyWithWhereWithoutDocumentsInput = {
    where: Prisma.document_itemsScalarWhereInput;
    data: Prisma.XOR<Prisma.document_itemsUpdateManyMutationInput, Prisma.document_itemsUncheckedUpdateManyWithoutDocumentsInput>;
};
export type document_itemsScalarWhereInput = {
    AND?: Prisma.document_itemsScalarWhereInput | Prisma.document_itemsScalarWhereInput[];
    OR?: Prisma.document_itemsScalarWhereInput[];
    NOT?: Prisma.document_itemsScalarWhereInput | Prisma.document_itemsScalarWhereInput[];
    id?: Prisma.UuidFilter<"document_items"> | string;
    document_id?: Prisma.UuidFilter<"document_items"> | string;
    product_id?: Prisma.UuidNullableFilter<"document_items"> | string | null;
    quantity?: Prisma.DecimalFilter<"document_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    price?: Prisma.DecimalFilter<"document_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFilter<"document_items"> | Date | string;
    unit_price?: Prisma.DecimalFilter<"document_items"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type document_itemsCreateManyDocumentsInput = {
    id?: string;
    product_id?: string | null;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    unit_price?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type document_itemsUpdateWithoutDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    document_item_taxes?: Prisma.document_item_taxesUpdateManyWithoutDocument_itemsNestedInput;
};
export type document_itemsUncheckedUpdateWithoutDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    document_item_taxes?: Prisma.document_item_taxesUncheckedUpdateManyWithoutDocument_itemsNestedInput;
};
export type document_itemsUncheckedUpdateManyWithoutDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type Document_itemsCountOutputType = {
    document_item_taxes: number;
};
export type Document_itemsCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_item_taxes?: boolean | Document_itemsCountOutputTypeCountDocument_item_taxesArgs;
};
export type Document_itemsCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.Document_itemsCountOutputTypeSelect<ExtArgs> | null;
};
export type Document_itemsCountOutputTypeCountDocument_item_taxesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_item_taxesWhereInput;
};
export type document_itemsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_id?: boolean;
    product_id?: boolean;
    quantity?: boolean;
    price?: boolean;
    created_at?: boolean;
    unit_price?: boolean;
    document_item_taxes?: boolean | Prisma.document_items$document_item_taxesArgs<ExtArgs>;
    documents?: boolean | Prisma.documentsDefaultArgs<ExtArgs>;
    _count?: boolean | Prisma.Document_itemsCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["document_items"]>;
export type document_itemsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_id?: boolean;
    product_id?: boolean;
    quantity?: boolean;
    price?: boolean;
    created_at?: boolean;
    unit_price?: boolean;
    documents?: boolean | Prisma.documentsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["document_items"]>;
export type document_itemsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_id?: boolean;
    product_id?: boolean;
    quantity?: boolean;
    price?: boolean;
    created_at?: boolean;
    unit_price?: boolean;
    documents?: boolean | Prisma.documentsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["document_items"]>;
export type document_itemsSelectScalar = {
    id?: boolean;
    document_id?: boolean;
    product_id?: boolean;
    quantity?: boolean;
    price?: boolean;
    created_at?: boolean;
    unit_price?: boolean;
};
export type document_itemsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "document_id" | "product_id" | "quantity" | "price" | "created_at" | "unit_price", ExtArgs["result"]["document_items"]>;
export type document_itemsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_item_taxes?: boolean | Prisma.document_items$document_item_taxesArgs<ExtArgs>;
    documents?: boolean | Prisma.documentsDefaultArgs<ExtArgs>;
    _count?: boolean | Prisma.Document_itemsCountOutputTypeDefaultArgs<ExtArgs>;
};
export type document_itemsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    documents?: boolean | Prisma.documentsDefaultArgs<ExtArgs>;
};
export type document_itemsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    documents?: boolean | Prisma.documentsDefaultArgs<ExtArgs>;
};
export type $document_itemsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "document_items";
    objects: {
        document_item_taxes: Prisma.$document_item_taxesPayload<ExtArgs>[];
        documents: Prisma.$documentsPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        document_id: string;
        product_id: string | null;
        quantity: runtime.Decimal;
        price: runtime.Decimal;
        created_at: Date;
        unit_price: runtime.Decimal;
    }, ExtArgs["result"]["document_items"]>;
    composites: {};
};
export type document_itemsGetPayload<S extends boolean | null | undefined | document_itemsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$document_itemsPayload, S>;
export type document_itemsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<document_itemsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Document_itemsCountAggregateInputType | true;
};
export interface document_itemsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['document_items'];
        meta: {
            name: 'document_items';
        };
    };
    findUnique<T extends document_itemsFindUniqueArgs>(args: Prisma.SelectSubset<T, document_itemsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__document_itemsClient<runtime.Types.Result.GetResult<Prisma.$document_itemsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends document_itemsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, document_itemsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__document_itemsClient<runtime.Types.Result.GetResult<Prisma.$document_itemsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends document_itemsFindFirstArgs>(args?: Prisma.SelectSubset<T, document_itemsFindFirstArgs<ExtArgs>>): Prisma.Prisma__document_itemsClient<runtime.Types.Result.GetResult<Prisma.$document_itemsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends document_itemsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, document_itemsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__document_itemsClient<runtime.Types.Result.GetResult<Prisma.$document_itemsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends document_itemsFindManyArgs>(args?: Prisma.SelectSubset<T, document_itemsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_itemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends document_itemsCreateArgs>(args: Prisma.SelectSubset<T, document_itemsCreateArgs<ExtArgs>>): Prisma.Prisma__document_itemsClient<runtime.Types.Result.GetResult<Prisma.$document_itemsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends document_itemsCreateManyArgs>(args?: Prisma.SelectSubset<T, document_itemsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends document_itemsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, document_itemsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_itemsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends document_itemsDeleteArgs>(args: Prisma.SelectSubset<T, document_itemsDeleteArgs<ExtArgs>>): Prisma.Prisma__document_itemsClient<runtime.Types.Result.GetResult<Prisma.$document_itemsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends document_itemsUpdateArgs>(args: Prisma.SelectSubset<T, document_itemsUpdateArgs<ExtArgs>>): Prisma.Prisma__document_itemsClient<runtime.Types.Result.GetResult<Prisma.$document_itemsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends document_itemsDeleteManyArgs>(args?: Prisma.SelectSubset<T, document_itemsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends document_itemsUpdateManyArgs>(args: Prisma.SelectSubset<T, document_itemsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends document_itemsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, document_itemsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_itemsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends document_itemsUpsertArgs>(args: Prisma.SelectSubset<T, document_itemsUpsertArgs<ExtArgs>>): Prisma.Prisma__document_itemsClient<runtime.Types.Result.GetResult<Prisma.$document_itemsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends document_itemsCountArgs>(args?: Prisma.Subset<T, document_itemsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Document_itemsCountAggregateOutputType> : number>;
    aggregate<T extends Document_itemsAggregateArgs>(args: Prisma.Subset<T, Document_itemsAggregateArgs>): Prisma.PrismaPromise<GetDocument_itemsAggregateType<T>>;
    groupBy<T extends document_itemsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: document_itemsGroupByArgs['orderBy'];
    } : {
        orderBy?: document_itemsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, document_itemsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocument_itemsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: document_itemsFieldRefs;
}
export interface Prisma__document_itemsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    document_item_taxes<T extends Prisma.document_items$document_item_taxesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.document_items$document_item_taxesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_item_taxesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    documents<T extends Prisma.documentsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.documentsDefaultArgs<ExtArgs>>): Prisma.Prisma__documentsClient<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface document_itemsFieldRefs {
    readonly id: Prisma.FieldRef<"document_items", 'String'>;
    readonly document_id: Prisma.FieldRef<"document_items", 'String'>;
    readonly product_id: Prisma.FieldRef<"document_items", 'String'>;
    readonly quantity: Prisma.FieldRef<"document_items", 'Decimal'>;
    readonly price: Prisma.FieldRef<"document_items", 'Decimal'>;
    readonly created_at: Prisma.FieldRef<"document_items", 'DateTime'>;
    readonly unit_price: Prisma.FieldRef<"document_items", 'Decimal'>;
}
export type document_itemsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_itemsSelect<ExtArgs> | null;
    omit?: Prisma.document_itemsOmit<ExtArgs> | null;
    include?: Prisma.document_itemsInclude<ExtArgs> | null;
    where: Prisma.document_itemsWhereUniqueInput;
};
export type document_itemsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_itemsSelect<ExtArgs> | null;
    omit?: Prisma.document_itemsOmit<ExtArgs> | null;
    include?: Prisma.document_itemsInclude<ExtArgs> | null;
    where: Prisma.document_itemsWhereUniqueInput;
};
export type document_itemsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_itemsSelect<ExtArgs> | null;
    omit?: Prisma.document_itemsOmit<ExtArgs> | null;
    include?: Prisma.document_itemsInclude<ExtArgs> | null;
    where?: Prisma.document_itemsWhereInput;
    orderBy?: Prisma.document_itemsOrderByWithRelationInput | Prisma.document_itemsOrderByWithRelationInput[];
    cursor?: Prisma.document_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_itemsScalarFieldEnum | Prisma.Document_itemsScalarFieldEnum[];
};
export type document_itemsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_itemsSelect<ExtArgs> | null;
    omit?: Prisma.document_itemsOmit<ExtArgs> | null;
    include?: Prisma.document_itemsInclude<ExtArgs> | null;
    where?: Prisma.document_itemsWhereInput;
    orderBy?: Prisma.document_itemsOrderByWithRelationInput | Prisma.document_itemsOrderByWithRelationInput[];
    cursor?: Prisma.document_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_itemsScalarFieldEnum | Prisma.Document_itemsScalarFieldEnum[];
};
export type document_itemsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_itemsSelect<ExtArgs> | null;
    omit?: Prisma.document_itemsOmit<ExtArgs> | null;
    include?: Prisma.document_itemsInclude<ExtArgs> | null;
    where?: Prisma.document_itemsWhereInput;
    orderBy?: Prisma.document_itemsOrderByWithRelationInput | Prisma.document_itemsOrderByWithRelationInput[];
    cursor?: Prisma.document_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_itemsScalarFieldEnum | Prisma.Document_itemsScalarFieldEnum[];
};
export type document_itemsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_itemsSelect<ExtArgs> | null;
    omit?: Prisma.document_itemsOmit<ExtArgs> | null;
    include?: Prisma.document_itemsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_itemsCreateInput, Prisma.document_itemsUncheckedCreateInput>;
};
export type document_itemsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.document_itemsCreateManyInput | Prisma.document_itemsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type document_itemsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_itemsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.document_itemsOmit<ExtArgs> | null;
    data: Prisma.document_itemsCreateManyInput | Prisma.document_itemsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.document_itemsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type document_itemsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_itemsSelect<ExtArgs> | null;
    omit?: Prisma.document_itemsOmit<ExtArgs> | null;
    include?: Prisma.document_itemsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_itemsUpdateInput, Prisma.document_itemsUncheckedUpdateInput>;
    where: Prisma.document_itemsWhereUniqueInput;
};
export type document_itemsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.document_itemsUpdateManyMutationInput, Prisma.document_itemsUncheckedUpdateManyInput>;
    where?: Prisma.document_itemsWhereInput;
    limit?: number;
};
export type document_itemsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_itemsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.document_itemsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_itemsUpdateManyMutationInput, Prisma.document_itemsUncheckedUpdateManyInput>;
    where?: Prisma.document_itemsWhereInput;
    limit?: number;
    include?: Prisma.document_itemsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type document_itemsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_itemsSelect<ExtArgs> | null;
    omit?: Prisma.document_itemsOmit<ExtArgs> | null;
    include?: Prisma.document_itemsInclude<ExtArgs> | null;
    where: Prisma.document_itemsWhereUniqueInput;
    create: Prisma.XOR<Prisma.document_itemsCreateInput, Prisma.document_itemsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.document_itemsUpdateInput, Prisma.document_itemsUncheckedUpdateInput>;
};
export type document_itemsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_itemsSelect<ExtArgs> | null;
    omit?: Prisma.document_itemsOmit<ExtArgs> | null;
    include?: Prisma.document_itemsInclude<ExtArgs> | null;
    where: Prisma.document_itemsWhereUniqueInput;
};
export type document_itemsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_itemsWhereInput;
    limit?: number;
};
export type document_items$document_item_taxesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type document_itemsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_itemsSelect<ExtArgs> | null;
    omit?: Prisma.document_itemsOmit<ExtArgs> | null;
    include?: Prisma.document_itemsInclude<ExtArgs> | null;
};
