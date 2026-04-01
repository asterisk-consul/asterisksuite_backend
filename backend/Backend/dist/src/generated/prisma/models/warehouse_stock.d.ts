import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type warehouse_stockModel = runtime.Types.Result.DefaultSelection<Prisma.$warehouse_stockPayload>;
export type AggregateWarehouse_stock = {
    _count: Warehouse_stockCountAggregateOutputType | null;
    _avg: Warehouse_stockAvgAggregateOutputType | null;
    _sum: Warehouse_stockSumAggregateOutputType | null;
    _min: Warehouse_stockMinAggregateOutputType | null;
    _max: Warehouse_stockMaxAggregateOutputType | null;
};
export type Warehouse_stockAvgAggregateOutputType = {
    quantity: runtime.Decimal | null;
    reserved_quantity: runtime.Decimal | null;
};
export type Warehouse_stockSumAggregateOutputType = {
    quantity: runtime.Decimal | null;
    reserved_quantity: runtime.Decimal | null;
};
export type Warehouse_stockMinAggregateOutputType = {
    id: string | null;
    warehouse_id: string | null;
    product_id: string | null;
    quantity: runtime.Decimal | null;
    reserved_quantity: runtime.Decimal | null;
    updated_at: Date | null;
};
export type Warehouse_stockMaxAggregateOutputType = {
    id: string | null;
    warehouse_id: string | null;
    product_id: string | null;
    quantity: runtime.Decimal | null;
    reserved_quantity: runtime.Decimal | null;
    updated_at: Date | null;
};
export type Warehouse_stockCountAggregateOutputType = {
    id: number;
    warehouse_id: number;
    product_id: number;
    quantity: number;
    reserved_quantity: number;
    updated_at: number;
    _all: number;
};
export type Warehouse_stockAvgAggregateInputType = {
    quantity?: true;
    reserved_quantity?: true;
};
export type Warehouse_stockSumAggregateInputType = {
    quantity?: true;
    reserved_quantity?: true;
};
export type Warehouse_stockMinAggregateInputType = {
    id?: true;
    warehouse_id?: true;
    product_id?: true;
    quantity?: true;
    reserved_quantity?: true;
    updated_at?: true;
};
export type Warehouse_stockMaxAggregateInputType = {
    id?: true;
    warehouse_id?: true;
    product_id?: true;
    quantity?: true;
    reserved_quantity?: true;
    updated_at?: true;
};
export type Warehouse_stockCountAggregateInputType = {
    id?: true;
    warehouse_id?: true;
    product_id?: true;
    quantity?: true;
    reserved_quantity?: true;
    updated_at?: true;
    _all?: true;
};
export type Warehouse_stockAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.warehouse_stockWhereInput;
    orderBy?: Prisma.warehouse_stockOrderByWithRelationInput | Prisma.warehouse_stockOrderByWithRelationInput[];
    cursor?: Prisma.warehouse_stockWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Warehouse_stockCountAggregateInputType;
    _avg?: Warehouse_stockAvgAggregateInputType;
    _sum?: Warehouse_stockSumAggregateInputType;
    _min?: Warehouse_stockMinAggregateInputType;
    _max?: Warehouse_stockMaxAggregateInputType;
};
export type GetWarehouse_stockAggregateType<T extends Warehouse_stockAggregateArgs> = {
    [P in keyof T & keyof AggregateWarehouse_stock]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWarehouse_stock[P]> : Prisma.GetScalarType<T[P], AggregateWarehouse_stock[P]>;
};
export type warehouse_stockGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.warehouse_stockWhereInput;
    orderBy?: Prisma.warehouse_stockOrderByWithAggregationInput | Prisma.warehouse_stockOrderByWithAggregationInput[];
    by: Prisma.Warehouse_stockScalarFieldEnum[] | Prisma.Warehouse_stockScalarFieldEnum;
    having?: Prisma.warehouse_stockScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Warehouse_stockCountAggregateInputType | true;
    _avg?: Warehouse_stockAvgAggregateInputType;
    _sum?: Warehouse_stockSumAggregateInputType;
    _min?: Warehouse_stockMinAggregateInputType;
    _max?: Warehouse_stockMaxAggregateInputType;
};
export type Warehouse_stockGroupByOutputType = {
    id: string;
    warehouse_id: string;
    product_id: string;
    quantity: runtime.Decimal;
    reserved_quantity: runtime.Decimal;
    updated_at: Date;
    _count: Warehouse_stockCountAggregateOutputType | null;
    _avg: Warehouse_stockAvgAggregateOutputType | null;
    _sum: Warehouse_stockSumAggregateOutputType | null;
    _min: Warehouse_stockMinAggregateOutputType | null;
    _max: Warehouse_stockMaxAggregateOutputType | null;
};
export type GetWarehouse_stockGroupByPayload<T extends warehouse_stockGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Warehouse_stockGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Warehouse_stockGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Warehouse_stockGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Warehouse_stockGroupByOutputType[P]>;
}>>;
export type warehouse_stockWhereInput = {
    AND?: Prisma.warehouse_stockWhereInput | Prisma.warehouse_stockWhereInput[];
    OR?: Prisma.warehouse_stockWhereInput[];
    NOT?: Prisma.warehouse_stockWhereInput | Prisma.warehouse_stockWhereInput[];
    id?: Prisma.UuidFilter<"warehouse_stock"> | string;
    warehouse_id?: Prisma.UuidFilter<"warehouse_stock"> | string;
    product_id?: Prisma.UuidFilter<"warehouse_stock"> | string;
    quantity?: Prisma.DecimalFilter<"warehouse_stock"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: Prisma.DecimalFilter<"warehouse_stock"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Prisma.DateTimeFilter<"warehouse_stock"> | Date | string;
    products?: Prisma.XOR<Prisma.ProductsScalarRelationFilter, Prisma.productsWhereInput>;
    warehouses?: Prisma.XOR<Prisma.WarehousesScalarRelationFilter, Prisma.warehousesWhereInput>;
};
export type warehouse_stockOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reserved_quantity?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    products?: Prisma.productsOrderByWithRelationInput;
    warehouses?: Prisma.warehousesOrderByWithRelationInput;
};
export type warehouse_stockWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    warehouse_id_product_id?: Prisma.warehouse_stockWarehouse_idProduct_idCompoundUniqueInput;
    AND?: Prisma.warehouse_stockWhereInput | Prisma.warehouse_stockWhereInput[];
    OR?: Prisma.warehouse_stockWhereInput[];
    NOT?: Prisma.warehouse_stockWhereInput | Prisma.warehouse_stockWhereInput[];
    warehouse_id?: Prisma.UuidFilter<"warehouse_stock"> | string;
    product_id?: Prisma.UuidFilter<"warehouse_stock"> | string;
    quantity?: Prisma.DecimalFilter<"warehouse_stock"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: Prisma.DecimalFilter<"warehouse_stock"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Prisma.DateTimeFilter<"warehouse_stock"> | Date | string;
    products?: Prisma.XOR<Prisma.ProductsScalarRelationFilter, Prisma.productsWhereInput>;
    warehouses?: Prisma.XOR<Prisma.WarehousesScalarRelationFilter, Prisma.warehousesWhereInput>;
}, "id" | "warehouse_id_product_id">;
export type warehouse_stockOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reserved_quantity?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
    _count?: Prisma.warehouse_stockCountOrderByAggregateInput;
    _avg?: Prisma.warehouse_stockAvgOrderByAggregateInput;
    _max?: Prisma.warehouse_stockMaxOrderByAggregateInput;
    _min?: Prisma.warehouse_stockMinOrderByAggregateInput;
    _sum?: Prisma.warehouse_stockSumOrderByAggregateInput;
};
export type warehouse_stockScalarWhereWithAggregatesInput = {
    AND?: Prisma.warehouse_stockScalarWhereWithAggregatesInput | Prisma.warehouse_stockScalarWhereWithAggregatesInput[];
    OR?: Prisma.warehouse_stockScalarWhereWithAggregatesInput[];
    NOT?: Prisma.warehouse_stockScalarWhereWithAggregatesInput | Prisma.warehouse_stockScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"warehouse_stock"> | string;
    warehouse_id?: Prisma.UuidWithAggregatesFilter<"warehouse_stock"> | string;
    product_id?: Prisma.UuidWithAggregatesFilter<"warehouse_stock"> | string;
    quantity?: Prisma.DecimalWithAggregatesFilter<"warehouse_stock"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: Prisma.DecimalWithAggregatesFilter<"warehouse_stock"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Prisma.DateTimeWithAggregatesFilter<"warehouse_stock"> | Date | string;
};
export type warehouse_stockCreateInput = {
    id?: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Date | string;
    products: Prisma.productsCreateNestedOneWithoutWarehouse_stockInput;
    warehouses: Prisma.warehousesCreateNestedOneWithoutWarehouse_stockInput;
};
export type warehouse_stockUncheckedCreateInput = {
    id?: string;
    warehouse_id: string;
    product_id: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Date | string;
};
export type warehouse_stockUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    products?: Prisma.productsUpdateOneRequiredWithoutWarehouse_stockNestedInput;
    warehouses?: Prisma.warehousesUpdateOneRequiredWithoutWarehouse_stockNestedInput;
};
export type warehouse_stockUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type warehouse_stockCreateManyInput = {
    id?: string;
    warehouse_id: string;
    product_id: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Date | string;
};
export type warehouse_stockUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type warehouse_stockUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type Warehouse_stockListRelationFilter = {
    every?: Prisma.warehouse_stockWhereInput;
    some?: Prisma.warehouse_stockWhereInput;
    none?: Prisma.warehouse_stockWhereInput;
};
export type warehouse_stockOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type warehouse_stockWarehouse_idProduct_idCompoundUniqueInput = {
    warehouse_id: string;
    product_id: string;
};
export type warehouse_stockCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reserved_quantity?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type warehouse_stockAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    reserved_quantity?: Prisma.SortOrder;
};
export type warehouse_stockMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reserved_quantity?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type warehouse_stockMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reserved_quantity?: Prisma.SortOrder;
    updated_at?: Prisma.SortOrder;
};
export type warehouse_stockSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
    reserved_quantity?: Prisma.SortOrder;
};
export type warehouse_stockCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.warehouse_stockCreateWithoutProductsInput, Prisma.warehouse_stockUncheckedCreateWithoutProductsInput> | Prisma.warehouse_stockCreateWithoutProductsInput[] | Prisma.warehouse_stockUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.warehouse_stockCreateOrConnectWithoutProductsInput | Prisma.warehouse_stockCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.warehouse_stockCreateManyProductsInputEnvelope;
    connect?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
};
export type warehouse_stockUncheckedCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.warehouse_stockCreateWithoutProductsInput, Prisma.warehouse_stockUncheckedCreateWithoutProductsInput> | Prisma.warehouse_stockCreateWithoutProductsInput[] | Prisma.warehouse_stockUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.warehouse_stockCreateOrConnectWithoutProductsInput | Prisma.warehouse_stockCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.warehouse_stockCreateManyProductsInputEnvelope;
    connect?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
};
export type warehouse_stockUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.warehouse_stockCreateWithoutProductsInput, Prisma.warehouse_stockUncheckedCreateWithoutProductsInput> | Prisma.warehouse_stockCreateWithoutProductsInput[] | Prisma.warehouse_stockUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.warehouse_stockCreateOrConnectWithoutProductsInput | Prisma.warehouse_stockCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.warehouse_stockUpsertWithWhereUniqueWithoutProductsInput | Prisma.warehouse_stockUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.warehouse_stockCreateManyProductsInputEnvelope;
    set?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    disconnect?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    delete?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    connect?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    update?: Prisma.warehouse_stockUpdateWithWhereUniqueWithoutProductsInput | Prisma.warehouse_stockUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.warehouse_stockUpdateManyWithWhereWithoutProductsInput | Prisma.warehouse_stockUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.warehouse_stockScalarWhereInput | Prisma.warehouse_stockScalarWhereInput[];
};
export type warehouse_stockUncheckedUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.warehouse_stockCreateWithoutProductsInput, Prisma.warehouse_stockUncheckedCreateWithoutProductsInput> | Prisma.warehouse_stockCreateWithoutProductsInput[] | Prisma.warehouse_stockUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.warehouse_stockCreateOrConnectWithoutProductsInput | Prisma.warehouse_stockCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.warehouse_stockUpsertWithWhereUniqueWithoutProductsInput | Prisma.warehouse_stockUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.warehouse_stockCreateManyProductsInputEnvelope;
    set?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    disconnect?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    delete?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    connect?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    update?: Prisma.warehouse_stockUpdateWithWhereUniqueWithoutProductsInput | Prisma.warehouse_stockUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.warehouse_stockUpdateManyWithWhereWithoutProductsInput | Prisma.warehouse_stockUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.warehouse_stockScalarWhereInput | Prisma.warehouse_stockScalarWhereInput[];
};
export type warehouse_stockCreateNestedManyWithoutWarehousesInput = {
    create?: Prisma.XOR<Prisma.warehouse_stockCreateWithoutWarehousesInput, Prisma.warehouse_stockUncheckedCreateWithoutWarehousesInput> | Prisma.warehouse_stockCreateWithoutWarehousesInput[] | Prisma.warehouse_stockUncheckedCreateWithoutWarehousesInput[];
    connectOrCreate?: Prisma.warehouse_stockCreateOrConnectWithoutWarehousesInput | Prisma.warehouse_stockCreateOrConnectWithoutWarehousesInput[];
    createMany?: Prisma.warehouse_stockCreateManyWarehousesInputEnvelope;
    connect?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
};
export type warehouse_stockUncheckedCreateNestedManyWithoutWarehousesInput = {
    create?: Prisma.XOR<Prisma.warehouse_stockCreateWithoutWarehousesInput, Prisma.warehouse_stockUncheckedCreateWithoutWarehousesInput> | Prisma.warehouse_stockCreateWithoutWarehousesInput[] | Prisma.warehouse_stockUncheckedCreateWithoutWarehousesInput[];
    connectOrCreate?: Prisma.warehouse_stockCreateOrConnectWithoutWarehousesInput | Prisma.warehouse_stockCreateOrConnectWithoutWarehousesInput[];
    createMany?: Prisma.warehouse_stockCreateManyWarehousesInputEnvelope;
    connect?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
};
export type warehouse_stockUpdateManyWithoutWarehousesNestedInput = {
    create?: Prisma.XOR<Prisma.warehouse_stockCreateWithoutWarehousesInput, Prisma.warehouse_stockUncheckedCreateWithoutWarehousesInput> | Prisma.warehouse_stockCreateWithoutWarehousesInput[] | Prisma.warehouse_stockUncheckedCreateWithoutWarehousesInput[];
    connectOrCreate?: Prisma.warehouse_stockCreateOrConnectWithoutWarehousesInput | Prisma.warehouse_stockCreateOrConnectWithoutWarehousesInput[];
    upsert?: Prisma.warehouse_stockUpsertWithWhereUniqueWithoutWarehousesInput | Prisma.warehouse_stockUpsertWithWhereUniqueWithoutWarehousesInput[];
    createMany?: Prisma.warehouse_stockCreateManyWarehousesInputEnvelope;
    set?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    disconnect?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    delete?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    connect?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    update?: Prisma.warehouse_stockUpdateWithWhereUniqueWithoutWarehousesInput | Prisma.warehouse_stockUpdateWithWhereUniqueWithoutWarehousesInput[];
    updateMany?: Prisma.warehouse_stockUpdateManyWithWhereWithoutWarehousesInput | Prisma.warehouse_stockUpdateManyWithWhereWithoutWarehousesInput[];
    deleteMany?: Prisma.warehouse_stockScalarWhereInput | Prisma.warehouse_stockScalarWhereInput[];
};
export type warehouse_stockUncheckedUpdateManyWithoutWarehousesNestedInput = {
    create?: Prisma.XOR<Prisma.warehouse_stockCreateWithoutWarehousesInput, Prisma.warehouse_stockUncheckedCreateWithoutWarehousesInput> | Prisma.warehouse_stockCreateWithoutWarehousesInput[] | Prisma.warehouse_stockUncheckedCreateWithoutWarehousesInput[];
    connectOrCreate?: Prisma.warehouse_stockCreateOrConnectWithoutWarehousesInput | Prisma.warehouse_stockCreateOrConnectWithoutWarehousesInput[];
    upsert?: Prisma.warehouse_stockUpsertWithWhereUniqueWithoutWarehousesInput | Prisma.warehouse_stockUpsertWithWhereUniqueWithoutWarehousesInput[];
    createMany?: Prisma.warehouse_stockCreateManyWarehousesInputEnvelope;
    set?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    disconnect?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    delete?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    connect?: Prisma.warehouse_stockWhereUniqueInput | Prisma.warehouse_stockWhereUniqueInput[];
    update?: Prisma.warehouse_stockUpdateWithWhereUniqueWithoutWarehousesInput | Prisma.warehouse_stockUpdateWithWhereUniqueWithoutWarehousesInput[];
    updateMany?: Prisma.warehouse_stockUpdateManyWithWhereWithoutWarehousesInput | Prisma.warehouse_stockUpdateManyWithWhereWithoutWarehousesInput[];
    deleteMany?: Prisma.warehouse_stockScalarWhereInput | Prisma.warehouse_stockScalarWhereInput[];
};
export type warehouse_stockCreateWithoutProductsInput = {
    id?: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Date | string;
    warehouses: Prisma.warehousesCreateNestedOneWithoutWarehouse_stockInput;
};
export type warehouse_stockUncheckedCreateWithoutProductsInput = {
    id?: string;
    warehouse_id: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Date | string;
};
export type warehouse_stockCreateOrConnectWithoutProductsInput = {
    where: Prisma.warehouse_stockWhereUniqueInput;
    create: Prisma.XOR<Prisma.warehouse_stockCreateWithoutProductsInput, Prisma.warehouse_stockUncheckedCreateWithoutProductsInput>;
};
export type warehouse_stockCreateManyProductsInputEnvelope = {
    data: Prisma.warehouse_stockCreateManyProductsInput | Prisma.warehouse_stockCreateManyProductsInput[];
    skipDuplicates?: boolean;
};
export type warehouse_stockUpsertWithWhereUniqueWithoutProductsInput = {
    where: Prisma.warehouse_stockWhereUniqueInput;
    update: Prisma.XOR<Prisma.warehouse_stockUpdateWithoutProductsInput, Prisma.warehouse_stockUncheckedUpdateWithoutProductsInput>;
    create: Prisma.XOR<Prisma.warehouse_stockCreateWithoutProductsInput, Prisma.warehouse_stockUncheckedCreateWithoutProductsInput>;
};
export type warehouse_stockUpdateWithWhereUniqueWithoutProductsInput = {
    where: Prisma.warehouse_stockWhereUniqueInput;
    data: Prisma.XOR<Prisma.warehouse_stockUpdateWithoutProductsInput, Prisma.warehouse_stockUncheckedUpdateWithoutProductsInput>;
};
export type warehouse_stockUpdateManyWithWhereWithoutProductsInput = {
    where: Prisma.warehouse_stockScalarWhereInput;
    data: Prisma.XOR<Prisma.warehouse_stockUpdateManyMutationInput, Prisma.warehouse_stockUncheckedUpdateManyWithoutProductsInput>;
};
export type warehouse_stockScalarWhereInput = {
    AND?: Prisma.warehouse_stockScalarWhereInput | Prisma.warehouse_stockScalarWhereInput[];
    OR?: Prisma.warehouse_stockScalarWhereInput[];
    NOT?: Prisma.warehouse_stockScalarWhereInput | Prisma.warehouse_stockScalarWhereInput[];
    id?: Prisma.UuidFilter<"warehouse_stock"> | string;
    warehouse_id?: Prisma.UuidFilter<"warehouse_stock"> | string;
    product_id?: Prisma.UuidFilter<"warehouse_stock"> | string;
    quantity?: Prisma.DecimalFilter<"warehouse_stock"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: Prisma.DecimalFilter<"warehouse_stock"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Prisma.DateTimeFilter<"warehouse_stock"> | Date | string;
};
export type warehouse_stockCreateWithoutWarehousesInput = {
    id?: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Date | string;
    products: Prisma.productsCreateNestedOneWithoutWarehouse_stockInput;
};
export type warehouse_stockUncheckedCreateWithoutWarehousesInput = {
    id?: string;
    product_id: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Date | string;
};
export type warehouse_stockCreateOrConnectWithoutWarehousesInput = {
    where: Prisma.warehouse_stockWhereUniqueInput;
    create: Prisma.XOR<Prisma.warehouse_stockCreateWithoutWarehousesInput, Prisma.warehouse_stockUncheckedCreateWithoutWarehousesInput>;
};
export type warehouse_stockCreateManyWarehousesInputEnvelope = {
    data: Prisma.warehouse_stockCreateManyWarehousesInput | Prisma.warehouse_stockCreateManyWarehousesInput[];
    skipDuplicates?: boolean;
};
export type warehouse_stockUpsertWithWhereUniqueWithoutWarehousesInput = {
    where: Prisma.warehouse_stockWhereUniqueInput;
    update: Prisma.XOR<Prisma.warehouse_stockUpdateWithoutWarehousesInput, Prisma.warehouse_stockUncheckedUpdateWithoutWarehousesInput>;
    create: Prisma.XOR<Prisma.warehouse_stockCreateWithoutWarehousesInput, Prisma.warehouse_stockUncheckedCreateWithoutWarehousesInput>;
};
export type warehouse_stockUpdateWithWhereUniqueWithoutWarehousesInput = {
    where: Prisma.warehouse_stockWhereUniqueInput;
    data: Prisma.XOR<Prisma.warehouse_stockUpdateWithoutWarehousesInput, Prisma.warehouse_stockUncheckedUpdateWithoutWarehousesInput>;
};
export type warehouse_stockUpdateManyWithWhereWithoutWarehousesInput = {
    where: Prisma.warehouse_stockScalarWhereInput;
    data: Prisma.XOR<Prisma.warehouse_stockUpdateManyMutationInput, Prisma.warehouse_stockUncheckedUpdateManyWithoutWarehousesInput>;
};
export type warehouse_stockCreateManyProductsInput = {
    id?: string;
    warehouse_id: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Date | string;
};
export type warehouse_stockUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    warehouses?: Prisma.warehousesUpdateOneRequiredWithoutWarehouse_stockNestedInput;
};
export type warehouse_stockUncheckedUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type warehouse_stockUncheckedUpdateManyWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type warehouse_stockCreateManyWarehousesInput = {
    id?: string;
    product_id: string;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Date | string;
};
export type warehouse_stockUpdateWithoutWarehousesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    products?: Prisma.productsUpdateOneRequiredWithoutWarehouse_stockNestedInput;
};
export type warehouse_stockUncheckedUpdateWithoutWarehousesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type warehouse_stockUncheckedUpdateManyWithoutWarehousesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reserved_quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    updated_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type warehouse_stockSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    warehouse_id?: boolean;
    product_id?: boolean;
    quantity?: boolean;
    reserved_quantity?: boolean;
    updated_at?: boolean;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    warehouses?: boolean | Prisma.warehousesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["warehouse_stock"]>;
