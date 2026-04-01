import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type party_locationsModel = runtime.Types.Result.DefaultSelection<Prisma.$party_locationsPayload>;
export type AggregateParty_locations = {
    _count: Party_locationsCountAggregateOutputType | null;
    _min: Party_locationsMinAggregateOutputType | null;
    _max: Party_locationsMaxAggregateOutputType | null;
};
export type Party_locationsMinAggregateOutputType = {
    id: string | null;
    party_id: string | null;
    location_id: string | null;
    label: string | null;
    created_at: Date | null;
};
export type Party_locationsMaxAggregateOutputType = {
    id: string | null;
    party_id: string | null;
    location_id: string | null;
    label: string | null;
    created_at: Date | null;
};
export type Party_locationsCountAggregateOutputType = {
    id: number;
    party_id: number;
    location_id: number;
    label: number;
    created_at: number;
    _all: number;
};
export type Party_locationsMinAggregateInputType = {
    id?: true;
    party_id?: true;
    location_id?: true;
    label?: true;
    created_at?: true;
};
export type Party_locationsMaxAggregateInputType = {
    id?: true;
    party_id?: true;
    location_id?: true;
    label?: true;
    created_at?: true;
};
export type Party_locationsCountAggregateInputType = {
    id?: true;
    party_id?: true;
    location_id?: true;
    label?: true;
    created_at?: true;
    _all?: true;
};
export type Party_locationsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.party_locationsWhereInput;
    orderBy?: Prisma.party_locationsOrderByWithRelationInput | Prisma.party_locationsOrderByWithRelationInput[];
    cursor?: Prisma.party_locationsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Party_locationsCountAggregateInputType;
    _min?: Party_locationsMinAggregateInputType;
    _max?: Party_locationsMaxAggregateInputType;
};
export type GetParty_locationsAggregateType<T extends Party_locationsAggregateArgs> = {
    [P in keyof T & keyof AggregateParty_locations]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateParty_locations[P]> : Prisma.GetScalarType<T[P], AggregateParty_locations[P]>;
};
export type party_locationsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.party_locationsWhereInput;
    orderBy?: Prisma.party_locationsOrderByWithAggregationInput | Prisma.party_locationsOrderByWithAggregationInput[];
    by: Prisma.Party_locationsScalarFieldEnum[] | Prisma.Party_locationsScalarFieldEnum;
    having?: Prisma.party_locationsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Party_locationsCountAggregateInputType | true;
    _min?: Party_locationsMinAggregateInputType;
    _max?: Party_locationsMaxAggregateInputType;
};
export type Party_locationsGroupByOutputType = {
    id: string;
    party_id: string;
    location_id: string;
    label: string | null;
    created_at: Date;
    _count: Party_locationsCountAggregateOutputType | null;
    _min: Party_locationsMinAggregateOutputType | null;
    _max: Party_locationsMaxAggregateOutputType | null;
};
export type GetParty_locationsGroupByPayload<T extends party_locationsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Party_locationsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Party_locationsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Party_locationsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Party_locationsGroupByOutputType[P]>;
}>>;
export type party_locationsWhereInput = {
    AND?: Prisma.party_locationsWhereInput | Prisma.party_locationsWhereInput[];
    OR?: Prisma.party_locationsWhereInput[];
    NOT?: Prisma.party_locationsWhereInput | Prisma.party_locationsWhereInput[];
    id?: Prisma.UuidFilter<"party_locations"> | string;
    party_id?: Prisma.UuidFilter<"party_locations"> | string;
    location_id?: Prisma.UuidFilter<"party_locations"> | string;
    label?: Prisma.StringNullableFilter<"party_locations"> | string | null;
    created_at?: Prisma.DateTimeFilter<"party_locations"> | Date | string;
    locations?: Prisma.XOR<Prisma.LocationsScalarRelationFilter, Prisma.locationsWhereInput>;
    business_parties?: Prisma.XOR<Prisma.Business_partiesScalarRelationFilter, Prisma.business_partiesWhereInput>;
};
export type party_locationsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    label?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    locations?: Prisma.locationsOrderByWithRelationInput;
    business_parties?: Prisma.business_partiesOrderByWithRelationInput;
};
export type party_locationsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.party_locationsWhereInput | Prisma.party_locationsWhereInput[];
    OR?: Prisma.party_locationsWhereInput[];
    NOT?: Prisma.party_locationsWhereInput | Prisma.party_locationsWhereInput[];
    party_id?: Prisma.UuidFilter<"party_locations"> | string;
    location_id?: Prisma.UuidFilter<"party_locations"> | string;
    label?: Prisma.StringNullableFilter<"party_locations"> | string | null;
    created_at?: Prisma.DateTimeFilter<"party_locations"> | Date | string;
    locations?: Prisma.XOR<Prisma.LocationsScalarRelationFilter, Prisma.locationsWhereInput>;
    business_parties?: Prisma.XOR<Prisma.Business_partiesScalarRelationFilter, Prisma.business_partiesWhereInput>;
}, "id">;
export type party_locationsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    label?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.party_locationsCountOrderByAggregateInput;
    _max?: Prisma.party_locationsMaxOrderByAggregateInput;
    _min?: Prisma.party_locationsMinOrderByAggregateInput;
};
export type party_locationsScalarWhereWithAggregatesInput = {
    AND?: Prisma.party_locationsScalarWhereWithAggregatesInput | Prisma.party_locationsScalarWhereWithAggregatesInput[];
    OR?: Prisma.party_locationsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.party_locationsScalarWhereWithAggregatesInput | Prisma.party_locationsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"party_locations"> | string;
    party_id?: Prisma.UuidWithAggregatesFilter<"party_locations"> | string;
    location_id?: Prisma.UuidWithAggregatesFilter<"party_locations"> | string;
    label?: Prisma.StringNullableWithAggregatesFilter<"party_locations"> | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"party_locations"> | Date | string;
};
export type party_locationsCreateInput = {
    id?: string;
    label?: string | null;
    created_at?: Date | string;
    locations: Prisma.locationsCreateNestedOneWithoutParty_locationsInput;
    business_parties: Prisma.business_partiesCreateNestedOneWithoutParty_locationsInput;
};
export type party_locationsUncheckedCreateInput = {
    id?: string;
    party_id: string;
    location_id: string;
    label?: string | null;
    created_at?: Date | string;
};
export type party_locationsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    locations?: Prisma.locationsUpdateOneRequiredWithoutParty_locationsNestedInput;
    business_parties?: Prisma.business_partiesUpdateOneRequiredWithoutParty_locationsNestedInput;
};
export type party_locationsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    party_id?: Prisma.StringFieldUpdateOperationsInput | string;
    location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type party_locationsCreateManyInput = {
    id?: string;
    party_id: string;
    location_id: string;
    label?: string | null;
    created_at?: Date | string;
};
export type party_locationsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type party_locationsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    party_id?: Prisma.StringFieldUpdateOperationsInput | string;
    location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type Party_locationsListRelationFilter = {
    every?: Prisma.party_locationsWhereInput;
    some?: Prisma.party_locationsWhereInput;
    none?: Prisma.party_locationsWhereInput;
};
export type party_locationsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type party_locationsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type party_locationsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type party_locationsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrder;
    location_id?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type party_locationsCreateNestedManyWithoutBusiness_partiesInput = {
    create?: Prisma.XOR<Prisma.party_locationsCreateWithoutBusiness_partiesInput, Prisma.party_locationsUncheckedCreateWithoutBusiness_partiesInput> | Prisma.party_locationsCreateWithoutBusiness_partiesInput[] | Prisma.party_locationsUncheckedCreateWithoutBusiness_partiesInput[];
    connectOrCreate?: Prisma.party_locationsCreateOrConnectWithoutBusiness_partiesInput | Prisma.party_locationsCreateOrConnectWithoutBusiness_partiesInput[];
    createMany?: Prisma.party_locationsCreateManyBusiness_partiesInputEnvelope;
    connect?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
};
export type party_locationsUncheckedCreateNestedManyWithoutBusiness_partiesInput = {
    create?: Prisma.XOR<Prisma.party_locationsCreateWithoutBusiness_partiesInput, Prisma.party_locationsUncheckedCreateWithoutBusiness_partiesInput> | Prisma.party_locationsCreateWithoutBusiness_partiesInput[] | Prisma.party_locationsUncheckedCreateWithoutBusiness_partiesInput[];
    connectOrCreate?: Prisma.party_locationsCreateOrConnectWithoutBusiness_partiesInput | Prisma.party_locationsCreateOrConnectWithoutBusiness_partiesInput[];
    createMany?: Prisma.party_locationsCreateManyBusiness_partiesInputEnvelope;
    connect?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
};
export type party_locationsUpdateManyWithoutBusiness_partiesNestedInput = {
    create?: Prisma.XOR<Prisma.party_locationsCreateWithoutBusiness_partiesInput, Prisma.party_locationsUncheckedCreateWithoutBusiness_partiesInput> | Prisma.party_locationsCreateWithoutBusiness_partiesInput[] | Prisma.party_locationsUncheckedCreateWithoutBusiness_partiesInput[];
    connectOrCreate?: Prisma.party_locationsCreateOrConnectWithoutBusiness_partiesInput | Prisma.party_locationsCreateOrConnectWithoutBusiness_partiesInput[];
    upsert?: Prisma.party_locationsUpsertWithWhereUniqueWithoutBusiness_partiesInput | Prisma.party_locationsUpsertWithWhereUniqueWithoutBusiness_partiesInput[];
    createMany?: Prisma.party_locationsCreateManyBusiness_partiesInputEnvelope;
    set?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    disconnect?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    delete?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    connect?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    update?: Prisma.party_locationsUpdateWithWhereUniqueWithoutBusiness_partiesInput | Prisma.party_locationsUpdateWithWhereUniqueWithoutBusiness_partiesInput[];
    updateMany?: Prisma.party_locationsUpdateManyWithWhereWithoutBusiness_partiesInput | Prisma.party_locationsUpdateManyWithWhereWithoutBusiness_partiesInput[];
    deleteMany?: Prisma.party_locationsScalarWhereInput | Prisma.party_locationsScalarWhereInput[];
};
export type party_locationsUncheckedUpdateManyWithoutBusiness_partiesNestedInput = {
    create?: Prisma.XOR<Prisma.party_locationsCreateWithoutBusiness_partiesInput, Prisma.party_locationsUncheckedCreateWithoutBusiness_partiesInput> | Prisma.party_locationsCreateWithoutBusiness_partiesInput[] | Prisma.party_locationsUncheckedCreateWithoutBusiness_partiesInput[];
    connectOrCreate?: Prisma.party_locationsCreateOrConnectWithoutBusiness_partiesInput | Prisma.party_locationsCreateOrConnectWithoutBusiness_partiesInput[];
    upsert?: Prisma.party_locationsUpsertWithWhereUniqueWithoutBusiness_partiesInput | Prisma.party_locationsUpsertWithWhereUniqueWithoutBusiness_partiesInput[];
    createMany?: Prisma.party_locationsCreateManyBusiness_partiesInputEnvelope;
    set?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    disconnect?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    delete?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    connect?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    update?: Prisma.party_locationsUpdateWithWhereUniqueWithoutBusiness_partiesInput | Prisma.party_locationsUpdateWithWhereUniqueWithoutBusiness_partiesInput[];
    updateMany?: Prisma.party_locationsUpdateManyWithWhereWithoutBusiness_partiesInput | Prisma.party_locationsUpdateManyWithWhereWithoutBusiness_partiesInput[];
    deleteMany?: Prisma.party_locationsScalarWhereInput | Prisma.party_locationsScalarWhereInput[];
};
export type party_locationsCreateNestedManyWithoutLocationsInput = {
    create?: Prisma.XOR<Prisma.party_locationsCreateWithoutLocationsInput, Prisma.party_locationsUncheckedCreateWithoutLocationsInput> | Prisma.party_locationsCreateWithoutLocationsInput[] | Prisma.party_locationsUncheckedCreateWithoutLocationsInput[];
    connectOrCreate?: Prisma.party_locationsCreateOrConnectWithoutLocationsInput | Prisma.party_locationsCreateOrConnectWithoutLocationsInput[];
    createMany?: Prisma.party_locationsCreateManyLocationsInputEnvelope;
    connect?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
};
export type party_locationsUncheckedCreateNestedManyWithoutLocationsInput = {
    create?: Prisma.XOR<Prisma.party_locationsCreateWithoutLocationsInput, Prisma.party_locationsUncheckedCreateWithoutLocationsInput> | Prisma.party_locationsCreateWithoutLocationsInput[] | Prisma.party_locationsUncheckedCreateWithoutLocationsInput[];
    connectOrCreate?: Prisma.party_locationsCreateOrConnectWithoutLocationsInput | Prisma.party_locationsCreateOrConnectWithoutLocationsInput[];
    createMany?: Prisma.party_locationsCreateManyLocationsInputEnvelope;
    connect?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
};
export type party_locationsUpdateManyWithoutLocationsNestedInput = {
    create?: Prisma.XOR<Prisma.party_locationsCreateWithoutLocationsInput, Prisma.party_locationsUncheckedCreateWithoutLocationsInput> | Prisma.party_locationsCreateWithoutLocationsInput[] | Prisma.party_locationsUncheckedCreateWithoutLocationsInput[];
    connectOrCreate?: Prisma.party_locationsCreateOrConnectWithoutLocationsInput | Prisma.party_locationsCreateOrConnectWithoutLocationsInput[];
    upsert?: Prisma.party_locationsUpsertWithWhereUniqueWithoutLocationsInput | Prisma.party_locationsUpsertWithWhereUniqueWithoutLocationsInput[];
    createMany?: Prisma.party_locationsCreateManyLocationsInputEnvelope;
    set?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    disconnect?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    delete?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    connect?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    update?: Prisma.party_locationsUpdateWithWhereUniqueWithoutLocationsInput | Prisma.party_locationsUpdateWithWhereUniqueWithoutLocationsInput[];
    updateMany?: Prisma.party_locationsUpdateManyWithWhereWithoutLocationsInput | Prisma.party_locationsUpdateManyWithWhereWithoutLocationsInput[];
    deleteMany?: Prisma.party_locationsScalarWhereInput | Prisma.party_locationsScalarWhereInput[];
};
export type party_locationsUncheckedUpdateManyWithoutLocationsNestedInput = {
    create?: Prisma.XOR<Prisma.party_locationsCreateWithoutLocationsInput, Prisma.party_locationsUncheckedCreateWithoutLocationsInput> | Prisma.party_locationsCreateWithoutLocationsInput[] | Prisma.party_locationsUncheckedCreateWithoutLocationsInput[];
    connectOrCreate?: Prisma.party_locationsCreateOrConnectWithoutLocationsInput | Prisma.party_locationsCreateOrConnectWithoutLocationsInput[];
    upsert?: Prisma.party_locationsUpsertWithWhereUniqueWithoutLocationsInput | Prisma.party_locationsUpsertWithWhereUniqueWithoutLocationsInput[];
    createMany?: Prisma.party_locationsCreateManyLocationsInputEnvelope;
    set?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    disconnect?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    delete?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    connect?: Prisma.party_locationsWhereUniqueInput | Prisma.party_locationsWhereUniqueInput[];
    update?: Prisma.party_locationsUpdateWithWhereUniqueWithoutLocationsInput | Prisma.party_locationsUpdateWithWhereUniqueWithoutLocationsInput[];
    updateMany?: Prisma.party_locationsUpdateManyWithWhereWithoutLocationsInput | Prisma.party_locationsUpdateManyWithWhereWithoutLocationsInput[];
    deleteMany?: Prisma.party_locationsScalarWhereInput | Prisma.party_locationsScalarWhereInput[];
};
export type party_locationsCreateWithoutBusiness_partiesInput = {
    id?: string;
    label?: string | null;
    created_at?: Date | string;
    locations: Prisma.locationsCreateNestedOneWithoutParty_locationsInput;
};
export type party_locationsUncheckedCreateWithoutBusiness_partiesInput = {
    id?: string;
    location_id: string;
    label?: string | null;
    created_at?: Date | string;
};
export type party_locationsCreateOrConnectWithoutBusiness_partiesInput = {
    where: Prisma.party_locationsWhereUniqueInput;
    create: Prisma.XOR<Prisma.party_locationsCreateWithoutBusiness_partiesInput, Prisma.party_locationsUncheckedCreateWithoutBusiness_partiesInput>;
};
export type party_locationsCreateManyBusiness_partiesInputEnvelope = {
    data: Prisma.party_locationsCreateManyBusiness_partiesInput | Prisma.party_locationsCreateManyBusiness_partiesInput[];
    skipDuplicates?: boolean;
};
export type party_locationsUpsertWithWhereUniqueWithoutBusiness_partiesInput = {
    where: Prisma.party_locationsWhereUniqueInput;
    update: Prisma.XOR<Prisma.party_locationsUpdateWithoutBusiness_partiesInput, Prisma.party_locationsUncheckedUpdateWithoutBusiness_partiesInput>;
    create: Prisma.XOR<Prisma.party_locationsCreateWithoutBusiness_partiesInput, Prisma.party_locationsUncheckedCreateWithoutBusiness_partiesInput>;
};
export type party_locationsUpdateWithWhereUniqueWithoutBusiness_partiesInput = {
    where: Prisma.party_locationsWhereUniqueInput;
    data: Prisma.XOR<Prisma.party_locationsUpdateWithoutBusiness_partiesInput, Prisma.party_locationsUncheckedUpdateWithoutBusiness_partiesInput>;
};
export type party_locationsUpdateManyWithWhereWithoutBusiness_partiesInput = {
    where: Prisma.party_locationsScalarWhereInput;
    data: Prisma.XOR<Prisma.party_locationsUpdateManyMutationInput, Prisma.party_locationsUncheckedUpdateManyWithoutBusiness_partiesInput>;
};
export type party_locationsScalarWhereInput = {
    AND?: Prisma.party_locationsScalarWhereInput | Prisma.party_locationsScalarWhereInput[];
    OR?: Prisma.party_locationsScalarWhereInput[];
    NOT?: Prisma.party_locationsScalarWhereInput | Prisma.party_locationsScalarWhereInput[];
    id?: Prisma.UuidFilter<"party_locations"> | string;
    party_id?: Prisma.UuidFilter<"party_locations"> | string;
    location_id?: Prisma.UuidFilter<"party_locations"> | string;
    label?: Prisma.StringNullableFilter<"party_locations"> | string | null;
    created_at?: Prisma.DateTimeFilter<"party_locations"> | Date | string;
};
export type party_locationsCreateWithoutLocationsInput = {
    id?: string;
    label?: string | null;
    created_at?: Date | string;
    business_parties: Prisma.business_partiesCreateNestedOneWithoutParty_locationsInput;
};
export type party_locationsUncheckedCreateWithoutLocationsInput = {
    id?: string;
    party_id: string;
    label?: string | null;
    created_at?: Date | string;
};
export type party_locationsCreateOrConnectWithoutLocationsInput = {
    where: Prisma.party_locationsWhereUniqueInput;
    create: Prisma.XOR<Prisma.party_locationsCreateWithoutLocationsInput, Prisma.party_locationsUncheckedCreateWithoutLocationsInput>;
};
export type party_locationsCreateManyLocationsInputEnvelope = {
    data: Prisma.party_locationsCreateManyLocationsInput | Prisma.party_locationsCreateManyLocationsInput[];
    skipDuplicates?: boolean;
};
export type party_locationsUpsertWithWhereUniqueWithoutLocationsInput = {
    where: Prisma.party_locationsWhereUniqueInput;
    update: Prisma.XOR<Prisma.party_locationsUpdateWithoutLocationsInput, Prisma.party_locationsUncheckedUpdateWithoutLocationsInput>;
    create: Prisma.XOR<Prisma.party_locationsCreateWithoutLocationsInput, Prisma.party_locationsUncheckedCreateWithoutLocationsInput>;
};
export type party_locationsUpdateWithWhereUniqueWithoutLocationsInput = {
    where: Prisma.party_locationsWhereUniqueInput;
    data: Prisma.XOR<Prisma.party_locationsUpdateWithoutLocationsInput, Prisma.party_locationsUncheckedUpdateWithoutLocationsInput>;
};
export type party_locationsUpdateManyWithWhereWithoutLocationsInput = {
    where: Prisma.party_locationsScalarWhereInput;
    data: Prisma.XOR<Prisma.party_locationsUpdateManyMutationInput, Prisma.party_locationsUncheckedUpdateManyWithoutLocationsInput>;
};
export type party_locationsCreateManyBusiness_partiesInput = {
    id?: string;
    location_id: string;
    label?: string | null;
    created_at?: Date | string;
};
export type party_locationsUpdateWithoutBusiness_partiesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    locations?: Prisma.locationsUpdateOneRequiredWithoutParty_locationsNestedInput;
};
export type party_locationsUncheckedUpdateWithoutBusiness_partiesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type party_locationsUncheckedUpdateManyWithoutBusiness_partiesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    location_id?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type party_locationsCreateManyLocationsInput = {
    id?: string;
    party_id: string;
    label?: string | null;
    created_at?: Date | string;
};
export type party_locationsUpdateWithoutLocationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    business_parties?: Prisma.business_partiesUpdateOneRequiredWithoutParty_locationsNestedInput;
};
export type party_locationsUncheckedUpdateWithoutLocationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    party_id?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type party_locationsUncheckedUpdateManyWithoutLocationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    party_id?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type party_locationsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    party_id?: boolean;
    location_id?: boolean;
    label?: boolean;
    created_at?: boolean;
    locations?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    business_parties?: boolean | Prisma.business_partiesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["party_locations"]>;
