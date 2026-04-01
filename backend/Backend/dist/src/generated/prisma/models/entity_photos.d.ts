import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type entity_photosModel = runtime.Types.Result.DefaultSelection<Prisma.$entity_photosPayload>;
export type AggregateEntity_photos = {
    _count: Entity_photosCountAggregateOutputType | null;
    _min: Entity_photosMinAggregateOutputType | null;
    _max: Entity_photosMaxAggregateOutputType | null;
};
export type Entity_photosMinAggregateOutputType = {
    id: string | null;
    entity_type: string | null;
    entity_id: string | null;
    file_id: string | null;
    photo_type: string | null;
    created_at: Date | null;
};
export type Entity_photosMaxAggregateOutputType = {
    id: string | null;
    entity_type: string | null;
    entity_id: string | null;
    file_id: string | null;
    photo_type: string | null;
    created_at: Date | null;
};
export type Entity_photosCountAggregateOutputType = {
    id: number;
    entity_type: number;
    entity_id: number;
    file_id: number;
    photo_type: number;
    created_at: number;
    _all: number;
};
export type Entity_photosMinAggregateInputType = {
    id?: true;
    entity_type?: true;
    entity_id?: true;
    file_id?: true;
    photo_type?: true;
    created_at?: true;
};
export type Entity_photosMaxAggregateInputType = {
    id?: true;
    entity_type?: true;
    entity_id?: true;
    file_id?: true;
    photo_type?: true;
    created_at?: true;
};
export type Entity_photosCountAggregateInputType = {
    id?: true;
    entity_type?: true;
    entity_id?: true;
    file_id?: true;
    photo_type?: true;
    created_at?: true;
    _all?: true;
};
export type Entity_photosAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.entity_photosWhereInput;
    orderBy?: Prisma.entity_photosOrderByWithRelationInput | Prisma.entity_photosOrderByWithRelationInput[];
    cursor?: Prisma.entity_photosWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Entity_photosCountAggregateInputType;
    _min?: Entity_photosMinAggregateInputType;
    _max?: Entity_photosMaxAggregateInputType;
};
export type GetEntity_photosAggregateType<T extends Entity_photosAggregateArgs> = {
    [P in keyof T & keyof AggregateEntity_photos]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEntity_photos[P]> : Prisma.GetScalarType<T[P], AggregateEntity_photos[P]>;
};
export type entity_photosGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.entity_photosWhereInput;
    orderBy?: Prisma.entity_photosOrderByWithAggregationInput | Prisma.entity_photosOrderByWithAggregationInput[];
    by: Prisma.Entity_photosScalarFieldEnum[] | Prisma.Entity_photosScalarFieldEnum;
    having?: Prisma.entity_photosScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Entity_photosCountAggregateInputType | true;
    _min?: Entity_photosMinAggregateInputType;
    _max?: Entity_photosMaxAggregateInputType;
};
export type Entity_photosGroupByOutputType = {
    id: string;
    entity_type: string;
    entity_id: string;
    file_id: string;
    photo_type: string | null;
    created_at: Date;
    _count: Entity_photosCountAggregateOutputType | null;
    _min: Entity_photosMinAggregateOutputType | null;
    _max: Entity_photosMaxAggregateOutputType | null;
};
export type GetEntity_photosGroupByPayload<T extends entity_photosGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Entity_photosGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Entity_photosGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Entity_photosGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Entity_photosGroupByOutputType[P]>;
}>>;
export type entity_photosWhereInput = {
    AND?: Prisma.entity_photosWhereInput | Prisma.entity_photosWhereInput[];
    OR?: Prisma.entity_photosWhereInput[];
    NOT?: Prisma.entity_photosWhereInput | Prisma.entity_photosWhereInput[];
    id?: Prisma.UuidFilter<"entity_photos"> | string;
    entity_type?: Prisma.StringFilter<"entity_photos"> | string;
    entity_id?: Prisma.UuidFilter<"entity_photos"> | string;
    file_id?: Prisma.UuidFilter<"entity_photos"> | string;
    photo_type?: Prisma.StringNullableFilter<"entity_photos"> | string | null;
    created_at?: Prisma.DateTimeFilter<"entity_photos"> | Date | string;
    files?: Prisma.XOR<Prisma.FilesScalarRelationFilter, Prisma.filesWhereInput>;
};
export type entity_photosOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    entity_type?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    file_id?: Prisma.SortOrder;
    photo_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    files?: Prisma.filesOrderByWithRelationInput;
};
export type entity_photosWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.entity_photosWhereInput | Prisma.entity_photosWhereInput[];
    OR?: Prisma.entity_photosWhereInput[];
    NOT?: Prisma.entity_photosWhereInput | Prisma.entity_photosWhereInput[];
    entity_type?: Prisma.StringFilter<"entity_photos"> | string;
    entity_id?: Prisma.UuidFilter<"entity_photos"> | string;
    file_id?: Prisma.UuidFilter<"entity_photos"> | string;
    photo_type?: Prisma.StringNullableFilter<"entity_photos"> | string | null;
    created_at?: Prisma.DateTimeFilter<"entity_photos"> | Date | string;
    files?: Prisma.XOR<Prisma.FilesScalarRelationFilter, Prisma.filesWhereInput>;
}, "id">;
export type entity_photosOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    entity_type?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    file_id?: Prisma.SortOrder;
    photo_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.entity_photosCountOrderByAggregateInput;
    _max?: Prisma.entity_photosMaxOrderByAggregateInput;
    _min?: Prisma.entity_photosMinOrderByAggregateInput;
};
export type entity_photosScalarWhereWithAggregatesInput = {
    AND?: Prisma.entity_photosScalarWhereWithAggregatesInput | Prisma.entity_photosScalarWhereWithAggregatesInput[];
    OR?: Prisma.entity_photosScalarWhereWithAggregatesInput[];
    NOT?: Prisma.entity_photosScalarWhereWithAggregatesInput | Prisma.entity_photosScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"entity_photos"> | string;
    entity_type?: Prisma.StringWithAggregatesFilter<"entity_photos"> | string;
    entity_id?: Prisma.UuidWithAggregatesFilter<"entity_photos"> | string;
    file_id?: Prisma.UuidWithAggregatesFilter<"entity_photos"> | string;
    photo_type?: Prisma.StringNullableWithAggregatesFilter<"entity_photos"> | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"entity_photos"> | Date | string;
};
export type entity_photosCreateInput = {
    id?: string;
    entity_type: string;
    entity_id: string;
    photo_type?: string | null;
    created_at?: Date | string;
    files: Prisma.filesCreateNestedOneWithoutEntity_photosInput;
};
export type entity_photosUncheckedCreateInput = {
    id?: string;
    entity_type: string;
    entity_id: string;
    file_id: string;
    photo_type?: string | null;
    created_at?: Date | string;
};
export type entity_photosUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entity_type?: Prisma.StringFieldUpdateOperationsInput | string;
    entity_id?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    files?: Prisma.filesUpdateOneRequiredWithoutEntity_photosNestedInput;
};
export type entity_photosUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entity_type?: Prisma.StringFieldUpdateOperationsInput | string;
    entity_id?: Prisma.StringFieldUpdateOperationsInput | string;
    file_id?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type entity_photosCreateManyInput = {
    id?: string;
    entity_type: string;
    entity_id: string;
    file_id: string;
    photo_type?: string | null;
    created_at?: Date | string;
};
export type entity_photosUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entity_type?: Prisma.StringFieldUpdateOperationsInput | string;
    entity_id?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type entity_photosUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entity_type?: Prisma.StringFieldUpdateOperationsInput | string;
    entity_id?: Prisma.StringFieldUpdateOperationsInput | string;
    file_id?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type entity_photosCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    entity_type?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    file_id?: Prisma.SortOrder;
    photo_type?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type entity_photosMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    entity_type?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    file_id?: Prisma.SortOrder;
    photo_type?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type entity_photosMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    entity_type?: Prisma.SortOrder;
    entity_id?: Prisma.SortOrder;
    file_id?: Prisma.SortOrder;
    photo_type?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type Entity_photosListRelationFilter = {
    every?: Prisma.entity_photosWhereInput;
    some?: Prisma.entity_photosWhereInput;
    none?: Prisma.entity_photosWhereInput;
};
export type entity_photosOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type entity_photosCreateNestedManyWithoutFilesInput = {
    create?: Prisma.XOR<Prisma.entity_photosCreateWithoutFilesInput, Prisma.entity_photosUncheckedCreateWithoutFilesInput> | Prisma.entity_photosCreateWithoutFilesInput[] | Prisma.entity_photosUncheckedCreateWithoutFilesInput[];
    connectOrCreate?: Prisma.entity_photosCreateOrConnectWithoutFilesInput | Prisma.entity_photosCreateOrConnectWithoutFilesInput[];
    createMany?: Prisma.entity_photosCreateManyFilesInputEnvelope;
    connect?: Prisma.entity_photosWhereUniqueInput | Prisma.entity_photosWhereUniqueInput[];
};
export type entity_photosUncheckedCreateNestedManyWithoutFilesInput = {
    create?: Prisma.XOR<Prisma.entity_photosCreateWithoutFilesInput, Prisma.entity_photosUncheckedCreateWithoutFilesInput> | Prisma.entity_photosCreateWithoutFilesInput[] | Prisma.entity_photosUncheckedCreateWithoutFilesInput[];
    connectOrCreate?: Prisma.entity_photosCreateOrConnectWithoutFilesInput | Prisma.entity_photosCreateOrConnectWithoutFilesInput[];
    createMany?: Prisma.entity_photosCreateManyFilesInputEnvelope;
    connect?: Prisma.entity_photosWhereUniqueInput | Prisma.entity_photosWhereUniqueInput[];
};
export type entity_photosUpdateManyWithoutFilesNestedInput = {
    create?: Prisma.XOR<Prisma.entity_photosCreateWithoutFilesInput, Prisma.entity_photosUncheckedCreateWithoutFilesInput> | Prisma.entity_photosCreateWithoutFilesInput[] | Prisma.entity_photosUncheckedCreateWithoutFilesInput[];
    connectOrCreate?: Prisma.entity_photosCreateOrConnectWithoutFilesInput | Prisma.entity_photosCreateOrConnectWithoutFilesInput[];
    upsert?: Prisma.entity_photosUpsertWithWhereUniqueWithoutFilesInput | Prisma.entity_photosUpsertWithWhereUniqueWithoutFilesInput[];
    createMany?: Prisma.entity_photosCreateManyFilesInputEnvelope;
    set?: Prisma.entity_photosWhereUniqueInput | Prisma.entity_photosWhereUniqueInput[];
    disconnect?: Prisma.entity_photosWhereUniqueInput | Prisma.entity_photosWhereUniqueInput[];
    delete?: Prisma.entity_photosWhereUniqueInput | Prisma.entity_photosWhereUniqueInput[];
    connect?: Prisma.entity_photosWhereUniqueInput | Prisma.entity_photosWhereUniqueInput[];
    update?: Prisma.entity_photosUpdateWithWhereUniqueWithoutFilesInput | Prisma.entity_photosUpdateWithWhereUniqueWithoutFilesInput[];
    updateMany?: Prisma.entity_photosUpdateManyWithWhereWithoutFilesInput | Prisma.entity_photosUpdateManyWithWhereWithoutFilesInput[];
    deleteMany?: Prisma.entity_photosScalarWhereInput | Prisma.entity_photosScalarWhereInput[];
};
export type entity_photosUncheckedUpdateManyWithoutFilesNestedInput = {
    create?: Prisma.XOR<Prisma.entity_photosCreateWithoutFilesInput, Prisma.entity_photosUncheckedCreateWithoutFilesInput> | Prisma.entity_photosCreateWithoutFilesInput[] | Prisma.entity_photosUncheckedCreateWithoutFilesInput[];
    connectOrCreate?: Prisma.entity_photosCreateOrConnectWithoutFilesInput | Prisma.entity_photosCreateOrConnectWithoutFilesInput[];
    upsert?: Prisma.entity_photosUpsertWithWhereUniqueWithoutFilesInput | Prisma.entity_photosUpsertWithWhereUniqueWithoutFilesInput[];
    createMany?: Prisma.entity_photosCreateManyFilesInputEnvelope;
    set?: Prisma.entity_photosWhereUniqueInput | Prisma.entity_photosWhereUniqueInput[];
    disconnect?: Prisma.entity_photosWhereUniqueInput | Prisma.entity_photosWhereUniqueInput[];
    delete?: Prisma.entity_photosWhereUniqueInput | Prisma.entity_photosWhereUniqueInput[];
    connect?: Prisma.entity_photosWhereUniqueInput | Prisma.entity_photosWhereUniqueInput[];
    update?: Prisma.entity_photosUpdateWithWhereUniqueWithoutFilesInput | Prisma.entity_photosUpdateWithWhereUniqueWithoutFilesInput[];
    updateMany?: Prisma.entity_photosUpdateManyWithWhereWithoutFilesInput | Prisma.entity_photosUpdateManyWithWhereWithoutFilesInput[];
    deleteMany?: Prisma.entity_photosScalarWhereInput | Prisma.entity_photosScalarWhereInput[];
};
export type entity_photosCreateWithoutFilesInput = {
    id?: string;
    entity_type: string;
    entity_id: string;
    photo_type?: string | null;
    created_at?: Date | string;
};
export type entity_photosUncheckedCreateWithoutFilesInput = {
    id?: string;
    entity_type: string;
    entity_id: string;
    photo_type?: string | null;
    created_at?: Date | string;
};
export type entity_photosCreateOrConnectWithoutFilesInput = {
    where: Prisma.entity_photosWhereUniqueInput;
    create: Prisma.XOR<Prisma.entity_photosCreateWithoutFilesInput, Prisma.entity_photosUncheckedCreateWithoutFilesInput>;
};
export type entity_photosCreateManyFilesInputEnvelope = {
    data: Prisma.entity_photosCreateManyFilesInput | Prisma.entity_photosCreateManyFilesInput[];
    skipDuplicates?: boolean;
};
export type entity_photosUpsertWithWhereUniqueWithoutFilesInput = {
    where: Prisma.entity_photosWhereUniqueInput;
    update: Prisma.XOR<Prisma.entity_photosUpdateWithoutFilesInput, Prisma.entity_photosUncheckedUpdateWithoutFilesInput>;
    create: Prisma.XOR<Prisma.entity_photosCreateWithoutFilesInput, Prisma.entity_photosUncheckedCreateWithoutFilesInput>;
};
export type entity_photosUpdateWithWhereUniqueWithoutFilesInput = {
    where: Prisma.entity_photosWhereUniqueInput;
    data: Prisma.XOR<Prisma.entity_photosUpdateWithoutFilesInput, Prisma.entity_photosUncheckedUpdateWithoutFilesInput>;
};
export type entity_photosUpdateManyWithWhereWithoutFilesInput = {
    where: Prisma.entity_photosScalarWhereInput;
    data: Prisma.XOR<Prisma.entity_photosUpdateManyMutationInput, Prisma.entity_photosUncheckedUpdateManyWithoutFilesInput>;
};
export type entity_photosScalarWhereInput = {
    AND?: Prisma.entity_photosScalarWhereInput | Prisma.entity_photosScalarWhereInput[];
    OR?: Prisma.entity_photosScalarWhereInput[];
    NOT?: Prisma.entity_photosScalarWhereInput | Prisma.entity_photosScalarWhereInput[];
    id?: Prisma.UuidFilter<"entity_photos"> | string;
    entity_type?: Prisma.StringFilter<"entity_photos"> | string;
    entity_id?: Prisma.UuidFilter<"entity_photos"> | string;
    file_id?: Prisma.UuidFilter<"entity_photos"> | string;
    photo_type?: Prisma.StringNullableFilter<"entity_photos"> | string | null;
    created_at?: Prisma.DateTimeFilter<"entity_photos"> | Date | string;
};
export type entity_photosCreateManyFilesInput = {
    id?: string;
    entity_type: string;
    entity_id: string;
    photo_type?: string | null;
    created_at?: Date | string;
};
export type entity_photosUpdateWithoutFilesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entity_type?: Prisma.StringFieldUpdateOperationsInput | string;
    entity_id?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type entity_photosUncheckedUpdateWithoutFilesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entity_type?: Prisma.StringFieldUpdateOperationsInput | string;
    entity_id?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type entity_photosUncheckedUpdateManyWithoutFilesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    entity_type?: Prisma.StringFieldUpdateOperationsInput | string;
    entity_id?: Prisma.StringFieldUpdateOperationsInput | string;
    photo_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type entity_photosSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    entity_type?: boolean;
    entity_id?: boolean;
    file_id?: boolean;
    photo_type?: boolean;
    created_at?: boolean;
    files?: boolean | Prisma.filesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["entity_photos"]>;
