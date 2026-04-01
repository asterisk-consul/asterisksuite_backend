import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type document_taxesModel = runtime.Types.Result.DefaultSelection<Prisma.$document_taxesPayload>;
export type AggregateDocument_taxes = {
    _count: Document_taxesCountAggregateOutputType | null;
    _avg: Document_taxesAvgAggregateOutputType | null;
    _sum: Document_taxesSumAggregateOutputType | null;
    _min: Document_taxesMinAggregateOutputType | null;
    _max: Document_taxesMaxAggregateOutputType | null;
};
export type Document_taxesAvgAggregateOutputType = {
    tax_rate: runtime.Decimal | null;
    taxable_base: runtime.Decimal | null;
    tax_amount: runtime.Decimal | null;
};
export type Document_taxesSumAggregateOutputType = {
    tax_rate: runtime.Decimal | null;
    taxable_base: runtime.Decimal | null;
    tax_amount: runtime.Decimal | null;
};
export type Document_taxesMinAggregateOutputType = {
    id: string | null;
    document_id: string | null;
    tax_id: string | null;
    tax_rate: runtime.Decimal | null;
    taxable_base: runtime.Decimal | null;
    tax_amount: runtime.Decimal | null;
    created_at: Date | null;
};
export type Document_taxesMaxAggregateOutputType = {
    id: string | null;
    document_id: string | null;
    tax_id: string | null;
    tax_rate: runtime.Decimal | null;
    taxable_base: runtime.Decimal | null;
    tax_amount: runtime.Decimal | null;
    created_at: Date | null;
};
export type Document_taxesCountAggregateOutputType = {
    id: number;
    document_id: number;
    tax_id: number;
    tax_rate: number;
    taxable_base: number;
    tax_amount: number;
    created_at: number;
    _all: number;
};
export type Document_taxesAvgAggregateInputType = {
    tax_rate?: true;
    taxable_base?: true;
    tax_amount?: true;
};
export type Document_taxesSumAggregateInputType = {
    tax_rate?: true;
    taxable_base?: true;
    tax_amount?: true;
};
export type Document_taxesMinAggregateInputType = {
    id?: true;
    document_id?: true;
    tax_id?: true;
    tax_rate?: true;
    taxable_base?: true;
    tax_amount?: true;
    created_at?: true;
};
export type Document_taxesMaxAggregateInputType = {
    id?: true;
    document_id?: true;
    tax_id?: true;
    tax_rate?: true;
    taxable_base?: true;
    tax_amount?: true;
    created_at?: true;
};
export type Document_taxesCountAggregateInputType = {
    id?: true;
    document_id?: true;
    tax_id?: true;
    tax_rate?: true;
    taxable_base?: true;
    tax_amount?: true;
    created_at?: true;
    _all?: true;
};
export type Document_taxesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_taxesWhereInput;
    orderBy?: Prisma.document_taxesOrderByWithRelationInput | Prisma.document_taxesOrderByWithRelationInput[];
    cursor?: Prisma.document_taxesWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Document_taxesCountAggregateInputType;
    _avg?: Document_taxesAvgAggregateInputType;
    _sum?: Document_taxesSumAggregateInputType;
    _min?: Document_taxesMinAggregateInputType;
    _max?: Document_taxesMaxAggregateInputType;
};
export type GetDocument_taxesAggregateType<T extends Document_taxesAggregateArgs> = {
    [P in keyof T & keyof AggregateDocument_taxes]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocument_taxes[P]> : Prisma.GetScalarType<T[P], AggregateDocument_taxes[P]>;
};
export type document_taxesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_taxesWhereInput;
    orderBy?: Prisma.document_taxesOrderByWithAggregationInput | Prisma.document_taxesOrderByWithAggregationInput[];
    by: Prisma.Document_taxesScalarFieldEnum[] | Prisma.Document_taxesScalarFieldEnum;
    having?: Prisma.document_taxesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Document_taxesCountAggregateInputType | true;
    _avg?: Document_taxesAvgAggregateInputType;
    _sum?: Document_taxesSumAggregateInputType;
    _min?: Document_taxesMinAggregateInputType;
    _max?: Document_taxesMaxAggregateInputType;
};
export type Document_taxesGroupByOutputType = {
    id: string;
    document_id: string;
    tax_id: string;
    tax_rate: runtime.Decimal;
    taxable_base: runtime.Decimal;
    tax_amount: runtime.Decimal;
    created_at: Date;
    _count: Document_taxesCountAggregateOutputType | null;
    _avg: Document_taxesAvgAggregateOutputType | null;
    _sum: Document_taxesSumAggregateOutputType | null;
    _min: Document_taxesMinAggregateOutputType | null;
    _max: Document_taxesMaxAggregateOutputType | null;
};
export type GetDocument_taxesGroupByPayload<T extends document_taxesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Document_taxesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Document_taxesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Document_taxesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Document_taxesGroupByOutputType[P]>;
}>>;
export type document_taxesWhereInput = {
    AND?: Prisma.document_taxesWhereInput | Prisma.document_taxesWhereInput[];
    OR?: Prisma.document_taxesWhereInput[];
    NOT?: Prisma.document_taxesWhereInput | Prisma.document_taxesWhereInput[];
    id?: Prisma.UuidFilter<"document_taxes"> | string;
    document_id?: Prisma.UuidFilter<"document_taxes"> | string;
    tax_id?: Prisma.UuidFilter<"document_taxes"> | string;
    tax_rate?: Prisma.DecimalFilter<"document_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base?: Prisma.DecimalFilter<"document_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFilter<"document_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFilter<"document_taxes"> | Date | string;
    documents?: Prisma.XOR<Prisma.DocumentsScalarRelationFilter, Prisma.documentsWhereInput>;
    taxes?: Prisma.XOR<Prisma.TaxesScalarRelationFilter, Prisma.taxesWhereInput>;
};
export type document_taxesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    document_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    tax_rate?: Prisma.SortOrder;
    taxable_base?: Prisma.SortOrder;
    tax_amount?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    documents?: Prisma.documentsOrderByWithRelationInput;
    taxes?: Prisma.taxesOrderByWithRelationInput;
};
export type document_taxesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.document_taxesWhereInput | Prisma.document_taxesWhereInput[];
    OR?: Prisma.document_taxesWhereInput[];
    NOT?: Prisma.document_taxesWhereInput | Prisma.document_taxesWhereInput[];
    document_id?: Prisma.UuidFilter<"document_taxes"> | string;
    tax_id?: Prisma.UuidFilter<"document_taxes"> | string;
    tax_rate?: Prisma.DecimalFilter<"document_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base?: Prisma.DecimalFilter<"document_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFilter<"document_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFilter<"document_taxes"> | Date | string;
    documents?: Prisma.XOR<Prisma.DocumentsScalarRelationFilter, Prisma.documentsWhereInput>;
    taxes?: Prisma.XOR<Prisma.TaxesScalarRelationFilter, Prisma.taxesWhereInput>;
}, "id">;
export type document_taxesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    document_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    tax_rate?: Prisma.SortOrder;
    taxable_base?: Prisma.SortOrder;
    tax_amount?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.document_taxesCountOrderByAggregateInput;
    _avg?: Prisma.document_taxesAvgOrderByAggregateInput;
    _max?: Prisma.document_taxesMaxOrderByAggregateInput;
    _min?: Prisma.document_taxesMinOrderByAggregateInput;
    _sum?: Prisma.document_taxesSumOrderByAggregateInput;
};
export type document_taxesScalarWhereWithAggregatesInput = {
    AND?: Prisma.document_taxesScalarWhereWithAggregatesInput | Prisma.document_taxesScalarWhereWithAggregatesInput[];
    OR?: Prisma.document_taxesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.document_taxesScalarWhereWithAggregatesInput | Prisma.document_taxesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"document_taxes"> | string;
    document_id?: Prisma.UuidWithAggregatesFilter<"document_taxes"> | string;
    tax_id?: Prisma.UuidWithAggregatesFilter<"document_taxes"> | string;
    tax_rate?: Prisma.DecimalWithAggregatesFilter<"document_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base?: Prisma.DecimalWithAggregatesFilter<"document_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalWithAggregatesFilter<"document_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"document_taxes"> | Date | string;
};
export type document_taxesCreateInput = {
    id?: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    documents: Prisma.documentsCreateNestedOneWithoutDocument_taxesInput;
    taxes: Prisma.taxesCreateNestedOneWithoutDocument_taxesInput;
};
export type document_taxesUncheckedCreateInput = {
    id?: string;
    document_id: string;
    tax_id: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
};
export type document_taxesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    documents?: Prisma.documentsUpdateOneRequiredWithoutDocument_taxesNestedInput;
    taxes?: Prisma.taxesUpdateOneRequiredWithoutDocument_taxesNestedInput;
};
export type document_taxesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type document_taxesCreateManyInput = {
    id?: string;
    document_id: string;
    tax_id: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
};
export type document_taxesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type document_taxesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type document_taxesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    tax_rate?: Prisma.SortOrder;
    taxable_base?: Prisma.SortOrder;
    tax_amount?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type document_taxesAvgOrderByAggregateInput = {
    tax_rate?: Prisma.SortOrder;
    taxable_base?: Prisma.SortOrder;
    tax_amount?: Prisma.SortOrder;
};
export type document_taxesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    tax_rate?: Prisma.SortOrder;
    taxable_base?: Prisma.SortOrder;
    tax_amount?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type document_taxesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    tax_rate?: Prisma.SortOrder;
    taxable_base?: Prisma.SortOrder;
    tax_amount?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type document_taxesSumOrderByAggregateInput = {
    tax_rate?: Prisma.SortOrder;
    taxable_base?: Prisma.SortOrder;
    tax_amount?: Prisma.SortOrder;
};
export type Document_taxesListRelationFilter = {
    every?: Prisma.document_taxesWhereInput;
    some?: Prisma.document_taxesWhereInput;
    none?: Prisma.document_taxesWhereInput;
};
export type document_taxesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type document_taxesCreateNestedManyWithoutDocumentsInput = {
    create?: Prisma.XOR<Prisma.document_taxesCreateWithoutDocumentsInput, Prisma.document_taxesUncheckedCreateWithoutDocumentsInput> | Prisma.document_taxesCreateWithoutDocumentsInput[] | Prisma.document_taxesUncheckedCreateWithoutDocumentsInput[];
    connectOrCreate?: Prisma.document_taxesCreateOrConnectWithoutDocumentsInput | Prisma.document_taxesCreateOrConnectWithoutDocumentsInput[];
    createMany?: Prisma.document_taxesCreateManyDocumentsInputEnvelope;
    connect?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
};
export type document_taxesUncheckedCreateNestedManyWithoutDocumentsInput = {
    create?: Prisma.XOR<Prisma.document_taxesCreateWithoutDocumentsInput, Prisma.document_taxesUncheckedCreateWithoutDocumentsInput> | Prisma.document_taxesCreateWithoutDocumentsInput[] | Prisma.document_taxesUncheckedCreateWithoutDocumentsInput[];
    connectOrCreate?: Prisma.document_taxesCreateOrConnectWithoutDocumentsInput | Prisma.document_taxesCreateOrConnectWithoutDocumentsInput[];
    createMany?: Prisma.document_taxesCreateManyDocumentsInputEnvelope;
    connect?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
};
export type document_taxesUpdateManyWithoutDocumentsNestedInput = {
    create?: Prisma.XOR<Prisma.document_taxesCreateWithoutDocumentsInput, Prisma.document_taxesUncheckedCreateWithoutDocumentsInput> | Prisma.document_taxesCreateWithoutDocumentsInput[] | Prisma.document_taxesUncheckedCreateWithoutDocumentsInput[];
    connectOrCreate?: Prisma.document_taxesCreateOrConnectWithoutDocumentsInput | Prisma.document_taxesCreateOrConnectWithoutDocumentsInput[];
    upsert?: Prisma.document_taxesUpsertWithWhereUniqueWithoutDocumentsInput | Prisma.document_taxesUpsertWithWhereUniqueWithoutDocumentsInput[];
    createMany?: Prisma.document_taxesCreateManyDocumentsInputEnvelope;
    set?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    disconnect?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    delete?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    connect?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    update?: Prisma.document_taxesUpdateWithWhereUniqueWithoutDocumentsInput | Prisma.document_taxesUpdateWithWhereUniqueWithoutDocumentsInput[];
    updateMany?: Prisma.document_taxesUpdateManyWithWhereWithoutDocumentsInput | Prisma.document_taxesUpdateManyWithWhereWithoutDocumentsInput[];
    deleteMany?: Prisma.document_taxesScalarWhereInput | Prisma.document_taxesScalarWhereInput[];
};
export type document_taxesUncheckedUpdateManyWithoutDocumentsNestedInput = {
    create?: Prisma.XOR<Prisma.document_taxesCreateWithoutDocumentsInput, Prisma.document_taxesUncheckedCreateWithoutDocumentsInput> | Prisma.document_taxesCreateWithoutDocumentsInput[] | Prisma.document_taxesUncheckedCreateWithoutDocumentsInput[];
    connectOrCreate?: Prisma.document_taxesCreateOrConnectWithoutDocumentsInput | Prisma.document_taxesCreateOrConnectWithoutDocumentsInput[];
    upsert?: Prisma.document_taxesUpsertWithWhereUniqueWithoutDocumentsInput | Prisma.document_taxesUpsertWithWhereUniqueWithoutDocumentsInput[];
    createMany?: Prisma.document_taxesCreateManyDocumentsInputEnvelope;
    set?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    disconnect?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    delete?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    connect?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    update?: Prisma.document_taxesUpdateWithWhereUniqueWithoutDocumentsInput | Prisma.document_taxesUpdateWithWhereUniqueWithoutDocumentsInput[];
    updateMany?: Prisma.document_taxesUpdateManyWithWhereWithoutDocumentsInput | Prisma.document_taxesUpdateManyWithWhereWithoutDocumentsInput[];
    deleteMany?: Prisma.document_taxesScalarWhereInput | Prisma.document_taxesScalarWhereInput[];
};
export type document_taxesCreateNestedManyWithoutTaxesInput = {
    create?: Prisma.XOR<Prisma.document_taxesCreateWithoutTaxesInput, Prisma.document_taxesUncheckedCreateWithoutTaxesInput> | Prisma.document_taxesCreateWithoutTaxesInput[] | Prisma.document_taxesUncheckedCreateWithoutTaxesInput[];
    connectOrCreate?: Prisma.document_taxesCreateOrConnectWithoutTaxesInput | Prisma.document_taxesCreateOrConnectWithoutTaxesInput[];
    createMany?: Prisma.document_taxesCreateManyTaxesInputEnvelope;
    connect?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
};
export type document_taxesUncheckedCreateNestedManyWithoutTaxesInput = {
    create?: Prisma.XOR<Prisma.document_taxesCreateWithoutTaxesInput, Prisma.document_taxesUncheckedCreateWithoutTaxesInput> | Prisma.document_taxesCreateWithoutTaxesInput[] | Prisma.document_taxesUncheckedCreateWithoutTaxesInput[];
    connectOrCreate?: Prisma.document_taxesCreateOrConnectWithoutTaxesInput | Prisma.document_taxesCreateOrConnectWithoutTaxesInput[];
    createMany?: Prisma.document_taxesCreateManyTaxesInputEnvelope;
    connect?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
};
export type document_taxesUpdateManyWithoutTaxesNestedInput = {
    create?: Prisma.XOR<Prisma.document_taxesCreateWithoutTaxesInput, Prisma.document_taxesUncheckedCreateWithoutTaxesInput> | Prisma.document_taxesCreateWithoutTaxesInput[] | Prisma.document_taxesUncheckedCreateWithoutTaxesInput[];
    connectOrCreate?: Prisma.document_taxesCreateOrConnectWithoutTaxesInput | Prisma.document_taxesCreateOrConnectWithoutTaxesInput[];
    upsert?: Prisma.document_taxesUpsertWithWhereUniqueWithoutTaxesInput | Prisma.document_taxesUpsertWithWhereUniqueWithoutTaxesInput[];
    createMany?: Prisma.document_taxesCreateManyTaxesInputEnvelope;
    set?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    disconnect?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    delete?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    connect?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    update?: Prisma.document_taxesUpdateWithWhereUniqueWithoutTaxesInput | Prisma.document_taxesUpdateWithWhereUniqueWithoutTaxesInput[];
    updateMany?: Prisma.document_taxesUpdateManyWithWhereWithoutTaxesInput | Prisma.document_taxesUpdateManyWithWhereWithoutTaxesInput[];
    deleteMany?: Prisma.document_taxesScalarWhereInput | Prisma.document_taxesScalarWhereInput[];
};
export type document_taxesUncheckedUpdateManyWithoutTaxesNestedInput = {
    create?: Prisma.XOR<Prisma.document_taxesCreateWithoutTaxesInput, Prisma.document_taxesUncheckedCreateWithoutTaxesInput> | Prisma.document_taxesCreateWithoutTaxesInput[] | Prisma.document_taxesUncheckedCreateWithoutTaxesInput[];
    connectOrCreate?: Prisma.document_taxesCreateOrConnectWithoutTaxesInput | Prisma.document_taxesCreateOrConnectWithoutTaxesInput[];
    upsert?: Prisma.document_taxesUpsertWithWhereUniqueWithoutTaxesInput | Prisma.document_taxesUpsertWithWhereUniqueWithoutTaxesInput[];
    createMany?: Prisma.document_taxesCreateManyTaxesInputEnvelope;
    set?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    disconnect?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    delete?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    connect?: Prisma.document_taxesWhereUniqueInput | Prisma.document_taxesWhereUniqueInput[];
    update?: Prisma.document_taxesUpdateWithWhereUniqueWithoutTaxesInput | Prisma.document_taxesUpdateWithWhereUniqueWithoutTaxesInput[];
    updateMany?: Prisma.document_taxesUpdateManyWithWhereWithoutTaxesInput | Prisma.document_taxesUpdateManyWithWhereWithoutTaxesInput[];
    deleteMany?: Prisma.document_taxesScalarWhereInput | Prisma.document_taxesScalarWhereInput[];
};
export type document_taxesCreateWithoutDocumentsInput = {
    id?: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    taxes: Prisma.taxesCreateNestedOneWithoutDocument_taxesInput;
};
export type document_taxesUncheckedCreateWithoutDocumentsInput = {
    id?: string;
    tax_id: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
};
export type document_taxesCreateOrConnectWithoutDocumentsInput = {
    where: Prisma.document_taxesWhereUniqueInput;
    create: Prisma.XOR<Prisma.document_taxesCreateWithoutDocumentsInput, Prisma.document_taxesUncheckedCreateWithoutDocumentsInput>;
};
export type document_taxesCreateManyDocumentsInputEnvelope = {
    data: Prisma.document_taxesCreateManyDocumentsInput | Prisma.document_taxesCreateManyDocumentsInput[];
    skipDuplicates?: boolean;
};
export type document_taxesUpsertWithWhereUniqueWithoutDocumentsInput = {
    where: Prisma.document_taxesWhereUniqueInput;
    update: Prisma.XOR<Prisma.document_taxesUpdateWithoutDocumentsInput, Prisma.document_taxesUncheckedUpdateWithoutDocumentsInput>;
    create: Prisma.XOR<Prisma.document_taxesCreateWithoutDocumentsInput, Prisma.document_taxesUncheckedCreateWithoutDocumentsInput>;
};
export type document_taxesUpdateWithWhereUniqueWithoutDocumentsInput = {
    where: Prisma.document_taxesWhereUniqueInput;
    data: Prisma.XOR<Prisma.document_taxesUpdateWithoutDocumentsInput, Prisma.document_taxesUncheckedUpdateWithoutDocumentsInput>;
};
export type document_taxesUpdateManyWithWhereWithoutDocumentsInput = {
    where: Prisma.document_taxesScalarWhereInput;
    data: Prisma.XOR<Prisma.document_taxesUpdateManyMutationInput, Prisma.document_taxesUncheckedUpdateManyWithoutDocumentsInput>;
};
export type document_taxesScalarWhereInput = {
    AND?: Prisma.document_taxesScalarWhereInput | Prisma.document_taxesScalarWhereInput[];
    OR?: Prisma.document_taxesScalarWhereInput[];
    NOT?: Prisma.document_taxesScalarWhereInput | Prisma.document_taxesScalarWhereInput[];
    id?: Prisma.UuidFilter<"document_taxes"> | string;
    document_id?: Prisma.UuidFilter<"document_taxes"> | string;
    tax_id?: Prisma.UuidFilter<"document_taxes"> | string;
    tax_rate?: Prisma.DecimalFilter<"document_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base?: Prisma.DecimalFilter<"document_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFilter<"document_taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFilter<"document_taxes"> | Date | string;
};
export type document_taxesCreateWithoutTaxesInput = {
    id?: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
    documents: Prisma.documentsCreateNestedOneWithoutDocument_taxesInput;
};
export type document_taxesUncheckedCreateWithoutTaxesInput = {
    id?: string;
    document_id: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
};
export type document_taxesCreateOrConnectWithoutTaxesInput = {
    where: Prisma.document_taxesWhereUniqueInput;
    create: Prisma.XOR<Prisma.document_taxesCreateWithoutTaxesInput, Prisma.document_taxesUncheckedCreateWithoutTaxesInput>;
};
export type document_taxesCreateManyTaxesInputEnvelope = {
    data: Prisma.document_taxesCreateManyTaxesInput | Prisma.document_taxesCreateManyTaxesInput[];
    skipDuplicates?: boolean;
};
export type document_taxesUpsertWithWhereUniqueWithoutTaxesInput = {
    where: Prisma.document_taxesWhereUniqueInput;
    update: Prisma.XOR<Prisma.document_taxesUpdateWithoutTaxesInput, Prisma.document_taxesUncheckedUpdateWithoutTaxesInput>;
    create: Prisma.XOR<Prisma.document_taxesCreateWithoutTaxesInput, Prisma.document_taxesUncheckedCreateWithoutTaxesInput>;
};
export type document_taxesUpdateWithWhereUniqueWithoutTaxesInput = {
    where: Prisma.document_taxesWhereUniqueInput;
    data: Prisma.XOR<Prisma.document_taxesUpdateWithoutTaxesInput, Prisma.document_taxesUncheckedUpdateWithoutTaxesInput>;
};
export type document_taxesUpdateManyWithWhereWithoutTaxesInput = {
    where: Prisma.document_taxesScalarWhereInput;
    data: Prisma.XOR<Prisma.document_taxesUpdateManyMutationInput, Prisma.document_taxesUncheckedUpdateManyWithoutTaxesInput>;
};
export type document_taxesCreateManyDocumentsInput = {
    id?: string;
    tax_id: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
};
export type document_taxesUpdateWithoutDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    taxes?: Prisma.taxesUpdateOneRequiredWithoutDocument_taxesNestedInput;
};
export type document_taxesUncheckedUpdateWithoutDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type document_taxesUncheckedUpdateManyWithoutDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type document_taxesCreateManyTaxesInput = {
    id?: string;
    document_id: string;
    tax_rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base: runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Date | string;
};
export type document_taxesUpdateWithoutTaxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    documents?: Prisma.documentsUpdateOneRequiredWithoutDocument_taxesNestedInput;
};
export type document_taxesUncheckedUpdateWithoutTaxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type document_taxesUncheckedUpdateManyWithoutTaxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    taxable_base?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    tax_amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type document_taxesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_id?: boolean;
    tax_id?: boolean;
    tax_rate?: boolean;
    taxable_base?: boolean;
    tax_amount?: boolean;
    created_at?: boolean;
    documents?: boolean | Prisma.documentsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["document_taxes"]>;
