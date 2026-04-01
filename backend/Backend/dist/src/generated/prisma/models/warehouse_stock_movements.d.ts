import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type warehouse_stock_movementsModel = runtime.Types.Result.DefaultSelection<Prisma.$warehouse_stock_movementsPayload>;
export type AggregateWarehouse_stock_movements = {
    _count: Warehouse_stock_movementsCountAggregateOutputType | null;
    _avg: Warehouse_stock_movementsAvgAggregateOutputType | null;
    _sum: Warehouse_stock_movementsSumAggregateOutputType | null;
    _min: Warehouse_stock_movementsMinAggregateOutputType | null;
    _max: Warehouse_stock_movementsMaxAggregateOutputType | null;
};
export type Warehouse_stock_movementsAvgAggregateOutputType = {
    quantity: runtime.Decimal | null;
};
export type Warehouse_stock_movementsSumAggregateOutputType = {
    quantity: runtime.Decimal | null;
};
export type Warehouse_stock_movementsMinAggregateOutputType = {
    id: string | null;
    warehouse_id: string | null;
    product_id: string | null;
    movement_type: string | null;
    direction: string | null;
    quantity: runtime.Decimal | null;
    reference_type: string | null;
    reference_id: string | null;
    notes: string | null;
    created_at: Date | null;
    created_by: string | null;
};
export type Warehouse_stock_movementsMaxAggregateOutputType = {
    id: string | null;
    warehouse_id: string | null;
    product_id: string | null;
    movement_type: string | null;
    direction: string | null;
    quantity: runtime.Decimal | null;
    reference_type: string | null;
    reference_id: string | null;
    notes: string | null;
    created_at: Date | null;
    created_by: string | null;
};
export type Warehouse_stock_movementsCountAggregateOutputType = {
    id: number;
    warehouse_id: number;
    product_id: number;
    movement_type: number;
    direction: number;
    quantity: number;
    reference_type: number;
    reference_id: number;
    notes: number;
    created_at: number;
    created_by: number;
    _all: number;
};
export type Warehouse_stock_movementsAvgAggregateInputType = {
    quantity?: true;
};
export type Warehouse_stock_movementsSumAggregateInputType = {
    quantity?: true;
};
export type Warehouse_stock_movementsMinAggregateInputType = {
    id?: true;
    warehouse_id?: true;
    product_id?: true;
    movement_type?: true;
    direction?: true;
    quantity?: true;
    reference_type?: true;
    reference_id?: true;
    notes?: true;
    created_at?: true;
    created_by?: true;
};
export type Warehouse_stock_movementsMaxAggregateInputType = {
    id?: true;
    warehouse_id?: true;
    product_id?: true;
    movement_type?: true;
    direction?: true;
    quantity?: true;
    reference_type?: true;
    reference_id?: true;
    notes?: true;
    created_at?: true;
    created_by?: true;
};
export type Warehouse_stock_movementsCountAggregateInputType = {
    id?: true;
    warehouse_id?: true;
    product_id?: true;
    movement_type?: true;
    direction?: true;
    quantity?: true;
    reference_type?: true;
    reference_id?: true;
    notes?: true;
    created_at?: true;
    created_by?: true;
    _all?: true;
};
export type Warehouse_stock_movementsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.warehouse_stock_movementsWhereInput;
    orderBy?: Prisma.warehouse_stock_movementsOrderByWithRelationInput | Prisma.warehouse_stock_movementsOrderByWithRelationInput[];
    cursor?: Prisma.warehouse_stock_movementsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Warehouse_stock_movementsCountAggregateInputType;
    _avg?: Warehouse_stock_movementsAvgAggregateInputType;
    _sum?: Warehouse_stock_movementsSumAggregateInputType;
    _min?: Warehouse_stock_movementsMinAggregateInputType;
    _max?: Warehouse_stock_movementsMaxAggregateInputType;
};
export type GetWarehouse_stock_movementsAggregateType<T extends Warehouse_stock_movementsAggregateArgs> = {
    [P in keyof T & keyof AggregateWarehouse_stock_movements]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWarehouse_stock_movements[P]> : Prisma.GetScalarType<T[P], AggregateWarehouse_stock_movements[P]>;
};
export type warehouse_stock_movementsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.warehouse_stock_movementsWhereInput;
    orderBy?: Prisma.warehouse_stock_movementsOrderByWithAggregationInput | Prisma.warehouse_stock_movementsOrderByWithAggregationInput[];
    by: Prisma.Warehouse_stock_movementsScalarFieldEnum[] | Prisma.Warehouse_stock_movementsScalarFieldEnum;
    having?: Prisma.warehouse_stock_movementsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Warehouse_stock_movementsCountAggregateInputType | true;
    _avg?: Warehouse_stock_movementsAvgAggregateInputType;
    _sum?: Warehouse_stock_movementsSumAggregateInputType;
    _min?: Warehouse_stock_movementsMinAggregateInputType;
    _max?: Warehouse_stock_movementsMaxAggregateInputType;
};
export type Warehouse_stock_movementsGroupByOutputType = {
    id: string;
    warehouse_id: string;
    product_id: string;
    movement_type: string;
    direction: string;
    quantity: runtime.Decimal;
    reference_type: string | null;
    reference_id: string | null;
    notes: string | null;
    created_at: Date;
    created_by: string | null;
    _count: Warehouse_stock_movementsCountAggregateOutputType | null;
    _avg: Warehouse_stock_movementsAvgAggregateOutputType | null;
    _sum: Warehouse_stock_movementsSumAggregateOutputType | null;
    _min: Warehouse_stock_movementsMinAggregateOutputType | null;
    _max: Warehouse_stock_movementsMaxAggregateOutputType | null;
};
export type GetWarehouse_stock_movementsGroupByPayload<T extends warehouse_stock_movementsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Warehouse_stock_movementsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Warehouse_stock_movementsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Warehouse_stock_movementsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Warehouse_stock_movementsGroupByOutputType[P]>;
}>>;
export type warehouse_stock_movementsWhereInput = {
    AND?: Prisma.warehouse_stock_movementsWhereInput | Prisma.warehouse_stock_movementsWhereInput[];
    OR?: Prisma.warehouse_stock_movementsWhereInput[];
    NOT?: Prisma.warehouse_stock_movementsWhereInput | Prisma.warehouse_stock_movementsWhereInput[];
    id?: Prisma.UuidFilter<"warehouse_stock_movements"> | string;
    warehouse_id?: Prisma.UuidFilter<"warehouse_stock_movements"> | string;
    product_id?: Prisma.UuidFilter<"warehouse_stock_movements"> | string;
    movement_type?: Prisma.StringFilter<"warehouse_stock_movements"> | string;
    direction?: Prisma.StringFilter<"warehouse_stock_movements"> | string;
    quantity?: Prisma.DecimalFilter<"warehouse_stock_movements"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.StringNullableFilter<"warehouse_stock_movements"> | string | null;
    reference_id?: Prisma.UuidNullableFilter<"warehouse_stock_movements"> | string | null;
    notes?: Prisma.StringNullableFilter<"warehouse_stock_movements"> | string | null;
    created_at?: Prisma.DateTimeFilter<"warehouse_stock_movements"> | Date | string;
    created_by?: Prisma.UuidNullableFilter<"warehouse_stock_movements"> | string | null;
    users?: Prisma.XOR<Prisma.UsersNullableScalarRelationFilter, Prisma.usersWhereInput> | null;
    products?: Prisma.XOR<Prisma.ProductsScalarRelationFilter, Prisma.productsWhereInput>;
    warehouses?: Prisma.XOR<Prisma.WarehousesScalarRelationFilter, Prisma.warehousesWhereInput>;
};
export type warehouse_stock_movementsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    movement_type?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reference_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    reference_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    created_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    users?: Prisma.usersOrderByWithRelationInput;
    products?: Prisma.productsOrderByWithRelationInput;
    warehouses?: Prisma.warehousesOrderByWithRelationInput;
};
export type warehouse_stock_movementsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.warehouse_stock_movementsWhereInput | Prisma.warehouse_stock_movementsWhereInput[];
    OR?: Prisma.warehouse_stock_movementsWhereInput[];
    NOT?: Prisma.warehouse_stock_movementsWhereInput | Prisma.warehouse_stock_movementsWhereInput[];
    warehouse_id?: Prisma.UuidFilter<"warehouse_stock_movements"> | string;
    product_id?: Prisma.UuidFilter<"warehouse_stock_movements"> | string;
    movement_type?: Prisma.StringFilter<"warehouse_stock_movements"> | string;
    direction?: Prisma.StringFilter<"warehouse_stock_movements"> | string;
    quantity?: Prisma.DecimalFilter<"warehouse_stock_movements"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.StringNullableFilter<"warehouse_stock_movements"> | string | null;
    reference_id?: Prisma.UuidNullableFilter<"warehouse_stock_movements"> | string | null;
    notes?: Prisma.StringNullableFilter<"warehouse_stock_movements"> | string | null;
    created_at?: Prisma.DateTimeFilter<"warehouse_stock_movements"> | Date | string;
    created_by?: Prisma.UuidNullableFilter<"warehouse_stock_movements"> | string | null;
    users?: Prisma.XOR<Prisma.UsersNullableScalarRelationFilter, Prisma.usersWhereInput> | null;
    products?: Prisma.XOR<Prisma.ProductsScalarRelationFilter, Prisma.productsWhereInput>;
    warehouses?: Prisma.XOR<Prisma.WarehousesScalarRelationFilter, Prisma.warehousesWhereInput>;
}, "id">;
export type warehouse_stock_movementsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    movement_type?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reference_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    reference_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    created_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.warehouse_stock_movementsCountOrderByAggregateInput;
    _avg?: Prisma.warehouse_stock_movementsAvgOrderByAggregateInput;
    _max?: Prisma.warehouse_stock_movementsMaxOrderByAggregateInput;
    _min?: Prisma.warehouse_stock_movementsMinOrderByAggregateInput;
    _sum?: Prisma.warehouse_stock_movementsSumOrderByAggregateInput;
};
export type warehouse_stock_movementsScalarWhereWithAggregatesInput = {
    AND?: Prisma.warehouse_stock_movementsScalarWhereWithAggregatesInput | Prisma.warehouse_stock_movementsScalarWhereWithAggregatesInput[];
    OR?: Prisma.warehouse_stock_movementsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.warehouse_stock_movementsScalarWhereWithAggregatesInput | Prisma.warehouse_stock_movementsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"warehouse_stock_movements"> | string;
    warehouse_id?: Prisma.UuidWithAggregatesFilter<"warehouse_stock_movements"> | string;
    product_id?: Prisma.UuidWithAggregatesFilter<"warehouse_stock_movements"> | string;
    movement_type?: Prisma.StringWithAggregatesFilter<"warehouse_stock_movements"> | string;
    direction?: Prisma.StringWithAggregatesFilter<"warehouse_stock_movements"> | string;
    quantity?: Prisma.DecimalWithAggregatesFilter<"warehouse_stock_movements"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.StringNullableWithAggregatesFilter<"warehouse_stock_movements"> | string | null;
    reference_id?: Prisma.UuidNullableWithAggregatesFilter<"warehouse_stock_movements"> | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"warehouse_stock_movements"> | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"warehouse_stock_movements"> | Date | string;
    created_by?: Prisma.UuidNullableWithAggregatesFilter<"warehouse_stock_movements"> | string | null;
};
export type warehouse_stock_movementsCreateInput = {
    id?: string;
    movement_type: string;
    direction: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: string | null;
    reference_id?: string | null;
    notes?: string | null;
    created_at?: Date | string;
    users?: Prisma.usersCreateNestedOneWithoutWarehouse_stock_movementsInput;
    products: Prisma.productsCreateNestedOneWithoutWarehouse_stock_movementsInput;
    warehouses: Prisma.warehousesCreateNestedOneWithoutWarehouse_stock_movementsInput;
};
export type warehouse_stock_movementsUncheckedCreateInput = {
    id?: string;
    warehouse_id: string;
    product_id: string;
    movement_type: string;
    direction: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: string | null;
    reference_id?: string | null;
    notes?: string | null;
    created_at?: Date | string;
    created_by?: string | null;
};
export type warehouse_stock_movementsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    movement_type?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reference_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.usersUpdateOneWithoutWarehouse_stock_movementsNestedInput;
    products?: Prisma.productsUpdateOneRequiredWithoutWarehouse_stock_movementsNestedInput;
    warehouses?: Prisma.warehousesUpdateOneRequiredWithoutWarehouse_stock_movementsNestedInput;
};
export type warehouse_stock_movementsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    movement_type?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reference_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type warehouse_stock_movementsCreateManyInput = {
    id?: string;
    warehouse_id: string;
    product_id: string;
    movement_type: string;
    direction: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: string | null;
    reference_id?: string | null;
    notes?: string | null;
    created_at?: Date | string;
    created_by?: string | null;
};
export type warehouse_stock_movementsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    movement_type?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reference_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type warehouse_stock_movementsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    movement_type?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reference_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type Warehouse_stock_movementsListRelationFilter = {
    every?: Prisma.warehouse_stock_movementsWhereInput;
    some?: Prisma.warehouse_stock_movementsWhereInput;
    none?: Prisma.warehouse_stock_movementsWhereInput;
};
export type warehouse_stock_movementsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type warehouse_stock_movementsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    movement_type?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reference_type?: Prisma.SortOrder;
    reference_id?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    created_by?: Prisma.SortOrder;
};
export type warehouse_stock_movementsAvgOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type warehouse_stock_movementsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    movement_type?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reference_type?: Prisma.SortOrder;
    reference_id?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    created_by?: Prisma.SortOrder;
};
export type warehouse_stock_movementsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    warehouse_id?: Prisma.SortOrder;
    product_id?: Prisma.SortOrder;
    movement_type?: Prisma.SortOrder;
    direction?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    reference_type?: Prisma.SortOrder;
    reference_id?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    created_by?: Prisma.SortOrder;
};
export type warehouse_stock_movementsSumOrderByAggregateInput = {
    quantity?: Prisma.SortOrder;
};
export type warehouse_stock_movementsCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutProductsInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutProductsInput> | Prisma.warehouse_stock_movementsCreateWithoutProductsInput[] | Prisma.warehouse_stock_movementsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.warehouse_stock_movementsCreateOrConnectWithoutProductsInput | Prisma.warehouse_stock_movementsCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.warehouse_stock_movementsCreateManyProductsInputEnvelope;
    connect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
};
export type warehouse_stock_movementsUncheckedCreateNestedManyWithoutProductsInput = {
    create?: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutProductsInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutProductsInput> | Prisma.warehouse_stock_movementsCreateWithoutProductsInput[] | Prisma.warehouse_stock_movementsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.warehouse_stock_movementsCreateOrConnectWithoutProductsInput | Prisma.warehouse_stock_movementsCreateOrConnectWithoutProductsInput[];
    createMany?: Prisma.warehouse_stock_movementsCreateManyProductsInputEnvelope;
    connect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
};
export type warehouse_stock_movementsUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutProductsInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutProductsInput> | Prisma.warehouse_stock_movementsCreateWithoutProductsInput[] | Prisma.warehouse_stock_movementsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.warehouse_stock_movementsCreateOrConnectWithoutProductsInput | Prisma.warehouse_stock_movementsCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.warehouse_stock_movementsUpsertWithWhereUniqueWithoutProductsInput | Prisma.warehouse_stock_movementsUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.warehouse_stock_movementsCreateManyProductsInputEnvelope;
    set?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    disconnect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    delete?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    connect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    update?: Prisma.warehouse_stock_movementsUpdateWithWhereUniqueWithoutProductsInput | Prisma.warehouse_stock_movementsUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.warehouse_stock_movementsUpdateManyWithWhereWithoutProductsInput | Prisma.warehouse_stock_movementsUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.warehouse_stock_movementsScalarWhereInput | Prisma.warehouse_stock_movementsScalarWhereInput[];
};
export type warehouse_stock_movementsUncheckedUpdateManyWithoutProductsNestedInput = {
    create?: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutProductsInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutProductsInput> | Prisma.warehouse_stock_movementsCreateWithoutProductsInput[] | Prisma.warehouse_stock_movementsUncheckedCreateWithoutProductsInput[];
    connectOrCreate?: Prisma.warehouse_stock_movementsCreateOrConnectWithoutProductsInput | Prisma.warehouse_stock_movementsCreateOrConnectWithoutProductsInput[];
    upsert?: Prisma.warehouse_stock_movementsUpsertWithWhereUniqueWithoutProductsInput | Prisma.warehouse_stock_movementsUpsertWithWhereUniqueWithoutProductsInput[];
    createMany?: Prisma.warehouse_stock_movementsCreateManyProductsInputEnvelope;
    set?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    disconnect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    delete?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    connect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    update?: Prisma.warehouse_stock_movementsUpdateWithWhereUniqueWithoutProductsInput | Prisma.warehouse_stock_movementsUpdateWithWhereUniqueWithoutProductsInput[];
    updateMany?: Prisma.warehouse_stock_movementsUpdateManyWithWhereWithoutProductsInput | Prisma.warehouse_stock_movementsUpdateManyWithWhereWithoutProductsInput[];
    deleteMany?: Prisma.warehouse_stock_movementsScalarWhereInput | Prisma.warehouse_stock_movementsScalarWhereInput[];
};
export type warehouse_stock_movementsCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutUsersInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutUsersInput> | Prisma.warehouse_stock_movementsCreateWithoutUsersInput[] | Prisma.warehouse_stock_movementsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.warehouse_stock_movementsCreateOrConnectWithoutUsersInput | Prisma.warehouse_stock_movementsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.warehouse_stock_movementsCreateManyUsersInputEnvelope;
    connect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
};
export type warehouse_stock_movementsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutUsersInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutUsersInput> | Prisma.warehouse_stock_movementsCreateWithoutUsersInput[] | Prisma.warehouse_stock_movementsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.warehouse_stock_movementsCreateOrConnectWithoutUsersInput | Prisma.warehouse_stock_movementsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.warehouse_stock_movementsCreateManyUsersInputEnvelope;
    connect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
};
export type warehouse_stock_movementsUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutUsersInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutUsersInput> | Prisma.warehouse_stock_movementsCreateWithoutUsersInput[] | Prisma.warehouse_stock_movementsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.warehouse_stock_movementsCreateOrConnectWithoutUsersInput | Prisma.warehouse_stock_movementsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.warehouse_stock_movementsUpsertWithWhereUniqueWithoutUsersInput | Prisma.warehouse_stock_movementsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.warehouse_stock_movementsCreateManyUsersInputEnvelope;
    set?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    disconnect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    delete?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    connect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    update?: Prisma.warehouse_stock_movementsUpdateWithWhereUniqueWithoutUsersInput | Prisma.warehouse_stock_movementsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.warehouse_stock_movementsUpdateManyWithWhereWithoutUsersInput | Prisma.warehouse_stock_movementsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.warehouse_stock_movementsScalarWhereInput | Prisma.warehouse_stock_movementsScalarWhereInput[];
};
export type warehouse_stock_movementsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutUsersInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutUsersInput> | Prisma.warehouse_stock_movementsCreateWithoutUsersInput[] | Prisma.warehouse_stock_movementsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.warehouse_stock_movementsCreateOrConnectWithoutUsersInput | Prisma.warehouse_stock_movementsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.warehouse_stock_movementsUpsertWithWhereUniqueWithoutUsersInput | Prisma.warehouse_stock_movementsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.warehouse_stock_movementsCreateManyUsersInputEnvelope;
    set?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    disconnect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    delete?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    connect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    update?: Prisma.warehouse_stock_movementsUpdateWithWhereUniqueWithoutUsersInput | Prisma.warehouse_stock_movementsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.warehouse_stock_movementsUpdateManyWithWhereWithoutUsersInput | Prisma.warehouse_stock_movementsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.warehouse_stock_movementsScalarWhereInput | Prisma.warehouse_stock_movementsScalarWhereInput[];
};
export type warehouse_stock_movementsCreateNestedManyWithoutWarehousesInput = {
    create?: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutWarehousesInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutWarehousesInput> | Prisma.warehouse_stock_movementsCreateWithoutWarehousesInput[] | Prisma.warehouse_stock_movementsUncheckedCreateWithoutWarehousesInput[];
    connectOrCreate?: Prisma.warehouse_stock_movementsCreateOrConnectWithoutWarehousesInput | Prisma.warehouse_stock_movementsCreateOrConnectWithoutWarehousesInput[];
    createMany?: Prisma.warehouse_stock_movementsCreateManyWarehousesInputEnvelope;
    connect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
};
export type warehouse_stock_movementsUncheckedCreateNestedManyWithoutWarehousesInput = {
    create?: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutWarehousesInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutWarehousesInput> | Prisma.warehouse_stock_movementsCreateWithoutWarehousesInput[] | Prisma.warehouse_stock_movementsUncheckedCreateWithoutWarehousesInput[];
    connectOrCreate?: Prisma.warehouse_stock_movementsCreateOrConnectWithoutWarehousesInput | Prisma.warehouse_stock_movementsCreateOrConnectWithoutWarehousesInput[];
    createMany?: Prisma.warehouse_stock_movementsCreateManyWarehousesInputEnvelope;
    connect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
};
export type warehouse_stock_movementsUpdateManyWithoutWarehousesNestedInput = {
    create?: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutWarehousesInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutWarehousesInput> | Prisma.warehouse_stock_movementsCreateWithoutWarehousesInput[] | Prisma.warehouse_stock_movementsUncheckedCreateWithoutWarehousesInput[];
    connectOrCreate?: Prisma.warehouse_stock_movementsCreateOrConnectWithoutWarehousesInput | Prisma.warehouse_stock_movementsCreateOrConnectWithoutWarehousesInput[];
    upsert?: Prisma.warehouse_stock_movementsUpsertWithWhereUniqueWithoutWarehousesInput | Prisma.warehouse_stock_movementsUpsertWithWhereUniqueWithoutWarehousesInput[];
    createMany?: Prisma.warehouse_stock_movementsCreateManyWarehousesInputEnvelope;
    set?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    disconnect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    delete?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    connect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    update?: Prisma.warehouse_stock_movementsUpdateWithWhereUniqueWithoutWarehousesInput | Prisma.warehouse_stock_movementsUpdateWithWhereUniqueWithoutWarehousesInput[];
    updateMany?: Prisma.warehouse_stock_movementsUpdateManyWithWhereWithoutWarehousesInput | Prisma.warehouse_stock_movementsUpdateManyWithWhereWithoutWarehousesInput[];
    deleteMany?: Prisma.warehouse_stock_movementsScalarWhereInput | Prisma.warehouse_stock_movementsScalarWhereInput[];
};
export type warehouse_stock_movementsUncheckedUpdateManyWithoutWarehousesNestedInput = {
    create?: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutWarehousesInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutWarehousesInput> | Prisma.warehouse_stock_movementsCreateWithoutWarehousesInput[] | Prisma.warehouse_stock_movementsUncheckedCreateWithoutWarehousesInput[];
    connectOrCreate?: Prisma.warehouse_stock_movementsCreateOrConnectWithoutWarehousesInput | Prisma.warehouse_stock_movementsCreateOrConnectWithoutWarehousesInput[];
    upsert?: Prisma.warehouse_stock_movementsUpsertWithWhereUniqueWithoutWarehousesInput | Prisma.warehouse_stock_movementsUpsertWithWhereUniqueWithoutWarehousesInput[];
    createMany?: Prisma.warehouse_stock_movementsCreateManyWarehousesInputEnvelope;
    set?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    disconnect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    delete?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    connect?: Prisma.warehouse_stock_movementsWhereUniqueInput | Prisma.warehouse_stock_movementsWhereUniqueInput[];
    update?: Prisma.warehouse_stock_movementsUpdateWithWhereUniqueWithoutWarehousesInput | Prisma.warehouse_stock_movementsUpdateWithWhereUniqueWithoutWarehousesInput[];
    updateMany?: Prisma.warehouse_stock_movementsUpdateManyWithWhereWithoutWarehousesInput | Prisma.warehouse_stock_movementsUpdateManyWithWhereWithoutWarehousesInput[];
    deleteMany?: Prisma.warehouse_stock_movementsScalarWhereInput | Prisma.warehouse_stock_movementsScalarWhereInput[];
};
export type warehouse_stock_movementsCreateWithoutProductsInput = {
    id?: string;
    movement_type: string;
    direction: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: string | null;
    reference_id?: string | null;
    notes?: string | null;
    created_at?: Date | string;
    users?: Prisma.usersCreateNestedOneWithoutWarehouse_stock_movementsInput;
    warehouses: Prisma.warehousesCreateNestedOneWithoutWarehouse_stock_movementsInput;
};
export type warehouse_stock_movementsUncheckedCreateWithoutProductsInput = {
    id?: string;
    warehouse_id: string;
    movement_type: string;
    direction: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: string | null;
    reference_id?: string | null;
    notes?: string | null;
    created_at?: Date | string;
    created_by?: string | null;
};
export type warehouse_stock_movementsCreateOrConnectWithoutProductsInput = {
    where: Prisma.warehouse_stock_movementsWhereUniqueInput;
    create: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutProductsInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutProductsInput>;
};
export type warehouse_stock_movementsCreateManyProductsInputEnvelope = {
    data: Prisma.warehouse_stock_movementsCreateManyProductsInput | Prisma.warehouse_stock_movementsCreateManyProductsInput[];
    skipDuplicates?: boolean;
};
export type warehouse_stock_movementsUpsertWithWhereUniqueWithoutProductsInput = {
    where: Prisma.warehouse_stock_movementsWhereUniqueInput;
    update: Prisma.XOR<Prisma.warehouse_stock_movementsUpdateWithoutProductsInput, Prisma.warehouse_stock_movementsUncheckedUpdateWithoutProductsInput>;
    create: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutProductsInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutProductsInput>;
};
export type warehouse_stock_movementsUpdateWithWhereUniqueWithoutProductsInput = {
    where: Prisma.warehouse_stock_movementsWhereUniqueInput;
    data: Prisma.XOR<Prisma.warehouse_stock_movementsUpdateWithoutProductsInput, Prisma.warehouse_stock_movementsUncheckedUpdateWithoutProductsInput>;
};
export type warehouse_stock_movementsUpdateManyWithWhereWithoutProductsInput = {
    where: Prisma.warehouse_stock_movementsScalarWhereInput;
    data: Prisma.XOR<Prisma.warehouse_stock_movementsUpdateManyMutationInput, Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutProductsInput>;
};
export type warehouse_stock_movementsScalarWhereInput = {
    AND?: Prisma.warehouse_stock_movementsScalarWhereInput | Prisma.warehouse_stock_movementsScalarWhereInput[];
    OR?: Prisma.warehouse_stock_movementsScalarWhereInput[];
    NOT?: Prisma.warehouse_stock_movementsScalarWhereInput | Prisma.warehouse_stock_movementsScalarWhereInput[];
    id?: Prisma.UuidFilter<"warehouse_stock_movements"> | string;
    warehouse_id?: Prisma.UuidFilter<"warehouse_stock_movements"> | string;
    product_id?: Prisma.UuidFilter<"warehouse_stock_movements"> | string;
    movement_type?: Prisma.StringFilter<"warehouse_stock_movements"> | string;
    direction?: Prisma.StringFilter<"warehouse_stock_movements"> | string;
    quantity?: Prisma.DecimalFilter<"warehouse_stock_movements"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.StringNullableFilter<"warehouse_stock_movements"> | string | null;
    reference_id?: Prisma.UuidNullableFilter<"warehouse_stock_movements"> | string | null;
    notes?: Prisma.StringNullableFilter<"warehouse_stock_movements"> | string | null;
    created_at?: Prisma.DateTimeFilter<"warehouse_stock_movements"> | Date | string;
    created_by?: Prisma.UuidNullableFilter<"warehouse_stock_movements"> | string | null;
};
export type warehouse_stock_movementsCreateWithoutUsersInput = {
    id?: string;
    movement_type: string;
    direction: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: string | null;
    reference_id?: string | null;
    notes?: string | null;
    created_at?: Date | string;
    products: Prisma.productsCreateNestedOneWithoutWarehouse_stock_movementsInput;
    warehouses: Prisma.warehousesCreateNestedOneWithoutWarehouse_stock_movementsInput;
};
export type warehouse_stock_movementsUncheckedCreateWithoutUsersInput = {
    id?: string;
    warehouse_id: string;
    product_id: string;
    movement_type: string;
    direction: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: string | null;
    reference_id?: string | null;
    notes?: string | null;
    created_at?: Date | string;
};
export type warehouse_stock_movementsCreateOrConnectWithoutUsersInput = {
    where: Prisma.warehouse_stock_movementsWhereUniqueInput;
    create: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutUsersInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutUsersInput>;
};
export type warehouse_stock_movementsCreateManyUsersInputEnvelope = {
    data: Prisma.warehouse_stock_movementsCreateManyUsersInput | Prisma.warehouse_stock_movementsCreateManyUsersInput[];
    skipDuplicates?: boolean;
};
export type warehouse_stock_movementsUpsertWithWhereUniqueWithoutUsersInput = {
    where: Prisma.warehouse_stock_movementsWhereUniqueInput;
    update: Prisma.XOR<Prisma.warehouse_stock_movementsUpdateWithoutUsersInput, Prisma.warehouse_stock_movementsUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutUsersInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutUsersInput>;
};
export type warehouse_stock_movementsUpdateWithWhereUniqueWithoutUsersInput = {
    where: Prisma.warehouse_stock_movementsWhereUniqueInput;
    data: Prisma.XOR<Prisma.warehouse_stock_movementsUpdateWithoutUsersInput, Prisma.warehouse_stock_movementsUncheckedUpdateWithoutUsersInput>;
};
export type warehouse_stock_movementsUpdateManyWithWhereWithoutUsersInput = {
    where: Prisma.warehouse_stock_movementsScalarWhereInput;
    data: Prisma.XOR<Prisma.warehouse_stock_movementsUpdateManyMutationInput, Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutUsersInput>;
};
export type warehouse_stock_movementsCreateWithoutWarehousesInput = {
    id?: string;
    movement_type: string;
    direction: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: string | null;
    reference_id?: string | null;
    notes?: string | null;
    created_at?: Date | string;
    users?: Prisma.usersCreateNestedOneWithoutWarehouse_stock_movementsInput;
    products: Prisma.productsCreateNestedOneWithoutWarehouse_stock_movementsInput;
};
export type warehouse_stock_movementsUncheckedCreateWithoutWarehousesInput = {
    id?: string;
    product_id: string;
    movement_type: string;
    direction: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: string | null;
    reference_id?: string | null;
    notes?: string | null;
    created_at?: Date | string;
    created_by?: string | null;
};
export type warehouse_stock_movementsCreateOrConnectWithoutWarehousesInput = {
    where: Prisma.warehouse_stock_movementsWhereUniqueInput;
    create: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutWarehousesInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutWarehousesInput>;
};
export type warehouse_stock_movementsCreateManyWarehousesInputEnvelope = {
    data: Prisma.warehouse_stock_movementsCreateManyWarehousesInput | Prisma.warehouse_stock_movementsCreateManyWarehousesInput[];
    skipDuplicates?: boolean;
};
export type warehouse_stock_movementsUpsertWithWhereUniqueWithoutWarehousesInput = {
    where: Prisma.warehouse_stock_movementsWhereUniqueInput;
    update: Prisma.XOR<Prisma.warehouse_stock_movementsUpdateWithoutWarehousesInput, Prisma.warehouse_stock_movementsUncheckedUpdateWithoutWarehousesInput>;
    create: Prisma.XOR<Prisma.warehouse_stock_movementsCreateWithoutWarehousesInput, Prisma.warehouse_stock_movementsUncheckedCreateWithoutWarehousesInput>;
};
export type warehouse_stock_movementsUpdateWithWhereUniqueWithoutWarehousesInput = {
    where: Prisma.warehouse_stock_movementsWhereUniqueInput;
    data: Prisma.XOR<Prisma.warehouse_stock_movementsUpdateWithoutWarehousesInput, Prisma.warehouse_stock_movementsUncheckedUpdateWithoutWarehousesInput>;
};
export type warehouse_stock_movementsUpdateManyWithWhereWithoutWarehousesInput = {
    where: Prisma.warehouse_stock_movementsScalarWhereInput;
    data: Prisma.XOR<Prisma.warehouse_stock_movementsUpdateManyMutationInput, Prisma.warehouse_stock_movementsUncheckedUpdateManyWithoutWarehousesInput>;
};
export type warehouse_stock_movementsCreateManyProductsInput = {
    id?: string;
    warehouse_id: string;
    movement_type: string;
    direction: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: string | null;
    reference_id?: string | null;
    notes?: string | null;
    created_at?: Date | string;
    created_by?: string | null;
};
export type warehouse_stock_movementsUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    movement_type?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reference_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.usersUpdateOneWithoutWarehouse_stock_movementsNestedInput;
    warehouses?: Prisma.warehousesUpdateOneRequiredWithoutWarehouse_stock_movementsNestedInput;
};
export type warehouse_stock_movementsUncheckedUpdateWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.StringFieldUpdateOperationsInput | string;
    movement_type?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reference_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type warehouse_stock_movementsUncheckedUpdateManyWithoutProductsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.StringFieldUpdateOperationsInput | string;
    movement_type?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reference_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type warehouse_stock_movementsCreateManyUsersInput = {
    id?: string;
    warehouse_id: string;
    product_id: string;
    movement_type: string;
    direction: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: string | null;
    reference_id?: string | null;
    notes?: string | null;
    created_at?: Date | string;
};
export type warehouse_stock_movementsUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    movement_type?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reference_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    products?: Prisma.productsUpdateOneRequiredWithoutWarehouse_stock_movementsNestedInput;
    warehouses?: Prisma.warehousesUpdateOneRequiredWithoutWarehouse_stock_movementsNestedInput;
};
export type warehouse_stock_movementsUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    movement_type?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reference_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type warehouse_stock_movementsUncheckedUpdateManyWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    warehouse_id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    movement_type?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reference_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type warehouse_stock_movementsCreateManyWarehousesInput = {
    id?: string;
    product_id: string;
    movement_type: string;
    direction: string;
    quantity: runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: string | null;
    reference_id?: string | null;
    notes?: string | null;
    created_at?: Date | string;
    created_by?: string | null;
};
export type warehouse_stock_movementsUpdateWithoutWarehousesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    movement_type?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reference_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.usersUpdateOneWithoutWarehouse_stock_movementsNestedInput;
    products?: Prisma.productsUpdateOneRequiredWithoutWarehouse_stock_movementsNestedInput;
};
export type warehouse_stock_movementsUncheckedUpdateWithoutWarehousesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    movement_type?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reference_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type warehouse_stock_movementsUncheckedUpdateManyWithoutWarehousesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    product_id?: Prisma.StringFieldUpdateOperationsInput | string;
    movement_type?: Prisma.StringFieldUpdateOperationsInput | string;
    direction?: Prisma.StringFieldUpdateOperationsInput | string;
    quantity?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    reference_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reference_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type warehouse_stock_movementsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    warehouse_id?: boolean;
    product_id?: boolean;
    movement_type?: boolean;
    direction?: boolean;
    quantity?: boolean;
    reference_type?: boolean;
    reference_id?: boolean;
    notes?: boolean;
    created_at?: boolean;
    created_by?: boolean;
    users?: boolean | Prisma.warehouse_stock_movements$usersArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    warehouses?: boolean | Prisma.warehousesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["warehouse_stock_movements"]>;
