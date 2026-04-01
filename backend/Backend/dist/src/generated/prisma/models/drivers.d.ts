import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type driversModel = runtime.Types.Result.DefaultSelection<Prisma.$driversPayload>;
export type AggregateDrivers = {
    _count: DriversCountAggregateOutputType | null;
    _min: DriversMinAggregateOutputType | null;
    _max: DriversMaxAggregateOutputType | null;
};
export type DriversMinAggregateOutputType = {
    id: string | null;
    first_name: string | null;
    last_name: string | null;
    document: string | null;
    phone: string | null;
    active: boolean | null;
    created_at: Date | null;
};
export type DriversMaxAggregateOutputType = {
    id: string | null;
    first_name: string | null;
    last_name: string | null;
    document: string | null;
    phone: string | null;
    active: boolean | null;
    created_at: Date | null;
};
export type DriversCountAggregateOutputType = {
    id: number;
    first_name: number;
    last_name: number;
    document: number;
    phone: number;
    active: number;
    created_at: number;
    _all: number;
};
export type DriversMinAggregateInputType = {
    id?: true;
    first_name?: true;
    last_name?: true;
    document?: true;
    phone?: true;
    active?: true;
    created_at?: true;
};
export type DriversMaxAggregateInputType = {
    id?: true;
    first_name?: true;
    last_name?: true;
    document?: true;
    phone?: true;
    active?: true;
    created_at?: true;
};
export type DriversCountAggregateInputType = {
    id?: true;
    first_name?: true;
    last_name?: true;
    document?: true;
    phone?: true;
    active?: true;
    created_at?: true;
    _all?: true;
};
export type DriversAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.driversWhereInput;
    orderBy?: Prisma.driversOrderByWithRelationInput | Prisma.driversOrderByWithRelationInput[];
    cursor?: Prisma.driversWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DriversCountAggregateInputType;
    _min?: DriversMinAggregateInputType;
    _max?: DriversMaxAggregateInputType;
};
export type GetDriversAggregateType<T extends DriversAggregateArgs> = {
    [P in keyof T & keyof AggregateDrivers]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDrivers[P]> : Prisma.GetScalarType<T[P], AggregateDrivers[P]>;
};
export type driversGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.driversWhereInput;
    orderBy?: Prisma.driversOrderByWithAggregationInput | Prisma.driversOrderByWithAggregationInput[];
    by: Prisma.DriversScalarFieldEnum[] | Prisma.DriversScalarFieldEnum;
    having?: Prisma.driversScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DriversCountAggregateInputType | true;
    _min?: DriversMinAggregateInputType;
    _max?: DriversMaxAggregateInputType;
};
export type DriversGroupByOutputType = {
    id: string;
    first_name: string;
    last_name: string;
    document: string | null;
    phone: string | null;
    active: boolean;
    created_at: Date;
    _count: DriversCountAggregateOutputType | null;
    _min: DriversMinAggregateOutputType | null;
    _max: DriversMaxAggregateOutputType | null;
};
export type GetDriversGroupByPayload<T extends driversGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DriversGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DriversGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DriversGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DriversGroupByOutputType[P]>;
}>>;
export type driversWhereInput = {
    AND?: Prisma.driversWhereInput | Prisma.driversWhereInput[];
    OR?: Prisma.driversWhereInput[];
    NOT?: Prisma.driversWhereInput | Prisma.driversWhereInput[];
    id?: Prisma.UuidFilter<"drivers"> | string;
    first_name?: Prisma.StringFilter<"drivers"> | string;
    last_name?: Prisma.StringFilter<"drivers"> | string;
    document?: Prisma.StringNullableFilter<"drivers"> | string | null;
    phone?: Prisma.StringNullableFilter<"drivers"> | string | null;
    active?: Prisma.BoolFilter<"drivers"> | boolean;
    created_at?: Prisma.DateTimeFilter<"drivers"> | Date | string;
    driverDocuments?: Prisma.Documents_driverListRelationFilter;
    vehicleCombinations?: Prisma.Vehicle_combinationsListRelationFilter;
};
export type driversOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    document?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    driverDocuments?: Prisma.documents_driverOrderByRelationAggregateInput;
    vehicleCombinations?: Prisma.vehicle_combinationsOrderByRelationAggregateInput;
};
export type driversWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.driversWhereInput | Prisma.driversWhereInput[];
    OR?: Prisma.driversWhereInput[];
    NOT?: Prisma.driversWhereInput | Prisma.driversWhereInput[];
    first_name?: Prisma.StringFilter<"drivers"> | string;
    last_name?: Prisma.StringFilter<"drivers"> | string;
    document?: Prisma.StringNullableFilter<"drivers"> | string | null;
    phone?: Prisma.StringNullableFilter<"drivers"> | string | null;
    active?: Prisma.BoolFilter<"drivers"> | boolean;
    created_at?: Prisma.DateTimeFilter<"drivers"> | Date | string;
    driverDocuments?: Prisma.Documents_driverListRelationFilter;
    vehicleCombinations?: Prisma.Vehicle_combinationsListRelationFilter;
}, "id">;
export type driversOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    document?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.driversCountOrderByAggregateInput;
    _max?: Prisma.driversMaxOrderByAggregateInput;
    _min?: Prisma.driversMinOrderByAggregateInput;
};
export type driversScalarWhereWithAggregatesInput = {
    AND?: Prisma.driversScalarWhereWithAggregatesInput | Prisma.driversScalarWhereWithAggregatesInput[];
    OR?: Prisma.driversScalarWhereWithAggregatesInput[];
    NOT?: Prisma.driversScalarWhereWithAggregatesInput | Prisma.driversScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"drivers"> | string;
    first_name?: Prisma.StringWithAggregatesFilter<"drivers"> | string;
    last_name?: Prisma.StringWithAggregatesFilter<"drivers"> | string;
    document?: Prisma.StringNullableWithAggregatesFilter<"drivers"> | string | null;
    phone?: Prisma.StringNullableWithAggregatesFilter<"drivers"> | string | null;
    active?: Prisma.BoolWithAggregatesFilter<"drivers"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"drivers"> | Date | string;
};
export type driversCreateInput = {
    id?: string;
    first_name: string;
    last_name: string;
    document?: string | null;
    phone?: string | null;
    active?: boolean;
    created_at?: Date | string;
    driverDocuments?: Prisma.documents_driverCreateNestedManyWithoutDriversInput;
    vehicleCombinations?: Prisma.vehicle_combinationsCreateNestedManyWithoutDriversInput;
};
export type driversUncheckedCreateInput = {
    id?: string;
    first_name: string;
    last_name: string;
    document?: string | null;
    phone?: string | null;
    active?: boolean;
    created_at?: Date | string;
    driverDocuments?: Prisma.documents_driverUncheckedCreateNestedManyWithoutDriversInput;
    vehicleCombinations?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutDriversInput;
};
export type driversUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    document?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    driverDocuments?: Prisma.documents_driverUpdateManyWithoutDriversNestedInput;
    vehicleCombinations?: Prisma.vehicle_combinationsUpdateManyWithoutDriversNestedInput;
};
export type driversUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    document?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    driverDocuments?: Prisma.documents_driverUncheckedUpdateManyWithoutDriversNestedInput;
    vehicleCombinations?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutDriversNestedInput;
};
export type driversCreateManyInput = {
    id?: string;
    first_name: string;
    last_name: string;
    document?: string | null;
    phone?: string | null;
    active?: boolean;
    created_at?: Date | string;
};
export type driversUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    document?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type driversUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    document?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type driversCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    document?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type driversMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    document?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type driversMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    first_name?: Prisma.SortOrder;
    last_name?: Prisma.SortOrder;
    document?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type DriversNullableScalarRelationFilter = {
    is?: Prisma.driversWhereInput | null;
    isNot?: Prisma.driversWhereInput | null;
};
export type DriversScalarRelationFilter = {
    is?: Prisma.driversWhereInput;
    isNot?: Prisma.driversWhereInput;
};
export type driversCreateNestedOneWithoutVehicleCombinationsInput = {
    create?: Prisma.XOR<Prisma.driversCreateWithoutVehicleCombinationsInput, Prisma.driversUncheckedCreateWithoutVehicleCombinationsInput>;
    connectOrCreate?: Prisma.driversCreateOrConnectWithoutVehicleCombinationsInput;
    connect?: Prisma.driversWhereUniqueInput;
};
export type driversUpdateOneWithoutVehicleCombinationsNestedInput = {
    create?: Prisma.XOR<Prisma.driversCreateWithoutVehicleCombinationsInput, Prisma.driversUncheckedCreateWithoutVehicleCombinationsInput>;
    connectOrCreate?: Prisma.driversCreateOrConnectWithoutVehicleCombinationsInput;
    upsert?: Prisma.driversUpsertWithoutVehicleCombinationsInput;
    disconnect?: Prisma.driversWhereInput | boolean;
    delete?: Prisma.driversWhereInput | boolean;
    connect?: Prisma.driversWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.driversUpdateToOneWithWhereWithoutVehicleCombinationsInput, Prisma.driversUpdateWithoutVehicleCombinationsInput>, Prisma.driversUncheckedUpdateWithoutVehicleCombinationsInput>;
};
export type driversCreateNestedOneWithoutDriverDocumentsInput = {
    create?: Prisma.XOR<Prisma.driversCreateWithoutDriverDocumentsInput, Prisma.driversUncheckedCreateWithoutDriverDocumentsInput>;
    connectOrCreate?: Prisma.driversCreateOrConnectWithoutDriverDocumentsInput;
    connect?: Prisma.driversWhereUniqueInput;
};
export type driversUpdateOneRequiredWithoutDriverDocumentsNestedInput = {
    create?: Prisma.XOR<Prisma.driversCreateWithoutDriverDocumentsInput, Prisma.driversUncheckedCreateWithoutDriverDocumentsInput>;
    connectOrCreate?: Prisma.driversCreateOrConnectWithoutDriverDocumentsInput;
    upsert?: Prisma.driversUpsertWithoutDriverDocumentsInput;
    connect?: Prisma.driversWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.driversUpdateToOneWithWhereWithoutDriverDocumentsInput, Prisma.driversUpdateWithoutDriverDocumentsInput>, Prisma.driversUncheckedUpdateWithoutDriverDocumentsInput>;
};
export type driversCreateWithoutVehicleCombinationsInput = {
    id?: string;
    first_name: string;
    last_name: string;
    document?: string | null;
    phone?: string | null;
    active?: boolean;
    created_at?: Date | string;
    driverDocuments?: Prisma.documents_driverCreateNestedManyWithoutDriversInput;
};
export type driversUncheckedCreateWithoutVehicleCombinationsInput = {
    id?: string;
    first_name: string;
    last_name: string;
    document?: string | null;
    phone?: string | null;
    active?: boolean;
    created_at?: Date | string;
    driverDocuments?: Prisma.documents_driverUncheckedCreateNestedManyWithoutDriversInput;
};
export type driversCreateOrConnectWithoutVehicleCombinationsInput = {
    where: Prisma.driversWhereUniqueInput;
    create: Prisma.XOR<Prisma.driversCreateWithoutVehicleCombinationsInput, Prisma.driversUncheckedCreateWithoutVehicleCombinationsInput>;
};
export type driversUpsertWithoutVehicleCombinationsInput = {
    update: Prisma.XOR<Prisma.driversUpdateWithoutVehicleCombinationsInput, Prisma.driversUncheckedUpdateWithoutVehicleCombinationsInput>;
    create: Prisma.XOR<Prisma.driversCreateWithoutVehicleCombinationsInput, Prisma.driversUncheckedCreateWithoutVehicleCombinationsInput>;
    where?: Prisma.driversWhereInput;
};
export type driversUpdateToOneWithWhereWithoutVehicleCombinationsInput = {
    where?: Prisma.driversWhereInput;
    data: Prisma.XOR<Prisma.driversUpdateWithoutVehicleCombinationsInput, Prisma.driversUncheckedUpdateWithoutVehicleCombinationsInput>;
};
export type driversUpdateWithoutVehicleCombinationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    document?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    driverDocuments?: Prisma.documents_driverUpdateManyWithoutDriversNestedInput;
};
export type driversUncheckedUpdateWithoutVehicleCombinationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    document?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    driverDocuments?: Prisma.documents_driverUncheckedUpdateManyWithoutDriversNestedInput;
};
export type driversCreateWithoutDriverDocumentsInput = {
    id?: string;
    first_name: string;
    last_name: string;
    document?: string | null;
    phone?: string | null;
    active?: boolean;
    created_at?: Date | string;
    vehicleCombinations?: Prisma.vehicle_combinationsCreateNestedManyWithoutDriversInput;
};
export type driversUncheckedCreateWithoutDriverDocumentsInput = {
    id?: string;
    first_name: string;
    last_name: string;
    document?: string | null;
    phone?: string | null;
    active?: boolean;
    created_at?: Date | string;
    vehicleCombinations?: Prisma.vehicle_combinationsUncheckedCreateNestedManyWithoutDriversInput;
};
export type driversCreateOrConnectWithoutDriverDocumentsInput = {
    where: Prisma.driversWhereUniqueInput;
    create: Prisma.XOR<Prisma.driversCreateWithoutDriverDocumentsInput, Prisma.driversUncheckedCreateWithoutDriverDocumentsInput>;
};
export type driversUpsertWithoutDriverDocumentsInput = {
    update: Prisma.XOR<Prisma.driversUpdateWithoutDriverDocumentsInput, Prisma.driversUncheckedUpdateWithoutDriverDocumentsInput>;
    create: Prisma.XOR<Prisma.driversCreateWithoutDriverDocumentsInput, Prisma.driversUncheckedCreateWithoutDriverDocumentsInput>;
    where?: Prisma.driversWhereInput;
};
export type driversUpdateToOneWithWhereWithoutDriverDocumentsInput = {
    where?: Prisma.driversWhereInput;
    data: Prisma.XOR<Prisma.driversUpdateWithoutDriverDocumentsInput, Prisma.driversUncheckedUpdateWithoutDriverDocumentsInput>;
};
export type driversUpdateWithoutDriverDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    document?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicleCombinations?: Prisma.vehicle_combinationsUpdateManyWithoutDriversNestedInput;
};
export type driversUncheckedUpdateWithoutDriverDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    first_name?: Prisma.StringFieldUpdateOperationsInput | string;
    last_name?: Prisma.StringFieldUpdateOperationsInput | string;
    document?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicleCombinations?: Prisma.vehicle_combinationsUncheckedUpdateManyWithoutDriversNestedInput;
};
export type DriversCountOutputType = {
    driverDocuments: number;
    vehicleCombinations: number;
};
export type DriversCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    driverDocuments?: boolean | DriversCountOutputTypeCountDriverDocumentsArgs;
    vehicleCombinations?: boolean | DriversCountOutputTypeCountVehicleCombinationsArgs;
};
export type DriversCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DriversCountOutputTypeSelect<ExtArgs> | null;
};
export type DriversCountOutputTypeCountDriverDocumentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documents_driverWhereInput;
};
export type DriversCountOutputTypeCountVehicleCombinationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.vehicle_combinationsWhereInput;
};
export type driversSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    document?: boolean;
    phone?: boolean;
    active?: boolean;
    created_at?: boolean;
    driverDocuments?: boolean | Prisma.drivers$driverDocumentsArgs<ExtArgs>;
    vehicleCombinations?: boolean | Prisma.drivers$vehicleCombinationsArgs<ExtArgs>;
    _count?: boolean | Prisma.DriversCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["drivers"]>;
