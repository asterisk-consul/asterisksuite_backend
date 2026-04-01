import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type documentsModel = runtime.Types.Result.DefaultSelection<Prisma.$documentsPayload>;
export type AggregateDocuments = {
    _count: DocumentsCountAggregateOutputType | null;
    _avg: DocumentsAvgAggregateOutputType | null;
    _sum: DocumentsSumAggregateOutputType | null;
    _min: DocumentsMinAggregateOutputType | null;
    _max: DocumentsMaxAggregateOutputType | null;
};
export type DocumentsAvgAggregateOutputType = {
    number: number | null;
    status: number | null;
    subtotal: runtime.Decimal | null;
    total_taxes: runtime.Decimal | null;
    total: runtime.Decimal | null;
};
export type DocumentsSumAggregateOutputType = {
    number: number | null;
    status: number | null;
    subtotal: runtime.Decimal | null;
    total_taxes: runtime.Decimal | null;
    total: runtime.Decimal | null;
};
export type DocumentsMinAggregateOutputType = {
    id: string | null;
    document_type_id: string | null;
    party_id: string | null;
    number: number | null;
    date: Date | null;
    status: number | null;
    created_at: Date | null;
    updated_at: Date | null;
    subtotal: runtime.Decimal | null;
    total_taxes: runtime.Decimal | null;
    total: runtime.Decimal | null;
    descrip: string | null;
};
export type DocumentsMaxAggregateOutputType = {
    id: string | null;
    document_type_id: string | null;
    party_id: string | null;
    number: number | null;
    date: Date | null;
    status: number | null;
    created_at: Date | null;
    updated_at: Date | null;
    subtotal: runtime.Decimal | null;
    total_taxes: runtime.Decimal | null;
    total: runtime.Decimal | null;
    descrip: string | null;
};
export type DocumentsCountAggregateOutputType = {
    id: number;
    document_type_id: number;
    party_id: number;
    number: number;
    date: number;
    status: number;
    created_at: number;
    updated_at: number;
    subtotal: number;
    total_taxes: number;
    total: number;
    descrip: number;
    _all: number;
};
export type DocumentsAvgAggregateInputType = {
    number?: true;
    status?: true;
    subtotal?: true;
    total_taxes?: true;
    total?: true;
};
export type DocumentsSumAggregateInputType = {
    number?: true;
    status?: true;
    subtotal?: true;
    total_taxes?: true;
    total?: true;
};
export type DocumentsMinAggregateInputType = {
    id?: true;
    document_type_id?: true;
    party_id?: true;
    number?: true;
    date?: true;
    status?: true;
    created_at?: true;
    updated_at?: true;
    subtotal?: true;
    total_taxes?: true;
    total?: true;
    descrip?: true;
};
export type DocumentsMaxAggregateInputType = {
    id?: true;
    document_type_id?: true;
    party_id?: true;
    number?: true;
    date?: true;
    status?: true;
    created_at?: true;
    updated_at?: true;
    subtotal?: true;
    total_taxes?: true;
    total?: true;
    descrip?: true;
};
export type DocumentsCountAggregateInputType = {
    id?: true;
    document_type_id?: true;
    party_id?: true;
    number?: true;
    date?: true;
    status?: true;
    created_at?: true;
    updated_at?: true;
    subtotal?: true;
    total_taxes?: true;
    total?: true;
    descrip?: true;
    _all?: true;
};
export type DocumentsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documentsWhereInput;
    orderBy?: Prisma.documentsOrderByWithRelationInput | Prisma.documentsOrderByWithRelationInput[];
    cursor?: Prisma.documentsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DocumentsCountAggregateInputType;
    _avg?: DocumentsAvgAggregateInputType;
    _sum?: DocumentsSumAggregateInputType;
    _min?: DocumentsMinAggregateInputType;
    _max?: DocumentsMaxAggregateInputType;
};
export type GetDocumentsAggregateType<T extends DocumentsAggregateArgs> = {
    [P in keyof T & keyof AggregateDocuments]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocuments[P]> : Prisma.GetScalarType<T[P], AggregateDocuments[P]>;
};
export type documentsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documentsWhereInput;
    orderBy?: Prisma.documentsOrderByWithAggregationInput | Prisma.documentsOrderByWithAggregationInput[];
    by: Prisma.DocumentsScalarFieldEnum[] | Prisma.DocumentsScalarFieldEnum;
    having?: Prisma.documentsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DocumentsCountAggregateInputType | true;
    _avg?: DocumentsAvgAggregateInputType;
    _sum?: DocumentsSumAggregateInputType;
    _min?: DocumentsMinAggregateInputType;
    _max?: DocumentsMaxAggregateInputType;
};
export type DocumentsGroupByOutputType = {
    id: string;
    document_type_id: string;
    party_id: string | null;
    number: number;
    date: Date;
    status: number;
    created_at: Date;
    updated_at: Date;
    subtotal: runtime.Decimal;
    total_taxes: runtime.Decimal;
    total: runtime.Decimal;
    descrip: string | null;
    _count: DocumentsCountAggregateOutputType | null;
    _avg: DocumentsAvgAggregateOutputType | null;
    _sum: DocumentsSumAggregateOutputType | null;
    _min: DocumentsMinAggregateOutputType | null;
    _max: DocumentsMaxAggregateOutputType | null;
};
export type GetDocumentsGroupByPayload<T extends documentsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DocumentsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DocumentsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DocumentsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DocumentsGroupByOutputType[P]>;
}>>;
export type documentsWhereInput = {
    AND?: Prisma.documentsWhereInput | Prisma.documentsWhereInput[];
    OR?: Prisma.documentsWhereInput[];
    NOT?: Prisma.documentsWhereInput | Prisma.documentsWhereInput[];
    id?: Prisma.UuidFilter<"documents"> | string;
    document_type_id?: Prisma.UuidFilter<"documents"> | string;
    party_id?: Prisma.UuidNullableFilter<"documents"> | string | null;
    number?: Prisma.IntFilter<"documents"> | number;
    date?: Prisma.DateTimeFilter<"documents"> | Date | string;
    status?: Prisma.IntFilter<"documents"> | number;
    created_at?: Prisma.DateTimeFilter<"documents"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"documents"> | Date | string;
    subtotal?: Prisma.DecimalFilter<"documents"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFilter<"documents"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFilter<"documents"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.StringNullableFilter<"documents"> | string | null;
    document_items?: Prisma.Document_itemsListRelationFilter;
    document_taxes?: Prisma.Document_taxesListRelationFilter;
    document_types?: Prisma.XOR<Prisma.Document_typesScalarRelationFilter, Prisma.document_typesWhereInput>;
    business_parties?: Prisma.XOR<Prisma.Business_partiesNullableScalarRelationFilter, Prisma.business_partiesWhereInput> | null;
};
export type documentsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    number?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    total_taxes?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    descrip?: Prisma.SortOrderInput | Prisma.SortOrder;
    document_items?: Prisma.document_itemsOrderByRelationAggregateInput;
    document_taxes?: Prisma.document_taxesOrderByRelationAggregateInput;
    document_types?: Prisma.document_typesOrderByWithRelationInput;
    business_parties?: Prisma.business_partiesOrderByWithRelationInput;
};
export type documentsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    document_type_id_number?: Prisma.documentsDocument_type_idNumberCompoundUniqueInput;
    AND?: Prisma.documentsWhereInput | Prisma.documentsWhereInput[];
    OR?: Prisma.documentsWhereInput[];
    NOT?: Prisma.documentsWhereInput | Prisma.documentsWhereInput[];
    document_type_id?: Prisma.UuidFilter<"documents"> | string;
    party_id?: Prisma.UuidNullableFilter<"documents"> | string | null;
    number?: Prisma.IntFilter<"documents"> | number;
    date?: Prisma.DateTimeFilter<"documents"> | Date | string;
    status?: Prisma.IntFilter<"documents"> | number;
    created_at?: Prisma.DateTimeFilter<"documents"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"documents"> | Date | string;
    subtotal?: Prisma.DecimalFilter<"documents"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFilter<"documents"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFilter<"documents"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.StringNullableFilter<"documents"> | string | null;
    document_items?: Prisma.Document_itemsListRelationFilter;
    document_taxes?: Prisma.Document_taxesListRelationFilter;
    document_types?: Prisma.XOR<Prisma.Document_typesScalarRelationFilter, Prisma.document_typesWhereInput>;
    business_parties?: Prisma.XOR<Prisma.Business_partiesNullableScalarRelationFilter, Prisma.business_partiesWhereInput> | null;
}, "id" | "document_type_id_number">;
export type documentsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    number?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    total_taxes?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    descrip?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.documentsCountOrderByAggregateInput;
    _avg?: Prisma.documentsAvgOrderByAggregateInput;
    _max?: Prisma.documentsMaxOrderByAggregateInput;
    _min?: Prisma.documentsMinOrderByAggregateInput;
    _sum?: Prisma.documentsSumOrderByAggregateInput;
};
export type documentsScalarWhereWithAggregatesInput = {
    AND?: Prisma.documentsScalarWhereWithAggregatesInput | Prisma.documentsScalarWhereWithAggregatesInput[];
    OR?: Prisma.documentsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.documentsScalarWhereWithAggregatesInput | Prisma.documentsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"documents"> | string;
    document_type_id?: Prisma.UuidWithAggregatesFilter<"documents"> | string;
    party_id?: Prisma.UuidNullableWithAggregatesFilter<"documents"> | string | null;
    number?: Prisma.IntWithAggregatesFilter<"documents"> | number;
    date?: Prisma.DateTimeWithAggregatesFilter<"documents"> | Date | string;
    status?: Prisma.IntWithAggregatesFilter<"documents"> | number;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"documents"> | Date | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"documents"> | Date | string;
    subtotal?: Prisma.DecimalWithAggregatesFilter<"documents"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalWithAggregatesFilter<"documents"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalWithAggregatesFilter<"documents"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.StringNullableWithAggregatesFilter<"documents"> | string | null;
};
export type documentsCreateInput = {
    id?: string;
    number: number;
    date: Date | string;
    status?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    subtotal?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: string | null;
    document_items?: Prisma.document_itemsCreateNestedManyWithoutDocumentsInput;
    document_taxes?: Prisma.document_taxesCreateNestedManyWithoutDocumentsInput;
    document_types: Prisma.document_typesCreateNestedOneWithoutDocumentsInput;
    business_parties?: Prisma.business_partiesCreateNestedOneWithoutDocumentsInput;
};
export type documentsUncheckedCreateInput = {
    id?: string;
    document_type_id: string;
    party_id?: string | null;
    number: number;
    date: Date | string;
    status?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    subtotal?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: string | null;
    document_items?: Prisma.document_itemsUncheckedCreateNestedManyWithoutDocumentsInput;
    document_taxes?: Prisma.document_taxesUncheckedCreateNestedManyWithoutDocumentsInput;
};
export type documentsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_items?: Prisma.document_itemsUpdateManyWithoutDocumentsNestedInput;
    document_taxes?: Prisma.document_taxesUpdateManyWithoutDocumentsNestedInput;
    document_types?: Prisma.document_typesUpdateOneRequiredWithoutDocumentsNestedInput;
    business_parties?: Prisma.business_partiesUpdateOneWithoutDocumentsNestedInput;
};
export type documentsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type_id?: Prisma.StringFieldUpdateOperationsInput | string;
    party_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    number?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_items?: Prisma.document_itemsUncheckedUpdateManyWithoutDocumentsNestedInput;
    document_taxes?: Prisma.document_taxesUncheckedUpdateManyWithoutDocumentsNestedInput;
};
export type documentsCreateManyInput = {
    id?: string;
    document_type_id: string;
    party_id?: string | null;
    number: number;
    date: Date | string;
    status?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    subtotal?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: string | null;
};
export type documentsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type documentsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type_id?: Prisma.StringFieldUpdateOperationsInput | string;
    party_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    number?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type DocumentsListRelationFilter = {
    every?: Prisma.documentsWhereInput;
    some?: Prisma.documentsWhereInput;
    none?: Prisma.documentsWhereInput;
};
export type documentsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type DocumentsScalarRelationFilter = {
    is?: Prisma.documentsWhereInput;
    isNot?: Prisma.documentsWhereInput;
};
export type documentsDocument_type_idNumberCompoundUniqueInput = {
    document_type_id: string;
    number: number;
};
export type documentsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    total_taxes?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    descrip?: Prisma.SortOrder;
};
export type documentsAvgOrderByAggregateInput = {
    number?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    total_taxes?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
};
export type documentsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    total_taxes?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    descrip?: Prisma.SortOrder;
};
export type documentsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    total_taxes?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
    descrip?: Prisma.SortOrder;
};
export type documentsSumOrderByAggregateInput = {
    number?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    subtotal?: Prisma.SortOrder;
    total_taxes?: Prisma.SortOrder;
    total?: Prisma.SortOrder;
};
export type documentsCreateNestedManyWithoutBusiness_partiesInput = {
    create?: Prisma.XOR<Prisma.documentsCreateWithoutBusiness_partiesInput, Prisma.documentsUncheckedCreateWithoutBusiness_partiesInput> | Prisma.documentsCreateWithoutBusiness_partiesInput[] | Prisma.documentsUncheckedCreateWithoutBusiness_partiesInput[];
    connectOrCreate?: Prisma.documentsCreateOrConnectWithoutBusiness_partiesInput | Prisma.documentsCreateOrConnectWithoutBusiness_partiesInput[];
    createMany?: Prisma.documentsCreateManyBusiness_partiesInputEnvelope;
    connect?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
};
export type documentsUncheckedCreateNestedManyWithoutBusiness_partiesInput = {
    create?: Prisma.XOR<Prisma.documentsCreateWithoutBusiness_partiesInput, Prisma.documentsUncheckedCreateWithoutBusiness_partiesInput> | Prisma.documentsCreateWithoutBusiness_partiesInput[] | Prisma.documentsUncheckedCreateWithoutBusiness_partiesInput[];
    connectOrCreate?: Prisma.documentsCreateOrConnectWithoutBusiness_partiesInput | Prisma.documentsCreateOrConnectWithoutBusiness_partiesInput[];
    createMany?: Prisma.documentsCreateManyBusiness_partiesInputEnvelope;
    connect?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
};
export type documentsUpdateManyWithoutBusiness_partiesNestedInput = {
    create?: Prisma.XOR<Prisma.documentsCreateWithoutBusiness_partiesInput, Prisma.documentsUncheckedCreateWithoutBusiness_partiesInput> | Prisma.documentsCreateWithoutBusiness_partiesInput[] | Prisma.documentsUncheckedCreateWithoutBusiness_partiesInput[];
    connectOrCreate?: Prisma.documentsCreateOrConnectWithoutBusiness_partiesInput | Prisma.documentsCreateOrConnectWithoutBusiness_partiesInput[];
    upsert?: Prisma.documentsUpsertWithWhereUniqueWithoutBusiness_partiesInput | Prisma.documentsUpsertWithWhereUniqueWithoutBusiness_partiesInput[];
    createMany?: Prisma.documentsCreateManyBusiness_partiesInputEnvelope;
    set?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    disconnect?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    delete?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    connect?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    update?: Prisma.documentsUpdateWithWhereUniqueWithoutBusiness_partiesInput | Prisma.documentsUpdateWithWhereUniqueWithoutBusiness_partiesInput[];
    updateMany?: Prisma.documentsUpdateManyWithWhereWithoutBusiness_partiesInput | Prisma.documentsUpdateManyWithWhereWithoutBusiness_partiesInput[];
    deleteMany?: Prisma.documentsScalarWhereInput | Prisma.documentsScalarWhereInput[];
};
export type documentsUncheckedUpdateManyWithoutBusiness_partiesNestedInput = {
    create?: Prisma.XOR<Prisma.documentsCreateWithoutBusiness_partiesInput, Prisma.documentsUncheckedCreateWithoutBusiness_partiesInput> | Prisma.documentsCreateWithoutBusiness_partiesInput[] | Prisma.documentsUncheckedCreateWithoutBusiness_partiesInput[];
    connectOrCreate?: Prisma.documentsCreateOrConnectWithoutBusiness_partiesInput | Prisma.documentsCreateOrConnectWithoutBusiness_partiesInput[];
    upsert?: Prisma.documentsUpsertWithWhereUniqueWithoutBusiness_partiesInput | Prisma.documentsUpsertWithWhereUniqueWithoutBusiness_partiesInput[];
    createMany?: Prisma.documentsCreateManyBusiness_partiesInputEnvelope;
    set?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    disconnect?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    delete?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    connect?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    update?: Prisma.documentsUpdateWithWhereUniqueWithoutBusiness_partiesInput | Prisma.documentsUpdateWithWhereUniqueWithoutBusiness_partiesInput[];
    updateMany?: Prisma.documentsUpdateManyWithWhereWithoutBusiness_partiesInput | Prisma.documentsUpdateManyWithWhereWithoutBusiness_partiesInput[];
    deleteMany?: Prisma.documentsScalarWhereInput | Prisma.documentsScalarWhereInput[];
};
export type documentsCreateNestedOneWithoutDocument_itemsInput = {
    create?: Prisma.XOR<Prisma.documentsCreateWithoutDocument_itemsInput, Prisma.documentsUncheckedCreateWithoutDocument_itemsInput>;
    connectOrCreate?: Prisma.documentsCreateOrConnectWithoutDocument_itemsInput;
    connect?: Prisma.documentsWhereUniqueInput;
};
export type documentsUpdateOneRequiredWithoutDocument_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.documentsCreateWithoutDocument_itemsInput, Prisma.documentsUncheckedCreateWithoutDocument_itemsInput>;
    connectOrCreate?: Prisma.documentsCreateOrConnectWithoutDocument_itemsInput;
    upsert?: Prisma.documentsUpsertWithoutDocument_itemsInput;
    connect?: Prisma.documentsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.documentsUpdateToOneWithWhereWithoutDocument_itemsInput, Prisma.documentsUpdateWithoutDocument_itemsInput>, Prisma.documentsUncheckedUpdateWithoutDocument_itemsInput>;
};
export type documentsCreateNestedOneWithoutDocument_taxesInput = {
    create?: Prisma.XOR<Prisma.documentsCreateWithoutDocument_taxesInput, Prisma.documentsUncheckedCreateWithoutDocument_taxesInput>;
    connectOrCreate?: Prisma.documentsCreateOrConnectWithoutDocument_taxesInput;
    connect?: Prisma.documentsWhereUniqueInput;
};
export type documentsUpdateOneRequiredWithoutDocument_taxesNestedInput = {
    create?: Prisma.XOR<Prisma.documentsCreateWithoutDocument_taxesInput, Prisma.documentsUncheckedCreateWithoutDocument_taxesInput>;
    connectOrCreate?: Prisma.documentsCreateOrConnectWithoutDocument_taxesInput;
    upsert?: Prisma.documentsUpsertWithoutDocument_taxesInput;
    connect?: Prisma.documentsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.documentsUpdateToOneWithWhereWithoutDocument_taxesInput, Prisma.documentsUpdateWithoutDocument_taxesInput>, Prisma.documentsUncheckedUpdateWithoutDocument_taxesInput>;
};
export type documentsCreateNestedManyWithoutDocument_typesInput = {
    create?: Prisma.XOR<Prisma.documentsCreateWithoutDocument_typesInput, Prisma.documentsUncheckedCreateWithoutDocument_typesInput> | Prisma.documentsCreateWithoutDocument_typesInput[] | Prisma.documentsUncheckedCreateWithoutDocument_typesInput[];
    connectOrCreate?: Prisma.documentsCreateOrConnectWithoutDocument_typesInput | Prisma.documentsCreateOrConnectWithoutDocument_typesInput[];
    createMany?: Prisma.documentsCreateManyDocument_typesInputEnvelope;
    connect?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
};
export type documentsUncheckedCreateNestedManyWithoutDocument_typesInput = {
    create?: Prisma.XOR<Prisma.documentsCreateWithoutDocument_typesInput, Prisma.documentsUncheckedCreateWithoutDocument_typesInput> | Prisma.documentsCreateWithoutDocument_typesInput[] | Prisma.documentsUncheckedCreateWithoutDocument_typesInput[];
    connectOrCreate?: Prisma.documentsCreateOrConnectWithoutDocument_typesInput | Prisma.documentsCreateOrConnectWithoutDocument_typesInput[];
    createMany?: Prisma.documentsCreateManyDocument_typesInputEnvelope;
    connect?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
};
export type documentsUpdateManyWithoutDocument_typesNestedInput = {
    create?: Prisma.XOR<Prisma.documentsCreateWithoutDocument_typesInput, Prisma.documentsUncheckedCreateWithoutDocument_typesInput> | Prisma.documentsCreateWithoutDocument_typesInput[] | Prisma.documentsUncheckedCreateWithoutDocument_typesInput[];
    connectOrCreate?: Prisma.documentsCreateOrConnectWithoutDocument_typesInput | Prisma.documentsCreateOrConnectWithoutDocument_typesInput[];
    upsert?: Prisma.documentsUpsertWithWhereUniqueWithoutDocument_typesInput | Prisma.documentsUpsertWithWhereUniqueWithoutDocument_typesInput[];
    createMany?: Prisma.documentsCreateManyDocument_typesInputEnvelope;
    set?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    disconnect?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    delete?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    connect?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    update?: Prisma.documentsUpdateWithWhereUniqueWithoutDocument_typesInput | Prisma.documentsUpdateWithWhereUniqueWithoutDocument_typesInput[];
    updateMany?: Prisma.documentsUpdateManyWithWhereWithoutDocument_typesInput | Prisma.documentsUpdateManyWithWhereWithoutDocument_typesInput[];
    deleteMany?: Prisma.documentsScalarWhereInput | Prisma.documentsScalarWhereInput[];
};
export type documentsUncheckedUpdateManyWithoutDocument_typesNestedInput = {
    create?: Prisma.XOR<Prisma.documentsCreateWithoutDocument_typesInput, Prisma.documentsUncheckedCreateWithoutDocument_typesInput> | Prisma.documentsCreateWithoutDocument_typesInput[] | Prisma.documentsUncheckedCreateWithoutDocument_typesInput[];
    connectOrCreate?: Prisma.documentsCreateOrConnectWithoutDocument_typesInput | Prisma.documentsCreateOrConnectWithoutDocument_typesInput[];
    upsert?: Prisma.documentsUpsertWithWhereUniqueWithoutDocument_typesInput | Prisma.documentsUpsertWithWhereUniqueWithoutDocument_typesInput[];
    createMany?: Prisma.documentsCreateManyDocument_typesInputEnvelope;
    set?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    disconnect?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    delete?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    connect?: Prisma.documentsWhereUniqueInput | Prisma.documentsWhereUniqueInput[];
    update?: Prisma.documentsUpdateWithWhereUniqueWithoutDocument_typesInput | Prisma.documentsUpdateWithWhereUniqueWithoutDocument_typesInput[];
    updateMany?: Prisma.documentsUpdateManyWithWhereWithoutDocument_typesInput | Prisma.documentsUpdateManyWithWhereWithoutDocument_typesInput[];
    deleteMany?: Prisma.documentsScalarWhereInput | Prisma.documentsScalarWhereInput[];
};
export type documentsCreateWithoutBusiness_partiesInput = {
    id?: string;
    number: number;
    date: Date | string;
    status?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    subtotal?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: string | null;
    document_items?: Prisma.document_itemsCreateNestedManyWithoutDocumentsInput;
    document_taxes?: Prisma.document_taxesCreateNestedManyWithoutDocumentsInput;
    document_types: Prisma.document_typesCreateNestedOneWithoutDocumentsInput;
};
export type documentsUncheckedCreateWithoutBusiness_partiesInput = {
    id?: string;
    document_type_id: string;
    number: number;
    date: Date | string;
    status?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    subtotal?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: string | null;
    document_items?: Prisma.document_itemsUncheckedCreateNestedManyWithoutDocumentsInput;
    document_taxes?: Prisma.document_taxesUncheckedCreateNestedManyWithoutDocumentsInput;
};
export type documentsCreateOrConnectWithoutBusiness_partiesInput = {
    where: Prisma.documentsWhereUniqueInput;
    create: Prisma.XOR<Prisma.documentsCreateWithoutBusiness_partiesInput, Prisma.documentsUncheckedCreateWithoutBusiness_partiesInput>;
};
export type documentsCreateManyBusiness_partiesInputEnvelope = {
    data: Prisma.documentsCreateManyBusiness_partiesInput | Prisma.documentsCreateManyBusiness_partiesInput[];
    skipDuplicates?: boolean;
};
export type documentsUpsertWithWhereUniqueWithoutBusiness_partiesInput = {
    where: Prisma.documentsWhereUniqueInput;
    update: Prisma.XOR<Prisma.documentsUpdateWithoutBusiness_partiesInput, Prisma.documentsUncheckedUpdateWithoutBusiness_partiesInput>;
    create: Prisma.XOR<Prisma.documentsCreateWithoutBusiness_partiesInput, Prisma.documentsUncheckedCreateWithoutBusiness_partiesInput>;
};
export type documentsUpdateWithWhereUniqueWithoutBusiness_partiesInput = {
    where: Prisma.documentsWhereUniqueInput;
    data: Prisma.XOR<Prisma.documentsUpdateWithoutBusiness_partiesInput, Prisma.documentsUncheckedUpdateWithoutBusiness_partiesInput>;
};
export type documentsUpdateManyWithWhereWithoutBusiness_partiesInput = {
    where: Prisma.documentsScalarWhereInput;
    data: Prisma.XOR<Prisma.documentsUpdateManyMutationInput, Prisma.documentsUncheckedUpdateManyWithoutBusiness_partiesInput>;
};
export type documentsScalarWhereInput = {
    AND?: Prisma.documentsScalarWhereInput | Prisma.documentsScalarWhereInput[];
    OR?: Prisma.documentsScalarWhereInput[];
    NOT?: Prisma.documentsScalarWhereInput | Prisma.documentsScalarWhereInput[];
    id?: Prisma.UuidFilter<"documents"> | string;
    document_type_id?: Prisma.UuidFilter<"documents"> | string;
    party_id?: Prisma.UuidNullableFilter<"documents"> | string | null;
    number?: Prisma.IntFilter<"documents"> | number;
    date?: Prisma.DateTimeFilter<"documents"> | Date | string;
    status?: Prisma.IntFilter<"documents"> | number;
    created_at?: Prisma.DateTimeFilter<"documents"> | Date | string;
    updated_at?: Prisma.DateTimeFilter<"documents"> | Date | string;
    subtotal?: Prisma.DecimalFilter<"documents"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFilter<"documents"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFilter<"documents"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.StringNullableFilter<"documents"> | string | null;
};
export type documentsCreateWithoutDocument_itemsInput = {
    id?: string;
    number: number;
    date: Date | string;
    status?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    subtotal?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: string | null;
    document_taxes?: Prisma.document_taxesCreateNestedManyWithoutDocumentsInput;
    document_types: Prisma.document_typesCreateNestedOneWithoutDocumentsInput;
    business_parties?: Prisma.business_partiesCreateNestedOneWithoutDocumentsInput;
};
export type documentsUncheckedCreateWithoutDocument_itemsInput = {
    id?: string;
    document_type_id: string;
    party_id?: string | null;
    number: number;
    date: Date | string;
    status?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    subtotal?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: string | null;
    document_taxes?: Prisma.document_taxesUncheckedCreateNestedManyWithoutDocumentsInput;
};
export type documentsCreateOrConnectWithoutDocument_itemsInput = {
    where: Prisma.documentsWhereUniqueInput;
    create: Prisma.XOR<Prisma.documentsCreateWithoutDocument_itemsInput, Prisma.documentsUncheckedCreateWithoutDocument_itemsInput>;
};
export type documentsUpsertWithoutDocument_itemsInput = {
    update: Prisma.XOR<Prisma.documentsUpdateWithoutDocument_itemsInput, Prisma.documentsUncheckedUpdateWithoutDocument_itemsInput>;
    create: Prisma.XOR<Prisma.documentsCreateWithoutDocument_itemsInput, Prisma.documentsUncheckedCreateWithoutDocument_itemsInput>;
    where?: Prisma.documentsWhereInput;
};
export type documentsUpdateToOneWithWhereWithoutDocument_itemsInput = {
    where?: Prisma.documentsWhereInput;
    data: Prisma.XOR<Prisma.documentsUpdateWithoutDocument_itemsInput, Prisma.documentsUncheckedUpdateWithoutDocument_itemsInput>;
};
export type documentsUpdateWithoutDocument_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_taxes?: Prisma.document_taxesUpdateManyWithoutDocumentsNestedInput;
    document_types?: Prisma.document_typesUpdateOneRequiredWithoutDocumentsNestedInput;
    business_parties?: Prisma.business_partiesUpdateOneWithoutDocumentsNestedInput;
};
export type documentsUncheckedUpdateWithoutDocument_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type_id?: Prisma.StringFieldUpdateOperationsInput | string;
    party_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    number?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_taxes?: Prisma.document_taxesUncheckedUpdateManyWithoutDocumentsNestedInput;
};
export type documentsCreateWithoutDocument_taxesInput = {
    id?: string;
    number: number;
    date: Date | string;
    status?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    subtotal?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: string | null;
    document_items?: Prisma.document_itemsCreateNestedManyWithoutDocumentsInput;
    document_types: Prisma.document_typesCreateNestedOneWithoutDocumentsInput;
    business_parties?: Prisma.business_partiesCreateNestedOneWithoutDocumentsInput;
};
export type documentsUncheckedCreateWithoutDocument_taxesInput = {
    id?: string;
    document_type_id: string;
    party_id?: string | null;
    number: number;
    date: Date | string;
    status?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    subtotal?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: string | null;
    document_items?: Prisma.document_itemsUncheckedCreateNestedManyWithoutDocumentsInput;
};
export type documentsCreateOrConnectWithoutDocument_taxesInput = {
    where: Prisma.documentsWhereUniqueInput;
    create: Prisma.XOR<Prisma.documentsCreateWithoutDocument_taxesInput, Prisma.documentsUncheckedCreateWithoutDocument_taxesInput>;
};
export type documentsUpsertWithoutDocument_taxesInput = {
    update: Prisma.XOR<Prisma.documentsUpdateWithoutDocument_taxesInput, Prisma.documentsUncheckedUpdateWithoutDocument_taxesInput>;
    create: Prisma.XOR<Prisma.documentsCreateWithoutDocument_taxesInput, Prisma.documentsUncheckedCreateWithoutDocument_taxesInput>;
    where?: Prisma.documentsWhereInput;
};
export type documentsUpdateToOneWithWhereWithoutDocument_taxesInput = {
    where?: Prisma.documentsWhereInput;
    data: Prisma.XOR<Prisma.documentsUpdateWithoutDocument_taxesInput, Prisma.documentsUncheckedUpdateWithoutDocument_taxesInput>;
};
export type documentsUpdateWithoutDocument_taxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_items?: Prisma.document_itemsUpdateManyWithoutDocumentsNestedInput;
    document_types?: Prisma.document_typesUpdateOneRequiredWithoutDocumentsNestedInput;
    business_parties?: Prisma.business_partiesUpdateOneWithoutDocumentsNestedInput;
};
export type documentsUncheckedUpdateWithoutDocument_taxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type_id?: Prisma.StringFieldUpdateOperationsInput | string;
    party_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    number?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_items?: Prisma.document_itemsUncheckedUpdateManyWithoutDocumentsNestedInput;
};
export type documentsCreateWithoutDocument_typesInput = {
    id?: string;
    number: number;
    date: Date | string;
    status?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    subtotal?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: string | null;
    document_items?: Prisma.document_itemsCreateNestedManyWithoutDocumentsInput;
    document_taxes?: Prisma.document_taxesCreateNestedManyWithoutDocumentsInput;
    business_parties?: Prisma.business_partiesCreateNestedOneWithoutDocumentsInput;
};
export type documentsUncheckedCreateWithoutDocument_typesInput = {
    id?: string;
    party_id?: string | null;
    number: number;
    date: Date | string;
    status?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    subtotal?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: string | null;
    document_items?: Prisma.document_itemsUncheckedCreateNestedManyWithoutDocumentsInput;
    document_taxes?: Prisma.document_taxesUncheckedCreateNestedManyWithoutDocumentsInput;
};
export type documentsCreateOrConnectWithoutDocument_typesInput = {
    where: Prisma.documentsWhereUniqueInput;
    create: Prisma.XOR<Prisma.documentsCreateWithoutDocument_typesInput, Prisma.documentsUncheckedCreateWithoutDocument_typesInput>;
};
export type documentsCreateManyDocument_typesInputEnvelope = {
    data: Prisma.documentsCreateManyDocument_typesInput | Prisma.documentsCreateManyDocument_typesInput[];
    skipDuplicates?: boolean;
};
export type documentsUpsertWithWhereUniqueWithoutDocument_typesInput = {
    where: Prisma.documentsWhereUniqueInput;
    update: Prisma.XOR<Prisma.documentsUpdateWithoutDocument_typesInput, Prisma.documentsUncheckedUpdateWithoutDocument_typesInput>;
    create: Prisma.XOR<Prisma.documentsCreateWithoutDocument_typesInput, Prisma.documentsUncheckedCreateWithoutDocument_typesInput>;
};
export type documentsUpdateWithWhereUniqueWithoutDocument_typesInput = {
    where: Prisma.documentsWhereUniqueInput;
    data: Prisma.XOR<Prisma.documentsUpdateWithoutDocument_typesInput, Prisma.documentsUncheckedUpdateWithoutDocument_typesInput>;
};
export type documentsUpdateManyWithWhereWithoutDocument_typesInput = {
    where: Prisma.documentsScalarWhereInput;
    data: Prisma.XOR<Prisma.documentsUpdateManyMutationInput, Prisma.documentsUncheckedUpdateManyWithoutDocument_typesInput>;
};
export type documentsCreateManyBusiness_partiesInput = {
    id?: string;
    document_type_id: string;
    number: number;
    date: Date | string;
    status?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    subtotal?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: string | null;
};
export type documentsUpdateWithoutBusiness_partiesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_items?: Prisma.document_itemsUpdateManyWithoutDocumentsNestedInput;
    document_taxes?: Prisma.document_taxesUpdateManyWithoutDocumentsNestedInput;
    document_types?: Prisma.document_typesUpdateOneRequiredWithoutDocumentsNestedInput;
};
export type documentsUncheckedUpdateWithoutBusiness_partiesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type_id?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_items?: Prisma.document_itemsUncheckedUpdateManyWithoutDocumentsNestedInput;
    document_taxes?: Prisma.document_taxesUncheckedUpdateManyWithoutDocumentsNestedInput;
};
export type documentsUncheckedUpdateManyWithoutBusiness_partiesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type_id?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type documentsCreateManyDocument_typesInput = {
    id?: string;
    party_id?: string | null;
    number: number;
    date: Date | string;
    status?: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    subtotal?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: string | null;
};
export type documentsUpdateWithoutDocument_typesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    number?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_items?: Prisma.document_itemsUpdateManyWithoutDocumentsNestedInput;
    document_taxes?: Prisma.document_taxesUpdateManyWithoutDocumentsNestedInput;
    business_parties?: Prisma.business_partiesUpdateOneWithoutDocumentsNestedInput;
};
export type documentsUncheckedUpdateWithoutDocument_typesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    party_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    number?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    document_items?: Prisma.document_itemsUncheckedUpdateManyWithoutDocumentsNestedInput;
    document_taxes?: Prisma.document_taxesUncheckedUpdateManyWithoutDocumentsNestedInput;
};
export type documentsUncheckedUpdateManyWithoutDocument_typesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    party_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    number?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.IntFieldUpdateOperationsInput | number;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    subtotal?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total_taxes?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    total?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    descrip?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type DocumentsCountOutputType = {
    document_items: number;
    document_taxes: number;
};
export type DocumentsCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_items?: boolean | DocumentsCountOutputTypeCountDocument_itemsArgs;
    document_taxes?: boolean | DocumentsCountOutputTypeCountDocument_taxesArgs;
};
export type DocumentsCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DocumentsCountOutputTypeSelect<ExtArgs> | null;
};
export type DocumentsCountOutputTypeCountDocument_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_itemsWhereInput;
};
export type DocumentsCountOutputTypeCountDocument_taxesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_taxesWhereInput;
};
export type documentsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_type_id?: boolean;
    party_id?: boolean;
    number?: boolean;
    date?: boolean;
    status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    subtotal?: boolean;
    total_taxes?: boolean;
    total?: boolean;
    descrip?: boolean;
    document_items?: boolean | Prisma.documents$document_itemsArgs<ExtArgs>;
    document_taxes?: boolean | Prisma.documents$document_taxesArgs<ExtArgs>;
    document_types?: boolean | Prisma.document_typesDefaultArgs<ExtArgs>;
    business_parties?: boolean | Prisma.documents$business_partiesArgs<ExtArgs>;
    _count?: boolean | Prisma.DocumentsCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["documents"]>;
