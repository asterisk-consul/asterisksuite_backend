import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type filesModel = runtime.Types.Result.DefaultSelection<Prisma.$filesPayload>;
export type AggregateFiles = {
    _count: FilesCountAggregateOutputType | null;
    _avg: FilesAvgAggregateOutputType | null;
    _sum: FilesSumAggregateOutputType | null;
    _min: FilesMinAggregateOutputType | null;
    _max: FilesMaxAggregateOutputType | null;
};
export type FilesAvgAggregateOutputType = {
    file_size: number | null;
};
export type FilesSumAggregateOutputType = {
    file_size: number | null;
};
export type FilesMinAggregateOutputType = {
    id: string | null;
    storage_provider: string | null;
    file_path: string | null;
    public_url: string | null;
    file_name: string | null;
    mime_type: string | null;
    file_size: number | null;
    uploaded_by: string | null;
    created_at: Date | null;
};
export type FilesMaxAggregateOutputType = {
    id: string | null;
    storage_provider: string | null;
    file_path: string | null;
    public_url: string | null;
    file_name: string | null;
    mime_type: string | null;
    file_size: number | null;
    uploaded_by: string | null;
    created_at: Date | null;
};
export type FilesCountAggregateOutputType = {
    id: number;
    storage_provider: number;
    file_path: number;
    public_url: number;
    file_name: number;
    mime_type: number;
    file_size: number;
    uploaded_by: number;
    created_at: number;
    _all: number;
};
export type FilesAvgAggregateInputType = {
    file_size?: true;
};
export type FilesSumAggregateInputType = {
    file_size?: true;
};
export type FilesMinAggregateInputType = {
    id?: true;
    storage_provider?: true;
    file_path?: true;
    public_url?: true;
    file_name?: true;
    mime_type?: true;
    file_size?: true;
    uploaded_by?: true;
    created_at?: true;
};
export type FilesMaxAggregateInputType = {
    id?: true;
    storage_provider?: true;
    file_path?: true;
    public_url?: true;
    file_name?: true;
    mime_type?: true;
    file_size?: true;
    uploaded_by?: true;
    created_at?: true;
};
export type FilesCountAggregateInputType = {
    id?: true;
    storage_provider?: true;
    file_path?: true;
    public_url?: true;
    file_name?: true;
    mime_type?: true;
    file_size?: true;
    uploaded_by?: true;
    created_at?: true;
    _all?: true;
};
export type FilesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.filesWhereInput;
    orderBy?: Prisma.filesOrderByWithRelationInput | Prisma.filesOrderByWithRelationInput[];
    cursor?: Prisma.filesWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | FilesCountAggregateInputType;
    _avg?: FilesAvgAggregateInputType;
    _sum?: FilesSumAggregateInputType;
    _min?: FilesMinAggregateInputType;
    _max?: FilesMaxAggregateInputType;
};
export type GetFilesAggregateType<T extends FilesAggregateArgs> = {
    [P in keyof T & keyof AggregateFiles]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFiles[P]> : Prisma.GetScalarType<T[P], AggregateFiles[P]>;
};
export type filesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.filesWhereInput;
    orderBy?: Prisma.filesOrderByWithAggregationInput | Prisma.filesOrderByWithAggregationInput[];
    by: Prisma.FilesScalarFieldEnum[] | Prisma.FilesScalarFieldEnum;
    having?: Prisma.filesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FilesCountAggregateInputType | true;
    _avg?: FilesAvgAggregateInputType;
    _sum?: FilesSumAggregateInputType;
    _min?: FilesMinAggregateInputType;
    _max?: FilesMaxAggregateInputType;
};
export type FilesGroupByOutputType = {
    id: string;
    storage_provider: string | null;
    file_path: string;
    public_url: string | null;
    file_name: string | null;
    mime_type: string | null;
    file_size: number | null;
    uploaded_by: string | null;
    created_at: Date;
    _count: FilesCountAggregateOutputType | null;
    _avg: FilesAvgAggregateOutputType | null;
    _sum: FilesSumAggregateOutputType | null;
    _min: FilesMinAggregateOutputType | null;
    _max: FilesMaxAggregateOutputType | null;
};
export type GetFilesGroupByPayload<T extends filesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FilesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FilesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FilesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FilesGroupByOutputType[P]>;
}>>;
export type filesWhereInput = {
    AND?: Prisma.filesWhereInput | Prisma.filesWhereInput[];
    OR?: Prisma.filesWhereInput[];
    NOT?: Prisma.filesWhereInput | Prisma.filesWhereInput[];
    id?: Prisma.UuidFilter<"files"> | string;
    storage_provider?: Prisma.StringNullableFilter<"files"> | string | null;
    file_path?: Prisma.StringFilter<"files"> | string;
    public_url?: Prisma.StringNullableFilter<"files"> | string | null;
    file_name?: Prisma.StringNullableFilter<"files"> | string | null;
    mime_type?: Prisma.StringNullableFilter<"files"> | string | null;
    file_size?: Prisma.IntNullableFilter<"files"> | number | null;
    uploaded_by?: Prisma.UuidNullableFilter<"files"> | string | null;
    created_at?: Prisma.DateTimeFilter<"files"> | Date | string;
    entity_photos?: Prisma.Entity_photosListRelationFilter;
    users?: Prisma.XOR<Prisma.UsersNullableScalarRelationFilter, Prisma.usersWhereInput> | null;
};
export type filesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    storage_provider?: Prisma.SortOrderInput | Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    public_url?: Prisma.SortOrderInput | Prisma.SortOrder;
    file_name?: Prisma.SortOrderInput | Prisma.SortOrder;
    mime_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    file_size?: Prisma.SortOrderInput | Prisma.SortOrder;
    uploaded_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    entity_photos?: Prisma.entity_photosOrderByRelationAggregateInput;
    users?: Prisma.usersOrderByWithRelationInput;
};
export type filesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.filesWhereInput | Prisma.filesWhereInput[];
    OR?: Prisma.filesWhereInput[];
    NOT?: Prisma.filesWhereInput | Prisma.filesWhereInput[];
    storage_provider?: Prisma.StringNullableFilter<"files"> | string | null;
    file_path?: Prisma.StringFilter<"files"> | string;
    public_url?: Prisma.StringNullableFilter<"files"> | string | null;
    file_name?: Prisma.StringNullableFilter<"files"> | string | null;
    mime_type?: Prisma.StringNullableFilter<"files"> | string | null;
    file_size?: Prisma.IntNullableFilter<"files"> | number | null;
    uploaded_by?: Prisma.UuidNullableFilter<"files"> | string | null;
    created_at?: Prisma.DateTimeFilter<"files"> | Date | string;
    entity_photos?: Prisma.Entity_photosListRelationFilter;
    users?: Prisma.XOR<Prisma.UsersNullableScalarRelationFilter, Prisma.usersWhereInput> | null;
}, "id">;
export type filesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    storage_provider?: Prisma.SortOrderInput | Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    public_url?: Prisma.SortOrderInput | Prisma.SortOrder;
    file_name?: Prisma.SortOrderInput | Prisma.SortOrder;
    mime_type?: Prisma.SortOrderInput | Prisma.SortOrder;
    file_size?: Prisma.SortOrderInput | Prisma.SortOrder;
    uploaded_by?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.filesCountOrderByAggregateInput;
    _avg?: Prisma.filesAvgOrderByAggregateInput;
    _max?: Prisma.filesMaxOrderByAggregateInput;
    _min?: Prisma.filesMinOrderByAggregateInput;
    _sum?: Prisma.filesSumOrderByAggregateInput;
};
export type filesScalarWhereWithAggregatesInput = {
    AND?: Prisma.filesScalarWhereWithAggregatesInput | Prisma.filesScalarWhereWithAggregatesInput[];
    OR?: Prisma.filesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.filesScalarWhereWithAggregatesInput | Prisma.filesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"files"> | string;
    storage_provider?: Prisma.StringNullableWithAggregatesFilter<"files"> | string | null;
    file_path?: Prisma.StringWithAggregatesFilter<"files"> | string;
    public_url?: Prisma.StringNullableWithAggregatesFilter<"files"> | string | null;
    file_name?: Prisma.StringNullableWithAggregatesFilter<"files"> | string | null;
    mime_type?: Prisma.StringNullableWithAggregatesFilter<"files"> | string | null;
    file_size?: Prisma.IntNullableWithAggregatesFilter<"files"> | number | null;
    uploaded_by?: Prisma.UuidNullableWithAggregatesFilter<"files"> | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"files"> | Date | string;
};
export type filesCreateInput = {
    id?: string;
    storage_provider?: string | null;
    file_path: string;
    public_url?: string | null;
    file_name?: string | null;
    mime_type?: string | null;
    file_size?: number | null;
    created_at?: Date | string;
    entity_photos?: Prisma.entity_photosCreateNestedManyWithoutFilesInput;
    users?: Prisma.usersCreateNestedOneWithoutFilesInput;
};
export type filesUncheckedCreateInput = {
    id?: string;
    storage_provider?: string | null;
    file_path: string;
    public_url?: string | null;
    file_name?: string | null;
    mime_type?: string | null;
    file_size?: number | null;
    uploaded_by?: string | null;
    created_at?: Date | string;
    entity_photos?: Prisma.entity_photosUncheckedCreateNestedManyWithoutFilesInput;
};
export type filesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    storage_provider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    public_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mime_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_size?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entity_photos?: Prisma.entity_photosUpdateManyWithoutFilesNestedInput;
    users?: Prisma.usersUpdateOneWithoutFilesNestedInput;
};
export type filesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    storage_provider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    public_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mime_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_size?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uploaded_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entity_photos?: Prisma.entity_photosUncheckedUpdateManyWithoutFilesNestedInput;
};
export type filesCreateManyInput = {
    id?: string;
    storage_provider?: string | null;
    file_path: string;
    public_url?: string | null;
    file_name?: string | null;
    mime_type?: string | null;
    file_size?: number | null;
    uploaded_by?: string | null;
    created_at?: Date | string;
};
export type filesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    storage_provider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    public_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mime_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_size?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type filesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    storage_provider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    public_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mime_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_size?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uploaded_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FilesScalarRelationFilter = {
    is?: Prisma.filesWhereInput;
    isNot?: Prisma.filesWhereInput;
};
export type filesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    storage_provider?: Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    public_url?: Prisma.SortOrder;
    file_name?: Prisma.SortOrder;
    mime_type?: Prisma.SortOrder;
    file_size?: Prisma.SortOrder;
    uploaded_by?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type filesAvgOrderByAggregateInput = {
    file_size?: Prisma.SortOrder;
};
export type filesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    storage_provider?: Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    public_url?: Prisma.SortOrder;
    file_name?: Prisma.SortOrder;
    mime_type?: Prisma.SortOrder;
    file_size?: Prisma.SortOrder;
    uploaded_by?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type filesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    storage_provider?: Prisma.SortOrder;
    file_path?: Prisma.SortOrder;
    public_url?: Prisma.SortOrder;
    file_name?: Prisma.SortOrder;
    mime_type?: Prisma.SortOrder;
    file_size?: Prisma.SortOrder;
    uploaded_by?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type filesSumOrderByAggregateInput = {
    file_size?: Prisma.SortOrder;
};
export type FilesListRelationFilter = {
    every?: Prisma.filesWhereInput;
    some?: Prisma.filesWhereInput;
    none?: Prisma.filesWhereInput;
};
export type filesOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type filesCreateNestedOneWithoutEntity_photosInput = {
    create?: Prisma.XOR<Prisma.filesCreateWithoutEntity_photosInput, Prisma.filesUncheckedCreateWithoutEntity_photosInput>;
    connectOrCreate?: Prisma.filesCreateOrConnectWithoutEntity_photosInput;
    connect?: Prisma.filesWhereUniqueInput;
};
export type filesUpdateOneRequiredWithoutEntity_photosNestedInput = {
    create?: Prisma.XOR<Prisma.filesCreateWithoutEntity_photosInput, Prisma.filesUncheckedCreateWithoutEntity_photosInput>;
    connectOrCreate?: Prisma.filesCreateOrConnectWithoutEntity_photosInput;
    upsert?: Prisma.filesUpsertWithoutEntity_photosInput;
    connect?: Prisma.filesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.filesUpdateToOneWithWhereWithoutEntity_photosInput, Prisma.filesUpdateWithoutEntity_photosInput>, Prisma.filesUncheckedUpdateWithoutEntity_photosInput>;
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type filesCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.filesCreateWithoutUsersInput, Prisma.filesUncheckedCreateWithoutUsersInput> | Prisma.filesCreateWithoutUsersInput[] | Prisma.filesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.filesCreateOrConnectWithoutUsersInput | Prisma.filesCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.filesCreateManyUsersInputEnvelope;
    connect?: Prisma.filesWhereUniqueInput | Prisma.filesWhereUniqueInput[];
};
export type filesUncheckedCreateNestedManyWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.filesCreateWithoutUsersInput, Prisma.filesUncheckedCreateWithoutUsersInput> | Prisma.filesCreateWithoutUsersInput[] | Prisma.filesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.filesCreateOrConnectWithoutUsersInput | Prisma.filesCreateOrConnectWithoutUsersInput[];
    createMany?: Prisma.filesCreateManyUsersInputEnvelope;
    connect?: Prisma.filesWhereUniqueInput | Prisma.filesWhereUniqueInput[];
};
export type filesUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.filesCreateWithoutUsersInput, Prisma.filesUncheckedCreateWithoutUsersInput> | Prisma.filesCreateWithoutUsersInput[] | Prisma.filesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.filesCreateOrConnectWithoutUsersInput | Prisma.filesCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.filesUpsertWithWhereUniqueWithoutUsersInput | Prisma.filesUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.filesCreateManyUsersInputEnvelope;
    set?: Prisma.filesWhereUniqueInput | Prisma.filesWhereUniqueInput[];
    disconnect?: Prisma.filesWhereUniqueInput | Prisma.filesWhereUniqueInput[];
    delete?: Prisma.filesWhereUniqueInput | Prisma.filesWhereUniqueInput[];
    connect?: Prisma.filesWhereUniqueInput | Prisma.filesWhereUniqueInput[];
    update?: Prisma.filesUpdateWithWhereUniqueWithoutUsersInput | Prisma.filesUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.filesUpdateManyWithWhereWithoutUsersInput | Prisma.filesUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.filesScalarWhereInput | Prisma.filesScalarWhereInput[];
};
export type filesUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.filesCreateWithoutUsersInput, Prisma.filesUncheckedCreateWithoutUsersInput> | Prisma.filesCreateWithoutUsersInput[] | Prisma.filesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?: Prisma.filesCreateOrConnectWithoutUsersInput | Prisma.filesCreateOrConnectWithoutUsersInput[];
    upsert?: Prisma.filesUpsertWithWhereUniqueWithoutUsersInput | Prisma.filesUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: Prisma.filesCreateManyUsersInputEnvelope;
    set?: Prisma.filesWhereUniqueInput | Prisma.filesWhereUniqueInput[];
    disconnect?: Prisma.filesWhereUniqueInput | Prisma.filesWhereUniqueInput[];
    delete?: Prisma.filesWhereUniqueInput | Prisma.filesWhereUniqueInput[];
    connect?: Prisma.filesWhereUniqueInput | Prisma.filesWhereUniqueInput[];
    update?: Prisma.filesUpdateWithWhereUniqueWithoutUsersInput | Prisma.filesUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?: Prisma.filesUpdateManyWithWhereWithoutUsersInput | Prisma.filesUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?: Prisma.filesScalarWhereInput | Prisma.filesScalarWhereInput[];
};
export type filesCreateWithoutEntity_photosInput = {
    id?: string;
    storage_provider?: string | null;
    file_path: string;
    public_url?: string | null;
    file_name?: string | null;
    mime_type?: string | null;
    file_size?: number | null;
    created_at?: Date | string;
    users?: Prisma.usersCreateNestedOneWithoutFilesInput;
};
export type filesUncheckedCreateWithoutEntity_photosInput = {
    id?: string;
    storage_provider?: string | null;
    file_path: string;
    public_url?: string | null;
    file_name?: string | null;
    mime_type?: string | null;
    file_size?: number | null;
    uploaded_by?: string | null;
    created_at?: Date | string;
};
export type filesCreateOrConnectWithoutEntity_photosInput = {
    where: Prisma.filesWhereUniqueInput;
    create: Prisma.XOR<Prisma.filesCreateWithoutEntity_photosInput, Prisma.filesUncheckedCreateWithoutEntity_photosInput>;
};
export type filesUpsertWithoutEntity_photosInput = {
    update: Prisma.XOR<Prisma.filesUpdateWithoutEntity_photosInput, Prisma.filesUncheckedUpdateWithoutEntity_photosInput>;
    create: Prisma.XOR<Prisma.filesCreateWithoutEntity_photosInput, Prisma.filesUncheckedCreateWithoutEntity_photosInput>;
    where?: Prisma.filesWhereInput;
};
export type filesUpdateToOneWithWhereWithoutEntity_photosInput = {
    where?: Prisma.filesWhereInput;
    data: Prisma.XOR<Prisma.filesUpdateWithoutEntity_photosInput, Prisma.filesUncheckedUpdateWithoutEntity_photosInput>;
};
export type filesUpdateWithoutEntity_photosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    storage_provider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    public_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mime_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_size?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.usersUpdateOneWithoutFilesNestedInput;
};
export type filesUncheckedUpdateWithoutEntity_photosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    storage_provider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    public_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mime_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_size?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    uploaded_by?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type filesCreateWithoutUsersInput = {
    id?: string;
    storage_provider?: string | null;
    file_path: string;
    public_url?: string | null;
    file_name?: string | null;
    mime_type?: string | null;
    file_size?: number | null;
    created_at?: Date | string;
    entity_photos?: Prisma.entity_photosCreateNestedManyWithoutFilesInput;
};
export type filesUncheckedCreateWithoutUsersInput = {
    id?: string;
    storage_provider?: string | null;
    file_path: string;
    public_url?: string | null;
    file_name?: string | null;
    mime_type?: string | null;
    file_size?: number | null;
    created_at?: Date | string;
    entity_photos?: Prisma.entity_photosUncheckedCreateNestedManyWithoutFilesInput;
};
export type filesCreateOrConnectWithoutUsersInput = {
    where: Prisma.filesWhereUniqueInput;
    create: Prisma.XOR<Prisma.filesCreateWithoutUsersInput, Prisma.filesUncheckedCreateWithoutUsersInput>;
};
export type filesCreateManyUsersInputEnvelope = {
    data: Prisma.filesCreateManyUsersInput | Prisma.filesCreateManyUsersInput[];
    skipDuplicates?: boolean;
};
export type filesUpsertWithWhereUniqueWithoutUsersInput = {
    where: Prisma.filesWhereUniqueInput;
    update: Prisma.XOR<Prisma.filesUpdateWithoutUsersInput, Prisma.filesUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.filesCreateWithoutUsersInput, Prisma.filesUncheckedCreateWithoutUsersInput>;
};
export type filesUpdateWithWhereUniqueWithoutUsersInput = {
    where: Prisma.filesWhereUniqueInput;
    data: Prisma.XOR<Prisma.filesUpdateWithoutUsersInput, Prisma.filesUncheckedUpdateWithoutUsersInput>;
};
export type filesUpdateManyWithWhereWithoutUsersInput = {
    where: Prisma.filesScalarWhereInput;
    data: Prisma.XOR<Prisma.filesUpdateManyMutationInput, Prisma.filesUncheckedUpdateManyWithoutUsersInput>;
};
export type filesScalarWhereInput = {
    AND?: Prisma.filesScalarWhereInput | Prisma.filesScalarWhereInput[];
    OR?: Prisma.filesScalarWhereInput[];
    NOT?: Prisma.filesScalarWhereInput | Prisma.filesScalarWhereInput[];
    id?: Prisma.UuidFilter<"files"> | string;
    storage_provider?: Prisma.StringNullableFilter<"files"> | string | null;
    file_path?: Prisma.StringFilter<"files"> | string;
    public_url?: Prisma.StringNullableFilter<"files"> | string | null;
    file_name?: Prisma.StringNullableFilter<"files"> | string | null;
    mime_type?: Prisma.StringNullableFilter<"files"> | string | null;
    file_size?: Prisma.IntNullableFilter<"files"> | number | null;
    uploaded_by?: Prisma.UuidNullableFilter<"files"> | string | null;
    created_at?: Prisma.DateTimeFilter<"files"> | Date | string;
};
export type filesCreateManyUsersInput = {
    id?: string;
    storage_provider?: string | null;
    file_path: string;
    public_url?: string | null;
    file_name?: string | null;
    mime_type?: string | null;
    file_size?: number | null;
    created_at?: Date | string;
};
export type filesUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    storage_provider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    public_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mime_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_size?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entity_photos?: Prisma.entity_photosUpdateManyWithoutFilesNestedInput;
};
export type filesUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    storage_provider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    public_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mime_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_size?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    entity_photos?: Prisma.entity_photosUncheckedUpdateManyWithoutFilesNestedInput;
};
export type filesUncheckedUpdateManyWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    storage_provider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_path?: Prisma.StringFieldUpdateOperationsInput | string;
    public_url?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_name?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    mime_type?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    file_size?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FilesCountOutputType = {
    entity_photos: number;
};
export type FilesCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    entity_photos?: boolean | FilesCountOutputTypeCountEntity_photosArgs;
};
export type FilesCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FilesCountOutputTypeSelect<ExtArgs> | null;
};
export type FilesCountOutputTypeCountEntity_photosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.entity_photosWhereInput;
};
export type filesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    storage_provider?: boolean;
    file_path?: boolean;
    public_url?: boolean;
    file_name?: boolean;
    mime_type?: boolean;
    file_size?: boolean;
    uploaded_by?: boolean;
    created_at?: boolean;
    entity_photos?: boolean | Prisma.files$entity_photosArgs<ExtArgs>;
    users?: boolean | Prisma.files$usersArgs<ExtArgs>;
    _count?: boolean | Prisma.FilesCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["files"]>;
