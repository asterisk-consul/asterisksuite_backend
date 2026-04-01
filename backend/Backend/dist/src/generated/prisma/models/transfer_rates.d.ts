import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type transfer_ratesModel = runtime.Types.Result.DefaultSelection<Prisma.$transfer_ratesPayload>;
export type AggregateTransfer_rates = {
    _count: Transfer_ratesCountAggregateOutputType | null;
    _min: Transfer_ratesMinAggregateOutputType | null;
    _max: Transfer_ratesMaxAggregateOutputType | null;
};
export type Transfer_ratesMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    rate_type: string | null;
    description: string | null;
    active: boolean | null;
    created_at: Date | null;
};
export type Transfer_ratesMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    rate_type: string | null;
    description: string | null;
    active: boolean | null;
    created_at: Date | null;
};
export type Transfer_ratesCountAggregateOutputType = {
    id: number;
    name: number;
    rate_type: number;
    description: number;
    active: number;
    created_at: number;
    _all: number;
};
export type Transfer_ratesMinAggregateInputType = {
    id?: true;
    name?: true;
    rate_type?: true;
    description?: true;
    active?: true;
    created_at?: true;
};
export type Transfer_ratesMaxAggregateInputType = {
    id?: true;
    name?: true;
    rate_type?: true;
    description?: true;
    active?: true;
    created_at?: true;
};
export type Transfer_ratesCountAggregateInputType = {
    id?: true;
    name?: true;
    rate_type?: true;
    description?: true;
    active?: true;
    created_at?: true;
    _all?: true;
};
export type Transfer_ratesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.transfer_ratesWhereInput;
    orderBy?: Prisma.transfer_ratesOrderByWithRelationInput | Prisma.transfer_ratesOrderByWithRelationInput[];
    cursor?: Prisma.transfer_ratesWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Transfer_ratesCountAggregateInputType;
    _min?: Transfer_ratesMinAggregateInputType;
    _max?: Transfer_ratesMaxAggregateInputType;
};
export type GetTransfer_ratesAggregateType<T extends Transfer_ratesAggregateArgs> = {
    [P in keyof T & keyof AggregateTransfer_rates]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTransfer_rates[P]> : Prisma.GetScalarType<T[P], AggregateTransfer_rates[P]>;
};
export type transfer_ratesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.transfer_ratesWhereInput;
    orderBy?: Prisma.transfer_ratesOrderByWithAggregationInput | Prisma.transfer_ratesOrderByWithAggregationInput[];
    by: Prisma.Transfer_ratesScalarFieldEnum[] | Prisma.Transfer_ratesScalarFieldEnum;
    having?: Prisma.transfer_ratesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Transfer_ratesCountAggregateInputType | true;
    _min?: Transfer_ratesMinAggregateInputType;
    _max?: Transfer_ratesMaxAggregateInputType;
};
export type Transfer_ratesGroupByOutputType = {
    id: string;
    name: string;
    rate_type: string;
    description: string | null;
    active: boolean | null;
    created_at: Date | null;
    _count: Transfer_ratesCountAggregateOutputType | null;
    _min: Transfer_ratesMinAggregateOutputType | null;
    _max: Transfer_ratesMaxAggregateOutputType | null;
};
export type GetTransfer_ratesGroupByPayload<T extends transfer_ratesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Transfer_ratesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Transfer_ratesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Transfer_ratesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Transfer_ratesGroupByOutputType[P]>;
}>>;
export type transfer_ratesWhereInput = {
    AND?: Prisma.transfer_ratesWhereInput | Prisma.transfer_ratesWhereInput[];
    OR?: Prisma.transfer_ratesWhereInput[];
    NOT?: Prisma.transfer_ratesWhereInput | Prisma.transfer_ratesWhereInput[];
    id?: Prisma.UuidFilter<"transfer_rates"> | string;
    name?: Prisma.StringFilter<"transfer_rates"> | string;
    rate_type?: Prisma.StringFilter<"transfer_rates"> | string;
    description?: Prisma.StringNullableFilter<"transfer_rates"> | string | null;
    active?: Prisma.BoolNullableFilter<"transfer_rates"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"transfer_rates"> | Date | string | null;
    dispatch_rates?: Prisma.Dispatch_ratesListRelationFilter;
};
export type transfer_ratesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    rate_type?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    dispatch_rates?: Prisma.dispatch_ratesOrderByRelationAggregateInput;
};
export type transfer_ratesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.transfer_ratesWhereInput | Prisma.transfer_ratesWhereInput[];
    OR?: Prisma.transfer_ratesWhereInput[];
    NOT?: Prisma.transfer_ratesWhereInput | Prisma.transfer_ratesWhereInput[];
    name?: Prisma.StringFilter<"transfer_rates"> | string;
    rate_type?: Prisma.StringFilter<"transfer_rates"> | string;
    description?: Prisma.StringNullableFilter<"transfer_rates"> | string | null;
    active?: Prisma.BoolNullableFilter<"transfer_rates"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"transfer_rates"> | Date | string | null;
    dispatch_rates?: Prisma.Dispatch_ratesListRelationFilter;
}, "id">;
export type transfer_ratesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    rate_type?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.transfer_ratesCountOrderByAggregateInput;
    _max?: Prisma.transfer_ratesMaxOrderByAggregateInput;
    _min?: Prisma.transfer_ratesMinOrderByAggregateInput;
};
export type transfer_ratesScalarWhereWithAggregatesInput = {
    AND?: Prisma.transfer_ratesScalarWhereWithAggregatesInput | Prisma.transfer_ratesScalarWhereWithAggregatesInput[];
    OR?: Prisma.transfer_ratesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.transfer_ratesScalarWhereWithAggregatesInput | Prisma.transfer_ratesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"transfer_rates"> | string;
    name?: Prisma.StringWithAggregatesFilter<"transfer_rates"> | string;
    rate_type?: Prisma.StringWithAggregatesFilter<"transfer_rates"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"transfer_rates"> | string | null;
    active?: Prisma.BoolNullableWithAggregatesFilter<"transfer_rates"> | boolean | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"transfer_rates"> | Date | string | null;
};
export type transfer_ratesCreateInput = {
    id?: string;
    name: string;
    rate_type: string;
    description?: string | null;
    active?: boolean | null;
    created_at?: Date | string | null;
    dispatch_rates?: Prisma.dispatch_ratesCreateNestedManyWithoutTransfer_ratesInput;
};
export type transfer_ratesUncheckedCreateInput = {
    id?: string;
    name: string;
    rate_type: string;
    description?: string | null;
    active?: boolean | null;
    created_at?: Date | string | null;
    dispatch_rates?: Prisma.dispatch_ratesUncheckedCreateNestedManyWithoutTransfer_ratesInput;
};
export type transfer_ratesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    rate_type?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    dispatch_rates?: Prisma.dispatch_ratesUpdateManyWithoutTransfer_ratesNestedInput;
};
export type transfer_ratesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    rate_type?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    dispatch_rates?: Prisma.dispatch_ratesUncheckedUpdateManyWithoutTransfer_ratesNestedInput;
};
export type transfer_ratesCreateManyInput = {
    id?: string;
    name: string;
    rate_type: string;
    description?: string | null;
    active?: boolean | null;
    created_at?: Date | string | null;
};
export type transfer_ratesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    rate_type?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type transfer_ratesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    rate_type?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type transfer_ratesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    rate_type?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type transfer_ratesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    rate_type?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type transfer_ratesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    rate_type?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type Transfer_ratesScalarRelationFilter = {
    is?: Prisma.transfer_ratesWhereInput;
    isNot?: Prisma.transfer_ratesWhereInput;
};
export type transfer_ratesCreateNestedOneWithoutDispatch_ratesInput = {
    create?: Prisma.XOR<Prisma.transfer_ratesCreateWithoutDispatch_ratesInput, Prisma.transfer_ratesUncheckedCreateWithoutDispatch_ratesInput>;
    connectOrCreate?: Prisma.transfer_ratesCreateOrConnectWithoutDispatch_ratesInput;
    connect?: Prisma.transfer_ratesWhereUniqueInput;
};
export type transfer_ratesUpdateOneRequiredWithoutDispatch_ratesNestedInput = {
    create?: Prisma.XOR<Prisma.transfer_ratesCreateWithoutDispatch_ratesInput, Prisma.transfer_ratesUncheckedCreateWithoutDispatch_ratesInput>;
    connectOrCreate?: Prisma.transfer_ratesCreateOrConnectWithoutDispatch_ratesInput;
    upsert?: Prisma.transfer_ratesUpsertWithoutDispatch_ratesInput;
    connect?: Prisma.transfer_ratesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.transfer_ratesUpdateToOneWithWhereWithoutDispatch_ratesInput, Prisma.transfer_ratesUpdateWithoutDispatch_ratesInput>, Prisma.transfer_ratesUncheckedUpdateWithoutDispatch_ratesInput>;
};
export type transfer_ratesCreateWithoutDispatch_ratesInput = {
    id?: string;
    name: string;
    rate_type: string;
    description?: string | null;
    active?: boolean | null;
    created_at?: Date | string | null;
};
export type transfer_ratesUncheckedCreateWithoutDispatch_ratesInput = {
    id?: string;
    name: string;
    rate_type: string;
    description?: string | null;
    active?: boolean | null;
    created_at?: Date | string | null;
};
export type transfer_ratesCreateOrConnectWithoutDispatch_ratesInput = {
    where: Prisma.transfer_ratesWhereUniqueInput;
    create: Prisma.XOR<Prisma.transfer_ratesCreateWithoutDispatch_ratesInput, Prisma.transfer_ratesUncheckedCreateWithoutDispatch_ratesInput>;
};
export type transfer_ratesUpsertWithoutDispatch_ratesInput = {
    update: Prisma.XOR<Prisma.transfer_ratesUpdateWithoutDispatch_ratesInput, Prisma.transfer_ratesUncheckedUpdateWithoutDispatch_ratesInput>;
    create: Prisma.XOR<Prisma.transfer_ratesCreateWithoutDispatch_ratesInput, Prisma.transfer_ratesUncheckedCreateWithoutDispatch_ratesInput>;
    where?: Prisma.transfer_ratesWhereInput;
};
export type transfer_ratesUpdateToOneWithWhereWithoutDispatch_ratesInput = {
    where?: Prisma.transfer_ratesWhereInput;
    data: Prisma.XOR<Prisma.transfer_ratesUpdateWithoutDispatch_ratesInput, Prisma.transfer_ratesUncheckedUpdateWithoutDispatch_ratesInput>;
};
export type transfer_ratesUpdateWithoutDispatch_ratesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    rate_type?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type transfer_ratesUncheckedUpdateWithoutDispatch_ratesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    rate_type?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type Transfer_ratesCountOutputType = {
    dispatch_rates: number;
};
export type Transfer_ratesCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    dispatch_rates?: boolean | Transfer_ratesCountOutputTypeCountDispatch_ratesArgs;
};
export type Transfer_ratesCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.Transfer_ratesCountOutputTypeSelect<ExtArgs> | null;
};
export type Transfer_ratesCountOutputTypeCountDispatch_ratesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.dispatch_ratesWhereInput;
};
export type transfer_ratesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    rate_type?: boolean;
    description?: boolean;
    active?: boolean;
    created_at?: boolean;
    dispatch_rates?: boolean | Prisma.transfer_rates$dispatch_ratesArgs<ExtArgs>;
    _count?: boolean | Prisma.Transfer_ratesCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["transfer_rates"]>;
