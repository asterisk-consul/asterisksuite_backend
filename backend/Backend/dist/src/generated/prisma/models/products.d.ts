import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type productsModel = runtime.Types.Result.DefaultSelection<Prisma.$productsPayload>;
export type AggregateProducts = {
    _count: ProductsCountAggregateOutputType | null;
    _min: ProductsMinAggregateOutputType | null;
    _max: ProductsMaxAggregateOutputType | null;
};
export type ProductsMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    sku: string | null;
    requires_refrigeration: boolean | null;
    created_at: Date | null;
};
export type ProductsMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    sku: string | null;
    requires_refrigeration: boolean | null;
    created_at: Date | null;
};
export type ProductsCountAggregateOutputType = {
    id: number;
    name: number;
    sku: number;
    requires_refrigeration: number;
    created_at: number;
    _all: number;
};
export type ProductsMinAggregateInputType = {
    id?: true;
    name?: true;
    sku?: true;
    requires_refrigeration?: true;
    created_at?: true;
};
export type ProductsMaxAggregateInputType = {
    id?: true;
    name?: true;
    sku?: true;
    requires_refrigeration?: true;
    created_at?: true;
};
export type ProductsCountAggregateInputType = {
    id?: true;
    name?: true;
    sku?: true;
    requires_refrigeration?: true;
    created_at?: true;
    _all?: true;
};
export type ProductsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.productsWhereInput;
    orderBy?: Prisma.productsOrderByWithRelationInput | Prisma.productsOrderByWithRelationInput[];
    cursor?: Prisma.productsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProductsCountAggregateInputType;
    _min?: ProductsMinAggregateInputType;
    _max?: ProductsMaxAggregateInputType;
};
export type GetProductsAggregateType<T extends ProductsAggregateArgs> = {
    [P in keyof T & keyof AggregateProducts]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProducts[P]> : Prisma.GetScalarType<T[P], AggregateProducts[P]>;
};
export type productsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.productsWhereInput;
    orderBy?: Prisma.productsOrderByWithAggregationInput | Prisma.productsOrderByWithAggregationInput[];
    by: Prisma.ProductsScalarFieldEnum[] | Prisma.ProductsScalarFieldEnum;
    having?: Prisma.productsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProductsCountAggregateInputType | true;
    _min?: ProductsMinAggregateInputType;
    _max?: ProductsMaxAggregateInputType;
};
export type ProductsGroupByOutputType = {
    id: string;
    name: string;
    sku: string | null;
    requires_refrigeration: boolean | null;
    created_at: Date;
    _count: ProductsCountAggregateOutputType | null;
    _min: ProductsMinAggregateOutputType | null;
    _max: ProductsMaxAggregateOutputType | null;
};
export type GetProductsGroupByPayload<T extends productsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProductsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProductsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProductsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProductsGroupByOutputType[P]>;
}>>;
export type productsWhereInput = {
    AND?: Prisma.productsWhereInput | Prisma.productsWhereInput[];
    OR?: Prisma.productsWhereInput[];
    NOT?: Prisma.productsWhereInput | Prisma.productsWhereInput[];
    id?: Prisma.UuidFilter<"products"> | string;
    name?: Prisma.StringFilter<"products"> | string;
    sku?: Prisma.StringNullableFilter<"products"> | string | null;
    requires_refrigeration?: Prisma.BoolNullableFilter<"products"> | boolean | null;
    created_at?: Prisma.DateTimeFilter<"products"> | Date | string;
    pallet_items?: Prisma.Pallet_itemsListRelationFilter;
    picking_items?: Prisma.Picking_itemsListRelationFilter;
    product_taxes?: Prisma.Product_taxesListRelationFilter;
    warehouse_stock?: Prisma.Warehouse_stockListRelationFilter;
    warehouse_stock_movements?: Prisma.Warehouse_stock_movementsListRelationFilter;
};
export type productsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrderInput | Prisma.SortOrder;
    requires_refrigeration?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    pallet_items?: Prisma.pallet_itemsOrderByRelationAggregateInput;
    picking_items?: Prisma.picking_itemsOrderByRelationAggregateInput;
    product_taxes?: Prisma.product_taxesOrderByRelationAggregateInput;
    warehouse_stock?: Prisma.warehouse_stockOrderByRelationAggregateInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsOrderByRelationAggregateInput;
};
export type productsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.productsWhereInput | Prisma.productsWhereInput[];
    OR?: Prisma.productsWhereInput[];
    NOT?: Prisma.productsWhereInput | Prisma.productsWhereInput[];
    name?: Prisma.StringFilter<"products"> | string;
    sku?: Prisma.StringNullableFilter<"products"> | string | null;
    requires_refrigeration?: Prisma.BoolNullableFilter<"products"> | boolean | null;
    created_at?: Prisma.DateTimeFilter<"products"> | Date | string;
    pallet_items?: Prisma.Pallet_itemsListRelationFilter;
    picking_items?: Prisma.Picking_itemsListRelationFilter;
    product_taxes?: Prisma.Product_taxesListRelationFilter;
    warehouse_stock?: Prisma.Warehouse_stockListRelationFilter;
    warehouse_stock_movements?: Prisma.Warehouse_stock_movementsListRelationFilter;
}, "id">;
export type productsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrderInput | Prisma.SortOrder;
    requires_refrigeration?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.productsCountOrderByAggregateInput;
    _max?: Prisma.productsMaxOrderByAggregateInput;
    _min?: Prisma.productsMinOrderByAggregateInput;
};
export type productsScalarWhereWithAggregatesInput = {
    AND?: Prisma.productsScalarWhereWithAggregatesInput | Prisma.productsScalarWhereWithAggregatesInput[];
    OR?: Prisma.productsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.productsScalarWhereWithAggregatesInput | Prisma.productsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"products"> | string;
    name?: Prisma.StringWithAggregatesFilter<"products"> | string;
    sku?: Prisma.StringNullableWithAggregatesFilter<"products"> | string | null;
    requires_refrigeration?: Prisma.BoolNullableWithAggregatesFilter<"products"> | boolean | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"products"> | Date | string;
};
export type productsCreateInput = {
    id?: string;
    name: string;
    sku?: string | null;
    requires_refrigeration?: boolean | null;
    created_at?: Date | string;
    pallet_items?: Prisma.pallet_itemsCreateNestedManyWithoutProductsInput;
    picking_items?: Prisma.picking_itemsCreateNestedManyWithoutProductsInput;
    product_taxes?: Prisma.product_taxesCreateNestedManyWithoutProductsInput;
    warehouse_stock?: Prisma.warehouse_stockCreateNestedManyWithoutProductsInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutProductsInput;
};
export type productsUncheckedCreateInput = {
    id?: string;
    name: string;
    sku?: string | null;
    requires_refrigeration?: boolean | null;
    created_at?: Date | string;
    pallet_items?: Prisma.pallet_itemsUncheckedCreateNestedManyWithoutProductsInput;
    picking_items?: Prisma.picking_itemsUncheckedCreateNestedManyWithoutProductsInput;
    product_taxes?: Prisma.product_taxesUncheckedCreateNestedManyWithoutProductsInput;
    warehouse_stock?: Prisma.warehouse_stockUncheckedCreateNestedManyWithoutProductsInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutProductsInput;
};
export type productsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requires_refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pallet_items?: Prisma.pallet_itemsUpdateManyWithoutProductsNestedInput;
    picking_items?: Prisma.picking_itemsUpdateManyWithoutProductsNestedInput;
    product_taxes?: Prisma.product_taxesUpdateManyWithoutProductsNestedInput;
    warehouse_stock?: Prisma.warehouse_stockUpdateManyWithoutProductsNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutProductsNestedInput;
};
export type productsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requires_refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pallet_items?: Prisma.pallet_itemsUncheckedUpdateManyWithoutProductsNestedInput;
    picking_items?: Prisma.picking_itemsUncheckedUpdateManyWithoutProductsNestedInput;
    product_taxes?: Prisma.product_taxesUncheckedUpdateManyWithoutProductsNestedInput;
    warehouse_stock?: Prisma.warehouse_stockUncheckedUpdateManyWithoutProductsNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutProductsNestedInput;
};
export type productsCreateManyInput = {
    id?: string;
    name: string;
    sku?: string | null;
    requires_refrigeration?: boolean | null;
    created_at?: Date | string;
};
export type productsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requires_refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type productsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requires_refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProductsScalarRelationFilter = {
    is?: Prisma.productsWhereInput;
    isNot?: Prisma.productsWhereInput;
};
export type productsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    requires_refrigeration?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type productsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    requires_refrigeration?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type productsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    sku?: Prisma.SortOrder;
    requires_refrigeration?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type productsCreateNestedOneWithoutPallet_itemsInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutPallet_itemsInput, Prisma.productsUncheckedCreateWithoutPallet_itemsInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutPallet_itemsInput;
    connect?: Prisma.productsWhereUniqueInput;
};
export type productsUpdateOneRequiredWithoutPallet_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutPallet_itemsInput, Prisma.productsUncheckedCreateWithoutPallet_itemsInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutPallet_itemsInput;
    upsert?: Prisma.productsUpsertWithoutPallet_itemsInput;
    connect?: Prisma.productsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.productsUpdateToOneWithWhereWithoutPallet_itemsInput, Prisma.productsUpdateWithoutPallet_itemsInput>, Prisma.productsUncheckedUpdateWithoutPallet_itemsInput>;
};
export type productsCreateNestedOneWithoutPicking_itemsInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutPicking_itemsInput, Prisma.productsUncheckedCreateWithoutPicking_itemsInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutPicking_itemsInput;
    connect?: Prisma.productsWhereUniqueInput;
};
export type productsUpdateOneRequiredWithoutPicking_itemsNestedInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutPicking_itemsInput, Prisma.productsUncheckedCreateWithoutPicking_itemsInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutPicking_itemsInput;
    upsert?: Prisma.productsUpsertWithoutPicking_itemsInput;
    connect?: Prisma.productsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.productsUpdateToOneWithWhereWithoutPicking_itemsInput, Prisma.productsUpdateWithoutPicking_itemsInput>, Prisma.productsUncheckedUpdateWithoutPicking_itemsInput>;
};
export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null;
};
export type productsCreateNestedOneWithoutWarehouse_stockInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutWarehouse_stockInput, Prisma.productsUncheckedCreateWithoutWarehouse_stockInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutWarehouse_stockInput;
    connect?: Prisma.productsWhereUniqueInput;
};
export type productsUpdateOneRequiredWithoutWarehouse_stockNestedInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutWarehouse_stockInput, Prisma.productsUncheckedCreateWithoutWarehouse_stockInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutWarehouse_stockInput;
    upsert?: Prisma.productsUpsertWithoutWarehouse_stockInput;
    connect?: Prisma.productsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.productsUpdateToOneWithWhereWithoutWarehouse_stockInput, Prisma.productsUpdateWithoutWarehouse_stockInput>, Prisma.productsUncheckedUpdateWithoutWarehouse_stockInput>;
};
export type productsCreateNestedOneWithoutWarehouse_stock_movementsInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutWarehouse_stock_movementsInput, Prisma.productsUncheckedCreateWithoutWarehouse_stock_movementsInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutWarehouse_stock_movementsInput;
    connect?: Prisma.productsWhereUniqueInput;
};
export type productsUpdateOneRequiredWithoutWarehouse_stock_movementsNestedInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutWarehouse_stock_movementsInput, Prisma.productsUncheckedCreateWithoutWarehouse_stock_movementsInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutWarehouse_stock_movementsInput;
    upsert?: Prisma.productsUpsertWithoutWarehouse_stock_movementsInput;
    connect?: Prisma.productsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.productsUpdateToOneWithWhereWithoutWarehouse_stock_movementsInput, Prisma.productsUpdateWithoutWarehouse_stock_movementsInput>, Prisma.productsUncheckedUpdateWithoutWarehouse_stock_movementsInput>;
};
export type productsCreateNestedOneWithoutProduct_taxesInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutProduct_taxesInput, Prisma.productsUncheckedCreateWithoutProduct_taxesInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutProduct_taxesInput;
    connect?: Prisma.productsWhereUniqueInput;
};
export type productsUpdateOneRequiredWithoutProduct_taxesNestedInput = {
    create?: Prisma.XOR<Prisma.productsCreateWithoutProduct_taxesInput, Prisma.productsUncheckedCreateWithoutProduct_taxesInput>;
    connectOrCreate?: Prisma.productsCreateOrConnectWithoutProduct_taxesInput;
    upsert?: Prisma.productsUpsertWithoutProduct_taxesInput;
    connect?: Prisma.productsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.productsUpdateToOneWithWhereWithoutProduct_taxesInput, Prisma.productsUpdateWithoutProduct_taxesInput>, Prisma.productsUncheckedUpdateWithoutProduct_taxesInput>;
};
export type productsCreateWithoutPallet_itemsInput = {
    id?: string;
    name: string;
    sku?: string | null;
    requires_refrigeration?: boolean | null;
    created_at?: Date | string;
    picking_items?: Prisma.picking_itemsCreateNestedManyWithoutProductsInput;
    product_taxes?: Prisma.product_taxesCreateNestedManyWithoutProductsInput;
    warehouse_stock?: Prisma.warehouse_stockCreateNestedManyWithoutProductsInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutProductsInput;
};
export type productsUncheckedCreateWithoutPallet_itemsInput = {
    id?: string;
    name: string;
    sku?: string | null;
    requires_refrigeration?: boolean | null;
    created_at?: Date | string;
    picking_items?: Prisma.picking_itemsUncheckedCreateNestedManyWithoutProductsInput;
    product_taxes?: Prisma.product_taxesUncheckedCreateNestedManyWithoutProductsInput;
    warehouse_stock?: Prisma.warehouse_stockUncheckedCreateNestedManyWithoutProductsInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutProductsInput;
};
export type productsCreateOrConnectWithoutPallet_itemsInput = {
    where: Prisma.productsWhereUniqueInput;
    create: Prisma.XOR<Prisma.productsCreateWithoutPallet_itemsInput, Prisma.productsUncheckedCreateWithoutPallet_itemsInput>;
};
export type productsUpsertWithoutPallet_itemsInput = {
    update: Prisma.XOR<Prisma.productsUpdateWithoutPallet_itemsInput, Prisma.productsUncheckedUpdateWithoutPallet_itemsInput>;
    create: Prisma.XOR<Prisma.productsCreateWithoutPallet_itemsInput, Prisma.productsUncheckedCreateWithoutPallet_itemsInput>;
    where?: Prisma.productsWhereInput;
};
export type productsUpdateToOneWithWhereWithoutPallet_itemsInput = {
    where?: Prisma.productsWhereInput;
    data: Prisma.XOR<Prisma.productsUpdateWithoutPallet_itemsInput, Prisma.productsUncheckedUpdateWithoutPallet_itemsInput>;
};
export type productsUpdateWithoutPallet_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requires_refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    picking_items?: Prisma.picking_itemsUpdateManyWithoutProductsNestedInput;
    product_taxes?: Prisma.product_taxesUpdateManyWithoutProductsNestedInput;
    warehouse_stock?: Prisma.warehouse_stockUpdateManyWithoutProductsNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutProductsNestedInput;
};
export type productsUncheckedUpdateWithoutPallet_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requires_refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    picking_items?: Prisma.picking_itemsUncheckedUpdateManyWithoutProductsNestedInput;
    product_taxes?: Prisma.product_taxesUncheckedUpdateManyWithoutProductsNestedInput;
    warehouse_stock?: Prisma.warehouse_stockUncheckedUpdateManyWithoutProductsNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutProductsNestedInput;
};
export type productsCreateWithoutPicking_itemsInput = {
    id?: string;
    name: string;
    sku?: string | null;
    requires_refrigeration?: boolean | null;
    created_at?: Date | string;
    pallet_items?: Prisma.pallet_itemsCreateNestedManyWithoutProductsInput;
    product_taxes?: Prisma.product_taxesCreateNestedManyWithoutProductsInput;
    warehouse_stock?: Prisma.warehouse_stockCreateNestedManyWithoutProductsInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutProductsInput;
};
export type productsUncheckedCreateWithoutPicking_itemsInput = {
    id?: string;
    name: string;
    sku?: string | null;
    requires_refrigeration?: boolean | null;
    created_at?: Date | string;
    pallet_items?: Prisma.pallet_itemsUncheckedCreateNestedManyWithoutProductsInput;
    product_taxes?: Prisma.product_taxesUncheckedCreateNestedManyWithoutProductsInput;
    warehouse_stock?: Prisma.warehouse_stockUncheckedCreateNestedManyWithoutProductsInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutProductsInput;
};
export type productsCreateOrConnectWithoutPicking_itemsInput = {
    where: Prisma.productsWhereUniqueInput;
    create: Prisma.XOR<Prisma.productsCreateWithoutPicking_itemsInput, Prisma.productsUncheckedCreateWithoutPicking_itemsInput>;
};
export type productsUpsertWithoutPicking_itemsInput = {
    update: Prisma.XOR<Prisma.productsUpdateWithoutPicking_itemsInput, Prisma.productsUncheckedUpdateWithoutPicking_itemsInput>;
    create: Prisma.XOR<Prisma.productsCreateWithoutPicking_itemsInput, Prisma.productsUncheckedCreateWithoutPicking_itemsInput>;
    where?: Prisma.productsWhereInput;
};
export type productsUpdateToOneWithWhereWithoutPicking_itemsInput = {
    where?: Prisma.productsWhereInput;
    data: Prisma.XOR<Prisma.productsUpdateWithoutPicking_itemsInput, Prisma.productsUncheckedUpdateWithoutPicking_itemsInput>;
};
export type productsUpdateWithoutPicking_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requires_refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pallet_items?: Prisma.pallet_itemsUpdateManyWithoutProductsNestedInput;
    product_taxes?: Prisma.product_taxesUpdateManyWithoutProductsNestedInput;
    warehouse_stock?: Prisma.warehouse_stockUpdateManyWithoutProductsNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutProductsNestedInput;
};
export type productsUncheckedUpdateWithoutPicking_itemsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requires_refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pallet_items?: Prisma.pallet_itemsUncheckedUpdateManyWithoutProductsNestedInput;
    product_taxes?: Prisma.product_taxesUncheckedUpdateManyWithoutProductsNestedInput;
    warehouse_stock?: Prisma.warehouse_stockUncheckedUpdateManyWithoutProductsNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutProductsNestedInput;
};
export type productsCreateWithoutWarehouse_stockInput = {
    id?: string;
    name: string;
    sku?: string | null;
    requires_refrigeration?: boolean | null;
    created_at?: Date | string;
    pallet_items?: Prisma.pallet_itemsCreateNestedManyWithoutProductsInput;
    picking_items?: Prisma.picking_itemsCreateNestedManyWithoutProductsInput;
    product_taxes?: Prisma.product_taxesCreateNestedManyWithoutProductsInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutProductsInput;
};
export type productsUncheckedCreateWithoutWarehouse_stockInput = {
    id?: string;
    name: string;
    sku?: string | null;
    requires_refrigeration?: boolean | null;
    created_at?: Date | string;
    pallet_items?: Prisma.pallet_itemsUncheckedCreateNestedManyWithoutProductsInput;
    picking_items?: Prisma.picking_itemsUncheckedCreateNestedManyWithoutProductsInput;
    product_taxes?: Prisma.product_taxesUncheckedCreateNestedManyWithoutProductsInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutProductsInput;
};
export type productsCreateOrConnectWithoutWarehouse_stockInput = {
    where: Prisma.productsWhereUniqueInput;
    create: Prisma.XOR<Prisma.productsCreateWithoutWarehouse_stockInput, Prisma.productsUncheckedCreateWithoutWarehouse_stockInput>;
};
export type productsUpsertWithoutWarehouse_stockInput = {
    update: Prisma.XOR<Prisma.productsUpdateWithoutWarehouse_stockInput, Prisma.productsUncheckedUpdateWithoutWarehouse_stockInput>;
    create: Prisma.XOR<Prisma.productsCreateWithoutWarehouse_stockInput, Prisma.productsUncheckedCreateWithoutWarehouse_stockInput>;
    where?: Prisma.productsWhereInput;
};
export type productsUpdateToOneWithWhereWithoutWarehouse_stockInput = {
    where?: Prisma.productsWhereInput;
    data: Prisma.XOR<Prisma.productsUpdateWithoutWarehouse_stockInput, Prisma.productsUncheckedUpdateWithoutWarehouse_stockInput>;
};
export type productsUpdateWithoutWarehouse_stockInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requires_refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pallet_items?: Prisma.pallet_itemsUpdateManyWithoutProductsNestedInput;
    picking_items?: Prisma.picking_itemsUpdateManyWithoutProductsNestedInput;
    product_taxes?: Prisma.product_taxesUpdateManyWithoutProductsNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutProductsNestedInput;
};
export type productsUncheckedUpdateWithoutWarehouse_stockInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requires_refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pallet_items?: Prisma.pallet_itemsUncheckedUpdateManyWithoutProductsNestedInput;
    picking_items?: Prisma.picking_itemsUncheckedUpdateManyWithoutProductsNestedInput;
    product_taxes?: Prisma.product_taxesUncheckedUpdateManyWithoutProductsNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutProductsNestedInput;
};
export type productsCreateWithoutWarehouse_stock_movementsInput = {
    id?: string;
    name: string;
    sku?: string | null;
    requires_refrigeration?: boolean | null;
    created_at?: Date | string;
    pallet_items?: Prisma.pallet_itemsCreateNestedManyWithoutProductsInput;
    picking_items?: Prisma.picking_itemsCreateNestedManyWithoutProductsInput;
    product_taxes?: Prisma.product_taxesCreateNestedManyWithoutProductsInput;
    warehouse_stock?: Prisma.warehouse_stockCreateNestedManyWithoutProductsInput;
};
export type productsUncheckedCreateWithoutWarehouse_stock_movementsInput = {
    id?: string;
    name: string;
    sku?: string | null;
    requires_refrigeration?: boolean | null;
    created_at?: Date | string;
    pallet_items?: Prisma.pallet_itemsUncheckedCreateNestedManyWithoutProductsInput;
    picking_items?: Prisma.picking_itemsUncheckedCreateNestedManyWithoutProductsInput;
    product_taxes?: Prisma.product_taxesUncheckedCreateNestedManyWithoutProductsInput;
    warehouse_stock?: Prisma.warehouse_stockUncheckedCreateNestedManyWithoutProductsInput;
};
export type productsCreateOrConnectWithoutWarehouse_stock_movementsInput = {
    where: Prisma.productsWhereUniqueInput;
    create: Prisma.XOR<Prisma.productsCreateWithoutWarehouse_stock_movementsInput, Prisma.productsUncheckedCreateWithoutWarehouse_stock_movementsInput>;
};
export type productsUpsertWithoutWarehouse_stock_movementsInput = {
    update: Prisma.XOR<Prisma.productsUpdateWithoutWarehouse_stock_movementsInput, Prisma.productsUncheckedUpdateWithoutWarehouse_stock_movementsInput>;
    create: Prisma.XOR<Prisma.productsCreateWithoutWarehouse_stock_movementsInput, Prisma.productsUncheckedCreateWithoutWarehouse_stock_movementsInput>;
    where?: Prisma.productsWhereInput;
};
export type productsUpdateToOneWithWhereWithoutWarehouse_stock_movementsInput = {
    where?: Prisma.productsWhereInput;
    data: Prisma.XOR<Prisma.productsUpdateWithoutWarehouse_stock_movementsInput, Prisma.productsUncheckedUpdateWithoutWarehouse_stock_movementsInput>;
};
export type productsUpdateWithoutWarehouse_stock_movementsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requires_refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pallet_items?: Prisma.pallet_itemsUpdateManyWithoutProductsNestedInput;
    picking_items?: Prisma.picking_itemsUpdateManyWithoutProductsNestedInput;
    product_taxes?: Prisma.product_taxesUpdateManyWithoutProductsNestedInput;
    warehouse_stock?: Prisma.warehouse_stockUpdateManyWithoutProductsNestedInput;
};
export type productsUncheckedUpdateWithoutWarehouse_stock_movementsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requires_refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pallet_items?: Prisma.pallet_itemsUncheckedUpdateManyWithoutProductsNestedInput;
    picking_items?: Prisma.picking_itemsUncheckedUpdateManyWithoutProductsNestedInput;
    product_taxes?: Prisma.product_taxesUncheckedUpdateManyWithoutProductsNestedInput;
    warehouse_stock?: Prisma.warehouse_stockUncheckedUpdateManyWithoutProductsNestedInput;
};
export type productsCreateWithoutProduct_taxesInput = {
    id?: string;
    name: string;
    sku?: string | null;
    requires_refrigeration?: boolean | null;
    created_at?: Date | string;
    pallet_items?: Prisma.pallet_itemsCreateNestedManyWithoutProductsInput;
    picking_items?: Prisma.picking_itemsCreateNestedManyWithoutProductsInput;
    warehouse_stock?: Prisma.warehouse_stockCreateNestedManyWithoutProductsInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsCreateNestedManyWithoutProductsInput;
};
export type productsUncheckedCreateWithoutProduct_taxesInput = {
    id?: string;
    name: string;
    sku?: string | null;
    requires_refrigeration?: boolean | null;
    created_at?: Date | string;
    pallet_items?: Prisma.pallet_itemsUncheckedCreateNestedManyWithoutProductsInput;
    picking_items?: Prisma.picking_itemsUncheckedCreateNestedManyWithoutProductsInput;
    warehouse_stock?: Prisma.warehouse_stockUncheckedCreateNestedManyWithoutProductsInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedCreateNestedManyWithoutProductsInput;
};
export type productsCreateOrConnectWithoutProduct_taxesInput = {
    where: Prisma.productsWhereUniqueInput;
    create: Prisma.XOR<Prisma.productsCreateWithoutProduct_taxesInput, Prisma.productsUncheckedCreateWithoutProduct_taxesInput>;
};
export type productsUpsertWithoutProduct_taxesInput = {
    update: Prisma.XOR<Prisma.productsUpdateWithoutProduct_taxesInput, Prisma.productsUncheckedUpdateWithoutProduct_taxesInput>;
    create: Prisma.XOR<Prisma.productsCreateWithoutProduct_taxesInput, Prisma.productsUncheckedCreateWithoutProduct_taxesInput>;
    where?: Prisma.productsWhereInput;
};
export type productsUpdateToOneWithWhereWithoutProduct_taxesInput = {
    where?: Prisma.productsWhereInput;
    data: Prisma.XOR<Prisma.productsUpdateWithoutProduct_taxesInput, Prisma.productsUncheckedUpdateWithoutProduct_taxesInput>;
};
export type productsUpdateWithoutProduct_taxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requires_refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pallet_items?: Prisma.pallet_itemsUpdateManyWithoutProductsNestedInput;
    picking_items?: Prisma.picking_itemsUpdateManyWithoutProductsNestedInput;
    warehouse_stock?: Prisma.warehouse_stockUpdateManyWithoutProductsNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUpdateManyWithoutProductsNestedInput;
};
export type productsUncheckedUpdateWithoutProduct_taxesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    sku?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    requires_refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pallet_items?: Prisma.pallet_itemsUncheckedUpdateManyWithoutProductsNestedInput;
    picking_items?: Prisma.picking_itemsUncheckedUpdateManyWithoutProductsNestedInput;
    warehouse_stock?: Prisma.warehouse_stockUncheckedUpdateManyWithoutProductsNestedInput;
    warehouse_stock_movements?: Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutProductsNestedInput;
};
export type ProductsCountOutputType = {
    pallet_items: number;
    picking_items: number;
    product_taxes: number;
    warehouse_stock: number;
    warehouse_stock_movements: number;
};
export type ProductsCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pallet_items?: boolean | ProductsCountOutputTypeCountPallet_itemsArgs;
    picking_items?: boolean | ProductsCountOutputTypeCountPicking_itemsArgs;
    product_taxes?: boolean | ProductsCountOutputTypeCountProduct_taxesArgs;
    warehouse_stock?: boolean | ProductsCountOutputTypeCountWarehouse_stockArgs;
    warehouse_stock_movements?: boolean | ProductsCountOutputTypeCountWarehouse_stock_movementsArgs;
};
export type ProductsCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductsCountOutputTypeSelect<ExtArgs> | null;
};
export type ProductsCountOutputTypeCountPallet_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.pallet_itemsWhereInput;
};
export type ProductsCountOutputTypeCountPicking_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.picking_itemsWhereInput;
};
export type ProductsCountOutputTypeCountProduct_taxesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.product_taxesWhereInput;
};
export type ProductsCountOutputTypeCountWarehouse_stockArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.warehouse_stockWhereInput;
};
export type ProductsCountOutputTypeCountWarehouse_stock_movementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.warehouse_stock_movementsWhereInput;
};
export type productsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    sku?: boolean;
    requires_refrigeration?: boolean;
    created_at?: boolean;
    pallet_items?: boolean | Prisma.products$pallet_itemsArgs<ExtArgs>;
    picking_items?: boolean | Prisma.products$picking_itemsArgs<ExtArgs>;
    product_taxes?: boolean | Prisma.products$product_taxesArgs<ExtArgs>;
    warehouse_stock?: boolean | Prisma.products$warehouse_stockArgs<ExtArgs>;
    warehouse_stock_movements?: boolean | Prisma.products$warehouse_stock_movementsArgs<ExtArgs>;
    _count?: boolean | Prisma.ProductsCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["products"]>;