export type filesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    storage_provider?: boolean;
    file_path?: boolean;
    public_url?: boolean;
    file_name?: boolean;
    mime_type?: boolean;
    file_size?: boolean;
    uploaded_by?: boolean;
    created_at?: boolean;
    users?: boolean | Prisma.files$usersArgs<ExtArgs>;
}, ExtArgs["result"]["files"]>;
export type filesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    storage_provider?: boolean;
    file_path?: boolean;
    public_url?: boolean;
    file_name?: boolean;
    mime_type?: boolean;
    file_size?: boolean;
    uploaded_by?: boolean;
    created_at?: boolean;
    users?: boolean | Prisma.files$usersArgs<ExtArgs>;
}, ExtArgs["result"]["files"]>;
export type filesSelectScalar = {
    id?: boolean;
    storage_provider?: boolean;
    file_path?: boolean;
    public_url?: boolean;
    file_name?: boolean;
    mime_type?: boolean;
    file_size?: boolean;
    uploaded_by?: boolean;
    created_at?: boolean;
};
export type filesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "storage_provider" | "file_path" | "public_url" | "file_name" | "mime_type" | "file_size" | "uploaded_by" | "created_at", ExtArgs["result"]["files"]>;
export type filesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    entity_photos?: boolean | Prisma.files$entity_photosArgs<ExtArgs>;
    users?: boolean | Prisma.files$usersArgs<ExtArgs>;
    _count?: boolean | Prisma.FilesCountOutputTypeDefaultArgs<ExtArgs>;
};
export type filesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.files$usersArgs<ExtArgs>;
};
export type filesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.files$usersArgs<ExtArgs>;
};
export type $filesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "files";
    objects: {
        entity_photos: Prisma.$entity_photosPayload<ExtArgs>[];
        users: Prisma.$usersPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        storage_provider: string | null;
        file_path: string;
        public_url: string | null;
        file_name: string | null;
        mime_type: string | null;
        file_size: number | null;
        uploaded_by: string | null;
        created_at: Date;
    }, ExtArgs["result"]["files"]>;
    composites: {};
};
export type filesGetPayload<S extends boolean | null | undefined | filesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$filesPayload, S>;
export type filesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<filesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FilesCountAggregateInputType | true;
};
export interface filesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['files'];
        meta: {
            name: 'files';
        };
    };
    findUnique<T extends filesFindUniqueArgs>(args: Prisma.SelectSubset<T, filesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__filesClient<runtime.Types.Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends filesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, filesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__filesClient<runtime.Types.Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends filesFindFirstArgs>(args?: Prisma.SelectSubset<T, filesFindFirstArgs<ExtArgs>>): Prisma.Prisma__filesClient<runtime.Types.Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends filesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, filesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__filesClient<runtime.Types.Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends filesFindManyArgs>(args?: Prisma.SelectSubset<T, filesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends filesCreateArgs>(args: Prisma.SelectSubset<T, filesCreateArgs<ExtArgs>>): Prisma.Prisma__filesClient<runtime.Types.Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends filesCreateManyArgs>(args?: Prisma.SelectSubset<T, filesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends filesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, filesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends filesDeleteArgs>(args: Prisma.SelectSubset<T, filesDeleteArgs<ExtArgs>>): Prisma.Prisma__filesClient<runtime.Types.Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends filesUpdateArgs>(args: Prisma.SelectSubset<T, filesUpdateArgs<ExtArgs>>): Prisma.Prisma__filesClient<runtime.Types.Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends filesDeleteManyArgs>(args?: Prisma.SelectSubset<T, filesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends filesUpdateManyArgs>(args: Prisma.SelectSubset<T, filesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends filesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, filesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends filesUpsertArgs>(args: Prisma.SelectSubset<T, filesUpsertArgs<ExtArgs>>): Prisma.Prisma__filesClient<runtime.Types.Result.GetResult<Prisma.$filesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends filesCountArgs>(args?: Prisma.Subset<T, filesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FilesCountAggregateOutputType> : number>;
    aggregate<T extends FilesAggregateArgs>(args: Prisma.Subset<T, FilesAggregateArgs>): Prisma.PrismaPromise<GetFilesAggregateType<T>>;
    groupBy<T extends filesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: filesGroupByArgs['orderBy'];
    } : {
        orderBy?: filesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, filesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFilesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: filesFieldRefs;
}
export interface Prisma__filesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    entity_photos<T extends Prisma.files$entity_photosArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.files$entity_photosArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$entity_photosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    users<T extends Prisma.files$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.files$usersArgs<ExtArgs>>): Prisma.Prisma__usersClient<runtime.Types.Result.GetResult<Prisma.$usersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface filesFieldRefs {
    readonly id: Prisma.FieldRef<"files", 'String'>;
    readonly storage_provider: Prisma.FieldRef<"files", 'String'>;
    readonly file_path: Prisma.FieldRef<"files", 'String'>;
    readonly public_url: Prisma.FieldRef<"files", 'String'>;
    readonly file_name: Prisma.FieldRef<"files", 'String'>;
    readonly mime_type: Prisma.FieldRef<"files", 'String'>;
    readonly file_size: Prisma.FieldRef<"files", 'Int'>;
    readonly uploaded_by: Prisma.FieldRef<"files", 'String'>;
    readonly created_at: Prisma.FieldRef<"files", 'DateTime'>;
}
export type filesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.filesSelect<ExtArgs> | null;
    omit?: Prisma.filesOmit<ExtArgs> | null;
    include?: Prisma.filesInclude<ExtArgs> | null;
    where: Prisma.filesWhereUniqueInput;
};
export type filesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.filesSelect<ExtArgs> | null;
    omit?: Prisma.filesOmit<ExtArgs> | null;
    include?: Prisma.filesInclude<ExtArgs> | null;
    where: Prisma.filesWhereUniqueInput;
};
export type filesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.filesSelect<ExtArgs> | null;
    omit?: Prisma.filesOmit<ExtArgs> | null;
    include?: Prisma.filesInclude<ExtArgs> | null;
    where?: Prisma.filesWhereInput;
    orderBy?: Prisma.filesOrderByWithRelationInput | Prisma.filesOrderByWithRelationInput[];
    cursor?: Prisma.filesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FilesScalarFieldEnum | Prisma.FilesScalarFieldEnum[];
};
export type filesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.filesSelect<ExtArgs> | null;
    omit?: Prisma.filesOmit<ExtArgs> | null;
    include?: Prisma.filesInclude<ExtArgs> | null;
    where?: Prisma.filesWhereInput;
    orderBy?: Prisma.filesOrderByWithRelationInput | Prisma.filesOrderByWithRelationInput[];
    cursor?: Prisma.filesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FilesScalarFieldEnum | Prisma.FilesScalarFieldEnum[];
};
export type filesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.filesSelect<ExtArgs> | null;
    omit?: Prisma.filesOmit<ExtArgs> | null;
    include?: Prisma.filesInclude<ExtArgs> | null;
    where?: Prisma.filesWhereInput;
    orderBy?: Prisma.filesOrderByWithRelationInput | Prisma.filesOrderByWithRelationInput[];
    cursor?: Prisma.filesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FilesScalarFieldEnum | Prisma.FilesScalarFieldEnum[];
};
export type filesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.filesSelect<ExtArgs> | null;
    omit?: Prisma.filesOmit<ExtArgs> | null;
    include?: Prisma.filesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.filesCreateInput, Prisma.filesUncheckedCreateInput>;
};
export type filesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.filesCreateManyInput | Prisma.filesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type filesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.filesSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.filesOmit<ExtArgs> | null;
    data: Prisma.filesCreateManyInput | Prisma.filesCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.filesIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type filesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.filesSelect<ExtArgs> | null;
    omit?: Prisma.filesOmit<ExtArgs> | null;
    include?: Prisma.filesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.filesUpdateInput, Prisma.filesUncheckedUpdateInput>;
    where: Prisma.filesWhereUniqueInput;
};
export type filesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.filesUpdateManyMutationInput, Prisma.filesUncheckedUpdateManyInput>;
    where?: Prisma.filesWhereInput;
    limit?: number;
};
export type filesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.filesSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.filesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.filesUpdateManyMutationInput, Prisma.filesUncheckedUpdateManyInput>;
    where?: Prisma.filesWhereInput;
    limit?: number;
    include?: Prisma.filesIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type filesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.filesSelect<ExtArgs> | null;
    omit?: Prisma.filesOmit<ExtArgs> | null;
    include?: Prisma.filesInclude<ExtArgs> | null;
    where: Prisma.filesWhereUniqueInput;
    create: Prisma.XOR<Prisma.filesCreateInput, Prisma.filesUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.filesUpdateInput, Prisma.filesUncheckedUpdateInput>;
};
export type filesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.filesSelect<ExtArgs> | null;
    omit?: Prisma.filesOmit<ExtArgs> | null;
    include?: Prisma.filesInclude<ExtArgs> | null;
    where: Prisma.filesWhereUniqueInput;
};
export type filesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.filesWhereInput;
    limit?: number;
};
export type files$entity_photosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type files$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.usersSelect<ExtArgs> | null;
    omit?: Prisma.usersOmit<ExtArgs> | null;
    include?: Prisma.usersInclude<ExtArgs> | null;
    where?: Prisma.usersWhereInput;
};
export type filesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.filesSelect<ExtArgs> | null;
    omit?: Prisma.filesOmit<ExtArgs> | null;
    include?: Prisma.filesInclude<ExtArgs> | null;
};
