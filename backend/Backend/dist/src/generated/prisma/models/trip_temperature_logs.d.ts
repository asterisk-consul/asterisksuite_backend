import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type trip_temperature_logsModel = runtime.Types.Result.DefaultSelection<Prisma.$trip_temperature_logsPayload>;
export type AggregateTrip_temperature_logs = {
    _count: Trip_temperature_logsCountAggregateOutputType | null;
    _avg: Trip_temperature_logsAvgAggregateOutputType | null;
    _sum: Trip_temperature_logsSumAggregateOutputType | null;
    _min: Trip_temperature_logsMinAggregateOutputType | null;
    _max: Trip_temperature_logsMaxAggregateOutputType | null;
};
export type Trip_temperature_logsAvgAggregateOutputType = {
    temperature: runtime.Decimal | null;
};
export type Trip_temperature_logsSumAggregateOutputType = {
    temperature: runtime.Decimal | null;
};
export type Trip_temperature_logsMinAggregateOutputType = {
    id: string | null;
    trip_id: string | null;
    temperature: runtime.Decimal | null;
    recorded_at: Date | null;
    recorded_by: string | null;
};
export type Trip_temperature_logsMaxAggregateOutputType = {
    id: string | null;
    trip_id: string | null;
    temperature: runtime.Decimal | null;
    recorded_at: Date | null;
    recorded_by: string | null;
};
export type Trip_temperature_logsCountAggregateOutputType = {
    id: number;
    trip_id: number;
    temperature: number;
    recorded_at: number;
    recorded_by: number;
    _all: number;
};
export type Trip_temperature_logsAvgAggregateInputType = {
    temperature?: true;
};
export type Trip_temperature_logsSumAggregateInputType = {
    temperature?: true;
};
export type Trip_temperature_logsMinAggregateInputType = {
    id?: true;
    trip_id?: true;
    temperature?: true;
    recorded_at?: true;
    recorded_by?: true;
};
export type Trip_temperature_logsMaxAggregateInputType = {
    id?: true;
    trip_id?: true;
    temperature?: true;
    recorded_at?: true;
    recorded_by?: true;
};
export type Trip_temperature_logsCountAggregateInputType = {
    id?: true;
    trip_id?: true;
    temperature?: true;
    recorded_at?: true;
    recorded_by?: true;
    _all?: true;
};
export type Trip_temperature_logsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.trip_temperature_logsWhereInput;
    orderBy?: Prisma.trip_temperature_logsOrderByWithRelationInput | Prisma.trip_temperature_logsOrderByWithRelationInput[];
    cursor?: Prisma.trip_temperature_logsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Trip_temperature_logsCountAggregateInputType;
    _avg?: Trip_temperature_logsAvgAggregateInputType;
    _sum?: Trip_temperature_logsSumAggregateInputType;
    _min?: Trip_temperature_logsMinAggregateInputType;
    _max?: Trip_temperature_logsMaxAggregateInputType;
};
export type GetTrip_temperature_logsAggregateType<T extends Trip_temperature_logsAggregateArgs> = {
    [P in keyof T & keyof AggregateTrip_temperature_logs]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTrip_temperature_logs[P]> : Prisma.GetScalarType<T[P], AggregateTrip_temperature_logs[P]>;
};
export type trip_temperature_logsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.trip_temperature_logsWhereInput;
    orderBy?: Prisma.trip_temperature_logsOrderByWithAggregationInput | Prisma.trip_temperature_logsOrderByWithAggregationInput[];
    by: Prisma.Trip_temperature_logsScalarFieldEnum[] | Prisma.Trip_temperature_logsScalarFieldEnum;
    having?: Prisma.trip_temperature_logsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Trip_temperature_logsCountAggregateInputType | true;
    _avg?: Trip_temperature_logsAvgAggregateInputType;
    _sum?: Trip_temperature_logsSumAggregateInputType;
    _min?: Trip_temperature_logsMinAggregateInputType;
    _max?: Trip_temperature_logsMaxAggregateInputType;
};
export type Trip_temperature_logsGroupByOutputType = {
    id: string;
    trip_id: string;
    temperature: runtime.Decimal;
    recorded_at: Date;
    recorded_by: string | null;
    _count: Trip_temperature_logsCountAggregateOutputType | null;
    _avg: Trip_temperature_logsAvgAggregateOutputType | null;
    _sum: Trip_temperature_logsSumAggregateOutputType | null;
    _min: Trip_temperature_logsMinAggregateOutputType | null;
    _max: Trip_temperature_logsMaxAggregateOutputType | null;
};
export type GetTrip_temperature_logsGroupByPayload<T extends trip_temperature_logsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Trip_temperature_logsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Trip_temperature_logsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Trip_temperature_logsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Trip_temperature_logsGroupByOutputType[P]>;
}>>;
export type trip_temperature_logsWhereInput = {
    AND?: Prisma.trip_temperature_logsWhereInput | Prisma.trip_temperature_logsWhereInput[];
    OR?: Prisma.trip_temperature_logsWhereInput[];
    NOT?: Prisma.trip_temperature_logsWhereInput | Prisma.trip_temperature_logsWhereInput[];
    id?: Prisma.UuidFilter<"trip_temperature_logs"> | string;
    trip_id?: Prisma.UuidFilter<"trip_temperature_logs"> | string;
    temperature?: Prisma.DecimalFilter<"trip_temperature_logs"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Prisma.DateTimeFilter<"trip_temperature_logs"> | Date | string;
    recorded_by?: Prisma.UuidNullableFilter<"trip_temperature_logs"> | string | null;
    users?: Prisma.XOR<Prisma.UsersNullableScalarRelationFilter, Prisma.usersWhereInput> | null;
    trips?: Prisma.XOR<Prisma.TripsScalarRelationFilter, Prisma.tripsWhereInput>;
};
export type trip_temperature_logsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    trip_id?: Prisma.SortOrder;
    temperature?: Prisma.SortOrder;
    recorded_at?: Prisma.SortOrder;
    recorded_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    users?: Prisma.usersOrderByWithRelationInput;
    trips?: Prisma.tripsOrderByWithRelationInput;
};
export type trip_temperature_logsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.trip_temperature_logsWhereInput | Prisma.trip_temperature_logsWhereInput[];
    OR?: Prisma.trip_temperature_logsWhereInput[];
    NOT?: Prisma.trip_temperature_logsWhereInput | Prisma.trip_temperature_logsWhereInput[];
    trip_id?: Prisma.UuidFilter<"trip_temperature_logs"> | string;
    temperature?: Prisma.DecimalFilter<"trip_temperature_logs"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Prisma.DateTimeFilter<"trip_temperature_logs"> | Date | string;
    recorded_by?: Prisma.UuidNullableFilter<"trip_temperature_logs"> | string | null;
    users?: Prisma.XOR<Prisma.UsersNullableScalarRelationFilter, Prisma.usersWhereInput> | null;
    trips?: Prisma.XOR<Prisma.TripsScalarRelationFilter, Prisma.tripsWhereInput>;
}, "id">;
export type trip_temperature_logsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    trip_id?: Prisma.SortOrder;
    temperature?: Prisma.SortOrder;
    recorded_at?: Prisma.SortOrder;
    recorded_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.trip_temperature_logsCountOrderByAggregateInput;
    _avg?: Prisma.trip_temperature_logsAvgOrderByAggregateInput;
    _max?: Prisma.trip_temperature_logsMaxOrderByAggregateInput;
    _min?: Prisma.trip_temperature_logsMinOrderByAggregateInput;
    _sum?: Prisma.trip_temperature_logsSumOrderByAggregateInput;
};
export type trip_temperature_logsScalarWhereWithAggregatesInput = {
    AND?: Prisma.trip_temperature_logsScalarWhereWithAggregatesInput | Prisma.trip_temperature_logsScalarWhereWithAggregatesInput[];
    OR?: Prisma.trip_temperature_logsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.trip_temperature_logsScalarWhereWithAggregatesInput | Prisma.trip_temperature_logsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"trip_temperature_logs"> | string;
    trip_id?: Prisma.UuidWithAggregatesFilter<"trip_temperature_logs"> | string;
    temperature?: Prisma.DecimalWithAggregatesFilter<"trip_temperature_logs"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Prisma.DateTimeWithAggregatesFilter<"trip_temperature_logs"> | Date | string;
    recorded_by?: Prisma.UuidNullableWithAggregatesFilter<"trip_temperature_logs"> | string | null;
};
export type trip_temperature_logsCreateInput = {
    id?: string;
    temperature: runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Date | string;
    users?: Prisma.usersCreateNestedOneWithoutTrip_temperature_logsInput;
    trips: Prisma.tripsCreateNestedOneWithoutTrip_temperature_logsInput;
};
export type trip_temperature_logsUncheckedCreateInput = {
    id?: string;
    trip_id: string;
    temperature: runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Date | string;
    recorded_by?: string | null;
};
export type trip_temperature_logsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    temperature?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.usersUpdateOneWithoutTrip_temperature_logsNestedInput;
    trips?: Prisma.tripsUpdateOneRequiredWithoutTrip_temperature_logsNestedInput;
};
export type trip_temperature_logsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trip_id?: Prisma.StringFieldUpdateOperationsInput | string;
    temperature?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recorded_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type trip_temperature_logsCreateManyInput = {
    id?: string;
    trip_id: string;
    temperature: runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Date | string;
    recorded_by?: string | null;
};
export type trip_temperature_logsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    temperature?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type trip_temperature_logsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trip_id?: Prisma.StringFieldUpdateOperationsInput | string;
    temperature?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recorded_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type trip_temperature_logsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    trip_id?: Prisma.SortOrder;
    temperature?: Prisma.SortOrder;
    recorded_at?: Prisma.SortOrder;
    recorded_by?: Prisma.SortOrder;
};
export type trip_temperature_logsAvgOrderByAggregateInput = {
    temperature?: Prisma.SortOrder;
};
export type trip_temperature_logsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    trip_id?: Prisma.SortOrder;
    temperature?: Prisma.SortOrder;
    recorded_at?: Prisma.SortOrder;
    recorded_by?: Prisma.SortOrder;
};
export type trip_temperature_logsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    trip_id?: Prisma.SortOrder;
    temperature?: Prisma.SortOrder;
    recorded_at?: Prisma.SortOrder;
    recorded_by?: Prisma.SortOrder;
};
export type trip_temperature_logsSumOrderByAggregateInput = {
    temperature?: Prisma.SortOrder;
};
export type Trip_temperature_logsListRelationFilter = {
    every?: Prisma.trip_temperature_logsWhereInput;
    some?: Prisma.trip_temperature_logsWhereInput;
    none?: Prisma.trip_temperature_logsWhereInput;
};
export type trip_temperature_logsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type trip_temperature_logsCreateNestedManyWithoutTripsInput = {
    create?: Prisma.XOR<Prisma.trip_temperature_logsCreateWithoutTripsInput, Prisma.trip_temperature_logsUncheckedCreateWithoutTripsInput> | Prisma.trip_temperature_logsCreateWithoutTripsInput[] | Prisma.trip_temperature_logsUncheckedCreateWithoutTripsInput[];
    connectOrCreate?: Prisma.trip_temperature_logsCreateOrConnectWithoutTripsInput | Prisma.trip_temperature_logsCreateOrConnectWithoutTripsInput[];
    createMany?: Prisma.trip_temperature_logsCreateManyTripsInputEnvelope;
    connect?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
};
export type trip_temperature_logsUncheckedCreateNestedManyWithoutTripsInput = {
    create?: Prisma.XOR<Prisma.trip_temperature_logsCreateWithoutTripsInput, Prisma.trip_temperature_logsUncheckedCreateWithoutTripsInput> | Prisma.trip_temperature_logsCreateWithoutTripsInput[] | Prisma.trip_temperature_logsUncheckedCreateWithoutTripsInput[];
    connectOrCreate?: Prisma.trip_temperature_logsCreateOrConnectWithoutTripsInput | Prisma.trip_temperature_logsCreateOrConnectWithoutTripsInput[];
    createMany?: Prisma.trip_temperature_logsCreateManyTripsInputEnvelope;
    connect?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
};
export type trip_temperature_logsUpdateManyWithoutTripsNestedInput = {
    create?: Prisma.XOR<Prisma.trip_temperature_logsCreateWithoutTripsInput, Prisma.trip_temperature_logsUncheckedCreateWithoutTripsInput> | Prisma.trip_temperature_logsCreateWithoutTripsInput[] | Prisma.trip_temperature_logsUncheckedCreateWithoutTripsInput[];
    connectOrCreate?: Prisma.trip_temperature_logsCreateOrConnectWithoutTripsInput | Prisma.trip_temperature_logsCreateOrConnectWithoutTripsInput[];
    upsert?: Prisma.trip_temperature_logsUpsertWithWhereUniqueWithoutTripsInput | Prisma.trip_temperature_logsUpsertWithWhereUniqueWithoutTripsInput[];
    createMany?: Prisma.trip_temperature_logsCreateManyTripsInputEnvelope;
    set?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    disconnect?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    delete?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    connect?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    update?: Prisma.trip_temperature_logsUpdateWithWhereUniqueWithoutTripsInput | Prisma.trip_temperature_logsUpdateWithWhereUniqueWithoutTripsInput[];
    updateMany?: Prisma.trip_temperature_logsUpdateManyWithWhereWithoutTripsInput | Prisma.trip_temperature_logsUpdateManyWithWhereWithoutTripsInput[];
    deleteMany?: Prisma.trip_temperature_logsScalarWhereInput | Prisma.trip_temperature_logsScalarWhereInput[];
};
export type trip_temperature_logsUncheckedUpdateManyWithoutTripsNestedInput = {
    create?: Prisma.XOR<Prisma.trip_temperature_logsCreateWithoutTripsInput, Prisma.trip_temperature_logsUncheckedCreateWithoutTripsInput> | Prisma.trip_temperature_logsCreateWithoutTripsInput[] | Prisma.trip_temperature_logsUncheckedCreateWithoutTripsInput[];
    connectOrCreate?: Prisma.trip_temperature_logsCreateOrConnectWithoutTripsInput | Prisma.trip_temperature_logsCreateOrConnectWithoutTripsInput[];
    upsert?: Prisma.trip_temperature_logsUpsertWithWhereUniqueWithoutTripsInput | Prisma.trip_temperature_logsUpsertWithWhereUniqueWithoutTripsInput[];
    createMany?: Prisma.trip_temperature_logsCreateManyTripsInputEnvelope;
    set?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    disconnect?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    delete?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    connect?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    update?: Prisma.trip_temperature_logsUpdateWithWhereUniqueWithoutTripsInput | Prisma.trip_temperature_logsUpdateWithWhereUniqueWithoutTripsInput[];
    updateMany?: Prisma.trip_temperature_logsUpdateManyWithWhereWithoutTripsInput | Prisma.trip_temperature_logsUpdateManyWithWhereWithoutTripsInput[];
    deleteMany?: Prisma.trip_temperature_logsScalarWhereInput | Prisma.trip_temperature_logsScalarWhereInput[];
};
export type trip_temperature_logsCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.trip_temperature_logsCreateWithoutUsersInput, Prisma.trip_temperature_logsUncheckedCreateWithoutUsersInput> | Prisma.trip_temperature_logsCreateWithoutUsersInput[] | Prisma.trip_temperature_logsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.trip_temperature_logsCreateOrConnectWithoutUsersInput | Prisma.trip_temperature_logsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.trip_temperature_logsCreateManyUsersInputEnvelope;
    connect?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
};
export type trip_temperature_logsUncheckedCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.trip_temperature_logsCreateWithoutUsersInput, Prisma.trip_temperature_logsUncheckedCreateWithoutUsersInput> | Prisma.trip_temperature_logsCreateWithoutUsersInput[] | Prisma.trip_temperature_logsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.trip_temperature_logsCreateOrConnectWithoutUsersInput | Prisma.trip_temperature_logsCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.trip_temperature_logsCreateManyUsersInputEnvelope;
    connect?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
};
export type trip_temperature_logsUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.trip_temperature_logsCreateWithoutUsersInput, Prisma.trip_temperature_logsUncheckedCreateWithoutUsersInput> | Prisma.trip_temperature_logsCreateWithoutUsersInput[] | Prisma.trip_temperature_logsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.trip_temperature_logsCreateOrConnectWithoutUsersInput | Prisma.trip_temperature_logsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.trip_temperature_logsUpsertWithWhereUniqueWithoutUsersInput | Prisma.trip_temperature_logsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.trip_temperature_logsCreateManyUsersInputEnvelope;
    set?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    disconnect?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    delete?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    connect?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    update?: Prisma.trip_temperature_logsUpdateWithWhereUniqueWithoutUsersInput | Prisma.trip_temperature_logsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.trip_temperature_logsUpdateManyWithWhereWithoutUsersInput | Prisma.trip_temperature_logsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.trip_temperature_logsScalarWhereInput | Prisma.trip_temperature_logsScalarWhereInput[];
};
export type trip_temperature_logsUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.trip_temperature_logsCreateWithoutUsersInput, Prisma.trip_temperature_logsUncheckedCreateWithoutUsersInput> | Prisma.trip_temperature_logsCreateWithoutUsersInput[] | Prisma.trip_temperature_logsUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.trip_temperature_logsCreateOrConnectWithoutUsersInput | Prisma.trip_temperature_logsCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.trip_temperature_logsUpsertWithWhereUniqueWithoutUsersInput | Prisma.trip_temperature_logsUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.trip_temperature_logsCreateManyUsersInputEnvelope;
    set?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    disconnect?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    delete?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    connect?: Prisma.trip_temperature_logsWhereUniqueInput | Prisma.trip_temperature_logsWhereUniqueInput[];
    update?: Prisma.trip_temperature_logsUpdateWithWhereUniqueWithoutUsersInput | Prisma.trip_temperature_logsUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.trip_temperature_logsUpdateManyWithWhereWithoutUsersInput | Prisma.trip_temperature_logsUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.trip_temperature_logsScalarWhereInput | Prisma.trip_temperature_logsScalarWhereInput[];
};
export type trip_temperature_logsCreateWithoutTripsInput = {
    id?: string;
    temperature: runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Date | string;
    users?: Prisma.usersCreateNestedOneWithoutTrip_temperature_logsInput;
};
export type trip_temperature_logsUncheckedCreateWithoutTripsInput = {
    id?: string;
    temperature: runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Date | string;
    recorded_by?: string | null;
};
export type trip_temperature_logsCreateOrConnectWithoutTripsInput = {
    where: Prisma.trip_temperature_logsWhereUniqueInput;
    create: Prisma.XOR<Prisma.trip_temperature_logsCreateWithoutTripsInput, Prisma.trip_temperature_logsUncheckedCreateWithoutTripsInput>;
};
export type trip_temperature_logsCreateManyTripsInputEnvelope = {
    data: Prisma.trip_temperature_logsCreateManyTripsInput | Prisma.trip_temperature_logsCreateManyTripsInput[];
    skipDuplicates?: boolean;
};
export type trip_temperature_logsUpsertWithWhereUniqueWithoutTripsInput = {
    where: Prisma.trip_temperature_logsWhereUniqueInput;
    update: Prisma.XOR<Prisma.trip_temperature_logsUpdateWithoutTripsInput, Prisma.trip_temperature_logsUncheckedUpdateWithoutTripsInput>;
    create: Prisma.XOR<Prisma.trip_temperature_logsCreateWithoutTripsInput, Prisma.trip_temperature_logsUncheckedCreateWithoutTripsInput>;
};
export type trip_temperature_logsUpdateWithWhereUniqueWithoutTripsInput = {
    where: Prisma.trip_temperature_logsWhereUniqueInput;
    data: Prisma.XOR<Prisma.trip_temperature_logsUpdateWithoutTripsInput, Prisma.trip_temperature_logsUncheckedUpdateWithoutTripsInput>;
};
export type trip_temperature_logsUpdateManyWithWhereWithoutTripsInput = {
    where: Prisma.trip_temperature_logsScalarWhereInput;
    data: Prisma.XOR<Prisma.trip_temperature_logsUpdateManyMutationInput, Prisma.trip_temperature_logsUncheckedUpdateManyWithoutTripsInput>;
};
export type trip_temperature_logsScalarWhereInput = {
    AND?: Prisma.trip_temperature_logsScalarWhereInput | Prisma.trip_temperature_logsScalarWhereInput[];
    OR?: Prisma.trip_temperature_logsScalarWhereInput[];
    NOT?: Prisma.trip_temperature_logsScalarWhereInput | Prisma.trip_temperature_logsScalarWhereInput[];
    id?: Prisma.UuidFilter<"trip_temperature_logs"> | string;
    trip_id?: Prisma.UuidFilter<"trip_temperature_logs"> | string;
    temperature?: Prisma.DecimalFilter<"trip_temperature_logs"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Prisma.DateTimeFilter<"trip_temperature_logs"> | Date | string;
    recorded_by?: Prisma.UuidNullableFilter<"trip_temperature_logs"> | string | null;
};
export type trip_temperature_logsCreateWithoutUsersInput = {
    id?: string;
    temperature: runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Date | string;
    trips: Prisma.tripsCreateNestedOneWithoutTrip_temperature_logsInput;
};
export type trip_temperature_logsUncheckedCreateWithoutUsersInput = {
    id?: string;
    trip_id: string;
    temperature: runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Date | string;
};
export type trip_temperature_logsCreateOrConnectWithoutUsersInput = {
    where: Prisma.trip_temperature_logsWhereUniqueInput;
    create: Prisma.XOR<Prisma.trip_temperature_logsCreateWithoutUsersInput, Prisma.trip_temperature_logsUncheckedCreateWithoutUsersInput>;
};
export type trip_temperature_logsCreateManyUsersInputEnvelope = {
    data: Prisma.trip_temperature_logsCreateManyUsersInput | Prisma.trip_temperature_logsCreateManyUsersInput[];
    skipDuplicates?: boolean;
};
export type trip_temperature_logsUpsertWithWhereUniqueWithoutUsersInput = {
    where: Prisma.trip_temperature_logsWhereUniqueInput;
    update: Prisma.XOR<Prisma.trip_temperature_logsUpdateWithoutUsersInput, Prisma.trip_temperature_logsUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.trip_temperature_logsCreateWithoutUsersInput, Prisma.trip_temperature_logsUncheckedCreateWithoutUsersInput>;
};
export type trip_temperature_logsUpdateWithWhereUniqueWithoutUsersInput = {
    where: Prisma.trip_temperature_logsWhereUniqueInput;
    data: Prisma.XOR<Prisma.trip_temperature_logsUpdateWithoutUsersInput, Prisma.trip_temperature_logsUncheckedUpdateWithoutUsersInput>;
};
export type trip_temperature_logsUpdateManyWithWhereWithoutUsersInput = {
    where: Prisma.trip_temperature_logsScalarWhereInput;
    data: Prisma.XOR<Prisma.trip_temperature_logsUpdateManyMutationInput, Prisma.trip_temperature_logsUncheckedUpdateManyWithoutUsersInput>;
};
export type trip_temperature_logsCreateManyTripsInput = {
    id?: string;
    temperature: runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Date | string;
    recorded_by?: string | null;
};
export type trip_temperature_logsUpdateWithoutTripsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    temperature?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.usersUpdateOneWithoutTrip_temperature_logsNestedInput;
};
export type trip_temperature_logsUncheckedUpdateWithoutTripsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    temperature?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recorded_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type trip_temperature_logsUncheckedUpdateManyWithoutTripsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    temperature?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recorded_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type trip_temperature_logsCreateManyUsersInput = {
    id?: string;
    trip_id: string;
    temperature: runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Date | string;
};
export type trip_temperature_logsUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    temperature?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trips?: Prisma.tripsUpdateOneRequiredWithoutTrip_temperature_logsNestedInput;
};
export type trip_temperature_logsUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trip_id?: Prisma.StringFieldUpdateOperationsInput | string;
    temperature?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type trip_temperature_logsUncheckedUpdateManyWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    trip_id?: Prisma.StringFieldUpdateOperationsInput | string;
    temperature?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    recorded_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type trip_temperature_logsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    trip_id?: boolean;
    temperature?: boolean;
    recorded_at?: boolean;
    recorded_by?: boolean;
    users?: boolean | Prisma.trip_temperature_logs$usersArgs<ExtArgs>;
    trips?: boolean | Prisma.tripsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["trip_temperature_logs"]>;