export type productsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    sku?: boolean;
    requires_refrigeration?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["products"]>;
export type productsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    sku?: boolean;
    requires_refrigeration?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["products"]>;
export type productsSelectScalar = {
    id?: boolean;
    name?: boolean;
    sku?: boolean;
    requires_refrigeration?: boolean;
    created_at?: boolean;
};
export type productsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "sku" | "requires_refrigeration" | "created_at", ExtArgs["result"]["products"]>;
export type productsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pallet_items?: boolean | Prisma.products$pallet_itemsArgs<ExtArgs>;
    picking_items?: boolean | Prisma.products$picking_itemsArgs<ExtArgs>;
    product_taxes?: boolean | Prisma.products$product_taxesArgs<ExtArgs>;
    warehouse_stock?: boolean | Prisma.products$warehouse_stockArgs<ExtArgs>;
    warehouse_stock_movements?: boolean | Prisma.products$warehouse_stock_movementsArgs<ExtArgs>;
    _count?: boolean | Prisma.ProductsCountOutputTypeDefaultArgs<ExtArgs>;
};
export type productsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type productsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $productsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "products";
    objects: {
        pallet_items: Prisma.$pallet_itemsPayload<ExtArgs>[];
        picking_items: Prisma.$picking_itemsPayload<ExtArgs>[];
        product_taxes: Prisma.$product_taxesPayload<ExtArgs>[];
        warehouse_stock: Prisma.$warehouse_stockPayload<ExtArgs>[];
        warehouse_stock_movements: Prisma.$warehouse_stock_movementsPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        sku: string | null;
        requires_refrigeration: boolean | null;
        created_at: Date;
    }, ExtArgs["result"]["products"]>;
    composites: {};
};
export type productsGetPayload<S extends boolean | null | undefined | productsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$productsPayload, S>;
export type productsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<productsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProductsCountAggregateInputType | true;
};
export interface productsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['products'];
        meta: {
            name: 'products';
        };
    };
    findUnique<T extends productsFindUniqueArgs>(args: Prisma.SelectSubset<T, productsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends productsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, productsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends productsFindFirstArgs>(args?: Prisma.SelectSubset<T, productsFindFirstArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends productsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, productsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends productsFindManyArgs>(args?: Prisma.SelectSubset<T, productsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends productsCreateArgs>(args: Prisma.SelectSubset<T, productsCreateArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends productsCreateManyArgs>(args?: Prisma.SelectSubset<T, productsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends productsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, productsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends productsDeleteArgs>(args: Prisma.SelectSubset<T, productsDeleteArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends productsUpdateArgs>(args: Prisma.SelectSubset<T, productsUpdateArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends productsDeleteManyArgs>(args?: Prisma.SelectSubset<T, productsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends productsUpdateManyArgs>(args: Prisma.SelectSubset<T, productsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends productsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, productsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends productsUpsertArgs>(args: Prisma.SelectSubset<T, productsUpsertArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends productsCountArgs>(args?: Prisma.Subset<T, productsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProductsCountAggregateOutputType> : number>;
    aggregate<T extends ProductsAggregateArgs>(args: Prisma.Subset<T, ProductsAggregateArgs>): Prisma.PrismaPromise<GetProductsAggregateType<T>>;
    groupBy<T extends productsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: productsGroupByArgs['orderBy'];
    } : {
        orderBy?: productsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, productsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: productsFieldRefs;
}
export interface Prisma__productsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    pallet_items<T extends Prisma.products$pallet_itemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.products$pallet_itemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$pallet_itemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    picking_items<T extends Prisma.products$picking_itemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.products$picking_itemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$picking_itemsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    product_taxes<T extends Prisma.products$product_taxesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.products$product_taxesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$product_taxesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    warehouse_stock<T extends Prisma.products$warehouse_stockArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.products$warehouse_stockArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$warehouse_stockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    warehouse_stock_movements<T extends Prisma.products$warehouse_stock_movementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.products$warehouse_stock_movementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$warehouse_stock_movementsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface productsFieldRefs {
    readonly id: Prisma.FieldRef<"products", 'String'>;
    readonly name: Prisma.FieldRef<"products", 'String'>;
    readonly sku: Prisma.FieldRef<"products", 'String'>;
    readonly requires_refrigeration: Prisma.FieldRef<"products", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"products", 'DateTime'>;
}
export type productsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.productsSelect<ExtArgs> | null;
    omit?: Prisma.productsOmit<ExtArgs> | null;
    include?: Prisma.productsInclude<ExtArgs> | null;
    where: Prisma.productsWhereUniqueInput;
};
export type productsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.productsSelect<ExtArgs> | null;
    omit?: Prisma.productsOmit<ExtArgs> | null;
    include?: Prisma.productsInclude<ExtArgs> | null;
    where: Prisma.productsWhereUniqueInput;
};
export type productsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.productsSelect<ExtArgs> | null;
    omit?: Prisma.productsOmit<ExtArgs> | null;
    include?: Prisma.productsInclude<ExtArgs> | null;
    where?: Prisma.productsWhereInput;
    orderBy?: Prisma.productsOrderByWithRelationInput | Prisma.productsOrderByWithRelationInput[];
    cursor?: Prisma.productsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductsScalarFieldEnum | Prisma.ProductsScalarFieldEnum[];
};
export type productsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.productsSelect<ExtArgs> | null;
    omit?: Prisma.productsOmit<ExtArgs> | null;
    include?: Prisma.productsInclude<ExtArgs> | null;
    where?: Prisma.productsWhereInput;
    orderBy?: Prisma.productsOrderByWithRelationInput | Prisma.productsOrderByWithRelationInput[];
    cursor?: Prisma.productsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductsScalarFieldEnum | Prisma.ProductsScalarFieldEnum[];
};
export type productsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.productsSelect<ExtArgs> | null;
    omit?: Prisma.productsOmit<ExtArgs> | null;
    include?: Prisma.productsInclude<ExtArgs> | null;
    where?: Prisma.productsWhereInput;
    orderBy?: Prisma.productsOrderByWithRelationInput | Prisma.productsOrderByWithRelationInput[];
    cursor?: Prisma.productsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductsScalarFieldEnum | Prisma.ProductsScalarFieldEnum[];
};
export type productsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.productsSelect<ExtArgs> | null;
    omit?: Prisma.productsOmit<ExtArgs> | null;
    include?: Prisma.productsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.productsCreateInput, Prisma.productsUncheckedCreateInput>;
};
export type productsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.productsCreateManyInput | Prisma.productsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type productsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.productsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.productsOmit<ExtArgs> | null;
    data: Prisma.productsCreateManyInput | Prisma.productsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type productsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.productsSelect<ExtArgs> | null;
    omit?: Prisma.productsOmit<ExtArgs> | null;
    include?: Prisma.productsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.productsUpdateInput, Prisma.productsUncheckedUpdateInput>;
    where: Prisma.productsWhereUniqueInput;
};
export type productsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.productsUpdateManyMutationInput, Prisma.productsUncheckedUpdateManyInput>;
    where?: Prisma.productsWhereInput;
    limit?: number;
};
export type productsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.productsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.productsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.productsUpdateManyMutationInput, Prisma.productsUncheckedUpdateManyInput>;
    where?: Prisma.productsWhereInput;
    limit?: number;
};
export type productsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.productsSelect<ExtArgs> | null;
    omit?: Prisma.productsOmit<ExtArgs> | null;
    include?: Prisma.productsInclude<ExtArgs> | null;
    where: Prisma.productsWhereUniqueInput;
    create: Prisma.XOR<Prisma.productsCreateInput, Prisma.productsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.productsUpdateInput, Prisma.productsUncheckedUpdateInput>;
};
export type productsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.productsSelect<ExtArgs> | null;
    omit?: Prisma.productsOmit<ExtArgs> | null;
    include?: Prisma.productsInclude<ExtArgs> | null;
    where: Prisma.productsWhereUniqueInput;
};
export type productsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.productsWhereInput;
    limit?: number;
};
export type products$pallet_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.pallet_itemsSelect<ExtArgs> | null;
    omit?: Prisma.pallet_itemsOmit<ExtArgs> | null;
    include?: Prisma.pallet_itemsInclude<ExtArgs> | null;
    where?: Prisma.pallet_itemsWhereInput;
    orderBy?: Prisma.pallet_itemsOrderByWithRelationInput | Prisma.pallet_itemsOrderByWithRelationInput[];
    cursor?: Prisma.pallet_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Pallet_itemsScalarFieldEnum | Prisma.Pallet_itemsScalarFieldEnum[];
};
export type products$picking_itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.picking_itemsSelect<ExtArgs> | null;
    omit?: Prisma.picking_itemsOmit<ExtArgs> | null;
    include?: Prisma.picking_itemsInclude<ExtArgs> | null;
    where?: Prisma.picking_itemsWhereInput;
    orderBy?: Prisma.picking_itemsOrderByWithRelationInput | Prisma.picking_itemsOrderByWithRelationInput[];
    cursor?: Prisma.picking_itemsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Picking_itemsScalarFieldEnum | Prisma.Picking_itemsScalarFieldEnum[];
};
export type products$product_taxesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type products$warehouse_stockArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stockSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stockOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stockInclude<ExtArgs> | null;
    where?: Prisma.warehouse_stockWhereInput;
    orderBy?: Prisma.warehouse_stockOrderByWithRelationInput | Prisma.warehouse_stockOrderByWithRelationInput[];
    cursor?: Prisma.warehouse_stockWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Warehouse_stockScalarFieldEnum | Prisma.Warehouse_stockScalarFieldEnum[];
};
export type products$warehouse_stock_movementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stock_movementsSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stock_movementsOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stock_movementsInclude<ExtArgs> | null;
    where?: Prisma.warehouse_stock_movementsWhereInput;
    orderBy?: Prisma.warehouse_stock_movementsOrderByWithRelationInput | Prisma.warehouse_stock_movementsOrderByWithRelationInput[];
    cursor?: Prisma.warehouse_stock_movementsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Warehouse_stock_movementsScalarFieldEnum | Prisma.Warehouse_stock_movementsScalarFieldEnum[];
};
export type productsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.productsSelect<ExtArgs> | null;
    omit?: Prisma.productsOmit<ExtArgs> | null;
    include?: Prisma.productsInclude<ExtArgs> | null;
};
