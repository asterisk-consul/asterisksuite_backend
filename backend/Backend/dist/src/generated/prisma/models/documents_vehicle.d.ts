import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type documents_vehicleModel = runtime.Types.Result.DefaultSelection<Prisma.$documents_vehiclePayload>;
export type AggregateDocuments_vehicle = {
    _count: Documents_vehicleCountAggregateOutputType | null;
    _min: Documents_vehicleMinAggregateOutputType | null;
    _max: Documents_vehicleMaxAggregateOutputType | null;
};
export type Documents_vehicleMinAggregateOutputType = {
    id: string | null;
    vehicle_id: string | null;
    document_type_id: string | null;
    expiration_date: Date | null;
    created_at: Date | null;
};
export type Documents_vehicleMaxAggregateOutputType = {
    id: string | null;
    vehicle_id: string | null;
    document_type_id: string | null;
    expiration_date: Date | null;
    created_at: Date | null;
};
export type Documents_vehicleCountAggregateOutputType = {
    id: number;
    vehicle_id: number;
    document_type_id: number;
    expiration_date: number;
    created_at: number;
    _all: number;
};
export type Documents_vehicleMinAggregateInputType = {
    id?: true;
    vehicle_id?: true;
    document_type_id?: true;
    expiration_date?: true;
    created_at?: true;
};
export type Documents_vehicleMaxAggregateInputType = {
    id?: true;
    vehicle_id?: true;
    document_type_id?: true;
    expiration_date?: true;
    created_at?: true;
};
export type Documents_vehicleCountAggregateInputType = {
    id?: true;
    vehicle_id?: true;
    document_type_id?: true;
    expiration_date?: true;
    created_at?: true;
    _all?: true;
};
export type Documents_vehicleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documents_vehicleWhereInput;
    orderBy?: Prisma.documents_vehicleOrderByWithRelationInput | Prisma.documents_vehicleOrderByWithRelationInput[];
    cursor?: Prisma.documents_vehicleWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Documents_vehicleCountAggregateInputType;
    _min?: Documents_vehicleMinAggregateInputType;
    _max?: Documents_vehicleMaxAggregateInputType;
};
export type GetDocuments_vehicleAggregateType<T extends Documents_vehicleAggregateArgs> = {
    [P in keyof T & keyof AggregateDocuments_vehicle]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocuments_vehicle[P]> : Prisma.GetScalarType<T[P], AggregateDocuments_vehicle[P]>;
};
export type documents_vehicleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documents_vehicleWhereInput;
    orderBy?: Prisma.documents_vehicleOrderByWithAggregationInput | Prisma.documents_vehicleOrderByWithAggregationInput[];
    by: Prisma.Documents_vehicleScalarFieldEnum[] | Prisma.Documents_vehicleScalarFieldEnum;
    having?: Prisma.documents_vehicleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Documents_vehicleCountAggregateInputType | true;
    _min?: Documents_vehicleMinAggregateInputType;
    _max?: Documents_vehicleMaxAggregateInputType;
};
export type Documents_vehicleGroupByOutputType = {
    id: string;
    vehicle_id: string;
    document_type_id: string;
    expiration_date: Date | null;
    created_at: Date | null;
    _count: Documents_vehicleCountAggregateOutputType | null;
    _min: Documents_vehicleMinAggregateOutputType | null;
    _max: Documents_vehicleMaxAggregateOutputType | null;
};
export type GetDocuments_vehicleGroupByPayload<T extends documents_vehicleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Documents_vehicleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Documents_vehicleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Documents_vehicleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Documents_vehicleGroupByOutputType[P]>;
}>>;
export type documents_vehicleWhereInput = {
    AND?: Prisma.documents_vehicleWhereInput | Prisma.documents_vehicleWhereInput[];
    OR?: Prisma.documents_vehicleWhereInput[];
    NOT?: Prisma.documents_vehicleWhereInput | Prisma.documents_vehicleWhereInput[];
    id?: Prisma.UuidFilter<"documents_vehicle"> | string;
    vehicle_id?: Prisma.UuidFilter<"documents_vehicle"> | string;
    document_type_id?: Prisma.UuidFilter<"documents_vehicle"> | string;
    expiration_date?: Prisma.DateTimeNullableFilter<"documents_vehicle"> | Date | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"documents_vehicle"> | Date | string | null;
    vehicles?: Prisma.XOR<Prisma.VehiclesScalarRelationFilter, Prisma.vehiclesWhereInput>;
    transport_document_types?: Prisma.XOR<Prisma.Transport_document_typesScalarRelationFilter, Prisma.transport_document_typesWhereInput>;
};
export type documents_vehicleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    vehicle_id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    expiration_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    vehicles?: Prisma.vehiclesOrderByWithRelationInput;
    transport_document_types?: Prisma.transport_document_typesOrderByWithRelationInput;
};
export type documents_vehicleWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    vehicle_id_document_type_id?: Prisma.documents_vehicleVehicle_idDocument_type_idCompoundUniqueInput;
    AND?: Prisma.documents_vehicleWhereInput | Prisma.documents_vehicleWhereInput[];
    OR?: Prisma.documents_vehicleWhereInput[];
    NOT?: Prisma.documents_vehicleWhereInput | Prisma.documents_vehicleWhereInput[];
    vehicle_id?: Prisma.UuidFilter<"documents_vehicle"> | string;
    document_type_id?: Prisma.UuidFilter<"documents_vehicle"> | string;
    expiration_date?: Prisma.DateTimeNullableFilter<"documents_vehicle"> | Date | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"documents_vehicle"> | Date | string | null;
    vehicles?: Prisma.XOR<Prisma.VehiclesScalarRelationFilter, Prisma.vehiclesWhereInput>;
    transport_document_types?: Prisma.XOR<Prisma.Transport_document_typesScalarRelationFilter, Prisma.transport_document_typesWhereInput>;
}, "id" | "vehicle_id_document_type_id">;
export type documents_vehicleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    vehicle_id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    expiration_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.documents_vehicleCountOrderByAggregateInput;
    _max?: Prisma.documents_vehicleMaxOrderByAggregateInput;
    _min?: Prisma.documents_vehicleMinOrderByAggregateInput;
};
export type documents_vehicleScalarWhereWithAggregatesInput = {
    AND?: Prisma.documents_vehicleScalarWhereWithAggregatesInput | Prisma.documents_vehicleScalarWhereWithAggregatesInput[];
    OR?: Prisma.documents_vehicleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.documents_vehicleScalarWhereWithAggregatesInput | Prisma.documents_vehicleScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"documents_vehicle"> | string;
    vehicle_id?: Prisma.UuidWithAggregatesFilter<"documents_vehicle"> | string;
    document_type_id?: Prisma.UuidWithAggregatesFilter<"documents_vehicle"> | string;
    expiration_date?: Prisma.DateTimeNullableWithAggregatesFilter<"documents_vehicle"> | Date | string | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"documents_vehicle"> | Date | string | null;
};
export type documents_vehicleCreateInput = {
    id?: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
    vehicles: Prisma.vehiclesCreateNestedOneWithoutVehicleDocumentsInput;
    transport_document_types: Prisma.transport_document_typesCreateNestedOneWithoutDocuments_vehicleInput;
};
export type documents_vehicleUncheckedCreateInput = {
    id?: string;
    vehicle_id: string;
    document_type_id: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type documents_vehicleUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    vehicles?: Prisma.vehiclesUpdateOneRequiredWithoutVehicleDocumentsNestedInput;
    transport_document_types?: Prisma.transport_document_typesUpdateOneRequiredWithoutDocuments_vehicleNestedInput;
};
export type documents_vehicleUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicle_id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type_id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type documents_vehicleCreateManyInput = {
    id?: string;
    vehicle_id: string;
    document_type_id: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type documents_vehicleUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type documents_vehicleUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicle_id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type_id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type Documents_vehicleListRelationFilter = {
    every?: Prisma.documents_vehicleWhereInput;
    some?: Prisma.documents_vehicleWhereInput;
    none?: Prisma.documents_vehicleWhereInput;
};
export type documents_vehicleOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type documents_vehicleVehicle_idDocument_type_idCompoundUniqueInput = {
    vehicle_id: string;
    document_type_id: string;
};
export type documents_vehicleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    vehicle_id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    expiration_date?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type documents_vehicleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    vehicle_id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    expiration_date?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type documents_vehicleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    vehicle_id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    expiration_date?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type documents_vehicleCreateNestedManyWithoutVehiclesInput = {
    create?: Prisma.XOR<Prisma.documents_vehicleCreateWithoutVehiclesInput, Prisma.documents_vehicleUncheckedCreateWithoutVehiclesInput> | Prisma.documents_vehicleCreateWithoutVehiclesInput[] | Prisma.documents_vehicleUncheckedCreateWithoutVehiclesInput[];
    connectOrCreate?: Prisma.documents_vehicleCreateOrConnectWithoutVehiclesInput | Prisma.documents_vehicleCreateOrConnectWithoutVehiclesInput[];
    createMany?: Prisma.documents_vehicleCreateManyVehiclesInputEnvelope;
    connect?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
};
export type documents_vehicleUncheckedCreateNestedManyWithoutVehiclesInput = {
    create?: Prisma.XOR<Prisma.documents_vehicleCreateWithoutVehiclesInput, Prisma.documents_vehicleUncheckedCreateWithoutVehiclesInput> | Prisma.documents_vehicleCreateWithoutVehiclesInput[] | Prisma.documents_vehicleUncheckedCreateWithoutVehiclesInput[];
    connectOrCreate?: Prisma.documents_vehicleCreateOrConnectWithoutVehiclesInput | Prisma.documents_vehicleCreateOrConnectWithoutVehiclesInput[];
    createMany?: Prisma.documents_vehicleCreateManyVehiclesInputEnvelope;
    connect?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
};
export type documents_vehicleUpdateManyWithoutVehiclesNestedInput = {
    create?: Prisma.XOR<Prisma.documents_vehicleCreateWithoutVehiclesInput, Prisma.documents_vehicleUncheckedCreateWithoutVehiclesInput> | Prisma.documents_vehicleCreateWithoutVehiclesInput[] | Prisma.documents_vehicleUncheckedCreateWithoutVehiclesInput[];
    connectOrCreate?: Prisma.documents_vehicleCreateOrConnectWithoutVehiclesInput | Prisma.documents_vehicleCreateOrConnectWithoutVehiclesInput[];
    upsert?: Prisma.documents_vehicleUpsertWithWhereUniqueWithoutVehiclesInput | Prisma.documents_vehicleUpsertWithWhereUniqueWithoutVehiclesInput[];
    createMany?: Prisma.documents_vehicleCreateManyVehiclesInputEnvelope;
    set?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    disconnect?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    delete?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    connect?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    update?: Prisma.documents_vehicleUpdateWithWhereUniqueWithoutVehiclesInput | Prisma.documents_vehicleUpdateWithWhereUniqueWithoutVehiclesInput[];
    updateMany?: Prisma.documents_vehicleUpdateManyWithWhereWithoutVehiclesInput | Prisma.documents_vehicleUpdateManyWithWhereWithoutVehiclesInput[];
    deleteMany?: Prisma.documents_vehicleScalarWhereInput | Prisma.documents_vehicleScalarWhereInput[];
};
export type documents_vehicleUncheckedUpdateManyWithoutVehiclesNestedInput = {
    create?: Prisma.XOR<Prisma.documents_vehicleCreateWithoutVehiclesInput, Prisma.documents_vehicleUncheckedCreateWithoutVehiclesInput> | Prisma.documents_vehicleCreateWithoutVehiclesInput[] | Prisma.documents_vehicleUncheckedCreateWithoutVehiclesInput[];
    connectOrCreate?: Prisma.documents_vehicleCreateOrConnectWithoutVehiclesInput | Prisma.documents_vehicleCreateOrConnectWithoutVehiclesInput[];
    upsert?: Prisma.documents_vehicleUpsertWithWhereUniqueWithoutVehiclesInput | Prisma.documents_vehicleUpsertWithWhereUniqueWithoutVehiclesInput[];
    createMany?: Prisma.documents_vehicleCreateManyVehiclesInputEnvelope;
    set?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    disconnect?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    delete?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    connect?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    update?: Prisma.documents_vehicleUpdateWithWhereUniqueWithoutVehiclesInput | Prisma.documents_vehicleUpdateWithWhereUniqueWithoutVehiclesInput[];
    updateMany?: Prisma.documents_vehicleUpdateManyWithWhereWithoutVehiclesInput | Prisma.documents_vehicleUpdateManyWithWhereWithoutVehiclesInput[];
    deleteMany?: Prisma.documents_vehicleScalarWhereInput | Prisma.documents_vehicleScalarWhereInput[];
};
export type documents_vehicleCreateNestedManyWithoutTransport_document_typesInput = {
    create?: Prisma.XOR<Prisma.documents_vehicleCreateWithoutTransport_document_typesInput, Prisma.documents_vehicleUncheckedCreateWithoutTransport_document_typesInput> | Prisma.documents_vehicleCreateWithoutTransport_document_typesInput[] | Prisma.documents_vehicleUncheckedCreateWithoutTransport_document_typesInput[];
    connectOrCreate?: Prisma.documents_vehicleCreateOrConnectWithoutTransport_document_typesInput | Prisma.documents_vehicleCreateOrConnectWithoutTransport_document_typesInput[];
    createMany?: Prisma.documents_vehicleCreateManyTransport_document_typesInputEnvelope;
    connect?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
};
export type documents_vehicleUncheckedCreateNestedManyWithoutTransport_document_typesInput = {
    create?: Prisma.XOR<Prisma.documents_vehicleCreateWithoutTransport_document_typesInput, Prisma.documents_vehicleUncheckedCreateWithoutTransport_document_typesInput> | Prisma.documents_vehicleCreateWithoutTransport_document_typesInput[] | Prisma.documents_vehicleUncheckedCreateWithoutTransport_document_typesInput[];
    connectOrCreate?: Prisma.documents_vehicleCreateOrConnectWithoutTransport_document_typesInput | Prisma.documents_vehicleCreateOrConnectWithoutTransport_document_typesInput[];
    createMany?: Prisma.documents_vehicleCreateManyTransport_document_typesInputEnvelope;
    connect?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
};
export type documents_vehicleUpdateManyWithoutTransport_document_typesNestedInput = {
    create?: Prisma.XOR<Prisma.documents_vehicleCreateWithoutTransport_document_typesInput, Prisma.documents_vehicleUncheckedCreateWithoutTransport_document_typesInput> | Prisma.documents_vehicleCreateWithoutTransport_document_typesInput[] | Prisma.documents_vehicleUncheckedCreateWithoutTransport_document_typesInput[];
    connectOrCreate?: Prisma.documents_vehicleCreateOrConnectWithoutTransport_document_typesInput | Prisma.documents_vehicleCreateOrConnectWithoutTransport_document_typesInput[];
    upsert?: Prisma.documents_vehicleUpsertWithWhereUniqueWithoutTransport_document_typesInput | Prisma.documents_vehicleUpsertWithWhereUniqueWithoutTransport_document_typesInput[];
    createMany?: Prisma.documents_vehicleCreateManyTransport_document_typesInputEnvelope;
    set?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    disconnect?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    delete?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    connect?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    update?: Prisma.documents_vehicleUpdateWithWhereUniqueWithoutTransport_document_typesInput | Prisma.documents_vehicleUpdateWithWhereUniqueWithoutTransport_document_typesInput[];
    updateMany?: Prisma.documents_vehicleUpdateManyWithWhereWithoutTransport_document_typesInput | Prisma.documents_vehicleUpdateManyWithWhereWithoutTransport_document_typesInput[];
    deleteMany?: Prisma.documents_vehicleScalarWhereInput | Prisma.documents_vehicleScalarWhereInput[];
};
export type documents_vehicleUncheckedUpdateManyWithoutTransport_document_typesNestedInput = {
    create?: Prisma.XOR<Prisma.documents_vehicleCreateWithoutTransport_document_typesInput, Prisma.documents_vehicleUncheckedCreateWithoutTransport_document_typesInput> | Prisma.documents_vehicleCreateWithoutTransport_document_typesInput[] | Prisma.documents_vehicleUncheckedCreateWithoutTransport_document_typesInput[];
    connectOrCreate?: Prisma.documents_vehicleCreateOrConnectWithoutTransport_document_typesInput | Prisma.documents_vehicleCreateOrConnectWithoutTransport_document_typesInput[];
    upsert?: Prisma.documents_vehicleUpsertWithWhereUniqueWithoutTransport_document_typesInput | Prisma.documents_vehicleUpsertWithWhereUniqueWithoutTransport_document_typesInput[];
    createMany?: Prisma.documents_vehicleCreateManyTransport_document_typesInputEnvelope;
    set?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    disconnect?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    delete?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    connect?: Prisma.documents_vehicleWhereUniqueInput | Prisma.documents_vehicleWhereUniqueInput[];
    update?: Prisma.documents_vehicleUpdateWithWhereUniqueWithoutTransport_document_typesInput | Prisma.documents_vehicleUpdateWithWhereUniqueWithoutTransport_document_typesInput[];
    updateMany?: Prisma.documents_vehicleUpdateManyWithWhereWithoutTransport_document_typesInput | Prisma.documents_vehicleUpdateManyWithWhereWithoutTransport_document_typesInput[];
    deleteMany?: Prisma.documents_vehicleScalarWhereInput | Prisma.documents_vehicleScalarWhereInput[];
};
export type documents_vehicleCreateWithoutVehiclesInput = {
    id?: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
    transport_document_types: Prisma.transport_document_typesCreateNestedOneWithoutDocuments_vehicleInput;
};
export type documents_vehicleUncheckedCreateWithoutVehiclesInput = {
    id?: string;
    document_type_id: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type documents_vehicleCreateOrConnectWithoutVehiclesInput = {
    where: Prisma.documents_vehicleWhereUniqueInput;
    create: Prisma.XOR<Prisma.documents_vehicleCreateWithoutVehiclesInput, Prisma.documents_vehicleUncheckedCreateWithoutVehiclesInput>;
};
export type documents_vehicleCreateManyVehiclesInputEnvelope = {
    data: Prisma.documents_vehicleCreateManyVehiclesInput | Prisma.documents_vehicleCreateManyVehiclesInput[];
    skipDuplicates?: boolean;
};
export type documents_vehicleUpsertWithWhereUniqueWithoutVehiclesInput = {
    where: Prisma.documents_vehicleWhereUniqueInput;
    update: Prisma.XOR<Prisma.documents_vehicleUpdateWithoutVehiclesInput, Prisma.documents_vehicleUncheckedUpdateWithoutVehiclesInput>;
    create: Prisma.XOR<Prisma.documents_vehicleCreateWithoutVehiclesInput, Prisma.documents_vehicleUncheckedCreateWithoutVehiclesInput>;
};
export type documents_vehicleUpdateWithWhereUniqueWithoutVehiclesInput = {
    where: Prisma.documents_vehicleWhereUniqueInput;
    data: Prisma.XOR<Prisma.documents_vehicleUpdateWithoutVehiclesInput, Prisma.documents_vehicleUncheckedUpdateWithoutVehiclesInput>;
};
export type documents_vehicleUpdateManyWithWhereWithoutVehiclesInput = {
    where: Prisma.documents_vehicleScalarWhereInput;
    data: Prisma.XOR<Prisma.documents_vehicleUpdateManyMutationInput, Prisma.documents_vehicleUncheckedUpdateManyWithoutVehiclesInput>;
};
export type documents_vehicleScalarWhereInput = {
    AND?: Prisma.documents_vehicleScalarWhereInput | Prisma.documents_vehicleScalarWhereInput[];
    OR?: Prisma.documents_vehicleScalarWhereInput[];
    NOT?: Prisma.documents_vehicleScalarWhereInput | Prisma.documents_vehicleScalarWhereInput[];
    id?: Prisma.UuidFilter<"documents_vehicle"> | string;
    vehicle_id?: Prisma.UuidFilter<"documents_vehicle"> | string;
    document_type_id?: Prisma.UuidFilter<"documents_vehicle"> | string;
    expiration_date?: Prisma.DateTimeNullableFilter<"documents_vehicle"> | Date | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"documents_vehicle"> | Date | string | null;
};
export type documents_vehicleCreateWithoutTransport_document_typesInput = {
    id?: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
    vehicles: Prisma.vehiclesCreateNestedOneWithoutVehicleDocumentsInput;
};
export type documents_vehicleUncheckedCreateWithoutTransport_document_typesInput = {
    id?: string;
    vehicle_id: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type documents_vehicleCreateOrConnectWithoutTransport_document_typesInput = {
    where: Prisma.documents_vehicleWhereUniqueInput;
    create: Prisma.XOR<Prisma.documents_vehicleCreateWithoutTransport_document_typesInput, Prisma.documents_vehicleUncheckedCreateWithoutTransport_document_typesInput>;
};
export type documents_vehicleCreateManyTransport_document_typesInputEnvelope = {
    data: Prisma.documents_vehicleCreateManyTransport_document_typesInput | Prisma.documents_vehicleCreateManyTransport_document_typesInput[];
    skipDuplicates?: boolean;
};
export type documents_vehicleUpsertWithWhereUniqueWithoutTransport_document_typesInput = {
    where: Prisma.documents_vehicleWhereUniqueInput;
    update: Prisma.XOR<Prisma.documents_vehicleUpdateWithoutTransport_document_typesInput, Prisma.documents_vehicleUncheckedUpdateWithoutTransport_document_typesInput>;
    create: Prisma.XOR<Prisma.documents_vehicleCreateWithoutTransport_document_typesInput, Prisma.documents_vehicleUncheckedCreateWithoutTransport_document_typesInput>;
};
export type documents_vehicleUpdateWithWhereUniqueWithoutTransport_document_typesInput = {
    where: Prisma.documents_vehicleWhereUniqueInput;
    data: Prisma.XOR<Prisma.documents_vehicleUpdateWithoutTransport_document_typesInput, Prisma.documents_vehicleUncheckedUpdateWithoutTransport_document_typesInput>;
};
export type documents_vehicleUpdateManyWithWhereWithoutTransport_document_typesInput = {
    where: Prisma.documents_vehicleScalarWhereInput;
    data: Prisma.XOR<Prisma.documents_vehicleUpdateManyMutationInput, Prisma.documents_vehicleUncheckedUpdateManyWithoutTransport_document_typesInput>;
};
export type documents_vehicleCreateManyVehiclesInput = {
    id?: string;
    document_type_id: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type documents_vehicleUpdateWithoutVehiclesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    transport_document_types?: Prisma.transport_document_typesUpdateOneRequiredWithoutDocuments_vehicleNestedInput;
};
export type documents_vehicleUncheckedUpdateWithoutVehiclesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type_id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type documents_vehicleUncheckedUpdateManyWithoutVehiclesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type_id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type documents_vehicleCreateManyTransport_document_typesInput = {
    id?: string;
    vehicle_id: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type documents_vehicleUpdateWithoutTransport_document_typesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    vehicles?: Prisma.vehiclesUpdateOneRequiredWithoutVehicleDocumentsNestedInput;
};
export type documents_vehicleUncheckedUpdateWithoutTransport_document_typesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicle_id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type documents_vehicleUncheckedUpdateManyWithoutTransport_document_typesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    vehicle_id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type documents_vehicleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    vehicle_id?: boolean;
    document_type_id?: boolean;
    expiration_date?: boolean;
    created_at?: boolean;
    vehicles?: boolean | Prisma.vehiclesDefaultArgs<ExtArgs>;
    transport_document_types?: boolean | Prisma.transport_document_typesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["documents_vehicle"]>;
export type documents_vehicleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    vehicle_id?: boolean;
    document_type_id?: boolean;
    expiration_date?: boolean;
    created_at?: boolean;
    vehicles?: boolean | Prisma.vehiclesDefaultArgs<ExtArgs>;
    transport_document_types?: boolean | Prisma.transport_document_typesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["documents_vehicle"]>;
export type documents_vehicleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    vehicle_id?: boolean;
    document_type_id?: boolean;
    expiration_date?: boolean;
    created_at?: boolean;
    vehicles?: boolean | Prisma.vehiclesDefaultArgs<ExtArgs>;
    transport_document_types?: boolean | Prisma.transport_document_typesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["documents_vehicle"]>;
export type documents_vehicleSelectScalar = {
    id?: boolean;
    vehicle_id?: boolean;
    document_type_id?: boolean;
    expiration_date?: boolean;
    created_at?: boolean;
};
export type documents_vehicleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "vehicle_id" | "document_type_id" | "expiration_date" | "created_at", ExtArgs["result"]["documents_vehicle"]>;
export type documents_vehicleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    vehicles?: boolean | Prisma.vehiclesDefaultArgs<ExtArgs>;
    transport_document_types?: boolean | Prisma.transport_document_typesDefaultArgs<ExtArgs>;
};
export type documents_vehicleIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    vehicles?: boolean | Prisma.vehiclesDefaultArgs<ExtArgs>;
    transport_document_types?: boolean | Prisma.transport_document_typesDefaultArgs<ExtArgs>;
};
export type documents_vehicleIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    vehicles?: boolean | Prisma.vehiclesDefaultArgs<ExtArgs>;
    transport_document_types?: boolean | Prisma.transport_document_typesDefaultArgs<ExtArgs>;
};
export type $documents_vehiclePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "documents_vehicle";
    objects: {
        vehicles: Prisma.$vehiclesPayload<ExtArgs>;
        transport_document_types: Prisma.$transport_document_typesPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        vehicle_id: string;
        document_type_id: string;
        expiration_date: Date | null;
        created_at: Date | null;
    }, ExtArgs["result"]["documents_vehicle"]>;
    composites: {};
};
export type documents_vehicleGetPayload<S extends boolean | null | undefined | documents_vehicleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$documents_vehiclePayload, S>;
export type documents_vehicleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<documents_vehicleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Documents_vehicleCountAggregateInputType | true;
};
export interface documents_vehicleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['documents_vehicle'];
        meta: {
            name: 'documents_vehicle';
        };
    };
    findUnique<T extends documents_vehicleFindUniqueArgs>(args: Prisma.SelectSubset<T, documents_vehicleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__documents_vehicleClient<runtime.Types.Result.GetResult<Prisma.$documents_vehiclePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends documents_vehicleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, documents_vehicleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__documents_vehicleClient<runtime.Types.Result.GetResult<Prisma.$documents_vehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends documents_vehicleFindFirstArgs>(args?: Prisma.SelectSubset<T, documents_vehicleFindFirstArgs<ExtArgs>>): Prisma.Prisma__documents_vehicleClient<runtime.Types.Result.GetResult<Prisma.$documents_vehiclePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends documents_vehicleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, documents_vehicleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__documents_vehicleClient<runtime.Types.Result.GetResult<Prisma.$documents_vehiclePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends documents_vehicleFindManyArgs>(args?: Prisma.SelectSubset<T, documents_vehicleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documents_vehiclePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends documents_vehicleCreateArgs>(args: Prisma.SelectSubset<T, documents_vehicleCreateArgs<ExtArgs>>): Prisma.Prisma__documents_vehicleClient<runtime.Types.Result.GetResult<Prisma.$documents_vehiclePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends documents_vehicleCreateManyArgs>(args?: Prisma.SelectSubset<T, documents_vehicleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends documents_vehicleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, documents_vehicleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documents_vehiclePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends documents_vehicleDeleteArgs>(args: Prisma.SelectSubset<T, documents_vehicleDeleteArgs<ExtArgs>>): Prisma.Prisma__documents_vehicleClient<runtime.Types.Result.GetResult<Prisma.$documents_vehiclePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends documents_vehicleUpdateArgs>(args: Prisma.SelectSubset<T, documents_vehicleUpdateArgs<ExtArgs>>): Prisma.Prisma__documents_vehicleClient<runtime.Types.Result.GetResult<Prisma.$documents_vehiclePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends documents_vehicleDeleteManyArgs>(args?: Prisma.SelectSubset<T, documents_vehicleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends documents_vehicleUpdateManyArgs>(args: Prisma.SelectSubset<T, documents_vehicleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends documents_vehicleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, documents_vehicleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documents_vehiclePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends documents_vehicleUpsertArgs>(args: Prisma.SelectSubset<T, documents_vehicleUpsertArgs<ExtArgs>>): Prisma.Prisma__documents_vehicleClient<runtime.Types.Result.GetResult<Prisma.$documents_vehiclePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends documents_vehicleCountArgs>(args?: Prisma.Subset<T, documents_vehicleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Documents_vehicleCountAggregateOutputType> : number>;
    aggregate<T extends Documents_vehicleAggregateArgs>(args: Prisma.Subset<T, Documents_vehicleAggregateArgs>): Prisma.PrismaPromise<GetDocuments_vehicleAggregateType<T>>;
    groupBy<T extends documents_vehicleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: documents_vehicleGroupByArgs['orderBy'];
    } : {
        orderBy?: documents_vehicleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, documents_vehicleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocuments_vehicleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: documents_vehicleFieldRefs;
}
export interface Prisma__documents_vehicleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    vehicles<T extends Prisma.vehiclesDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.vehiclesDefaultArgs<ExtArgs>>): Prisma.Prisma__vehiclesClient<runtime.Types.Result.GetResult<Prisma.$vehiclesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    transport_document_types<T extends Prisma.transport_document_typesDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.transport_document_typesDefaultArgs<ExtArgs>>): Prisma.Prisma__transport_document_typesClient<runtime.Types.Result.GetResult<Prisma.$transport_document_typesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface documents_vehicleFieldRefs {
    readonly id: Prisma.FieldRef<"documents_vehicle", 'String'>;
    readonly vehicle_id: Prisma.FieldRef<"documents_vehicle", 'String'>;
    readonly document_type_id: Prisma.FieldRef<"documents_vehicle", 'String'>;
    readonly expiration_date: Prisma.FieldRef<"documents_vehicle", 'DateTime'>;
    readonly created_at: Prisma.FieldRef<"documents_vehicle", 'DateTime'>;
}
export type documents_vehicleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_vehicleSelect<ExtArgs> | null;
    omit?: Prisma.documents_vehicleOmit<ExtArgs> | null;
    include?: Prisma.documents_vehicleInclude<ExtArgs> | null;
    where: Prisma.documents_vehicleWhereUniqueInput;
};
export type documents_vehicleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_vehicleSelect<ExtArgs> | null;
    omit?: Prisma.documents_vehicleOmit<ExtArgs> | null;
    include?: Prisma.documents_vehicleInclude<ExtArgs> | null;
    where: Prisma.documents_vehicleWhereUniqueInput;
};
export type documents_vehicleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type documents_vehicleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type documents_vehicleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type documents_vehicleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_vehicleSelect<ExtArgs> | null;
    omit?: Prisma.documents_vehicleOmit<ExtArgs> | null;
    include?: Prisma.documents_vehicleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.documents_vehicleCreateInput, Prisma.documents_vehicleUncheckedCreateInput>;
};
export type documents_vehicleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.documents_vehicleCreateManyInput | Prisma.documents_vehicleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type documents_vehicleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_vehicleSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.documents_vehicleOmit<ExtArgs> | null;
    data: Prisma.documents_vehicleCreateManyInput | Prisma.documents_vehicleCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.documents_vehicleIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type documents_vehicleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_vehicleSelect<ExtArgs> | null;
    omit?: Prisma.documents_vehicleOmit<ExtArgs> | null;
    include?: Prisma.documents_vehicleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.documents_vehicleUpdateInput, Prisma.documents_vehicleUncheckedUpdateInput>;
    where: Prisma.documents_vehicleWhereUniqueInput;
};
export type documents_vehicleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.documents_vehicleUpdateManyMutationInput, Prisma.documents_vehicleUncheckedUpdateManyInput>;
    where?: Prisma.documents_vehicleWhereInput;
    limit?: number;
};
export type documents_vehicleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_vehicleSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.documents_vehicleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.documents_vehicleUpdateManyMutationInput, Prisma.documents_vehicleUncheckedUpdateManyInput>;
    where?: Prisma.documents_vehicleWhereInput;
    limit?: number;
    include?: Prisma.documents_vehicleIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type documents_vehicleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_vehicleSelect<ExtArgs> | null;
    omit?: Prisma.documents_vehicleOmit<ExtArgs> | null;
    include?: Prisma.documents_vehicleInclude<ExtArgs> | null;
    where: Prisma.documents_vehicleWhereUniqueInput;
    create: Prisma.XOR<Prisma.documents_vehicleCreateInput, Prisma.documents_vehicleUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.documents_vehicleUpdateInput, Prisma.documents_vehicleUncheckedUpdateInput>;
};
export type documents_vehicleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_vehicleSelect<ExtArgs> | null;
    omit?: Prisma.documents_vehicleOmit<ExtArgs> | null;
    include?: Prisma.documents_vehicleInclude<ExtArgs> | null;
    where: Prisma.documents_vehicleWhereUniqueInput;
};
export type documents_vehicleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documents_vehicleWhereInput;
    limit?: number;
};
export type documents_vehicleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_vehicleSelect<ExtArgs> | null;
    omit?: Prisma.documents_vehicleOmit<ExtArgs> | null;
    include?: Prisma.documents_vehicleInclude<ExtArgs> | null;
};
