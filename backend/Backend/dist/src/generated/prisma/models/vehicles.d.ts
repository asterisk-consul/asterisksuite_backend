import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type vehiclesModel = runtime.Types.Result.DefaultSelection<Prisma.$vehiclesPayload>;
export type AggregateVehicles = {
    _count: VehiclesCountAggregateOutputType | null;
    _avg: VehiclesAvgAggregateOutputType | null;
    _sum: VehiclesSumAggregateOutputType | null;
    _min: VehiclesMinAggregateOutputType | null;
    _max: VehiclesMaxAggregateOutputType | null;
};
export type VehiclesAvgAggregateOutputType = {
    year: number | null;
    max_weight: runtime.Decimal | null;
    max_volume: runtime.Decimal | null;
};
export type VehiclesSumAggregateOutputType = {
    year: number | null;
    max_weight: runtime.Decimal | null;
    max_volume: runtime.Decimal | null;
};
export type VehiclesMinAggregateOutputType = {
    id: string | null;
    type: string | null;
    plate: string | null;
    brand: string | null;
    model: string | null;
    year: number | null;
    max_weight: runtime.Decimal | null;
    max_volume: runtime.Decimal | null;
    refrigeration: boolean | null;
    active: boolean | null;
    created_at: Date | null;
};
export type VehiclesMaxAggregateOutputType = {
    id: string | null;
    type: string | null;
    plate: string | null;
    brand: string | null;
    model: string | null;
    year: number | null;
    max_weight: runtime.Decimal | null;
    max_volume: runtime.Decimal | null;
    refrigeration: boolean | null;
    active: boolean | null;
    created_at: Date | null;
};
export type VehiclesCountAggregateOutputType = {
    id: number;
    type: number;
    plate: number;
    brand: number;
    model: number;
    year: number;
    max_weight: number;
    max_volume: number;
    refrigeration: number;
    active: number;
    created_at: number;
    _all: number;
};
export type VehiclesAvgAggregateInputType = {
    year?: true;
    max_weight?: true;
    max_volume?: true;
};
export type VehiclesSumAggregateInputType = {
    year?: true;
    max_weight?: true;
    max_volume?: true;
};
export type VehiclesMinAggregateInputType = {
    id?: true;
    type?: true;
    plate?: true;
    brand?: true;
    model?: true;
    year?: true;
    max_weight?: true;
    max_volume?: true;
    refrigeration?: true;
    active?: true;
    created_at?: true;
};
export type VehiclesMaxAggregateInputType = {
    id?: true;
    type?: true;
    plate?: true;
    brand?: true;
    model?: true;
    year?: true;
    max_weight?: true;
    max_volume?: true;
    refrigeration?: true;
    active?: true;
    created_at?: true;
};
export type VehiclesCountAggregateInputType = {
    id?: true;
    type?: true;
    plate?: true;
    brand?: true;
    model?: true;
    year?: true;
    max_weight?: true;
    max_volume?: true;
    refrigeration?: true;
    active?: true;
    created_at?: true;
    _all?: true;
};
export type VehiclesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.vehiclesWhereInput;
    orderBy?: Prisma.vehiclesOrderByWithRelationInput | Prisma.vehiclesOrderByWithRelationInput[];
    cursor?: Prisma.vehiclesWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | VehiclesCountAggregateInputType;
    _avg?: VehiclesAvgAggregateInputType;
    _sum?: VehiclesSumAggregateInputType;
    _min?: VehiclesMinAggregateInputType;
    _max?: VehiclesMaxAggregateInputType;
};
export type GetVehiclesAggregateType<T extends VehiclesAggregateArgs> = {
    [P in keyof T & keyof AggregateVehicles]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVehicles[P]> : Prisma.GetScalarType<T[P], AggregateVehicles[P]>;
};
export type vehiclesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.vehiclesWhereInput;
    orderBy?: Prisma.vehiclesOrderByWithAggregationInput | Prisma.vehiclesOrderByWithAggregationInput[];
    by: Prisma.VehiclesScalarFieldEnum[] | Prisma.VehiclesScalarFieldEnum;
    having?: Prisma.vehiclesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: VehiclesCountAggregateInputType | true;
    _avg?: VehiclesAvgAggregateInputType;
    _sum?: VehiclesSumAggregateInputType;
    _min?: VehiclesMinAggregateInputType;
    _max?: VehiclesMaxAggregateInputType;
};
export type VehiclesGroupByOutputType = {
    id: string;
    type: string;
    plate: string;
    brand: string | null;
    model: string | null;
    year: number | null;
    max_weight: runtime.Decimal | null;
    max_volume: runtime.Decimal | null;
    refrigeration: boolean | null;
    active: boolean;
    created_at: Date;
    _count: VehiclesCountAggregateOutputType | null;
    _avg: VehiclesAvgAggregateOutputType | null;
    _sum: VehiclesSumAggregateOutputType | null;
    _min: VehiclesMinAggregateOutputType | null;
    _max: VehiclesMaxAggregateOutputType | null;
};
export type GetVehiclesGroupByPayload<T extends vehiclesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<VehiclesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof VehiclesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], VehiclesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], VehiclesGroupByOutputType[P]>;
}>>;
export type vehiclesWhereInput = {
    AND?: Prisma.vehiclesWhereInput | Prisma.vehiclesWhereInput[];
    OR?: Prisma.vehiclesWhereInput[];
    NOT?: Prisma.vehiclesWhereInput | Prisma.vehiclesWhereInput[];
    id?: Prisma.UuidFilter<"vehicles"> | string;
    type?: Prisma.StringFilter<"vehicles"> | string;
    plate?: Prisma.StringFilter<"vehicles"> | string;
    brand?: Prisma.StringNullableFilter<"vehicles"> | string | null;
    model?: Prisma.StringNullableFilter<"vehicles"> | string | null;
    year?: Prisma.IntNullableFilter<"vehicles"> | number | null;
    max_weight?: Prisma.DecimalNullableFilter<"vehicles"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: Prisma.DecimalNullableFilter<"vehicles"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: Prisma.BoolNullableFilter<"vehicles"> | boolean | null;
    active?: Prisma.BoolFilter<"vehicles"> | boolean;
    created_at?: Prisma.DateTimeFilter<"vehicles"> | Date | string;
    vehicleDocuments?: Prisma.Documents_vehicleListRelationFilter;
    vehicle_combinations_tractor?: Prisma.Vehicle_combinationsListRelationFilter;
    vehicle_combinations_trailer?: Prisma.Vehicle_combinationsListRelationFilter;
};
export type vehiclesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    plate?: Prisma.SortOrder;
    brand?: Prisma.SortOrderInput | Prisma.SortOrder;
    model?: Prisma.SortOrderInput | Prisma.SortOrder;
    year?: Prisma.SortOrderInput | Prisma.SortOrder;
    max_weight?: Prisma.SortOrderInput | Prisma.SortOrder;
    max_volume?: Prisma.SortOrderInput | Prisma.SortOrder;
    refrigeration?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    vehicleDocuments?: Prisma.documents_vehicleOrderByRelationAggregateInput;
    vehicle_combinations_tractor?: Prisma.vehicle_combinationsOrderByRelationAggregateInput;
    vehicle_combinations_trailer?: Prisma.vehicle_combinationsOrderByRelationAggregateInput;
};
export type vehiclesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    plate?: string;
    AND?: Prisma.vehiclesWhereInput | Prisma.vehiclesWhereInput[];
    OR?: Prisma.vehiclesWhereInput[];
    NOT?: Prisma.vehiclesWhereInput | Prisma.vehiclesWhereInput[];
    type?: Prisma.StringFilter<"vehicles"> | string;
    brand?: Prisma.StringNullableFilter<"vehicles"> | string | null;
    model?: Prisma.StringNullableFilter<"vehicles"> | string | null;
    year?: Prisma.IntNullableFilter<"vehicles"> | number | null;
    max_weight?: Prisma.DecimalNullableFilter<"vehicles"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: Prisma.DecimalNullableFilter<"vehicles"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: Prisma.BoolNullableFilter<"vehicles"> | boolean | null;
    active?: Prisma.BoolFilter<"vehicles"> | boolean;
    created_at?: Prisma.DateTimeFilter<"vehicles"> | Date | string;
    vehicleDocuments?: Prisma.Documents_vehicleListRelationFilter;
    vehicle_combinations_tractor?: Prisma.Vehicle_combinationsListRelationFilter;
    vehicle_combinations_trailer?: Prisma.Vehicle_combinationsListRelationFilter;
}, "id" | "plate">;
export type vehiclesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    plate?: Prisma.SortOrder;
    brand?: Prisma.SortOrderInput | Prisma.SortOrder;
    model?: Prisma.SortOrderInput | Prisma.SortOrder;
    year?: Prisma.SortOrderInput | Prisma.SortOrder;
    max_weight?: Prisma.SortOrderInput | Prisma.SortOrder;
    max_volume?: Prisma.SortOrderInput | Prisma.SortOrder;
    refrigeration?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.vehiclesCountOrderByAggregateInput;
    _avg?: Prisma.vehiclesAvgOrderByAggregateInput;
    _max?: Prisma.vehiclesMaxOrderByAggregateInput;
    _min?: Prisma.vehiclesMinOrderByAggregateInput;
    _sum?: Prisma.vehiclesSumOrderByAggregateInput;
};
export type vehiclesScalarWhereWithAggregatesInput = {
    AND?: Prisma.vehiclesScalarWhereWithAggregatesInput | Prisma.vehiclesScalarWhereWithAggregatesInput[];
    OR?: Prisma.vehiclesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.vehiclesScalarWhereWithAggregatesInput | Prisma.vehiclesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"vehicles"> | string;
    type?: Prisma.StringWithAggregatesFilter<"vehicles"> | string;
    plate?: Prisma.StringWithAggregatesFilter<"vehicles"> | string;
    brand?: Prisma.StringNullableWithAggregatesFilter<"vehicles"> | string | null;
    model?: Prisma.StringNullableWithAggregatesFilter<"vehicles"> | string | null;
    year?: Prisma.IntNullableWithAggregatesFilter<"vehicles"> | number | null;
    max_weight?: Prisma.DecimalNullableWithAggregatesFilter<"vehicles"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: Prisma.DecimalNullableWithAggregatesFilter<"vehicles"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: Prisma.BoolNullableWithAggregatesFilter<"vehicles"> | boolean | null;
    active?: Prisma.BoolWithAggregatesFilter<"vehicles"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"vehicles"> | Date | string;
};
export type vehiclesCreateInput = {
    id?: string;
    type: string;
    plate: string;
    brand?: string | null;
    model?: string | null;
    year?: number | null;
    max_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: boolean | null;
    active?: boolean;
    created_at?: Date | string;
    vehicleDocuments?: Prisma.documents_vehicleCreateNestedManyWithoutVehiclesInput;
    vehicle_combinations_tractor?: Prisma.vehicle_combinationsCreateNestedManyWithoutTractorInput;
    vehicle_combinations_trailer?: Prisma.vehicle_combinationsCreateNestedManyWithoutTrailerInput;
};
export type vehiclesUncheckedCreateInput = {
    id?: string;
    type: string;
    plate: string;
    brand?: string | null;
    model?: string | null;
    year?: number | null;
    max_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: boolean | null;
    active?: boolean;
    created_at?: Date | string;
    vehicleDocuments?: Prisma.documents_vehicleUncheckedCreateNestedManyWithoutVehiclesInput;
    vehicle_combinations_tractor?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutTractorInput;
    vehicle_combinations_trailer?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutTrailerInput;
};
export type vehiclesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    plate?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    year?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    max_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicleDocuments?: Prisma.documents_vehicleUpdateManyWithoutVehiclesNestedInput;
    vehicle_combinations_tractor?: Prisma.vehicle_combinationsUpdateManyWithoutTractorNestedInput;
    vehicle_combinations_trailer?: Prisma.vehicle_combinationsUpdateManyWithoutTrailerNestedInput;
};
export type vehiclesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    plate?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    year?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    max_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicleDocuments?: Prisma.documents_vehicleUncheckedUpdateManyWithoutVehiclesNestedInput;
    vehicle_combinations_tractor?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutTractorNestedInput;
    vehicle_combinations_trailer?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutTrailerNestedInput;
};
export type vehiclesCreateManyInput = {
    id?: string;
    type: string;
    plate: string;
    brand?: string | null;
    model?: string | null;
    year?: number | null;
    max_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: boolean | null;
    active?: boolean;
    created_at?: Date | string;
};
export type vehiclesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    plate?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    year?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    max_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type vehiclesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    plate?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    year?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    max_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type vehiclesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    plate?: Prisma.SortOrder;
    brand?: Prisma.SortOrder;
    model?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    max_weight?: Prisma.SortOrder;
    max_volume?: Prisma.SortOrder;
    refrigeration?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type vehiclesAvgOrderByAggregateInput = {
    year?: Prisma.SortOrder;
    max_weight?: Prisma.SortOrder;
    max_volume?: Prisma.SortOrder;
};
export type vehiclesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    plate?: Prisma.SortOrder;
    brand?: Prisma.SortOrder;
    model?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    max_weight?: Prisma.SortOrder;
    max_volume?: Prisma.SortOrder;
    refrigeration?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type vehiclesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    plate?: Prisma.SortOrder;
    brand?: Prisma.SortOrder;
    model?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    max_weight?: Prisma.SortOrder;
    max_volume?: Prisma.SortOrder;
    refrigeration?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type vehiclesSumOrderByAggregateInput = {
    year?: Prisma.SortOrder;
    max_weight?: Prisma.SortOrder;
    max_volume?: Prisma.SortOrder;
};
export type VehiclesScalarRelationFilter = {
    is?: Prisma.vehiclesWhereInput;
    isNot?: Prisma.vehiclesWhereInput;
};
export type VehiclesNullableScalarRelationFilter = {
    is?: Prisma.vehiclesWhereInput | null;
    isNot?: Prisma.vehiclesWhereInput | null;
};
export type vehiclesCreateNestedOneWithoutVehicle_combinations_tractorInput = {
    create?: Prisma.XOR<Prisma.vehiclesCreateWithoutVehicle_combinations_tractorInput, Prisma.vehiclesUncheckedCreateWithoutVehicle_combinations_tractorInput>;
    connectOrCreate?: Prisma.vehiclesCreateOrConnectWithoutVehicle_combinations_tractorInput;
    connect?: Prisma.vehiclesWhereUniqueInput;
};
export type vehiclesCreateNestedOneWithoutVehicle_combinations_trailerInput = {
    create?: Prisma.XOR<Prisma.vehiclesCreateWithoutVehicle_combinations_trailerInput, Prisma.vehiclesUncheckedCreateWithoutVehicle_combinations_trailerInput>;
    connectOrCreate?: Prisma.vehiclesCreateOrConnectWithoutVehicle_combinations_trailerInput;
    connect?: Prisma.vehiclesWhereUniqueInput;
};
export type vehiclesUpdateOneRequiredWithoutVehicle_combinations_tractorNestedInput = {
    create?: Prisma.XOR<Prisma.vehiclesCreateWithoutVehicle_combinations_tractorInput, Prisma.vehiclesUncheckedCreateWithoutVehicle_combinations_tractorInput>;
    connectOrCreate?: Prisma.vehiclesCreateOrConnectWithoutVehicle_combinations_tractorInput;
    upsert?: Prisma.vehiclesUpsertWithoutVehicle_combinations_tractorInput;
    connect?: Prisma.vehiclesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.vehiclesUpdateToOneWithWhereWithoutVehicle_combinations_tractorInput, Prisma.vehiclesUpdateWithoutVehicle_combinations_tractorInput>, Prisma.vehiclesUncheckedUpdateWithoutVehicle_combinations_tractorInput>;
};
export type vehiclesUpdateOneWithoutVehicle_combinations_trailerNestedInput = {
    create?: Prisma.XOR<Prisma.vehiclesCreateWithoutVehicle_combinations_trailerInput, Prisma.vehiclesUncheckedCreateWithoutVehicle_combinations_trailerInput>;
    connectOrCreate?: Prisma.vehiclesCreateOrConnectWithoutVehicle_combinations_trailerInput;
    upsert?: Prisma.vehiclesUpsertWithoutVehicle_combinations_trailerInput;
    disconnect?: Prisma.vehiclesWhereInput | boolean;
    delete?: Prisma.vehiclesWhereInput | boolean;
    connect?: Prisma.vehiclesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.vehiclesUpdateToOneWithWhereWithoutVehicle_combinations_trailerInput, Prisma.vehiclesUpdateWithoutVehicle_combinations_trailerInput>, Prisma.vehiclesUncheckedUpdateWithoutVehicle_combinations_trailerInput>;
};
export type vehiclesCreateNestedOneWithoutVehicleDocumentsInput = {
    create?: Prisma.XOR<Prisma.vehiclesCreateWithoutVehicleDocumentsInput, Prisma.vehiclesUncheckedCreateWithoutVehicleDocumentsInput>;
    connectOrCreate?: Prisma.vehiclesCreateOrConnectWithoutVehicleDocumentsInput;
    connect?: Prisma.vehiclesWhereUniqueInput;
};
export type vehiclesUpdateOneRequiredWithoutVehicleDocumentsNestedInput = {
    create?: Prisma.XOR<Prisma.vehiclesCreateWithoutVehicleDocumentsInput, Prisma.vehiclesUncheckedCreateWithoutVehicleDocumentsInput>;
    connectOrCreate?: Prisma.vehiclesCreateOrConnectWithoutVehicleDocumentsInput;
    upsert?: Prisma.vehiclesUpsertWithoutVehicleDocumentsInput;
    connect?: Prisma.vehiclesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.vehiclesUpdateToOneWithWhereWithoutVehicleDocumentsInput, Prisma.vehiclesUpdateWithoutVehicleDocumentsInput>, Prisma.vehiclesUncheckedUpdateWithoutVehicleDocumentsInput>;
};
export type vehiclesCreateWithoutVehicle_combinations_tractorInput = {
    id?: string;
    type: string;
    plate: string;
    brand?: string | null;
    model?: string | null;
    year?: number | null;
    max_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: boolean | null;
    active?: boolean;
    created_at?: Date | string;
    vehicleDocuments?: Prisma.documents_vehicleCreateNestedManyWithoutVehiclesInput;
    vehicle_combinations_trailer?: Prisma.vehicle_combinationsCreateNestedManyWithoutTrailerInput;
};
export type vehiclesUncheckedCreateWithoutVehicle_combinations_tractorInput = {
    id?: string;
    type: string;
    plate: string;
    brand?: string | null;
    model?: string | null;
    year?: number | null;
    max_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: boolean | null;
    active?: boolean;
    created_at?: Date | string;
    vehicleDocuments?: Prisma.documents_vehicleUncheckedCreateNestedManyWithoutVehiclesInput;
    vehicle_combinations_trailer?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutTrailerInput;
};
export type vehiclesCreateOrConnectWithoutVehicle_combinations_tractorInput = {
    where: Prisma.vehiclesWhereUniqueInput;
    create: Prisma.XOR<Prisma.vehiclesCreateWithoutVehicle_combinations_tractorInput, Prisma.vehiclesUncheckedCreateWithoutVehicle_combinations_tractorInput>;
};
export type vehiclesCreateWithoutVehicle_combinations_trailerInput = {
    id?: string;
    type: string;
    plate: string;
    brand?: string | null;
    model?: string | null;
    year?: number | null;
    max_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: boolean | null;
    active?: boolean;
    created_at?: Date | string;
    vehicleDocuments?: Prisma.documents_vehicleCreateNestedManyWithoutVehiclesInput;
    vehicle_combinations_tractor?: Prisma.vehicle_combinationsCreateNestedManyWithoutTractorInput;
};
export type vehiclesUncheckedCreateWithoutVehicle_combinations_trailerInput = {
    id?: string;
    type: string;
    plate: string;
    brand?: string | null;
    model?: string | null;
    year?: number | null;
    max_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: boolean | null;
    active?: boolean;
    created_at?: Date | string;
    vehicleDocuments?: Prisma.documents_vehicleUncheckedCreateNestedManyWithoutVehiclesInput;
    vehicle_combinations_tractor?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutTractorInput;
};
export type vehiclesCreateOrConnectWithoutVehicle_combinations_trailerInput = {
    where: Prisma.vehiclesWhereUniqueInput;
    create: Prisma.XOR<Prisma.vehiclesCreateWithoutVehicle_combinations_trailerInput, Prisma.vehiclesUncheckedCreateWithoutVehicle_combinations_trailerInput>;
};
export type vehiclesUpsertWithoutVehicle_combinations_tractorInput = {
    update: Prisma.XOR<Prisma.vehiclesUpdateWithoutVehicle_combinations_tractorInput, Prisma.vehiclesUncheckedUpdateWithoutVehicle_combinations_tractorInput>;
    create: Prisma.XOR<Prisma.vehiclesCreateWithoutVehicle_combinations_tractorInput, Prisma.vehiclesUncheckedCreateWithoutVehicle_combinations_tractorInput>;
    where?: Prisma.vehiclesWhereInput;
};
export type vehiclesUpdateToOneWithWhereWithoutVehicle_combinations_tractorInput = {
    where?: Prisma.vehiclesWhereInput;
    data: Prisma.XOR<Prisma.vehiclesUpdateWithoutVehicle_combinations_tractorInput, Prisma.vehiclesUncheckedUpdateWithoutVehicle_combinations_tractorInput>;
};
export type vehiclesUpdateWithoutVehicle_combinations_tractorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    plate?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    year?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    max_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicleDocuments?: Prisma.documents_vehicleUpdateManyWithoutVehiclesNestedInput;
    vehicle_combinations_trailer?: Prisma.vehicle_combinationsUpdateManyWithoutTrailerNestedInput;
};
export type vehiclesUncheckedUpdateWithoutVehicle_combinations_tractorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    plate?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    year?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    max_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicleDocuments?: Prisma.documents_vehicleUncheckedUpdateManyWithoutVehiclesNestedInput;
    vehicle_combinations_trailer?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutTrailerNestedInput;
};
export type vehiclesUpsertWithoutVehicle_combinations_trailerInput = {
    update: Prisma.XOR<Prisma.vehiclesUpdateWithoutVehicle_combinations_trailerInput, Prisma.vehiclesUncheckedUpdateWithoutVehicle_combinations_trailerInput>;
    create: Prisma.XOR<Prisma.vehiclesCreateWithoutVehicle_combinations_trailerInput, Prisma.vehiclesUncheckedCreateWithoutVehicle_combinations_trailerInput>;
    where?: Prisma.vehiclesWhereInput;
};
export type vehiclesUpdateToOneWithWhereWithoutVehicle_combinations_trailerInput = {
    where?: Prisma.vehiclesWhereInput;
    data: Prisma.XOR<Prisma.vehiclesUpdateWithoutVehicle_combinations_trailerInput, Prisma.vehiclesUncheckedUpdateWithoutVehicle_combinations_trailerInput>;
};
export type vehiclesUpdateWithoutVehicle_combinations_trailerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    plate?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    year?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    max_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicleDocuments?: Prisma.documents_vehicleUpdateManyWithoutVehiclesNestedInput;
    vehicle_combinations_tractor?: Prisma.vehicle_combinationsUpdateManyWithoutTractorNestedInput;
};
export type vehiclesUncheckedUpdateWithoutVehicle_combinations_trailerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    plate?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    year?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    max_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicleDocuments?: Prisma.documents_vehicleUncheckedUpdateManyWithoutVehiclesNestedInput;
    vehicle_combinations_tractor?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutTractorNestedInput;
};
export type vehiclesCreateWithoutVehicleDocumentsInput = {
    id?: string;
    type: string;
    plate: string;
    brand?: string | null;
    model?: string | null;
    year?: number | null;
    max_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: boolean | null;
    active?: boolean;
    created_at?: Date | string;
    vehicle_combinations_tractor?: Prisma.vehicle_combinationsCreateNestedManyWithoutTractorInput;
    vehicle_combinations_trailer?: Prisma.vehicle_combinationsCreateNestedManyWithoutTrailerInput;
};
export type vehiclesUncheckedCreateWithoutVehicleDocumentsInput = {
    id?: string;
    type: string;
    plate: string;
    brand?: string | null;
    model?: string | null;
    year?: number | null;
    max_weight?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: boolean | null;
    active?: boolean;
    created_at?: Date | string;
    vehicle_combinations_tractor?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutTractorInput;
    vehicle_combinations_trailer?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutTrailerInput;
};
export type vehiclesCreateOrConnectWithoutVehicleDocumentsInput = {
    where: Prisma.vehiclesWhereUniqueInput;
    create: Prisma.XOR<Prisma.vehiclesCreateWithoutVehicleDocumentsInput, Prisma.vehiclesUncheckedCreateWithoutVehicleDocumentsInput>;
};
export type vehiclesUpsertWithoutVehicleDocumentsInput = {
    update: Prisma.XOR<Prisma.vehiclesUpdateWithoutVehicleDocumentsInput, Prisma.vehiclesUncheckedUpdateWithoutVehicleDocumentsInput>;
    create: Prisma.XOR<Prisma.vehiclesCreateWithoutVehicleDocumentsInput, Prisma.vehiclesUncheckedCreateWithoutVehicleDocumentsInput>;
    where?: Prisma.vehiclesWhereInput;
};
export type vehiclesUpdateToOneWithWhereWithoutVehicleDocumentsInput = {
    where?: Prisma.vehiclesWhereInput;
    data: Prisma.XOR<Prisma.vehiclesUpdateWithoutVehicleDocumentsInput, Prisma.vehiclesUncheckedUpdateWithoutVehicleDocumentsInput>;
};
export type vehiclesUpdateWithoutVehicleDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    plate?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    year?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    max_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicle_combinations_tractor?: Prisma.vehicle_combinationsUpdateManyWithoutTractorNestedInput;
    vehicle_combinations_trailer?: Prisma.vehicle_combinationsUpdateManyWithoutTrailerNestedInput;
};
export type vehiclesUncheckedUpdateWithoutVehicleDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    plate?: Prisma.StringFieldUpdateOperationsInput | string;
    brand?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    year?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    max_weight?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    max_volume?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    refrigeration?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicle_combinations_tractor?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutTractorNestedInput;
    vehicle_combinations_trailer?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutTrailerNestedInput;
};
export type VehiclesCountOutputType = {
    vehicleDocuments: number;
    vehicle_combinations_tractor: number;
    vehicle_combinations_trailer: number;
};
export type VehiclesCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    vehicleDocuments?: boolean | VehiclesCountOutputTypeCountVehicleDocumentsArgs;
    vehicle_combinations_tractor?: boolean | VehiclesCountOutputTypeCountVehicle_combinations_tractorArgs;
    vehicle_combinations_trailer?: boolean | VehiclesCountOutputTypeCountVehicle_combinations_trailerArgs;
};
export type VehiclesCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.VehiclesCountOutputTypeSelect<ExtArgs> | null;
};
export type VehiclesCountOutputTypeCountVehicleDocumentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documents_vehicleWhereInput;
};
export type VehiclesCountOutputTypeCountVehicle_combinations_tractorArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.vehicle_combinationsWhereInput;
};
export type VehiclesCountOutputTypeCountVehicle_combinations_trailerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.vehicle_combinationsWhereInput;
};
export type vehiclesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    plate?: boolean;
    brand?: boolean;
    model?: boolean;
    year?: boolean;
    max_weight?: boolean;
    max_volume?: boolean;
    refrigeration?: boolean;
    active?: boolean;
    created_at?: boolean;
    vehicleDocuments?: boolean | Prisma.vehicles$vehicleDocumentsArgs<ExtArgs>;
    vehicle_combinations_tractor?: boolean | Prisma.vehicles$vehicle_combinations_tractorArgs<ExtArgs>;
    vehicle_combinations_trailer?: boolean | Prisma.vehicles$vehicle_combinations_trailerArgs<ExtArgs>;
    _count?: boolean | Prisma.VehiclesCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vehicles"]>;
