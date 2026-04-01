import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type vehicle_combinationsModel = runtime.Types.Result.DefaultSelection<Prisma.$vehicle_combinationsPayload>;
export type AggregateVehicle_combinations = {
    _count: Vehicle_combinationsCountAggregateOutputType | null;
    _min: Vehicle_combinationsMinAggregateOutputType | null;
    _max: Vehicle_combinationsMaxAggregateOutputType | null;
};
export type Vehicle_combinationsMinAggregateOutputType = {
    id: string | null;
    tractor_id: string | null;
    trailer_id: string | null;
    valid_from: Date | null;
    valid_until: Date | null;
    created_by: string | null;
    created_at: Date | null;
    unit_number: string | null;
    driver_id: string | null;
    deleted_at: Date | null;
    deleted_by: string | null;
};
export type Vehicle_combinationsMaxAggregateOutputType = {
    id: string | null;
    tractor_id: string | null;
    trailer_id: string | null;
    valid_from: Date | null;
    valid_until: Date | null;
    created_by: string | null;
    created_at: Date | null;
    unit_number: string | null;
    driver_id: string | null;
    deleted_at: Date | null;
    deleted_by: string | null;
};
export type Vehicle_combinationsCountAggregateOutputType = {
    id: number;
    tractor_id: number;
    trailer_id: number;
    valid_from: number;
    valid_until: number;
    created_by: number;
    created_at: number;
    unit_number: number;
    driver_id: number;
    deleted_at: number;
    deleted_by: number;
    _all: number;
};
export type Vehicle_combinationsMinAggregateInputType = {
    id?: true;
    tractor_id?: true;
    trailer_id?: true;
    valid_from?: true;
    valid_until?: true;
    created_by?: true;
    created_at?: true;
    unit_number?: true;
    driver_id?: true;
    deleted_at?: true;
    deleted_by?: true;
};
export type Vehicle_combinationsMaxAggregateInputType = {
    id?: true;
    tractor_id?: true;
    trailer_id?: true;
    valid_from?: true;
    valid_until?: true;
    created_by?: true;
    created_at?: true;
    unit_number?: true;
    driver_id?: true;
    deleted_at?: true;
    deleted_by?: true;
};
export type Vehicle_combinationsCountAggregateInputType = {
    id?: true;
    tractor_id?: true;
    trailer_id?: true;
    valid_from?: true;
    valid_until?: true;
    created_by?: true;
    created_at?: true;
    unit_number?: true;
    driver_id?: true;
    deleted_at?: true;
    deleted_by?: true;
    _all?: true;
};
export type Vehicle_combinationsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.vehicle_combinationsWhereInput;
    orderBy?: Prisma.vehicle_combinationsOrderByWithRelationInput | Prisma.vehicle_combinationsOrderByWithRelationInput[];
    cursor?: Prisma.vehicle_combinationsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Vehicle_combinationsCountAggregateInputType;
    _min?: Vehicle_combinationsMinAggregateInputType;
    _max?: Vehicle_combinationsMaxAggregateInputType;
};
export type GetVehicle_combinationsAggregateType<T extends Vehicle_combinationsAggregateArgs> = {
    [P in keyof T & keyof AggregateVehicle_combinations]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateVehicle_combinations[P]> : Prisma.GetScalarType<T[P], AggregateVehicle_combinations[P]>;
};
export type vehicle_combinationsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.vehicle_combinationsWhereInput;
    orderBy?: Prisma.vehicle_combinationsOrderByWithAggregationInput | Prisma.vehicle_combinationsOrderByWithAggregationInput[];
    by: Prisma.Vehicle_combinationsScalarFieldEnum[] | Prisma.Vehicle_combinationsScalarFieldEnum;
    having?: Prisma.vehicle_combinationsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Vehicle_combinationsCountAggregateInputType | true;
    _min?: Vehicle_combinationsMinAggregateInputType;
    _max?: Vehicle_combinationsMaxAggregateInputType;
};
export type Vehicle_combinationsGroupByOutputType = {
    id: string;
    tractor_id: string;
    trailer_id: string | null;
    valid_from: Date;
    valid_until: Date | null;
    created_by: string | null;
    created_at: Date;
    unit_number: string | null;
    driver_id: string | null;
    deleted_at: Date | null;
    deleted_by: string | null;
    _count: Vehicle_combinationsCountAggregateOutputType | null;
    _min: Vehicle_combinationsMinAggregateOutputType | null;
    _max: Vehicle_combinationsMaxAggregateOutputType | null;
};
export type GetVehicle_combinationsGroupByPayload<T extends vehicle_combinationsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Vehicle_combinationsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Vehicle_combinationsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Vehicle_combinationsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Vehicle_combinationsGroupByOutputType[P]>;
}>>;
export type vehicle_combinationsWhereInput = {
    AND?: Prisma.vehicle_combinationsWhereInput | Prisma.vehicle_combinationsWhereInput[];
    OR?: Prisma.vehicle_combinationsWhereInput[];
    NOT?: Prisma.vehicle_combinationsWhereInput | Prisma.vehicle_combinationsWhereInput[];
    id?: Prisma.UuidFilter<"vehicle_combinations"> | string;
    tractor_id?: Prisma.UuidFilter<"vehicle_combinations"> | string;
    trailer_id?: Prisma.UuidNullableFilter<"vehicle_combinations"> | string | null;
    valid_from?: Prisma.DateTimeFilter<"vehicle_combinations"> | Date | string;
    valid_until?: Prisma.DateTimeNullableFilter<"vehicle_combinations"> | Date | string | null;
    created_by?: Prisma.UuidNullableFilter<"vehicle_combinations"> | string | null;
    created_at?: Prisma.DateTimeFilter<"vehicle_combinations"> | Date | string;
    unit_number?: Prisma.StringNullableFilter<"vehicle_combinations"> | string | null;
    driver_id?: Prisma.UuidNullableFilter<"vehicle_combinations"> | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"vehicle_combinations"> | Date | string | null;
    deleted_by?: Prisma.StringNullableFilter<"vehicle_combinations"> | string | null;
    trips?: Prisma.TripsListRelationFilter;
    drivers?: Prisma.XOR<Prisma.DriversNullableScalarRelationFilter, Prisma.driversWhereInput> | null;
    users?: Prisma.XOR<Prisma.UsersNullableScalarRelationFilter, Prisma.usersWhereInput> | null;
    tractor?: Prisma.XOR<Prisma.VehiclesScalarRelationFilter, Prisma.vehiclesWhereInput>;
    trailer?: Prisma.XOR<Prisma.VehiclesNullableScalarRelationFilter, Prisma.vehiclesWhereInput> | null;
};
export type vehicle_combinationsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tractor_id?: Prisma.SortOrder;
    trailer_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    valid_from?: Prisma.SortOrder;
    valid_until?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    unit_number?: Prisma.SortOrderInput | Prisma.SortOrder;
    driver_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    trips?: Prisma.tripsOrderByRelationAggregateInput;
    drivers?: Prisma.driversOrderByWithRelationInput;
    users?: Prisma.usersOrderByWithRelationInput;
    tractor?: Prisma.vehiclesOrderByWithRelationInput;
    trailer?: Prisma.vehiclesOrderByWithRelationInput;
};
export type vehicle_combinationsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.vehicle_combinationsWhereInput | Prisma.vehicle_combinationsWhereInput[];
    OR?: Prisma.vehicle_combinationsWhereInput[];
    NOT?: Prisma.vehicle_combinationsWhereInput | Prisma.vehicle_combinationsWhereInput[];
    tractor_id?: Prisma.UuidFilter<"vehicle_combinations"> | string;
    trailer_id?: Prisma.UuidNullableFilter<"vehicle_combinations"> | string | null;
    valid_from?: Prisma.DateTimeFilter<"vehicle_combinations"> | Date | string;
    valid_until?: Prisma.DateTimeNullableFilter<"vehicle_combinations"> | Date | string | null;
    created_by?: Prisma.UuidNullableFilter<"vehicle_combinations"> | string | null;
    created_at?: Prisma.DateTimeFilter<"vehicle_combinations"> | Date | string;
    unit_number?: Prisma.StringNullableFilter<"vehicle_combinations"> | string | null;
    driver_id?: Prisma.UuidNullableFilter<"vehicle_combinations"> | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"vehicle_combinations"> | Date | string | null;
    deleted_by?: Prisma.StringNullableFilter<"vehicle_combinations"> | string | null;
    trips?: Prisma.TripsListRelationFilter;
    drivers?: Prisma.XOR<Prisma.DriversNullableScalarRelationFilter, Prisma.driversWhereInput> | null;
    users?: Prisma.XOR<Prisma.UsersNullableScalarRelationFilter, Prisma.usersWhereInput> | null;
    tractor?: Prisma.XOR<Prisma.VehiclesScalarRelationFilter, Prisma.vehiclesWhereInput>;
    trailer?: Prisma.XOR<Prisma.VehiclesNullableScalarRelationFilter, Prisma.vehiclesWhereInput> | null;
}, "id">;
export type vehicle_combinationsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tractor_id?: Prisma.SortOrder;
    trailer_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    valid_from?: Prisma.SortOrder;
    valid_until?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    unit_number?: Prisma.SortOrderInput | Prisma.SortOrder;
    driver_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    deleted_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.vehicle_combinationsCountOrderByAggregateInput;
    _max?: Prisma.vehicle_combinationsMaxOrderByAggregateInput;
    _min?: Prisma.vehicle_combinationsMinOrderByAggregateInput;
};
export type vehicle_combinationsScalarWhereWithAggregatesInput = {
    AND?: Prisma.vehicle_combinationsScalarWhereWithAggregatesInput | Prisma.vehicle_combinationsScalarWhereWithAggregatesInput[];
    OR?: Prisma.vehicle_combinationsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.vehicle_combinationsScalarWhereWithAggregatesInput | Prisma.vehicle_combinationsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"vehicle_combinations"> | string;
    tractor_id?: Prisma.UuidWithAggregatesFilter<"vehicle_combinations"> | string;
    trailer_id?: Prisma.UuidNullableWithAggregatesFilter<"vehicle_combinations"> | string | null;
    valid_from?: Prisma.DateTimeWithAggregatesFilter<"vehicle_combinations"> | Date | string;
    valid_until?: Prisma.DateTimeNullableWithAggregatesFilter<"vehicle_combinations"> | Date | string | null;
    created_by?: Prisma.UuidNullableWithAggregatesFilter<"vehicle_combinations"> | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"vehicle_combinations"> | Date | string;
    unit_number?: Prisma.StringNullableWithAggregatesFilter<"vehicle_combinations"> | string | null;
    driver_id?: Prisma.UuidNullableWithAggregatesFilter<"vehicle_combinations"> | string | null;
    deleted_at?: Prisma.DateTimeNullableWithAggregatesFilter<"vehicle_combinations"> | Date | string | null;
    deleted_by?: Prisma.StringNullableWithAggregatesFilter<"vehicle_combinations"> | string | null;
};
export type vehicle_combinationsCreateInput = {
    id?: string;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
    trips?: Prisma.tripsCreateNestedManyWithoutVehicle_combinationInput;
    drivers?: Prisma.driversCreateNestedOneWithoutVehicleCombinationsInput;
    users?: Prisma.usersCreateNestedOneWithoutVehicle_combinationsInput;
    tractor: Prisma.vehiclesCreateNestedOneWithoutVehicle_combinations_tractorInput;
    trailer?: Prisma.vehiclesCreateNestedOneWithoutVehicle_combinations_trailerInput;
};
export type vehicle_combinationsUncheckedCreateInput = {
    id?: string;
    tractor_id: string;
    trailer_id?: string | null;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_by?: string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    driver_id?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutVehicle_combinationInput;
};
export type vehicle_combinationsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trips?: Prisma.tripsUpdateManyWithoutVehicle_combinationNestedInput;
    drivers?: Prisma.driversUpdateOneWithoutVehicleCombinationsNestedInput;
    users?: Prisma.usersUpdateOneWithoutVehicle_combinationsNestedInput;
    tractor?: Prisma.vehiclesUpdateOneRequiredWithoutVehicle_combinations_tractorNestedInput;
    trailer?: Prisma.vehiclesUpdateOneWithoutVehicle_combinations_trailerNestedInput;
};
export type vehicle_combinationsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tractor_id?: Prisma.StringFieldUpdateOperationsInput | string;
    trailer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    driver_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutVehicle_combinationNestedInput;
};
export type vehicle_combinationsCreateManyInput = {
    id?: string;
    tractor_id: string;
    trailer_id?: string | null;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_by?: string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    driver_id?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
};
export type vehicle_combinationsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type vehicle_combinationsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tractor_id?: Prisma.StringFieldUpdateOperationsInput | string;
    trailer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    driver_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type Vehicle_combinationsListRelationFilter = {
    every?: Prisma.vehicle_combinationsWhereInput;
    some?: Prisma.vehicle_combinationsWhereInput;
    none?: Prisma.vehicle_combinationsWhereInput;
};
export type vehicle_combinationsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type Vehicle_combinationsNullableScalarRelationFilter = {
    is?: Prisma.vehicle_combinationsWhereInput | null;
    isNot?: Prisma.vehicle_combinationsWhereInput | null;
};
export type vehicle_combinationsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tractor_id?: Prisma.SortOrder;
    trailer_id?: Prisma.SortOrder;
    valid_from?: Prisma.SortOrder;
    valid_until?: Prisma.SortOrder;
    created_by?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    unit_number?: Prisma.SortOrder;
    driver_id?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    deleted_by?: Prisma.SortOrder;
};
export type vehicle_combinationsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tractor_id?: Prisma.SortOrder;
    trailer_id?: Prisma.SortOrder;
    valid_from?: Prisma.SortOrder;
    valid_until?: Prisma.SortOrder;
    created_by?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    unit_number?: Prisma.SortOrder;
    driver_id?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    deleted_by?: Prisma.SortOrder;
};
export type vehicle_combinationsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tractor_id?: Prisma.SortOrder;
    trailer_id?: Prisma.SortOrder;
    valid_from?: Prisma.SortOrder;
    valid_until?: Prisma.SortOrder;
    created_by?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    unit_number?: Prisma.SortOrder;
    driver_id?: Prisma.SortOrder;
    deleted_at?: Prisma.SortOrder;
    deleted_by?: Prisma.SortOrder;
};
export type vehicle_combinationsCreateNestedManyWithoutDriversInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutDriversInput, Prisma.vehicle_combinationsUncheckedCreateWithoutDriversInput> | Prisma.vehicle_combinationsCreateWithoutDriversInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutDriversInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutDriversInput | Prisma.vehicle_combinationsCreateOrConnectWithoutDriversInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyDriversInputEnvelope;
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
};
export type vehicle_combinationsUncheckedCreateNestedManyWithoutDriversInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutDriversInput, Prisma.vehicle_combinationsUncheckedCreateWithoutDriversInput> | Prisma.vehicle_combinationsCreateWithoutDriversInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutDriversInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutDriversInput | Prisma.vehicle_combinationsCreateOrConnectWithoutDriversInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyDriversInputEnvelope;
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
};
export type vehicle_combinationsUpdateManyWithoutDriversNestedInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutDriversInput, Prisma.vehicle_combinationsUncheckedCreateWithoutDriversInput> | Prisma.vehicle_combinationsCreateWithoutDriversInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutDriversInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutDriversInput | Prisma.vehicle_combinationsCreateOrConnectWithoutDriversInput[];
    upsert?: Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutDriversInput | Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutDriversInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyDriversInputEnvelope;
    set?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    disconnect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    delete?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    update?: Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutDriversInput | Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutDriversInput[];
    updateMany?: Prisma.vehicle_combinationsUpdateManyWithWhereWithoutDriversInput | Prisma.vehicle_combinationsUpdateManyWithWhereWithoutDriversInput[];
    deleteMany?: Prisma.vehicle_combinationsScalarWhereInput | Prisma.vehicle_combinationsScalarWhereInput[];
};
export type vehicle_combinationsUncheckedUpdateManyWithoutDriversNestedInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutDriversInput, Prisma.vehicle_combinationsUncheckedCreateWithoutDriversInput> | Prisma.vehicle_combinationsCreateWithoutDriversInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutDriversInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutDriversInput | Prisma.vehicle_combinationsCreateOrConnectWithoutDriversInput[];
    upsert?: Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutDriversInput | Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutDriversInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyDriversInputEnvelope;
    set?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    disconnect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    delete?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    update?: Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutDriversInput | Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutDriversInput[];
    updateMany?: Prisma.vehicle_combinationsUpdateManyWithWhereWithoutDriversInput | Prisma.vehicle_combinationsUpdateManyWithWhereWithoutDriversInput[];
    deleteMany?: Prisma.vehicle_combinationsScalarWhereInput | Prisma.vehicle_combinationsScalarWhereInput[];
};
export type vehicle_combinationsCreateNestedOneWithoutTripsInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTripsInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTripsInput>;
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutTripsInput;
    connect?: Prisma.vehicle_combinationsWhereUniqueInput;
};
export type vehicle_combinationsUpdateOneWithoutTripsNestedInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTripsInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTripsInput>;
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutTripsInput;
    upsert?: Prisma.vehicle_combinationsUpsertWithoutTripsInput;
    disconnect?: Prisma.vehicle_combinationsWhereInput | boolean;
    delete?: Prisma.vehicle_combinationsWhereInput | boolean;
    connect?: Prisma.vehicle_combinationsWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.vehicle_combinationsUpdateToOneWithWhereWithoutTripsInput, Prisma.vehicle_combinationsUpdateWithoutTripsInput>, Prisma.vehicle_combinationsUncheckedUpdateWithoutTripsInput>;
};
export type vehicle_combinationsCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutUsersInput, Prisma.vehicle_combinationsUncheckedCreateWithoutUsersInput> | Prisma.vehicle_combinationsCreateWithoutUsersInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutUsersInput | Prisma.vehicle_combinationsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyUsersInputEnvelope;
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
};
export type vehicle_combinationsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutUsersInput, Prisma.vehicle_combinationsUncheckedCreateWithoutUsersInput> | Prisma.vehicle_combinationsCreateWithoutUsersInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutUsersInput | Prisma.vehicle_combinationsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyUsersInputEnvelope;
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
};
export type vehicle_combinationsUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutUsersInput, Prisma.vehicle_combinationsUncheckedCreateWithoutUsersInput> | Prisma.vehicle_combinationsCreateWithoutUsersInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutUsersInput | Prisma.vehicle_combinationsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutUsersInput | Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyUsersInputEnvelope;
    set?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    disconnect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    delete?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    update?: Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutUsersInput | Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.vehicle_combinationsUpdateManyWithWhereWithoutUsersInput | Prisma.vehicle_combinationsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.vehicle_combinationsScalarWhereInput | Prisma.vehicle_combinationsScalarWhereInput[];
};
export type vehicle_combinationsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutUsersInput, Prisma.vehicle_combinationsUncheckedCreateWithoutUsersInput> | Prisma.vehicle_combinationsCreateWithoutUsersInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutUsersInput | Prisma.vehicle_combinationsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutUsersInput | Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyUsersInputEnvelope;
    set?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    disconnect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    delete?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    update?: Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutUsersInput | Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.vehicle_combinationsUpdateManyWithWhereWithoutUsersInput | Prisma.vehicle_combinationsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.vehicle_combinationsScalarWhereInput | Prisma.vehicle_combinationsScalarWhereInput[];
};
export type vehicle_combinationsCreateNestedManyWithoutTractorInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTractorInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTractorInput> | Prisma.vehicle_combinationsCreateWithoutTractorInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutTractorInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutTractorInput | Prisma.vehicle_combinationsCreateOrConnectWithoutTractorInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyTractorInputEnvelope;
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
};
export type vehicle_combinationsCreateNestedManyWithoutTrailerInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTrailerInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTrailerInput> | Prisma.vehicle_combinationsCreateWithoutTrailerInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutTrailerInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutTrailerInput | Prisma.vehicle_combinationsCreateOrConnectWithoutTrailerInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyTrailerInputEnvelope;
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
};
export type vehicle_combinationsUncheckedCreateNestedManyWithoutTractorInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTractorInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTractorInput> | Prisma.vehicle_combinationsCreateWithoutTractorInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutTractorInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutTractorInput | Prisma.vehicle_combinationsCreateOrConnectWithoutTractorInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyTractorInputEnvelope;
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
};
export type vehicle_combinationsUncheckedCreateNestedManyWithoutTrailerInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTrailerInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTrailerInput> | Prisma.vehicle_combinationsCreateWithoutTrailerInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutTrailerInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutTrailerInput | Prisma.vehicle_combinationsCreateOrConnectWithoutTrailerInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyTrailerInputEnvelope;
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
};
export type vehicle_combinationsUpdateManyWithoutTractorNestedInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTractorInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTractorInput> | Prisma.vehicle_combinationsCreateWithoutTractorInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutTractorInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutTractorInput | Prisma.vehicle_combinationsCreateOrConnectWithoutTractorInput[];
    upsert?: Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutTractorInput | Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutTractorInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyTractorInputEnvelope;
    set?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    disconnect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    delete?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    update?: Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutTractorInput | Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutTractorInput[];
    updateMany?: Prisma.vehicle_combinationsUpdateManyWithWhereWithoutTractorInput | Prisma.vehicle_combinationsUpdateManyWithWhereWithoutTractorInput[];
    deleteMany?: Prisma.vehicle_combinationsScalarWhereInput | Prisma.vehicle_combinationsScalarWhereInput[];
};
export type vehicle_combinationsUpdateManyWithoutTrailerNestedInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTrailerInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTrailerInput> | Prisma.vehicle_combinationsCreateWithoutTrailerInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutTrailerInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutTrailerInput | Prisma.vehicle_combinationsCreateOrConnectWithoutTrailerInput[];
    upsert?: Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutTrailerInput | Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutTrailerInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyTrailerInputEnvelope;
    set?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    disconnect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    delete?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    update?: Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutTrailerInput | Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutTrailerInput[];
    updateMany?: Prisma.vehicle_combinationsUpdateManyWithWhereWithoutTrailerInput | Prisma.vehicle_combinationsUpdateManyWithWhereWithoutTrailerInput[];
    deleteMany?: Prisma.vehicle_combinationsScalarWhereInput | Prisma.vehicle_combinationsScalarWhereInput[];
};
export type vehicle_combinationsUncheckedUpdateManyWithoutTractorNestedInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTractorInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTractorInput> | Prisma.vehicle_combinationsCreateWithoutTractorInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutTractorInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutTractorInput | Prisma.vehicle_combinationsCreateOrConnectWithoutTractorInput[];
    upsert?: Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutTractorInput | Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutTractorInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyTractorInputEnvelope;
    set?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    disconnect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    delete?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    update?: Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutTractorInput | Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutTractorInput[];
    updateMany?: Prisma.vehicle_combinationsUpdateManyWithWhereWithoutTractorInput | Prisma.vehicle_combinationsUpdateManyWithWhereWithoutTractorInput[];
    deleteMany?: Prisma.vehicle_combinationsScalarWhereInput | Prisma.vehicle_combinationsScalarWhereInput[];
};
export type vehicle_combinationsUncheckedUpdateManyWithoutTrailerNestedInput = {
    create?: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTrailerInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTrailerInput> | Prisma.vehicle_combinationsCreateWithoutTrailerInput[] | Prisma.vehicle_combinationsUncheckedCreateWithoutTrailerInput[];
    connectOrCreate?: Prisma.vehicle_combinationsCreateOrConnectWithoutTrailerInput | Prisma.vehicle_combinationsCreateOrConnectWithoutTrailerInput[];
    upsert?: Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutTrailerInput | Prisma.vehicle_combinationsUpsertWithWhereUniqueWithoutTrailerInput[];
    createMany?: Prisma.vehicle_combinationsCreateManyTrailerInputEnvelope;
    set?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    disconnect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    delete?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    connect?: Prisma.vehicle_combinationsWhereUniqueInput | Prisma.vehicle_combinationsWhereUniqueInput[];
    update?: Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutTrailerInput | Prisma.vehicle_combinationsUpdateWithWhereUniqueWithoutTrailerInput[];
    updateMany?: Prisma.vehicle_combinationsUpdateManyWithWhereWithoutTrailerInput | Prisma.vehicle_combinationsUpdateManyWithWhereWithoutTrailerInput[];
    deleteMany?: Prisma.vehicle_combinationsScalarWhereInput | Prisma.vehicle_combinationsScalarWhereInput[];
};
export type vehicle_combinationsCreateWithoutDriversInput = {
    id?: string;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
    trips?: Prisma.tripsCreateNestedManyWithoutVehicle_combinationInput;
    users?: Prisma.usersCreateNestedOneWithoutVehicle_combinationsInput;
    tractor: Prisma.vehiclesCreateNestedOneWithoutVehicle_combinations_tractorInput;
    trailer?: Prisma.vehiclesCreateNestedOneWithoutVehicle_combinations_trailerInput;
};
export type vehicle_combinationsUncheckedCreateWithoutDriversInput = {
    id?: string;
    tractor_id: string;
    trailer_id?: string | null;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_by?: string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutVehicle_combinationInput;
};
export type vehicle_combinationsCreateOrConnectWithoutDriversInput = {
    where: Prisma.vehicle_combinationsWhereUniqueInput;
    create: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutDriversInput, Prisma.vehicle_combinationsUncheckedCreateWithoutDriversInput>;
};
export type vehicle_combinationsCreateManyDriversInputEnvelope = {
    data: Prisma.vehicle_combinationsCreateManyDriversInput | Prisma.vehicle_combinationsCreateManyDriversInput[];
    skipDuplicates?: boolean;
};
export type vehicle_combinationsUpsertWithWhereUniqueWithoutDriversInput = {
    where: Prisma.vehicle_combinationsWhereUniqueInput;
    update: Prisma.XOR<Prisma.vehicle_combinationsUpdateWithoutDriversInput, Prisma.vehicle_combinationsUncheckedUpdateWithoutDriversInput>;
    create: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutDriversInput, Prisma.vehicle_combinationsUncheckedCreateWithoutDriversInput>;
};
export type vehicle_combinationsUpdateWithWhereUniqueWithoutDriversInput = {
    where: Prisma.vehicle_combinationsWhereUniqueInput;
    data: Prisma.XOR<Prisma.vehicle_combinationsUpdateWithoutDriversInput, Prisma.vehicle_combinationsUncheckedUpdateWithoutDriversInput>;
};
export type vehicle_combinationsUpdateManyWithWhereWithoutDriversInput = {
    where: Prisma.vehicle_combinationsScalarWhereInput;
    data: Prisma.XOR<Prisma.vehicle_combinationsUpdateManyMutationInput, Prisma.vehicle_combinationsUncheckedUpdateManyWithoutDriversInput>;
};
export type vehicle_combinationsScalarWhereInput = {
    AND?: Prisma.vehicle_combinationsScalarWhereInput | Prisma.vehicle_combinationsScalarWhereInput[];
    OR?: Prisma.vehicle_combinationsScalarWhereInput[];
    NOT?: Prisma.vehicle_combinationsScalarWhereInput | Prisma.vehicle_combinationsScalarWhereInput[];
    id?: Prisma.UuidFilter<"vehicle_combinations"> | string;
    tractor_id?: Prisma.UuidFilter<"vehicle_combinations"> | string;
    trailer_id?: Prisma.UuidNullableFilter<"vehicle_combinations"> | string | null;
    valid_from?: Prisma.DateTimeFilter<"vehicle_combinations"> | Date | string;
    valid_until?: Prisma.DateTimeNullableFilter<"vehicle_combinations"> | Date | string | null;
    created_by?: Prisma.UuidNullableFilter<"vehicle_combinations"> | string | null;
    created_at?: Prisma.DateTimeFilter<"vehicle_combinations"> | Date | string;
    unit_number?: Prisma.StringNullableFilter<"vehicle_combinations"> | string | null;
    driver_id?: Prisma.UuidNullableFilter<"vehicle_combinations"> | string | null;
    deleted_at?: Prisma.DateTimeNullableFilter<"vehicle_combinations"> | Date | string | null;
    deleted_by?: Prisma.StringNullableFilter<"vehicle_combinations"> | string | null;
};
export type vehicle_combinationsCreateWithoutTripsInput = {
    id?: string;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
    drivers?: Prisma.driversCreateNestedOneWithoutVehicleCombinationsInput;
    users?: Prisma.usersCreateNestedOneWithoutVehicle_combinationsInput;
    tractor: Prisma.vehiclesCreateNestedOneWithoutVehicle_combinations_tractorInput;
    trailer?: Prisma.vehiclesCreateNestedOneWithoutVehicle_combinations_trailerInput;
};
export type vehicle_combinationsUncheckedCreateWithoutTripsInput = {
    id?: string;
    tractor_id: string;
    trailer_id?: string | null;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_by?: string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    driver_id?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
};
export type vehicle_combinationsCreateOrConnectWithoutTripsInput = {
    where: Prisma.vehicle_combinationsWhereUniqueInput;
    create: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTripsInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTripsInput>;
};
export type vehicle_combinationsUpsertWithoutTripsInput = {
    update: Prisma.XOR<Prisma.vehicle_combinationsUpdateWithoutTripsInput, Prisma.vehicle_combinationsUncheckedUpdateWithoutTripsInput>;
    create: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTripsInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTripsInput>;
    where?: Prisma.vehicle_combinationsWhereInput;
};
export type vehicle_combinationsUpdateToOneWithWhereWithoutTripsInput = {
    where?: Prisma.vehicle_combinationsWhereInput;
    data: Prisma.XOR<Prisma.vehicle_combinationsUpdateWithoutTripsInput, Prisma.vehicle_combinationsUncheckedUpdateWithoutTripsInput>;
};
export type vehicle_combinationsUpdateWithoutTripsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    drivers?: Prisma.driversUpdateOneWithoutVehicleCombinationsNestedInput;
    users?: Prisma.usersUpdateOneWithoutVehicle_combinationsNestedInput;
    tractor?: Prisma.vehiclesUpdateOneRequiredWithoutVehicle_combinations_tractorNestedInput;
    trailer?: Prisma.vehiclesUpdateOneWithoutVehicle_combinations_trailerNestedInput;
};
export type vehicle_combinationsUncheckedUpdateWithoutTripsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tractor_id?: Prisma.StringFieldUpdateOperationsInput | string;
    trailer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    driver_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type vehicle_combinationsCreateWithoutUsersInput = {
    id?: string;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
    trips?: Prisma.tripsCreateNestedManyWithoutVehicle_combinationInput;
    drivers?: Prisma.driversCreateNestedOneWithoutVehicleCombinationsInput;
    tractor: Prisma.vehiclesCreateNestedOneWithoutVehicle_combinations_tractorInput;
    trailer?: Prisma.vehiclesCreateNestedOneWithoutVehicle_combinations_trailerInput;
};
export type vehicle_combinationsUncheckedCreateWithoutUsersInput = {
    id?: string;
    tractor_id: string;
    trailer_id?: string | null;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    driver_id?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutVehicle_combinationInput;
};
export type vehicle_combinationsCreateOrConnectWithoutUsersInput = {
    where: Prisma.vehicle_combinationsWhereUniqueInput;
    create: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutUsersInput, Prisma.vehicle_combinationsUncheckedCreateWithoutUsersInput>;
};
export type vehicle_combinationsCreateManyUsersInputEnvelope = {
    data: Prisma.vehicle_combinationsCreateManyUsersInput | Prisma.vehicle_combinationsCreateManyUsersInput[];
    skipDuplicates?: boolean;
};
export type vehicle_combinationsUpsertWithWhereUniqueWithoutUsersInput = {
    where: Prisma.vehicle_combinationsWhereUniqueInput;
    update: Prisma.XOR<Prisma.vehicle_combinationsUpdateWithoutUsersInput, Prisma.vehicle_combinationsUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutUsersInput, Prisma.vehicle_combinationsUncheckedCreateWithoutUsersInput>;
};
export type vehicle_combinationsUpdateWithWhereUniqueWithoutUsersInput = {
    where: Prisma.vehicle_combinationsWhereUniqueInput;
    data: Prisma.XOR<Prisma.vehicle_combinationsUpdateWithoutUsersInput, Prisma.vehicle_combinationsUncheckedUpdateWithoutUsersInput>;
};
export type vehicle_combinationsUpdateManyWithWhereWithoutUsersInput = {
    where: Prisma.vehicle_combinationsScalarWhereInput;
    data: Prisma.XOR<Prisma.vehicle_combinationsUpdateManyMutationInput, Prisma.vehicle_combinationsUncheckedUpdateManyWithoutUsersInput>;
};
export type vehicle_combinationsCreateWithoutTractorInput = {
    id?: string;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
    trips?: Prisma.tripsCreateNestedManyWithoutVehicle_combinationInput;
    drivers?: Prisma.driversCreateNestedOneWithoutVehicleCombinationsInput;
    users?: Prisma.usersCreateNestedOneWithoutVehicle_combinationsInput;
    trailer?: Prisma.vehiclesCreateNestedOneWithoutVehicle_combinations_trailerInput;
};
export type vehicle_combinationsUncheckedCreateWithoutTractorInput = {
    id?: string;
    trailer_id?: string | null;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_by?: string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    driver_id?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutVehicle_combinationInput;
};
export type vehicle_combinationsCreateOrConnectWithoutTractorInput = {
    where: Prisma.vehicle_combinationsWhereUniqueInput;
    create: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTractorInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTractorInput>;
};
export type vehicle_combinationsCreateManyTractorInputEnvelope = {
    data: Prisma.vehicle_combinationsCreateManyTractorInput | Prisma.vehicle_combinationsCreateManyTractorInput[];
    skipDuplicates?: boolean;
};
export type vehicle_combinationsCreateWithoutTrailerInput = {
    id?: string;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
    trips?: Prisma.tripsCreateNestedManyWithoutVehicle_combinationInput;
    drivers?: Prisma.driversCreateNestedOneWithoutVehicleCombinationsInput;
    users?: Prisma.usersCreateNestedOneWithoutVehicle_combinationsInput;
    tractor: Prisma.vehiclesCreateNestedOneWithoutVehicle_combinations_tractorInput;
};
export type vehicle_combinationsUncheckedCreateWithoutTrailerInput = {
    id?: string;
    tractor_id: string;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_by?: string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    driver_id?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
    trips?: Prisma.tripsUncheckedCreateNestedManyWithoutVehicle_combinationInput;
};
export type vehicle_combinationsCreateOrConnectWithoutTrailerInput = {
    where: Prisma.vehicle_combinationsWhereUniqueInput;
    create: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTrailerInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTrailerInput>;
};
export type vehicle_combinationsCreateManyTrailerInputEnvelope = {
    data: Prisma.vehicle_combinationsCreateManyTrailerInput | Prisma.vehicle_combinationsCreateManyTrailerInput[];
    skipDuplicates?: boolean;
};
export type vehicle_combinationsUpsertWithWhereUniqueWithoutTractorInput = {
    where: Prisma.vehicle_combinationsWhereUniqueInput;
    update: Prisma.XOR<Prisma.vehicle_combinationsUpdateWithoutTractorInput, Prisma.vehicle_combinationsUncheckedUpdateWithoutTractorInput>;
    create: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTractorInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTractorInput>;
};
export type vehicle_combinationsUpdateWithWhereUniqueWithoutTractorInput = {
    where: Prisma.vehicle_combinationsWhereUniqueInput;
    data: Prisma.XOR<Prisma.vehicle_combinationsUpdateWithoutTractorInput, Prisma.vehicle_combinationsUncheckedUpdateWithoutTractorInput>;
};
export type vehicle_combinationsUpdateManyWithWhereWithoutTractorInput = {
    where: Prisma.vehicle_combinationsScalarWhereInput;
    data: Prisma.XOR<Prisma.vehicle_combinationsUpdateManyMutationInput, Prisma.vehicle_combinationsUncheckedUpdateManyWithoutTractorInput>;
};
export type vehicle_combinationsUpsertWithWhereUniqueWithoutTrailerInput = {
    where: Prisma.vehicle_combinationsWhereUniqueInput;
    update: Prisma.XOR<Prisma.vehicle_combinationsUpdateWithoutTrailerInput, Prisma.vehicle_combinationsUncheckedUpdateWithoutTrailerInput>;
    create: Prisma.XOR<Prisma.vehicle_combinationsCreateWithoutTrailerInput, Prisma.vehicle_combinationsUncheckedCreateWithoutTrailerInput>;
};
export type vehicle_combinationsUpdateWithWhereUniqueWithoutTrailerInput = {
    where: Prisma.vehicle_combinationsWhereUniqueInput;
    data: Prisma.XOR<Prisma.vehicle_combinationsUpdateWithoutTrailerInput, Prisma.vehicle_combinationsUncheckedUpdateWithoutTrailerInput>;
};
export type vehicle_combinationsUpdateManyWithWhereWithoutTrailerInput = {
    where: Prisma.vehicle_combinationsScalarWhereInput;
    data: Prisma.XOR<Prisma.vehicle_combinationsUpdateManyMutationInput, Prisma.vehicle_combinationsUncheckedUpdateManyWithoutTrailerInput>;
};
export type vehicle_combinationsCreateManyDriversInput = {
    id?: string;
    tractor_id: string;
    trailer_id?: string | null;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_by?: string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
};
export type vehicle_combinationsUpdateWithoutDriversInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trips?: Prisma.tripsUpdateManyWithoutVehicle_combinationNestedInput;
    users?: Prisma.usersUpdateOneWithoutVehicle_combinationsNestedInput;
    tractor?: Prisma.vehiclesUpdateOneRequiredWithoutVehicle_combinations_tractorNestedInput;
    trailer?: Prisma.vehiclesUpdateOneWithoutVehicle_combinations_trailerNestedInput;
};
export type vehicle_combinationsUncheckedUpdateWithoutDriversInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tractor_id?: Prisma.StringFieldUpdateOperationsInput | string;
    trailer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutVehicle_combinationNestedInput;
};
export type vehicle_combinationsUncheckedUpdateManyWithoutDriversInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tractor_id?: Prisma.StringFieldUpdateOperationsInput | string;
    trailer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type vehicle_combinationsCreateManyUsersInput = {
    id?: string;
    tractor_id: string;
    trailer_id?: string | null;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    driver_id?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
};
export type vehicle_combinationsUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trips?: Prisma.tripsUpdateManyWithoutVehicle_combinationNestedInput;
    drivers?: Prisma.driversUpdateOneWithoutVehicleCombinationsNestedInput;
    tractor?: Prisma.vehiclesUpdateOneRequiredWithoutVehicle_combinations_tractorNestedInput;
    trailer?: Prisma.vehiclesUpdateOneWithoutVehicle_combinations_trailerNestedInput;
};
export type vehicle_combinationsUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tractor_id?: Prisma.StringFieldUpdateOperationsInput | string;
    trailer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    driver_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutVehicle_combinationNestedInput;
};
export type vehicle_combinationsUncheckedUpdateManyWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tractor_id?: Prisma.StringFieldUpdateOperationsInput | string;
    trailer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    driver_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type vehicle_combinationsCreateManyTractorInput = {
    id?: string;
    trailer_id?: string | null;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_by?: string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    driver_id?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
};
export type vehicle_combinationsCreateManyTrailerInput = {
    id?: string;
    tractor_id: string;
    valid_from: Date | string;
    valid_until?: Date | string | null;
    created_by?: string | null;
    created_at?: Date | string;
    unit_number?: string | null;
    driver_id?: string | null;
    deleted_at?: Date | string | null;
    deleted_by?: string | null;
};
export type vehicle_combinationsUpdateWithoutTractorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trips?: Prisma.tripsUpdateManyWithoutVehicle_combinationNestedInput;
    drivers?: Prisma.driversUpdateOneWithoutVehicleCombinationsNestedInput;
    users?: Prisma.usersUpdateOneWithoutVehicle_combinationsNestedInput;
    trailer?: Prisma.vehiclesUpdateOneWithoutVehicle_combinations_trailerNestedInput;
};
export type vehicle_combinationsUncheckedUpdateWithoutTractorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trailer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    driver_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutVehicle_combinationNestedInput;
};
export type vehicle_combinationsUncheckedUpdateManyWithoutTractorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trailer_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    driver_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type vehicle_combinationsUpdateWithoutTrailerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trips?: Prisma.tripsUpdateManyWithoutVehicle_combinationNestedInput;
    drivers?: Prisma.driversUpdateOneWithoutVehicleCombinationsNestedInput;
    users?: Prisma.usersUpdateOneWithoutVehicle_combinationsNestedInput;
    tractor?: Prisma.vehiclesUpdateOneRequiredWithoutVehicle_combinations_tractorNestedInput;
};
export type vehicle_combinationsUncheckedUpdateWithoutTrailerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tractor_id?: Prisma.StringFieldUpdateOperationsInput | string;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    driver_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trips?: Prisma.tripsUncheckedUpdateManyWithoutVehicle_combinationNestedInput;
};
export type vehicle_combinationsUncheckedUpdateManyWithoutTrailerInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    tractor_id?: Prisma.StringFieldUpdateOperationsInput | string;
    valid_from?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    valid_until?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    unit_number?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    driver_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    deleted_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    deleted_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type Vehicle_combinationsCountOutputType = {
    trips: number;
};
export type Vehicle_combinationsCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trips?: boolean | Vehicle_combinationsCountOutputTypeCountTripsArgs;
};
export type Vehicle_combinationsCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.Vehicle_combinationsCountOutputTypeSelect<ExtArgs> | null;
};
export type Vehicle_combinationsCountOutputTypeCountTripsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.tripsWhereInput;
};
export type vehicle_combinationsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tractor_id?: boolean;
    trailer_id?: boolean;
    valid_from?: boolean;
    valid_until?: boolean;
    created_by?: boolean;
    created_at?: boolean;
    unit_number?: boolean;
    driver_id?: boolean;
    deleted_at?: boolean;
    deleted_by?: boolean;
    trips?: boolean | Prisma.vehicle_combinations$tripsArgs<ExtArgs>;
    drivers?: boolean | Prisma.vehicle_combinations$driversArgs<ExtArgs>;
    users?: boolean | Prisma.vehicle_combinations$usersArgs<ExtArgs>;
    tractor?: boolean | Prisma.vehiclesDefaultArgs<ExtArgs>;
    trailer?: boolean | Prisma.vehicle_combinations$trailerArgs<ExtArgs>;
    _count?: boolean | Prisma.Vehicle_combinationsCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["vehicle_combinations"]>;
