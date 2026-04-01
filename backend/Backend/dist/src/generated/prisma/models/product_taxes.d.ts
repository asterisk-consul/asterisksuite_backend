import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type product_taxesModel = runtime.Types.Result.DefaultSelection<Prisma.$product_taxesPayload>;
export type AggregateProduct_taxes = {
    _count: Product_taxesCountAggregateOutputType | null;
    _min: Product_taxesMinAggregateOutputType | null;
    _max: Product_taxesMaxAggregateOutputType | null;
};
export type Product_taxesMinAggregateOutputType = {
    id: string | null;
    product_id: string | null;
    tax_id: string | null;
    is_included_in_price: boolean | null;
    active: boolean | null;
    created_at: Date | null;
};
export type Product_taxesMaxAggregateOutputType = {
    id: string | null;
    product_id: string | null;
    tax_id: string | null;
    is_included_in_price: boolean | null;
    active: boolean | null;
    created_at: Date | null;
};
export type Product_taxesCountAggregateOutputType = {
    id: number;
    product_id: number;
    tax_id: number;
    is_included_in_price: number;
    active: number;
    created_at: number;
    _all: number;
};
export type Product_taxesMinAggregateInputType = {
    id?: true;
    product_id?: true;
    tax_id?: true;
    is_included_in_price?: true;
    active?: true;
    created_at?: true;
};
export type Product_taxesMaxAggregateInputType = {
    id?: true;
    product_id?: true;
    tax_id?: true;
    is_included_in_price?: true;
    active?: true;
    created_at?: true;
};
export type Product_taxesCountAggregateInputType = {
    id?: true;
    product_id?: true;
    tax_id?: true;
    is_included_in_price?: true;
    active?: true;
    created_at?: true;
    _all?: true;
};
export type Product_taxesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.product_taxesWhereInput;
    orderBy?: Prisma.product_taxesOrderByWithRelationInput | Prisma.product_taxesOrderByWithRelationInput[];
    cursor?: Prisma.product_taxesWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Product_taxesCountAggregateInputType;
    _min?: Product_taxesMinAggregateInputType;
    _max?: Product_taxesMaxAggregateInputType;
};
export type GetProduct_taxesAggregateType<T extends Product_taxesAggregateArgs> = {
    [P in keyof T & keyof AggregateProduct_taxes]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProduct_taxes[P]> : Prisma.GetScalarType<T[P], AggregateProduct_taxes[P]>;
};
export type product_taxesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.product_taxesWhereInput;
    orderBy?: Prisma.product_taxesOrderByWithAggregationInput | Prisma.product_taxesOrderByWithAggregationInput[];
    by: Prisma.Product_taxesScalarFieldEnum[] | Prisma.Product_taxesScalarFieldEnum;
    having?: Prisma.product_taxesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Product_taxesCountAggregateInputType | true;
    _min?: Product_taxesMinAggregateInputType;
    _max?: Product_taxesMaxAggregateInputType;
};
export type Product_taxesGroupByOutputType = {
    id: string;
    product_id: string;
    tax_id: string;
    is_included_in_price: boolean;
    active: boolean;
    created_at: Date;
    _count: Product_taxesCountAggregateOutputType | null;
    _min: Product_taxesMinAggregateOutputType | null;
    _max: Product_taxesMaxAggregateOutputType | null;
};
export type GetProduct_taxesGroupByPayload<T extends product_taxesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Product_taxesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Product_taxesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Product_taxesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Product_taxesGroupByOutputType[P]>;
}>>;
export type product_taxesWhereInput = {
    AND?: Prisma.product_taxesWhereInput | Prisma.product_taxesWhereInput[];
    OR?: Prisma.product_taxesWhereInput[];
    NOT?: Prisma.product_taxesWhereInput | Prisma.product_taxesWhereInput[];
    id?: Prisma.UuidFilter<"product_taxes"> | string;
    product_id?: Prisma.UuidFilter<"product_taxes"> | string;
    tax_id?: Prisma.UuidFilter<"product_taxes"> | string;
    is_included_in_price?: Prisma.BoolFilter<"product_taxes"> | boolean;
    active?: Prisma.BoolFilter<"product_taxes"> | boolean;
    created_at?: Prisma.DateTimeFilter<"product_taxes"> | Date | string;
    products?: Prisma.XOR<Prisma.ProductsScalarRelationFilter, Prisma.productsWhereInput>;
    taxes?: Prisma.XOR<Prisma.TaxesScalarRelationFilter, Prisma.taxesWhereInput>;
};
export type product_taxesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    is_included_in_price?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    products?: Prisma.productsOrderByWithRelationInput;
    taxes?: Prisma.taxesOrderByWithRelationInput;
};
export type product_taxesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    product_id_tax_id?: Prisma.product_taxesProduct_idTax_idCompoundUniqueInput;
    AND?: Prisma.product_taxesWhereInput | Prisma.product_taxesWhereInput[];
    OR?: Prisma.product_taxesWhereInput[];
    NOT?: Prisma.product_taxesWhereInput | Prisma.product_taxesWhereInput[];
    product_id?: Prisma.UuidFilter<"product_taxes"> | string;
    tax_id?: Prisma.UuidFilter<"product_taxes"> | string;
    is_included_in_price?: Prisma.BoolFilter<"product_taxes"> | boolean;
    active?: Prisma.BoolFilter<"product_taxes"> | boolean;
    created_at?: Prisma.DateTimeFilter<"product_taxes"> | Date | string;
    products?: Prisma.XOR<Prisma.ProductsScalarRelationFilter, Prisma.productsWhereInput>;
    taxes?: Prisma.XOR<Prisma.TaxesScalarRelationFilter, Prisma.taxesWhereInput>;
}, "id" | "product_id_tax_id">;
export type product_taxesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    is_included_in_price?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.product_taxesCountOrderByAggregateInput;
    _max?: Prisma.product_taxesMaxOrderByAggregateInput;
    _min?: Prisma.product_taxesMinOrderByAggregateInput;
};
export type product_taxesScalarWhereWithAggregatesInput = {
    AND?: Prisma.product_taxesScalarWhereWithAggregatesInput | Prisma.product_taxesScalarWhereWithAggregatesInput[];
    OR?: Prisma.product_taxesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.product_taxesScalarWhereWithAggregatesInput | Prisma.product_taxesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"product_taxes"> | string;
    product_id?: Prisma.UuidWithAggregatesFilter<"product_taxes"> | string;
    tax_id?: Prisma.UuidWithAggregatesFilter<"product_taxes"> | string;
    is_included_in_price?: Prisma.BoolWithAggregatesFilter<"product_taxes"> | boolean;
    active?: Prisma.BoolWithAggregatesFilter<"product_taxes"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"product_taxes"> | Date | string;
};
export type product_taxesCreateInput = {
    id?: string;
    is_included_in_price?: boolean;
    active?: boolean;
    created_at?: Date | string;
    products: Prisma.productsCreateNestedOneWithoutProduct_taxesInput;
    taxes: Prisma.taxesCreateNestedOneWithoutProduct_taxesInput;
};
export type product_taxesUncheckedCreateInput = {
    id?: string;
    product_id: string;
    tax_id: string;
    is_included_in_price?: boolean;
    active?: boolean;
    created_at?: Date | string;
};
export type product_taxesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_included_in_price?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    products?: Prisma.productsUpdateOneRequiredWithoutProduct_taxesNestedInput;
    taxes?: Prisma.taxesUpdateOneRequiredWithoutProduct_taxesNestedInput;
};
export type product_taxesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_included_in_price?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type product_taxesCreateManyInput = {
    id?: string;
    product_id: string;
    tax_id: string;
    is_included_in_price?: boolean;
    active?: boolean;
    created_at?: Date | string;
};
export type product_taxesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_included_in_price?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type product_taxesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_included_in_price?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type Product_taxesListRelationFilter = {
    every?: Prisma.product_taxesWhereInput;
    some?: Prisma.product_taxesWhereInput;
    none?: Prisma.product_taxesWhereInput;
};
export type product_taxesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type product_taxesProduct_idTax_idCompoundUniqueInput = {
    product_id: string;
    tax_id: string;
};
export type product_taxesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    is_included_in_price?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type product_taxesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    is_included_in_price?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type product_taxesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    is_included_in_price?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type product_taxesCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.product_taxesCreateWithoutProductsInput, Prisma.product_taxesUncheckedCreateWithoutProductsInput> | Prisma.product_taxesCreateWithoutProductsInput[] | Prisma.product_taxesUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.product_taxesCreateOrConnectWithoutProductsInput | Prisma.product_taxesCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.product_taxesCreateManyProductsInputEnvelope;
    connect?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
};
export type product_taxesUncheckedCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.product_taxesCreateWithoutProductsInput, Prisma.product_taxesUncheckedCreateWithoutProductsInput> | Prisma.product_taxesCreateWithoutProductsInput[] | Prisma.product_taxesUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.product_taxesCreateOrConnectWithoutProductsInput | Prisma.product_taxesCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.product_taxesCreateManyProductsInputEnvelope;
    connect?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
};
export type product_taxesUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.product_taxesCreateWithoutProductsInput, Prisma.product_taxesUncheckedCreateWithoutProductsInput> | Prisma.product_taxesCreateWithoutProductsInput[] | Prisma.product_taxesUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.product_taxesCreateOrConnectWithoutProductsInput | Prisma.product_taxesCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.product_taxesUpsertWithWhereUniqueWithoutProductsInput | Prisma.product_taxesUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.product_taxesCreateManyProductsInputEnvelope;
    set?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    disconnect?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    delete?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    connect?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    update?: Prisma.product_taxesUpdateWithWhereUniqueWithoutProductsInput | Prisma.product_taxesUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.product_taxesUpdateManyWithWhereWithoutProductsInput | Prisma.product_taxesUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.product_taxesScalarWhereInput | Prisma.product_taxesScalarWhereInput[];
};
export type product_taxesUncheckedUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.product_taxesCreateWithoutProductsInput, Prisma.product_taxesUncheckedCreateWithoutProductsInput> | Prisma.product_taxesCreateWithoutProductsInput[] | Prisma.product_taxesUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.product_taxesCreateOrConnectWithoutProductsInput | Prisma.product_taxesCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.product_taxesUpsertWithWhereUniqueWithoutProductsInput | Prisma.product_taxesUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.product_taxesCreateManyProductsInputEnvelope;
    set?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    disconnect?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    delete?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    connect?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    update?: Prisma.product_taxesUpdateWithWhereUniqueWithoutProductsInput | Prisma.product_taxesUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.product_taxesUpdateManyWithWhereWithoutProductsInput | Prisma.product_taxesUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.product_taxesScalarWhereInput | Prisma.product_taxesScalarWhereInput[];
};
export type product_taxesCreateNestedManyWithoutTaxesInput = {
    create?: Prisma.XOR<Prisma.product_taxesCreateWithoutTaxesInput, Prisma.product_taxesUncheckedCreateWithoutTaxesInput> | Prisma.product_taxesCreateWithoutTaxesInput[] | Prisma.product_taxesUncheckedCreateWithoutTaxesInput[];
    connectOrCreate?: Prisma.product_taxesCreateOrConnectWithoutTaxesInput | Prisma.product_taxesCreateOrConnectWithoutTaxesInput[];
    createMany?: Prisma.product_taxesCreateManyTaxesInputEnvelope;
    connect?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
};
export type product_taxesUncheckedCreateNestedManyWithoutTaxesInput = {
    create?: Prisma.XOR<Prisma.product_taxesCreateWithoutTaxesInput, Prisma.product_taxesUncheckedCreateWithoutTaxesInput> | Prisma.product_taxesCreateWithoutTaxesInput[] | Prisma.product_taxesUncheckedCreateWithoutTaxesInput[];
    connectOrCreate?: Prisma.product_taxesCreateOrConnectWithoutTaxesInput | Prisma.product_taxesCreateOrConnectWithoutTaxesInput[];
    createMany?: Prisma.product_taxesCreateManyTaxesInputEnvelope;
    connect?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
};
export type product_taxesUpdateManyWithoutTaxesNestedInput = {
    create?: Prisma.XOR<Prisma.product_taxesCreateWithoutTaxesInput, Prisma.product_taxesUncheckedCreateWithoutTaxesInput> | Prisma.product_taxesCreateWithoutTaxesInput[] | Prisma.product_taxesUncheckedCreateWithoutTaxesInput[];
    connectOrCreate?: Prisma.product_taxesCreateOrConnectWithoutTaxesInput | Prisma.product_taxesCreateOrConnectWithoutTaxesInput[];
    upsert?: Prisma.product_taxesUpsertWithWhereUniqueWithoutTaxesInput | Prisma.product_taxesUpsertWithWhereUniqueWithoutTaxesInput[];
    createMany?: Prisma.product_taxesCreateManyTaxesInputEnvelope;
    set?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    disconnect?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    delete?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    connect?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    update?: Prisma.product_taxesUpdateWithWhereUniqueWithoutTaxesInput | Prisma.product_taxesUpdateWithWhereUniqueWithoutTaxesInput[];
    updateMany?: Prisma.product_taxesUpdateManyWithWhereWithoutTaxesInput | Prisma.product_taxesUpdateManyWithWhereWithoutTaxesInput[];
    deleteMany?: Prisma.product_taxesScalarWhereInput | Prisma.product_taxesScalarWhereInput[];
};
export type product_taxesUncheckedUpdateManyWithoutTaxesNestedInput = {
    create?: Prisma.XOR<Prisma.product_taxesCreateWithoutTaxesInput, Prisma.product_taxesUncheckedCreateWithoutTaxesInput> | Prisma.product_taxesCreateWithoutTaxesInput[] | Prisma.product_taxesUncheckedCreateWithoutTaxesInput[];
    connectOrCreate?: Prisma.product_taxesCreateOrConnectWithoutTaxesInput | Prisma.product_taxesCreateOrConnectWithoutTaxesInput[];
    upsert?: Prisma.product_taxesUpsertWithWhereUniqueWithoutTaxesInput | Prisma.product_taxesUpsertWithWhereUniqueWithoutTaxesInput[];
    createMany?: Prisma.product_taxesCreateManyTaxesInputEnvelope;
    set?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    disconnect?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    delete?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    connect?: Prisma.product_taxesWhereUniqueInput | Prisma.product_taxesWhereUniqueInput[];
    update?: Prisma.product_taxesUpdateWithWhereUniqueWithoutTaxesInput | Prisma.product_taxesUpdateWithWhereUniqueWithoutTaxesInput[];
    updateMany?: Prisma.product_taxesUpdateManyWithWhereWithoutTaxesInput | Prisma.product_taxesUpdateManyWithWhereWithoutTaxesInput[];
    deleteMany?: Prisma.product_taxesScalarWhereInput | Prisma.product_taxesScalarWhereInput[];
};
export type product_taxesCreateWithoutProductsInput = {
    id?: string;
    is_included_in_price?: boolean;
    active?: boolean;
    created_at?: Date | string;
    taxes: Prisma.taxesCreateNestedOneWithoutProduct_taxesInput;
};
export type product_taxesUncheckedCreateWithoutProductsInput = {
    id?: string;
    tax_id: string;
    is_included_in_price?: boolean;
    active?: boolean;
    created_at?: Date | string;
};
export type product_taxesCreateOrConnectWithoutProductsInput = {
    where: Prisma.product_taxesWhereUniqueInput;
    create: Prisma.XOR<Prisma.product_taxesCreateWithoutProductsInput, Prisma.product_taxesUncheckedCreateWithoutProductsInput>;
};
export type product_taxesCreateManyProductsInputEnvelope = {
    data: Prisma.product_taxesCreateManyProductsInput | Prisma.product_taxesCreateManyProductsInput[];
    skipDuplicates?: boolean;
};
export type product_taxesUpsertWithWhereUniqueWithoutProductsInput = {
    where: Prisma.product_taxesWhereUniqueInput;
    update: Prisma.XOR<Prisma.product_taxesUpdateWithoutProductsInput, Prisma.product_taxesUncheckedUpdateWithoutProductsInput>;
    create: Prisma.XOR<Prisma.product_taxesCreateWithoutProductsInput, Prisma.product_taxesUncheckedCreateWithoutProductsInput>;
};
export type product_taxesUpdateWithWhereUniqueWithoutProductsInput = {
    where: Prisma.product_taxesWhereUniqueInput;
    data: Prisma.XOR<Prisma.product_taxesUpdateWithoutProductsInput, Prisma.product_taxesUncheckedUpdateWithoutProductsInput>;
};
export type product_taxesUpdateManyWithWhereWithoutProductsInput = {
    where: Prisma.product_taxesScalarWhereInput;
    data: Prisma.XOR<Prisma.product_taxesUpdateManyMutationInput, Prisma.product_taxesUncheckedUpdateManyWithoutProductsInput>;
};
export type product_taxesScalarWhereInput = {
    AND?: Prisma.product_taxesScalarWhereInput | Prisma.product_taxesScalarWhereInput[];
    OR?: Prisma.product_taxesScalarWhereInput[];
    NOT?: Prisma.product_taxesScalarWhereInput | Prisma.product_taxesScalarWhereInput[];
    id?: Prisma.UuidFilter<"product_taxes"> | string;
    product_id?: Prisma.UuidFilter<"product_taxes"> | string;
    tax_id?: Prisma.UuidFilter<"product_taxes"> | string;
    is_included_in_price?: Prisma.BoolFilter<"product_taxes"> | boolean;
    active?: Prisma.BoolFilter<"product_taxes"> | boolean;
    created_at?: Prisma.DateTimeFilter<"product_taxes"> | Date | string;
};
export type product_taxesCreateWithoutTaxesInput = {
    id?: string;
    is_included_in_price?: boolean;
    active?: boolean;
    created_at?: Date | string;
    products: Prisma.productsCreateNestedOneWithoutProduct_taxesInput;
};
export type product_taxesUncheckedCreateWithoutTaxesInput = {
    id?: string;
    product_id: string;
    is_included_in_price?: boolean;
    active?: boolean;
    created_at?: Date | string;
};
export type product_taxesCreateOrConnectWithoutTaxesInput = {
    where: Prisma.product_taxesWhereUniqueInput;
    create: Prisma.XOR<Prisma.product_taxesCreateWithoutTaxesInput, Prisma.product_taxesUncheckedCreateWithoutTaxesInput>;
};
export type product_taxesCreateManyTaxesInputEnvelope = {
    data: Prisma.product_taxesCreateManyTaxesInput | Prisma.product_taxesCreateManyTaxesInput[];
    skipDuplicates?: boolean;
};
export type product_taxesUpsertWithWhereUniqueWithoutTaxesInput = {
    where: Prisma.product_taxesWhereUniqueInput;
    update: Prisma.XOR<Prisma.product_taxesUpdateWithoutTaxesInput, Prisma.product_taxesUncheckedUpdateWithoutTaxesInput>;
    create: Prisma.XOR<Prisma.product_taxesCreateWithoutTaxesInput, Prisma.product_taxesUncheckedCreateWithoutTaxesInput>;
};
export type product_taxesUpdateWithWhereUniqueWithoutTaxesInput = {
    where: Prisma.product_taxesWhereUniqueInput;
    data: Prisma.XOR<Prisma.product_taxesUpdateWithoutTaxesInput, Prisma.product_taxesUncheckedUpdateWithoutTaxesInput>;
};
export type product_taxesUpdateManyWithWhereWithoutTaxesInput = {
    where: Prisma.product_taxesScalarWhereInput;
    data: Prisma.XOR<Prisma.product_taxesUpdateManyMutationInput, Prisma.product_taxesUncheckedUpdateManyWithoutTaxesInput>;
};
export type product_taxesCreateManyProductsInput = {
    id?: string;
    tax_id: string;
    is_included_in_price?: boolean;
    active?: boolean;
    created_at?: Date | string;
};
export type product_taxesUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_included_in_price?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    taxes?: Prisma.taxesUpdateOneRequiredWithoutProduct_taxesNestedInput;
};
export type product_taxesUncheckedUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_included_in_price?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type product_taxesUncheckedUpdateManyWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_included_in_price?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type product_taxesCreateManyTaxesInput = {
    id?: string;
    product_id: string;
    is_included_in_price?: boolean;
    active?: boolean;
    created_at?: Date | string;
};
export type product_taxesUpdateWithoutTaxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_included_in_price?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    products?: Prisma.productsUpdateOneRequiredWithoutProduct_taxesNestedInput;
};
export type product_taxesUncheckedUpdateWithoutTaxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_included_in_price?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type product_taxesUncheckedUpdateManyWithoutTaxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    is_included_in_price?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type product_taxesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    product_id?: boolean;
    tax_id?: boolean;
    is_included_in_price?: boolean;
    active?: boolean;
    created_at?: boolean;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["product_taxes"]>;
