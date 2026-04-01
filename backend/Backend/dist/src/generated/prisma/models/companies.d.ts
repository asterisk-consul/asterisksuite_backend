import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type companiesModel = runtime.Types.Result.DefaultSelection<Prisma.$companiesPayload>;
export type AggregateCompanies = {
    _count: CompaniesCountAggregateOutputType | null;
    _min: CompaniesMinAggregateOutputType | null;
    _max: CompaniesMaxAggregateOutputType | null;
};
export type CompaniesMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    tax_id: string | null;
    phone: string | null;
    created_at: Date | null;
};
export type CompaniesMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    tax_id: string | null;
    phone: string | null;
    created_at: Date | null;
};
export type CompaniesCountAggregateOutputType = {
    id: number;
    name: number;
    tax_id: number;
    phone: number;
    created_at: number;
    _all: number;
};
export type CompaniesMinAggregateInputType = {
    id?: true;
    name?: true;
    tax_id?: true;
    phone?: true;
    created_at?: true;
};
export type CompaniesMaxAggregateInputType = {
    id?: true;
    name?: true;
    tax_id?: true;
    phone?: true;
    created_at?: true;
};
export type CompaniesCountAggregateInputType = {
    id?: true;
    name?: true;
    tax_id?: true;
    phone?: true;
    created_at?: true;
    _all?: true;
};
export type CompaniesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.companiesWhereInput;
    orderBy?: Prisma.companiesOrderByWithRelationInput | Prisma.companiesOrderByWithRelationInput[];
    cursor?: Prisma.companiesWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CompaniesCountAggregateInputType;
    _min?: CompaniesMinAggregateInputType;
    _max?: CompaniesMaxAggregateInputType;
};
export type GetCompaniesAggregateType<T extends CompaniesAggregateArgs> = {
    [P in keyof T & keyof AggregateCompanies]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCompanies[P]> : Prisma.GetScalarType<T[P], AggregateCompanies[P]>;
};
export type companiesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.companiesWhereInput;
    orderBy?: Prisma.companiesOrderByWithAggregationInput | Prisma.companiesOrderByWithAggregationInput[];
    by: Prisma.CompaniesScalarFieldEnum[] | Prisma.CompaniesScalarFieldEnum;
    having?: Prisma.companiesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CompaniesCountAggregateInputType | true;
    _min?: CompaniesMinAggregateInputType;
    _max?: CompaniesMaxAggregateInputType;
};
export type CompaniesGroupByOutputType = {
    id: string;
    name: string;
    tax_id: string | null;
    phone: string | null;
    created_at: Date;
    _count: CompaniesCountAggregateOutputType | null;
    _min: CompaniesMinAggregateOutputType | null;
    _max: CompaniesMaxAggregateOutputType | null;
};
export type GetCompaniesGroupByPayload<T extends companiesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CompaniesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CompaniesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CompaniesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CompaniesGroupByOutputType[P]>;
}>>;
export type companiesWhereInput = {
    AND?: Prisma.companiesWhereInput | Prisma.companiesWhereInput[];
    OR?: Prisma.companiesWhereInput[];
    NOT?: Prisma.companiesWhereInput | Prisma.companiesWhereInput[];
    id?: Prisma.UuidFilter<"companies"> | string;
    name?: Prisma.StringFilter<"companies"> | string;
    tax_id?: Prisma.StringNullableFilter<"companies"> | string | null;
    phone?: Prisma.StringNullableFilter<"companies"> | string | null;
    created_at?: Prisma.DateTimeFilter<"companies"> | Date | string;
};
export type companiesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type companiesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.companiesWhereInput | Prisma.companiesWhereInput[];
    OR?: Prisma.companiesWhereInput[];
    NOT?: Prisma.companiesWhereInput | Prisma.companiesWhereInput[];
    name?: Prisma.StringFilter<"companies"> | string;
    tax_id?: Prisma.StringNullableFilter<"companies"> | string | null;
    phone?: Prisma.StringNullableFilter<"companies"> | string | null;
    created_at?: Prisma.DateTimeFilter<"companies"> | Date | string;
}, "id">;
export type companiesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.companiesCountOrderByAggregateInput;
    _max?: Prisma.companiesMaxOrderByAggregateInput;
    _min?: Prisma.companiesMinOrderByAggregateInput;
};
export type companiesScalarWhereWithAggregatesInput = {
    AND?: Prisma.companiesScalarWhereWithAggregatesInput | Prisma.companiesScalarWhereWithAggregatesInput[];
    OR?: Prisma.companiesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.companiesScalarWhereWithAggregatesInput | Prisma.companiesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"companies"> | string;
    name?: Prisma.StringWithAggregatesFilter<"companies"> | string;
    tax_id?: Prisma.StringNullableWithAggregatesFilter<"companies"> | string | null;
    phone?: Prisma.StringNullableWithAggregatesFilter<"companies"> | string | null;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"companies"> | Date | string;
};
export type companiesCreateInput = {
    id?: string;
    name: string;
    tax_id?: string | null;
    phone?: string | null;
    created_at?: Date | string;
};
export type companiesUncheckedCreateInput = {
    id?: string;
    name: string;
    tax_id?: string | null;
    phone?: string | null;
    created_at?: Date | string;
};
export type companiesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type companiesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type companiesCreateManyInput = {
    id?: string;
    name: string;
    tax_id?: string | null;
    phone?: string | null;
    created_at?: Date | string;
};
export type companiesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type companiesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type companiesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type companiesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type companiesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type companiesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    tax_id?: boolean;
    phone?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["companies"]>;
