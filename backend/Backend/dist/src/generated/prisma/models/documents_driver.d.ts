import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type documents_driverModel = runtime.Types.Result.DefaultSelection<Prisma.$documents_driverPayload>;
export type AggregateDocuments_driver = {
    _count: Documents_driverCountAggregateOutputType | null;
    _min: Documents_driverMinAggregateOutputType | null;
    _max: Documents_driverMaxAggregateOutputType | null;
};
export type Documents_driverMinAggregateOutputType = {
    id: string | null;
    driver_id: string | null;
    document_type_id: string | null;
    expiration_date: Date | null;
    created_at: Date | null;
};
export type Documents_driverMaxAggregateOutputType = {
    id: string | null;
    driver_id: string | null;
    document_type_id: string | null;
    expiration_date: Date | null;
    created_at: Date | null;
};
export type Documents_driverCountAggregateOutputType = {
    id: number;
    driver_id: number;
    document_type_id: number;
    expiration_date: number;
    created_at: number;
    _all: number;
};
export type Documents_driverMinAggregateInputType = {
    id?: true;
    driver_id?: true;
    document_type_id?: true;
    expiration_date?: true;
    created_at?: true;
};
export type Documents_driverMaxAggregateInputType = {
    id?: true;
    driver_id?: true;
    document_type_id?: true;
    expiration_date?: true;
    created_at?: true;
};
export type Documents_driverCountAggregateInputType = {
    id?: true;
    driver_id?: true;
    document_type_id?: true;
    expiration_date?: true;
    created_at?: true;
    _all?: true;
};
export type Documents_driverAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documents_driverWhereInput;
    orderBy?: Prisma.documents_driverOrderByWithRelationInput | Prisma.documents_driverOrderByWithRelationInput[];
    cursor?: Prisma.documents_driverWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Documents_driverCountAggregateInputType;
    _min?: Documents_driverMinAggregateInputType;
    _max?: Documents_driverMaxAggregateInputType;
};
export type GetDocuments_driverAggregateType<T extends Documents_driverAggregateArgs> = {
    [P in keyof T & keyof AggregateDocuments_driver]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocuments_driver[P]> : Prisma.GetScalarType<T[P], AggregateDocuments_driver[P]>;
};
export type documents_driverGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documents_driverWhereInput;
    orderBy?: Prisma.documents_driverOrderByWithAggregationInput | Prisma.documents_driverOrderByWithAggregationInput[];
    by: Prisma.Documents_driverScalarFieldEnum[] | Prisma.Documents_driverScalarFieldEnum;
    having?: Prisma.documents_driverScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Documents_driverCountAggregateInputType | true;
    _min?: Documents_driverMinAggregateInputType;
    _max?: Documents_driverMaxAggregateInputType;
};
export type Documents_driverGroupByOutputType = {
    id: string;
    driver_id: string;
    document_type_id: string;
    expiration_date: Date | null;
    created_at: Date | null;
    _count: Documents_driverCountAggregateOutputType | null;
    _min: Documents_driverMinAggregateOutputType | null;
    _max: Documents_driverMaxAggregateOutputType | null;
};
export type GetDocuments_driverGroupByPayload<T extends documents_driverGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Documents_driverGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Documents_driverGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Documents_driverGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Documents_driverGroupByOutputType[P]>;
}>>;
export type documents_driverWhereInput = {
    AND?: Prisma.documents_driverWhereInput | Prisma.documents_driverWhereInput[];
    OR?: Prisma.documents_driverWhereInput[];
    NOT?: Prisma.documents_driverWhereInput | Prisma.documents_driverWhereInput[];
    id?: Prisma.UuidFilter<"documents_driver"> | string;
    driver_id?: Prisma.UuidFilter<"documents_driver"> | string;
    document_type_id?: Prisma.UuidFilter<"documents_driver"> | string;
    expiration_date?: Prisma.DateTimeNullableFilter<"documents_driver"> | Date | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"documents_driver"> | Date | string | null;
    drivers?: Prisma.XOR<Prisma.DriversScalarRelationFilter, Prisma.driversWhereInput>;
    transport_document_types?: Prisma.XOR<Prisma.Transport_document_typesScalarRelationFilter, Prisma.transport_document_typesWhereInput>;
};
export type documents_driverOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    driver_id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    expiration_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    drivers?: Prisma.driversOrderByWithRelationInput;
    transport_document_types?: Prisma.transport_document_typesOrderByWithRelationInput;
};
export type documents_driverWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    driver_id_document_type_id?: Prisma.documents_driverDriver_idDocument_type_idCompoundUniqueInput;
    AND?: Prisma.documents_driverWhereInput | Prisma.documents_driverWhereInput[];
    OR?: Prisma.documents_driverWhereInput[];
    NOT?: Prisma.documents_driverWhereInput | Prisma.documents_driverWhereInput[];
    driver_id?: Prisma.UuidFilter<"documents_driver"> | string;
    document_type_id?: Prisma.UuidFilter<"documents_driver"> | string;
    expiration_date?: Prisma.DateTimeNullableFilter<"documents_driver"> | Date | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"documents_driver"> | Date | string | null;
    drivers?: Prisma.XOR<Prisma.DriversScalarRelationFilter, Prisma.driversWhereInput>;
    transport_document_types?: Prisma.XOR<Prisma.Transport_document_typesScalarRelationFilter, Prisma.transport_document_typesWhereInput>;
}, "id" | "driver_id_document_type_id">;
export type documents_driverOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    driver_id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    expiration_date?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.documents_driverCountOrderByAggregateInput;
    _max?: Prisma.documents_driverMaxOrderByAggregateInput;
    _min?: Prisma.documents_driverMinOrderByAggregateInput;
};
export type documents_driverScalarWhereWithAggregatesInput = {
    AND?: Prisma.documents_driverScalarWhereWithAggregatesInput | Prisma.documents_driverScalarWhereWithAggregatesInput[];
    OR?: Prisma.documents_driverScalarWhereWithAggregatesInput[];
    NOT?: Prisma.documents_driverScalarWhereWithAggregatesInput | Prisma.documents_driverScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"documents_driver"> | string;
    driver_id?: Prisma.UuidWithAggregatesFilter<"documents_driver"> | string;
    document_type_id?: Prisma.UuidWithAggregatesFilter<"documents_driver"> | string;
    expiration_date?: Prisma.DateTimeNullableWithAggregatesFilter<"documents_driver"> | Date | string | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"documents_driver"> | Date | string | null;
};
export type documents_driverCreateInput = {
    id?: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
    drivers: Prisma.driversCreateNestedOneWithoutDriverDocumentsInput;
    transport_document_types: Prisma.transport_document_typesCreateNestedOneWithoutDocuments_driverInput;
};
export type documents_driverUncheckedCreateInput = {
    id?: string;
    driver_id: string;
    document_type_id: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type documents_driverUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    drivers?: Prisma.driversUpdateOneRequiredWithoutDriverDocumentsNestedInput;
    transport_document_types?: Prisma.transport_document_typesUpdateOneRequiredWithoutDocuments_driverNestedInput;
};
export type documents_driverUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    driver_id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type_id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type documents_driverCreateManyInput = {
    id?: string;
    driver_id: string;
    document_type_id: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type documents_driverUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type documents_driverUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    driver_id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type_id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type Documents_driverListRelationFilter = {
    every?: Prisma.documents_driverWhereInput;
    some?: Prisma.documents_driverWhereInput;
    none?: Prisma.documents_driverWhereInput;
};
export type documents_driverOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type documents_driverDriver_idDocument_type_idCompoundUniqueInput = {
    driver_id: string;
    document_type_id: string;
};
export type documents_driverCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    driver_id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    expiration_date?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type documents_driverMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    driver_id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    expiration_date?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type documents_driverMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    driver_id?: Prisma.SortOrder;
    document_type_id?: Prisma.SortOrder;
    expiration_date?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type documents_driverCreateNestedManyWithoutDriversInput = {
    create?: Prisma.XOR<Prisma.documents_driverCreateWithoutDriversInput, Prisma.documents_driverUncheckedCreateWithoutDriversInput> | Prisma.documents_driverCreateWithoutDriversInput[] | Prisma.documents_driverUncheckedCreateWithoutDriversInput[];
    connectOrCreate?: Prisma.documents_driverCreateOrConnectWithoutDriversInput | Prisma.documents_driverCreateOrConnectWithoutDriversInput[];
    createMany?: Prisma.documents_driverCreateManyDriversInputEnvelope;
    connect?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
};
export type documents_driverUncheckedCreateNestedManyWithoutDriversInput = {
    create?: Prisma.XOR<Prisma.documents_driverCreateWithoutDriversInput, Prisma.documents_driverUncheckedCreateWithoutDriversInput> | Prisma.documents_driverCreateWithoutDriversInput[] | Prisma.documents_driverUncheckedCreateWithoutDriversInput[];
    connectOrCreate?: Prisma.documents_driverCreateOrConnectWithoutDriversInput | Prisma.documents_driverCreateOrConnectWithoutDriversInput[];
    createMany?: Prisma.documents_driverCreateManyDriversInputEnvelope;
    connect?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
};
export type documents_driverUpdateManyWithoutDriversNestedInput = {
    create?: Prisma.XOR<Prisma.documents_driverCreateWithoutDriversInput, Prisma.documents_driverUncheckedCreateWithoutDriversInput> | Prisma.documents_driverCreateWithoutDriversInput[] | Prisma.documents_driverUncheckedCreateWithoutDriversInput[];
    connectOrCreate?: Prisma.documents_driverCreateOrConnectWithoutDriversInput | Prisma.documents_driverCreateOrConnectWithoutDriversInput[];
    upsert?: Prisma.documents_driverUpsertWithWhereUniqueWithoutDriversInput | Prisma.documents_driverUpsertWithWhereUniqueWithoutDriversInput[];
    createMany?: Prisma.documents_driverCreateManyDriversInputEnvelope;
    set?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    disconnect?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    delete?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    connect?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    update?: Prisma.documents_driverUpdateWithWhereUniqueWithoutDriversInput | Prisma.documents_driverUpdateWithWhereUniqueWithoutDriversInput[];
    updateMany?: Prisma.documents_driverUpdateManyWithWhereWithoutDriversInput | Prisma.documents_driverUpdateManyWithWhereWithoutDriversInput[];
    deleteMany?: Prisma.documents_driverScalarWhereInput | Prisma.documents_driverScalarWhereInput[];
};
export type documents_driverUncheckedUpdateManyWithoutDriversNestedInput = {
    create?: Prisma.XOR<Prisma.documents_driverCreateWithoutDriversInput, Prisma.documents_driverUncheckedCreateWithoutDriversInput> | Prisma.documents_driverCreateWithoutDriversInput[] | Prisma.documents_driverUncheckedCreateWithoutDriversInput[];
    connectOrCreate?: Prisma.documents_driverCreateOrConnectWithoutDriversInput | Prisma.documents_driverCreateOrConnectWithoutDriversInput[];
    upsert?: Prisma.documents_driverUpsertWithWhereUniqueWithoutDriversInput | Prisma.documents_driverUpsertWithWhereUniqueWithoutDriversInput[];
    createMany?: Prisma.documents_driverCreateManyDriversInputEnvelope;
    set?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    disconnect?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    delete?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    connect?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    update?: Prisma.documents_driverUpdateWithWhereUniqueWithoutDriversInput | Prisma.documents_driverUpdateWithWhereUniqueWithoutDriversInput[];
    updateMany?: Prisma.documents_driverUpdateManyWithWhereWithoutDriversInput | Prisma.documents_driverUpdateManyWithWhereWithoutDriversInput[];
    deleteMany?: Prisma.documents_driverScalarWhereInput | Prisma.documents_driverScalarWhereInput[];
};
export type documents_driverCreateNestedManyWithoutTransport_document_typesInput = {
    create?: Prisma.XOR<Prisma.documents_driverCreateWithoutTransport_document_typesInput, Prisma.documents_driverUncheckedCreateWithoutTransport_document_typesInput> | Prisma.documents_driverCreateWithoutTransport_document_typesInput[] | Prisma.documents_driverUncheckedCreateWithoutTransport_document_typesInput[];
    connectOrCreate?: Prisma.documents_driverCreateOrConnectWithoutTransport_document_typesInput | Prisma.documents_driverCreateOrConnectWithoutTransport_document_typesInput[];
    createMany?: Prisma.documents_driverCreateManyTransport_document_typesInputEnvelope;
    connect?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
};
export type documents_driverUncheckedCreateNestedManyWithoutTransport_document_typesInput = {
    create?: Prisma.XOR<Prisma.documents_driverCreateWithoutTransport_document_typesInput, Prisma.documents_driverUncheckedCreateWithoutTransport_document_typesInput> | Prisma.documents_driverCreateWithoutTransport_document_typesInput[] | Prisma.documents_driverUncheckedCreateWithoutTransport_document_typesInput[];
    connectOrCreate?: Prisma.documents_driverCreateOrConnectWithoutTransport_document_typesInput | Prisma.documents_driverCreateOrConnectWithoutTransport_document_typesInput[];
    createMany?: Prisma.documents_driverCreateManyTransport_document_typesInputEnvelope;
    connect?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
};
export type documents_driverUpdateManyWithoutTransport_document_typesNestedInput = {
    create?: Prisma.XOR<Prisma.documents_driverCreateWithoutTransport_document_typesInput, Prisma.documents_driverUncheckedCreateWithoutTransport_document_typesInput> | Prisma.documents_driverCreateWithoutTransport_document_typesInput[] | Prisma.documents_driverUncheckedCreateWithoutTransport_document_typesInput[];
    connectOrCreate?: Prisma.documents_driverCreateOrConnectWithoutTransport_document_typesInput | Prisma.documents_driverCreateOrConnectWithoutTransport_document_typesInput[];
    upsert?: Prisma.documents_driverUpsertWithWhereUniqueWithoutTransport_document_typesInput | Prisma.documents_driverUpsertWithWhereUniqueWithoutTransport_document_typesInput[];
    createMany?: Prisma.documents_driverCreateManyTransport_document_typesInputEnvelope;
    set?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    disconnect?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    delete?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    connect?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    update?: Prisma.documents_driverUpdateWithWhereUniqueWithoutTransport_document_typesInput | Prisma.documents_driverUpdateWithWhereUniqueWithoutTransport_document_typesInput[];
    updateMany?: Prisma.documents_driverUpdateManyWithWhereWithoutTransport_document_typesInput | Prisma.documents_driverUpdateManyWithWhereWithoutTransport_document_typesInput[];
    deleteMany?: Prisma.documents_driverScalarWhereInput | Prisma.documents_driverScalarWhereInput[];
};
export type documents_driverUncheckedUpdateManyWithoutTransport_document_typesNestedInput = {
    create?: Prisma.XOR<Prisma.documents_driverCreateWithoutTransport_document_typesInput, Prisma.documents_driverUncheckedCreateWithoutTransport_document_typesInput> | Prisma.documents_driverCreateWithoutTransport_document_typesInput[] | Prisma.documents_driverUncheckedCreateWithoutTransport_document_typesInput[];
    connectOrCreate?: Prisma.documents_driverCreateOrConnectWithoutTransport_document_typesInput | Prisma.documents_driverCreateOrConnectWithoutTransport_document_typesInput[];
    upsert?: Prisma.documents_driverUpsertWithWhereUniqueWithoutTransport_document_typesInput | Prisma.documents_driverUpsertWithWhereUniqueWithoutTransport_document_typesInput[];
    createMany?: Prisma.documents_driverCreateManyTransport_document_typesInputEnvelope;
    set?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    disconnect?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    delete?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    connect?: Prisma.documents_driverWhereUniqueInput | Prisma.documents_driverWhereUniqueInput[];
    update?: Prisma.documents_driverUpdateWithWhereUniqueWithoutTransport_document_typesInput | Prisma.documents_driverUpdateWithWhereUniqueWithoutTransport_document_typesInput[];
    updateMany?: Prisma.documents_driverUpdateManyWithWhereWithoutTransport_document_typesInput | Prisma.documents_driverUpdateManyWithWhereWithoutTransport_document_typesInput[];
    deleteMany?: Prisma.documents_driverScalarWhereInput | Prisma.documents_driverScalarWhereInput[];
};
export type documents_driverCreateWithoutDriversInput = {
    id?: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
    transport_document_types: Prisma.transport_document_typesCreateNestedOneWithoutDocuments_driverInput;
};
export type documents_driverUncheckedCreateWithoutDriversInput = {
    id?: string;
    document_type_id: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type documents_driverCreateOrConnectWithoutDriversInput = {
    where: Prisma.documents_driverWhereUniqueInput;
    create: Prisma.XOR<Prisma.documents_driverCreateWithoutDriversInput, Prisma.documents_driverUncheckedCreateWithoutDriversInput>;
};
export type documents_driverCreateManyDriversInputEnvelope = {
    data: Prisma.documents_driverCreateManyDriversInput | Prisma.documents_driverCreateManyDriversInput[];
    skipDuplicates?: boolean;
};
export type documents_driverUpsertWithWhereUniqueWithoutDriversInput = {
    where: Prisma.documents_driverWhereUniqueInput;
    update: Prisma.XOR<Prisma.documents_driverUpdateWithoutDriversInput, Prisma.documents_driverUncheckedUpdateWithoutDriversInput>;
    create: Prisma.XOR<Prisma.documents_driverCreateWithoutDriversInput, Prisma.documents_driverUncheckedCreateWithoutDriversInput>;
};
export type documents_driverUpdateWithWhereUniqueWithoutDriversInput = {
    where: Prisma.documents_driverWhereUniqueInput;
    data: Prisma.XOR<Prisma.documents_driverUpdateWithoutDriversInput, Prisma.documents_driverUncheckedUpdateWithoutDriversInput>;
};
export type documents_driverUpdateManyWithWhereWithoutDriversInput = {
    where: Prisma.documents_driverScalarWhereInput;
    data: Prisma.XOR<Prisma.documents_driverUpdateManyMutationInput, Prisma.documents_driverUncheckedUpdateManyWithoutDriversInput>;
};
export type documents_driverScalarWhereInput = {
    AND?: Prisma.documents_driverScalarWhereInput | Prisma.documents_driverScalarWhereInput[];
    OR?: Prisma.documents_driverScalarWhereInput[];
    NOT?: Prisma.documents_driverScalarWhereInput | Prisma.documents_driverScalarWhereInput[];
    id?: Prisma.UuidFilter<"documents_driver"> | string;
    driver_id?: Prisma.UuidFilter<"documents_driver"> | string;
    document_type_id?: Prisma.UuidFilter<"documents_driver"> | string;
    expiration_date?: Prisma.DateTimeNullableFilter<"documents_driver"> | Date | string | null;
    created_at?: Prisma.DateTimeNullableFilter<"documents_driver"> | Date | string | null;
};
export type documents_driverCreateWithoutTransport_document_typesInput = {
    id?: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
    drivers: Prisma.driversCreateNestedOneWithoutDriverDocumentsInput;
};
export type documents_driverUncheckedCreateWithoutTransport_document_typesInput = {
    id?: string;
    driver_id: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type documents_driverCreateOrConnectWithoutTransport_document_typesInput = {
    where: Prisma.documents_driverWhereUniqueInput;
    create: Prisma.XOR<Prisma.documents_driverCreateWithoutTransport_document_typesInput, Prisma.documents_driverUncheckedCreateWithoutTransport_document_typesInput>;
};
export type documents_driverCreateManyTransport_document_typesInputEnvelope = {
    data: Prisma.documents_driverCreateManyTransport_document_typesInput | Prisma.documents_driverCreateManyTransport_document_typesInput[];
    skipDuplicates?: boolean;
};
export type documents_driverUpsertWithWhereUniqueWithoutTransport_document_typesInput = {
    where: Prisma.documents_driverWhereUniqueInput;
    update: Prisma.XOR<Prisma.documents_driverUpdateWithoutTransport_document_typesInput, Prisma.documents_driverUncheckedUpdateWithoutTransport_document_typesInput>;
    create: Prisma.XOR<Prisma.documents_driverCreateWithoutTransport_document_typesInput, Prisma.documents_driverUncheckedCreateWithoutTransport_document_typesInput>;
};
export type documents_driverUpdateWithWhereUniqueWithoutTransport_document_typesInput = {
    where: Prisma.documents_driverWhereUniqueInput;
    data: Prisma.XOR<Prisma.documents_driverUpdateWithoutTransport_document_typesInput, Prisma.documents_driverUncheckedUpdateWithoutTransport_document_typesInput>;
};
export type documents_driverUpdateManyWithWhereWithoutTransport_document_typesInput = {
    where: Prisma.documents_driverScalarWhereInput;
    data: Prisma.XOR<Prisma.documents_driverUpdateManyMutationInput, Prisma.documents_driverUncheckedUpdateManyWithoutTransport_document_typesInput>;
};
export type documents_driverCreateManyDriversInput = {
    id?: string;
    document_type_id: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type documents_driverUpdateWithoutDriversInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    transport_document_types?: Prisma.transport_document_typesUpdateOneRequiredWithoutDocuments_driverNestedInput;
};
export type documents_driverUncheckedUpdateWithoutDriversInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type_id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type documents_driverUncheckedUpdateManyWithoutDriversInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type_id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type documents_driverCreateManyTransport_document_typesInput = {
    id?: string;
    driver_id: string;
    expiration_date?: Date | string | null;
    created_at?: Date | string | null;
};
export type documents_driverUpdateWithoutTransport_document_typesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    drivers?: Prisma.driversUpdateOneRequiredWithoutDriverDocumentsNestedInput;
};
export type documents_driverUncheckedUpdateWithoutTransport_document_typesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    driver_id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type documents_driverUncheckedUpdateManyWithoutTransport_document_typesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    driver_id?: Prisma.StringFieldUpdateOperationsInput | string;
    expiration_date?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type documents_driverSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    driver_id?: boolean;
    document_type_id?: boolean;
    expiration_date?: boolean;
    created_at?: boolean;
    drivers?: boolean | Prisma.driversDefaultArgs<ExtArgs>;
    transport_document_types?: boolean | Prisma.transport_document_typesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["documents_driver"]>;
export type documents_driverSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    driver_id?: boolean;
    document_type_id?: boolean;
    expiration_date?: boolean;
    created_at?: boolean;
    drivers?: boolean | Prisma.driversDefaultArgs<ExtArgs>;
    transport_document_types?: boolean | Prisma.transport_document_typesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["documents_driver"]>;
export type documents_driverSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    driver_id?: boolean;
    document_type_id?: boolean;
    expiration_date?: boolean;
    created_at?: boolean;
    drivers?: boolean | Prisma.driversDefaultArgs<ExtArgs>;
    transport_document_types?: boolean | Prisma.transport_document_typesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["documents_driver"]>;
export type documents_driverSelectScalar = {
    id?: boolean;
    driver_id?: boolean;
    document_type_id?: boolean;
    expiration_date?: boolean;
    created_at?: boolean;
};
export type documents_driverOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "driver_id" | "document_type_id" | "expiration_date" | "created_at", ExtArgs["result"]["documents_driver"]>;
export type documents_driverInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drivers?: boolean | Prisma.driversDefaultArgs<ExtArgs>;
    transport_document_types?: boolean | Prisma.transport_document_typesDefaultArgs<ExtArgs>;
};
export type documents_driverIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drivers?: boolean | Prisma.driversDefaultArgs<ExtArgs>;
    transport_document_types?: boolean | Prisma.transport_document_typesDefaultArgs<ExtArgs>;
};
export type documents_driverIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    drivers?: boolean | Prisma.driversDefaultArgs<ExtArgs>;
    transport_document_types?: boolean | Prisma.transport_document_typesDefaultArgs<ExtArgs>;
};
export type $documents_driverPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "documents_driver";
    objects: {
        drivers: Prisma.$driversPayload<ExtArgs>;
        transport_document_types: Prisma.$transport_document_typesPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        driver_id: string;
        document_type_id: string;
        expiration_date: Date | null;
        created_at: Date | null;
    }, ExtArgs["result"]["documents_driver"]>;
    composites: {};
};
export type documents_driverGetPayload<S extends boolean | null | undefined | documents_driverDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$documents_driverPayload, S>;
export type documents_driverCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<documents_driverFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Documents_driverCountAggregateInputType | true;
};
export interface documents_driverDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['documents_driver'];
        meta: {
            name: 'documents_driver';
        };
    };
    findUnique<T extends documents_driverFindUniqueArgs>(args: Prisma.SelectSubset<T, documents_driverFindUniqueArgs<ExtArgs>>): Prisma.Prisma__documents_driverClient<runtime.Types.Result.GetResult<Prisma.$documents_driverPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends documents_driverFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, documents_driverFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__documents_driverClient<runtime.Types.Result.GetResult<Prisma.$documents_driverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends documents_driverFindFirstArgs>(args?: Prisma.SelectSubset<T, documents_driverFindFirstArgs<ExtArgs>>): Prisma.Prisma__documents_driverClient<runtime.Types.Result.GetResult<Prisma.$documents_driverPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends documents_driverFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, documents_driverFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__documents_driverClient<runtime.Types.Result.GetResult<Prisma.$documents_driverPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends documents_driverFindManyArgs>(args?: Prisma.SelectSubset<T, documents_driverFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documents_driverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends documents_driverCreateArgs>(args: Prisma.SelectSubset<T, documents_driverCreateArgs<ExtArgs>>): Prisma.Prisma__documents_driverClient<runtime.Types.Result.GetResult<Prisma.$documents_driverPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends documents_driverCreateManyArgs>(args?: Prisma.SelectSubset<T, documents_driverCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends documents_driverCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, documents_driverCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documents_driverPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends documents_driverDeleteArgs>(args: Prisma.SelectSubset<T, documents_driverDeleteArgs<ExtArgs>>): Prisma.Prisma__documents_driverClient<runtime.Types.Result.GetResult<Prisma.$documents_driverPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends documents_driverUpdateArgs>(args: Prisma.SelectSubset<T, documents_driverUpdateArgs<ExtArgs>>): Prisma.Prisma__documents_driverClient<runtime.Types.Result.GetResult<Prisma.$documents_driverPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends documents_driverDeleteManyArgs>(args?: Prisma.SelectSubset<T, documents_driverDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends documents_driverUpdateManyArgs>(args: Prisma.SelectSubset<T, documents_driverUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends documents_driverUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, documents_driverUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documents_driverPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends documents_driverUpsertArgs>(args: Prisma.SelectSubset<T, documents_driverUpsertArgs<ExtArgs>>): Prisma.Prisma__documents_driverClient<runtime.Types.Result.GetResult<Prisma.$documents_driverPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends documents_driverCountArgs>(args?: Prisma.Subset<T, documents_driverCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Documents_driverCountAggregateOutputType> : number>;
    aggregate<T extends Documents_driverAggregateArgs>(args: Prisma.Subset<T, Documents_driverAggregateArgs>): Prisma.PrismaPromise<GetDocuments_driverAggregateType<T>>;
    groupBy<T extends documents_driverGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: documents_driverGroupByArgs['orderBy'];
    } : {
        orderBy?: documents_driverGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, documents_driverGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocuments_driverGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: documents_driverFieldRefs;
}
export interface Prisma__documents_driverClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    drivers<T extends Prisma.driversDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.driversDefaultArgs<ExtArgs>>): Prisma.Prisma__driversClient<runtime.Types.Result.GetResult<Prisma.$driversPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    transport_document_types<T extends Prisma.transport_document_typesDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.transport_document_typesDefaultArgs<ExtArgs>>): Prisma.Prisma__transport_document_typesClient<runtime.Types.Result.GetResult<Prisma.$transport_document_typesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface documents_driverFieldRefs {
    readonly id: Prisma.FieldRef<"documents_driver", 'String'>;
    readonly driver_id: Prisma.FieldRef<"documents_driver", 'String'>;
    readonly document_type_id: Prisma.FieldRef<"documents_driver", 'String'>;
    readonly expiration_date: Prisma.FieldRef<"documents_driver", 'DateTime'>;
    readonly created_at: Prisma.FieldRef<"documents_driver", 'DateTime'>;
}
export type documents_driverFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_driverSelect<ExtArgs> | null;
    omit?: Prisma.documents_driverOmit<ExtArgs> | null;
    include?: Prisma.documents_driverInclude<ExtArgs> | null;
    where: Prisma.documents_driverWhereUniqueInput;
};
export type documents_driverFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_driverSelect<ExtArgs> | null;
    omit?: Prisma.documents_driverOmit<ExtArgs> | null;
    include?: Prisma.documents_driverInclude<ExtArgs> | null;
    where: Prisma.documents_driverWhereUniqueInput;
};
export type documents_driverFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_driverSelect<ExtArgs> | null;
    omit?: Prisma.documents_driverOmit<ExtArgs> | null;
    include?: Prisma.documents_driverInclude<ExtArgs> | null;
    where?: Prisma.documents_driverWhereInput;
    orderBy?: Prisma.documents_driverOrderByWithRelationInput | Prisma.documents_driverOrderByWithRelationInput[];
    cursor?: Prisma.documents_driverWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Documents_driverScalarFieldEnum | Prisma.Documents_driverScalarFieldEnum[];
};
export type documents_driverFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_driverSelect<ExtArgs> | null;
    omit?: Prisma.documents_driverOmit<ExtArgs> | null;
    include?: Prisma.documents_driverInclude<ExtArgs> | null;
    where?: Prisma.documents_driverWhereInput;
    orderBy?: Prisma.documents_driverOrderByWithRelationInput | Prisma.documents_driverOrderByWithRelationInput[];
    cursor?: Prisma.documents_driverWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Documents_driverScalarFieldEnum | Prisma.Documents_driverScalarFieldEnum[];
};
export type documents_driverFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_driverSelect<ExtArgs> | null;
    omit?: Prisma.documents_driverOmit<ExtArgs> | null;
    include?: Prisma.documents_driverInclude<ExtArgs> | null;
    where?: Prisma.documents_driverWhereInput;
    orderBy?: Prisma.documents_driverOrderByWithRelationInput | Prisma.documents_driverOrderByWithRelationInput[];
    cursor?: Prisma.documents_driverWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Documents_driverScalarFieldEnum | Prisma.Documents_driverScalarFieldEnum[];
};
export type documents_driverCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_driverSelect<ExtArgs> | null;
    omit?: Prisma.documents_driverOmit<ExtArgs> | null;
    include?: Prisma.documents_driverInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.documents_driverCreateInput, Prisma.documents_driverUncheckedCreateInput>;
};
export type documents_driverCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.documents_driverCreateManyInput | Prisma.documents_driverCreateManyInput[];
    skipDuplicates?: boolean;
};
export type documents_driverCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_driverSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.documents_driverOmit<ExtArgs> | null;
    data: Prisma.documents_driverCreateManyInput | Prisma.documents_driverCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.documents_driverIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type documents_driverUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_driverSelect<ExtArgs> | null;
    omit?: Prisma.documents_driverOmit<ExtArgs> | null;
    include?: Prisma.documents_driverInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.documents_driverUpdateInput, Prisma.documents_driverUncheckedUpdateInput>;
    where: Prisma.documents_driverWhereUniqueInput;
};
export type documents_driverUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.documents_driverUpdateManyMutationInput, Prisma.documents_driverUncheckedUpdateManyInput>;
    where?: Prisma.documents_driverWhereInput;
    limit?: number;
};
export type documents_driverUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_driverSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.documents_driverOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.documents_driverUpdateManyMutationInput, Prisma.documents_driverUncheckedUpdateManyInput>;
    where?: Prisma.documents_driverWhereInput;
    limit?: number;
    include?: Prisma.documents_driverIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type documents_driverUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_driverSelect<ExtArgs> | null;
    omit?: Prisma.documents_driverOmit<ExtArgs> | null;
    include?: Prisma.documents_driverInclude<ExtArgs> | null;
    where: Prisma.documents_driverWhereUniqueInput;
    create: Prisma.XOR<Prisma.documents_driverCreateInput, Prisma.documents_driverUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.documents_driverUpdateInput, Prisma.documents_driverUncheckedUpdateInput>;
};
export type documents_driverDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_driverSelect<ExtArgs> | null;
    omit?: Prisma.documents_driverOmit<ExtArgs> | null;
    include?: Prisma.documents_driverInclude<ExtArgs> | null;
    where: Prisma.documents_driverWhereUniqueInput;
};
export type documents_driverDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documents_driverWhereInput;
    limit?: number;
};
export type documents_driverDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_driverSelect<ExtArgs> | null;
    omit?: Prisma.documents_driverOmit<ExtArgs> | null;
    include?: Prisma.documents_driverInclude<ExtArgs> | null;
};
