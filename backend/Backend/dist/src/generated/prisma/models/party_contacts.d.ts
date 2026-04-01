import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type party_contactsModel = runtime.Types.Result.DefaultSelection<Prisma.$party_contactsPayload>;
export type AggregateParty_contacts = {
    _count: Party_contactsCountAggregateOutputType | null;
    _min: Party_contactsMinAggregateOutputType | null;
    _max: Party_contactsMaxAggregateOutputType | null;
};
export type Party_contactsMinAggregateOutputType = {
    id: string | null;
    party_id: string | null;
    first_name: string | null;
    last_name: string | null;
    role: string | null;
    phone: string | null;
    email: string | null;
    created_at: Date | null;
};
export type Party_contactsMaxAggregateOutputType = {
    id: string | null;
    party_id: string | null;
    first_name: string | null;
    last_name: string | null;
    role: string | null;
    phone: string | null;
    email: string | null;
    created_at: Date | null;
};
export type Party_contactsCountAggregateOutputType = {
    id: number;
    party_id: number;
    first_name: number;
    last_name: number;
    role: number;
    phone: number;
    email: number;
    created_at: number;
    _all: number;
};
export type Party_contactsMinAggregateInputType = {
    id?: true;
    party_id?: true;
    first_name?: true;
    last_name?: true;
    role?: true;
    phone?: true;
    email?: true;
    created_at?: true;
};
export type Party_contactsMaxAggregateInputType = {
    id?: true;
    party_id?: true;
    first_name?: true;
    last_name?: true;
    role?: true;
    phone?: true;
    email?: true;
    created_at?: true;
};
export type Party_contactsCountAggregateInputType = {
    id?: true;
    party_id?: true;
    first_name?: true;
    last_name?: true;
    role?: true;
    phone?: true;
    email?: true;
    created_at?: true;
    _all?: true;
};
export type Party_contactsAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.party_contactsWhereInput;
    orderBy?: Prisma.party_contactsOrderByWithRelationInput | Prisma.party_contactsOrderByWithRelationInput[];
    cursor?: Prisma.party_contactsWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Party_contactsCountAggregateInputType;
    _min?: Party_contactsMinAggregateInputType;
    _max?: Party_contactsMaxAggregateInputType;
};
export type GetParty_contactsAggregateType<T extends Party_contactsAggregateArgs> = {
    [P in keyof T & keyof AggregateParty_contacts]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateParty_contacts[P]> : Prisma.GetScalarType<T[P], AggregateParty_contacts[P]>;
};
export type party_contactsGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.party_contactsWhereInput;
    orderBy?: Prisma.party_contactsOrderByWithAggregationInput | Prisma.party_contactsOrderByWithAggregationInput[];
    by: Prisma.Party_contactsScalarFieldEnum[] | Prisma.Party_contactsScalarFieldEnum;
    having?: Prisma.party_contactsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Party_contactsCountAggregateInputType | true;
    _min?: Party_contactsMinAggregateInputType;
    _max?: Party_contactsMaxAggregateInputType;
};
export type Party_contactsGroupByOutputType = {
    id: string;
    party_id: string | null;
    first_name: string;
    last_name: string;
    role: string | null;
    phone: string | null;
    email: string | null;
    created_at: Date;
    _count: Party_contactsCountAggregateOutputType | null;
    _min: Party_contactsMinAggregateOutputType | null;
    _max: Party_contactsMaxAggregateOutputType | null;
};
export type GetParty_contactsGroupByPayload<T extends party_contactsGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Party_contactsGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Party_contactsGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Party_contactsGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Party_contactsGroupByOutputType[P]>;
}>>;
export type party_contactsWhereInput = {
    AND?: Prisma.party_contactsWhereInput | Prisma.party_contactsWhereInput[];
    OR?: Prisma.party_contactsWhereInput[];
    NOT?: Prisma.party_contactsWhereInput | Prisma.party_contactsWhereInput[];
    id?: Prisma.UuidFilter<"party_contacts"> | string;
    party_id?: Prisma.UuidNullableFilter<"party_contacts"> | string | null;
    first_name?: Prisma.StringFilter<"party_contacts"> | string;
    last_name?: Prisma.StringFilter<"party_contacts"> | string;
    role?: Prisma.StringNullableFilter<"party_contacts"> | string | null;
    phone?: Prisma.StringNullableFilter<"party_contacts"> | string | null;
    email?: Prisma.StringNullableFilter<"party_contacts"> | string | null;
    created_at?: Prisma.DateTimeFilter<"party_contacts"> | Date | string;
    business_parties?: Prisma.XOR<Prisma.Business_partiesNullableScalarRelationFilter, Prisma.business_partiesWhereInput> | null;
};
export type party_contactsOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    role?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    business_parties?: Prisma.business_partiesOrderByWithRelationInput;
};
export type party_contactsWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.party_contactsWhereInput | Prisma.party_contactsWhereInput[];
    OR?: Prisma.party_contactsWhereInput[];
    NOT?: Prisma.party_contactsWhereInput | Prisma.party_contactsWhereInput[];
    party_id?: Prisma.UuidNullableFilter<"party_contacts"> | string | null;
    first_name?: Prisma.StringFilter<"party_contacts"> | string;
    last_name?: Prisma.StringFilter<"party_contacts"> | string;
    role?: Prisma.StringNullableFilter<"party_contacts"> | string | null;
    phone?: Prisma.StringNullableFilter<"party_contacts"> | string | null;
    email?: Prisma.StringNullableFilter<"party_contacts"> | string | null;
    created_at?: Prisma.DateTimeFilter<"party_contacts"> | Date | string;
    business_parties?: Prisma.XOR<Prisma.Business_partiesNullableScalarRelationFilter, Prisma.business_partiesWhereInput> | null;
}, "id">;
export type party_contactsOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    role?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.party_contactsCountOrderByAggregateInput;
    _max?: Prisma.party_contactsMaxOrderByAggregateInput;
    _min?: Prisma.party_contactsMinOrderByAggregateInput;
};
export type party_contactsScalarWhereWithAggregatesInput = {
    AND?: Prisma.party_contactsScalarWhereWithAggregatesInput | Prisma.party_contactsScalarWhereWithAggregatesInput[];
    OR?: Prisma.party_contactsScalarWhereWithAggregatesInput[];
    NOT?: Prisma.party_contactsScalarWhereWithAggregatesInput | Prisma.party_contactsScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"party_contacts"> | string;
    party_id?: Prisma.UuidNullableWithAggregatesFilter<"party_contacts"> | string | null;
    first_name?: Prisma.StringWithAggregatesFilter<"party_contacts"> | string;
    last_name?: Prisma.StringWithAggregatesFilter<"party_contacts"> | string;
    role?: Prisma.StringNullableWithAggregatesFilter<"party_contacts"> | string | null;
    phone?: Prisma.StringNullableWithAggregatesFilter<"party_contacts"> | string | null;
    email?: Prisma.StringNullableWithAggregatesFilter<"party_contacts"> | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"party_contacts"> | Date | string;
};
export type party_contactsCreateInput = {
    id?: string;
    first_name: string;
    last_name: string;
    role?: string | null;
    phone?: string | null;
    email?: string | null;
    created_at?: Date | string;
    business_parties?: Prisma.business_partiesCreateNestedOneWithoutParty_contactsInput;
};
export type party_contactsUncheckedCreateInput = {
    id?: string;
    party_id?: string | null;
    first_name: string;
    last_name: string;
    role?: string | null;
    phone?: string | null;
    email?: string | null;
    created_at?: Date | string;
};
export type party_contactsUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    business_parties?: Prisma.business_partiesUpdateOneWithoutParty_contactsNestedInput;
};
export type party_contactsUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    party_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type party_contactsCreateManyInput = {
    id?: string;
    party_id?: string | null;
    first_name: string;
    last_name: string;
    role?: string | null;
    phone?: string | null;
    email?: string | null;
    created_at?: Date | string;
};
export type party_contactsUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type party_contactsUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    party_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type Party_contactsListRelationFilter = {
    every?: Prisma.party_contactsWhereInput;
    some?: Prisma.party_contactsWhereInput;
    none?: Prisma.party_contactsWhereInput;
};
export type party_contactsOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type party_contactsCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type party_contactsMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type party_contactsMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    party_id?: Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type party_contactsCreateNestedManyWithoutBusiness_partiesInput = {
    create?: Prisma.XOR<Prisma.party_contactsCreateWithoutBusiness_partiesInput, Prisma.party_contactsUncheckedCreateWithoutBusiness_partiesInput> | Prisma.party_contactsCreateWithoutBusiness_partiesInput[] | Prisma.party_contactsUncheckedCreateWithoutBusiness_partiesInput[];
    connectOrCreate?: Prisma.party_contactsCreateOrConnectWithoutBusiness_partiesInput | Prisma.party_contactsCreateOrConnectWithoutBusiness_partiesInput[];
    createMany?: Prisma.party_contactsCreateManyBusiness_partiesInputEnvelope;
    connect?: Prisma.party_contactsWhereUniqueInput | Prisma.party_contactsWhereUniqueInput[];
};
export type party_contactsUncheckedCreateNestedManyWithoutBusiness_partiesInput = {
    create?: Prisma.XOR<Prisma.party_contactsCreateWithoutBusiness_partiesInput, Prisma.party_contactsUncheckedCreateWithoutBusiness_partiesInput> | Prisma.party_contactsCreateWithoutBusiness_partiesInput[] | Prisma.party_contactsUncheckedCreateWithoutBusiness_partiesInput[];
    connectOrCreate?: Prisma.party_contactsCreateOrConnectWithoutBusiness_partiesInput | Prisma.party_contactsCreateOrConnectWithoutBusiness_partiesInput[];
    createMany?: Prisma.party_contactsCreateManyBusiness_partiesInputEnvelope;
    connect?: Prisma.party_contactsWhereUniqueInput | Prisma.party_contactsWhereUniqueInput[];
};
export type party_contactsUpdateManyWithoutBusiness_partiesNestedInput = {
    create?: Prisma.XOR<Prisma.party_contactsCreateWithoutBusiness_partiesInput, Prisma.party_contactsUncheckedCreateWithoutBusiness_partiesInput> | Prisma.party_contactsCreateWithoutBusiness_partiesInput[] | Prisma.party_contactsUncheckedCreateWithoutBusiness_partiesInput[];
    connectOrCreate?: Prisma.party_contactsCreateOrConnectWithoutBusiness_partiesInput | Prisma.party_contactsCreateOrConnectWithoutBusiness_partiesInput[];
    upsert?: Prisma.party_contactsUpsertWithWhereUniqueWithoutBusiness_partiesInput | Prisma.party_contactsUpsertWithWhereUniqueWithoutBusiness_partiesInput[];
    createMany?: Prisma.party_contactsCreateManyBusiness_partiesInputEnvelope;
    set?: Prisma.party_contactsWhereUniqueInput | Prisma.party_contactsWhereUniqueInput[];
    disconnect?: Prisma.party_contactsWhereUniqueInput | Prisma.party_contactsWhereUniqueInput[];
    delete?: Prisma.party_contactsWhereUniqueInput | Prisma.party_contactsWhereUniqueInput[];
    connect?: Prisma.party_contactsWhereUniqueInput | Prisma.party_contactsWhereUniqueInput[];
    update?: Prisma.party_contactsUpdateWithWhereUniqueWithoutBusiness_partiesInput | Prisma.party_contactsUpdateWithWhereUniqueWithoutBusiness_partiesInput[];
    updateMany?: Prisma.party_contactsUpdateManyWithWhereWithoutBusiness_partiesInput | Prisma.party_contactsUpdateManyWithWhereWithoutBusiness_partiesInput[];
    deleteMany?: Prisma.party_contactsScalarWhereInput | Prisma.party_contactsScalarWhereInput[];
};
export type party_contactsUncheckedUpdateManyWithoutBusiness_partiesNestedInput = {
    create?: Prisma.XOR<Prisma.party_contactsCreateWithoutBusiness_partiesInput, Prisma.party_contactsUncheckedCreateWithoutBusiness_partiesInput> | Prisma.party_contactsCreateWithoutBusiness_partiesInput[] | Prisma.party_contactsUncheckedCreateWithoutBusiness_partiesInput[];
    connectOrCreate?: Prisma.party_contactsCreateOrConnectWithoutBusiness_partiesInput | Prisma.party_contactsCreateOrConnectWithoutBusiness_partiesInput[];
    upsert?: Prisma.party_contactsUpsertWithWhereUniqueWithoutBusiness_partiesInput | Prisma.party_contactsUpsertWithWhereUniqueWithoutBusiness_partiesInput[];
    createMany?: Prisma.party_contactsCreateManyBusiness_partiesInputEnvelope;
    set?: Prisma.party_contactsWhereUniqueInput | Prisma.party_contactsWhereUniqueInput[];
    disconnect?: Prisma.party_contactsWhereUniqueInput | Prisma.party_contactsWhereUniqueInput[];
    delete?: Prisma.party_contactsWhereUniqueInput | Prisma.party_contactsWhereUniqueInput[];
    connect?: Prisma.party_contactsWhereUniqueInput | Prisma.party_contactsWhereUniqueInput[];
    update?: Prisma.party_contactsUpdateWithWhereUniqueWithoutBusiness_partiesInput | Prisma.party_contactsUpdateWithWhereUniqueWithoutBusiness_partiesInput[];
    updateMany?: Prisma.party_contactsUpdateManyWithWhereWithoutBusiness_partiesInput | Prisma.party_contactsUpdateManyWithWhereWithoutBusiness_partiesInput[];
    deleteMany?: Prisma.party_contactsScalarWhereInput | Prisma.party_contactsScalarWhereInput[];
};
export type party_contactsCreateWithoutBusiness_partiesInput = {
    id?: string;
    first_name: string;
    last_name: string;
    role?: string | null;
    phone?: string | null;
    email?: string | null;
    created_at?: Date | string;
};
export type party_contactsUncheckedCreateWithoutBusiness_partiesInput = {
    id?: string;
    first_name: string;
    last_name: string;
    role?: string | null;
    phone?: string | null;
    email?: string | null;
    created_at?: Date | string;
};
export type party_contactsCreateOrConnectWithoutBusiness_partiesInput = {
    where: Prisma.party_contactsWhereUniqueInput;
    create: Prisma.XOR<Prisma.party_contactsCreateWithoutBusiness_partiesInput, Prisma.party_contactsUncheckedCreateWithoutBusiness_partiesInput>;
};
export type party_contactsCreateManyBusiness_partiesInputEnvelope = {
    data: Prisma.party_contactsCreateManyBusiness_partiesInput | Prisma.party_contactsCreateManyBusiness_partiesInput[];
    skipDuplicates?: boolean;
};
export type party_contactsUpsertWithWhereUniqueWithoutBusiness_partiesInput = {
    where: Prisma.party_contactsWhereUniqueInput;
    update: Prisma.XOR<Prisma.party_contactsUpdateWithoutBusiness_partiesInput, Prisma.party_contactsUncheckedUpdateWithoutBusiness_partiesInput>;
    create: Prisma.XOR<Prisma.party_contactsCreateWithoutBusiness_partiesInput, Prisma.party_contactsUncheckedCreateWithoutBusiness_partiesInput>;
};
export type party_contactsUpdateWithWhereUniqueWithoutBusiness_partiesInput = {
    where: Prisma.party_contactsWhereUniqueInput;
    data: Prisma.XOR<Prisma.party_contactsUpdateWithoutBusiness_partiesInput, Prisma.party_contactsUncheckedUpdateWithoutBusiness_partiesInput>;
};
export type party_contactsUpdateManyWithWhereWithoutBusiness_partiesInput = {
    where: Prisma.party_contactsScalarWhereInput;
    data: Prisma.XOR<Prisma.party_contactsUpdateManyMutationInput, Prisma.party_contactsUncheckedUpdateManyWithoutBusiness_partiesInput>;
};
export type party_contactsScalarWhereInput = {
    AND?: Prisma.party_contactsScalarWhereInput | Prisma.party_contactsScalarWhereInput[];
    OR?: Prisma.party_contactsScalarWhereInput[];
    NOT?: Prisma.party_contactsScalarWhereInput | Prisma.party_contactsScalarWhereInput[];
    id?: Prisma.UuidFilter<"party_contacts"> | string;
    party_id?: Prisma.UuidNullableFilter<"party_contacts"> | string | null;
    first_name?: Prisma.StringFilter<"party_contacts"> | string;
    last_name?: Prisma.StringFilter<"party_contacts"> | string;
    role?: Prisma.StringNullableFilter<"party_contacts"> | string | null;
    phone?: Prisma.StringNullableFilter<"party_contacts"> | string | null;
    email?: Prisma.StringNullableFilter<"party_contacts"> | string | null;
    created_at?: Prisma.DateTimeFilter<"party_contacts"> | Date | string;
};
export type party_contactsCreateManyBusiness_partiesInput = {
    id?: string;
    first_name: string;
    last_name: string;
    role?: string | null;
    phone?: string | null;
    email?: string | null;
    created_at?: Date | string;
};
export type party_contactsUpdateWithoutBusiness_partiesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type party_contactsUncheckedUpdateWithoutBusiness_partiesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type party_contactsUncheckedUpdateManyWithoutBusiness_partiesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type party_contactsSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    party_id?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    role?: boolean;
    phone?: boolean;
    email?: boolean;
    created_at?: boolean;
    business_parties?: boolean | Prisma.party_contacts$business_partiesArgs<ExtArgs>;
}, ExtArgs["result"]["party_contacts"]>;
export type party_contactsSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    party_id?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    role?: boolean;
    phone?: boolean;
    email?: boolean;
    created_at?: boolean;
    business_parties?: boolean | Prisma.party_contacts$business_partiesArgs<ExtArgs>;
}, ExtArgs["result"]["party_contacts"]>;
export type party_contactsSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    party_id?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    role?: boolean;
    phone?: boolean;
    email?: boolean;
    created_at?: boolean;
    business_parties?: boolean | Prisma.party_contacts$business_partiesArgs<ExtArgs>;
}, ExtArgs["result"]["party_contacts"]>;
export type party_contactsSelectScalar = {
    id?: boolean;
    party_id?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    role?: boolean;
    phone?: boolean;
    email?: boolean;
    created_at?: boolean;
};
export type party_contactsOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "party_id" | "first_name" | "last_name" | "role" | "phone" | "email" | "created_at", ExtArgs["result"]["party_contacts"]>;
export type party_contactsInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    business_parties?: boolean | Prisma.party_contacts$business_partiesArgs<ExtArgs>;
};
export type party_contactsIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    business_parties?: boolean | Prisma.party_contacts$business_partiesArgs<ExtArgs>;
};
export type party_contactsIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    business_parties?: boolean | Prisma.party_contacts$business_partiesArgs<ExtArgs>;
};
export type $party_contactsPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "party_contacts";
    objects: {
        business_parties: Prisma.$business_partiesPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        party_id: string | null;
        first_name: string;
        last_name: string;
        role: string | null;
        phone: string | null;
        email: string | null;
        created_at: Date;
    }, ExtArgs["result"]["party_contacts"]>;
    composites: {};
};
export type party_contactsGetPayload<S extends boolean | null | undefined | party_contactsDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$party_contactsPayload, S>;
export type party_contactsCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<party_contactsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Party_contactsCountAggregateInputType | true;
};
export interface party_contactsDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['party_contacts'];
        meta: {
            name: 'party_contacts';
        };
    };
    findUnique<T extends party_contactsFindUniqueArgs>(args: Prisma.SelectSubset<T, party_contactsFindUniqueArgs<ExtArgs>>): Prisma.Prisma__party_contactsClient<runtime.Types.Result.GetResult<Prisma.$party_contactsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends party_contactsFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, party_contactsFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__party_contactsClient<runtime.Types.Result.GetResult<Prisma.$party_contactsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends party_contactsFindFirstArgs>(args?: Prisma.SelectSubset<T, party_contactsFindFirstArgs<ExtArgs>>): Prisma.Prisma__party_contactsClient<runtime.Types.Result.GetResult<Prisma.$party_contactsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends party_contactsFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, party_contactsFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__party_contactsClient<runtime.Types.Result.GetResult<Prisma.$party_contactsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends party_contactsFindManyArgs>(args?: Prisma.SelectSubset<T, party_contactsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$party_contactsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends party_contactsCreateArgs>(args: Prisma.SelectSubset<T, party_contactsCreateArgs<ExtArgs>>): Prisma.Prisma__party_contactsClient<runtime.Types.Result.GetResult<Prisma.$party_contactsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends party_contactsCreateManyArgs>(args?: Prisma.SelectSubset<T, party_contactsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends party_contactsCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, party_contactsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$party_contactsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends party_contactsDeleteArgs>(args: Prisma.SelectSubset<T, party_contactsDeleteArgs<ExtArgs>>): Prisma.Prisma__party_contactsClient<runtime.Types.Result.GetResult<Prisma.$party_contactsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends party_contactsUpdateArgs>(args: Prisma.SelectSubset<T, party_contactsUpdateArgs<ExtArgs>>): Prisma.Prisma__party_contactsClient<runtime.Types.Result.GetResult<Prisma.$party_contactsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends party_contactsDeleteManyArgs>(args?: Prisma.SelectSubset<T, party_contactsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends party_contactsUpdateManyArgs>(args: Prisma.SelectSubset<T, party_contactsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends party_contactsUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, party_contactsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$party_contactsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends party_contactsUpsertArgs>(args: Prisma.SelectSubset<T, party_contactsUpsertArgs<ExtArgs>>): Prisma.Prisma__party_contactsClient<runtime.Types.Result.GetResult<Prisma.$party_contactsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends party_contactsCountArgs>(args?: Prisma.Subset<T, party_contactsCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Party_contactsCountAggregateOutputType> : number>;
    aggregate<T extends Party_contactsAggregateArgs>(args: Prisma.Subset<T, Party_contactsAggregateArgs>): Prisma.PrismaPromise<GetParty_contactsAggregateType<T>>;
    groupBy<T extends party_contactsGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: party_contactsGroupByArgs['orderBy'];
    } : {
        orderBy?: party_contactsGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, party_contactsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetParty_contactsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: party_contactsFieldRefs;
}
export interface Prisma__party_contactsClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    business_parties<T extends Prisma.party_contacts$business_partiesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.party_contacts$business_partiesArgs<ExtArgs>>): Prisma.Prisma__business_partiesClient<runtime.Types.Result.GetResult<Prisma.$business_partiesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface party_contactsFieldRefs {
    readonly id: Prisma.FieldRef<"party_contacts", 'String'>;
    readonly party_id: Prisma.FieldRef<"party_contacts", 'String'>;
    readonly first_name: Prisma.FieldRef<"party_contacts", 'String'>;
    readonly last_name: Prisma.FieldRef<"party_contacts", 'String'>;
    readonly role: Prisma.FieldRef<"party_contacts", 'String'>;
    readonly phone: Prisma.FieldRef<"party_contacts", 'String'>;
    readonly email: Prisma.FieldRef<"party_contacts", 'String'>;
    readonly created_at: Prisma.FieldRef<"party_contacts", 'DateTime'>;
}
export type party_contactsFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_contactsSelect<ExtArgs> | null;
    omit?: Prisma.party_contactsOmit<ExtArgs> | null;
    include?: Prisma.party_contactsInclude<ExtArgs> | null;
    where: Prisma.party_contactsWhereUniqueInput;
};
export type party_contactsFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_contactsSelect<ExtArgs> | null;
    omit?: Prisma.party_contactsOmit<ExtArgs> | null;
    include?: Prisma.party_contactsInclude<ExtArgs> | null;
    where: Prisma.party_contactsWhereUniqueInput;
};
export type party_contactsFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_contactsSelect<ExtArgs> | null;
    omit?: Prisma.party_contactsOmit<ExtArgs> | null;
    include?: Prisma.party_contactsInclude<ExtArgs> | null;
    where?: Prisma.party_contactsWhereInput;
    orderBy?: Prisma.party_contactsOrderByWithRelationInput | Prisma.party_contactsOrderByWithRelationInput[];
    cursor?: Prisma.party_contactsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Party_contactsScalarFieldEnum | Prisma.Party_contactsScalarFieldEnum[];
};
export type party_contactsFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_contactsSelect<ExtArgs> | null;
    omit?: Prisma.party_contactsOmit<ExtArgs> | null;
    include?: Prisma.party_contactsInclude<ExtArgs> | null;
    where?: Prisma.party_contactsWhereInput;
    orderBy?: Prisma.party_contactsOrderByWithRelationInput | Prisma.party_contactsOrderByWithRelationInput[];
    cursor?: Prisma.party_contactsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Party_contactsScalarFieldEnum | Prisma.Party_contactsScalarFieldEnum[];
};
export type party_contactsFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_contactsSelect<ExtArgs> | null;
    omit?: Prisma.party_contactsOmit<ExtArgs> | null;
    include?: Prisma.party_contactsInclude<ExtArgs> | null;
    where?: Prisma.party_contactsWhereInput;
    orderBy?: Prisma.party_contactsOrderByWithRelationInput | Prisma.party_contactsOrderByWithRelationInput[];
    cursor?: Prisma.party_contactsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Party_contactsScalarFieldEnum | Prisma.Party_contactsScalarFieldEnum[];
};
export type party_contactsCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_contactsSelect<ExtArgs> | null;
    omit?: Prisma.party_contactsOmit<ExtArgs> | null;
    include?: Prisma.party_contactsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.party_contactsCreateInput, Prisma.party_contactsUncheckedCreateInput>;
};
export type party_contactsCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.party_contactsCreateManyInput | Prisma.party_contactsCreateManyInput[];
    skipDuplicates?: boolean;
};
export type party_contactsCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_contactsSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.party_contactsOmit<ExtArgs> | null;
    data: Prisma.party_contactsCreateManyInput | Prisma.party_contactsCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.party_contactsIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type party_contactsUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_contactsSelect<ExtArgs> | null;
    omit?: Prisma.party_contactsOmit<ExtArgs> | null;
    include?: Prisma.party_contactsInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.party_contactsUpdateInput, Prisma.party_contactsUncheckedUpdateInput>;
    where: Prisma.party_contactsWhereUniqueInput;
};
export type party_contactsUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.party_contactsUpdateManyMutationInput, Prisma.party_contactsUncheckedUpdateManyInput>;
    where?: Prisma.party_contactsWhereInput;
    limit?: number;
};
export type party_contactsUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_contactsSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.party_contactsOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.party_contactsUpdateManyMutationInput, Prisma.party_contactsUncheckedUpdateManyInput>;
    where?: Prisma.party_contactsWhereInput;
    limit?: number;
    include?: Prisma.party_contactsIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type party_contactsUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_contactsSelect<ExtArgs> | null;
    omit?: Prisma.party_contactsOmit<ExtArgs> | null;
    include?: Prisma.party_contactsInclude<ExtArgs> | null;
    where: Prisma.party_contactsWhereUniqueInput;
    create: Prisma.XOR<Prisma.party_contactsCreateInput, Prisma.party_contactsUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.party_contactsUpdateInput, Prisma.party_contactsUncheckedUpdateInput>;
};
export type party_contactsDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_contactsSelect<ExtArgs> | null;
    omit?: Prisma.party_contactsOmit<ExtArgs> | null;
    include?: Prisma.party_contactsInclude<ExtArgs> | null;
    where: Prisma.party_contactsWhereUniqueInput;
};
export type party_contactsDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.party_contactsWhereInput;
    limit?: number;
};
export type party_contacts$business_partiesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.business_partiesSelect<ExtArgs> | null;
    omit?: Prisma.business_partiesOmit<ExtArgs> | null;
    include?: Prisma.business_partiesInclude<ExtArgs> | null;
    where?: Prisma.business_partiesWhereInput;
};
export type party_contactsDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.party_contactsSelect<ExtArgs> | null;
    omit?: Prisma.party_contactsOmit<ExtArgs> | null;
    include?: Prisma.party_contactsInclude<ExtArgs> | null;
};