export type companiesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    tax_id?: boolean;
    phone?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["companies"]>;
export type companiesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    tax_id?: boolean;
    phone?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["companies"]>;
export type companiesSelectScalar = {
    id?: boolean;
    name?: boolean;
    tax_id?: boolean;
    phone?: boolean;
    created_at?: boolean;
};
export type companiesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "tax_id" | "phone" | "created_at", ExtArgs["result"]["companies"]>;
export type $companiesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "companies";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        tax_id: string | null;
        phone: string | null;
        created_at: Date;
    }, ExtArgs["result"]["companies"]>;
    composites: {};
};
export type companiesGetPayload<S extends boolean | null | undefined | companiesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$companiesPayload, S>;
export type companiesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<companiesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CompaniesCountAggregateInputType | true;
};
export interface companiesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['companies'];
        meta: {
            name: 'companies';
        };
    };
    findUnique<T extends companiesFindUniqueArgs>(args: Prisma.SelectSubset<T, companiesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__companiesClient<runtime.Types.Result.GetResult<Prisma.$companiesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends companiesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, companiesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__companiesClient<runtime.Types.Result.GetResult<Prisma.$companiesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends companiesFindFirstArgs>(args?: Prisma.SelectSubset<T, companiesFindFirstArgs<ExtArgs>>): Prisma.Prisma__companiesClient<runtime.Types.Result.GetResult<Prisma.$companiesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends companiesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, companiesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__companiesClient<runtime.Types.Result.GetResult<Prisma.$companiesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends companiesFindManyArgs>(args?: Prisma.SelectSubset<T, companiesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$companiesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends companiesCreateArgs>(args: Prisma.SelectSubset<T, companiesCreateArgs<ExtArgs>>): Prisma.Prisma__companiesClient<runtime.Types.Result.GetResult<Prisma.$companiesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends companiesCreateManyArgs>(args?: Prisma.SelectSubset<T, companiesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends companiesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, companiesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$companiesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends companiesDeleteArgs>(args: Prisma.SelectSubset<T, companiesDeleteArgs<ExtArgs>>): Prisma.Prisma__companiesClient<runtime.Types.Result.GetResult<Prisma.$companiesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends companiesUpdateArgs>(args: Prisma.SelectSubset<T, companiesUpdateArgs<ExtArgs>>): Prisma.Prisma__companiesClient<runtime.Types.Result.GetResult<Prisma.$companiesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends companiesDeleteManyArgs>(args?: Prisma.SelectSubset<T, companiesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends companiesUpdateManyArgs>(args: Prisma.SelectSubset<T, companiesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends companiesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, companiesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$companiesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends companiesUpsertArgs>(args: Prisma.SelectSubset<T, companiesUpsertArgs<ExtArgs>>): Prisma.Prisma__companiesClient<runtime.Types.Result.GetResult<Prisma.$companiesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends companiesCountArgs>(args?: Prisma.Subset<T, companiesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CompaniesCountAggregateOutputType> : number>;
    aggregate<T extends CompaniesAggregateArgs>(args: Prisma.Subset<T, CompaniesAggregateArgs>): Prisma.PrismaPromise<GetCompaniesAggregateType<T>>;
    groupBy<T extends companiesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: companiesGroupByArgs['orderBy'];
    } : {
        orderBy?: companiesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, companiesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompaniesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: companiesFieldRefs;
}
export interface Prisma__companiesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface companiesFieldRefs {
    readonly id: Prisma.FieldRef<"companies", 'String'>;
    readonly name: Prisma.FieldRef<"companies", 'String'>;
    readonly tax_id: Prisma.FieldRef<"companies", 'String'>;
    readonly phone: Prisma.FieldRef<"companies", 'String'>;
    readonly created_at: Prisma.FieldRef<"companies", 'DateTime'>;
}
export type companiesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.companiesSelect<ExtArgs> | null;
    omit?: Prisma.companiesOmit<ExtArgs> | null;
    where: Prisma.companiesWhereUniqueInput;
};
export type companiesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.companiesSelect<ExtArgs> | null;
    omit?: Prisma.companiesOmit<ExtArgs> | null;
    where: Prisma.companiesWhereUniqueInput;
};
export type companiesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.companiesSelect<ExtArgs> | null;
    omit?: Prisma.companiesOmit<ExtArgs> | null;
    where?: Prisma.companiesWhereInput;
    orderBy?: Prisma.companiesOrderByWithRelationInput | Prisma.companiesOrderByWithRelationInput[];
    cursor?: Prisma.companiesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CompaniesScalarFieldEnum | Prisma.CompaniesScalarFieldEnum[];
};
export type companiesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.companiesSelect<ExtArgs> | null;
    omit?: Prisma.companiesOmit<ExtArgs> | null;
    where?: Prisma.companiesWhereInput;
    orderBy?: Prisma.companiesOrderByWithRelationInput | Prisma.companiesOrderByWithRelationInput[];
    cursor?: Prisma.companiesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CompaniesScalarFieldEnum | Prisma.CompaniesScalarFieldEnum[];
};
export type companiesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.companiesSelect<ExtArgs> | null;
    omit?: Prisma.companiesOmit<ExtArgs> | null;
    where?: Prisma.companiesWhereInput;
    orderBy?: Prisma.companiesOrderByWithRelationInput | Prisma.companiesOrderByWithRelationInput[];
    cursor?: Prisma.companiesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CompaniesScalarFieldEnum | Prisma.CompaniesScalarFieldEnum[];
};
export type companiesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.companiesSelect<ExtArgs> | null;
    omit?: Prisma.companiesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.companiesCreateInput, Prisma.companiesUncheckedCreateInput>;
};
export type companiesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.companiesCreateManyInput | Prisma.companiesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type companiesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.companiesSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.companiesOmit<ExtArgs> | null;
    data: Prisma.companiesCreateManyInput | Prisma.companiesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type companiesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.companiesSelect<ExtArgs> | null;
    omit?: Prisma.companiesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.companiesUpdateInput, Prisma.companiesUncheckedUpdateInput>;
    where: Prisma.companiesWhereUniqueInput;
};
export type companiesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.companiesUpdateManyMutationInput, Prisma.companiesUncheckedUpdateManyInput>;
    where?: Prisma.companiesWhereInput;
    limit?: number;
};
export type companiesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.companiesSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.companiesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.companiesUpdateManyMutationInput, Prisma.companiesUncheckedUpdateManyInput>;
    where?: Prisma.companiesWhereInput;
    limit?: number;
};
export type companiesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.companiesSelect<ExtArgs> | null;
    omit?: Prisma.companiesOmit<ExtArgs> | null;
    where: Prisma.companiesWhereUniqueInput;
    create: Prisma.XOR<Prisma.companiesCreateInput, Prisma.companiesUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.companiesUpdateInput, Prisma.companiesUncheckedUpdateInput>;
};
export type companiesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.companiesSelect<ExtArgs> | null;
    omit?: Prisma.companiesOmit<ExtArgs> | null;
    where: Prisma.companiesWhereUniqueInput;
};
export type companiesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.companiesWhereInput;
    limit?: number;
};
export type companiesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.companiesSelect<ExtArgs> | null;
    omit?: Prisma.companiesOmit<ExtArgs> | null;
};
