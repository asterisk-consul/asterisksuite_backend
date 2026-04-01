import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type taxesModel = runtime.Types.Result.DefaultSelection<Prisma.$taxesPayload>;
export type AggregateTaxes = {
    _count: TaxesCountAggregateOutputType | null;
    _avg: TaxesAvgAggregateOutputType | null;
    _sum: TaxesSumAggregateOutputType | null;
    _min: TaxesMinAggregateOutputType | null;
    _max: TaxesMaxAggregateOutputType | null;
};
export type TaxesAvgAggregateOutputType = {
    rate: runtime.Decimal | null;
};
export type TaxesSumAggregateOutputType = {
    rate: runtime.Decimal | null;
};
export type TaxesMinAggregateOutputType = {
    id: string | null;
    code: string | null;
    name: string | null;
    tax_type: string | null;
    rate: runtime.Decimal | null;
    is_percentage: boolean | null;
    active: boolean | null;
    created_at: Date | null;
    calculation_level: string | null;
};
export type TaxesMaxAggregateOutputType = {
    id: string | null;
    code: string | null;
    name: string | null;
    tax_type: string | null;
    rate: runtime.Decimal | null;
    is_percentage: boolean | null;
    active: boolean | null;
    created_at: Date | null;
    calculation_level: string | null;
};
export type TaxesCountAggregateOutputType = {
    id: number;
    code: number;
    name: number;
    tax_type: number;
    rate: number;
    is_percentage: number;
    active: number;
    created_at: number;
    calculation_level: number;
    _all: number;
};
export type TaxesAvgAggregateInputType = {
    rate?: true;
};
export type TaxesSumAggregateInputType = {
    rate?: true;
};
export type TaxesMinAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    tax_type?: true;
    rate?: true;
    is_percentage?: true;
    active?: true;
    created_at?: true;
    calculation_level?: true;
};
export type TaxesMaxAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    tax_type?: true;
    rate?: true;
    is_percentage?: true;
    active?: true;
    created_at?: true;
    calculation_level?: true;
};
export type TaxesCountAggregateInputType = {
    id?: true;
    code?: true;
    name?: true;
    tax_type?: true;
    rate?: true;
    is_percentage?: true;
    active?: true;
    created_at?: true;
    calculation_level?: true;
    _all?: true;
};
export type TaxesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.taxesWhereInput;
    orderBy?: Prisma.taxesOrderByWithRelationInput | Prisma.taxesOrderByWithRelationInput[];
    cursor?: Prisma.taxesWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TaxesCountAggregateInputType;
    _avg?: TaxesAvgAggregateInputType;
    _sum?: TaxesSumAggregateInputType;
    _min?: TaxesMinAggregateInputType;
    _max?: TaxesMaxAggregateInputType;
};
export type GetTaxesAggregateType<T extends TaxesAggregateArgs> = {
    [P in keyof T & keyof AggregateTaxes]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTaxes[P]> : Prisma.GetScalarType<T[P], AggregateTaxes[P]>;
};
export type taxesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.taxesWhereInput;
    orderBy?: Prisma.taxesOrderByWithAggregationInput | Prisma.taxesOrderByWithAggregationInput[];
    by: Prisma.TaxesScalarFieldEnum[] | Prisma.TaxesScalarFieldEnum;
    having?: Prisma.taxesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TaxesCountAggregateInputType | true;
    _avg?: TaxesAvgAggregateInputType;
    _sum?: TaxesSumAggregateInputType;
    _min?: TaxesMinAggregateInputType;
    _max?: TaxesMaxAggregateInputType;
};
export type TaxesGroupByOutputType = {
    id: string;
    code: string;
    name: string;
    tax_type: string;
    rate: runtime.Decimal;
    is_percentage: boolean;
    active: boolean;
    created_at: Date | null;
    calculation_level: string;
    _count: TaxesCountAggregateOutputType | null;
    _avg: TaxesAvgAggregateOutputType | null;
    _sum: TaxesSumAggregateOutputType | null;
    _min: TaxesMinAggregateOutputType | null;
    _max: TaxesMaxAggregateOutputType | null;
};
export type GetTaxesGroupByPayload<T extends taxesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TaxesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TaxesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TaxesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TaxesGroupByOutputType[P]>;
}>>;
export type taxesWhereInput = {
    AND?: Prisma.taxesWhereInput | Prisma.taxesWhereInput[];
    OR?: Prisma.taxesWhereInput[];
    NOT?: Prisma.taxesWhereInput | Prisma.taxesWhereInput[];
    id?: Prisma.UuidFilter<"taxes"> | string;
    code?: Prisma.StringFilter<"taxes"> | string;
    name?: Prisma.StringFilter<"taxes"> | string;
    tax_type?: Prisma.StringFilter<"taxes"> | string;
    rate?: Prisma.DecimalFilter<"taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: Prisma.BoolFilter<"taxes"> | boolean;
    active?: Prisma.BoolFilter<"taxes"> | boolean;
    created_at?: Prisma.DateTimeNullableFilter<"taxes"> | Date | string | null;
    calculation_level?: Prisma.StringFilter<"taxes"> | string;
    document_item_taxes?: Prisma.Document_item_taxesListRelationFilter;
    document_taxes?: Prisma.Document_taxesListRelationFilter;
    product_taxes?: Prisma.Product_taxesListRelationFilter;
};
export type taxesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_type?: Prisma.SortOrder;
    rate?: Prisma.SortOrder;
    is_percentage?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    calculation_level?: Prisma.SortOrder;
    document_item_taxes?: Prisma.document_item_taxesOrderByRelationAggregateInput;
    document_taxes?: Prisma.document_taxesOrderByRelationAggregateInput;
    product_taxes?: Prisma.product_taxesOrderByRelationAggregateInput;
};
export type taxesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.taxesWhereInput | Prisma.taxesWhereInput[];
    OR?: Prisma.taxesWhereInput[];
    NOT?: Prisma.taxesWhereInput | Prisma.taxesWhereInput[];
    code?: Prisma.StringFilter<"taxes"> | string;
    name?: Prisma.StringFilter<"taxes"> | string;
    tax_type?: Prisma.StringFilter<"taxes"> | string;
    rate?: Prisma.DecimalFilter<"taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: Prisma.BoolFilter<"taxes"> | boolean;
    active?: Prisma.BoolFilter<"taxes"> | boolean;
    created_at?: Prisma.DateTimeNullableFilter<"taxes"> | Date | string | null;
    calculation_level?: Prisma.StringFilter<"taxes"> | string;
    document_item_taxes?: Prisma.Document_item_taxesListRelationFilter;
    document_taxes?: Prisma.Document_taxesListRelationFilter;
    product_taxes?: Prisma.Product_taxesListRelationFilter;
}, "id">;
export type taxesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_type?: Prisma.SortOrder;
    rate?: Prisma.SortOrder;
    is_percentage?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    calculation_level?: Prisma.SortOrder;
    _count?: Prisma.taxesCountOrderByAggregateInput;
    _avg?: Prisma.taxesAvgOrderByAggregateInput;
    _max?: Prisma.taxesMaxOrderByAggregateInput;
    _min?: Prisma.taxesMinOrderByAggregateInput;
    _sum?: Prisma.taxesSumOrderByAggregateInput;
};
export type taxesScalarWhereWithAggregatesInput = {
    AND?: Prisma.taxesScalarWhereWithAggregatesInput | Prisma.taxesScalarWhereWithAggregatesInput[];
    OR?: Prisma.taxesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.taxesScalarWhereWithAggregatesInput | Prisma.taxesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"taxes"> | string;
    code?: Prisma.StringWithAggregatesFilter<"taxes"> | string;
    name?: Prisma.StringWithAggregatesFilter<"taxes"> | string;
    tax_type?: Prisma.StringWithAggregatesFilter<"taxes"> | string;
    rate?: Prisma.DecimalWithAggregatesFilter<"taxes"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: Prisma.BoolWithAggregatesFilter<"taxes"> | boolean;
    active?: Prisma.BoolWithAggregatesFilter<"taxes"> | boolean;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"taxes"> | Date | string | null;
    calculation_level?: Prisma.StringWithAggregatesFilter<"taxes"> | string;
};
export type taxesCreateInput = {
    id?: string;
    code: string;
    name: string;
    tax_type: string;
    rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: boolean;
    active?: boolean;
    created_at?: Date | string | null;
    calculation_level: string;
    document_item_taxes?: Prisma.document_item_taxesCreateNestedManyWithoutTaxesInput;
    document_taxes?: Prisma.document_taxesCreateNestedManyWithoutTaxesInput;
    product_taxes?: Prisma.product_taxesCreateNestedManyWithoutTaxesInput;
};
export type taxesUncheckedCreateInput = {
    id?: string;
    code: string;
    name: string;
    tax_type: string;
    rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: boolean;
    active?: boolean;
    created_at?: Date | string | null;
    calculation_level: string;
    document_item_taxes?: Prisma.document_item_taxesUncheckedCreateNestedManyWithoutTaxesInput;
    document_taxes?: Prisma.document_taxesUncheckedCreateNestedManyWithoutTaxesInput;
    product_taxes?: Prisma.product_taxesUncheckedCreateNestedManyWithoutTaxesInput;
};
export type taxesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_type?: Prisma.StringFieldUpdateOperationsInput | string;
    rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    calculation_level?: Prisma.StringFieldUpdateOperationsInput | string;
    document_item_taxes?: Prisma.document_item_taxesUpdateManyWithoutTaxesNestedInput;
    document_taxes?: Prisma.document_taxesUpdateManyWithoutTaxesNestedInput;
    product_taxes?: Prisma.product_taxesUpdateManyWithoutTaxesNestedInput;
};
export type taxesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_type?: Prisma.StringFieldUpdateOperationsInput | string;
    rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    calculation_level?: Prisma.StringFieldUpdateOperationsInput | string;
    document_item_taxes?: Prisma.document_item_taxesUncheckedUpdateManyWithoutTaxesNestedInput;
    document_taxes?: Prisma.document_taxesUncheckedUpdateManyWithoutTaxesNestedInput;
    product_taxes?: Prisma.product_taxesUncheckedUpdateManyWithoutTaxesNestedInput;
};
export type taxesCreateManyInput = {
    id?: string;
    code: string;
    name: string;
    tax_type: string;
    rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: boolean;
    active?: boolean;
    created_at?: Date | string | null;
    calculation_level: string;
};
export type taxesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_type?: Prisma.StringFieldUpdateOperationsInput | string;
    rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    calculation_level?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type taxesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_type?: Prisma.StringFieldUpdateOperationsInput | string;
    rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    calculation_level?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type TaxesScalarRelationFilter = {
    is?: Prisma.taxesWhereInput;
    isNot?: Prisma.taxesWhereInput;
};
export type taxesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_type?: Prisma.SortOrder;
    rate?: Prisma.SortOrder;
    is_percentage?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    calculation_level?: Prisma.SortOrder;
};
export type taxesAvgOrderByAggregateInput = {
    rate?: Prisma.SortOrder;
};
export type taxesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_type?: Prisma.SortOrder;
    rate?: Prisma.SortOrder;
    is_percentage?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    calculation_level?: Prisma.SortOrder;
};
export type taxesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    code?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_type?: Prisma.SortOrder;
    rate?: Prisma.SortOrder;
    is_percentage?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    calculation_level?: Prisma.SortOrder;
};
export type taxesSumOrderByAggregateInput = {
    rate?: Prisma.SortOrder;
};
export type taxesCreateNestedOneWithoutDocument_item_taxesInput = {
    create?: Prisma.XOR<Prisma.taxesCreateWithoutDocument_item_taxesInput, Prisma.taxesUncheckedCreateWithoutDocument_item_taxesInput>;
    connectOrCreate?: Prisma.taxesCreateOrConnectWithoutDocument_item_taxesInput;
    connect?: Prisma.taxesWhereUniqueInput;
};
export type taxesUpdateOneRequiredWithoutDocument_item_taxesNestedInput = {
    create?: Prisma.XOR<Prisma.taxesCreateWithoutDocument_item_taxesInput, Prisma.taxesUncheckedCreateWithoutDocument_item_taxesInput>;
    connectOrCreate?: Prisma.taxesCreateOrConnectWithoutDocument_item_taxesInput;
    upsert?: Prisma.taxesUpsertWithoutDocument_item_taxesInput;
    connect?: Prisma.taxesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.taxesUpdateToOneWithWhereWithoutDocument_item_taxesInput, Prisma.taxesUpdateWithoutDocument_item_taxesInput>, Prisma.taxesUncheckedUpdateWithoutDocument_item_taxesInput>;
};
export type taxesCreateNestedOneWithoutDocument_taxesInput = {
    create?: Prisma.XOR<Prisma.taxesCreateWithoutDocument_taxesInput, Prisma.taxesUncheckedCreateWithoutDocument_taxesInput>;
    connectOrCreate?: Prisma.taxesCreateOrConnectWithoutDocument_taxesInput;
    connect?: Prisma.taxesWhereUniqueInput;
};
export type taxesUpdateOneRequiredWithoutDocument_taxesNestedInput = {
    create?: Prisma.XOR<Prisma.taxesCreateWithoutDocument_taxesInput, Prisma.taxesUncheckedCreateWithoutDocument_taxesInput>;
    connectOrCreate?: Prisma.taxesCreateOrConnectWithoutDocument_taxesInput;
    upsert?: Prisma.taxesUpsertWithoutDocument_taxesInput;
    connect?: Prisma.taxesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.taxesUpdateToOneWithWhereWithoutDocument_taxesInput, Prisma.taxesUpdateWithoutDocument_taxesInput>, Prisma.taxesUncheckedUpdateWithoutDocument_taxesInput>;
};
export type taxesCreateNestedOneWithoutProduct_taxesInput = {
    create?: Prisma.XOR<Prisma.taxesCreateWithoutProduct_taxesInput, Prisma.taxesUncheckedCreateWithoutProduct_taxesInput>;
    connectOrCreate?: Prisma.taxesCreateOrConnectWithoutProduct_taxesInput;
    connect?: Prisma.taxesWhereUniqueInput;
};
export type taxesUpdateOneRequiredWithoutProduct_taxesNestedInput = {
    create?: Prisma.XOR<Prisma.taxesCreateWithoutProduct_taxesInput, Prisma.taxesUncheckedCreateWithoutProduct_taxesInput>;
    connectOrCreate?: Prisma.taxesCreateOrConnectWithoutProduct_taxesInput;
    upsert?: Prisma.taxesUpsertWithoutProduct_taxesInput;
    connect?: Prisma.taxesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.taxesUpdateToOneWithWhereWithoutProduct_taxesInput, Prisma.taxesUpdateWithoutProduct_taxesInput>, Prisma.taxesUncheckedUpdateWithoutProduct_taxesInput>;
};
export type taxesCreateWithoutDocument_item_taxesInput = {
    id?: string;
    code: string;
    name: string;
    tax_type: string;
    rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: boolean;
    active?: boolean;
    created_at?: Date | string | null;
    calculation_level: string;
    document_taxes?: Prisma.document_taxesCreateNestedManyWithoutTaxesInput;
    product_taxes?: Prisma.product_taxesCreateNestedManyWithoutTaxesInput;
};
export type taxesUncheckedCreateWithoutDocument_item_taxesInput = {
    id?: string;
    code: string;
    name: string;
    tax_type: string;
    rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: boolean;
    active?: boolean;
    created_at?: Date | string | null;
    calculation_level: string;
    document_taxes?: Prisma.document_taxesUncheckedCreateNestedManyWithoutTaxesInput;
    product_taxes?: Prisma.product_taxesUncheckedCreateNestedManyWithoutTaxesInput;
};
export type taxesCreateOrConnectWithoutDocument_item_taxesInput = {
    where: Prisma.taxesWhereUniqueInput;
    create: Prisma.XOR<Prisma.taxesCreateWithoutDocument_item_taxesInput, Prisma.taxesUncheckedCreateWithoutDocument_item_taxesInput>;
};
export type taxesUpsertWithoutDocument_item_taxesInput = {
    update: Prisma.XOR<Prisma.taxesUpdateWithoutDocument_item_taxesInput, Prisma.taxesUncheckedUpdateWithoutDocument_item_taxesInput>;
    create: Prisma.XOR<Prisma.taxesCreateWithoutDocument_item_taxesInput, Prisma.taxesUncheckedCreateWithoutDocument_item_taxesInput>;
    where?: Prisma.taxesWhereInput;
};
export type taxesUpdateToOneWithWhereWithoutDocument_item_taxesInput = {
    where?: Prisma.taxesWhereInput;
    data: Prisma.XOR<Prisma.taxesUpdateWithoutDocument_item_taxesInput, Prisma.taxesUncheckedUpdateWithoutDocument_item_taxesInput>;
};
export type taxesUpdateWithoutDocument_item_taxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_type?: Prisma.StringFieldUpdateOperationsInput | string;
    rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    calculation_level?: Prisma.StringFieldUpdateOperationsInput | string;
    document_taxes?: Prisma.document_taxesUpdateManyWithoutTaxesNestedInput;
    product_taxes?: Prisma.product_taxesUpdateManyWithoutTaxesNestedInput;
};
export type taxesUncheckedUpdateWithoutDocument_item_taxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_type?: Prisma.StringFieldUpdateOperationsInput | string;
    rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    calculation_level?: Prisma.StringFieldUpdateOperationsInput | string;
    document_taxes?: Prisma.document_taxesUncheckedUpdateManyWithoutTaxesNestedInput;
    product_taxes?: Prisma.product_taxesUncheckedUpdateManyWithoutTaxesNestedInput;
};
export type taxesCreateWithoutDocument_taxesInput = {
    id?: string;
    code: string;
    name: string;
    tax_type: string;
    rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: boolean;
    active?: boolean;
    created_at?: Date | string | null;
    calculation_level: string;
    document_item_taxes?: Prisma.document_item_taxesCreateNestedManyWithoutTaxesInput;
    product_taxes?: Prisma.product_taxesCreateNestedManyWithoutTaxesInput;
};
export type taxesUncheckedCreateWithoutDocument_taxesInput = {
    id?: string;
    code: string;
    name: string;
    tax_type: string;
    rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: boolean;
    active?: boolean;
    created_at?: Date | string | null;
    calculation_level: string;
    document_item_taxes?: Prisma.document_item_taxesUncheckedCreateNestedManyWithoutTaxesInput;
    product_taxes?: Prisma.product_taxesUncheckedCreateNestedManyWithoutTaxesInput;
};
export type taxesCreateOrConnectWithoutDocument_taxesInput = {
    where: Prisma.taxesWhereUniqueInput;
    create: Prisma.XOR<Prisma.taxesCreateWithoutDocument_taxesInput, Prisma.taxesUncheckedCreateWithoutDocument_taxesInput>;
};
export type taxesUpsertWithoutDocument_taxesInput = {
    update: Prisma.XOR<Prisma.taxesUpdateWithoutDocument_taxesInput, Prisma.taxesUncheckedUpdateWithoutDocument_taxesInput>;
    create: Prisma.XOR<Prisma.taxesCreateWithoutDocument_taxesInput, Prisma.taxesUncheckedCreateWithoutDocument_taxesInput>;
    where?: Prisma.taxesWhereInput;
};
export type taxesUpdateToOneWithWhereWithoutDocument_taxesInput = {
    where?: Prisma.taxesWhereInput;
    data: Prisma.XOR<Prisma.taxesUpdateWithoutDocument_taxesInput, Prisma.taxesUncheckedUpdateWithoutDocument_taxesInput>;
};
export type taxesUpdateWithoutDocument_taxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_type?: Prisma.StringFieldUpdateOperationsInput | string;
    rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    calculation_level?: Prisma.StringFieldUpdateOperationsInput | string;
    document_item_taxes?: Prisma.document_item_taxesUpdateManyWithoutTaxesNestedInput;
    product_taxes?: Prisma.product_taxesUpdateManyWithoutTaxesNestedInput;
};
export type taxesUncheckedUpdateWithoutDocument_taxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_type?: Prisma.StringFieldUpdateOperationsInput | string;
    rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    calculation_level?: Prisma.StringFieldUpdateOperationsInput | string;
    document_item_taxes?: Prisma.document_item_taxesUncheckedUpdateManyWithoutTaxesNestedInput;
    product_taxes?: Prisma.product_taxesUncheckedUpdateManyWithoutTaxesNestedInput;
};
export type taxesCreateWithoutProduct_taxesInput = {
    id?: string;
    code: string;
    name: string;
    tax_type: string;
    rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: boolean;
    active?: boolean;
    created_at?: Date | string | null;
    calculation_level: string;
    document_item_taxes?: Prisma.document_item_taxesCreateNestedManyWithoutTaxesInput;
    document_taxes?: Prisma.document_taxesCreateNestedManyWithoutTaxesInput;
};
export type taxesUncheckedCreateWithoutProduct_taxesInput = {
    id?: string;
    code: string;
    name: string;
    tax_type: string;
    rate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: boolean;
    active?: boolean;
    created_at?: Date | string | null;
    calculation_level: string;
    document_item_taxes?: Prisma.document_item_taxesUncheckedCreateNestedManyWithoutTaxesInput;
    document_taxes?: Prisma.document_taxesUncheckedCreateNestedManyWithoutTaxesInput;
};
export type taxesCreateOrConnectWithoutProduct_taxesInput = {
    where: Prisma.taxesWhereUniqueInput;
    create: Prisma.XOR<Prisma.taxesCreateWithoutProduct_taxesInput, Prisma.taxesUncheckedCreateWithoutProduct_taxesInput>;
};
export type taxesUpsertWithoutProduct_taxesInput = {
    update: Prisma.XOR<Prisma.taxesUpdateWithoutProduct_taxesInput, Prisma.taxesUncheckedUpdateWithoutProduct_taxesInput>;
    create: Prisma.XOR<Prisma.taxesCreateWithoutProduct_taxesInput, Prisma.taxesUncheckedCreateWithoutProduct_taxesInput>;
    where?: Prisma.taxesWhereInput;
};
export type taxesUpdateToOneWithWhereWithoutProduct_taxesInput = {
    where?: Prisma.taxesWhereInput;
    data: Prisma.XOR<Prisma.taxesUpdateWithoutProduct_taxesInput, Prisma.taxesUncheckedUpdateWithoutProduct_taxesInput>;
};
export type taxesUpdateWithoutProduct_taxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_type?: Prisma.StringFieldUpdateOperationsInput | string;
    rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    calculation_level?: Prisma.StringFieldUpdateOperationsInput | string;
    document_item_taxes?: Prisma.document_item_taxesUpdateManyWithoutTaxesNestedInput;
    document_taxes?: Prisma.document_taxesUpdateManyWithoutTaxesNestedInput;
};
export type taxesUncheckedUpdateWithoutProduct_taxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    code?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_type?: Prisma.StringFieldUpdateOperationsInput | string;
    rate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    is_percentage?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    calculation_level?: Prisma.StringFieldUpdateOperationsInput | string;
    document_item_taxes?: Prisma.document_item_taxesUncheckedUpdateManyWithoutTaxesNestedInput;
    document_taxes?: Prisma.document_taxesUncheckedUpdateManyWithoutTaxesNestedInput;
};
export type TaxesCountOutputType = {
    document_item_taxes: number;
    document_taxes: number;
    product_taxes: number;
};
export type TaxesCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_item_taxes?: boolean | TaxesCountOutputTypeCountDocument_item_taxesArgs;
    document_taxes?: boolean | TaxesCountOutputTypeCountDocument_taxesArgs;
    product_taxes?: boolean | TaxesCountOutputTypeCountProduct_taxesArgs;
};
export type TaxesCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TaxesCountOutputTypeSelect<ExtArgs> | null;
};
export type TaxesCountOutputTypeCountDocument_item_taxesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_item_taxesWhereInput;
};
export type TaxesCountOutputTypeCountDocument_taxesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_taxesWhereInput;
};
export type TaxesCountOutputTypeCountProduct_taxesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.product_taxesWhereInput;
};
export type taxesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    tax_type?: boolean;
    rate?: boolean;
    is_percentage?: boolean;
    active?: boolean;
    created_at?: boolean;
    calculation_level?: boolean;
    document_item_taxes?: boolean | Prisma.taxes$document_item_taxesArgs<ExtArgs>;
    document_taxes?: boolean | Prisma.taxes$document_taxesArgs<ExtArgs>;
    product_taxes?: boolean | Prisma.taxes$product_taxesArgs<ExtArgs>;
    _count?: boolean | Prisma.TaxesCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["taxes"]>;
