import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type transport_document_typesModel = runtime.Types.Result.DefaultSelection<Prisma.$transport_document_typesPayload>;
export type AggregateTransport_document_types = {
    _count: Transport_document_typesCountAggregateOutputType | null;
    _min: Transport_document_typesMinAggregateOutputType | null;
    _max: Transport_document_typesMaxAggregateOutputType | null;
};
export type Transport_document_typesMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    entity: string | null;
    active: boolean | null;
    created_at: Date | null;
};
export type Transport_document_typesMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    entity: string | null;
    active: boolean | null;
    created_at: Date | null;
};
export type Transport_document_typesCountAggregateOutputType = {
    id: number;
    name: number;
    entity: number;
    active: number;
    created_at: number;
    _all: number;
};
export type Transport_document_typesMinAggregateInputType = {
    id?: true;
    name?: true;
    entity?: true;
    active?: true;
    created_at?: true;
};
export type Transport_document_typesMaxAggregateInputType = {
    id?: true;
    name?: true;
    entity?: true;
    active?: true;
    created_at?: true;
};
export type Transport_document_typesCountAggregateInputType = {
    id?: true;
    name?: true;
    entity?: true;
    active?: true;
    created_at?: true;
    _all?: true;
};
export type Transport_document_typesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.transport_document_typesWhereInput;
    orderBy?: Prisma.transport_document_typesOrderByWithRelationInput | Prisma.transport_document_typesOrderByWithRelationInput[];
    cursor?: Prisma.transport_document_typesWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Transport_document_typesCountAggregateInputType;
    _min?: Transport_document_typesMinAggregateInputType;
    _max?: Transport_document_typesMaxAggregateInputType;
};
export type GetTransport_document_typesAggregateType<T extends Transport_document_typesAggregateArgs> = {
    [P in keyof T & keyof AggregateTransport_document_types]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTransport_document_types[P]> : Prisma.GetScalarType<T[P], AggregateTransport_document_types[P]>;
};
export type transport_document_typesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.transport_document_typesWhereInput;
    orderBy?: Prisma.transport_document_typesOrderByWithAggregationInput | Prisma.transport_document_typesOrderByWithAggregationInput[];
    by: Prisma.Transport_document_typesScalarFieldEnum[] | Prisma.Transport_document_typesScalarFieldEnum;
    having?: Prisma.transport_document_typesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Transport_document_typesCountAggregateInputType | true;
    _min?: Transport_document_typesMinAggregateInputType;
    _max?: Transport_document_typesMaxAggregateInputType;
};
export type Transport_document_typesGroupByOutputType = {
    id: string;
    name: string;
    entity: string;
    active: boolean | null;
    created_at: Date | null;
    _count: Transport_document_typesCountAggregateOutputType | null;
    _min: Transport_document_typesMinAggregateOutputType | null;
    _max: Transport_document_typesMaxAggregateOutputType | null;
};
export type GetTransport_document_typesGroupByPayload<T extends transport_document_typesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Transport_document_typesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Transport_document_typesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Transport_document_typesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Transport_document_typesGroupByOutputType[P]>;
}>>;
export type transport_document_typesWhereInput = {
    AND?: Prisma.transport_document_typesWhereInput | Prisma.transport_document_typesWhereInput[];
    OR?: Prisma.transport_document_typesWhereInput[];
    NOT?: Prisma.transport_document_typesWhereInput | Prisma.transport_document_typesWhereInput[];
    id?: Prisma.UuidFilter<"transport_document_types"> | string;
    name?: Prisma.StringFilter<"transport_document_types"> | string;
    entity?: Prisma.StringFilter<"transport_document_types"> | string;
    active?: Prisma.BoolNullableFilter<"transport_document_types"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"transport_document_types"> | Date | string | null;
    documents_driver?: Prisma.Documents_driverListRelationFilter;
    documents_vehicle?: Prisma.Documents_vehicleListRelationFilter;
};
export type transport_document_typesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    entity?: Prisma.SortOrder;
    active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    documents_driver?: Prisma.documents_driverOrderByRelationAggregateInput;
    documents_vehicle?: Prisma.documents_vehicleOrderByRelationAggregateInput;
};
export type transport_document_typesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.transport_document_typesWhereInput | Prisma.transport_document_typesWhereInput[];
    OR?: Prisma.transport_document_typesWhereInput[];
    NOT?: Prisma.transport_document_typesWhereInput | Prisma.transport_document_typesWhereInput[];
    name?: Prisma.StringFilter<"transport_document_types"> | string;
    entity?: Prisma.StringFilter<"transport_document_types"> | string;
    active?: Prisma.BoolNullableFilter<"transport_document_types"> | boolean | null;
    created_at?: Prisma.DateTimeNullableFilter<"transport_document_types"> | Date | string | null;
    documents_driver?: Prisma.Documents_driverListRelationFilter;
    documents_vehicle?: Prisma.Documents_vehicleListRelationFilter;
}, "id">;
export type transport_document_typesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    entity?: Prisma.SortOrder;
    active?: Prisma.SortOrderInput | Prisma.SortOrder;
    created_at?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.transport_document_typesCountOrderByAggregateInput;
    _max?: Prisma.transport_document_typesMaxOrderByAggregateInput;
    _min?: Prisma.transport_document_typesMinOrderByAggregateInput;
};
export type transport_document_typesScalarWhereWithAggregatesInput = {
    AND?: Prisma.transport_document_typesScalarWhereWithAggregatesInput | Prisma.transport_document_typesScalarWhereWithAggregatesInput[];
    OR?: Prisma.transport_document_typesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.transport_document_typesScalarWhereWithAggregatesInput | Prisma.transport_document_typesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"transport_document_types"> | string;
    name?: Prisma.StringWithAggregatesFilter<"transport_document_types"> | string;
    entity?: Prisma.StringWithAggregatesFilter<"transport_document_types"> | string;
    active?: Prisma.BoolNullableWithAggregatesFilter<"transport_document_types"> | boolean | null;
    created_at?: Prisma.DateTimeNullableWithAggregatesFilter<"transport_document_types"> | Date | string | null;
};
export type transport_document_typesCreateInput = {
    id?: string;
    name: string;
    entity: string;
    active?: boolean | null;
    created_at?: Date | string | null;
    documents_driver?: Prisma.documents_driverCreateNestedManyWithoutTransport_document_typesInput;
    documents_vehicle?: Prisma.documents_vehicleCreateNestedManyWithoutTransport_document_typesInput;
};
export type transport_document_typesUncheckedCreateInput = {
    id?: string;
    name: string;
    entity: string;
    active?: boolean | null;
    created_at?: Date | string | null;
    documents_driver?: Prisma.documents_driverUncheckedCreateNestedManyWithoutTransport_document_typesInput;
    documents_vehicle?: Prisma.documents_vehicleUncheckedCreateNestedManyWithoutTransport_document_typesInput;
};
export type transport_document_typesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    documents_driver?: Prisma.documents_driverUpdateManyWithoutTransport_document_typesNestedInput;
    documents_vehicle?: Prisma.documents_vehicleUpdateManyWithoutTransport_document_typesNestedInput;
};
export type transport_document_typesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    documents_driver?: Prisma.documents_driverUncheckedUpdateManyWithoutTransport_document_typesNestedInput;
    documents_vehicle?: Prisma.documents_vehicleUncheckedUpdateManyWithoutTransport_document_typesNestedInput;
};
export type transport_document_typesCreateManyInput = {
    id?: string;
    name: string;
    entity: string;
    active?: boolean | null;
    created_at?: Date | string | null;
};
export type transport_document_typesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type transport_document_typesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type transport_document_typesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    entity?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type transport_document_typesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    entity?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type transport_document_typesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    entity?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type Transport_document_typesScalarRelationFilter = {
    is?: Prisma.transport_document_typesWhereInput;
    isNot?: Prisma.transport_document_typesWhereInput;
};
export type transport_document_typesCreateNestedOneWithoutDocuments_vehicleInput = {
    create?: Prisma.XOR<Prisma.transport_document_typesCreateWithoutDocuments_vehicleInput, Prisma.transport_document_typesUncheckedCreateWithoutDocuments_vehicleInput>;
    connectOrCreate?: Prisma.transport_document_typesCreateOrConnectWithoutDocuments_vehicleInput;
    connect?: Prisma.transport_document_typesWhereUniqueInput;
};
export type transport_document_typesUpdateOneRequiredWithoutDocuments_vehicleNestedInput = {
    create?: Prisma.XOR<Prisma.transport_document_typesCreateWithoutDocuments_vehicleInput, Prisma.transport_document_typesUncheckedCreateWithoutDocuments_vehicleInput>;
    connectOrCreate?: Prisma.transport_document_typesCreateOrConnectWithoutDocuments_vehicleInput;
    upsert?: Prisma.transport_document_typesUpsertWithoutDocuments_vehicleInput;
    connect?: Prisma.transport_document_typesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.transport_document_typesUpdateToOneWithWhereWithoutDocuments_vehicleInput, Prisma.transport_document_typesUpdateWithoutDocuments_vehicleInput>, Prisma.transport_document_typesUncheckedUpdateWithoutDocuments_vehicleInput>;
};
export type transport_document_typesCreateNestedOneWithoutDocuments_driverInput = {
    create?: Prisma.XOR<Prisma.transport_document_typesCreateWithoutDocuments_driverInput, Prisma.transport_document_typesUncheckedCreateWithoutDocuments_driverInput>;
    connectOrCreate?: Prisma.transport_document_typesCreateOrConnectWithoutDocuments_driverInput;
    connect?: Prisma.transport_document_typesWhereUniqueInput;
};
export type transport_document_typesUpdateOneRequiredWithoutDocuments_driverNestedInput = {
    create?: Prisma.XOR<Prisma.transport_document_typesCreateWithoutDocuments_driverInput, Prisma.transport_document_typesUncheckedCreateWithoutDocuments_driverInput>;
    connectOrCreate?: Prisma.transport_document_typesCreateOrConnectWithoutDocuments_driverInput;
    upsert?: Prisma.transport_document_typesUpsertWithoutDocuments_driverInput;
    connect?: Prisma.transport_document_typesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.transport_document_typesUpdateToOneWithWhereWithoutDocuments_driverInput, Prisma.transport_document_typesUpdateWithoutDocuments_driverInput>, Prisma.transport_document_typesUncheckedUpdateWithoutDocuments_driverInput>;
};
export type transport_document_typesCreateWithoutDocuments_vehicleInput = {
    id?: string;
    name: string;
    entity: string;
    active?: boolean | null;
    created_at?: Date | string | null;
    documents_driver?: Prisma.documents_driverCreateNestedManyWithoutTransport_document_typesInput;
};
export type transport_document_typesUncheckedCreateWithoutDocuments_vehicleInput = {
    id?: string;
    name: string;
    entity: string;
    active?: boolean | null;
    created_at?: Date | string | null;
    documents_driver?: Prisma.documents_driverUncheckedCreateNestedManyWithoutTransport_document_typesInput;
};
export type transport_document_typesCreateOrConnectWithoutDocuments_vehicleInput = {
    where: Prisma.transport_document_typesWhereUniqueInput;
    create: Prisma.XOR<Prisma.transport_document_typesCreateWithoutDocuments_vehicleInput, Prisma.transport_document_typesUncheckedCreateWithoutDocuments_vehicleInput>;
};
export type transport_document_typesUpsertWithoutDocuments_vehicleInput = {
    update: Prisma.XOR<Prisma.transport_document_typesUpdateWithoutDocuments_vehicleInput, Prisma.transport_document_typesUncheckedUpdateWithoutDocuments_vehicleInput>;
    create: Prisma.XOR<Prisma.transport_document_typesCreateWithoutDocuments_vehicleInput, Prisma.transport_document_typesUncheckedCreateWithoutDocuments_vehicleInput>;
    where?: Prisma.transport_document_typesWhereInput;
};
export type transport_document_typesUpdateToOneWithWhereWithoutDocuments_vehicleInput = {
    where?: Prisma.transport_document_typesWhereInput;
    data: Prisma.XOR<Prisma.transport_document_typesUpdateWithoutDocuments_vehicleInput, Prisma.transport_document_typesUncheckedUpdateWithoutDocuments_vehicleInput>;
};
export type transport_document_typesUpdateWithoutDocuments_vehicleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    documents_driver?: Prisma.documents_driverUpdateManyWithoutTransport_document_typesNestedInput;
};
export type transport_document_typesUncheckedUpdateWithoutDocuments_vehicleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    documents_driver?: Prisma.documents_driverUncheckedUpdateManyWithoutTransport_document_typesNestedInput;
};
export type transport_document_typesCreateWithoutDocuments_driverInput = {
    id?: string;
    name: string;
    entity: string;
    active?: boolean | null;
    created_at?: Date | string | null;
    documents_vehicle?: Prisma.documents_vehicleCreateNestedManyWithoutTransport_document_typesInput;
};
export type transport_document_typesUncheckedCreateWithoutDocuments_driverInput = {
    id?: string;
    name: string;
    entity: string;
    active?: boolean | null;
    created_at?: Date | string | null;
    documents_vehicle?: Prisma.documents_vehicleUncheckedCreateNestedManyWithoutTransport_document_typesInput;
};
export type transport_document_typesCreateOrConnectWithoutDocuments_driverInput = {
    where: Prisma.transport_document_typesWhereUniqueInput;
    create: Prisma.XOR<Prisma.transport_document_typesCreateWithoutDocuments_driverInput, Prisma.transport_document_typesUncheckedCreateWithoutDocuments_driverInput>;
};
export type transport_document_typesUpsertWithoutDocuments_driverInput = {
    update: Prisma.XOR<Prisma.transport_document_typesUpdateWithoutDocuments_driverInput, Prisma.transport_document_typesUncheckedUpdateWithoutDocuments_driverInput>;
    create: Prisma.XOR<Prisma.transport_document_typesCreateWithoutDocuments_driverInput, Prisma.transport_document_typesUncheckedCreateWithoutDocuments_driverInput>;
    where?: Prisma.transport_document_typesWhereInput;
};
export type transport_document_typesUpdateToOneWithWhereWithoutDocuments_driverInput = {
    where?: Prisma.transport_document_typesWhereInput;
    data: Prisma.XOR<Prisma.transport_document_typesUpdateWithoutDocuments_driverInput, Prisma.transport_document_typesUncheckedUpdateWithoutDocuments_driverInput>;
};
export type transport_document_typesUpdateWithoutDocuments_driverInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    documents_vehicle?: Prisma.documents_vehicleUpdateManyWithoutTransport_document_typesNestedInput;
};
export type transport_document_typesUncheckedUpdateWithoutDocuments_driverInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    entity?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    documents_vehicle?: Prisma.documents_vehicleUncheckedUpdateManyWithoutTransport_document_typesNestedInput;
};
export type Transport_document_typesCountOutputType = {
    documents_driver: number;
    documents_vehicle: number;
};
export type Transport_document_typesCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    documents_driver?: boolean | Transport_document_typesCountOutputTypeCountDocuments_driverArgs;
    documents_vehicle?: boolean | Transport_document_typesCountOutputTypeCountDocuments_vehicleArgs;
};
export type Transport_document_typesCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.Transport_document_typesCountOutputTypeSelect<ExtArgs> | null;
};
export type Transport_document_typesCountOutputTypeCountDocuments_driverArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documents_driverWhereInput;
};
export type Transport_document_typesCountOutputTypeCountDocuments_vehicleArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documents_vehicleWhereInput;
};
export type transport_document_typesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    entity?: boolean;
    active?: boolean;
    created_at?: boolean;
    documents_driver?: boolean | Prisma.transport_document_types$documents_driverArgs<ExtArgs>;
    documents_vehicle?: boolean | Prisma.transport_document_types$documents_vehicleArgs<ExtArgs>;
    _count?: boolean | Prisma.Transport_document_typesCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["transport_document_types"]>;
