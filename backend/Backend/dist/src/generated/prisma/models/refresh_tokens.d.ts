import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type refresh_tokensModel = runtime.Types.Result.DefaultSelection<Prisma.$refresh_tokensPayload>;
export type AggregateRefresh_tokens = {
    _count: Refresh_tokensCountAggregateOutputType | null;
    _min: Refresh_tokensMinAggregateOutputType | null;
    _max: Refresh_tokensMaxAggregateOutputType | null;
};
export type Refresh_tokensMinAggregateOutputType = {
    id: string | null;
    user_id: string | null;
    token_hash: string | null;
    expires_at: Date | null;
    revoked: boolean | null;
    revoked_at: Date | null;
    created_at: Date | null;
};
export type Refresh_tokensMaxAggregateOutputType = {
    id: string | null;
    user_id: string | null;
    token_hash: string | null;
    expires_at: Date | null;
    revoked: boolean | null;
    revoked_at: Date | null;
    created_at: Date | null;
};
export type Refresh_tokensCountAggregateOutputType = {
    id: number;
    user_id: number;
    token_hash: number;
    expires_at: number;
    revoked: number;
    revoked_at: number;
    created_at: number;
    _all: number;
};
export type Refresh_tokensMinAggregateInputType = {
    id?: true;
    user_id?: true;
    token_hash?: true;
    expires_at?: true;
    revoked?: true;
    revoked_at?: true;
    created_at?: true;
};
export type Refresh_tokensMaxAggregateInputType = {
    id?: true;
    user_id?: true;
    token_hash?: true;
    expires_at?: true;
    revoked?: true;
    revoked_at?: true;
    created_at?: true;
};
export type Refresh_tokensCountAggregateInputType = {
    id?: true;
    user_id?: true;
    token_hash?: true;
    expires_at?: true;
    revoked?: true;
    revoked_at?: true;
    created_at?: true;
    _all?: true;
};
export type Refresh_tokensAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.refresh_tokensWhereInput;
    orderBy?: Prisma.refresh_tokensOrderByWithRelationInput | Prisma.refresh_tokensOrderByWithRelationInput[];
    cursor?: Prisma.refresh_tokensWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Refresh_tokensCountAggregateInputType;
    _min?: Refresh_tokensMinAggregateInputType;
    _max?: Refresh_tokensMaxAggregateInputType;
};
export type GetRefresh_tokensAggregateType<T extends Refresh_tokensAggregateArgs> = {
    [P in keyof T & keyof AggregateRefresh_tokens]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRefresh_tokens[P]> : Prisma.GetScalarType<T[P], AggregateRefresh_tokens[P]>;
};
export type refresh_tokensGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.refresh_tokensWhereInput;
    orderBy?: Prisma.refresh_tokensOrderByWithAggregationInput | Prisma.refresh_tokensOrderByWithAggregationInput[];
    by: Prisma.Refresh_tokensScalarFieldEnum[] | Prisma.Refresh_tokensScalarFieldEnum;
    having?: Prisma.refresh_tokensScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Refresh_tokensCountAggregateInputType | true;
    _min?: Refresh_tokensMinAggregateInputType;
    _max?: Refresh_tokensMaxAggregateInputType;
};
export type Refresh_tokensGroupByOutputType = {
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: Date;
    revoked: boolean;
    revoked_at: Date | null;
    created_at: Date;
    _count: Refresh_tokensCountAggregateOutputType | null;
    _min: Refresh_tokensMinAggregateOutputType | null;
    _max: Refresh_tokensMaxAggregateOutputType | null;
};
export type GetRefresh_tokensGroupByPayload<T extends refresh_tokensGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Refresh_tokensGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Refresh_tokensGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Refresh_tokensGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Refresh_tokensGroupByOutputType[P]>;
}>>;
export type refresh_tokensWhereInput = {
    AND?: Prisma.refresh_tokensWhereInput | Prisma.refresh_tokensWhereInput[];
    OR?: Prisma.refresh_tokensWhereInput[];
    NOT?: Prisma.refresh_tokensWhereInput | Prisma.refresh_tokensWhereInput[];
    id?: Prisma.UuidFilter<"refresh_tokens"> | string;
    user_id?: Prisma.UuidFilter<"refresh_tokens"> | string;
    token_hash?: Prisma.StringFilter<"refresh_tokens"> | string;
    expires_at?: Prisma.DateTimeFilter<"refresh_tokens"> | Date | string;
    revoked?: Prisma.BoolFilter<"refresh_tokens"> | boolean;
    revoked_at?: Prisma.DateTimeNullableFilter<"refresh_tokens"> | Date | string | null;
    created_at?: Prisma.DateTimeFilter<"refresh_tokens"> | Date | string;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
};
export type refresh_tokensOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    token_hash?: Prisma.SortOrder;
    expires_at?: Prisma.SortOrder;
    revoked?: Prisma.SortOrder;
    revoked_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    users?: Prisma.usersOrderByWithRelationInput;
};
export type refresh_tokensWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.refresh_tokensWhereInput | Prisma.refresh_tokensWhereInput[];
    OR?: Prisma.refresh_tokensWhereInput[];
    NOT?: Prisma.refresh_tokensWhereInput | Prisma.refresh_tokensWhereInput[];
    user_id?: Prisma.UuidFilter<"refresh_tokens"> | string;
    token_hash?: Prisma.StringFilter<"refresh_tokens"> | string;
    expires_at?: Prisma.DateTimeFilter<"refresh_tokens"> | Date | string;
    revoked?: Prisma.BoolFilter<"refresh_tokens"> | boolean;
    revoked_at?: Prisma.DateTimeNullableFilter<"refresh_tokens"> | Date | string | null;
    created_at?: Prisma.DateTimeFilter<"refresh_tokens"> | Date | string;
    users?: Prisma.XOR<Prisma.UsersScalarRelationFilter, Prisma.usersWhereInput>;
}, "id">;
export type refresh_tokensOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    token_hash?: Prisma.SortOrder;
    expires_at?: Prisma.SortOrder;
    revoked?: Prisma.SortOrder;
    revoked_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.refresh_tokensCountOrderByAggregateInput;
    _max?: Prisma.refresh_tokensMaxOrderByAggregateInput;
    _min?: Prisma.refresh_tokensMinOrderByAggregateInput;
};
export type refresh_tokensScalarWhereWithAggregatesInput = {
    AND?: Prisma.refresh_tokensScalarWhereWithAggregatesInput | Prisma.refresh_tokensScalarWhereWithAggregatesInput[];
    OR?: Prisma.refresh_tokensScalarWhereWithAggregatesInput[];
    NOT?: Prisma.refresh_tokensScalarWhereWithAggregatesInput | Prisma.refresh_tokensScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"refresh_tokens"> | string;
    user_id?: Prisma.UuidWithAggregatesFilter<"refresh_tokens"> | string;
    token_hash?: Prisma.StringWithAggregatesFilter<"refresh_tokens"> | string;
    expires_at?: Prisma.DateTimeWithAggregatesFilter<"refresh_tokens"> | Date | string;
    revoked?: Prisma.BoolWithAggregatesFilter<"refresh_tokens"> | boolean;
    revoked_at?: Prisma.DateTimeNullableWithAggregatesFilter<"refresh_tokens"> | Date | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"refresh_tokens"> | Date | string;
};
export type refresh_tokensCreateInput = {
    id?: string;
    token_hash: string;
    expires_at: Date | string;
    revoked?: boolean;
    revoked_at?: Date | string | null;
    created_at?: Date | string;
    users: Prisma.usersCreateNestedOneWithoutRefreshTokensInput;
};
export type refresh_tokensUncheckedCreateInput = {
    id?: string;
    user_id: string;
    token_hash: string;
    expires_at: Date | string;
    revoked?: boolean;
    revoked_at?: Date | string | null;
    created_at?: Date | string;
};
export type refresh_tokensUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    expires_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revoked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    revoked_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.usersUpdateOneRequiredWithoutRefreshTokensNestedInput;
};
export type refresh_tokensUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    token_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    expires_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revoked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    revoked_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type refresh_tokensCreateManyInput = {
    id?: string;
    user_id: string;
    token_hash: string;
    expires_at: Date | string;
    revoked?: boolean;
    revoked_at?: Date | string | null;
    created_at?: Date | string;
};
export type refresh_tokensUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    expires_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revoked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    revoked_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type refresh_tokensUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    user_id?: Prisma.StringFieldUpdateOperationsInput | string;
    token_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    expires_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revoked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    revoked_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type Refresh_tokensListRelationFilter = {
    every?: Prisma.refresh_tokensWhereInput;
    some?: Prisma.refresh_tokensWhereInput;
    none?: Prisma.refresh_tokensWhereInput;
};
export type refresh_tokensOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type refresh_tokensCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    token_hash?: Prisma.SortOrder;
    expires_at?: Prisma.SortOrder;
    revoked?: Prisma.SortOrder;
    revoked_at?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type refresh_tokensMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    token_hash?: Prisma.SortOrder;
    expires_at?: Prisma.SortOrder;
    revoked?: Prisma.SortOrder;
    revoked_at?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type refresh_tokensMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    user_id?: Prisma.SortOrder;
    token_hash?: Prisma.SortOrder;
    expires_at?: Prisma.SortOrder;
    revoked?: Prisma.SortOrder;
    revoked_at?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type refresh_tokensCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.refresh_tokensCreateWithoutUsersInput, Prisma.refresh_tokensUncheckedCreateWithoutUsersInput> | Prisma.refresh_tokensCreateWithoutUsersInput[] | Prisma.refresh_tokensUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.refresh_tokensCreateOrConnectWithoutUsersInput | Prisma.refresh_tokensCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.refresh_tokensCreateManyUsersInputEnvelope;
    connect?: Prisma.refresh_tokensWhereUniqueInput | Prisma.refresh_tokensWhereUniqueInput[];
};
export type refresh_tokensUncheckedCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.refresh_tokensCreateWithoutUsersInput, Prisma.refresh_tokensUncheckedCreateWithoutUsersInput> | Prisma.refresh_tokensCreateWithoutUsersInput[] | Prisma.refresh_tokensUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.refresh_tokensCreateOrConnectWithoutUsersInput | Prisma.refresh_tokensCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.refresh_tokensCreateManyUsersInputEnvelope;
    connect?: Prisma.refresh_tokensWhereUniqueInput | Prisma.refresh_tokensWhereUniqueInput[];
};
export type refresh_tokensUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.refresh_tokensCreateWithoutUsersInput, Prisma.refresh_tokensUncheckedCreateWithoutUsersInput> | Prisma.refresh_tokensCreateWithoutUsersInput[] | Prisma.refresh_tokensUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.refresh_tokensCreateOrConnectWithoutUsersInput | Prisma.refresh_tokensCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.refresh_tokensUpsertWithWhereUniqueWithoutUsersInput | Prisma.refresh_tokensUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.refresh_tokensCreateManyUsersInputEnvelope;
    set?: Prisma.refresh_tokensWhereUniqueInput | Prisma.refresh_tokensWhereUniqueInput[];
    disconnect?: Prisma.refresh_tokensWhereUniqueInput | Prisma.refresh_tokensWhereUniqueInput[];
    delete?: Prisma.refresh_tokensWhereUniqueInput | Prisma.refresh_tokensWhereUniqueInput[];
    connect?: Prisma.refresh_tokensWhereUniqueInput | Prisma.refresh_tokensWhereUniqueInput[];
    update?: Prisma.refresh_tokensUpdateWithWhereUniqueWithoutUsersInput | Prisma.refresh_tokensUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.refresh_tokensUpdateManyWithWhereWithoutUsersInput | Prisma.refresh_tokensUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.refresh_tokensScalarWhereInput | Prisma.refresh_tokensScalarWhereInput[];
};
export type refresh_tokensUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.refresh_tokensCreateWithoutUsersInput, Prisma.refresh_tokensUncheckedCreateWithoutUsersInput> | Prisma.refresh_tokensCreateWithoutUsersInput[] | Prisma.refresh_tokensUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.refresh_tokensCreateOrConnectWithoutUsersInput | Prisma.refresh_tokensCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.refresh_tokensUpsertWithWhereUniqueWithoutUsersInput | Prisma.refresh_tokensUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.refresh_tokensCreateManyUsersInputEnvelope;
    set?: Prisma.refresh_tokensWhereUniqueInput | Prisma.refresh_tokensWhereUniqueInput[];
    disconnect?: Prisma.refresh_tokensWhereUniqueInput | Prisma.refresh_tokensWhereUniqueInput[];
    delete?: Prisma.refresh_tokensWhereUniqueInput | Prisma.refresh_tokensWhereUniqueInput[];
    connect?: Prisma.refresh_tokensWhereUniqueInput | Prisma.refresh_tokensWhereUniqueInput[];
    update?: Prisma.refresh_tokensUpdateWithWhereUniqueWithoutUsersInput | Prisma.refresh_tokensUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.refresh_tokensUpdateManyWithWhereWithoutUsersInput | Prisma.refresh_tokensUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.refresh_tokensScalarWhereInput | Prisma.refresh_tokensScalarWhereInput[];
};
export type refresh_tokensCreateWithoutUsersInput = {
    id?: string;
    token_hash: string;
    expires_at: Date | string;
    revoked?: boolean;
    revoked_at?: Date | string | null;
    created_at?: Date | string;
};
export type refresh_tokensUncheckedCreateWithoutUsersInput = {
    id?: string;
    token_hash: string;
    expires_at: Date | string;
    revoked?: boolean;
    revoked_at?: Date | string | null;
    created_at?: Date | string;
};
export type refresh_tokensCreateOrConnectWithoutUsersInput = {
    where: Prisma.refresh_tokensWhereUniqueInput;
    create: Prisma.XOR<Prisma.refresh_tokensCreateWithoutUsersInput, Prisma.refresh_tokensUncheckedCreateWithoutUsersInput>;
};
export type refresh_tokensCreateManyUsersInputEnvelope = {
    data: Prisma.refresh_tokensCreateManyUsersInput | Prisma.refresh_tokensCreateManyUsersInput[];
    skipDuplicates?: boolean;
};
export type refresh_tokensUpsertWithWhereUniqueWithoutUsersInput = {
    where: Prisma.refresh_tokensWhereUniqueInput;
    update: Prisma.XOR<Prisma.refresh_tokensUpdateWithoutUsersInput, Prisma.refresh_tokensUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.refresh_tokensCreateWithoutUsersInput, Prisma.refresh_tokensUncheckedCreateWithoutUsersInput>;
};
export type refresh_tokensUpdateWithWhereUniqueWithoutUsersInput = {
    where: Prisma.refresh_tokensWhereUniqueInput;
    data: Prisma.XOR<Prisma.refresh_tokensUpdateWithoutUsersInput, Prisma.refresh_tokensUncheckedUpdateWithoutUsersInput>;
};
export type refresh_tokensUpdateManyWithWhereWithoutUsersInput = {
    where: Prisma.refresh_tokensScalarWhereInput;
    data: Prisma.XOR<Prisma.refresh_tokensUpdateManyMutationInput, Prisma.refresh_tokensUncheckedUpdateManyWithoutUsersInput>;
};
export type refresh_tokensScalarWhereInput = {
    AND?: Prisma.refresh_tokensScalarWhereInput | Prisma.refresh_tokensScalarWhereInput[];
    OR?: Prisma.refresh_tokensScalarWhereInput[];
    NOT?: Prisma.refresh_tokensScalarWhereInput | Prisma.refresh_tokensScalarWhereInput[];
    id?: Prisma.UuidFilter<"refresh_tokens"> | string;
    user_id?: Prisma.UuidFilter<"refresh_tokens"> | string;
    token_hash?: Prisma.StringFilter<"refresh_tokens"> | string;
    expires_at?: Prisma.DateTimeFilter<"refresh_tokens"> | Date | string;
    revoked?: Prisma.BoolFilter<"refresh_tokens"> | boolean;
    revoked_at?: Prisma.DateTimeNullableFilter<"refresh_tokens"> | Date | string | null;
    created_at?: Prisma.DateTimeFilter<"refresh_tokens"> | Date | string;
};
export type refresh_tokensCreateManyUsersInput = {
    id?: string;
    token_hash: string;
    expires_at: Date | string;
    revoked?: boolean;
    revoked_at?: Date | string | null;
    created_at?: Date | string;
};
export type refresh_tokensUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    expires_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revoked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    revoked_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type refresh_tokensUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    expires_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revoked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    revoked_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type refresh_tokensUncheckedUpdateManyWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    token_hash?: Prisma.StringFieldUpdateOperationsInput | string;
    expires_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revoked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    revoked_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type refresh_tokensSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    token_hash?: boolean;
    expires_at?: boolean;
    revoked?: boolean;
    revoked_at?: boolean;
    created_at?: boolean;
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["refresh_tokens"]>;
export type refresh_tokensSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    token_hash?: boolean;
    expires_at?: boolean;
    revoked?: boolean;
    revoked_at?: boolean;
    created_at?: boolean;
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["refresh_tokens"]>;
export type refresh_tokensSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    user_id?: boolean;
    token_hash?: boolean;
    expires_at?: boolean;
    revoked?: boolean;
    revoked_at?: boolean;
    created_at?: boolean;
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["refresh_tokens"]>;
export type refresh_tokensSelectScalar = {
    id?: boolean;
    user_id?: boolean;
    token_hash?: boolean;
    expires_at?: boolean;
    revoked?: boolean;
    revoked_at?: boolean;
    created_at?: boolean;
};
export type refresh_tokensOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "user_id" | "token_hash" | "expires_at" | "revoked" | "revoked_at" | "created_at", ExtArgs["result"]["refresh_tokens"]>;
export type refresh_tokensInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
};
export type refresh_tokensIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
};
export type refresh_tokensIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.usersDefaultArgs<ExtArgs>;
};
export type $refresh_tokensPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "refresh_tokens";
    objects: {
        users: Prisma.$usersPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        user_id: string;
        token_hash: string;
        expires_at: Date;
        revoked: boolean;
        revoked_at: Date | null;
        created_at: Date;
    }, ExtArgs["result"]["refresh_tokens"]>;
    composites: {};
};
export type refresh_tokensGetPayload<S extends boolean | null | undefined | refresh_tokensDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$refresh_tokensPayload, S>;
export type refresh_tokensCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<refresh_tokensFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Refresh_tokensCountAggregateInputType | true;
};
export interface refresh_tokensDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['refresh_tokens'];
        meta: {
            name: 'refresh_tokens';
        };
    };
    findUnique<T extends refresh_tokensFindUniqueArgs>(args: Prisma.SelectSubset<T, refresh_tokensFindUniqueArgs<ExtArgs>>): Prisma.Prisma__refresh_tokensClient<runtime.Types.Result.GetResult<Prisma.$refresh_tokensPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends refresh_tokensFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, refresh_tokensFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__refresh_tokensClient<runtime.Types.Result.GetResult<Prisma.$refresh_tokensPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends refresh_tokensFindFirstArgs>(args?: Prisma.SelectSubset<T, refresh_tokensFindFirstArgs<ExtArgs>>): Prisma.Prisma__refresh_tokensClient<runtime.Types.Result.GetResult<Prisma.$refresh_tokensPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends refresh_tokensFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, refresh_tokensFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__refresh_tokensClient<runtime.Types.Result.GetResult<Prisma.$refresh_tokensPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends refresh_tokensFindManyArgs>(args?: Prisma.SelectSubset<T, refresh_tokensFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$refresh_tokensPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends refresh_tokensCreateArgs>(args: Prisma.SelectSubset<T, refresh_tokensCreateArgs<ExtArgs>>): Prisma.Prisma__refresh_tokensClient<runtime.Types.Result.GetResult<Prisma.$refresh_tokensPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends refresh_tokensCreateManyArgs>(args?: Prisma.SelectSubset<T, refresh_tokensCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends refresh_tokensCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, refresh_tokensCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$refresh_tokensPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends refresh_tokensDeleteArgs>(args: Prisma.SelectSubset<T, refresh_tokensDeleteArgs<ExtArgs>>): Prisma.Prisma__refresh_tokensClient<runtime.Types.Result.GetResult<Prisma.$refresh_tokensPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends refresh_tokensUpdateArgs>(args: Prisma.SelectSubset<T, refresh_tokensUpdateArgs<ExtArgs>>): Prisma.Prisma__refresh_tokensClient<runtime.Types.Result.GetResult<Prisma.$refresh_tokensPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends refresh_tokensDeleteManyArgs>(args?: Prisma.SelectSubset<T, refresh_tokensDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends refresh_tokensUpdateManyArgs>(args: Prisma.SelectSubset<T, refresh_tokensUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends refresh_tokensUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, refresh_tokensUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$refresh_tokensPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends refresh_tokensUpsertArgs>(args: Prisma.SelectSubset<T, refresh_tokensUpsertArgs<ExtArgs>>): Prisma.Prisma__refresh_tokensClient<runtime.Types.Result.GetResult<Prisma.$refresh_tokensPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends refresh_tokensCountArgs>(args?: Prisma.Subset<T, refresh_tokensCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Refresh_tokensCountAggregateOutputType> : number>;
    aggregate<T extends Refresh_tokensAggregateArgs>(args: Prisma.Subset<T, Refresh_tokensAggregateArgs>): Prisma.PrismaPromise<GetRefresh_tokensAggregateType<T>>;
    groupBy<T extends refresh_tokensGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: refresh_tokensGroupByArgs['orderBy'];
    } : {
        orderBy?: refresh_tokensGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, refresh_tokensGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefresh_tokensGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: refresh_tokensFieldRefs;
}
export interface Prisma__refresh_tokensClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.usersDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.usersDefaultArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface refresh_tokensFieldRefs {
    readonly id: Prisma.FieldRef<"refresh_tokens", 'String'>;
    readonly user_id: Prisma.FieldRef<"refresh_tokens", 'String'>;
    readonly token_hash: Prisma.FieldRef<"refresh_tokens", 'String'>;
    readonly expires_at: Prisma.FieldRef<"refresh_tokens", 'DateTime'>;
    readonly revoked: Prisma.FieldRef<"refresh_tokens", 'Boolean'>;
    readonly revoked_at: Prisma.FieldRef<"refresh_tokens", 'DateTime'>;
    readonly created_at: Prisma.FieldRef<"refresh_tokens", 'DateTime'>;
}
export type refresh_tokensFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.refresh_tokensSelect<ExtArgs> | null;
    omit?: Prisma.refresh_tokensOmit<ExtArgs> | null;
    include?: Prisma.refresh_tokensInclude<ExtArgs> | null;
    where: Prisma.refresh_tokensWhereUniqueInput;
};
export type refresh_tokensFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.refresh_tokensSelect<ExtArgs> | null;
    omit?: Prisma.refresh_tokensOmit<ExtArgs> | null;
    include?: Prisma.refresh_tokensInclude<ExtArgs> | null;
    where: Prisma.refresh_tokensWhereUniqueInput;
};
export type refresh_tokensFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.refresh_tokensSelect<ExtArgs> | null;
    omit?: Prisma.refresh_tokensOmit<ExtArgs> | null;
    include?: Prisma.refresh_tokensInclude<ExtArgs> | null;
    where?: Prisma.refresh_tokensWhereInput;
    orderBy?: Prisma.refresh_tokensOrderByWithRelationInput | Prisma.refresh_tokensOrderByWithRelationInput[];
    cursor?: Prisma.refresh_tokensWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Refresh_tokensScalarFieldEnum | Prisma.Refresh_tokensScalarFieldEnum[];
};
export type refresh_tokensFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.refresh_tokensSelect<ExtArgs> | null;
    omit?: Prisma.refresh_tokensOmit<ExtArgs> | null;
    include?: Prisma.refresh_tokensInclude<ExtArgs> | null;
    where?: Prisma.refresh_tokensWhereInput;
    orderBy?: Prisma.refresh_tokensOrderByWithRelationInput | Prisma.refresh_tokensOrderByWithRelationInput[];
    cursor?: Prisma.refresh_tokensWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Refresh_tokensScalarFieldEnum | Prisma.Refresh_tokensScalarFieldEnum[];
};
export type refresh_tokensFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.refresh_tokensSelect<ExtArgs> | null;
    omit?: Prisma.refresh_tokensOmit<ExtArgs> | null;
    include?: Prisma.refresh_tokensInclude<ExtArgs> | null;
    where?: Prisma.refresh_tokensWhereInput;
    orderBy?: Prisma.refresh_tokensOrderByWithRelationInput | Prisma.refresh_tokensOrderByWithRelationInput[];
    cursor?: Prisma.refresh_tokensWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Refresh_tokensScalarFieldEnum | Prisma.Refresh_tokensScalarFieldEnum[];
};
export type refresh_tokensCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.refresh_tokensSelect<ExtArgs> | null;
    omit?: Prisma.refresh_tokensOmit<ExtArgs> | null;
    include?: Prisma.refresh_tokensInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.refresh_tokensCreateInput, Prisma.refresh_tokensUncheckedCreateInput>;
};
export type refresh_tokensCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.refresh_tokensCreateManyInput | Prisma.refresh_tokensCreateManyInput[];
    skipDuplicates?: boolean;
};
export type refresh_tokensCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.refresh_tokensSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.refresh_tokensOmit<ExtArgs> | null;
    data: Prisma.refresh_tokensCreateManyInput | Prisma.refresh_tokensCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.refresh_tokensIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type refresh_tokensUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.refresh_tokensSelect<ExtArgs> | null;
    omit?: Prisma.refresh_tokensOmit<ExtArgs> | null;
    include?: Prisma.refresh_tokensInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.refresh_tokensUpdateInput, Prisma.refresh_tokensUncheckedUpdateInput>;
    where: Prisma.refresh_tokensWhereUniqueInput;
};
export type refresh_tokensUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.refresh_tokensUpdateManyMutationInput, Prisma.refresh_tokensUncheckedUpdateManyInput>;
    where?: Prisma.refresh_tokensWhereInput;
    limit?: number;
};
export type refresh_tokensUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.refresh_tokensSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.refresh_tokensOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.refresh_tokensUpdateManyMutationInput, Prisma.refresh_tokensUncheckedUpdateManyInput>;
    where?: Prisma.refresh_tokensWhereInput;
    limit?: number;
    include?: Prisma.refresh_tokensIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type refresh_tokensUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.refresh_tokensSelect<ExtArgs> | null;
    omit?: Prisma.refresh_tokensOmit<ExtArgs> | null;
    include?: Prisma.refresh_tokensInclude<ExtArgs> | null;
    where: Prisma.refresh_tokensWhereUniqueInput;
    create: Prisma.XOR<Prisma.refresh_tokensCreateInput, Prisma.refresh_tokensUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.refresh_tokensUpdateInput, Prisma.refresh_tokensUncheckedUpdateInput>;
};
export type refresh_tokensDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.refresh_tokensSelect<ExtArgs> | null;
    omit?: Prisma.refresh_tokensOmit<ExtArgs> | null;
    include?: Prisma.refresh_tokensInclude<ExtArgs> | null;
    where: Prisma.refresh_tokensWhereUniqueInput;
};
export type refresh_tokensDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.refresh_tokensWhereInput;
    limit?: number;
};
export type refresh_tokensDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.refresh_tokensSelect<ExtArgs> | null;
    omit?: Prisma.refresh_tokensOmit<ExtArgs> | null;
    include?: Prisma.refresh_tokensInclude<ExtArgs> | null;
};