export type warehouse_stockSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    warehouse_id?: boolean;
    product_id?: boolean;
    quantity?: boolean;
    reserved_quantity?: boolean;
    updated_at?: boolean;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    warehouses?: boolean | Prisma.warehousesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["warehouse_stock"]>;
export type warehouse_stockSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    warehouse_id?: boolean;
    product_id?: boolean;
    quantity?: boolean;
    reserved_quantity?: boolean;
    updated_at?: boolean;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    warehouses?: boolean | Prisma.warehousesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["warehouse_stock"]>;
export type warehouse_stockSelectScalar = {
    id?: boolean;
    warehouse_id?: boolean;
    product_id?: boolean;
    quantity?: boolean;
    reserved_quantity?: boolean;
    updated_at?: boolean;
};
export type warehouse_stockOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "warehouse_id" | "product_id" | "quantity" | "reserved_quantity" | "updated_at", ExtArgs["result"]["warehouse_stock"]>;
export type warehouse_stockInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    warehouses?: boolean | Prisma.warehousesDefaultArgs<ExtArgs>;
};
export type warehouse_stockIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    warehouses?: boolean | Prisma.warehousesDefaultArgs<ExtArgs>;
};
export type warehouse_stockIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    warehouses?: boolean | Prisma.warehousesDefaultArgs<ExtArgs>;
};
export type $warehouse_stockPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "warehouse_stock";
    objects: {
        products: Prisma.$productsPayload<ExtArgs>;
        warehouses: Prisma.$warehousesPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        warehouse_id: string;
        product_id: string;
        quantity: runtime.Decimal;
        reserved_quantity: runtime.Decimal;
        updated_at: Date;
    }, ExtArgs["result"]["warehouse_stock"]>;
    composites: {};
};
export type warehouse_stockGetPayload<S extends boolean | null | undefined | warehouse_stockDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$warehouse_stockPayload, S>;
export type warehouse_stockCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<warehouse_stockFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Warehouse_stockCountAggregateInputType | true;
};
export interface warehouse_stockDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['warehouse_stock'];
        meta: {
            name: 'warehouse_stock';
        };
    };
    findUnique<T extends warehouse_stockFindUniqueArgs>(args: Prisma.SelectSubset<T, warehouse_stockFindUniqueArgs<ExtArgs>>): Prisma.Prisma__warehouse_stockClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stockPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends warehouse_stockFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, warehouse_stockFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__warehouse_stockClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stockPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends warehouse_stockFindFirstArgs>(args?: Prisma.SelectSubset<T, warehouse_stockFindFirstArgs<ExtArgs>>): Prisma.Prisma__warehouse_stockClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stockPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends warehouse_stockFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, warehouse_stockFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__warehouse_stockClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stockPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends warehouse_stockFindManyArgs>(args?: Prisma.SelectSubset<T, warehouse_stockFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$warehouse_stockPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends warehouse_stockCreateArgs>(args: Prisma.SelectSubset<T, warehouse_stockCreateArgs<ExtArgs>>): Prisma.Prisma__warehouse_stockClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stockPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends warehouse_stockCreateManyArgs>(args?: Prisma.SelectSubset<T, warehouse_stockCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends warehouse_stockCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, warehouse_stockCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$warehouse_stockPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends warehouse_stockDeleteArgs>(args: Prisma.SelectSubset<T, warehouse_stockDeleteArgs<ExtArgs>>): Prisma.Prisma__warehouse_stockClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stockPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends warehouse_stockUpdateArgs>(args: Prisma.SelectSubset<T, warehouse_stockUpdateArgs<ExtArgs>>): Prisma.Prisma__warehouse_stockClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stockPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends warehouse_stockDeleteManyArgs>(args?: Prisma.SelectSubset<T, warehouse_stockDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends warehouse_stockUpdateManyArgs>(args: Prisma.SelectSubset<T, warehouse_stockUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends warehouse_stockUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, warehouse_stockUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$warehouse_stockPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends warehouse_stockUpsertArgs>(args: Prisma.SelectSubset<T, warehouse_stockUpsertArgs<ExtArgs>>): Prisma.Prisma__warehouse_stockClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stockPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends warehouse_stockCountArgs>(args?: Prisma.Subset<T, warehouse_stockCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Warehouse_stockCountAggregateOutputType> : number>;
    aggregate<T extends Warehouse_stockAggregateArgs>(args: Prisma.Subset<T, Warehouse_stockAggregateArgs>): Prisma.PrismaPromise<GetWarehouse_stockAggregateType<T>>;
    groupBy<T extends warehouse_stockGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: warehouse_stockGroupByArgs['orderBy'];
    } : {
        orderBy?: warehouse_stockGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, warehouse_stockGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWarehouse_stockGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: warehouse_stockFieldRefs;
}
export interface Prisma__warehouse_stockClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    products<T extends Prisma.productsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.productsDefaultArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    warehouses<T extends Prisma.warehousesDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.warehousesDefaultArgs<ExtArgs>>): Prisma.Prisma__warehousesClient<runtime.Types.Result.GetResult<Prisma.$warehousesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface warehouse_stockFieldRefs {
    readonly id: Prisma.FieldRef<"warehouse_stock", 'String'>;
    readonly warehouse_id: Prisma.FieldRef<"warehouse_stock", 'String'>;
    readonly product_id: Prisma.FieldRef<"warehouse_stock", 'String'>;
    readonly quantity: Prisma.FieldRef<"warehouse_stock", 'Decimal'>;
    readonly reserved_quantity: Prisma.FieldRef<"warehouse_stock", 'Decimal'>;
    readonly updated_at: Prisma.FieldRef<"warehouse_stock", 'DateTime'>;
}
export type warehouse_stockFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stockSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stockOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stockInclude<ExtArgs> | null;
    where: Prisma.warehouse_stockWhereUniqueInput;
};
export type warehouse_stockFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stockSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stockOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stockInclude<ExtArgs> | null;
    where: Prisma.warehouse_stockWhereUniqueInput;
};
export type warehouse_stockFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type warehouse_stockFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type warehouse_stockFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type warehouse_stockCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stockSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stockOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stockInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.warehouse_stockCreateInput, Prisma.warehouse_stockUncheckedCreateInput>;
};
export type warehouse_stockCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.warehouse_stockCreateManyInput | Prisma.warehouse_stockCreateManyInput[];
    skipDuplicates?: boolean;
};
export type warehouse_stockCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stockSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.warehouse_stockOmit<ExtArgs> | null;
    data: Prisma.warehouse_stockCreateManyInput | Prisma.warehouse_stockCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.warehouse_stockIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type warehouse_stockUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stockSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stockOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stockInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.warehouse_stockUpdateInput, Prisma.warehouse_stockUncheckedUpdateInput>;
    where: Prisma.warehouse_stockWhereUniqueInput;
};
export type warehouse_stockUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.warehouse_stockUpdateManyMutationInput, Prisma.warehouse_stockUncheckedUpdateManyInput>;
    where?: Prisma.warehouse_stockWhereInput;
    limit?: number;
};
export type warehouse_stockUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stockSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.warehouse_stockOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.warehouse_stockUpdateManyMutationInput, Prisma.warehouse_stockUncheckedUpdateManyInput>;
    where?: Prisma.warehouse_stockWhereInput;
    limit?: number;
    include?: Prisma.warehouse_stockIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type warehouse_stockUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stockSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stockOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stockInclude<ExtArgs> | null;
    where: Prisma.warehouse_stockWhereUniqueInput;
    create: Prisma.XOR<Prisma.warehouse_stockCreateInput, Prisma.warehouse_stockUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.warehouse_stockUpdateInput, Prisma.warehouse_stockUncheckedUpdateInput>;
};
export type warehouse_stockDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stockSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stockOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stockInclude<ExtArgs> | null;
    where: Prisma.warehouse_stockWhereUniqueInput;
};
export type warehouse_stockDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.warehouse_stockWhereInput;
    limit?: number;
};
export type warehouse_stockDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stockSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stockOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stockInclude<ExtArgs> | null;
};