export type transfer_ratesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    rate_type?: boolean;
    description?: boolean;
    active?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["transfer_rates"]>;
export type transfer_ratesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    rate_type?: boolean;
    description?: boolean;
    active?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["transfer_rates"]>;
export type transfer_ratesSelectScalar = {
    id?: boolean;
    name?: boolean;
    rate_type?: boolean;
    description?: boolean;
    active?: boolean;
    created_at?: boolean;
};
export type transfer_ratesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "rate_type" | "description" | "active" | "created_at", ExtArgs["result"]["transfer_rates"]>;
export type transfer_ratesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    dispatch_rates?: boolean | Prisma.transfer_rates$dispatch_ratesArgs<ExtArgs>;
    _count?: boolean | Prisma.Transfer_ratesCountOutputTypeDefaultArgs<ExtArgs>;
};
export type transfer_ratesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type transfer_ratesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $transfer_ratesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "transfer_rates";
    objects: {
        dispatch_rates: Prisma.$dispatch_ratesPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        rate_type: string;
        description: string | null;
        active: boolean | null;
        created_at: Date | null;
    }, ExtArgs["result"]["transfer_rates"]>;
    composites: {};
};
export type transfer_ratesGetPayload<S extends boolean | null | undefined | transfer_ratesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$transfer_ratesPayload, S>;
export type transfer_ratesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<transfer_ratesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Transfer_ratesCountAggregateInputType | true;
};
export interface transfer_ratesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['transfer_rates'];
        meta: {
            name: 'transfer_rates';
        };
    };
    findUnique<T extends transfer_ratesFindUniqueArgs>(args: Prisma.SelectSubset<T, transfer_ratesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__transfer_ratesClient<runtime.Types.Result.GetResult<Prisma.$transfer_ratesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends transfer_ratesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, transfer_ratesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__transfer_ratesClient<runtime.Types.Result.GetResult<Prisma.$transfer_ratesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends transfer_ratesFindFirstArgs>(args?: Prisma.SelectSubset<T, transfer_ratesFindFirstArgs<ExtArgs>>): Prisma.Prisma__transfer_ratesClient<runtime.Types.Result.GetResult<Prisma.$transfer_ratesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends transfer_ratesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, transfer_ratesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__transfer_ratesClient<runtime.Types.Result.GetResult<Prisma.$transfer_ratesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends transfer_ratesFindManyArgs>(args?: Prisma.SelectSubset<T, transfer_ratesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$transfer_ratesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends transfer_ratesCreateArgs>(args: Prisma.SelectSubset<T, transfer_ratesCreateArgs<ExtArgs>>): Prisma.Prisma__transfer_ratesClient<runtime.Types.Result.GetResult<Prisma.$transfer_ratesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends transfer_ratesCreateManyArgs>(args?: Prisma.SelectSubset<T, transfer_ratesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends transfer_ratesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, transfer_ratesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$transfer_ratesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends transfer_ratesDeleteArgs>(args: Prisma.SelectSubset<T, transfer_ratesDeleteArgs<ExtArgs>>): Prisma.Prisma__transfer_ratesClient<runtime.Types.Result.GetResult<Prisma.$transfer_ratesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends transfer_ratesUpdateArgs>(args: Prisma.SelectSubset<T, transfer_ratesUpdateArgs<ExtArgs>>): Prisma.Prisma__transfer_ratesClient<runtime.Types.Result.GetResult<Prisma.$transfer_ratesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends transfer_ratesDeleteManyArgs>(args?: Prisma.SelectSubset<T, transfer_ratesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends transfer_ratesUpdateManyArgs>(args: Prisma.SelectSubset<T, transfer_ratesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends transfer_ratesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, transfer_ratesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$transfer_ratesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends transfer_ratesUpsertArgs>(args: Prisma.SelectSubset<T, transfer_ratesUpsertArgs<ExtArgs>>): Prisma.Prisma__transfer_ratesClient<runtime.Types.Result.GetResult<Prisma.$transfer_ratesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends transfer_ratesCountArgs>(args?: Prisma.Subset<T, transfer_ratesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Transfer_ratesCountAggregateOutputType> : number>;
    aggregate<T extends Transfer_ratesAggregateArgs>(args: Prisma.Subset<T, Transfer_ratesAggregateArgs>): Prisma.PrismaPromise<GetTransfer_ratesAggregateType<T>>;
    groupBy<T extends transfer_ratesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: transfer_ratesGroupByArgs['orderBy'];
    } : {
        orderBy?: transfer_ratesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, transfer_ratesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransfer_ratesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: transfer_ratesFieldRefs;
}
export interface Prisma__transfer_ratesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    dispatch_rates<T extends Prisma.transfer_rates$dispatch_ratesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.transfer_rates$dispatch_ratesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$dispatch_ratesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface transfer_ratesFieldRefs {
    readonly id: Prisma.FieldRef<"transfer_rates", 'String'>;
    readonly name: Prisma.FieldRef<"transfer_rates", 'String'>;
    readonly rate_type: Prisma.FieldRef<"transfer_rates", 'String'>;
    readonly description: Prisma.FieldRef<"transfer_rates", 'String'>;
    readonly active: Prisma.FieldRef<"transfer_rates", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"transfer_rates", 'DateTime'>;
}
export type transfer_ratesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transfer_ratesSelect<ExtArgs> | null;
    omit?: Prisma.transfer_ratesOmit<ExtArgs> | null;
    include?: Prisma.transfer_ratesInclude<ExtArgs> | null;
    where: Prisma.transfer_ratesWhereUniqueInput;
};
export type transfer_ratesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transfer_ratesSelect<ExtArgs> | null;
    omit?: Prisma.transfer_ratesOmit<ExtArgs> | null;
    include?: Prisma.transfer_ratesInclude<ExtArgs> | null;
    where: Prisma.transfer_ratesWhereUniqueInput;
};
export type transfer_ratesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transfer_ratesSelect<ExtArgs> | null;
    omit?: Prisma.transfer_ratesOmit<ExtArgs> | null;
    include?: Prisma.transfer_ratesInclude<ExtArgs> | null;
    where?: Prisma.transfer_ratesWhereInput;
    orderBy?: Prisma.transfer_ratesOrderByWithRelationInput | Prisma.transfer_ratesOrderByWithRelationInput[];
    cursor?: Prisma.transfer_ratesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Transfer_ratesScalarFieldEnum | Prisma.Transfer_ratesScalarFieldEnum[];
};
export type transfer_ratesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transfer_ratesSelect<ExtArgs> | null;
    omit?: Prisma.transfer_ratesOmit<ExtArgs> | null;
    include?: Prisma.transfer_ratesInclude<ExtArgs> | null;
    where?: Prisma.transfer_ratesWhereInput;
    orderBy?: Prisma.transfer_ratesOrderByWithRelationInput | Prisma.transfer_ratesOrderByWithRelationInput[];
    cursor?: Prisma.transfer_ratesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Transfer_ratesScalarFieldEnum | Prisma.Transfer_ratesScalarFieldEnum[];
};
export type transfer_ratesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transfer_ratesSelect<ExtArgs> | null;
    omit?: Prisma.transfer_ratesOmit<ExtArgs> | null;
    include?: Prisma.transfer_ratesInclude<ExtArgs> | null;
    where?: Prisma.transfer_ratesWhereInput;
    orderBy?: Prisma.transfer_ratesOrderByWithRelationInput | Prisma.transfer_ratesOrderByWithRelationInput[];
    cursor?: Prisma.transfer_ratesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Transfer_ratesScalarFieldEnum | Prisma.Transfer_ratesScalarFieldEnum[];
};
export type transfer_ratesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transfer_ratesSelect<ExtArgs> | null;
    omit?: Prisma.transfer_ratesOmit<ExtArgs> | null;
    include?: Prisma.transfer_ratesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.transfer_ratesCreateInput, Prisma.transfer_ratesUncheckedCreateInput>;
};
export type transfer_ratesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.transfer_ratesCreateManyInput | Prisma.transfer_ratesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type transfer_ratesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transfer_ratesSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.transfer_ratesOmit<ExtArgs> | null;
    data: Prisma.transfer_ratesCreateManyInput | Prisma.transfer_ratesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type transfer_ratesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transfer_ratesSelect<ExtArgs> | null;
    omit?: Prisma.transfer_ratesOmit<ExtArgs> | null;
    include?: Prisma.transfer_ratesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.transfer_ratesUpdateInput, Prisma.transfer_ratesUncheckedUpdateInput>;
    where: Prisma.transfer_ratesWhereUniqueInput;
};
export type transfer_ratesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.transfer_ratesUpdateManyMutationInput, Prisma.transfer_ratesUncheckedUpdateManyInput>;
    where?: Prisma.transfer_ratesWhereInput;
    limit?: number;
};
export type transfer_ratesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transfer_ratesSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.transfer_ratesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.transfer_ratesUpdateManyMutationInput, Prisma.transfer_ratesUncheckedUpdateManyInput>;
    where?: Prisma.transfer_ratesWhereInput;
    limit?: number;
};
export type transfer_ratesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transfer_ratesSelect<ExtArgs> | null;
    omit?: Prisma.transfer_ratesOmit<ExtArgs> | null;
    include?: Prisma.transfer_ratesInclude<ExtArgs> | null;
    where: Prisma.transfer_ratesWhereUniqueInput;
    create: Prisma.XOR<Prisma.transfer_ratesCreateInput, Prisma.transfer_ratesUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.transfer_ratesUpdateInput, Prisma.transfer_ratesUncheckedUpdateInput>;
};
export type transfer_ratesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transfer_ratesSelect<ExtArgs> | null;
    omit?: Prisma.transfer_ratesOmit<ExtArgs> | null;
    include?: Prisma.transfer_ratesInclude<ExtArgs> | null;
    where: Prisma.transfer_ratesWhereUniqueInput;
};
export type transfer_ratesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.transfer_ratesWhereInput;
    limit?: number;
};
export type transfer_rates$dispatch_ratesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ratesSelect<ExtArgs> | null;
    omit?: Prisma.dispatch_ratesOmit<ExtArgs> | null;
    include?: Prisma.dispatch_ratesInclude<ExtArgs> | null;
    where?: Prisma.dispatch_ratesWhereInput;
    orderBy?: Prisma.dispatch_ratesOrderByWithRelationInput | Prisma.dispatch_ratesOrderByWithRelationInput[];
    cursor?: Prisma.dispatch_ratesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Dispatch_ratesScalarFieldEnum | Prisma.Dispatch_ratesScalarFieldEnum[];
};
export type transfer_ratesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transfer_ratesSelect<ExtArgs> | null;
    omit?: Prisma.transfer_ratesOmit<ExtArgs> | null;
    include?: Prisma.transfer_ratesInclude<ExtArgs> | null;
};