export type transport_document_typesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    entity?: boolean;
    active?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["transport_document_types"]>;
export type transport_document_typesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    entity?: boolean;
    active?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["transport_document_types"]>;
export type transport_document_typesSelectScalar = {
    id?: boolean;
    name?: boolean;
    entity?: boolean;
    active?: boolean;
    created_at?: boolean;
};
export type transport_document_typesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "entity" | "active" | "created_at", ExtArgs["result"]["transport_document_types"]>;
export type transport_document_typesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    documents_driver?: boolean | Prisma.transport_document_types$documents_driverArgs<ExtArgs>;
    documents_vehicle?: boolean | Prisma.transport_document_types$documents_vehicleArgs<ExtArgs>;
    _count?: boolean | Prisma.Transport_document_typesCountOutputTypeDefaultArgs<ExtArgs>;
};
export type transport_document_typesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type transport_document_typesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $transport_document_typesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "transport_document_types";
    objects: {
        documents_driver: Prisma.$documents_driverPayload<ExtArgs>[];
        documents_vehicle: Prisma.$documents_vehiclePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        entity: string;
        active: boolean | null;
        created_at: Date | null;
    }, ExtArgs["result"]["transport_document_types"]>;
    composites: {};
};
export type transport_document_typesGetPayload<S extends boolean | null | undefined | transport_document_typesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$transport_document_typesPayload, S>;
export type transport_document_typesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<transport_document_typesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Transport_document_typesCountAggregateInputType | true;
};
export interface transport_document_typesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['transport_document_types'];
        meta: {
            name: 'transport_document_types';
        };
    };
    findUnique<T extends transport_document_typesFindUniqueArgs>(args: Prisma.SelectSubset<T, transport_document_typesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__transport_document_typesClient<runtime.Types.Result.GetResult<Prisma.$transport_document_typesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends transport_document_typesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, transport_document_typesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__transport_document_typesClient<runtime.Types.Result.GetResult<Prisma.$transport_document_typesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends transport_document_typesFindFirstArgs>(args?: Prisma.SelectSubset<T, transport_document_typesFindFirstArgs<ExtArgs>>): Prisma.Prisma__transport_document_typesClient<runtime.Types.Result.GetResult<Prisma.$transport_document_typesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends transport_document_typesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, transport_document_typesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__transport_document_typesClient<runtime.Types.Result.GetResult<Prisma.$transport_document_typesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends transport_document_typesFindManyArgs>(args?: Prisma.SelectSubset<T, transport_document_typesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$transport_document_typesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends transport_document_typesCreateArgs>(args: Prisma.SelectSubset<T, transport_document_typesCreateArgs<ExtArgs>>): Prisma.Prisma__transport_document_typesClient<runtime.Types.Result.GetResult<Prisma.$transport_document_typesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends transport_document_typesCreateManyArgs>(args?: Prisma.SelectSubset<T, transport_document_typesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends transport_document_typesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, transport_document_typesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$transport_document_typesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends transport_document_typesDeleteArgs>(args: Prisma.SelectSubset<T, transport_document_typesDeleteArgs<ExtArgs>>): Prisma.Prisma__transport_document_typesClient<runtime.Types.Result.GetResult<Prisma.$transport_document_typesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends transport_document_typesUpdateArgs>(args: Prisma.SelectSubset<T, transport_document_typesUpdateArgs<ExtArgs>>): Prisma.Prisma__transport_document_typesClient<runtime.Types.Result.GetResult<Prisma.$transport_document_typesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends transport_document_typesDeleteManyArgs>(args?: Prisma.SelectSubset<T, transport_document_typesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends transport_document_typesUpdateManyArgs>(args: Prisma.SelectSubset<T, transport_document_typesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends transport_document_typesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, transport_document_typesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$transport_document_typesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends transport_document_typesUpsertArgs>(args: Prisma.SelectSubset<T, transport_document_typesUpsertArgs<ExtArgs>>): Prisma.Prisma__transport_document_typesClient<runtime.Types.Result.GetResult<Prisma.$transport_document_typesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends transport_document_typesCountArgs>(args?: Prisma.Subset<T, transport_document_typesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Transport_document_typesCountAggregateOutputType> : number>;
    aggregate<T extends Transport_document_typesAggregateArgs>(args: Prisma.Subset<T, Transport_document_typesAggregateArgs>): Prisma.PrismaPromise<GetTransport_document_typesAggregateType<T>>;
    groupBy<T extends transport_document_typesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: transport_document_typesGroupByArgs['orderBy'];
    } : {
        orderBy?: transport_document_typesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, transport_document_typesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransport_document_typesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: transport_document_typesFieldRefs;
}
export interface Prisma__transport_document_typesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    documents_driver<T extends Prisma.transport_document_types$documents_driverArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.transport_document_types$documents_driverArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documents_driverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    documents_vehicle<T extends Prisma.transport_document_types$documents_vehicleArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.transport_document_types$documents_vehicleArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documents_vehiclePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface transport_document_typesFieldRefs {
    readonly id: Prisma.FieldRef<"transport_document_types", 'String'>;
    readonly name: Prisma.FieldRef<"transport_document_types", 'String'>;
    readonly entity: Prisma.FieldRef<"transport_document_types", 'String'>;
    readonly active: Prisma.FieldRef<"transport_document_types", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"transport_document_types", 'DateTime'>;
}
export type transport_document_typesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transport_document_typesSelect<ExtArgs> | null;
    omit?: Prisma.transport_document_typesOmit<ExtArgs> | null;
    include?: Prisma.transport_document_typesInclude<ExtArgs> | null;
    where: Prisma.transport_document_typesWhereUniqueInput;
};
export type transport_document_typesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transport_document_typesSelect<ExtArgs> | null;
    omit?: Prisma.transport_document_typesOmit<ExtArgs> | null;
    include?: Prisma.transport_document_typesInclude<ExtArgs> | null;
    where: Prisma.transport_document_typesWhereUniqueInput;
};
export type transport_document_typesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transport_document_typesSelect<ExtArgs> | null;
    omit?: Prisma.transport_document_typesOmit<ExtArgs> | null;
    include?: Prisma.transport_document_typesInclude<ExtArgs> | null;
    where?: Prisma.transport_document_typesWhereInput;
    orderBy?: Prisma.transport_document_typesOrderByWithRelationInput | Prisma.transport_document_typesOrderByWithRelationInput[];
    cursor?: Prisma.transport_document_typesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Transport_document_typesScalarFieldEnum | Prisma.Transport_document_typesScalarFieldEnum[];
};
export type transport_document_typesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transport_document_typesSelect<ExtArgs> | null;
    omit?: Prisma.transport_document_typesOmit<ExtArgs> | null;
    include?: Prisma.transport_document_typesInclude<ExtArgs> | null;
    where?: Prisma.transport_document_typesWhereInput;
    orderBy?: Prisma.transport_document_typesOrderByWithRelationInput | Prisma.transport_document_typesOrderByWithRelationInput[];
    cursor?: Prisma.transport_document_typesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Transport_document_typesScalarFieldEnum | Prisma.Transport_document_typesScalarFieldEnum[];
};
export type transport_document_typesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transport_document_typesSelect<ExtArgs> | null;
    omit?: Prisma.transport_document_typesOmit<ExtArgs> | null;
    include?: Prisma.transport_document_typesInclude<ExtArgs> | null;
    where?: Prisma.transport_document_typesWhereInput;
    orderBy?: Prisma.transport_document_typesOrderByWithRelationInput | Prisma.transport_document_typesOrderByWithRelationInput[];
    cursor?: Prisma.transport_document_typesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Transport_document_typesScalarFieldEnum | Prisma.Transport_document_typesScalarFieldEnum[];
};
export type transport_document_typesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transport_document_typesSelect<ExtArgs> | null;
    omit?: Prisma.transport_document_typesOmit<ExtArgs> | null;
    include?: Prisma.transport_document_typesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.transport_document_typesCreateInput, Prisma.transport_document_typesUncheckedCreateInput>;
};
export type transport_document_typesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.transport_document_typesCreateManyInput | Prisma.transport_document_typesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type transport_document_typesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transport_document_typesSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.transport_document_typesOmit<ExtArgs> | null;
    data: Prisma.transport_document_typesCreateManyInput | Prisma.transport_document_typesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type transport_document_typesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transport_document_typesSelect<ExtArgs> | null;
    omit?: Prisma.transport_document_typesOmit<ExtArgs> | null;
    include?: Prisma.transport_document_typesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.transport_document_typesUpdateInput, Prisma.transport_document_typesUncheckedUpdateInput>;
    where: Prisma.transport_document_typesWhereUniqueInput;
};
export type transport_document_typesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.transport_document_typesUpdateManyMutationInput, Prisma.transport_document_typesUncheckedUpdateManyInput>;
    where?: Prisma.transport_document_typesWhereInput;
    limit?: number;
};
export type transport_document_typesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transport_document_typesSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.transport_document_typesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.transport_document_typesUpdateManyMutationInput, Prisma.transport_document_typesUncheckedUpdateManyInput>;
    where?: Prisma.transport_document_typesWhereInput;
    limit?: number;
};
export type transport_document_typesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transport_document_typesSelect<ExtArgs> | null;
    omit?: Prisma.transport_document_typesOmit<ExtArgs> | null;
    include?: Prisma.transport_document_typesInclude<ExtArgs> | null;
    where: Prisma.transport_document_typesWhereUniqueInput;
    create: Prisma.XOR<Prisma.transport_document_typesCreateInput, Prisma.transport_document_typesUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.transport_document_typesUpdateInput, Prisma.transport_document_typesUncheckedUpdateInput>;
};
export type transport_document_typesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transport_document_typesSelect<ExtArgs> | null;
    omit?: Prisma.transport_document_typesOmit<ExtArgs> | null;
    include?: Prisma.transport_document_typesInclude<ExtArgs> | null;
    where: Prisma.transport_document_typesWhereUniqueInput;
};
export type transport_document_typesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.transport_document_typesWhereInput;
    limit?: number;
};
export type transport_document_types$documents_driverArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type transport_document_types$documents_vehicleArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documents_vehicleSelect<ExtArgs> | null;
    omit?: Prisma.documents_vehicleOmit<ExtArgs> | null;
    include?: Prisma.documents_vehicleInclude<ExtArgs> | null;
    where?: Prisma.documents_vehicleWhereInput;
    orderBy?: Prisma.documents_vehicleOrderByWithRelationInput | Prisma.documents_vehicleOrderByWithRelationInput[];
    cursor?: Prisma.documents_vehicleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Documents_vehicleScalarFieldEnum | Prisma.Documents_vehicleScalarFieldEnum[];
};
export type transport_document_typesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.transport_document_typesSelect<ExtArgs> | null;
    omit?: Prisma.transport_document_typesOmit<ExtArgs> | null;
    include?: Prisma.transport_document_typesInclude<ExtArgs> | null;
};
