import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type document_sequencesModel = runtime.Types.Result.DefaultSelection<Prisma.$document_sequencesPayload>;
export type AggregateDocument_sequences = {
    _count: Document_sequencesCountAggregateOutputType | null;
    _avg: Document_sequencesAvgAggregateOutputType | null;
    _sum: Document_sequencesSumAggregateOutputType | null;
    _min: Document_sequencesMinAggregateOutputType | null;
    _max: Document_sequencesMaxAggregateOutputType | null;
};
export type Document_sequencesAvgAggregateOutputType = {
    current_number: number | null;
};
export type Document_sequencesSumAggregateOutputType = {
    current_number: number | null;
};
export type Document_sequencesMinAggregateOutputType = {
    id: string | null;
    document_type: string | null;
    point_of_sale: string | null;
    current_number: number | null;
    prefix: string | null;
    active: boolean | null;
    created_at: Date | null;
};
export type Document_sequencesMaxAggregateOutputType = {
    id: string | null;
    document_type: string | null;
    point_of_sale: string | null;
    current_number: number | null;
    prefix: string | null;
    active: boolean | null;
    created_at: Date | null;
};
export type Document_sequencesCountAggregateOutputType = {
    id: number;
    document_type: number;
    point_of_sale: number;
    current_number: number;
    prefix: number;
    active: number;
    created_at: number;
    _all: number;
};
export type Document_sequencesAvgAggregateInputType = {
    current_number?: true;
};
export type Document_sequencesSumAggregateInputType = {
    current_number?: true;
};
export type Document_sequencesMinAggregateInputType = {
    id?: true;
    document_type?: true;
    point_of_sale?: true;
    current_number?: true;
    prefix?: true;
    active?: true;
    created_at?: true;
};
export type Document_sequencesMaxAggregateInputType = {
    id?: true;
    document_type?: true;
    point_of_sale?: true;
    current_number?: true;
    prefix?: true;
    active?: true;
    created_at?: true;
};
export type Document_sequencesCountAggregateInputType = {
    id?: true;
    document_type?: true;
    point_of_sale?: true;
    current_number?: true;
    prefix?: true;
    active?: true;
    created_at?: true;
    _all?: true;
};
export type Document_sequencesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_sequencesWhereInput;
    orderBy?: Prisma.document_sequencesOrderByWithRelationInput | Prisma.document_sequencesOrderByWithRelationInput[];
    cursor?: Prisma.document_sequencesWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Document_sequencesCountAggregateInputType;
    _avg?: Document_sequencesAvgAggregateInputType;
    _sum?: Document_sequencesSumAggregateInputType;
    _min?: Document_sequencesMinAggregateInputType;
    _max?: Document_sequencesMaxAggregateInputType;
};
export type GetDocument_sequencesAggregateType<T extends Document_sequencesAggregateArgs> = {
    [P in keyof T & keyof AggregateDocument_sequences]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDocument_sequences[P]> : Prisma.GetScalarType<T[P], AggregateDocument_sequences[P]>;
};
export type document_sequencesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_sequencesWhereInput;
    orderBy?: Prisma.document_sequencesOrderByWithAggregationInput | Prisma.document_sequencesOrderByWithAggregationInput[];
    by: Prisma.Document_sequencesScalarFieldEnum[] | Prisma.Document_sequencesScalarFieldEnum;
    having?: Prisma.document_sequencesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Document_sequencesCountAggregateInputType | true;
    _avg?: Document_sequencesAvgAggregateInputType;
    _sum?: Document_sequencesSumAggregateInputType;
    _min?: Document_sequencesMinAggregateInputType;
    _max?: Document_sequencesMaxAggregateInputType;
};
export type Document_sequencesGroupByOutputType = {
    id: string;
    document_type: string;
    point_of_sale: string;
    current_number: number;
    prefix: string | null;
    active: boolean;
    created_at: Date;
    _count: Document_sequencesCountAggregateOutputType | null;
    _avg: Document_sequencesAvgAggregateOutputType | null;
    _sum: Document_sequencesSumAggregateOutputType | null;
    _min: Document_sequencesMinAggregateOutputType | null;
    _max: Document_sequencesMaxAggregateOutputType | null;
};
export type GetDocument_sequencesGroupByPayload<T extends document_sequencesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Document_sequencesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Document_sequencesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Document_sequencesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Document_sequencesGroupByOutputType[P]>;
}>>;
export type document_sequencesWhereInput = {
    AND?: Prisma.document_sequencesWhereInput | Prisma.document_sequencesWhereInput[];
    OR?: Prisma.document_sequencesWhereInput[];
    NOT?: Prisma.document_sequencesWhereInput | Prisma.document_sequencesWhereInput[];
    id?: Prisma.UuidFilter<"document_sequences"> | string;
    document_type?: Prisma.StringFilter<"document_sequences"> | string;
    point_of_sale?: Prisma.StringFilter<"document_sequences"> | string;
    current_number?: Prisma.IntFilter<"document_sequences"> | number;
    prefix?: Prisma.StringNullableFilter<"document_sequences"> | string | null;
    active?: Prisma.BoolFilter<"document_sequences"> | boolean;
    created_at?: Prisma.DateTimeFilter<"document_sequences"> | Date | string;
    document_types?: Prisma.Document_typesListRelationFilter;
};
export type document_sequencesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    document_type?: Prisma.SortOrder;
    point_of_sale?: Prisma.SortOrder;
    current_number?: Prisma.SortOrder;
    prefix?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    document_types?: Prisma.document_typesOrderByRelationAggregateInput;
};
export type document_sequencesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    document_type_point_of_sale?: Prisma.document_sequencesDocument_typePoint_of_saleCompoundUniqueInput;
    AND?: Prisma.document_sequencesWhereInput | Prisma.document_sequencesWhereInput[];
    OR?: Prisma.document_sequencesWhereInput[];
    NOT?: Prisma.document_sequencesWhereInput | Prisma.document_sequencesWhereInput[];
    document_type?: Prisma.StringFilter<"document_sequences"> | string;
    point_of_sale?: Prisma.StringFilter<"document_sequences"> | string;
    current_number?: Prisma.IntFilter<"document_sequences"> | number;
    prefix?: Prisma.StringNullableFilter<"document_sequences"> | string | null;
    active?: Prisma.BoolFilter<"document_sequences"> | boolean;
    created_at?: Prisma.DateTimeFilter<"document_sequences"> | Date | string;
    document_types?: Prisma.Document_typesListRelationFilter;
}, "id" | "document_type_point_of_sale">;
export type document_sequencesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    document_type?: Prisma.SortOrder;
    point_of_sale?: Prisma.SortOrder;
    current_number?: Prisma.SortOrder;
    prefix?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.document_sequencesCountOrderByAggregateInput;
    _avg?: Prisma.document_sequencesAvgOrderByAggregateInput;
    _max?: Prisma.document_sequencesMaxOrderByAggregateInput;
    _min?: Prisma.document_sequencesMinOrderByAggregateInput;
    _sum?: Prisma.document_sequencesSumOrderByAggregateInput;
};
export type document_sequencesScalarWhereWithAggregatesInput = {
    AND?: Prisma.document_sequencesScalarWhereWithAggregatesInput | Prisma.document_sequencesScalarWhereWithAggregatesInput[];
    OR?: Prisma.document_sequencesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.document_sequencesScalarWhereWithAggregatesInput | Prisma.document_sequencesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"document_sequences"> | string;
    document_type?: Prisma.StringWithAggregatesFilter<"document_sequences"> | string;
    point_of_sale?: Prisma.StringWithAggregatesFilter<"document_sequences"> | string;
    current_number?: Prisma.IntWithAggregatesFilter<"document_sequences"> | number;
    prefix?: Prisma.StringNullableWithAggregatesFilter<"document_sequences"> | string | null;
    active?: Prisma.BoolWithAggregatesFilter<"document_sequences"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"document_sequences"> | Date | string;
};
export type document_sequencesCreateInput = {
    id?: string;
    document_type: string;
    point_of_sale: string;
    current_number?: number;
    prefix?: string | null;
    active?: boolean;
    created_at?: Date | string;
    document_types?: Prisma.document_typesCreateNestedManyWithoutDocument_sequencesInput;
};
export type document_sequencesUncheckedCreateInput = {
    id?: string;
    document_type: string;
    point_of_sale: string;
    current_number?: number;
    prefix?: string | null;
    active?: boolean;
    created_at?: Date | string;
    document_types?: Prisma.document_typesUncheckedCreateNestedManyWithoutDocument_sequencesInput;
};
export type document_sequencesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type?: Prisma.StringFieldUpdateOperationsInput | string;
    point_of_sale?: Prisma.StringFieldUpdateOperationsInput | string;
    current_number?: Prisma.IntFieldUpdateOperationsInput | number;
    prefix?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    document_types?: Prisma.document_typesUpdateManyWithoutDocument_sequencesNestedInput;
};
export type document_sequencesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type?: Prisma.StringFieldUpdateOperationsInput | string;
    point_of_sale?: Prisma.StringFieldUpdateOperationsInput | string;
    current_number?: Prisma.IntFieldUpdateOperationsInput | number;
    prefix?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    document_types?: Prisma.document_typesUncheckedUpdateManyWithoutDocument_sequencesNestedInput;
};
export type document_sequencesCreateManyInput = {
    id?: string;
    document_type: string;
    point_of_sale: string;
    current_number?: number;
    prefix?: string | null;
    active?: boolean;
    created_at?: Date | string;
};
export type document_sequencesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type?: Prisma.StringFieldUpdateOperationsInput | string;
    point_of_sale?: Prisma.StringFieldUpdateOperationsInput | string;
    current_number?: Prisma.IntFieldUpdateOperationsInput | number;
    prefix?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type document_sequencesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type?: Prisma.StringFieldUpdateOperationsInput | string;
    point_of_sale?: Prisma.StringFieldUpdateOperationsInput | string;
    current_number?: Prisma.IntFieldUpdateOperationsInput | number;
    prefix?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type document_sequencesDocument_typePoint_of_saleCompoundUniqueInput = {
    document_type: string;
    point_of_sale: string;
};
export type document_sequencesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_type?: Prisma.SortOrder;
    point_of_sale?: Prisma.SortOrder;
    current_number?: Prisma.SortOrder;
    prefix?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type document_sequencesAvgOrderByAggregateInput = {
    current_number?: Prisma.SortOrder;
};
export type document_sequencesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_type?: Prisma.SortOrder;
    point_of_sale?: Prisma.SortOrder;
    current_number?: Prisma.SortOrder;
    prefix?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type document_sequencesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    document_type?: Prisma.SortOrder;
    point_of_sale?: Prisma.SortOrder;
    current_number?: Prisma.SortOrder;
    prefix?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type document_sequencesSumOrderByAggregateInput = {
    current_number?: Prisma.SortOrder;
};
export type Document_sequencesNullableScalarRelationFilter = {
    is?: Prisma.document_sequencesWhereInput | null;
    isNot?: Prisma.document_sequencesWhereInput | null;
};
export type document_sequencesCreateNestedOneWithoutDocument_typesInput = {
    create?: Prisma.XOR<Prisma.document_sequencesCreateWithoutDocument_typesInput, Prisma.document_sequencesUncheckedCreateWithoutDocument_typesInput>;
    connectOrCreate?: Prisma.document_sequencesCreateOrConnectWithoutDocument_typesInput;
    connect?: Prisma.document_sequencesWhereUniqueInput;
};
export type document_sequencesUpdateOneWithoutDocument_typesNestedInput = {
    create?: Prisma.XOR<Prisma.document_sequencesCreateWithoutDocument_typesInput, Prisma.document_sequencesUncheckedCreateWithoutDocument_typesInput>;
    connectOrCreate?: Prisma.document_sequencesCreateOrConnectWithoutDocument_typesInput;
    upsert?: Prisma.document_sequencesUpsertWithoutDocument_typesInput;
    disconnect?: Prisma.document_sequencesWhereInput | boolean;
    delete?: Prisma.document_sequencesWhereInput | boolean;
    connect?: Prisma.document_sequencesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.document_sequencesUpdateToOneWithWhereWithoutDocument_typesInput, Prisma.document_sequencesUpdateWithoutDocument_typesInput>, Prisma.document_sequencesUncheckedUpdateWithoutDocument_typesInput>;
};
export type document_sequencesCreateWithoutDocument_typesInput = {
    id?: string;
    document_type: string;
    point_of_sale: string;
    current_number?: number;
    prefix?: string | null;
    active?: boolean;
    created_at?: Date | string;
};
export type document_sequencesUncheckedCreateWithoutDocument_typesInput = {
    id?: string;
    document_type: string;
    point_of_sale: string;
    current_number?: number;
    prefix?: string | null;
    active?: boolean;
    created_at?: Date | string;
};
export type document_sequencesCreateOrConnectWithoutDocument_typesInput = {
    where: Prisma.document_sequencesWhereUniqueInput;
    create: Prisma.XOR<Prisma.document_sequencesCreateWithoutDocument_typesInput, Prisma.document_sequencesUncheckedCreateWithoutDocument_typesInput>;
};
export type document_sequencesUpsertWithoutDocument_typesInput = {
    update: Prisma.XOR<Prisma.document_sequencesUpdateWithoutDocument_typesInput, Prisma.document_sequencesUncheckedUpdateWithoutDocument_typesInput>;
    create: Prisma.XOR<Prisma.document_sequencesCreateWithoutDocument_typesInput, Prisma.document_sequencesUncheckedCreateWithoutDocument_typesInput>;
    where?: Prisma.document_sequencesWhereInput;
};
export type document_sequencesUpdateToOneWithWhereWithoutDocument_typesInput = {
    where?: Prisma.document_sequencesWhereInput;
    data: Prisma.XOR<Prisma.document_sequencesUpdateWithoutDocument_typesInput, Prisma.document_sequencesUncheckedUpdateWithoutDocument_typesInput>;
};
export type document_sequencesUpdateWithoutDocument_typesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type?: Prisma.StringFieldUpdateOperationsInput | string;
    point_of_sale?: Prisma.StringFieldUpdateOperationsInput | string;
    current_number?: Prisma.IntFieldUpdateOperationsInput | number;
    prefix?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type document_sequencesUncheckedUpdateWithoutDocument_typesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    document_type?: Prisma.StringFieldUpdateOperationsInput | string;
    point_of_sale?: Prisma.StringFieldUpdateOperationsInput | string;
    current_number?: Prisma.IntFieldUpdateOperationsInput | number;
    prefix?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type Document_sequencesCountOutputType = {
    document_types: number;
};
export type Document_sequencesCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_types?: boolean | Document_sequencesCountOutputTypeCountDocument_typesArgs;
};
export type Document_sequencesCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.Document_sequencesCountOutputTypeSelect<ExtArgs> | null;
};
export type Document_sequencesCountOutputTypeCountDocument_typesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_typesWhereInput;
};
export type document_sequencesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_type?: boolean;
    point_of_sale?: boolean;
    current_number?: boolean;
    prefix?: boolean;
    active?: boolean;
    created_at?: boolean;
    document_types?: boolean | Prisma.document_sequences$document_typesArgs<ExtArgs>;
    _count?: boolean | Prisma.Document_sequencesCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["document_sequences"]>;
