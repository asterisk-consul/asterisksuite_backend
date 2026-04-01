import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type document_typesModel = runtime.Types.Result.DefaultSelection<Prisma.$document_typesPayload>;
export type AggregateDocument_types = {
    _count: Document_typesCountAggregateOutputType | null;
    _avg: Document_typesAvgAggregateOutputType | null;
    _sum: Document_typesSumAggregateOutputType | null;
    _min: Document_typesMinAggregateOutputType | null;
    _max: Document_typesMaxAggregateOutputType | null;
};
export type Document_typesAvgAggregateOutputType = {
    direction: number | null;
};
export type Document_typesSumAggregateOutputType = {
    direction: number | null;
};
export type Document_typesMinAggregateOutputType = {
    id: string | null;
    document_sequence_id: string | null;
    code: string | null;
    description: string | null;
    direction: number | null;
    affects_stock: boolean | null;
    affects_accounting: boolean | null;
    active: boolean | null;
};
export type Document_typesMaxAggregateOutputType = {
    id: string | null;
    document_sequence_id: string | null;
    code: string | null;
    description: string | null;
    direction: number | null;
    affects_stock: boolean | null;
    affects_accounting: boolean | null;
    active: boolean | null;
};
export type Document_typesCountAggregateOutputType = {
    id: number;
    document_sequence_id: number;
    code: number;
    description: number;
    direction: number;
    affects_stock: number;
    affects_accounting: number;
    active: number;
    _all: number;
};
export type Document_typesAvgAggregateInputType = {
    direction?: true;
};
export type Document_typesSumAggregateInputType = {
    direction?: true;
};
export type Document_typesMinAggregateInputType = {
    id?: true;
    document_sequence_id?: true;
    code?: true;
    description?: true;
    direction?: true;
    affects_stock?: true;
    affects_accounting?: true;
    active?: true;
};
export type Document_typesMaxAggregateInputType = {
    id?: true;
    document_sequence_id?: true;
    code?: true;
    description?: true;
    direction?: true;
    affects_stock?: true;
    affects_accounting?: true;
    active?: true;
};
export type Document_typesCountAggregateInputType = {
    id?: true;
    document_sequence_id?: true;
    code?: true;
    description?: true;
    direction?: true;
    affects_stock?: true;
    affects_accounting?: true;
    active?: true;
    _all?: true;
};
export type Document_typesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_typesWhereInput;
    orderBy?: Prisma.document_typesOrderByWithRelationInput | Prisma.document_typesOrderByWithRelationInput[];
    cursor?: Prisma.document_typesWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Document_typesCountAggregateInputType;
    _avg?: Document_typesAvgAggregateInputType;
    _sum?: Document_typesSumAggregateInputType;
    _min?: Document_typesMinAggregateInputType;
    _max?: Document_typesMaxAggregateInputType;
};
export type GetDocument_typesAggregateType<T extends Document_typesAggregateArgs> = {
    [P in keyof T & keyof AggregateDocument_types]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocument_types[P]> : Prisma.GetScalarType<T[P], AggregateDocument_types[P]>;
};
export type document_typesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_typesWhereInput;
    orderBy?: Prisma.document_typesOrderByWithAggregationInput | Prisma.document_typesOrderByWithAggregationInput[];
    by: Prisma.Document_typesScalarFieldEnum[] | Prisma.Document_typesScalarFieldEnum;
    having?: Prisma.document_typesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Document_typesCountAggregateInputType | true;
    _avg?: Document_typesAvgAggregateInputType;
    _sum?: Document_typesSumAggregateInputType;
    _min?: Document_typesMinAggregateInputType;
    _max?: Document_typesMaxAggregateInputType;
};
export type Document_typesGroupByOutputType = {
    id: string;
    document_sequence_id: string | null;
    code: string;
    description: string;
    direction: number;
    affects_stock: boolean;
    affects_accounting: boolean;
    active: boolean;
    _count: Document_typesCountAggregateOutputType | null;
    _avg: Document_typesAvgAggregateOutputType | null;
    _sum: Document_typesSumAggregateOutputType | null;
    _min: Document_typesMinAggregateOutputType | null;
    _max: Document_typesMaxAggregateOutputType | null;
};
export type GetDocument_typesGroupByPayload<T extends document_typesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Document_typesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Document_typesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Document_typesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Document_typesGroupByOutputType[P]>;
}>>;
export type document_typesWhereInput = {
    AND?: Prisma.document_typesWhereInput | Prisma.document_typesWhereInput[];
    OR?: Prisma.document_typesWhereInput[];
    NOT?: Prisma.document_typesWhereInput | Prisma.document_typesWhereInput[];
    id?: Prisma.UuidFilter<"document_types"> | string;
    document_sequence_id?: Prisma.UuidNullableFilter<"document_types"> | string | null;
    code?: Prisma.StringFilter<"document_types"> | string;
    description?: Prisma.StringFilter<"document_types"> | string;
    direction?: Prisma.IntFilter<"document_types"> | number;
    affects_stock?: Prisma.BoolFilter<"document_types"> | boolean;
    affects_accounting?: Prisma.BoolFilter<"document_types"> | boolean;
    active?: Prisma.BoolFilter<"document_types"> | boolean;
    document_sequences?: Prisma.XOR<Prisma.Document_sequencesNullableScalarRelationFilter, Prisma.document_sequencesWhereInput> | null;
    documents?: Prisma.DocumentsListRelationFilter;
};
export type document_typesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    document_sequence_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    affects_stock?: Prisma.SortOrder;
    affects_accounting?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    document_sequences?: Prisma.document_sequencesOrderByWithRelationInput;
    documents?: Prisma.documentsOrderByRelationAggregateInput;
};
export type document_typesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    code?: string;
    AND?: Prisma.document_typesWhereInput | Prisma.document_typesWhereInput[];
    OR?: Prisma.document_typesWhereInput[];
    NOT?: Prisma.document_typesWhereInput | Prisma.document_typesWhereInput[];
    document_sequence_id?: Prisma.UuidNullableFilter<"document_types"> | string | null;
    description?: Prisma.StringFilter<"document_types"> | string;
    direction?: Prisma.IntFilter<"document_types"> | number;
    affects_stock?: Prisma.BoolFilter<"document_types"> | boolean;
    affects_accounting?: Prisma.BoolFilter<"document_types"> | boolean;
    active?: Prisma.BoolFilter<"document_types"> | boolean;
    document_sequences?: Prisma.XOR<Prisma.Document_sequencesNullableScalarRelationFilter, Prisma.document_sequencesWhereInput> | null;
    documents?: Prisma.DocumentsListRelationFilter;
}, "id" | "code">;
export type document_typesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    document_sequence_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    affects_stock?: Prisma.SortOrder;
    affects_accounting?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    _count?: Prisma.document_typesCountOrderByAggregateInput;
    _avg?: Prisma.document_typesAvgOrderByAggregateInput;
    _max?: Prisma.document_typesMaxOrderByAggregateInput;
    _min?: Prisma.document_typesMinOrderByAggregateInput;
    _sum?: Prisma.document_typesSumOrderByAggregateInput;
};
export type document_typesScalarWhereWithAggregatesInput = {
    AND?: Prisma.document_typesScalarWhereWithAggregatesInput | Prisma.document_typesScalarWhereWithAggregatesInput[];
    OR?: Prisma.document_typesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.document_typesScalarWhereWithAggregatesInput | Prisma.document_typesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"document_types"> | string;
    document_sequence_id?: Prisma.UuidNullableWithAggregatesFilter<"document_types"> | string | null;
    code?: Prisma.StringWithAggregatesFilter<"document_types"> | string;
    description?: Prisma.StringWithAggregatesFilter<"document_types"> | string;
    direction?: Prisma.IntWithAggregatesFilter<"document_types"> | number;
    affects_stock?: Prisma.BoolWithAggregatesFilter<"document_types"> | boolean;
    affects_accounting?: Prisma.BoolWithAggregatesFilter<"document_types"> | boolean;
    active?: Prisma.BoolWithAggregatesFilter<"document_types"> | boolean;
};
export type document_typesCreateInput = {
    id?: string;
    code: string;
    description: string;
    direction: number;
    affects_stock?: boolean;
    affects_accounting?: boolean;
    active?: boolean;
    document_sequences?: Prisma.document_sequencesCreateNestedOneWithoutDocument_typesInput;
    documents?: Prisma.documentsCreateNestedManyWithoutDocument_typesInput;
};
export type document_typesUncheckedCreateInput = {
    id?: string;
    document_sequence_id?: string | null;
    code: string;
    description: string;
    direction: number;
    affects_stock?: boolean;
    affects_accounting?: boolean;
    active?: boolean;
    documents?: Prisma.documentsUncheckedCreateNestedManyWithoutDocument_typesInput;
};
export type document_typesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.IntFieldUpdateOperationsInput | number;
    affects_stock?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    affects_accounting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    document_sequences?: Prisma.document_sequencesUpdateOneWithoutDocument_typesNestedInput;
    documents?: Prisma.documentsUpdateManyWithoutDocument_typesNestedInput;
};
export type document_typesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_sequence_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.IntFieldUpdateOperationsInput | number;
    affects_stock?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    affects_accounting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    documents?: Prisma.documentsUncheckedUpdateManyWithoutDocument_typesNestedInput;
};
export type document_typesCreateManyInput = {
    id?: string;
    document_sequence_id?: string | null;
    code: string;
    description: string;
    direction: number;
    affects_stock?: boolean;
    affects_accounting?: boolean;
    active?: boolean;
};
export type document_typesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.IntFieldUpdateOperationsInput | number;
    affects_stock?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    affects_accounting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type document_typesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_sequence_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.IntFieldUpdateOperationsInput | number;
    affects_stock?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    affects_accounting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type Document_typesListRelationFilter = {
    every?: Prisma.document_typesWhereInput;
    some?: Prisma.document_typesWhereInput;
    none?: Prisma.document_typesWhereInput;
};
export type document_typesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type document_typesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_sequence_id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    affects_stock?: Prisma.SortOrder;
    affects_accounting?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type document_typesAvgOrderByAggregateInput = {
    direction?: Prisma.SortOrder;
};
export type document_typesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_sequence_id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    affects_stock?: Prisma.SortOrder;
    affects_accounting?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type document_typesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_sequence_id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    affects_stock?: Prisma.SortOrder;
    affects_accounting?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type document_typesSumOrderByAggregateInput = {
    direction?: Prisma.SortOrder;
};
export type Document_typesScalarRelationFilter = {
    is?: Prisma.document_typesWhereInput;
    isNot?: Prisma.document_typesWhereInput;
};
export type document_typesCreateNestedManyWithoutDocument_sequencesInput = {
    create?: Prisma.XOR<Prisma.document_typesCreateWithoutDocument_sequencesInput, Prisma.document_typesUncheckedCreateWithoutDocument_sequencesInput> | Prisma.document_typesCreateWithoutDocument_sequencesInput[] | Prisma.document_typesUncheckedCreateWithoutDocument_sequencesInput[];
    connectOrCreate?: Prisma.document_typesCreateOrConnectWithoutDocument_sequencesInput | Prisma.document_typesCreateOrConnectWithoutDocument_sequencesInput[];
    createMany?: Prisma.document_typesCreateManyDocument_sequencesInputEnvelope;
    connect?: Prisma.document_typesWhereUniqueInput | Prisma.document_typesWhereUniqueInput[];
};
export type document_typesUncheckedCreateNestedManyWithoutDocument_sequencesInput = {
    create?: Prisma.XOR<Prisma.document_typesCreateWithoutDocument_sequencesInput, Prisma.document_typesUncheckedCreateWithoutDocument_sequencesInput> | Prisma.document_typesCreateWithoutDocument_sequencesInput[] | Prisma.document_typesUncheckedCreateWithoutDocument_sequencesInput[];
    connectOrCreate?: Prisma.document_typesCreateOrConnectWithoutDocument_sequencesInput | Prisma.document_typesCreateOrConnectWithoutDocument_sequencesInput[];
    createMany?: Prisma.document_typesCreateManyDocument_sequencesInputEnvelope;
    connect?: Prisma.document_typesWhereUniqueInput | Prisma.document_typesWhereUniqueInput[];
};
export type document_typesUpdateManyWithoutDocument_sequencesNestedInput = {
    create?: Prisma.XOR<Prisma.document_typesCreateWithoutDocument_sequencesInput, Prisma.document_typesUncheckedCreateWithoutDocument_sequencesInput> | Prisma.document_typesCreateWithoutDocument_sequencesInput[] | Prisma.document_typesUncheckedCreateWithoutDocument_sequencesInput[];
    connectOrCreate?: Prisma.document_typesCreateOrConnectWithoutDocument_sequencesInput | Prisma.document_typesCreateOrConnectWithoutDocument_sequencesInput[];
    upsert?: Prisma.document_typesUpsertWithWhereUniqueWithoutDocument_sequencesInput | Prisma.document_typesUpsertWithWhereUniqueWithoutDocument_sequencesInput[];
    createMany?: Prisma.document_typesCreateManyDocument_sequencesInputEnvelope;
    set?: Prisma.document_typesWhereUniqueInput | Prisma.document_typesWhereUniqueInput[];
    disconnect?: Prisma.document_typesWhereUniqueInput | Prisma.document_typesWhereUniqueInput[];
    delete?: Prisma.document_typesWhereUniqueInput | Prisma.document_typesWhereUniqueInput[];
    connect?: Prisma.document_typesWhereUniqueInput | Prisma.document_typesWhereUniqueInput[];
    update?: Prisma.document_typesUpdateWithWhereUniqueWithoutDocument_sequencesInput | Prisma.document_typesUpdateWithWhereUniqueWithoutDocument_sequencesInput[];
    updateMany?: Prisma.document_typesUpdateManyWithWhereWithoutDocument_sequencesInput | Prisma.document_typesUpdateManyWithWhereWithoutDocument_sequencesInput[];
    deleteMany?: Prisma.document_typesScalarWhereInput | Prisma.document_typesScalarWhereInput[];
};
export type document_typesUncheckedUpdateManyWithoutDocument_sequencesNestedInput = {
    create?: Prisma.XOR<Prisma.document_typesCreateWithoutDocument_sequencesInput, Prisma.document_typesUncheckedCreateWithoutDocument_sequencesInput> | Prisma.document_typesCreateWithoutDocument_sequencesInput[] | Prisma.document_typesUncheckedCreateWithoutDocument_sequencesInput[];
    connectOrCreate?: Prisma.document_typesCreateOrConnectWithoutDocument_sequencesInput | Prisma.document_typesCreateOrConnectWithoutDocument_sequencesInput[];
    upsert?: Prisma.document_typesUpsertWithWhereUniqueWithoutDocument_sequencesInput | Prisma.document_typesUpsertWithWhereUniqueWithoutDocument_sequencesInput[];
    createMany?: Prisma.document_typesCreateManyDocument_sequencesInputEnvelope;
    set?: Prisma.document_typesWhereUniqueInput | Prisma.document_typesWhereUniqueInput[];
    disconnect?: Prisma.document_typesWhereUniqueInput | Prisma.document_typesWhereUniqueInput[];
    delete?: Prisma.document_typesWhereUniqueInput | Prisma.document_typesWhereUniqueInput[];
    connect?: Prisma.document_typesWhereUniqueInput | Prisma.document_typesWhereUniqueInput[];
    update?: Prisma.document_typesUpdateWithWhereUniqueWithoutDocument_sequencesInput | Prisma.document_typesUpdateWithWhereUniqueWithoutDocument_sequencesInput[];
    updateMany?: Prisma.document_typesUpdateManyWithWhereWithoutDocument_sequencesInput | Prisma.document_typesUpdateManyWithWhereWithoutDocument_sequencesInput[];
    deleteMany?: Prisma.document_typesScalarWhereInput | Prisma.document_typesScalarWhereInput[];
};
export type document_typesCreateNestedOneWithoutDocumentsInput = {
    create?: Prisma.XOR<Prisma.document_typesCreateWithoutDocumentsInput, Prisma.document_typesUncheckedCreateWithoutDocumentsInput>;
    connectOrCreate?: Prisma.document_typesCreateOrConnectWithoutDocumentsInput;
    connect?: Prisma.document_typesWhereUniqueInput;
};
export type document_typesUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: Prisma.XOR<Prisma.document_typesCreateWithoutDocumentsInput, Prisma.document_typesUncheckedCreateWithoutDocumentsInput>;
    connectOrCreate?: Prisma.document_typesCreateOrConnectWithoutDocumentsInput;
    upsert?: Prisma.document_typesUpsertWithoutDocumentsInput;
    connect?: Prisma.document_typesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.document_typesUpdateToOneWithWhereWithoutDocumentsInput, Prisma.document_typesUpdateWithoutDocumentsInput>, Prisma.document_typesUncheckedUpdateWithoutDocumentsInput>;
};
export type document_typesCreateWithoutDocument_sequencesInput = {
    id?: string;
    code: string;
    description: string;
    direction: number;
    affects_stock?: boolean;
    affects_accounting?: boolean;
    active?: boolean;
    documents?: Prisma.documentsCreateNestedManyWithoutDocument_typesInput;
};
export type document_typesUncheckedCreateWithoutDocument_sequencesInput = {
    id?: string;
    code: string;
    description: string;
    direction: number;
    affects_stock?: boolean;
    affects_accounting?: boolean;
    active?: boolean;
    documents?: Prisma.documentsUncheckedCreateNestedManyWithoutDocument_typesInput;
};
export type document_typesCreateOrConnectWithoutDocument_sequencesInput = {
    where: Prisma.document_typesWhereUniqueInput;
    create: Prisma.XOR<Prisma.document_typesCreateWithoutDocument_sequencesInput, Prisma.document_typesUncheckedCreateWithoutDocument_sequencesInput>;
};
export type document_typesCreateManyDocument_sequencesInputEnvelope = {
    data: Prisma.document_typesCreateManyDocument_sequencesInput | Prisma.document_typesCreateManyDocument_sequencesInput[];
    skipDuplicates?: boolean;
};
export type document_typesUpsertWithWhereUniqueWithoutDocument_sequencesInput = {
    where: Prisma.document_typesWhereUniqueInput;
    update: Prisma.XOR<Prisma.document_typesUpdateWithoutDocument_sequencesInput, Prisma.document_typesUncheckedUpdateWithoutDocument_sequencesInput>;
    create: Prisma.XOR<Prisma.document_typesCreateWithoutDocument_sequencesInput, Prisma.document_typesUncheckedCreateWithoutDocument_sequencesInput>;
};
export type document_typesUpdateWithWhereUniqueWithoutDocument_sequencesInput = {
    where: Prisma.document_typesWhereUniqueInput;
    data: Prisma.XOR<Prisma.document_typesUpdateWithoutDocument_sequencesInput, Prisma.document_typesUncheckedUpdateWithoutDocument_sequencesInput>;
};
export type document_typesUpdateManyWithWhereWithoutDocument_sequencesInput = {
    where: Prisma.document_typesScalarWhereInput;
    data: Prisma.XOR<Prisma.document_typesUpdateManyMutationInput, Prisma.document_typesUncheckedUpdateManyWithoutDocument_sequencesInput>;
};
export type document_typesScalarWhereInput = {
    AND?: Prisma.document_typesScalarWhereInput | Prisma.document_typesScalarWhereInput[];
    OR?: Prisma.document_typesScalarWhereInput[];
    NOT?: Prisma.document_typesScalarWhereInput | Prisma.document_typesScalarWhereInput[];
    id?: Prisma.UuidFilter<"document_types"> | string;
    document_sequence_id?: Prisma.UuidNullableFilter<"document_types"> | string | null;
    code?: Prisma.StringFilter<"document_types"> | string;
    description?: Prisma.StringFilter<"document_types"> | string;
    direction?: Prisma.IntFilter<"document_types"> | number;
    affects_stock?: Prisma.BoolFilter<"document_types"> | boolean;
    affects_accounting?: Prisma.BoolFilter<"document_types"> | boolean;
    active?: Prisma.BoolFilter<"document_types"> | boolean;
};
export type document_typesCreateWithoutDocumentsInput = {
    id?: string;
    code: string;
    description: string;
    direction: number;
    affects_stock?: boolean;
    affects_accounting?: boolean;
    active?: boolean;
    document_sequences?: Prisma.document_sequencesCreateNestedOneWithoutDocument_typesInput;
};
export type document_typesUncheckedCreateWithoutDocumentsInput = {
    id?: string;
    document_sequence_id?: string | null;
    code: string;
    description: string;
    direction: number;
    affects_stock?: boolean;
    affects_accounting?: boolean;
    active?: boolean;
};
export type document_typesCreateOrConnectWithoutDocumentsInput = {
    where: Prisma.document_typesWhereUniqueInput;
    create: Prisma.XOR<Prisma.document_typesCreateWithoutDocumentsInput, Prisma.document_typesUncheckedCreateWithoutDocumentsInput>;
};
export type document_typesUpsertWithoutDocumentsInput = {
    update: Prisma.XOR<Prisma.document_typesUpdateWithoutDocumentsInput, Prisma.document_typesUncheckedUpdateWithoutDocumentsInput>;
    create: Prisma.XOR<Prisma.document_typesCreateWithoutDocumentsInput, Prisma.document_typesUncheckedCreateWithoutDocumentsInput>;
    where?: Prisma.document_typesWhereInput;
};
export type document_typesUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: Prisma.document_typesWhereInput;
    data: Prisma.XOR<Prisma.document_typesUpdateWithoutDocumentsInput, Prisma.document_typesUncheckedUpdateWithoutDocumentsInput>;
};
export type document_typesUpdateWithoutDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.IntFieldUpdateOperationsInput | number;
    affects_stock?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    affects_accounting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    document_sequences?: Prisma.document_sequencesUpdateOneWithoutDocument_typesNestedInput;
};
export type document_typesUncheckedUpdateWithoutDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_sequence_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.IntFieldUpdateOperationsInput | number;
    affects_stock?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    affects_accounting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type document_typesCreateManyDocument_sequencesInput = {
    id?: string;
    code: string;
    description: string;
    direction: number;
    affects_stock?: boolean;
    affects_accounting?: boolean;
    active?: boolean;
};
export type document_typesUpdateWithoutDocument_sequencesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.IntFieldUpdateOperationsInput | number;
    affects_stock?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    affects_accounting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    documents?: Prisma.documentsUpdateManyWithoutDocument_typesNestedInput;
};
export type document_typesUncheckedUpdateWithoutDocument_sequencesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.IntFieldUpdateOperationsInput | number;
    affects_stock?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    affects_accounting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    documents?: Prisma.documentsUncheckedUpdateManyWithoutDocument_typesNestedInput;
};
export type document_typesUncheckedUpdateManyWithoutDocument_sequencesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.IntFieldUpdateOperationsInput | number;
    affects_stock?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    affects_accounting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type Document_typesCountOutputType = {
    documents: number;
};
export type Document_typesCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    documents?: boolean | Document_typesCountOutputTypeCountDocumentsArgs;
};
export type Document_typesCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.Document_typesCountOutputTypeSelect<ExtArgs> | null;
};
export type Document_typesCountOutputTypeCountDocumentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documentsWhereInput;
};
export type document_typesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_sequence_id?: boolean;
    code?: boolean;
    description?: boolean;
    direction?: boolean;
    affects_stock?: boolean;
    affects_accounting?: boolean;
    active?: boolean;
    document_sequences?: boolean | Prisma.document_types$document_sequencesArgs<ExtArgs>;
    documents?: boolean | Prisma.document_types$documentsArgs<ExtArgs>;
    _count?: boolean | Prisma.Document_typesCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["document_types"]>;