export type vehiclesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    plate?: boolean;
    brand?: boolean;
    model?: boolean;
    year?: boolean;
    max_weight?: boolean;
    max_volume?: boolean;
    refrigeration?: boolean;
    active?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["vehicles"]>;
export type vehiclesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    plate?: boolean;
    brand?: boolean;
    model?: boolean;
    year?: boolean;
    max_weight?: boolean;
    max_volume?: boolean;
    refrigeration?: boolean;
    active?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["vehicles"]>;
export type vehiclesSelectScalar = {
    id?: boolean;
    type?: boolean;
    plate?: boolean;
    brand?: boolean;
    model?: boolean;
    year?: boolean;
    max_weight?: boolean;
    max_volume?: boolean;
    refrigeration?: boolean;
    active?: boolean;
    created_at?: boolean;
};
export type vehiclesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "type" | "plate" | "brand" | "model" | "year" | "max_weight" | "max_volume" | "refrigeration" | "active" | "created_at", ExtArgs["result"]["vehicles"]>;
export type vehiclesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    vehicleDocuments?: boolean | Prisma.vehicles$vehicleDocumentsArgs<ExtArgs>;
    vehicle_combinations_tractor?: boolean | Prisma.vehicles$vehicle_combinations_tractorArgs<ExtArgs>;
    vehicle_combinations_trailer?: boolean | Prisma.vehicles$vehicle_combinations_trailerArgs<ExtArgs>;
    _count?: boolean | Prisma.VehiclesCountOutputTypeDefaultArgs<ExtArgs>;
};
export type vehiclesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type vehiclesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $vehiclesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "vehicles";
    objects: {
        vehicleDocuments: Prisma.$documents_vehiclePayload<ExtArgs>[];
        vehicle_combinations_tractor: Prisma.$vehicle_combinationsPayload<ExtArgs>[];
        vehicle_combinations_trailer: Prisma.$vehicle_combinationsPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        type: string;
        plate: string;
        brand: string | null;
        model: string | null;
        year: number | null;
        max_weight: runtime.Decimal | null;
        max_volume: runtime.Decimal | null;
        refrigeration: boolean | null;
        active: boolean;
        created_at: Date;
    }, ExtArgs["result"]["vehicles"]>;
    composites: {};
};
export type vehiclesGetPayload<S extends boolean | null | undefined | vehiclesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$vehiclesPayload, S>;
export type vehiclesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<vehiclesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: VehiclesCountAggregateInputType | true;
};
export interface vehiclesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['vehicles'];
        meta: {
            name: 'vehicles';
        };
    };
    findUnique<T extends vehiclesFindUniqueArgs>(args: Prisma.SelectSubset<T, vehiclesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__vehiclesClient<runtime.Types.Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends vehiclesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, vehiclesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__vehiclesClient<runtime.Types.Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends vehiclesFindFirstArgs>(args?: Prisma.SelectSubset<T, vehiclesFindFirstArgs<ExtArgs>>): Prisma.Prisma__vehiclesClient<runtime.Types.Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends vehiclesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, vehiclesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__vehiclesClient<runtime.Types.Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends vehiclesFindManyArgs>(args?: Prisma.SelectSubset<T, vehiclesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends vehiclesCreateArgs>(args: Prisma.SelectSubset<T, vehiclesCreateArgs<ExtArgs>>): Prisma.Prisma__vehiclesClient<runtime.Types.Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends vehiclesCreateManyArgs>(args?: Prisma.SelectSubset<T, vehiclesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends vehiclesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, vehiclesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends vehiclesDeleteArgs>(args: Prisma.SelectSubset<T, vehiclesDeleteArgs<ExtArgs>>): Prisma.Prisma__vehiclesClient<runtime.Types.Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends vehiclesUpdateArgs>(args: Prisma.SelectSubset<T, vehiclesUpdateArgs<ExtArgs>>): Prisma.Prisma__vehiclesClient<runtime.Types.Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends vehiclesDeleteManyArgs>(args?: Prisma.SelectSubset<T, vehiclesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends vehiclesUpdateManyArgs>(args: Prisma.SelectSubset<T, vehiclesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends vehiclesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, vehiclesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends vehiclesUpsertArgs>(args: Prisma.SelectSubset<T, vehiclesUpsertArgs<ExtArgs>>): Prisma.Prisma__vehiclesClient<runtime.Types.Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends vehiclesCountArgs>(args?: Prisma.Subset<T, vehiclesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], VehiclesCountAggregateOutputType> : number>;
    aggregate<T extends VehiclesAggregateArgs>(args: Prisma.Subset<T, VehiclesAggregateArgs>): Prisma.PrismaPromise<GetVehiclesAggregateType<T>>;
    groupBy<T extends vehiclesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: vehiclesGroupByArgs['orderBy'];
    } : {
        orderBy?: vehiclesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, vehiclesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehiclesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: vehiclesFieldRefs;
}
export interface Prisma__vehiclesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    vehicleDocuments<T extends Prisma.vehicles$vehicleDocumentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.vehicles$vehicleDocumentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documents_vehiclePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    vehicle_combinations_tractor<T extends Prisma.vehicles$vehicle_combinations_tractorArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.vehicles$vehicle_combinations_tractorArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    vehicle_combinations_trailer<T extends Prisma.vehicles$vehicle_combinations_trailerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.vehicles$vehicle_combinations_trailerArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface vehiclesFieldRefs {
    readonly id: Prisma.FieldRef<"vehicles", 'String'>;
    readonly type: Prisma.FieldRef<"vehicles", 'String'>;
    readonly plate: Prisma.FieldRef<"vehicles", 'String'>;
    readonly brand: Prisma.FieldRef<"vehicles", 'String'>;
    readonly model: Prisma.FieldRef<"vehicles", 'String'>;
    readonly year: Prisma.FieldRef<"vehicles", 'Int'>;
    readonly max_weight: Prisma.FieldRef<"vehicles", 'Decimal'>;
    readonly max_volume: Prisma.FieldRef<"vehicles", 'Decimal'>;
    readonly refrigeration: Prisma.FieldRef<"vehicles", 'Boolean'>;
    readonly active: Prisma.FieldRef<"vehicles", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"vehicles", 'DateTime'>;
}
export type vehiclesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehiclesSelect<ExtArgs> | null;
    omit?: Prisma.vehiclesOmit<ExtArgs> | null;
    include?: Prisma.vehiclesInclude<ExtArgs> | null;
    where: Prisma.vehiclesWhereUniqueInput;
};
export type vehiclesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehiclesSelect<ExtArgs> | null;
    omit?: Prisma.vehiclesOmit<ExtArgs> | null;
    include?: Prisma.vehiclesInclude<ExtArgs> | null;
    where: Prisma.vehiclesWhereUniqueInput;
};
export type vehiclesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehiclesSelect<ExtArgs> | null;
    omit?: Prisma.vehiclesOmit<ExtArgs> | null;
    include?: Prisma.vehiclesInclude<ExtArgs> | null;
    where?: Prisma.vehiclesWhereInput;
    orderBy?: Prisma.vehiclesOrderByWithRelationInput | Prisma.vehiclesOrderByWithRelationInput[];
    cursor?: Prisma.vehiclesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VehiclesScalarFieldEnum | Prisma.VehiclesScalarFieldEnum[];
};
export type vehiclesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehiclesSelect<ExtArgs> | null;
    omit?: Prisma.vehiclesOmit<ExtArgs> | null;
    include?: Prisma.vehiclesInclude<ExtArgs> | null;
    where?: Prisma.vehiclesWhereInput;
    orderBy?: Prisma.vehiclesOrderByWithRelationInput | Prisma.vehiclesOrderByWithRelationInput[];
    cursor?: Prisma.vehiclesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VehiclesScalarFieldEnum | Prisma.VehiclesScalarFieldEnum[];
};
export type vehiclesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehiclesSelect<ExtArgs> | null;
    omit?: Prisma.vehiclesOmit<ExtArgs> | null;
    include?: Prisma.vehiclesInclude<ExtArgs> | null;
    where?: Prisma.vehiclesWhereInput;
    orderBy?: Prisma.vehiclesOrderByWithRelationInput | Prisma.vehiclesOrderByWithRelationInput[];
    cursor?: Prisma.vehiclesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.VehiclesScalarFieldEnum | Prisma.VehiclesScalarFieldEnum[];
};
export type vehiclesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehiclesSelect<ExtArgs> | null;
    omit?: Prisma.vehiclesOmit<ExtArgs> | null;
    include?: Prisma.vehiclesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.vehiclesCreateInput, Prisma.vehiclesUncheckedCreateInput>;
};
export type vehiclesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.vehiclesCreateManyInput | Prisma.vehiclesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type vehiclesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehiclesSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.vehiclesOmit<ExtArgs> | null;
    data: Prisma.vehiclesCreateManyInput | Prisma.vehiclesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type vehiclesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehiclesSelect<ExtArgs> | null;
    omit?: Prisma.vehiclesOmit<ExtArgs> | null;
    include?: Prisma.vehiclesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.vehiclesUpdateInput, Prisma.vehiclesUncheckedUpdateInput>;
    where: Prisma.vehiclesWhereUniqueInput;
};
export type vehiclesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.vehiclesUpdateManyMutationInput, Prisma.vehiclesUncheckedUpdateManyInput>;
    where?: Prisma.vehiclesWhereInput;
    limit?: number;
};
export type vehiclesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehiclesSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.vehiclesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.vehiclesUpdateManyMutationInput, Prisma.vehiclesUncheckedUpdateManyInput>;
    where?: Prisma.vehiclesWhereInput;
    limit?: number;
};
export type vehiclesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehiclesSelect<ExtArgs> | null;
    omit?: Prisma.vehiclesOmit<ExtArgs> | null;
    include?: Prisma.vehiclesInclude<ExtArgs> | null;
    where: Prisma.vehiclesWhereUniqueInput;
    create: Prisma.XOR<Prisma.vehiclesCreateInput, Prisma.vehiclesUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.vehiclesUpdateInput, Prisma.vehiclesUncheckedUpdateInput>;
};
export type vehiclesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehiclesSelect<ExtArgs> | null;
    omit?: Prisma.vehiclesOmit<ExtArgs> | null;
    include?: Prisma.vehiclesInclude<ExtArgs> | null;
    where: Prisma.vehiclesWhereUniqueInput;
};
export type vehiclesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.vehiclesWhereInput;
    limit?: number;
};
export type vehicles$vehicleDocumentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_vehicleSelect<ExtArgs> | null;
    omit?: Prisma.documents_vehicleOmit<ExtArgs> | null;
    include?: Prisma.documents_vehicleInclude<ExtArgs> | null;
    where?: Prisma.documents_vehicleWhereInput;
    orderBy?: Prisma.documents_vehicleOrderByWithRelationInput | Prisma.documents_vehicleOrderByWithRelationInput[];
    cursor?: Prisma.documents_vehicleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Documents_vehicleScalarFieldEnum | Prisma.Documents_vehicleScalarFieldEnum[];
};
export type vehicles$vehicle_combinations_tractorArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehicle_combinationsSelect<ExtArgs> | null;
    omit?: Prisma.vehicle_combinationsOmit<ExtArgs> | null;
    include?: Prisma.vehicle_combinationsInclude<ExtArgs> | null;
    where?: Prisma.vehicle_combinationsWhereInput;
    orderBy?: Prisma.vehicle_combinationsOrderByWithRelationInput | Prisma.vehicle_combinationsOrderByWithRelationInput[];
    cursor?: Prisma.vehicle_combinationsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Vehicle_combinationsScalarFieldEnum | Prisma.Vehicle_combinationsScalarFieldEnum[];
};
export type vehicles$vehicle_combinations_trailerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehicle_combinationsSelect<ExtArgs> | null;
    omit?: Prisma.vehicle_combinationsOmit<ExtArgs> | null;
    include?: Prisma.vehicle_combinationsInclude<ExtArgs> | null;
    where?: Prisma.vehicle_combinationsWhereInput;
    orderBy?: Prisma.vehicle_combinationsOrderByWithRelationInput | Prisma.vehicle_combinationsOrderByWithRelationInput[];
    cursor?: Prisma.vehicle_combinationsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Vehicle_combinationsScalarFieldEnum | Prisma.Vehicle_combinationsScalarFieldEnum[];
};
export type vehiclesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehiclesSelect<ExtArgs> | null;
    omit?: Prisma.vehiclesOmit<ExtArgs> | null;
    include?: Prisma.vehiclesInclude<ExtArgs> | null;
};