export type party_locationsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    party_id?: boolean;
    location_id?: boolean;
    label?: boolean;
    created_at?: boolean;
    locations?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    business_parties?: boolean | Prisma.business_partiesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["party_locations"]>;
export type party_locationsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    party_id?: boolean;
    location_id?: boolean;
    label?: boolean;
    created_at?: boolean;
    locations?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    business_parties?: boolean | Prisma.business_partiesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["party_locations"]>;
export type party_locationsSelectScalar = {
    id?: boolean;
    party_id?: boolean;
    location_id?: boolean;
    label?: boolean;
    created_at?: boolean;
};
export type party_locationsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "party_id" | "location_id" | "label" | "created_at", ExtArgs["result"]["party_locations"]>;
export type party_locationsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    locations?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    business_parties?: boolean | Prisma.business_partiesDefaultArgs<ExtArgs>;
};
export type party_locationsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    locations?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    business_parties?: boolean | Prisma.business_partiesDefaultArgs<ExtArgs>;
};
export type party_locationsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    locations?: boolean | Prisma.locationsDefaultArgs<ExtArgs>;
    business_parties?: boolean | Prisma.business_partiesDefaultArgs<ExtArgs>;
};
export type $party_locationsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "party_locations";
    objects: {
        locations: Prisma.$locationsPayload<ExtArgs>;
        business_parties: Prisma.$business_partiesPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        party_id: string;
        location_id: string;
        label: string | null;
        created_at: Date;
    }, ExtArgs["result"]["party_locations"]>;
    composites: {};
};
export type party_locationsGetPayload<S extends boolean | null | undefined | party_locationsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$party_locationsPayload, S>;
export type party_locationsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<party_locationsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Party_locationsCountAggregateInputType | true;
};
export interface party_locationsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['party_locations'];
        meta: {
            name: 'party_locations';
        };
    };
    findUnique<T extends party_locationsFindUniqueArgs>(args: Prisma.SelectSubset<T, party_locationsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__party_locationsClient<runtime.Types.Result.GetResult<Prisma.$party_locationsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends party_locationsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, party_locationsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__party_locationsClient<runtime.Types.Result.GetResult<Prisma.$party_locationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends party_locationsFindFirstArgs>(args?: Prisma.SelectSubset<T, party_locationsFindFirstArgs<ExtArgs>>): Prisma.Prisma__party_locationsClient<runtime.Types.Result.GetResult<Prisma.$party_locationsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends party_locationsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, party_locationsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__party_locationsClient<runtime.Types.Result.GetResult<Prisma.$party_locationsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends party_locationsFindManyArgs>(args?: Prisma.SelectSubset<T, party_locationsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$party_locationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends party_locationsCreateArgs>(args: Prisma.SelectSubset<T, party_locationsCreateArgs<ExtArgs>>): Prisma.Prisma__party_locationsClient<runtime.Types.Result.GetResult<Prisma.$party_locationsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends party_locationsCreateManyArgs>(args?: Prisma.SelectSubset<T, party_locationsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends party_locationsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, party_locationsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$party_locationsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends party_locationsDeleteArgs>(args: Prisma.SelectSubset<T, party_locationsDeleteArgs<ExtArgs>>): Prisma.Prisma__party_locationsClient<runtime.Types.Result.GetResult<Prisma.$party_locationsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends party_locationsUpdateArgs>(args: Prisma.SelectSubset<T, party_locationsUpdateArgs<ExtArgs>>): Prisma.Prisma__party_locationsClient<runtime.Types.Result.GetResult<Prisma.$party_locationsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends party_locationsDeleteManyArgs>(args?: Prisma.SelectSubset<T, party_locationsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends party_locationsUpdateManyArgs>(args: Prisma.SelectSubset<T, party_locationsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends party_locationsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, party_locationsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$party_locationsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends party_locationsUpsertArgs>(args: Prisma.SelectSubset<T, party_locationsUpsertArgs<ExtArgs>>): Prisma.Prisma__party_locationsClient<runtime.Types.Result.GetResult<Prisma.$party_locationsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends party_locationsCountArgs>(args?: Prisma.Subset<T, party_locationsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Party_locationsCountAggregateOutputType> : number>;
    aggregate<T extends Party_locationsAggregateArgs>(args: Prisma.Subset<T, Party_locationsAggregateArgs>): Prisma.PrismaPromise<GetParty_locationsAggregateType<T>>;
    groupBy<T extends party_locationsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: party_locationsGroupByArgs['orderBy'];
    } : {
        orderBy?: party_locationsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, party_locationsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetParty_locationsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: party_locationsFieldRefs;
}
export interface Prisma__party_locationsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    locations<T extends Prisma.locationsDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.locationsDefaultArgs<ExtArgs>>): Prisma.Prisma__locationsClient<runtime.Types.Result.GetResult<Prisma.$locationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    business_parties<T extends Prisma.business_partiesDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.business_partiesDefaultArgs<ExtArgs>>): Prisma.Prisma__business_partiesClient<runtime.Types.Result.GetResult<Prisma.$business_partiesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface party_locationsFieldRefs {
    readonly id: Prisma.FieldRef<"party_locations", 'String'>;
    readonly party_id: Prisma.FieldRef<"party_locations", 'String'>;
    readonly location_id: Prisma.FieldRef<"party_locations", 'String'>;
    readonly label: Prisma.FieldRef<"party_locations", 'String'>;
    readonly created_at: Prisma.FieldRef<"party_locations", 'DateTime'>;
}
export type party_locationsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_locationsSelect<ExtArgs> | null;
    omit?: Prisma.party_locationsOmit<ExtArgs> | null;
    include?: Prisma.party_locationsInclude<ExtArgs> | null;
    where: Prisma.party_locationsWhereUniqueInput;
};
export type party_locationsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_locationsSelect<ExtArgs> | null;
    omit?: Prisma.party_locationsOmit<ExtArgs> | null;
    include?: Prisma.party_locationsInclude<ExtArgs> | null;
    where: Prisma.party_locationsWhereUniqueInput;
};
export type party_locationsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_locationsSelect<ExtArgs> | null;
    omit?: Prisma.party_locationsOmit<ExtArgs> | null;
    include?: Prisma.party_locationsInclude<ExtArgs> | null;
    where?: Prisma.party_locationsWhereInput;
    orderBy?: Prisma.party_locationsOrderByWithRelationInput | Prisma.party_locationsOrderByWithRelationInput[];
    cursor?: Prisma.party_locationsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Party_locationsScalarFieldEnum | Prisma.Party_locationsScalarFieldEnum[];
};
export type party_locationsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_locationsSelect<ExtArgs> | null;
    omit?: Prisma.party_locationsOmit<ExtArgs> | null;
    include?: Prisma.party_locationsInclude<ExtArgs> | null;
    where?: Prisma.party_locationsWhereInput;
    orderBy?: Prisma.party_locationsOrderByWithRelationInput | Prisma.party_locationsOrderByWithRelationInput[];
    cursor?: Prisma.party_locationsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Party_locationsScalarFieldEnum | Prisma.Party_locationsScalarFieldEnum[];
};
export type party_locationsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_locationsSelect<ExtArgs> | null;
    omit?: Prisma.party_locationsOmit<ExtArgs> | null;
    include?: Prisma.party_locationsInclude<ExtArgs> | null;
    where?: Prisma.party_locationsWhereInput;
    orderBy?: Prisma.party_locationsOrderByWithRelationInput | Prisma.party_locationsOrderByWithRelationInput[];
    cursor?: Prisma.party_locationsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Party_locationsScalarFieldEnum | Prisma.Party_locationsScalarFieldEnum[];
};
export type party_locationsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_locationsSelect<ExtArgs> | null;
    omit?: Prisma.party_locationsOmit<ExtArgs> | null;
    include?: Prisma.party_locationsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.party_locationsCreateInput, Prisma.party_locationsUncheckedCreateInput>;
};
export type party_locationsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.party_locationsCreateManyInput | Prisma.party_locationsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type party_locationsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_locationsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.party_locationsOmit<ExtArgs> | null;
    data: Prisma.party_locationsCreateManyInput | Prisma.party_locationsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.party_locationsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type party_locationsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_locationsSelect<ExtArgs> | null;
    omit?: Prisma.party_locationsOmit<ExtArgs> | null;
    include?: Prisma.party_locationsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.party_locationsUpdateInput, Prisma.party_locationsUncheckedUpdateInput>;
    where: Prisma.party_locationsWhereUniqueInput;
};
export type party_locationsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.party_locationsUpdateManyMutationInput, Prisma.party_locationsUncheckedUpdateManyInput>;
    where?: Prisma.party_locationsWhereInput;
    limit?: number;
};
export type party_locationsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_locationsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.party_locationsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.party_locationsUpdateManyMutationInput, Prisma.party_locationsUncheckedUpdateManyInput>;
    where?: Prisma.party_locationsWhereInput;
    limit?: number;
    include?: Prisma.party_locationsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type party_locationsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_locationsSelect<ExtArgs> | null;
    omit?: Prisma.party_locationsOmit<ExtArgs> | null;
    include?: Prisma.party_locationsInclude<ExtArgs> | null;
    where: Prisma.party_locationsWhereUniqueInput;
    create: Prisma.XOR<Prisma.party_locationsCreateInput, Prisma.party_locationsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.party_locationsUpdateInput, Prisma.party_locationsUncheckedUpdateInput>;
};
export type party_locationsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_locationsSelect<ExtArgs> | null;
    omit?: Prisma.party_locationsOmit<ExtArgs> | null;
    include?: Prisma.party_locationsInclude<ExtArgs> | null;
    where: Prisma.party_locationsWhereUniqueInput;
};
export type party_locationsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.party_locationsWhereInput;
    limit?: number;
};
export type party_locationsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_locationsSelect<ExtArgs> | null;
    omit?: Prisma.party_locationsOmit<ExtArgs> | null;
    include?: Prisma.party_locationsInclude<ExtArgs> | null;
};