export type taxesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    tax_type?: boolean;
    rate?: boolean;
    is_percentage?: boolean;
    active?: boolean;
    created_at?: boolean;
    calculation_level?: boolean;
}, ExtArgs["result"]["taxes"]>;
export type taxesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    code?: boolean;
    name?: boolean;
    tax_type?: boolean;
    rate?: boolean;
    is_percentage?: boolean;
    active?: boolean;
    created_at?: boolean;
    calculation_level?: boolean;
}, ExtArgs["result"]["taxes"]>;
export type taxesSelectScalar = {
    id?: boolean;
    code?: boolean;
    name?: boolean;
    tax_type?: boolean;
    rate?: boolean;
    is_percentage?: boolean;
    active?: boolean;
    created_at?: boolean;
    calculation_level?: boolean;
};
export type taxesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "code" | "name" | "tax_type" | "rate" | "is_percentage" | "active" | "created_at" | "calculation_level", ExtArgs["result"]["taxes"]>;
export type taxesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_item_taxes?: boolean | Prisma.taxes$document_item_taxesArgs<ExtArgs>;
    document_taxes?: boolean | Prisma.taxes$document_taxesArgs<ExtArgs>;
    product_taxes?: boolean | Prisma.taxes$product_taxesArgs<ExtArgs>;
    _count?: boolean | Prisma.TaxesCountOutputTypeDefaultArgs<ExtArgs>;
};
export type taxesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type taxesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $taxesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "taxes";
    objects: {
        document_item_taxes: Prisma.$document_item_taxesPayload<ExtArgs>[];
        document_taxes: Prisma.$document_taxesPayload<ExtArgs>[];
        product_taxes: Prisma.$product_taxesPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        code: string;
        name: string;
        tax_type: string;
        rate: runtime.Decimal;
        is_percentage: boolean;
        active: boolean;
        created_at: Date | null;
        calculation_level: string;
    }, ExtArgs["result"]["taxes"]>;
    composites: {};
};
export type taxesGetPayload<S extends boolean | null | undefined | taxesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$taxesPayload, S>;
export type taxesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<taxesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TaxesCountAggregateInputType | true;
};
export interface taxesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['taxes'];
        meta: {
            name: 'taxes';
        };
    };
    findUnique<T extends taxesFindUniqueArgs>(args: Prisma.SelectSubset<T, taxesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__taxesClient<runtime.Types.Result.GetResult<Prisma.$taxesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends taxesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, taxesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__taxesClient<runtime.Types.Result.GetResult<Prisma.$taxesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends taxesFindFirstArgs>(args?: Prisma.SelectSubset<T, taxesFindFirstArgs<ExtArgs>>): Prisma.Prisma__taxesClient<runtime.Types.Result.GetResult<Prisma.$taxesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends taxesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, taxesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__taxesClient<runtime.Types.Result.GetResult<Prisma.$taxesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends taxesFindManyArgs>(args?: Prisma.SelectSubset<T, taxesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$taxesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends taxesCreateArgs>(args: Prisma.SelectSubset<T, taxesCreateArgs<ExtArgs>>): Prisma.Prisma__taxesClient<runtime.Types.Result.GetResult<Prisma.$taxesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends taxesCreateManyArgs>(args?: Prisma.SelectSubset<T, taxesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends taxesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, taxesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$taxesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends taxesDeleteArgs>(args: Prisma.SelectSubset<T, taxesDeleteArgs<ExtArgs>>): Prisma.Prisma__taxesClient<runtime.Types.Result.GetResult<Prisma.$taxesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends taxesUpdateArgs>(args: Prisma.SelectSubset<T, taxesUpdateArgs<ExtArgs>>): Prisma.Prisma__taxesClient<runtime.Types.Result.GetResult<Prisma.$taxesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends taxesDeleteManyArgs>(args?: Prisma.SelectSubset<T, taxesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends taxesUpdateManyArgs>(args: Prisma.SelectSubset<T, taxesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends taxesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, taxesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$taxesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends taxesUpsertArgs>(args: Prisma.SelectSubset<T, taxesUpsertArgs<ExtArgs>>): Prisma.Prisma__taxesClient<runtime.Types.Result.GetResult<Prisma.$taxesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends taxesCountArgs>(args?: Prisma.Subset<T, taxesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TaxesCountAggregateOutputType> : number>;
    aggregate<T extends TaxesAggregateArgs>(args: Prisma.Subset<T, TaxesAggregateArgs>): Prisma.PrismaPromise<GetTaxesAggregateType<T>>;
    groupBy<T extends taxesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: taxesGroupByArgs['orderBy'];
    } : {
        orderBy?: taxesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, taxesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaxesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: taxesFieldRefs;
}
export interface Prisma__taxesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    document_item_taxes<T extends Prisma.taxes$document_item_taxesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.taxes$document_item_taxesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_item_taxesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    document_taxes<T extends Prisma.taxes$document_taxesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.taxes$document_taxesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_taxesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    product_taxes<T extends Prisma.taxes$product_taxesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.taxes$product_taxesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$product_taxesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface taxesFieldRefs {
    readonly id: Prisma.FieldRef<"taxes", 'String'>;
    readonly code: Prisma.FieldRef<"taxes", 'String'>;
    readonly name: Prisma.FieldRef<"taxes", 'String'>;
    readonly tax_type: Prisma.FieldRef<"taxes", 'String'>;
    readonly rate: Prisma.FieldRef<"taxes", 'Decimal'>;
    readonly is_percentage: Prisma.FieldRef<"taxes", 'Boolean'>;
    readonly active: Prisma.FieldRef<"taxes", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"taxes", 'DateTime'>;
    readonly calculation_level: Prisma.FieldRef<"taxes", 'String'>;
}
export type taxesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.taxesSelect<ExtArgs> | null;
    omit?: Prisma.taxesOmit<ExtArgs> | null;
    include?: Prisma.taxesInclude<ExtArgs> | null;
    where: Prisma.taxesWhereUniqueInput;
};
export type taxesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.taxesSelect<ExtArgs> | null;
    omit?: Prisma.taxesOmit<ExtArgs> | null;
    include?: Prisma.taxesInclude<ExtArgs> | null;
    where: Prisma.taxesWhereUniqueInput;
};
export type taxesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.taxesSelect<ExtArgs> | null;
    omit?: Prisma.taxesOmit<ExtArgs> | null;
    include?: Prisma.taxesInclude<ExtArgs> | null;
    where?: Prisma.taxesWhereInput;
    orderBy?: Prisma.taxesOrderByWithRelationInput | Prisma.taxesOrderByWithRelationInput[];
    cursor?: Prisma.taxesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaxesScalarFieldEnum | Prisma.TaxesScalarFieldEnum[];
};
export type taxesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.taxesSelect<ExtArgs> | null;
    omit?: Prisma.taxesOmit<ExtArgs> | null;
    include?: Prisma.taxesInclude<ExtArgs> | null;
    where?: Prisma.taxesWhereInput;
    orderBy?: Prisma.taxesOrderByWithRelationInput | Prisma.taxesOrderByWithRelationInput[];
    cursor?: Prisma.taxesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaxesScalarFieldEnum | Prisma.TaxesScalarFieldEnum[];
};
export type taxesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.taxesSelect<ExtArgs> | null;
    omit?: Prisma.taxesOmit<ExtArgs> | null;
    include?: Prisma.taxesInclude<ExtArgs> | null;
    where?: Prisma.taxesWhereInput;
    orderBy?: Prisma.taxesOrderByWithRelationInput | Prisma.taxesOrderByWithRelationInput[];
    cursor?: Prisma.taxesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TaxesScalarFieldEnum | Prisma.TaxesScalarFieldEnum[];
};
export type taxesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.taxesSelect<ExtArgs> | null;
    omit?: Prisma.taxesOmit<ExtArgs> | null;
    include?: Prisma.taxesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.taxesCreateInput, Prisma.taxesUncheckedCreateInput>;
};
export type taxesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.taxesCreateManyInput | Prisma.taxesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type taxesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.taxesSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.taxesOmit<ExtArgs> | null;
    data: Prisma.taxesCreateManyInput | Prisma.taxesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type taxesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.taxesSelect<ExtArgs> | null;
    omit?: Prisma.taxesOmit<ExtArgs> | null;
    include?: Prisma.taxesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.taxesUpdateInput, Prisma.taxesUncheckedUpdateInput>;
    where: Prisma.taxesWhereUniqueInput;
};
export type taxesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.taxesUpdateManyMutationInput, Prisma.taxesUncheckedUpdateManyInput>;
    where?: Prisma.taxesWhereInput;
    limit?: number;
};
export type taxesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.taxesSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.taxesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.taxesUpdateManyMutationInput, Prisma.taxesUncheckedUpdateManyInput>;
    where?: Prisma.taxesWhereInput;
    limit?: number;
};
export type taxesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.taxesSelect<ExtArgs> | null;
    omit?: Prisma.taxesOmit<ExtArgs> | null;
    include?: Prisma.taxesInclude<ExtArgs> | null;
    where: Prisma.taxesWhereUniqueInput;
    create: Prisma.XOR<Prisma.taxesCreateInput, Prisma.taxesUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.taxesUpdateInput, Prisma.taxesUncheckedUpdateInput>;
};
export type taxesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.taxesSelect<ExtArgs> | null;
    omit?: Prisma.taxesOmit<ExtArgs> | null;
    include?: Prisma.taxesInclude<ExtArgs> | null;
    where: Prisma.taxesWhereUniqueInput;
};
export type taxesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.taxesWhereInput;
    limit?: number;
};
export type taxes$document_item_taxesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type taxes$document_taxesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type taxes$product_taxesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.product_taxesSelect<ExtArgs> | null;
    omit?: Prisma.product_taxesOmit<ExtArgs> | null;
    include?: Prisma.product_taxesInclude<ExtArgs> | null;
    where?: Prisma.product_taxesWhereInput;
    orderBy?: Prisma.product_taxesOrderByWithRelationInput | Prisma.product_taxesOrderByWithRelationInput[];
    cursor?: Prisma.product_taxesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Product_taxesScalarFieldEnum | Prisma.Product_taxesScalarFieldEnum[];
};
export type taxesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.taxesSelect<ExtArgs> | null;
    omit?: Prisma.taxesOmit<ExtArgs> | null;
    include?: Prisma.taxesInclude<ExtArgs> | null;
};