export type vehicle_combinationsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tractor_id?: boolean;
    trailer_id?: boolean;
    valid_from?: boolean;
    valid_until?: boolean;
    created_by?: boolean;
    created_at?: boolean;
    unit_number?: boolean;
    driver_id?: boolean;
    deleted_at?: boolean;
    deleted_by?: boolean;
    drivers?: boolean | Prisma.vehicle_combinations$driversArgs<ExtArgs>;
    users?: boolean | Prisma.vehicle_combinations$usersArgs<ExtArgs>;
    tractor?: boolean | Prisma.vehiclesDefaultArgs<ExtArgs>;
    trailer?: boolean | Prisma.vehicle_combinations$trailerArgs<ExtArgs>;
}, ExtArgs["result"]["vehicle_combinations"]>;
export type vehicle_combinationsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tractor_id?: boolean;
    trailer_id?: boolean;
    valid_from?: boolean;
    valid_until?: boolean;
    created_by?: boolean;
    created_at?: boolean;
    unit_number?: boolean;
    driver_id?: boolean;
    deleted_at?: boolean;
    deleted_by?: boolean;
    drivers?: boolean | Prisma.vehicle_combinations$driversArgs<ExtArgs>;
    users?: boolean | Prisma.vehicle_combinations$usersArgs<ExtArgs>;
    tractor?: boolean | Prisma.vehiclesDefaultArgs<ExtArgs>;
    trailer?: boolean | Prisma.vehicle_combinations$trailerArgs<ExtArgs>;
}, ExtArgs["result"]["vehicle_combinations"]>;
export type vehicle_combinationsSelectScalar = {
    id?: boolean;
    tractor_id?: boolean;
    trailer_id?: boolean;
    valid_from?: boolean;
    valid_until?: boolean;
    created_by?: boolean;
    created_at?: boolean;
    unit_number?: boolean;
    driver_id?: boolean;
    deleted_at?: boolean;
    deleted_by?: boolean;
};
export type vehicle_combinationsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tractor_id" | "trailer_id" | "valid_from" | "valid_until" | "created_by" | "created_at" | "unit_number" | "driver_id" | "deleted_at" | "deleted_by", ExtArgs["result"]["vehicle_combinations"]>;
export type vehicle_combinationsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trips?: boolean | Prisma.vehicle_combinations$tripsArgs<ExtArgs>;
    drivers?: boolean | Prisma.vehicle_combinations$driversArgs<ExtArgs>;
    users?: boolean | Prisma.vehicle_combinations$usersArgs<ExtArgs>;
    tractor?: boolean | Prisma.vehiclesDefaultArgs<ExtArgs>;
    trailer?: boolean | Prisma.vehicle_combinations$trailerArgs<ExtArgs>;
    _count?: boolean | Prisma.Vehicle_combinationsCountOutputTypeDefaultArgs<ExtArgs>;
};
export type vehicle_combinationsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drivers?: boolean | Prisma.vehicle_combinations$driversArgs<ExtArgs>;
    users?: boolean | Prisma.vehicle_combinations$usersArgs<ExtArgs>;
    tractor?: boolean | Prisma.vehiclesDefaultArgs<ExtArgs>;
    trailer?: boolean | Prisma.vehicle_combinations$trailerArgs<ExtArgs>;
};
export type vehicle_combinationsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drivers?: boolean | Prisma.vehicle_combinations$driversArgs<ExtArgs>;
    users?: boolean | Prisma.vehicle_combinations$usersArgs<ExtArgs>;
    tractor?: boolean | Prisma.vehiclesDefaultArgs<ExtArgs>;
    trailer?: boolean | Prisma.vehicle_combinations$trailerArgs<ExtArgs>;
};
export type $vehicle_combinationsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "vehicle_combinations";
    objects: {
        trips: Prisma.$tripsPayload<ExtArgs>[];
        drivers: Prisma.$driversPayload<ExtArgs> | null;
        users: Prisma.$usersPayload<ExtArgs> | null;
        tractor: Prisma.$vehiclesPayload<ExtArgs>;
        trailer: Prisma.$vehiclesPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        tractor_id: string;
        trailer_id: string | null;
        valid_from: Date;
        valid_until: Date | null;
        created_by: string | null;
        created_at: Date;
        unit_number: string | null;
        driver_id: string | null;
        deleted_at: Date | null;
        deleted_by: string | null;
    }, ExtArgs["result"]["vehicle_combinations"]>;
    composites: {};
};
export type vehicle_combinationsGetPayload<S extends boolean | null | undefined | vehicle_combinationsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload, S>;
export type vehicle_combinationsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<vehicle_combinationsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Vehicle_combinationsCountAggregateInputType | true;
};
export interface vehicle_combinationsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['vehicle_combinations'];
        meta: {
            name: 'vehicle_combinations';
        };
    };
    findUnique<T extends vehicle_combinationsFindUniqueArgs>(args: Prisma.SelectSubset<T, vehicle_combinationsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__vehicle_combinationsClient<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends vehicle_combinationsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, vehicle_combinationsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__vehicle_combinationsClient<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends vehicle_combinationsFindFirstArgs>(args?: Prisma.SelectSubset<T, vehicle_combinationsFindFirstArgs<ExtArgs>>): Prisma.Prisma__vehicle_combinationsClient<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends vehicle_combinationsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, vehicle_combinationsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__vehicle_combinationsClient<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends vehicle_combinationsFindManyArgs>(args?: Prisma.SelectSubset<T, vehicle_combinationsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends vehicle_combinationsCreateArgs>(args: Prisma.SelectSubset<T, vehicle_combinationsCreateArgs<ExtArgs>>): Prisma.Prisma__vehicle_combinationsClient<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends vehicle_combinationsCreateManyArgs>(args?: Prisma.SelectSubset<T, vehicle_combinationsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends vehicle_combinationsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, vehicle_combinationsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends vehicle_combinationsDeleteArgs>(args: Prisma.SelectSubset<T, vehicle_combinationsDeleteArgs<ExtArgs>>): Prisma.Prisma__vehicle_combinationsClient<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends vehicle_combinationsUpdateArgs>(args: Prisma.SelectSubset<T, vehicle_combinationsUpdateArgs<ExtArgs>>): Prisma.Prisma__vehicle_combinationsClient<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends vehicle_combinationsDeleteManyArgs>(args?: Prisma.SelectSubset<T, vehicle_combinationsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends vehicle_combinationsUpdateManyArgs>(args: Prisma.SelectSubset<T, vehicle_combinationsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends vehicle_combinationsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, vehicle_combinationsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends vehicle_combinationsUpsertArgs>(args: Prisma.SelectSubset<T, vehicle_combinationsUpsertArgs<ExtArgs>>): Prisma.Prisma__vehicle_combinationsClient<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends vehicle_combinationsCountArgs>(args?: Prisma.Subset<T, vehicle_combinationsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Vehicle_combinationsCountAggregateOutputType> : number>;
    aggregate<T extends Vehicle_combinationsAggregateArgs>(args: Prisma.Subset<T, Vehicle_combinationsAggregateArgs>): Prisma.PrismaPromise<GetVehicle_combinationsAggregateType<T>>;
    groupBy<T extends vehicle_combinationsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: vehicle_combinationsGroupByArgs['orderBy'];
    } : {
        orderBy?: vehicle_combinationsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, vehicle_combinationsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehicle_combinationsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: vehicle_combinationsFieldRefs;
}
export interface Prisma__vehicle_combinationsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    trips<T extends Prisma.vehicle_combinations$tripsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.vehicle_combinations$tripsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    drivers<T extends Prisma.vehicle_combinations$driversArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.vehicle_combinations$driversArgs<ExtArgs>>): Prisma.Prisma__driversClient<runtime.Types.Result.GetResult<Prisma.$driversPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    users<T extends Prisma.vehicle_combinations$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.vehicle_combinations$usersArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    tractor<T extends Prisma.vehiclesDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.vehiclesDefaultArgs<ExtArgs>>): Prisma.Prisma__vehiclesClient<runtime.Types.Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    trailer<T extends Prisma.vehicle_combinations$trailerArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.vehicle_combinations$trailerArgs<ExtArgs>>): Prisma.Prisma__vehiclesClient<runtime.Types.Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface vehicle_combinationsFieldRefs {
    readonly id: Prisma.FieldRef<"vehicle_combinations", 'String'>;
    readonly tractor_id: Prisma.FieldRef<"vehicle_combinations", 'String'>;
    readonly trailer_id: Prisma.FieldRef<"vehicle_combinations", 'String'>;
    readonly valid_from: Prisma.FieldRef<"vehicle_combinations", 'DateTime'>;
    readonly valid_until: Prisma.FieldRef<"vehicle_combinations", 'DateTime'>;
    readonly created_by: Prisma.FieldRef<"vehicle_combinations", 'String'>;
    readonly created_at: Prisma.FieldRef<"vehicle_combinations", 'DateTime'>;
    readonly unit_number: Prisma.FieldRef<"vehicle_combinations", 'String'>;
    readonly driver_id: Prisma.FieldRef<"vehicle_combinations", 'String'>;
    readonly deleted_at: Prisma.FieldRef<"vehicle_combinations", 'DateTime'>;
    readonly deleted_by: Prisma.FieldRef<"vehicle_combinations", 'String'>;
}
export type vehicle_combinationsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehicle_combinationsSelect<ExtArgs> | null;
    omit?: Prisma.vehicle_combinationsOmit<ExtArgs> | null;
    include?: Prisma.vehicle_combinationsInclude<ExtArgs> | null;
    where: Prisma.vehicle_combinationsWhereUniqueInput;
};
export type vehicle_combinationsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehicle_combinationsSelect<ExtArgs> | null;
    omit?: Prisma.vehicle_combinationsOmit<ExtArgs> | null;
    include?: Prisma.vehicle_combinationsInclude<ExtArgs> | null;
    where: Prisma.vehicle_combinationsWhereUniqueInput;
};
export type vehicle_combinationsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type vehicle_combinationsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type vehicle_combinationsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type vehicle_combinationsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehicle_combinationsSelect<ExtArgs> | null;
    omit?: Prisma.vehicle_combinationsOmit<ExtArgs> | null;
    include?: Prisma.vehicle_combinationsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.vehicle_combinationsCreateInput, Prisma.vehicle_combinationsUncheckedCreateInput>;
};
export type vehicle_combinationsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.vehicle_combinationsCreateManyInput | Prisma.vehicle_combinationsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type vehicle_combinationsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehicle_combinationsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.vehicle_combinationsOmit<ExtArgs> | null;
    data: Prisma.vehicle_combinationsCreateManyInput | Prisma.vehicle_combinationsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.vehicle_combinationsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type vehicle_combinationsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehicle_combinationsSelect<ExtArgs> | null;
    omit?: Prisma.vehicle_combinationsOmit<ExtArgs> | null;
    include?: Prisma.vehicle_combinationsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.vehicle_combinationsUpdateInput, Prisma.vehicle_combinationsUncheckedUpdateInput>;
    where: Prisma.vehicle_combinationsWhereUniqueInput;
};
export type vehicle_combinationsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.vehicle_combinationsUpdateManyMutationInput, Prisma.vehicle_combinationsUncheckedUpdateManyInput>;
    where?: Prisma.vehicle_combinationsWhereInput;
    limit?: number;
};
export type vehicle_combinationsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehicle_combinationsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.vehicle_combinationsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.vehicle_combinationsUpdateManyMutationInput, Prisma.vehicle_combinationsUncheckedUpdateManyInput>;
    where?: Prisma.vehicle_combinationsWhereInput;
    limit?: number;
    include?: Prisma.vehicle_combinationsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type vehicle_combinationsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehicle_combinationsSelect<ExtArgs> | null;
    omit?: Prisma.vehicle_combinationsOmit<ExtArgs> | null;
    include?: Prisma.vehicle_combinationsInclude<ExtArgs> | null;
    where: Prisma.vehicle_combinationsWhereUniqueInput;
    create: Prisma.XOR<Prisma.vehicle_combinationsCreateInput, Prisma.vehicle_combinationsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.vehicle_combinationsUpdateInput, Prisma.vehicle_combinationsUncheckedUpdateInput>;
};
export type vehicle_combinationsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehicle_combinationsSelect<ExtArgs> | null;
    omit?: Prisma.vehicle_combinationsOmit<ExtArgs> | null;
    include?: Prisma.vehicle_combinationsInclude<ExtArgs> | null;
    where: Prisma.vehicle_combinationsWhereUniqueInput;
};
export type vehicle_combinationsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.vehicle_combinationsWhereInput;
    limit?: number;
};
export type vehicle_combinations$tripsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.tripsSelect<ExtArgs> | null;
    omit?: Prisma.tripsOmit<ExtArgs> | null;
    include?: Prisma.tripsInclude<ExtArgs> | null;
    where?: Prisma.tripsWhereInput;
    orderBy?: Prisma.tripsOrderByWithRelationInput | Prisma.tripsOrderByWithRelationInput[];
    cursor?: Prisma.tripsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TripsScalarFieldEnum | Prisma.TripsScalarFieldEnum[];
};
export type vehicle_combinations$driversArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.driversSelect<ExtArgs> | null;
    omit?: Prisma.driversOmit<ExtArgs> | null;
    include?: Prisma.driversInclude<ExtArgs> | null;
    where?: Prisma.driversWhereInput;
};
export type vehicle_combinations$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
    where?: Prisma.usersWhereInput;
};
export type vehicle_combinations$trailerArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehiclesSelect<ExtArgs> | null;
    omit?: Prisma.vehiclesOmit<ExtArgs> | null;
    include?: Prisma.vehiclesInclude<ExtArgs> | null;
    where?: Prisma.vehiclesWhereInput;
};
export type vehicle_combinationsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehicle_combinationsSelect<ExtArgs> | null;
    omit?: Prisma.vehicle_combinationsOmit<ExtArgs> | null;
    include?: Prisma.vehicle_combinationsInclude<ExtArgs> | null;
};