export type product_taxesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    product_id?: boolean;
    tax_id?: boolean;
    is_included_in_price?: boolean;
    active?: boolean;
    created_at?: boolean;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["product_taxes"]>;
export type product_taxesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    product_id?: boolean;
    tax_id?: boolean;
    is_included_in_price?: boolean;
    active?: boolean;
    created_at?: boolean;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["product_taxes"]>;
export type product_taxesSelectScalar = {
    id?: boolean;
    product_id?: boolean;
    tax_id?: boolean;
    is_included_in_price?: boolean;
    active?: boolean;
    created_at?: boolean;
};
export type product_taxesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "product_id" | "tax_id" | "is_included_in_price" | "active" | "created_at", ExtArgs["result"]["product_taxes"]>;
export type product_taxesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
};
export type product_taxesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
};
export type product_taxesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    taxes?: boolean | Prisma.taxesDefaultArgs<ExtArgs>;
};
export type $product_taxesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "product_taxes";
    objects: {
        products: Prisma.$productsPayload<ExtArgs>;
        taxes: Prisma.$taxesPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        product_id: string;
        tax_id: string;
        is_included_in_price: boolean;
        active: boolean;
        created_at: Date;
    }, ExtArgs["result"]["product_taxes"]>;
    composites: {};
};
export type product_taxesGetPayload<S extends boolean | null | undefined | product_taxesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$product_taxesPayload, S>;
export type product_taxesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<product_taxesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Product_taxesCountAggregateInputType | true;
};
export interface product_taxesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['product_taxes'];
        meta: {
            name: 'product_taxes';
        };
    };
    findUnique<T extends product_taxesFindUniqueArgs>(args: Prisma.SelectSubset<T, product_taxesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__product_taxesClient<runtime.Types.Result.GetResult<Prisma.$product_taxesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends product_taxesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, product_taxesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__product_taxesClient<runtime.Types.Result.GetResult<Prisma.$product_taxesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends product_taxesFindFirstArgs>(args?: Prisma.SelectSubset<T, product_taxesFindFirstArgs<ExtArgs>>): Prisma.Prisma__product_taxesClient<runtime.Types.Result.GetResult<Prisma.$product_taxesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends product_taxesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, product_taxesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__product_taxesClient<runtime.Types.Result.GetResult<Prisma.$product_taxesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends product_taxesFindManyArgs>(args?: Prisma.SelectSubset<T, product_taxesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$product_taxesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends product_taxesCreateArgs>(args: Prisma.SelectSubset<T, product_taxesCreateArgs<ExtArgs>>): Prisma.Prisma__product_taxesClient<runtime.Types.Result.GetResult<Prisma.$product_taxesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends product_taxesCreateManyArgs>(args?: Prisma.SelectSubset<T, product_taxesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends product_taxesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, product_taxesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$product_taxesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends product_taxesDeleteArgs>(args: Prisma.SelectSubset<T, product_taxesDeleteArgs<ExtArgs>>): Prisma.Prisma__product_taxesClient<runtime.Types.Result.GetResult<Prisma.$product_taxesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends product_taxesUpdateArgs>(args: Prisma.SelectSubset<T, product_taxesUpdateArgs<ExtArgs>>): Prisma.Prisma__product_taxesClient<runtime.Types.Result.GetResult<Prisma.$product_taxesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends product_taxesDeleteManyArgs>(args?: Prisma.SelectSubset<T, product_taxesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends product_taxesUpdateManyArgs>(args: Prisma.SelectSubset<T, product_taxesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends product_taxesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, product_taxesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$product_taxesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends product_taxesUpsertArgs>(args: Prisma.SelectSubset<T, product_taxesUpsertArgs<ExtArgs>>): Prisma.Prisma__product_taxesClient<runtime.Types.Result.GetResult<Prisma.$product_taxesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends product_taxesCountArgs>(args?: Prisma.Subset<T, product_taxesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Product_taxesCountAggregateOutputType> : number>;
    aggregate<T extends Product_taxesAggregateArgs>(args: Prisma.Subset<T, Product_taxesAggregateArgs>): Prisma.PrismaPromise<GetProduct_taxesAggregateType<T>>;
    groupBy<T extends product_taxesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: product_taxesGroupByArgs['orderBy'];
    } : {
        orderBy?: product_taxesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, product_taxesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProduct_taxesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: product_taxesFieldRefs;
}
export interface Prisma__product_taxesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    products<T extends Prisma.productsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.productsDefaultArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    taxes<T extends Prisma.taxesDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.taxesDefaultArgs<ExtArgs>>): Prisma.Prisma__taxesClient<runtime.Types.Result.GetResult<Prisma.$taxesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface product_taxesFieldRefs {
    readonly id: Prisma.FieldRef<"product_taxes", 'String'>;
    readonly product_id: Prisma.FieldRef<"product_taxes", 'String'>;
    readonly tax_id: Prisma.FieldRef<"product_taxes", 'String'>;
    readonly is_included_in_price: Prisma.FieldRef<"product_taxes", 'Boolean'>;
    readonly active: Prisma.FieldRef<"product_taxes", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"product_taxes", 'DateTime'>;
}
export type product_taxesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.product_taxesSelect<ExtArgs> | null;
    omit?: Prisma.product_taxesOmit<ExtArgs> | null;
    include?: Prisma.product_taxesInclude<ExtArgs> | null;
    where: Prisma.product_taxesWhereUniqueInput;
};
export type product_taxesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.product_taxesSelect<ExtArgs> | null;
    omit?: Prisma.product_taxesOmit<ExtArgs> | null;
    include?: Prisma.product_taxesInclude<ExtArgs> | null;
    where: Prisma.product_taxesWhereUniqueInput;
};
export type product_taxesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type product_taxesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type product_taxesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type product_taxesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.product_taxesSelect<ExtArgs> | null;
    omit?: Prisma.product_taxesOmit<ExtArgs> | null;
    include?: Prisma.product_taxesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.product_taxesCreateInput, Prisma.product_taxesUncheckedCreateInput>;
};
export type product_taxesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.product_taxesCreateManyInput | Prisma.product_taxesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type product_taxesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.product_taxesSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.product_taxesOmit<ExtArgs> | null;
    data: Prisma.product_taxesCreateManyInput | Prisma.product_taxesCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.product_taxesIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type product_taxesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.product_taxesSelect<ExtArgs> | null;
    omit?: Prisma.product_taxesOmit<ExtArgs> | null;
    include?: Prisma.product_taxesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.product_taxesUpdateInput, Prisma.product_taxesUncheckedUpdateInput>;
    where: Prisma.product_taxesWhereUniqueInput;
};
export type product_taxesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.product_taxesUpdateManyMutationInput, Prisma.product_taxesUncheckedUpdateManyInput>;
    where?: Prisma.product_taxesWhereInput;
    limit?: number;
};
export type product_taxesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.product_taxesSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.product_taxesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.product_taxesUpdateManyMutationInput, Prisma.product_taxesUncheckedUpdateManyInput>;
    where?: Prisma.product_taxesWhereInput;
    limit?: number;
    include?: Prisma.product_taxesIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type product_taxesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.product_taxesSelect<ExtArgs> | null;
    omit?: Prisma.product_taxesOmit<ExtArgs> | null;
    include?: Prisma.product_taxesInclude<ExtArgs> | null;
    where: Prisma.product_taxesWhereUniqueInput;
    create: Prisma.XOR<Prisma.product_taxesCreateInput, Prisma.product_taxesUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.product_taxesUpdateInput, Prisma.product_taxesUncheckedUpdateInput>;
};
export type product_taxesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.product_taxesSelect<ExtArgs> | null;
    omit?: Prisma.product_taxesOmit<ExtArgs> | null;
    include?: Prisma.product_taxesInclude<ExtArgs> | null;
    where: Prisma.product_taxesWhereUniqueInput;
};
export type product_taxesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.product_taxesWhereInput;
    limit?: number;
};
export type product_taxesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.product_taxesSelect<ExtArgs> | null;
    omit?: Prisma.product_taxesOmit<ExtArgs> | null;
    include?: Prisma.product_taxesInclude<ExtArgs> | null;
};