export type document_typesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_sequence_id?: boolean;
    code?: boolean;
    description?: boolean;
    direction?: boolean;
    affects_stock?: boolean;
    affects_accounting?: boolean;
    active?: boolean;
    document_sequences?: boolean | Prisma.document_types$document_sequencesArgs<ExtArgs>;
}, ExtArgs["result"]["document_types"]>;
export type document_typesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_sequence_id?: boolean;
    code?: boolean;
    description?: boolean;
    direction?: boolean;
    affects_stock?: boolean;
    affects_accounting?: boolean;
    active?: boolean;
    document_sequences?: boolean | Prisma.document_types$document_sequencesArgs<ExtArgs>;
}, ExtArgs["result"]["document_types"]>;
export type document_typesSelectScalar = {
    id?: boolean;
    document_sequence_id?: boolean;
    code?: boolean;
    description?: boolean;
    direction?: boolean;
    affects_stock?: boolean;
    affects_accounting?: boolean;
    active?: boolean;
};
export type document_typesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "document_sequence_id" | "code" | "description" | "direction" | "affects_stock" | "affects_accounting" | "active", ExtArgs["result"]["document_types"]>;
export type document_typesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_sequences?: boolean | Prisma.document_types$document_sequencesArgs<ExtArgs>;
    documents?: boolean | Prisma.document_types$documentsArgs<ExtArgs>;
    _count?: boolean | Prisma.Document_typesCountOutputTypeDefaultArgs<ExtArgs>;
};
export type document_typesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_sequences?: boolean | Prisma.document_types$document_sequencesArgs<ExtArgs>;
};
export type document_typesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_sequences?: boolean | Prisma.document_types$document_sequencesArgs<ExtArgs>;
};
export type $document_typesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "document_types";
    objects: {
        document_sequences: Prisma.$document_sequencesPayload<ExtArgs> | null;
        documents: Prisma.$documentsPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        document_sequence_id: string | null;
        code: string;
        description: string;
        direction: number;
        affects_stock: boolean;
        affects_accounting: boolean;
        active: boolean;
    }, ExtArgs["result"]["document_types"]>;
    composites: {};
};
export type document_typesGetPayload<S extends boolean | null | undefined | document_typesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$document_typesPayload, S>;
export type document_typesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<document_typesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Document_typesCountAggregateInputType | true;
};
export interface document_typesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['document_types'];
        meta: {
            name: 'document_types';
        };
    };
    findUnique<T extends document_typesFindUniqueArgs>(args: Prisma.SelectSubset<T, document_typesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__document_typesClient<runtime.Types.Result.GetResult<Prisma.$document_typesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends document_typesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, document_typesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__document_typesClient<runtime.Types.Result.GetResult<Prisma.$document_typesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends document_typesFindFirstArgs>(args?: Prisma.SelectSubset<T, document_typesFindFirstArgs<ExtArgs>>): Prisma.Prisma__document_typesClient<runtime.Types.Result.GetResult<Prisma.$document_typesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends document_typesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, document_typesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__document_typesClient<runtime.Types.Result.GetResult<Prisma.$document_typesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends document_typesFindManyArgs>(args?: Prisma.SelectSubset<T, document_typesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_typesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends document_typesCreateArgs>(args: Prisma.SelectSubset<T, document_typesCreateArgs<ExtArgs>>): Prisma.Prisma__document_typesClient<runtime.Types.Result.GetResult<Prisma.$document_typesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends document_typesCreateManyArgs>(args?: Prisma.SelectSubset<T, document_typesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends document_typesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, document_typesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_typesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends document_typesDeleteArgs>(args: Prisma.SelectSubset<T, document_typesDeleteArgs<ExtArgs>>): Prisma.Prisma__document_typesClient<runtime.Types.Result.GetResult<Prisma.$document_typesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends document_typesUpdateArgs>(args: Prisma.SelectSubset<T, document_typesUpdateArgs<ExtArgs>>): Prisma.Prisma__document_typesClient<runtime.Types.Result.GetResult<Prisma.$document_typesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends document_typesDeleteManyArgs>(args?: Prisma.SelectSubset<T, document_typesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends document_typesUpdateManyArgs>(args: Prisma.SelectSubset<T, document_typesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends document_typesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, document_typesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_typesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends document_typesUpsertArgs>(args: Prisma.SelectSubset<T, document_typesUpsertArgs<ExtArgs>>): Prisma.Prisma__document_typesClient<runtime.Types.Result.GetResult<Prisma.$document_typesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends document_typesCountArgs>(args?: Prisma.Subset<T, document_typesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Document_typesCountAggregateOutputType> : number>;
    aggregate<T extends Document_typesAggregateArgs>(args: Prisma.Subset<T, Document_typesAggregateArgs>): Prisma.PrismaPromise<GetDocument_typesAggregateType<T>>;
    groupBy<T extends document_typesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: document_typesGroupByArgs['orderBy'];
    } : {
        orderBy?: document_typesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, document_typesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocument_typesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: document_typesFieldRefs;
}
export interface Prisma__document_typesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    document_sequences<T extends Prisma.document_types$document_sequencesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.document_types$document_sequencesArgs<ExtArgs>>): Prisma.Prisma__document_sequencesClient<runtime.Types.Result.GetResult<Prisma.$document_sequencesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    documents<T extends Prisma.document_types$documentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.document_types$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface document_typesFieldRefs {
    readonly id: Prisma.FieldRef<"document_types", 'String'>;
    readonly document_sequence_id: Prisma.FieldRef<"document_types", 'String'>;
    readonly code: Prisma.FieldRef<"document_types", 'String'>;
    readonly description: Prisma.FieldRef<"document_types", 'String'>;
    readonly direction: Prisma.FieldRef<"document_types", 'Int'>;
    readonly affects_stock: Prisma.FieldRef<"document_types", 'Boolean'>;
    readonly affects_accounting: Prisma.FieldRef<"document_types", 'Boolean'>;
    readonly active: Prisma.FieldRef<"document_types", 'Boolean'>;
}
export type document_typesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_typesSelect<ExtArgs> | null;
    omit?: Prisma.document_typesOmit<ExtArgs> | null;
    include?: Prisma.document_typesInclude<ExtArgs> | null;
    where: Prisma.document_typesWhereUniqueInput;
};
export type document_typesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_typesSelect<ExtArgs> | null;
    omit?: Prisma.document_typesOmit<ExtArgs> | null;
    include?: Prisma.document_typesInclude<ExtArgs> | null;
    where: Prisma.document_typesWhereUniqueInput;
};
export type document_typesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_typesSelect<ExtArgs> | null;
    omit?: Prisma.document_typesOmit<ExtArgs> | null;
    include?: Prisma.document_typesInclude<ExtArgs> | null;
    where?: Prisma.document_typesWhereInput;
    orderBy?: Prisma.document_typesOrderByWithRelationInput | Prisma.document_typesOrderByWithRelationInput[];
    cursor?: Prisma.document_typesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_typesScalarFieldEnum | Prisma.Document_typesScalarFieldEnum[];
};
export type document_typesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_typesSelect<ExtArgs> | null;
    omit?: Prisma.document_typesOmit<ExtArgs> | null;
    include?: Prisma.document_typesInclude<ExtArgs> | null;
    where?: Prisma.document_typesWhereInput;
    orderBy?: Prisma.document_typesOrderByWithRelationInput | Prisma.document_typesOrderByWithRelationInput[];
    cursor?: Prisma.document_typesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_typesScalarFieldEnum | Prisma.Document_typesScalarFieldEnum[];
};
export type document_typesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_typesSelect<ExtArgs> | null;
    omit?: Prisma.document_typesOmit<ExtArgs> | null;
    include?: Prisma.document_typesInclude<ExtArgs> | null;
    where?: Prisma.document_typesWhereInput;
    orderBy?: Prisma.document_typesOrderByWithRelationInput | Prisma.document_typesOrderByWithRelationInput[];
    cursor?: Prisma.document_typesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_typesScalarFieldEnum | Prisma.Document_typesScalarFieldEnum[];
};
export type document_typesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_typesSelect<ExtArgs> | null;
    omit?: Prisma.document_typesOmit<ExtArgs> | null;
    include?: Prisma.document_typesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_typesCreateInput, Prisma.document_typesUncheckedCreateInput>;
};
export type document_typesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.document_typesCreateManyInput | Prisma.document_typesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type document_typesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_typesSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.document_typesOmit<ExtArgs> | null;
    data: Prisma.document_typesCreateManyInput | Prisma.document_typesCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.document_typesIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type document_typesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_typesSelect<ExtArgs> | null;
    omit?: Prisma.document_typesOmit<ExtArgs> | null;
    include?: Prisma.document_typesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_typesUpdateInput, Prisma.document_typesUncheckedUpdateInput>;
    where: Prisma.document_typesWhereUniqueInput;
};
export type document_typesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.document_typesUpdateManyMutationInput, Prisma.document_typesUncheckedUpdateManyInput>;
    where?: Prisma.document_typesWhereInput;
    limit?: number;
};
export type document_typesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_typesSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.document_typesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_typesUpdateManyMutationInput, Prisma.document_typesUncheckedUpdateManyInput>;
    where?: Prisma.document_typesWhereInput;
    limit?: number;
    include?: Prisma.document_typesIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type document_typesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_typesSelect<ExtArgs> | null;
    omit?: Prisma.document_typesOmit<ExtArgs> | null;
    include?: Prisma.document_typesInclude<ExtArgs> | null;
    where: Prisma.document_typesWhereUniqueInput;
    create: Prisma.XOR<Prisma.document_typesCreateInput, Prisma.document_typesUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.document_typesUpdateInput, Prisma.document_typesUncheckedUpdateInput>;
};
export type document_typesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_typesSelect<ExtArgs> | null;
    omit?: Prisma.document_typesOmit<ExtArgs> | null;
    include?: Prisma.document_typesInclude<ExtArgs> | null;
    where: Prisma.document_typesWhereUniqueInput;
};
export type document_typesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_typesWhereInput;
    limit?: number;
};
export type document_types$document_sequencesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_sequencesSelect<ExtArgs> | null;
    omit?: Prisma.document_sequencesOmit<ExtArgs> | null;
    include?: Prisma.document_sequencesInclude<ExtArgs> | null;
    where?: Prisma.document_sequencesWhereInput;
};
export type document_types$documentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type document_typesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_typesSelect<ExtArgs> | null;
    omit?: Prisma.document_typesOmit<ExtArgs> | null;
    include?: Prisma.document_typesInclude<ExtArgs> | null;
};