export type driversSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    document?: boolean;
    phone?: boolean;
    active?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["drivers"]>;
export type driversSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    document?: boolean;
    phone?: boolean;
    active?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["drivers"]>;
export type driversSelectScalar = {
    id?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    document?: boolean;
    phone?: boolean;
    active?: boolean;
    created_at?: boolean;
};
export type driversOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "first_name" | "last_name" | "document" | "phone" | "active" | "created_at", ExtArgs["result"]["drivers"]>;
export type driversInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    driverDocuments?: boolean | Prisma.drivers$driverDocumentsArgs<ExtArgs>;
    vehicleCombinations?: boolean | Prisma.drivers$vehicleCombinationsArgs<ExtArgs>;
    _count?: boolean | Prisma.DriversCountOutputTypeDefaultArgs<ExtArgs>;
};
export type driversIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type driversIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $driversPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "drivers";
    objects: {
        driverDocuments: Prisma.$documents_driverPayload<ExtArgs>[];
        vehicleCombinations: Prisma.$vehicle_combinationsPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        first_name: string;
        last_name: string;
        document: string | null;
        phone: string | null;
        active: boolean;
        created_at: Date;
    }, ExtArgs["result"]["drivers"]>;
    composites: {};
};
export type driversGetPayload<S extends boolean | null | undefined | driversDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$driversPayload, S>;
export type driversCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<driversFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DriversCountAggregateInputType | true;
};
export interface driversDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['drivers'];
        meta: {
            name: 'drivers';
        };
    };
    findUnique<T extends driversFindUniqueArgs>(args: Prisma.SelectSubset<T, driversFindUniqueArgs<ExtArgs>>): Prisma.Prisma__driversClient<runtime.Types.Result.GetResult<Prisma.$driversPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends driversFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, driversFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__driversClient<runtime.Types.Result.GetResult<Prisma.$driversPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends driversFindFirstArgs>(args?: Prisma.SelectSubset<T, driversFindFirstArgs<ExtArgs>>): Prisma.Prisma__driversClient<runtime.Types.Result.GetResult<Prisma.$driversPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends driversFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, driversFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__driversClient<runtime.Types.Result.GetResult<Prisma.$driversPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends driversFindManyArgs>(args?: Prisma.SelectSubset<T, driversFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$driversPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends driversCreateArgs>(args: Prisma.SelectSubset<T, driversCreateArgs<ExtArgs>>): Prisma.Prisma__driversClient<runtime.Types.Result.GetResult<Prisma.$driversPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends driversCreateManyArgs>(args?: Prisma.SelectSubset<T, driversCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends driversCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, driversCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$driversPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends driversDeleteArgs>(args: Prisma.SelectSubset<T, driversDeleteArgs<ExtArgs>>): Prisma.Prisma__driversClient<runtime.Types.Result.GetResult<Prisma.$driversPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends driversUpdateArgs>(args: Prisma.SelectSubset<T, driversUpdateArgs<ExtArgs>>): Prisma.Prisma__driversClient<runtime.Types.Result.GetResult<Prisma.$driversPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends driversDeleteManyArgs>(args?: Prisma.SelectSubset<T, driversDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends driversUpdateManyArgs>(args: Prisma.SelectSubset<T, driversUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends driversUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, driversUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$driversPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends driversUpsertArgs>(args: Prisma.SelectSubset<T, driversUpsertArgs<ExtArgs>>): Prisma.Prisma__driversClient<runtime.Types.Result.GetResult<Prisma.$driversPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends driversCountArgs>(args?: Prisma.Subset<T, driversCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DriversCountAggregateOutputType> : number>;
    aggregate<T extends DriversAggregateArgs>(args: Prisma.Subset<T, DriversAggregateArgs>): Prisma.PrismaPromise<GetDriversAggregateType<T>>;
    groupBy<T extends driversGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: driversGroupByArgs['orderBy'];
    } : {
        orderBy?: driversGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, driversGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDriversGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: driversFieldRefs;
}
export interface Prisma__driversClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    driverDocuments<T extends Prisma.drivers$driverDocumentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.drivers$driverDocumentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documents_driverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    vehicleCombinations<T extends Prisma.drivers$vehicleCombinationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.drivers$vehicleCombinationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$vehicle_combinationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface driversFieldRefs {
    readonly id: Prisma.FieldRef<"drivers", 'String'>;
    readonly first_name: Prisma.FieldRef<"drivers", 'String'>;
    readonly last_name: Prisma.FieldRef<"drivers", 'String'>;
    readonly document: Prisma.FieldRef<"drivers", 'String'>;
    readonly phone: Prisma.FieldRef<"drivers", 'String'>;
    readonly active: Prisma.FieldRef<"drivers", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"drivers", 'DateTime'>;
}
export type driversFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.driversSelect<ExtArgs> | null;
    omit?: Prisma.driversOmit<ExtArgs> | null;
    include?: Prisma.driversInclude<ExtArgs> | null;
    where: Prisma.driversWhereUniqueInput;
};
export type driversFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.driversSelect<ExtArgs> | null;
    omit?: Prisma.driversOmit<ExtArgs> | null;
    include?: Prisma.driversInclude<ExtArgs> | null;
    where: Prisma.driversWhereUniqueInput;
};
export type driversFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.driversSelect<ExtArgs> | null;
    omit?: Prisma.driversOmit<ExtArgs> | null;
    include?: Prisma.driversInclude<ExtArgs> | null;
    where?: Prisma.driversWhereInput;
    orderBy?: Prisma.driversOrderByWithRelationInput | Prisma.driversOrderByWithRelationInput[];
    cursor?: Prisma.driversWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DriversScalarFieldEnum | Prisma.DriversScalarFieldEnum[];
};
export type driversFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.driversSelect<ExtArgs> | null;
    omit?: Prisma.driversOmit<ExtArgs> | null;
    include?: Prisma.driversInclude<ExtArgs> | null;
    where?: Prisma.driversWhereInput;
    orderBy?: Prisma.driversOrderByWithRelationInput | Prisma.driversOrderByWithRelationInput[];
    cursor?: Prisma.driversWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DriversScalarFieldEnum | Prisma.DriversScalarFieldEnum[];
};
export type driversFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.driversSelect<ExtArgs> | null;
    omit?: Prisma.driversOmit<ExtArgs> | null;
    include?: Prisma.driversInclude<ExtArgs> | null;
    where?: Prisma.driversWhereInput;
    orderBy?: Prisma.driversOrderByWithRelationInput | Prisma.driversOrderByWithRelationInput[];
    cursor?: Prisma.driversWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DriversScalarFieldEnum | Prisma.DriversScalarFieldEnum[];
};
export type driversCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.driversSelect<ExtArgs> | null;
    omit?: Prisma.driversOmit<ExtArgs> | null;
    include?: Prisma.driversInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.driversCreateInput, Prisma.driversUncheckedCreateInput>;
};
export type driversCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.driversCreateManyInput | Prisma.driversCreateManyInput[];
    skipDuplicates?: boolean;
};
export type driversCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.driversSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.driversOmit<ExtArgs> | null;
    data: Prisma.driversCreateManyInput | Prisma.driversCreateManyInput[];
    skipDuplicates?: boolean;
};
export type driversUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.driversSelect<ExtArgs> | null;
    omit?: Prisma.driversOmit<ExtArgs> | null;
    include?: Prisma.driversInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.driversUpdateInput, Prisma.driversUncheckedUpdateInput>;
    where: Prisma.driversWhereUniqueInput;
};
export type driversUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.driversUpdateManyMutationInput, Prisma.driversUncheckedUpdateManyInput>;
    where?: Prisma.driversWhereInput;
    limit?: number;
};
export type driversUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.driversSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.driversOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.driversUpdateManyMutationInput, Prisma.driversUncheckedUpdateManyInput>;
    where?: Prisma.driversWhereInput;
    limit?: number;
};
export type driversUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.driversSelect<ExtArgs> | null;
    omit?: Prisma.driversOmit<ExtArgs> | null;
    include?: Prisma.driversInclude<ExtArgs> | null;
    where: Prisma.driversWhereUniqueInput;
    create: Prisma.XOR<Prisma.driversCreateInput, Prisma.driversUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.driversUpdateInput, Prisma.driversUncheckedUpdateInput>;
};
export type driversDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.driversSelect<ExtArgs> | null;
    omit?: Prisma.driversOmit<ExtArgs> | null;
    include?: Prisma.driversInclude<ExtArgs> | null;
    where: Prisma.driversWhereUniqueInput;
};
export type driversDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.driversWhereInput;
    limit?: number;
};
export type drivers$driverDocumentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type drivers$vehicleCombinationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.vehicle_combinationsSelect<ExtArgs> | null;
    omit?: Prisma.vehicle_combinationsOmit<ExtArgs> | null;
    include?: Prisma.vehicle_combinationsInclude<ExtArgs> | null;
    where?: Prisma.vehicle_combinationsWhereInput;
    orderBy?: Prisma.vehicle_combinationsOrderByWithRelationInput | Prisma.vehicle_combinationsOrderByWithRelationInput[];
    cursor?: Prisma.vehicle_combinationsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Vehicle_combinationsScalarFieldEnum | Prisma.Vehicle_combinationsScalarFieldEnum[];
};
export type driversDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.driversSelect<ExtArgs> | null;
    omit?: Prisma.driversOmit<ExtArgs> | null;
    include?: Prisma.driversInclude<ExtArgs> | null;
};