export type document_taxesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_id?: boolean;
    tax_id?: boolean;
    tax_rate?: boolean;
    taxable_base?: boolean;
    tax_amount?: boolean;
    created_at?: boolean;
    documents?: boolean | Prisma.documentsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["document_taxes"]>;
export type document_taxesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_id?: boolean;
    tax_id?: boolean;
    tax_rate?: boolean;
    taxable_base?: boolean;
    tax_amount?: boolean;
    created_at?: boolean;
    documents?: boolean | Prisma.documentsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["document_taxes"]>;
export type document_taxesSelectScalar = {
    id?: boolean;
    document_id?: boolean;
    tax_id?: boolean;
    tax_rate?: boolean;
    taxable_base?: boolean;
    tax_amount?: boolean;
    created_at?: boolean;
};
export type document_taxesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "document_id" | "tax_id" | "tax_rate" | "taxable_base" | "tax_amount" | "created_at", ExtArgs["result"]["document_taxes"]>;
export type document_taxesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    documents?: boolean | Prisma.documentsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
};
export type document_taxesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    documents?: boolean | Prisma.documentsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
};
export type document_taxesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    documents?: boolean | Prisma.documentsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
};
export type $document_taxesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "document_taxes";
    objects: {
        documents: Prisma.$documentsPayload<ExtArgs>;
        taxes: Prisma.$taxesPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        document_id: string;
        tax_id: string;
        tax_rate: runtime.Decimal;
        taxable_base: runtime.Decimal;
        tax_amount: runtime.Decimal;
        created_at: Date;
    }, ExtArgs["result"]["document_taxes"]>;
    composites: {};
};
export type document_taxesGetPayload<S extends boolean | null | undefined | document_taxesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$document_taxesPayload, S>;
export type document_taxesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<document_taxesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Document_taxesCountAggregateInputType | true;
};
export interface document_taxesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['document_taxes'];
        meta: {
            name: 'document_taxes';
        };
    };
    findUnique<T extends document_taxesFindUniqueArgs>(args: Prisma.SelectSubset<T, document_taxesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__document_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_taxesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends document_taxesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, document_taxesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__document_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_taxesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends document_taxesFindFirstArgs>(args?: Prisma.SelectSubset<T, document_taxesFindFirstArgs<ExtArgs>>): Prisma.Prisma__document_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_taxesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends document_taxesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, document_taxesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__document_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_taxesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends document_taxesFindManyArgs>(args?: Prisma.SelectSubset<T, document_taxesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_taxesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends document_taxesCreateArgs>(args: Prisma.SelectSubset<T, document_taxesCreateArgs<ExtArgs>>): Prisma.Prisma__document_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_taxesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends document_taxesCreateManyArgs>(args?: Prisma.SelectSubset<T, document_taxesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends document_taxesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, document_taxesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_taxesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends document_taxesDeleteArgs>(args: Prisma.SelectSubset<T, document_taxesDeleteArgs<ExtArgs>>): Prisma.Prisma__document_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_taxesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends document_taxesUpdateArgs>(args: Prisma.SelectSubset<T, document_taxesUpdateArgs<ExtArgs>>): Prisma.Prisma__document_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_taxesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends document_taxesDeleteManyArgs>(args?: Prisma.SelectSubset<T, document_taxesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends document_taxesUpdateManyArgs>(args: Prisma.SelectSubset<T, document_taxesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends document_taxesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, document_taxesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_taxesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends document_taxesUpsertArgs>(args: Prisma.SelectSubset<T, document_taxesUpsertArgs<ExtArgs>>): Prisma.Prisma__document_taxesClient<runtime.Types.Result.GetResult<Prisma.$document_taxesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends document_taxesCountArgs>(args?: Prisma.Subset<T, document_taxesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Document_taxesCountAggregateOutputType> : number>;
    aggregate<T extends Document_taxesAggregateArgs>(args: Prisma.Subset<T, Document_taxesAggregateArgs>): Prisma.PrismaPromise<GetDocument_taxesAggregateType<T>>;
    groupBy<T extends document_taxesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: document_taxesGroupByArgs['orderBy'];
    } : {
        orderBy?: document_taxesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, document_taxesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocument_taxesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: document_taxesFieldRefs;
}
export interface Prisma__document_taxesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    documents<T extends Prisma.documentsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.documentsDefaultArgs<ExtArgs>>): Prisma.Prisma__documentsClient<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    taxes<T extends Prisma.taxesDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.taxesDefaultArgs<ExtArgs>>): Prisma.Prisma__taxesClient<runtime.Types.Result.GetResult<Prisma.$taxesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface document_taxesFieldRefs {
    readonly id: Prisma.FieldRef<"document_taxes", 'String'>;
    readonly document_id: Prisma.FieldRef<"document_taxes", 'String'>;
    readonly tax_id: Prisma.FieldRef<"document_taxes", 'String'>;
    readonly tax_rate: Prisma.FieldRef<"document_taxes", 'Decimal'>;
    readonly taxable_base: Prisma.FieldRef<"document_taxes", 'Decimal'>;
    readonly tax_amount: Prisma.FieldRef<"document_taxes", 'Decimal'>;
    readonly created_at: Prisma.FieldRef<"document_taxes", 'DateTime'>;
}
export type document_taxesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_taxesInclude<ExtArgs> | null;
    where: Prisma.document_taxesWhereUniqueInput;
};
export type document_taxesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_taxesInclude<ExtArgs> | null;
    where: Prisma.document_taxesWhereUniqueInput;
};
export type document_taxesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_taxesInclude<ExtArgs> | null;
    where?: Prisma.document_taxesWhereInput;
    orderBy?: Prisma.document_taxesOrderByWithRelationInput | Prisma.document_taxesOrderByWithRelationInput[];
    cursor?: Prisma.document_taxesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_taxesScalarFieldEnum | Prisma.Document_taxesScalarFieldEnum[];
};
export type document_taxesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_taxesInclude<ExtArgs> | null;
    where?: Prisma.document_taxesWhereInput;
    orderBy?: Prisma.document_taxesOrderByWithRelationInput | Prisma.document_taxesOrderByWithRelationInput[];
    cursor?: Prisma.document_taxesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_taxesScalarFieldEnum | Prisma.Document_taxesScalarFieldEnum[];
};
export type document_taxesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_taxesInclude<ExtArgs> | null;
    where?: Prisma.document_taxesWhereInput;
    orderBy?: Prisma.document_taxesOrderByWithRelationInput | Prisma.document_taxesOrderByWithRelationInput[];
    cursor?: Prisma.document_taxesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_taxesScalarFieldEnum | Prisma.Document_taxesScalarFieldEnum[];
};
export type document_taxesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_taxesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_taxesCreateInput, Prisma.document_taxesUncheckedCreateInput>;
};
export type document_taxesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.document_taxesCreateManyInput | Prisma.document_taxesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type document_taxesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_taxesSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.document_taxesOmit<ExtArgs> | null;
    data: Prisma.document_taxesCreateManyInput | Prisma.document_taxesCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.document_taxesIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type document_taxesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_taxesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_taxesUpdateInput, Prisma.document_taxesUncheckedUpdateInput>;
    where: Prisma.document_taxesWhereUniqueInput;
};
export type document_taxesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.document_taxesUpdateManyMutationInput, Prisma.document_taxesUncheckedUpdateManyInput>;
    where?: Prisma.document_taxesWhereInput;
    limit?: number;
};
export type document_taxesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_taxesSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.document_taxesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_taxesUpdateManyMutationInput, Prisma.document_taxesUncheckedUpdateManyInput>;
    where?: Prisma.document_taxesWhereInput;
    limit?: number;
    include?: Prisma.document_taxesIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type document_taxesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_taxesInclude<ExtArgs> | null;
    where: Prisma.document_taxesWhereUniqueInput;
    create: Prisma.XOR<Prisma.document_taxesCreateInput, Prisma.document_taxesUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.document_taxesUpdateInput, Prisma.document_taxesUncheckedUpdateInput>;
};
export type document_taxesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_taxesInclude<ExtArgs> | null;
    where: Prisma.document_taxesWhereUniqueInput;
};
export type document_taxesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_taxesWhereInput;
    limit?: number;
};
export type document_taxesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_taxesSelect<ExtArgs> | null;
    omit?: Prisma.document_taxesOmit<ExtArgs> | null;
    include?: Prisma.document_taxesInclude<ExtArgs> | null;
};