export type trip_temperature_logsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    trip_id?: boolean;
    temperature?: boolean;
    recorded_at?: boolean;
    recorded_by?: boolean;
    users?: boolean | Prisma.trip_temperature_logs$usersArgs<ExtArgs>;
    trips?: boolean | Prisma.tripsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["trip_temperature_logs"]>;
export type trip_temperature_logsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    trip_id?: boolean;
    temperature?: boolean;
    recorded_at?: boolean;
    recorded_by?: boolean;
    users?: boolean | Prisma.trip_temperature_logs$usersArgs<ExtArgs>;
    trips?: boolean | Prisma.tripsDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["trip_temperature_logs"]>;
export type trip_temperature_logsSelectScalar = {
    id?: boolean;
    trip_id?: boolean;
    temperature?: boolean;
    recorded_at?: boolean;
    recorded_by?: boolean;
};
export type trip_temperature_logsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "trip_id" | "temperature" | "recorded_at" | "recorded_by", ExtArgs["result"]["trip_temperature_logs"]>;
export type trip_temperature_logsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.trip_temperature_logs$usersArgs<ExtArgs>;
    trips?: boolean | Prisma.tripsDefaultArgs<ExtArgs>;
};
export type trip_temperature_logsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.trip_temperature_logs$usersArgs<ExtArgs>;
    trips?: boolean | Prisma.tripsDefaultArgs<ExtArgs>;
};
export type trip_temperature_logsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.trip_temperature_logs$usersArgs<ExtArgs>;
    trips?: boolean | Prisma.tripsDefaultArgs<ExtArgs>;
};
export type $trip_temperature_logsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "trip_temperature_logs";
    objects: {
        users: Prisma.$usersPayload<ExtArgs> | null;
        trips: Prisma.$tripsPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        trip_id: string;
        temperature: runtime.Decimal;
        recorded_at: Date;
        recorded_by: string | null;
    }, ExtArgs["result"]["trip_temperature_logs"]>;
    composites: {};
};
export type trip_temperature_logsGetPayload<S extends boolean | null | undefined | trip_temperature_logsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$trip_temperature_logsPayload, S>;
export type trip_temperature_logsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<trip_temperature_logsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Trip_temperature_logsCountAggregateInputType | true;
};
export interface trip_temperature_logsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['trip_temperature_logs'];
        meta: {
            name: 'trip_temperature_logs';
        };
    };
    findUnique<T extends trip_temperature_logsFindUniqueArgs>(args: Prisma.SelectSubset<T, trip_temperature_logsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__trip_temperature_logsClient<runtime.Types.Result.GetResult<Prisma.$trip_temperature_logsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends trip_temperature_logsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, trip_temperature_logsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__trip_temperature_logsClient<runtime.Types.Result.GetResult<Prisma.$trip_temperature_logsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends trip_temperature_logsFindFirstArgs>(args?: Prisma.SelectSubset<T, trip_temperature_logsFindFirstArgs<ExtArgs>>): Prisma.Prisma__trip_temperature_logsClient<runtime.Types.Result.GetResult<Prisma.$trip_temperature_logsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends trip_temperature_logsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, trip_temperature_logsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__trip_temperature_logsClient<runtime.Types.Result.GetResult<Prisma.$trip_temperature_logsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends trip_temperature_logsFindManyArgs>(args?: Prisma.SelectSubset<T, trip_temperature_logsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$trip_temperature_logsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends trip_temperature_logsCreateArgs>(args: Prisma.SelectSubset<T, trip_temperature_logsCreateArgs<ExtArgs>>): Prisma.Prisma__trip_temperature_logsClient<runtime.Types.Result.GetResult<Prisma.$trip_temperature_logsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends trip_temperature_logsCreateManyArgs>(args?: Prisma.SelectSubset<T, trip_temperature_logsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends trip_temperature_logsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, trip_temperature_logsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$trip_temperature_logsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends trip_temperature_logsDeleteArgs>(args: Prisma.SelectSubset<T, trip_temperature_logsDeleteArgs<ExtArgs>>): Prisma.Prisma__trip_temperature_logsClient<runtime.Types.Result.GetResult<Prisma.$trip_temperature_logsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends trip_temperature_logsUpdateArgs>(args: Prisma.SelectSubset<T, trip_temperature_logsUpdateArgs<ExtArgs>>): Prisma.Prisma__trip_temperature_logsClient<runtime.Types.Result.GetResult<Prisma.$trip_temperature_logsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends trip_temperature_logsDeleteManyArgs>(args?: Prisma.SelectSubset<T, trip_temperature_logsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends trip_temperature_logsUpdateManyArgs>(args: Prisma.SelectSubset<T, trip_temperature_logsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends trip_temperature_logsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, trip_temperature_logsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$trip_temperature_logsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends trip_temperature_logsUpsertArgs>(args: Prisma.SelectSubset<T, trip_temperature_logsUpsertArgs<ExtArgs>>): Prisma.Prisma__trip_temperature_logsClient<runtime.Types.Result.GetResult<Prisma.$trip_temperature_logsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends trip_temperature_logsCountArgs>(args?: Prisma.Subset<T, trip_temperature_logsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Trip_temperature_logsCountAggregateOutputType> : number>;
    aggregate<T extends Trip_temperature_logsAggregateArgs>(args: Prisma.Subset<T, Trip_temperature_logsAggregateArgs>): Prisma.PrismaPromise<GetTrip_temperature_logsAggregateType<T>>;
    groupBy<T extends trip_temperature_logsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: trip_temperature_logsGroupByArgs['orderBy'];
    } : {
        orderBy?: trip_temperature_logsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, trip_temperature_logsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrip_temperature_logsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: trip_temperature_logsFieldRefs;
}
export interface Prisma__trip_temperature_logsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.trip_temperature_logs$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.trip_temperature_logs$usersArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    trips<T extends Prisma.tripsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.tripsDefaultArgs<ExtArgs>>): Prisma.Prisma__tripsClient<runtime.Types.Result.GetResult<Prisma.$tripsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface trip_temperature_logsFieldRefs {
    readonly id: Prisma.FieldRef<"trip_temperature_logs", 'String'>;
    readonly trip_id: Prisma.FieldRef<"trip_temperature_logs", 'String'>;
    readonly temperature: Prisma.FieldRef<"trip_temperature_logs", 'Decimal'>;
    readonly recorded_at: Prisma.FieldRef<"trip_temperature_logs", 'DateTime'>;
    readonly recorded_by: Prisma.FieldRef<"trip_temperature_logs", 'String'>;
}
export type trip_temperature_logsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_temperature_logsSelect<ExtArgs> | null;
    omit?: Prisma.trip_temperature_logsOmit<ExtArgs> | null;
    include?: Prisma.trip_temperature_logsInclude<ExtArgs> | null;
    where: Prisma.trip_temperature_logsWhereUniqueInput;
};
export type trip_temperature_logsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_temperature_logsSelect<ExtArgs> | null;
    omit?: Prisma.trip_temperature_logsOmit<ExtArgs> | null;
    include?: Prisma.trip_temperature_logsInclude<ExtArgs> | null;
    where: Prisma.trip_temperature_logsWhereUniqueInput;
};
export type trip_temperature_logsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_temperature_logsSelect<ExtArgs> | null;
    omit?: Prisma.trip_temperature_logsOmit<ExtArgs> | null;
    include?: Prisma.trip_temperature_logsInclude<ExtArgs> | null;
    where?: Prisma.trip_temperature_logsWhereInput;
    orderBy?: Prisma.trip_temperature_logsOrderByWithRelationInput | Prisma.trip_temperature_logsOrderByWithRelationInput[];
    cursor?: Prisma.trip_temperature_logsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Trip_temperature_logsScalarFieldEnum | Prisma.Trip_temperature_logsScalarFieldEnum[];
};
export type trip_temperature_logsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_temperature_logsSelect<ExtArgs> | null;
    omit?: Prisma.trip_temperature_logsOmit<ExtArgs> | null;
    include?: Prisma.trip_temperature_logsInclude<ExtArgs> | null;
    where?: Prisma.trip_temperature_logsWhereInput;
    orderBy?: Prisma.trip_temperature_logsOrderByWithRelationInput | Prisma.trip_temperature_logsOrderByWithRelationInput[];
    cursor?: Prisma.trip_temperature_logsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Trip_temperature_logsScalarFieldEnum | Prisma.Trip_temperature_logsScalarFieldEnum[];
};
export type trip_temperature_logsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_temperature_logsSelect<ExtArgs> | null;
    omit?: Prisma.trip_temperature_logsOmit<ExtArgs> | null;
    include?: Prisma.trip_temperature_logsInclude<ExtArgs> | null;
    where?: Prisma.trip_temperature_logsWhereInput;
    orderBy?: Prisma.trip_temperature_logsOrderByWithRelationInput | Prisma.trip_temperature_logsOrderByWithRelationInput[];
    cursor?: Prisma.trip_temperature_logsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Trip_temperature_logsScalarFieldEnum | Prisma.Trip_temperature_logsScalarFieldEnum[];
};
export type trip_temperature_logsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_temperature_logsSelect<ExtArgs> | null;
    omit?: Prisma.trip_temperature_logsOmit<ExtArgs> | null;
    include?: Prisma.trip_temperature_logsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.trip_temperature_logsCreateInput, Prisma.trip_temperature_logsUncheckedCreateInput>;
};
export type trip_temperature_logsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.trip_temperature_logsCreateManyInput | Prisma.trip_temperature_logsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type trip_temperature_logsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_temperature_logsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.trip_temperature_logsOmit<ExtArgs> | null;
    data: Prisma.trip_temperature_logsCreateManyInput | Prisma.trip_temperature_logsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.trip_temperature_logsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type trip_temperature_logsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_temperature_logsSelect<ExtArgs> | null;
    omit?: Prisma.trip_temperature_logsOmit<ExtArgs> | null;
    include?: Prisma.trip_temperature_logsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.trip_temperature_logsUpdateInput, Prisma.trip_temperature_logsUncheckedUpdateInput>;
    where: Prisma.trip_temperature_logsWhereUniqueInput;
};
export type trip_temperature_logsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.trip_temperature_logsUpdateManyMutationInput, Prisma.trip_temperature_logsUncheckedUpdateManyInput>;
    where?: Prisma.trip_temperature_logsWhereInput;
    limit?: number;
};
export type trip_temperature_logsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_temperature_logsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.trip_temperature_logsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.trip_temperature_logsUpdateManyMutationInput, Prisma.trip_temperature_logsUncheckedUpdateManyInput>;
    where?: Prisma.trip_temperature_logsWhereInput;
    limit?: number;
    include?: Prisma.trip_temperature_logsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type trip_temperature_logsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_temperature_logsSelect<ExtArgs> | null;
    omit?: Prisma.trip_temperature_logsOmit<ExtArgs> | null;
    include?: Prisma.trip_temperature_logsInclude<ExtArgs> | null;
    where: Prisma.trip_temperature_logsWhereUniqueInput;
    create: Prisma.XOR<Prisma.trip_temperature_logsCreateInput, Prisma.trip_temperature_logsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.trip_temperature_logsUpdateInput, Prisma.trip_temperature_logsUncheckedUpdateInput>;
};
export type trip_temperature_logsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_temperature_logsSelect<ExtArgs> | null;
    omit?: Prisma.trip_temperature_logsOmit<ExtArgs> | null;
    include?: Prisma.trip_temperature_logsInclude<ExtArgs> | null;
    where: Prisma.trip_temperature_logsWhereUniqueInput;
};
export type trip_temperature_logsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.trip_temperature_logsWhereInput;
    limit?: number;
};
export type trip_temperature_logs$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
    where?: Prisma.usersWhereInput;
};
export type trip_temperature_logsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.trip_temperature_logsSelect<ExtArgs> | null;
    omit?: Prisma.trip_temperature_logsOmit<ExtArgs> | null;
    include?: Prisma.trip_temperature_logsInclude<ExtArgs> | null;
};