export type entity_photosSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    entity_type?: boolean;
    entity_id?: boolean;
    file_id?: boolean;
    photo_type?: boolean;
    created_at?: boolean;
    files?: boolean | Prisma.filesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["entity_photos"]>;
export type entity_photosSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    entity_type?: boolean;
    entity_id?: boolean;
    file_id?: boolean;
    photo_type?: boolean;
    created_at?: boolean;
    files?: boolean | Prisma.filesDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["entity_photos"]>;
export type entity_photosSelectScalar = {
    id?: boolean;
    entity_type?: boolean;
    entity_id?: boolean;
    file_id?: boolean;
    photo_type?: boolean;
    created_at?: boolean;
};
export type entity_photosOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "entity_type" | "entity_id" | "file_id" | "photo_type" | "created_at", ExtArgs["result"]["entity_photos"]>;
export type entity_photosInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    files?: boolean | Prisma.filesDefaultArgs<ExtArgs>;
};
export type entity_photosIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    files?: boolean | Prisma.filesDefaultArgs<ExtArgs>;
};
export type entity_photosIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    files?: boolean | Prisma.filesDefaultArgs<ExtArgs>;
};
export type $entity_photosPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "entity_photos";
    objects: {
        files: Prisma.$filesPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        entity_type: string;
        entity_id: string;
        file_id: string;
        photo_type: string | null;
        created_at: Date;
    }, ExtArgs["result"]["entity_photos"]>;
    composites: {};
};
export type entity_photosGetPayload<S extends boolean | null | undefined | entity_photosDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$entity_photosPayload, S>;
export type entity_photosCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<entity_photosFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Entity_photosCountAggregateInputType | true;
};
export interface entity_photosDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['entity_photos'];
        meta: {
            name: 'entity_photos';
        };
    };
    findUnique<T extends entity_photosFindUniqueArgs>(args: Prisma.SelectSubset<T, entity_photosFindUniqueArgs<ExtArgs>>): Prisma.Prisma__entity_photosClient<runtime.Types.Result.GetResult<Prisma.$entity_photosPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends entity_photosFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, entity_photosFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__entity_photosClient<runtime.Types.Result.GetResult<Prisma.$entity_photosPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends entity_photosFindFirstArgs>(args?: Prisma.SelectSubset<T, entity_photosFindFirstArgs<ExtArgs>>): Prisma.Prisma__entity_photosClient<runtime.Types.Result.GetResult<Prisma.$entity_photosPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends entity_photosFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, entity_photosFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__entity_photosClient<runtime.Types.Result.GetResult<Prisma.$entity_photosPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends entity_photosFindManyArgs>(args?: Prisma.SelectSubset<T, entity_photosFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$entity_photosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends entity_photosCreateArgs>(args: Prisma.SelectSubset<T, entity_photosCreateArgs<ExtArgs>>): Prisma.Prisma__entity_photosClient<runtime.Types.Result.GetResult<Prisma.$entity_photosPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends entity_photosCreateManyArgs>(args?: Prisma.SelectSubset<T, entity_photosCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends entity_photosCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, entity_photosCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$entity_photosPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends entity_photosDeleteArgs>(args: Prisma.SelectSubset<T, entity_photosDeleteArgs<ExtArgs>>): Prisma.Prisma__entity_photosClient<runtime.Types.Result.GetResult<Prisma.$entity_photosPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends entity_photosUpdateArgs>(args: Prisma.SelectSubset<T, entity_photosUpdateArgs<ExtArgs>>): Prisma.Prisma__entity_photosClient<runtime.Types.Result.GetResult<Prisma.$entity_photosPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends entity_photosDeleteManyArgs>(args?: Prisma.SelectSubset<T, entity_photosDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends entity_photosUpdateManyArgs>(args: Prisma.SelectSubset<T, entity_photosUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends entity_photosUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, entity_photosUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$entity_photosPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends entity_photosUpsertArgs>(args: Prisma.SelectSubset<T, entity_photosUpsertArgs<ExtArgs>>): Prisma.Prisma__entity_photosClient<runtime.Types.Result.GetResult<Prisma.$entity_photosPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends entity_photosCountArgs>(args?: Prisma.Subset<T, entity_photosCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Entity_photosCountAggregateOutputType> : number>;
    aggregate<T extends Entity_photosAggregateArgs>(args: Prisma.Subset<T, Entity_photosAggregateArgs>): Prisma.PrismaPromise<GetEntity_photosAggregateType<T>>;
    groupBy<T extends entity_photosGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: entity_photosGroupByArgs['orderBy'];
    } : {
        orderBy?: entity_photosGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, entity_photosGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEntity_photosGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: entity_photosFieldRefs;
}
export interface Prisma__entity_photosClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    files<T extends Prisma.filesDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.filesDefaultArgs<ExtArgs>>): Prisma.Prisma__filesClient<runtime.Types.Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface entity_photosFieldRefs {
    readonly id: Prisma.FieldRef<"entity_photos", 'String'>;
    readonly entity_type: Prisma.FieldRef<"entity_photos", 'String'>;
    readonly entity_id: Prisma.FieldRef<"entity_photos", 'String'>;
    readonly file_id: Prisma.FieldRef<"entity_photos", 'String'>;
    readonly photo_type: Prisma.FieldRef<"entity_photos", 'String'>;
    readonly created_at: Prisma.FieldRef<"entity_photos", 'DateTime'>;
}
export type entity_photosFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.entity_photosSelect<ExtArgs> | null;
    omit?: Prisma.entity_photosOmit<ExtArgs> | null;
    include?: Prisma.entity_photosInclude<ExtArgs> | null;
    where: Prisma.entity_photosWhereUniqueInput;
};
export type entity_photosFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.entity_photosSelect<ExtArgs> | null;
    omit?: Prisma.entity_photosOmit<ExtArgs> | null;
    include?: Prisma.entity_photosInclude<ExtArgs> | null;
    where: Prisma.entity_photosWhereUniqueInput;
};
export type entity_photosFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.entity_photosSelect<ExtArgs> | null;
    omit?: Prisma.entity_photosOmit<ExtArgs> | null;
    include?: Prisma.entity_photosInclude<ExtArgs> | null;
    where?: Prisma.entity_photosWhereInput;
    orderBy?: Prisma.entity_photosOrderByWithRelationInput | Prisma.entity_photosOrderByWithRelationInput[];
    cursor?: Prisma.entity_photosWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Entity_photosScalarFieldEnum | Prisma.Entity_photosScalarFieldEnum[];
};
export type entity_photosFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.entity_photosSelect<ExtArgs> | null;
    omit?: Prisma.entity_photosOmit<ExtArgs> | null;
    include?: Prisma.entity_photosInclude<ExtArgs> | null;
    where?: Prisma.entity_photosWhereInput;
    orderBy?: Prisma.entity_photosOrderByWithRelationInput | Prisma.entity_photosOrderByWithRelationInput[];
    cursor?: Prisma.entity_photosWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Entity_photosScalarFieldEnum | Prisma.Entity_photosScalarFieldEnum[];
};
export type entity_photosFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.entity_photosSelect<ExtArgs> | null;
    omit?: Prisma.entity_photosOmit<ExtArgs> | null;
    include?: Prisma.entity_photosInclude<ExtArgs> | null;
    where?: Prisma.entity_photosWhereInput;
    orderBy?: Prisma.entity_photosOrderByWithRelationInput | Prisma.entity_photosOrderByWithRelationInput[];
    cursor?: Prisma.entity_photosWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Entity_photosScalarFieldEnum | Prisma.Entity_photosScalarFieldEnum[];
};
export type entity_photosCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.entity_photosSelect<ExtArgs> | null;
    omit?: Prisma.entity_photosOmit<ExtArgs> | null;
    include?: Prisma.entity_photosInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.entity_photosCreateInput, Prisma.entity_photosUncheckedCreateInput>;
};
export type entity_photosCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.entity_photosCreateManyInput | Prisma.entity_photosCreateManyInput[];
    skipDuplicates?: boolean;
};
export type entity_photosCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.entity_photosSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.entity_photosOmit<ExtArgs> | null;
    data: Prisma.entity_photosCreateManyInput | Prisma.entity_photosCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.entity_photosIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type entity_photosUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.entity_photosSelect<ExtArgs> | null;
    omit?: Prisma.entity_photosOmit<ExtArgs> | null;
    include?: Prisma.entity_photosInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.entity_photosUpdateInput, Prisma.entity_photosUncheckedUpdateInput>;
    where: Prisma.entity_photosWhereUniqueInput;
};
export type entity_photosUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.entity_photosUpdateManyMutationInput, Prisma.entity_photosUncheckedUpdateManyInput>;
    where?: Prisma.entity_photosWhereInput;
    limit?: number;
};
export type entity_photosUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.entity_photosSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.entity_photosOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.entity_photosUpdateManyMutationInput, Prisma.entity_photosUncheckedUpdateManyInput>;
    where?: Prisma.entity_photosWhereInput;
    limit?: number;
    include?: Prisma.entity_photosIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type entity_photosUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.entity_photosSelect<ExtArgs> | null;
    omit?: Prisma.entity_photosOmit<ExtArgs> | null;
    include?: Prisma.entity_photosInclude<ExtArgs> | null;
    where: Prisma.entity_photosWhereUniqueInput;
    create: Prisma.XOR<Prisma.entity_photosCreateInput, Prisma.entity_photosUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.entity_photosUpdateInput, Prisma.entity_photosUncheckedUpdateInput>;
};
export type entity_photosDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.entity_photosSelect<ExtArgs> | null;
    omit?: Prisma.entity_photosOmit<ExtArgs> | null;
    include?: Prisma.entity_photosInclude<ExtArgs> | null;
    where: Prisma.entity_photosWhereUniqueInput;
};
export type entity_photosDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.entity_photosWhereInput;
    limit?: number;
};
export type entity_photosDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.entity_photosSelect<ExtArgs> | null;
    omit?: Prisma.entity_photosOmit<ExtArgs> | null;
    include?: Prisma.entity_photosInclude<ExtArgs> | null;
};