export type document_sequencesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_type?: boolean;
    point_of_sale?: boolean;
    current_number?: boolean;
    prefix?: boolean;
    active?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["document_sequences"]>;
export type document_sequencesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    document_type?: boolean;
    point_of_sale?: boolean;
    current_number?: boolean;
    prefix?: boolean;
    active?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["document_sequences"]>;
export type document_sequencesSelectScalar = {
    id?: boolean;
    document_type?: boolean;
    point_of_sale?: boolean;
    current_number?: boolean;
    prefix?: boolean;
    active?: boolean;
    created_at?: boolean;
};
export type document_sequencesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "document_type" | "point_of_sale" | "current_number" | "prefix" | "active" | "created_at", ExtArgs["result"]["document_sequences"]>;
export type document_sequencesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    document_types?: boolean | Prisma.document_sequences$document_typesArgs<ExtArgs>;
    _count?: boolean | Prisma.Document_sequencesCountOutputTypeDefaultArgs<ExtArgs>;
};
export type document_sequencesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type document_sequencesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $document_sequencesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "document_sequences";
    objects: {
        document_types: Prisma.$document_typesPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        document_type: string;
        point_of_sale: string;
        current_number: number;
        prefix: string | null;
        active: boolean;
        created_at: Date;
    }, ExtArgs["result"]["document_sequences"]>;
    composites: {};
};
export type document_sequencesGetPayload<S extends boolean | null | undefined | document_sequencesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$document_sequencesPayload, S>;
export type document_sequencesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<document_sequencesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Document_sequencesCountAggregateInputType | true;
};
export interface document_sequencesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['document_sequences'];
        meta: {
            name: 'document_sequences';
        };
    };
    findUnique<T extends document_sequencesFindUniqueArgs>(args: Prisma.SelectSubset<T, document_sequencesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__document_sequencesClient<runtime.Types.Result.GetResult<Prisma.$document_sequencesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends document_sequencesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, document_sequencesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__document_sequencesClient<runtime.Types.Result.GetResult<Prisma.$document_sequencesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends document_sequencesFindFirstArgs>(args?: Prisma.SelectSubset<T, document_sequencesFindFirstArgs<ExtArgs>>): Prisma.Prisma__document_sequencesClient<runtime.Types.Result.GetResult<Prisma.$document_sequencesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends document_sequencesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, document_sequencesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__document_sequencesClient<runtime.Types.Result.GetResult<Prisma.$document_sequencesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends document_sequencesFindManyArgs>(args?: Prisma.SelectSubset<T, document_sequencesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_sequencesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends document_sequencesCreateArgs>(args: Prisma.SelectSubset<T, document_sequencesCreateArgs<ExtArgs>>): Prisma.Prisma__document_sequencesClient<runtime.Types.Result.GetResult<Prisma.$document_sequencesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends document_sequencesCreateManyArgs>(args?: Prisma.SelectSubset<T, document_sequencesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends document_sequencesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, document_sequencesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_sequencesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends document_sequencesDeleteArgs>(args: Prisma.SelectSubset<T, document_sequencesDeleteArgs<ExtArgs>>): Prisma.Prisma__document_sequencesClient<runtime.Types.Result.GetResult<Prisma.$document_sequencesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends document_sequencesUpdateArgs>(args: Prisma.SelectSubset<T, document_sequencesUpdateArgs<ExtArgs>>): Prisma.Prisma__document_sequencesClient<runtime.Types.Result.GetResult<Prisma.$document_sequencesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends document_sequencesDeleteManyArgs>(args?: Prisma.SelectSubset<T, document_sequencesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends document_sequencesUpdateManyArgs>(args: Prisma.SelectSubset<T, document_sequencesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends document_sequencesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, document_sequencesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_sequencesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends document_sequencesUpsertArgs>(args: Prisma.SelectSubset<T, document_sequencesUpsertArgs<ExtArgs>>): Prisma.Prisma__document_sequencesClient<runtime.Types.Result.GetResult<Prisma.$document_sequencesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends document_sequencesCountArgs>(args?: Prisma.Subset<T, document_sequencesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Document_sequencesCountAggregateOutputType> : number>;
    aggregate<T extends Document_sequencesAggregateArgs>(args: Prisma.Subset<T, Document_sequencesAggregateArgs>): Prisma.PrismaPromise<GetDocument_sequencesAggregateType<T>>;
    groupBy<T extends document_sequencesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: document_sequencesGroupByArgs['orderBy'];
    } : {
        orderBy?: document_sequencesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, document_sequencesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocument_sequencesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: document_sequencesFieldRefs;
}
export interface Prisma__document_sequencesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    document_types<T extends Prisma.document_sequences$document_typesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.document_sequences$document_typesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$document_typesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface document_sequencesFieldRefs {
    readonly id: Prisma.FieldRef<"document_sequences", 'String'>;
    readonly document_type: Prisma.FieldRef<"document_sequences", 'String'>;
    readonly point_of_sale: Prisma.FieldRef<"document_sequences", 'String'>;
    readonly current_number: Prisma.FieldRef<"document_sequences", 'Int'>;
    readonly prefix: Prisma.FieldRef<"document_sequences", 'String'>;
    readonly active: Prisma.FieldRef<"document_sequences", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"document_sequences", 'DateTime'>;
}
export type document_sequencesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_sequencesSelect<ExtArgs> | null;
    omit?: Prisma.document_sequencesOmit<ExtArgs> | null;
    include?: Prisma.document_sequencesInclude<ExtArgs> | null;
    where: Prisma.document_sequencesWhereUniqueInput;
};
export type document_sequencesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_sequencesSelect<ExtArgs> | null;
    omit?: Prisma.document_sequencesOmit<ExtArgs> | null;
    include?: Prisma.document_sequencesInclude<ExtArgs> | null;
    where: Prisma.document_sequencesWhereUniqueInput;
};
export type document_sequencesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_sequencesSelect<ExtArgs> | null;
    omit?: Prisma.document_sequencesOmit<ExtArgs> | null;
    include?: Prisma.document_sequencesInclude<ExtArgs> | null;
    where?: Prisma.document_sequencesWhereInput;
    orderBy?: Prisma.document_sequencesOrderByWithRelationInput | Prisma.document_sequencesOrderByWithRelationInput[];
    cursor?: Prisma.document_sequencesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_sequencesScalarFieldEnum | Prisma.Document_sequencesScalarFieldEnum[];
};
export type document_sequencesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_sequencesSelect<ExtArgs> | null;
    omit?: Prisma.document_sequencesOmit<ExtArgs> | null;
    include?: Prisma.document_sequencesInclude<ExtArgs> | null;
    where?: Prisma.document_sequencesWhereInput;
    orderBy?: Prisma.document_sequencesOrderByWithRelationInput | Prisma.document_sequencesOrderByWithRelationInput[];
    cursor?: Prisma.document_sequencesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_sequencesScalarFieldEnum | Prisma.Document_sequencesScalarFieldEnum[];
};
export type document_sequencesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_sequencesSelect<ExtArgs> | null;
    omit?: Prisma.document_sequencesOmit<ExtArgs> | null;
    include?: Prisma.document_sequencesInclude<ExtArgs> | null;
    where?: Prisma.document_sequencesWhereInput;
    orderBy?: Prisma.document_sequencesOrderByWithRelationInput | Prisma.document_sequencesOrderByWithRelationInput[];
    cursor?: Prisma.document_sequencesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_sequencesScalarFieldEnum | Prisma.Document_sequencesScalarFieldEnum[];
};
export type document_sequencesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_sequencesSelect<ExtArgs> | null;
    omit?: Prisma.document_sequencesOmit<ExtArgs> | null;
    include?: Prisma.document_sequencesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_sequencesCreateInput, Prisma.document_sequencesUncheckedCreateInput>;
};
export type document_sequencesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.document_sequencesCreateManyInput | Prisma.document_sequencesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type document_sequencesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_sequencesSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.document_sequencesOmit<ExtArgs> | null;
    data: Prisma.document_sequencesCreateManyInput | Prisma.document_sequencesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type document_sequencesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_sequencesSelect<ExtArgs> | null;
    omit?: Prisma.document_sequencesOmit<ExtArgs> | null;
    include?: Prisma.document_sequencesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_sequencesUpdateInput, Prisma.document_sequencesUncheckedUpdateInput>;
    where: Prisma.document_sequencesWhereUniqueInput;
};
export type document_sequencesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.document_sequencesUpdateManyMutationInput, Prisma.document_sequencesUncheckedUpdateManyInput>;
    where?: Prisma.document_sequencesWhereInput;
    limit?: number;
};
export type document_sequencesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_sequencesSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.document_sequencesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.document_sequencesUpdateManyMutationInput, Prisma.document_sequencesUncheckedUpdateManyInput>;
    where?: Prisma.document_sequencesWhereInput;
    limit?: number;
};
export type document_sequencesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_sequencesSelect<ExtArgs> | null;
    omit?: Prisma.document_sequencesOmit<ExtArgs> | null;
    include?: Prisma.document_sequencesInclude<ExtArgs> | null;
    where: Prisma.document_sequencesWhereUniqueInput;
    create: Prisma.XOR<Prisma.document_sequencesCreateInput, Prisma.document_sequencesUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.document_sequencesUpdateInput, Prisma.document_sequencesUncheckedUpdateInput>;
};
export type document_sequencesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_sequencesSelect<ExtArgs> | null;
    omit?: Prisma.document_sequencesOmit<ExtArgs> | null;
    include?: Prisma.document_sequencesInclude<ExtArgs> | null;
    where: Prisma.document_sequencesWhereUniqueInput;
};
export type document_sequencesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.document_sequencesWhereInput;
    limit?: number;
};
export type document_sequences$document_typesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_typesSelect<ExtArgs> | null;
    omit?: Prisma.document_typesOmit<ExtArgs> | null;
    include?: Prisma.document_typesInclude<ExtArgs> | null;
    where?: Prisma.document_typesWhereInput;
    orderBy?: Prisma.document_typesOrderByWithRelationInput | Prisma.document_typesOrderByWithRelationInput[];
    cursor?: Prisma.document_typesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Document_typesScalarFieldEnum | Prisma.Document_typesScalarFieldEnum[];
};
export type document_sequencesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.document_sequencesSelect<ExtArgs> | null;
    omit?: Prisma.document_sequencesOmit<ExtArgs> | null;
    include?: Prisma.document_sequencesInclude<ExtArgs> | null;
};