export type documentsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_type_id?: boolean;
    party_id?: boolean;
    number?: boolean;
    date?: boolean;
    status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    subtotal?: boolean;
    total_taxes?: boolean;
    total?: boolean;
    descrip?: boolean;
    document_types?: boolean | Prisma.document_typesDefaultArgs<ExtArgs>;
    business_parties?: boolean | Prisma.documents$business_partiesArgs<ExtArgs>;
}, ExtArgs["result"]["documents"]>;
export type documentsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_type_id?: boolean;
    party_id?: boolean;
    number?: boolean;
    date?: boolean;
    status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    subtotal?: boolean;
    total_taxes?: boolean;
    total?: boolean;
    descrip?: boolean;
    document_types?: boolean | Prisma.document_typesDefaultArgs<ExtArgs>;
    business_parties?: boolean | Prisma.documents$business_partiesArgs<ExtArgs>;
}, ExtArgs["result"]["documents"]>;
export type documentsSelectScalar = {
    id?: boolean;
    document_type_id?: boolean;
    party_id?: boolean;
    number?: boolean;
    date?: boolean;
    status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
    subtotal?: boolean;
    total_taxes?: boolean;
    total?: boolean;
    descrip?: boolean;
};
export type documentsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "document_type_id" | "party_id" | "number" | "date" | "status" | "created_at" | "updated_at" | "subtotal" | "total_taxes" | "total" | "descrip", ExtArgs["result"]["documents"]>;
export type documentsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_items?: boolean | Prisma.documents$document_itemsArgs<ExtArgs>;
    document_taxes?: boolean | Prisma.documents$document_taxesArgs<ExtArgs>;
    document_types?: boolean | Prisma.document_typesDefaultArgs<ExtArgs>;
    business_parties?: boolean | Prisma.documents$business_partiesArgs<ExtArgs>;
    _count?: boolean | Prisma.DocumentsCountOutputTypeDefaultArgs<ExtArgs>;
};
export type documentsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_types?: boolean | Prisma.document_typesDefaultArgs<ExtArgs>;
    business_parties?: boolean | Prisma.documents$business_partiesArgs<ExtArgs>;
};
export type documentsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_types?: boolean | Prisma.document_typesDefaultArgs<ExtArgs>;
    business_parties?: boolean | Prisma.documents$business_partiesArgs<ExtArgs>;
};
export type $documentsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "documents";
    objects: {
        document_items: Prisma.$document_itemsPayload<ExtArgs>[];
        document_taxes: Prisma.$document_taxesPayload<ExtArgs>[];
        document_types: Prisma.$document_typesPayload<ExtArgs>;
        business_parties: Prisma.$business_partiesPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        document_type_id: string;
        party_id: string | null;
        number: number;
        date: Date;
        status: number;
        created_at: Date;
        updated_at: Date;
        subtotal: runtime.Decimal;
        total_taxes: runtime.Decimal;
        total: runtime.Decimal;
        descrip: string | null;
    }, ExtArgs["result"]["documents"]>;
    composites: {};
};
export type documentsGetPayload<S extends boolean | null | undefined | documentsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$documentsPayload, S>;
export type documentsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<documentsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DocumentsCountAggregateInputType | true;
};
export interface documentsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['documents'];
        meta: {
            name: 'documents';
        };
    };
    findUnique<T extends documentsFindUniqueArgs>(args: Prisma.SelectSubset<T, documentsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__documentsClient<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends documentsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, documentsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__documentsClient<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends documentsFindFirstArgs>(args?: Prisma.SelectSubset<T, documentsFindFirstArgs<ExtArgs>>): Prisma.Prisma__documentsClient<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends documentsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, documentsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__documentsClient<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends documentsFindManyArgs>(args?: Prisma.SelectSubset<T, documentsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends documentsCreateArgs>(args: Prisma.SelectSubset<T, documentsCreateArgs<ExtArgs>>): Prisma.Prisma__documentsClient<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends documentsCreateManyArgs>(args?: Prisma.SelectSubset<T, documentsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends documentsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, documentsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends documentsDeleteArgs>(args: Prisma.SelectSubset<T, documentsDeleteArgs<ExtArgs>>): Prisma.Prisma__documentsClient<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends documentsUpdateArgs>(args: Prisma.SelectSubset<T, documentsUpdateArgs<ExtArgs>>): Prisma.Prisma__documentsClient<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends documentsDeleteManyArgs>(args?: Prisma.SelectSubset<T, documentsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends documentsUpdateManyArgs>(args: Prisma.SelectSubset<T, documentsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends documentsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, documentsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends documentsUpsertArgs>(args: Prisma.SelectSubset<T, documentsUpsertArgs<ExtArgs>>): Prisma.Prisma__documentsClient<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends documentsCountArgs>(args?: Prisma.Subset<T, documentsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DocumentsCountAggregateOutputType> : number>;
    aggregate<T extends DocumentsAggregateArgs>(args: Prisma.Subset<T, DocumentsAggregateArgs>): Prisma.PrismaPromise<GetDocumentsAggregateType<T>>;
    groupBy<T extends documentsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: documentsGroupByArgs['orderBy'];
    } : {
        orderBy?: documentsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, documentsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: documentsFieldRefs;
}
export interface Prisma__documentsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    document_items<T extends Prisma.documents$document_itemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.documents$document_itemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_itemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    document_taxes<T extends Prisma.documents$document_taxesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.documents$document_taxesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_taxesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    document_types<T extends Prisma.document_typesDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.document_typesDefaultArgs<ExtArgs>>): Prisma.Prisma__document_typesClient<runtime.Types.Result.GetResult<Prisma.$document_typesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    business_parties<T extends Prisma.documents$business_partiesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.documents$business_partiesArgs<ExtArgs>>): Prisma.Prisma__business_partiesClient<runtime.Types.Result.GetResult<Prisma.$business_partiesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface documentsFieldRefs {
    readonly id: Prisma.FieldRef<"documents", 'String'>;
    readonly document_type_id: Prisma.FieldRef<"documents", 'String'>;
    readonly party_id: Prisma.FieldRef<"documents", 'String'>;
    readonly number: Prisma.FieldRef<"documents", 'Int'>;
    readonly date: Prisma.FieldRef<"documents", 'DateTime'>;
    readonly status: Prisma.FieldRef<"documents", 'Int'>;
    readonly created_at: Prisma.FieldRef<"documents", 'DateTime'>;
    readonly updated_at: Prisma.FieldRef<"documents", 'DateTime'>;
    readonly subtotal: Prisma.FieldRef<"documents", 'Decimal'>;
    readonly total_taxes: Prisma.FieldRef<"documents", 'Decimal'>;
    readonly total: Prisma.FieldRef<"documents", 'Decimal'>;
    readonly descrip: Prisma.FieldRef<"documents", 'String'>;
}
export type documentsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documentsSelect<ExtArgs> | null;
    omit?: Prisma.documentsOmit<ExtArgs> | null;
    include?: Prisma.documentsInclude<ExtArgs> | null;
    where: Prisma.documentsWhereUniqueInput;
};
export type documentsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documentsSelect<ExtArgs> | null;
    omit?: Prisma.documentsOmit<ExtArgs> | null;
    include?: Prisma.documentsInclude<ExtArgs> | null;
    where: Prisma.documentsWhereUniqueInput;
};
export type documentsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documentsSelect<ExtArgs> | null;
    omit?: Prisma.documentsOmit<ExtArgs> | null;
    include?: Prisma.documentsInclude<ExtArgs> | null;
    where?: Prisma.documentsWhereInput;
    orderBy?: Prisma.documentsOrderByWithRelationInput | Prisma.documentsOrderByWithRelationInput[];
    cursor?: Prisma.documentsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocumentsScalarFieldEnum | Prisma.DocumentsScalarFieldEnum[];
};
export type documentsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documentsSelect<ExtArgs> | null;
    omit?: Prisma.documentsOmit<ExtArgs> | null;
    include?: Prisma.documentsInclude<ExtArgs> | null;
    where?: Prisma.documentsWhereInput;
    orderBy?: Prisma.documentsOrderByWithRelationInput | Prisma.documentsOrderByWithRelationInput[];
    cursor?: Prisma.documentsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocumentsScalarFieldEnum | Prisma.DocumentsScalarFieldEnum[];
};
export type documentsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documentsSelect<ExtArgs> | null;
    omit?: Prisma.documentsOmit<ExtArgs> | null;
    include?: Prisma.documentsInclude<ExtArgs> | null;
    where?: Prisma.documentsWhereInput;
    orderBy?: Prisma.documentsOrderByWithRelationInput | Prisma.documentsOrderByWithRelationInput[];
    cursor?: Prisma.documentsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocumentsScalarFieldEnum | Prisma.DocumentsScalarFieldEnum[];
};
export type documentsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documentsSelect<ExtArgs> | null;
    omit?: Prisma.documentsOmit<ExtArgs> | null;
    include?: Prisma.documentsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.documentsCreateInput, Prisma.documentsUncheckedCreateInput>;
};
export type documentsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.documentsCreateManyInput | Prisma.documentsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type documentsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documentsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.documentsOmit<ExtArgs> | null;
    data: Prisma.documentsCreateManyInput | Prisma.documentsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.documentsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type documentsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documentsSelect<ExtArgs> | null;
    omit?: Prisma.documentsOmit<ExtArgs> | null;
    include?: Prisma.documentsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.documentsUpdateInput, Prisma.documentsUncheckedUpdateInput>;
    where: Prisma.documentsWhereUniqueInput;
};
export type documentsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.documentsUpdateManyMutationInput, Prisma.documentsUncheckedUpdateManyInput>;
    where?: Prisma.documentsWhereInput;
    limit?: number;
};
export type documentsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documentsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.documentsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.documentsUpdateManyMutationInput, Prisma.documentsUncheckedUpdateManyInput>;
    where?: Prisma.documentsWhereInput;
    limit?: number;
    include?: Prisma.documentsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type documentsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documentsSelect<ExtArgs> | null;
    omit?: Prisma.documentsOmit<ExtArgs> | null;
    include?: Prisma.documentsInclude<ExtArgs> | null;
    where: Prisma.documentsWhereUniqueInput;
    create: Prisma.XOR<Prisma.documentsCreateInput, Prisma.documentsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.documentsUpdateInput, Prisma.documentsUncheckedUpdateInput>;
};
export type documentsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documentsSelect<ExtArgs> | null;
    omit?: Prisma.documentsOmit<ExtArgs> | null;
    include?: Prisma.documentsInclude<ExtArgs> | null;
    where: Prisma.documentsWhereUniqueInput;
};
export type documentsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documentsWhereInput;
    limit?: number;
};
export type documents$document_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type documents$document_taxesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type documents$business_partiesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.business_partiesSelect<ExtArgs> | null;
    omit?: Prisma.business_partiesOmit<ExtArgs> | null;
    include?: Prisma.business_partiesInclude<ExtArgs> | null;
    where?: Prisma.business_partiesWhereInput;
};
export type documentsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documentsSelect<ExtArgs> | null;
    omit?: Prisma.documentsOmit<ExtArgs> | null;
    include?: Prisma.documentsInclude<ExtArgs> | null;
};