export type warehouse_stock_movementsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    warehouse_id?: boolean;
    product_id?: boolean;
    movement_type?: boolean;
    direction?: boolean;
    quantity?: boolean;
    reference_type?: boolean;
    reference_id?: boolean;
    notes?: boolean;
    created_at?: boolean;
    created_by?: boolean;
    users?: boolean | Prisma.warehouse_stock_movements$usersArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    warehouses?: boolean | Prisma.warehousesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["warehouse_stock_movements"]>;
export type warehouse_stock_movementsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    warehouse_id?: boolean;
    product_id?: boolean;
    movement_type?: boolean;
    direction?: boolean;
    quantity?: boolean;
    reference_type?: boolean;
    reference_id?: boolean;
    notes?: boolean;
    created_at?: boolean;
    created_by?: boolean;
    users?: boolean | Prisma.warehouse_stock_movements$usersArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    warehouses?: boolean | Prisma.warehousesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["warehouse_stock_movements"]>;
export type warehouse_stock_movementsSelectScalar = {
    id?: boolean;
    warehouse_id?: boolean;
    product_id?: boolean;
    movement_type?: boolean;
    direction?: boolean;
    quantity?: boolean;
    reference_type?: boolean;
    reference_id?: boolean;
    notes?: boolean;
    created_at?: boolean;
    created_by?: boolean;
};
export type warehouse_stock_movementsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "warehouse_id" | "product_id" | "movement_type" | "direction" | "quantity" | "reference_type" | "reference_id" | "notes" | "created_at" | "created_by", ExtArgs["result"]["warehouse_stock_movements"]>;
export type warehouse_stock_movementsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.warehouse_stock_movements$usersArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    warehouses?: boolean | Prisma.warehousesDefaultArgs<ExtArgs>;
};
export type warehouse_stock_movementsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.warehouse_stock_movements$usersArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    warehouses?: boolean | Prisma.warehousesDefaultArgs<ExtArgs>;
};
export type warehouse_stock_movementsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.warehouse_stock_movements$usersArgs<ExtArgs>;
    products?: boolean | Prisma.productsDefaultArgs<ExtArgs>;
    warehouses?: boolean | Prisma.warehousesDefaultArgs<ExtArgs>;
};
export type $warehouse_stock_movementsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "warehouse_stock_movements";
    objects: {
        users: Prisma.$usersPayload<ExtArgs> | null;
        products: Prisma.$productsPayload<ExtArgs>;
        warehouses: Prisma.$warehousesPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        warehouse_id: string;
        product_id: string;
        movement_type: string;
        direction: string;
        quantity: runtime.Decimal;
        reference_type: string | null;
        reference_id: string | null;
        notes: string | null;
        created_at: Date;
        created_by: string | null;
    }, ExtArgs["result"]["warehouse_stock_movements"]>;
    composites: {};
};
export type warehouse_stock_movementsGetPayload<S extends boolean | null | undefined | warehouse_stock_movementsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$warehouse_stock_movementsPayload, S>;
export type warehouse_stock_movementsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<warehouse_stock_movementsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Warehouse_stock_movementsCountAggregateInputType | true;
};
export interface warehouse_stock_movementsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['warehouse_stock_movements'];
        meta: {
            name: 'warehouse_stock_movements';
        };
    };
    findUnique<T extends warehouse_stock_movementsFindUniqueArgs>(args: Prisma.SelectSubset<T, warehouse_stock_movementsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__warehouse_stock_movementsClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stock_movementsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends warehouse_stock_movementsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, warehouse_stock_movementsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__warehouse_stock_movementsClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stock_movementsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends warehouse_stock_movementsFindFirstArgs>(args?: Prisma.SelectSubset<T, warehouse_stock_movementsFindFirstArgs<ExtArgs>>): Prisma.Prisma__warehouse_stock_movementsClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stock_movementsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends warehouse_stock_movementsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, warehouse_stock_movementsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__warehouse_stock_movementsClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stock_movementsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends warehouse_stock_movementsFindManyArgs>(args?: Prisma.SelectSubset<T, warehouse_stock_movementsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$warehouse_stock_movementsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends warehouse_stock_movementsCreateArgs>(args: Prisma.SelectSubset<T, warehouse_stock_movementsCreateArgs<ExtArgs>>): Prisma.Prisma__warehouse_stock_movementsClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stock_movementsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends warehouse_stock_movementsCreateManyArgs>(args?: Prisma.SelectSubset<T, warehouse_stock_movementsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends warehouse_stock_movementsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, warehouse_stock_movementsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$warehouse_stock_movementsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends warehouse_stock_movementsDeleteArgs>(args: Prisma.SelectSubset<T, warehouse_stock_movementsDeleteArgs<ExtArgs>>): Prisma.Prisma__warehouse_stock_movementsClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stock_movementsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends warehouse_stock_movementsUpdateArgs>(args: Prisma.SelectSubset<T, warehouse_stock_movementsUpdateArgs<ExtArgs>>): Prisma.Prisma__warehouse_stock_movementsClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stock_movementsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends warehouse_stock_movementsDeleteManyArgs>(args?: Prisma.SelectSubset<T, warehouse_stock_movementsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends warehouse_stock_movementsUpdateManyArgs>(args: Prisma.SelectSubset<T, warehouse_stock_movementsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends warehouse_stock_movementsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, warehouse_stock_movementsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$warehouse_stock_movementsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends warehouse_stock_movementsUpsertArgs>(args: Prisma.SelectSubset<T, warehouse_stock_movementsUpsertArgs<ExtArgs>>): Prisma.Prisma__warehouse_stock_movementsClient<runtime.Types.Result.GetResult<Prisma.$warehouse_stock_movementsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends warehouse_stock_movementsCountArgs>(args?: Prisma.Subset<T, warehouse_stock_movementsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Warehouse_stock_movementsCountAggregateOutputType> : number>;
    aggregate<T extends Warehouse_stock_movementsAggregateArgs>(args: Prisma.Subset<T, Warehouse_stock_movementsAggregateArgs>): Prisma.PrismaPromise<GetWarehouse_stock_movementsAggregateType<T>>;
    groupBy<T extends warehouse_stock_movementsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: warehouse_stock_movementsGroupByArgs['orderBy'];
    } : {
        orderBy?: warehouse_stock_movementsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, warehouse_stock_movementsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWarehouse_stock_movementsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: warehouse_stock_movementsFieldRefs;
}
export interface Prisma__warehouse_stock_movementsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.warehouse_stock_movements$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.warehouse_stock_movements$usersArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    products<T extends Prisma.productsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.productsDefaultArgs<ExtArgs>>): Prisma.Prisma__productsClient<runtime.Types.Result.GetResult<Prisma.$productsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    warehouses<T extends Prisma.warehousesDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.warehousesDefaultArgs<ExtArgs>>): Prisma.Prisma__warehousesClient<runtime.Types.Result.GetResult<Prisma.$warehousesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface warehouse_stock_movementsFieldRefs {
    readonly id: Prisma.FieldRef<"warehouse_stock_movements", 'String'>;
    readonly warehouse_id: Prisma.FieldRef<"warehouse_stock_movements", 'String'>;
    readonly product_id: Prisma.FieldRef<"warehouse_stock_movements", 'String'>;
    readonly movement_type: Prisma.FieldRef<"warehouse_stock_movements", 'String'>;
    readonly direction: Prisma.FieldRef<"warehouse_stock_movements", 'String'>;
    readonly quantity: Prisma.FieldRef<"warehouse_stock_movements", 'Decimal'>;
    readonly reference_type: Prisma.FieldRef<"warehouse_stock_movements", 'String'>;
    readonly reference_id: Prisma.FieldRef<"warehouse_stock_movements", 'String'>;
    readonly notes: Prisma.FieldRef<"warehouse_stock_movements", 'String'>;
    readonly created_at: Prisma.FieldRef<"warehouse_stock_movements", 'DateTime'>;
    readonly created_by: Prisma.FieldRef<"warehouse_stock_movements", 'String'>;
}
export type warehouse_stock_movementsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stock_movementsSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stock_movementsOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stock_movementsInclude<ExtArgs> | null;
    where: Prisma.warehouse_stock_movementsWhereUniqueInput;
};
export type warehouse_stock_movementsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stock_movementsSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stock_movementsOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stock_movementsInclude<ExtArgs> | null;
    where: Prisma.warehouse_stock_movementsWhereUniqueInput;
};
export type warehouse_stock_movementsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type warehouse_stock_movementsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type warehouse_stock_movementsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type warehouse_stock_movementsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stock_movementsSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stock_movementsOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stock_movementsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.warehouse_stock_movementsCreateInput, Prisma.warehouse_stock_movementsUncheckedCreateInput>;
};
export type warehouse_stock_movementsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.warehouse_stock_movementsCreateManyInput | Prisma.warehouse_stock_movementsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type warehouse_stock_movementsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stock_movementsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.warehouse_stock_movementsOmit<ExtArgs> | null;
    data: Prisma.warehouse_stock_movementsCreateManyInput | Prisma.warehouse_stock_movementsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.warehouse_stock_movementsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type warehouse_stock_movementsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stock_movementsSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stock_movementsOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stock_movementsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.warehouse_stock_movementsUpdateInput, Prisma.warehouse_stock_movementsUncheckedUpdateInput>;
    where: Prisma.warehouse_stock_movementsWhereUniqueInput;
};
export type warehouse_stock_movementsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.warehouse_stock_movementsUpdateManyMutationInput, Prisma.warehouse_stock_movementsUncheckedUpdateManyInput>;
    where?: Prisma.warehouse_stock_movementsWhereInput;
    limit?: number;
};
export type warehouse_stock_movementsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stock_movementsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.warehouse_stock_movementsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.warehouse_stock_movementsUpdateManyMutationInput, Prisma.warehouse_stock_movementsUncheckedUpdateManyInput>;
    where?: Prisma.warehouse_stock_movementsWhereInput;
    limit?: number;
    include?: Prisma.warehouse_stock_movementsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type warehouse_stock_movementsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stock_movementsSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stock_movementsOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stock_movementsInclude<ExtArgs> | null;
    where: Prisma.warehouse_stock_movementsWhereUniqueInput;
    create: Prisma.XOR<Prisma.warehouse_stock_movementsCreateInput, Prisma.warehouse_stock_movementsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.warehouse_stock_movementsUpdateInput, Prisma.warehouse_stock_movementsUncheckedUpdateInput>;
};
export type warehouse_stock_movementsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stock_movementsSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stock_movementsOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stock_movementsInclude<ExtArgs> | null;
    where: Prisma.warehouse_stock_movementsWhereUniqueInput;
};
export type warehouse_stock_movementsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.warehouse_stock_movementsWhereInput;
    limit?: number;
};
export type warehouse_stock_movements$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
    where?: Prisma.usersWhereInput;
};
export type warehouse_stock_movementsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.warehouse_stock_movementsSelect<ExtArgs> | null;
    omit?: Prisma.warehouse_stock_movementsOmit<ExtArgs> | null;
    include?: Prisma.warehouse_stock_movementsInclude<ExtArgs> | null;
};
