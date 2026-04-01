import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type business_partiesModel = runtime.Types.Result.DefaultSelection<Prisma.$business_partiesPayload>;
export type AggregateBusiness_parties = {
    _count: Business_partiesCountAggregateOutputType | null;
    _min: Business_partiesMinAggregateOutputType | null;
    _max: Business_partiesMaxAggregateOutputType | null;
};
export type Business_partiesMinAggregateOutputType = {
    id: string | null;
    type: string | null;
    name: string | null;
    tax_id: string | null;
    active: boolean | null;
    created_at: Date | null;
};
export type Business_partiesMaxAggregateOutputType = {
    id: string | null;
    type: string | null;
    name: string | null;
    tax_id: string | null;
    active: boolean | null;
    created_at: Date | null;
};
export type Business_partiesCountAggregateOutputType = {
    id: number;
    type: number;
    name: number;
    tax_id: number;
    active: number;
    created_at: number;
    _all: number;
};
export type Business_partiesMinAggregateInputType = {
    id?: true;
    type?: true;
    name?: true;
    tax_id?: true;
    active?: true;
    created_at?: true;
};
export type Business_partiesMaxAggregateInputType = {
    id?: true;
    type?: true;
    name?: true;
    tax_id?: true;
    active?: true;
    created_at?: true;
};
export type Business_partiesCountAggregateInputType = {
    id?: true;
    type?: true;
    name?: true;
    tax_id?: true;
    active?: true;
    created_at?: true;
    _all?: true;
};
export type Business_partiesAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.business_partiesWhereInput;
    orderBy?: Prisma.business_partiesOrderByWithRelationInput | Prisma.business_partiesOrderByWithRelationInput[];
    cursor?: Prisma.business_partiesWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | Business_partiesCountAggregateInputType;
    _min?: Business_partiesMinAggregateInputType;
    _max?: Business_partiesMaxAggregateInputType;
};
export type GetBusiness_partiesAggregateType<T extends Business_partiesAggregateArgs> = {
    [P in keyof T & keyof AggregateBusiness_parties]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBusiness_parties[P]> : Prisma.GetScalarType<T[P], AggregateBusiness_parties[P]>;
};
export type business_partiesGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.business_partiesWhereInput;
    orderBy?: Prisma.business_partiesOrderByWithAggregationInput | Prisma.business_partiesOrderByWithAggregationInput[];
    by: Prisma.Business_partiesScalarFieldEnum[] | Prisma.Business_partiesScalarFieldEnum;
    having?: Prisma.business_partiesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Business_partiesCountAggregateInputType | true;
    _min?: Business_partiesMinAggregateInputType;
    _max?: Business_partiesMaxAggregateInputType;
};
export type Business_partiesGroupByOutputType = {
    id: string;
    type: string;
    name: string;
    tax_id: string | null;
    active: boolean;
    created_at: Date;
    _count: Business_partiesCountAggregateOutputType | null;
    _min: Business_partiesMinAggregateOutputType | null;
    _max: Business_partiesMaxAggregateOutputType | null;
};
export type GetBusiness_partiesGroupByPayload<T extends business_partiesGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<Business_partiesGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof Business_partiesGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], Business_partiesGroupByOutputType[P]> : Prisma.GetScalarType<T[P], Business_partiesGroupByOutputType[P]>;
}>>;
export type business_partiesWhereInput = {
    AND?: Prisma.business_partiesWhereInput | Prisma.business_partiesWhereInput[];
    OR?: Prisma.business_partiesWhereInput[];
    NOT?: Prisma.business_partiesWhereInput | Prisma.business_partiesWhereInput[];
    id?: Prisma.UuidFilter<"business_parties"> | string;
    type?: Prisma.StringFilter<"business_parties"> | string;
    name?: Prisma.StringFilter<"business_parties"> | string;
    tax_id?: Prisma.StringNullableFilter<"business_parties"> | string | null;
    active?: Prisma.BoolFilter<"business_parties"> | boolean;
    created_at?: Prisma.DateTimeFilter<"business_parties"> | Date | string;
    delivery_notes?: Prisma.Delivery_notesListRelationFilter;
    dispatch_orders?: Prisma.Dispatch_ordersListRelationFilter;
    documents?: Prisma.DocumentsListRelationFilter;
    party_locations?: Prisma.Party_locationsListRelationFilter;
    party_contacts?: Prisma.Party_contactsListRelationFilter;
};
export type business_partiesOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    delivery_notes?: Prisma.delivery_notesOrderByRelationAggregateInput;
    dispatch_orders?: Prisma.dispatch_ordersOrderByRelationAggregateInput;
    documents?: Prisma.documentsOrderByRelationAggregateInput;
    party_locations?: Prisma.party_locationsOrderByRelationAggregateInput;
    party_contacts?: Prisma.party_contactsOrderByRelationAggregateInput;
};
export type business_partiesWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.business_partiesWhereInput | Prisma.business_partiesWhereInput[];
    OR?: Prisma.business_partiesWhereInput[];
    NOT?: Prisma.business_partiesWhereInput | Prisma.business_partiesWhereInput[];
    type?: Prisma.StringFilter<"business_parties"> | string;
    name?: Prisma.StringFilter<"business_parties"> | string;
    tax_id?: Prisma.StringNullableFilter<"business_parties"> | string | null;
    active?: Prisma.BoolFilter<"business_parties"> | boolean;
    created_at?: Prisma.DateTimeFilter<"business_parties"> | Date | string;
    delivery_notes?: Prisma.Delivery_notesListRelationFilter;
    dispatch_orders?: Prisma.Dispatch_ordersListRelationFilter;
    documents?: Prisma.DocumentsListRelationFilter;
    party_locations?: Prisma.Party_locationsListRelationFilter;
    party_contacts?: Prisma.Party_contactsListRelationFilter;
}, "id">;
export type business_partiesOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
    _count?: Prisma.business_partiesCountOrderByAggregateInput;
    _max?: Prisma.business_partiesMaxOrderByAggregateInput;
    _min?: Prisma.business_partiesMinOrderByAggregateInput;
};
export type business_partiesScalarWhereWithAggregatesInput = {
    AND?: Prisma.business_partiesScalarWhereWithAggregatesInput | Prisma.business_partiesScalarWhereWithAggregatesInput[];
    OR?: Prisma.business_partiesScalarWhereWithAggregatesInput[];
    NOT?: Prisma.business_partiesScalarWhereWithAggregatesInput | Prisma.business_partiesScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"business_parties"> | string;
    type?: Prisma.StringWithAggregatesFilter<"business_parties"> | string;
    name?: Prisma.StringWithAggregatesFilter<"business_parties"> | string;
    tax_id?: Prisma.StringNullableWithAggregatesFilter<"business_parties"> | string | null;
    active?: Prisma.BoolWithAggregatesFilter<"business_parties"> | boolean;
    created_at?: Prisma.DateTimeWithAggregatesFilter<"business_parties"> | Date | string;
};
export type business_partiesCreateInput = {
    id?: string;
    type: string;
    name: string;
    tax_id?: string | null;
    active?: boolean;
    created_at?: Date | string;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutBusiness_partiesInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutCustomersInput;
    documents?: Prisma.documentsCreateNestedManyWithoutBusiness_partiesInput;
    party_locations?: Prisma.party_locationsCreateNestedManyWithoutBusiness_partiesInput;
    party_contacts?: Prisma.party_contactsCreateNestedManyWithoutBusiness_partiesInput;
};
export type business_partiesUncheckedCreateInput = {
    id?: string;
    type: string;
    name: string;
    tax_id?: string | null;
    active?: boolean;
    created_at?: Date | string;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutBusiness_partiesInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutCustomersInput;
    documents?: Prisma.documentsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
    party_locations?: Prisma.party_locationsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
    party_contacts?: Prisma.party_contactsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
};
export type business_partiesUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutBusiness_partiesNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutCustomersNestedInput;
    documents?: Prisma.documentsUpdateManyWithoutBusiness_partiesNestedInput;
    party_locations?: Prisma.party_locationsUpdateManyWithoutBusiness_partiesNestedInput;
    party_contacts?: Prisma.party_contactsUpdateManyWithoutBusiness_partiesNestedInput;
};
export type business_partiesUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutCustomersNestedInput;
    documents?: Prisma.documentsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
    party_locations?: Prisma.party_locationsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
    party_contacts?: Prisma.party_contactsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
};
export type business_partiesCreateManyInput = {
    id?: string;
    type: string;
    name: string;
    tax_id?: string | null;
    active?: boolean;
    created_at?: Date | string;
};
export type business_partiesUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type business_partiesUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type business_partiesCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type business_partiesMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type business_partiesMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tax_id?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    created_at?: Prisma.SortOrder;
};
export type Business_partiesNullableScalarRelationFilter = {
    is?: Prisma.business_partiesWhereInput | null;
    isNot?: Prisma.business_partiesWhereInput | null;
};
export type Business_partiesScalarRelationFilter = {
    is?: Prisma.business_partiesWhereInput;
    isNot?: Prisma.business_partiesWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type business_partiesCreateNestedOneWithoutDelivery_notesInput = {
    create?: Prisma.XOR<Prisma.business_partiesCreateWithoutDelivery_notesInput, Prisma.business_partiesUncheckedCreateWithoutDelivery_notesInput>;
    connectOrCreate?: Prisma.business_partiesCreateOrConnectWithoutDelivery_notesInput;
    connect?: Prisma.business_partiesWhereUniqueInput;
};
export type business_partiesUpdateOneWithoutDelivery_notesNestedInput = {
    create?: Prisma.XOR<Prisma.business_partiesCreateWithoutDelivery_notesInput, Prisma.business_partiesUncheckedCreateWithoutDelivery_notesInput>;
    connectOrCreate?: Prisma.business_partiesCreateOrConnectWithoutDelivery_notesInput;
    upsert?: Prisma.business_partiesUpsertWithoutDelivery_notesInput;
    disconnect?: Prisma.business_partiesWhereInput | boolean;
    delete?: Prisma.business_partiesWhereInput | boolean;
    connect?: Prisma.business_partiesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.business_partiesUpdateToOneWithWhereWithoutDelivery_notesInput, Prisma.business_partiesUpdateWithoutDelivery_notesInput>, Prisma.business_partiesUncheckedUpdateWithoutDelivery_notesInput>;
};
export type business_partiesCreateNestedOneWithoutParty_locationsInput = {
    create?: Prisma.XOR<Prisma.business_partiesCreateWithoutParty_locationsInput, Prisma.business_partiesUncheckedCreateWithoutParty_locationsInput>;
    connectOrCreate?: Prisma.business_partiesCreateOrConnectWithoutParty_locationsInput;
    connect?: Prisma.business_partiesWhereUniqueInput;
};
export type business_partiesUpdateOneRequiredWithoutParty_locationsNestedInput = {
    create?: Prisma.XOR<Prisma.business_partiesCreateWithoutParty_locationsInput, Prisma.business_partiesUncheckedCreateWithoutParty_locationsInput>;
    connectOrCreate?: Prisma.business_partiesCreateOrConnectWithoutParty_locationsInput;
    upsert?: Prisma.business_partiesUpsertWithoutParty_locationsInput;
    connect?: Prisma.business_partiesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.business_partiesUpdateToOneWithWhereWithoutParty_locationsInput, Prisma.business_partiesUpdateWithoutParty_locationsInput>, Prisma.business_partiesUncheckedUpdateWithoutParty_locationsInput>;
};
export type business_partiesCreateNestedOneWithoutParty_contactsInput = {
    create?: Prisma.XOR<Prisma.business_partiesCreateWithoutParty_contactsInput, Prisma.business_partiesUncheckedCreateWithoutParty_contactsInput>;
    connectOrCreate?: Prisma.business_partiesCreateOrConnectWithoutParty_contactsInput;
    connect?: Prisma.business_partiesWhereUniqueInput;
};
export type business_partiesUpdateOneWithoutParty_contactsNestedInput = {
    create?: Prisma.XOR<Prisma.business_partiesCreateWithoutParty_contactsInput, Prisma.business_partiesUncheckedCreateWithoutParty_contactsInput>;
    connectOrCreate?: Prisma.business_partiesCreateOrConnectWithoutParty_contactsInput;
    upsert?: Prisma.business_partiesUpsertWithoutParty_contactsInput;
    disconnect?: Prisma.business_partiesWhereInput | boolean;
    delete?: Prisma.business_partiesWhereInput | boolean;
    connect?: Prisma.business_partiesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.business_partiesUpdateToOneWithWhereWithoutParty_contactsInput, Prisma.business_partiesUpdateWithoutParty_contactsInput>, Prisma.business_partiesUncheckedUpdateWithoutParty_contactsInput>;
};
export type business_partiesCreateNestedOneWithoutDispatch_ordersInput = {
    create?: Prisma.XOR<Prisma.business_partiesCreateWithoutDispatch_ordersInput, Prisma.business_partiesUncheckedCreateWithoutDispatch_ordersInput>;
    connectOrCreate?: Prisma.business_partiesCreateOrConnectWithoutDispatch_ordersInput;
    connect?: Prisma.business_partiesWhereUniqueInput;
};
export type business_partiesUpdateOneWithoutDispatch_ordersNestedInput = {
    create?: Prisma.XOR<Prisma.business_partiesCreateWithoutDispatch_ordersInput, Prisma.business_partiesUncheckedCreateWithoutDispatch_ordersInput>;
    connectOrCreate?: Prisma.business_partiesCreateOrConnectWithoutDispatch_ordersInput;
    upsert?: Prisma.business_partiesUpsertWithoutDispatch_ordersInput;
    disconnect?: Prisma.business_partiesWhereInput | boolean;
    delete?: Prisma.business_partiesWhereInput | boolean;
    connect?: Prisma.business_partiesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.business_partiesUpdateToOneWithWhereWithoutDispatch_ordersInput, Prisma.business_partiesUpdateWithoutDispatch_ordersInput>, Prisma.business_partiesUncheckedUpdateWithoutDispatch_ordersInput>;
};
export type business_partiesCreateNestedOneWithoutDocumentsInput = {
    create?: Prisma.XOR<Prisma.business_partiesCreateWithoutDocumentsInput, Prisma.business_partiesUncheckedCreateWithoutDocumentsInput>;
    connectOrCreate?: Prisma.business_partiesCreateOrConnectWithoutDocumentsInput;
    connect?: Prisma.business_partiesWhereUniqueInput;
};
export type business_partiesUpdateOneWithoutDocumentsNestedInput = {
    create?: Prisma.XOR<Prisma.business_partiesCreateWithoutDocumentsInput, Prisma.business_partiesUncheckedCreateWithoutDocumentsInput>;
    connectOrCreate?: Prisma.business_partiesCreateOrConnectWithoutDocumentsInput;
    upsert?: Prisma.business_partiesUpsertWithoutDocumentsInput;
    disconnect?: Prisma.business_partiesWhereInput | boolean;
    delete?: Prisma.business_partiesWhereInput | boolean;
    connect?: Prisma.business_partiesWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.business_partiesUpdateToOneWithWhereWithoutDocumentsInput, Prisma.business_partiesUpdateWithoutDocumentsInput>, Prisma.business_partiesUncheckedUpdateWithoutDocumentsInput>;
};
export type business_partiesCreateWithoutDelivery_notesInput = {
    id?: string;
    type: string;
    name: string;
    tax_id?: string | null;
    active?: boolean;
    created_at?: Date | string;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutCustomersInput;
    documents?: Prisma.documentsCreateNestedManyWithoutBusiness_partiesInput;
    party_locations?: Prisma.party_locationsCreateNestedManyWithoutBusiness_partiesInput;
    party_contacts?: Prisma.party_contactsCreateNestedManyWithoutBusiness_partiesInput;
};
export type business_partiesUncheckedCreateWithoutDelivery_notesInput = {
    id?: string;
    type: string;
    name: string;
    tax_id?: string | null;
    active?: boolean;
    created_at?: Date | string;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutCustomersInput;
    documents?: Prisma.documentsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
    party_locations?: Prisma.party_locationsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
    party_contacts?: Prisma.party_contactsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
};
export type business_partiesCreateOrConnectWithoutDelivery_notesInput = {
    where: Prisma.business_partiesWhereUniqueInput;
    create: Prisma.XOR<Prisma.business_partiesCreateWithoutDelivery_notesInput, Prisma.business_partiesUncheckedCreateWithoutDelivery_notesInput>;
};
export type business_partiesUpsertWithoutDelivery_notesInput = {
    update: Prisma.XOR<Prisma.business_partiesUpdateWithoutDelivery_notesInput, Prisma.business_partiesUncheckedUpdateWithoutDelivery_notesInput>;
    create: Prisma.XOR<Prisma.business_partiesCreateWithoutDelivery_notesInput, Prisma.business_partiesUncheckedCreateWithoutDelivery_notesInput>;
    where?: Prisma.business_partiesWhereInput;
};
export type business_partiesUpdateToOneWithWhereWithoutDelivery_notesInput = {
    where?: Prisma.business_partiesWhereInput;
    data: Prisma.XOR<Prisma.business_partiesUpdateWithoutDelivery_notesInput, Prisma.business_partiesUncheckedUpdateWithoutDelivery_notesInput>;
};
export type business_partiesUpdateWithoutDelivery_notesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutCustomersNestedInput;
    documents?: Prisma.documentsUpdateManyWithoutBusiness_partiesNestedInput;
    party_locations?: Prisma.party_locationsUpdateManyWithoutBusiness_partiesNestedInput;
    party_contacts?: Prisma.party_contactsUpdateManyWithoutBusiness_partiesNestedInput;
};
export type business_partiesUncheckedUpdateWithoutDelivery_notesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutCustomersNestedInput;
    documents?: Prisma.documentsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
    party_locations?: Prisma.party_locationsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
    party_contacts?: Prisma.party_contactsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
};
export type business_partiesCreateWithoutParty_locationsInput = {
    id?: string;
    type: string;
    name: string;
    tax_id?: string | null;
    active?: boolean;
    created_at?: Date | string;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutBusiness_partiesInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutCustomersInput;
    documents?: Prisma.documentsCreateNestedManyWithoutBusiness_partiesInput;
    party_contacts?: Prisma.party_contactsCreateNestedManyWithoutBusiness_partiesInput;
};
export type business_partiesUncheckedCreateWithoutParty_locationsInput = {
    id?: string;
    type: string;
    name: string;
    tax_id?: string | null;
    active?: boolean;
    created_at?: Date | string;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutBusiness_partiesInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutCustomersInput;
    documents?: Prisma.documentsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
    party_contacts?: Prisma.party_contactsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
};
export type business_partiesCreateOrConnectWithoutParty_locationsInput = {
    where: Prisma.business_partiesWhereUniqueInput;
    create: Prisma.XOR<Prisma.business_partiesCreateWithoutParty_locationsInput, Prisma.business_partiesUncheckedCreateWithoutParty_locationsInput>;
};
export type business_partiesUpsertWithoutParty_locationsInput = {
    update: Prisma.XOR<Prisma.business_partiesUpdateWithoutParty_locationsInput, Prisma.business_partiesUncheckedUpdateWithoutParty_locationsInput>;
    create: Prisma.XOR<Prisma.business_partiesCreateWithoutParty_locationsInput, Prisma.business_partiesUncheckedCreateWithoutParty_locationsInput>;
    where?: Prisma.business_partiesWhereInput;
};
export type business_partiesUpdateToOneWithWhereWithoutParty_locationsInput = {
    where?: Prisma.business_partiesWhereInput;
    data: Prisma.XOR<Prisma.business_partiesUpdateWithoutParty_locationsInput, Prisma.business_partiesUncheckedUpdateWithoutParty_locationsInput>;
};
export type business_partiesUpdateWithoutParty_locationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutBusiness_partiesNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutCustomersNestedInput;
    documents?: Prisma.documentsUpdateManyWithoutBusiness_partiesNestedInput;
    party_contacts?: Prisma.party_contactsUpdateManyWithoutBusiness_partiesNestedInput;
};
export type business_partiesUncheckedUpdateWithoutParty_locationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutCustomersNestedInput;
    documents?: Prisma.documentsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
    party_contacts?: Prisma.party_contactsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
};
export type business_partiesCreateWithoutParty_contactsInput = {
    id?: string;
    type: string;
    name: string;
    tax_id?: string | null;
    active?: boolean;
    created_at?: Date | string;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutBusiness_partiesInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutCustomersInput;
    documents?: Prisma.documentsCreateNestedManyWithoutBusiness_partiesInput;
    party_locations?: Prisma.party_locationsCreateNestedManyWithoutBusiness_partiesInput;
};
export type business_partiesUncheckedCreateWithoutParty_contactsInput = {
    id?: string;
    type: string;
    name: string;
    tax_id?: string | null;
    active?: boolean;
    created_at?: Date | string;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutBusiness_partiesInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutCustomersInput;
    documents?: Prisma.documentsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
    party_locations?: Prisma.party_locationsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
};
export type business_partiesCreateOrConnectWithoutParty_contactsInput = {
    where: Prisma.business_partiesWhereUniqueInput;
    create: Prisma.XOR<Prisma.business_partiesCreateWithoutParty_contactsInput, Prisma.business_partiesUncheckedCreateWithoutParty_contactsInput>;
};
export type business_partiesUpsertWithoutParty_contactsInput = {
    update: Prisma.XOR<Prisma.business_partiesUpdateWithoutParty_contactsInput, Prisma.business_partiesUncheckedUpdateWithoutParty_contactsInput>;
    create: Prisma.XOR<Prisma.business_partiesCreateWithoutParty_contactsInput, Prisma.business_partiesUncheckedCreateWithoutParty_contactsInput>;
    where?: Prisma.business_partiesWhereInput;
};
export type business_partiesUpdateToOneWithWhereWithoutParty_contactsInput = {
    where?: Prisma.business_partiesWhereInput;
    data: Prisma.XOR<Prisma.business_partiesUpdateWithoutParty_contactsInput, Prisma.business_partiesUncheckedUpdateWithoutParty_contactsInput>;
};
export type business_partiesUpdateWithoutParty_contactsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutBusiness_partiesNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutCustomersNestedInput;
    documents?: Prisma.documentsUpdateManyWithoutBusiness_partiesNestedInput;
    party_locations?: Prisma.party_locationsUpdateManyWithoutBusiness_partiesNestedInput;
};
export type business_partiesUncheckedUpdateWithoutParty_contactsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutCustomersNestedInput;
    documents?: Prisma.documentsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
    party_locations?: Prisma.party_locationsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
};
export type business_partiesCreateWithoutDispatch_ordersInput = {
    id?: string;
    type: string;
    name: string;
    tax_id?: string | null;
    active?: boolean;
    created_at?: Date | string;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutBusiness_partiesInput;
    documents?: Prisma.documentsCreateNestedManyWithoutBusiness_partiesInput;
    party_locations?: Prisma.party_locationsCreateNestedManyWithoutBusiness_partiesInput;
    party_contacts?: Prisma.party_contactsCreateNestedManyWithoutBusiness_partiesInput;
};
export type business_partiesUncheckedCreateWithoutDispatch_ordersInput = {
    id?: string;
    type: string;
    name: string;
    tax_id?: string | null;
    active?: boolean;
    created_at?: Date | string;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutBusiness_partiesInput;
    documents?: Prisma.documentsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
    party_locations?: Prisma.party_locationsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
    party_contacts?: Prisma.party_contactsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
};
export type business_partiesCreateOrConnectWithoutDispatch_ordersInput = {
    where: Prisma.business_partiesWhereUniqueInput;
    create: Prisma.XOR<Prisma.business_partiesCreateWithoutDispatch_ordersInput, Prisma.business_partiesUncheckedCreateWithoutDispatch_ordersInput>;
};
export type business_partiesUpsertWithoutDispatch_ordersInput = {
    update: Prisma.XOR<Prisma.business_partiesUpdateWithoutDispatch_ordersInput, Prisma.business_partiesUncheckedUpdateWithoutDispatch_ordersInput>;
    create: Prisma.XOR<Prisma.business_partiesCreateWithoutDispatch_ordersInput, Prisma.business_partiesUncheckedCreateWithoutDispatch_ordersInput>;
    where?: Prisma.business_partiesWhereInput;
};
export type business_partiesUpdateToOneWithWhereWithoutDispatch_ordersInput = {
    where?: Prisma.business_partiesWhereInput;
    data: Prisma.XOR<Prisma.business_partiesUpdateWithoutDispatch_ordersInput, Prisma.business_partiesUncheckedUpdateWithoutDispatch_ordersInput>;
};
export type business_partiesUpdateWithoutDispatch_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutBusiness_partiesNestedInput;
    documents?: Prisma.documentsUpdateManyWithoutBusiness_partiesNestedInput;
    party_locations?: Prisma.party_locationsUpdateManyWithoutBusiness_partiesNestedInput;
    party_contacts?: Prisma.party_contactsUpdateManyWithoutBusiness_partiesNestedInput;
};
export type business_partiesUncheckedUpdateWithoutDispatch_ordersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
    documents?: Prisma.documentsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
    party_locations?: Prisma.party_locationsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
    party_contacts?: Prisma.party_contactsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
};
export type business_partiesCreateWithoutDocumentsInput = {
    id?: string;
    type: string;
    name: string;
    tax_id?: string | null;
    active?: boolean;
    created_at?: Date | string;
    delivery_notes?: Prisma.delivery_notesCreateNestedManyWithoutBusiness_partiesInput;
    dispatch_orders?: Prisma.dispatch_ordersCreateNestedManyWithoutCustomersInput;
    party_locations?: Prisma.party_locationsCreateNestedManyWithoutBusiness_partiesInput;
    party_contacts?: Prisma.party_contactsCreateNestedManyWithoutBusiness_partiesInput;
};
export type business_partiesUncheckedCreateWithoutDocumentsInput = {
    id?: string;
    type: string;
    name: string;
    tax_id?: string | null;
    active?: boolean;
    created_at?: Date | string;
    delivery_notes?: Prisma.delivery_notesUncheckedCreateNestedManyWithoutBusiness_partiesInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedCreateNestedManyWithoutCustomersInput;
    party_locations?: Prisma.party_locationsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
    party_contacts?: Prisma.party_contactsUncheckedCreateNestedManyWithoutBusiness_partiesInput;
};
export type business_partiesCreateOrConnectWithoutDocumentsInput = {
    where: Prisma.business_partiesWhereUniqueInput;
    create: Prisma.XOR<Prisma.business_partiesCreateWithoutDocumentsInput, Prisma.business_partiesUncheckedCreateWithoutDocumentsInput>;
};
export type business_partiesUpsertWithoutDocumentsInput = {
    update: Prisma.XOR<Prisma.business_partiesUpdateWithoutDocumentsInput, Prisma.business_partiesUncheckedUpdateWithoutDocumentsInput>;
    create: Prisma.XOR<Prisma.business_partiesCreateWithoutDocumentsInput, Prisma.business_partiesUncheckedCreateWithoutDocumentsInput>;
    where?: Prisma.business_partiesWhereInput;
};
export type business_partiesUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: Prisma.business_partiesWhereInput;
    data: Prisma.XOR<Prisma.business_partiesUpdateWithoutDocumentsInput, Prisma.business_partiesUncheckedUpdateWithoutDocumentsInput>;
};
export type business_partiesUpdateWithoutDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delivery_notes?: Prisma.delivery_notesUpdateManyWithoutBusiness_partiesNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUpdateManyWithoutCustomersNestedInput;
    party_locations?: Prisma.party_locationsUpdateManyWithoutBusiness_partiesNestedInput;
    party_contacts?: Prisma.party_contactsUpdateManyWithoutBusiness_partiesNestedInput;
};
export type business_partiesUncheckedUpdateWithoutDocumentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tax_id?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    created_at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delivery_notes?: Prisma.delivery_notesUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
    dispatch_orders?: Prisma.dispatch_ordersUncheckedUpdateManyWithoutCustomersNestedInput;
    party_locations?: Prisma.party_locationsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
    party_contacts?: Prisma.party_contactsUncheckedUpdateManyWithoutBusiness_partiesNestedInput;
};
export type Business_partiesCountOutputType = {
    delivery_notes: number;
    dispatch_orders: number;
    documents: number;
    party_locations: number;
    party_contacts: number;
};
export type Business_partiesCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    delivery_notes?: boolean | Business_partiesCountOutputTypeCountDelivery_notesArgs;
    dispatch_orders?: boolean | Business_partiesCountOutputTypeCountDispatch_ordersArgs;
    documents?: boolean | Business_partiesCountOutputTypeCountDocumentsArgs;
    party_locations?: boolean | Business_partiesCountOutputTypeCountParty_locationsArgs;
    party_contacts?: boolean | Business_partiesCountOutputTypeCountParty_contactsArgs;
};
export type Business_partiesCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.Business_partiesCountOutputTypeSelect<ExtArgs> | null;
};
export type Business_partiesCountOutputTypeCountDelivery_notesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.delivery_notesWhereInput;
};
export type Business_partiesCountOutputTypeCountDispatch_ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.dispatch_ordersWhereInput;
};
export type Business_partiesCountOutputTypeCountDocumentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.documentsWhereInput;
};
export type Business_partiesCountOutputTypeCountParty_locationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.party_locationsWhereInput;
};
export type Business_partiesCountOutputTypeCountParty_contactsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.party_contactsWhereInput;
};
export type business_partiesSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    name?: boolean;
    tax_id?: boolean;
    active?: boolean;
    created_at?: boolean;
    delivery_notes?: boolean | Prisma.business_parties$delivery_notesArgs<ExtArgs>;
    dispatch_orders?: boolean | Prisma.business_parties$dispatch_ordersArgs<ExtArgs>;
    documents?: boolean | Prisma.business_parties$documentsArgs<ExtArgs>;
    party_locations?: boolean | Prisma.business_parties$party_locationsArgs<ExtArgs>;
    party_contacts?: boolean | Prisma.business_parties$party_contactsArgs<ExtArgs>;
    _count?: boolean | Prisma.Business_partiesCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["business_parties"]>;
export type business_partiesSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    name?: boolean;
    tax_id?: boolean;
    active?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["business_parties"]>;
export type business_partiesSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    type?: boolean;
    name?: boolean;
    tax_id?: boolean;
    active?: boolean;
    created_at?: boolean;
}, ExtArgs["result"]["business_parties"]>;
export type business_partiesSelectScalar = {
    id?: boolean;
    type?: boolean;
    name?: boolean;
    tax_id?: boolean;
    active?: boolean;
    created_at?: boolean;
};
export type business_partiesOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "type" | "name" | "tax_id" | "active" | "created_at", ExtArgs["result"]["business_parties"]>;
export type business_partiesInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    delivery_notes?: boolean | Prisma.business_parties$delivery_notesArgs<ExtArgs>;
    dispatch_orders?: boolean | Prisma.business_parties$dispatch_ordersArgs<ExtArgs>;
    documents?: boolean | Prisma.business_parties$documentsArgs<ExtArgs>;
    party_locations?: boolean | Prisma.business_parties$party_locationsArgs<ExtArgs>;
    party_contacts?: boolean | Prisma.business_parties$party_contactsArgs<ExtArgs>;
    _count?: boolean | Prisma.Business_partiesCountOutputTypeDefaultArgs<ExtArgs>;
};
export type business_partiesIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type business_partiesIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $business_partiesPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "business_parties";
    objects: {
        delivery_notes: Prisma.$delivery_notesPayload<ExtArgs>[];
        dispatch_orders: Prisma.$dispatch_ordersPayload<ExtArgs>[];
        documents: Prisma.$documentsPayload<ExtArgs>[];
        party_locations: Prisma.$party_locationsPayload<ExtArgs>[];
        party_contacts: Prisma.$party_contactsPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        type: string;
        name: string;
        tax_id: string | null;
        active: boolean;
        created_at: Date;
    }, ExtArgs["result"]["business_parties"]>;
    composites: {};
};
export type business_partiesGetPayload<S extends boolean | null | undefined | business_partiesDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$business_partiesPayload, S>;
export type business_partiesCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<business_partiesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: Business_partiesCountAggregateInputType | true;
};
export interface business_partiesDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['business_parties'];
        meta: {
            name: 'business_parties';
        };
    };
    findUnique<T extends business_partiesFindUniqueArgs>(args: Prisma.SelectSubset<T, business_partiesFindUniqueArgs<ExtArgs>>): Prisma.Prisma__business_partiesClient<runtime.Types.Result.GetResult<Prisma.$business_partiesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends business_partiesFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, business_partiesFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__business_partiesClient<runtime.Types.Result.GetResult<Prisma.$business_partiesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends business_partiesFindFirstArgs>(args?: Prisma.SelectSubset<T, business_partiesFindFirstArgs<ExtArgs>>): Prisma.Prisma__business_partiesClient<runtime.Types.Result.GetResult<Prisma.$business_partiesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends business_partiesFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, business_partiesFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__business_partiesClient<runtime.Types.Result.GetResult<Prisma.$business_partiesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends business_partiesFindManyArgs>(args?: Prisma.SelectSubset<T, business_partiesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$business_partiesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends business_partiesCreateArgs>(args: Prisma.SelectSubset<T, business_partiesCreateArgs<ExtArgs>>): Prisma.Prisma__business_partiesClient<runtime.Types.Result.GetResult<Prisma.$business_partiesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends business_partiesCreateManyArgs>(args?: Prisma.SelectSubset<T, business_partiesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends business_partiesCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, business_partiesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$business_partiesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends business_partiesDeleteArgs>(args: Prisma.SelectSubset<T, business_partiesDeleteArgs<ExtArgs>>): Prisma.Prisma__business_partiesClient<runtime.Types.Result.GetResult<Prisma.$business_partiesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends business_partiesUpdateArgs>(args: Prisma.SelectSubset<T, business_partiesUpdateArgs<ExtArgs>>): Prisma.Prisma__business_partiesClient<runtime.Types.Result.GetResult<Prisma.$business_partiesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends business_partiesDeleteManyArgs>(args?: Prisma.SelectSubset<T, business_partiesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends business_partiesUpdateManyArgs>(args: Prisma.SelectSubset<T, business_partiesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends business_partiesUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, business_partiesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$business_partiesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends business_partiesUpsertArgs>(args: Prisma.SelectSubset<T, business_partiesUpsertArgs<ExtArgs>>): Prisma.Prisma__business_partiesClient<runtime.Types.Result.GetResult<Prisma.$business_partiesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends business_partiesCountArgs>(args?: Prisma.Subset<T, business_partiesCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], Business_partiesCountAggregateOutputType> : number>;
    aggregate<T extends Business_partiesAggregateArgs>(args: Prisma.Subset<T, Business_partiesAggregateArgs>): Prisma.PrismaPromise<GetBusiness_partiesAggregateType<T>>;
    groupBy<T extends business_partiesGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: business_partiesGroupByArgs['orderBy'];
    } : {
        orderBy?: business_partiesGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, business_partiesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBusiness_partiesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: business_partiesFieldRefs;
}
export interface Prisma__business_partiesClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    delivery_notes<T extends Prisma.business_parties$delivery_notesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.business_parties$delivery_notesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$delivery_notesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    dispatch_orders<T extends Prisma.business_parties$dispatch_ordersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.business_parties$dispatch_ordersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$dispatch_ordersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    documents<T extends Prisma.business_parties$documentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.business_parties$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$documentsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    party_locations<T extends Prisma.business_parties$party_locationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.business_parties$party_locationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$party_locationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    party_contacts<T extends Prisma.business_parties$party_contactsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.business_parties$party_contactsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$party_contactsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface business_partiesFieldRefs {
    readonly id: Prisma.FieldRef<"business_parties", 'String'>;
    readonly type: Prisma.FieldRef<"business_parties", 'String'>;
    readonly name: Prisma.FieldRef<"business_parties", 'String'>;
    readonly tax_id: Prisma.FieldRef<"business_parties", 'String'>;
    readonly active: Prisma.FieldRef<"business_parties", 'Boolean'>;
    readonly created_at: Prisma.FieldRef<"business_parties", 'DateTime'>;
}
export type business_partiesFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.business_partiesSelect<ExtArgs> | null;
    omit?: Prisma.business_partiesOmit<ExtArgs> | null;
    include?: Prisma.business_partiesInclude<ExtArgs> | null;
    where: Prisma.business_partiesWhereUniqueInput;
};
export type business_partiesFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.business_partiesSelect<ExtArgs> | null;
    omit?: Prisma.business_partiesOmit<ExtArgs> | null;
    include?: Prisma.business_partiesInclude<ExtArgs> | null;
    where: Prisma.business_partiesWhereUniqueInput;
};
export type business_partiesFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.business_partiesSelect<ExtArgs> | null;
    omit?: Prisma.business_partiesOmit<ExtArgs> | null;
    include?: Prisma.business_partiesInclude<ExtArgs> | null;
    where?: Prisma.business_partiesWhereInput;
    orderBy?: Prisma.business_partiesOrderByWithRelationInput | Prisma.business_partiesOrderByWithRelationInput[];
    cursor?: Prisma.business_partiesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Business_partiesScalarFieldEnum | Prisma.Business_partiesScalarFieldEnum[];
};
export type business_partiesFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.business_partiesSelect<ExtArgs> | null;
    omit?: Prisma.business_partiesOmit<ExtArgs> | null;
    include?: Prisma.business_partiesInclude<ExtArgs> | null;
    where?: Prisma.business_partiesWhereInput;
    orderBy?: Prisma.business_partiesOrderByWithRelationInput | Prisma.business_partiesOrderByWithRelationInput[];
    cursor?: Prisma.business_partiesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Business_partiesScalarFieldEnum | Prisma.Business_partiesScalarFieldEnum[];
};
export type business_partiesFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.business_partiesSelect<ExtArgs> | null;
    omit?: Prisma.business_partiesOmit<ExtArgs> | null;
    include?: Prisma.business_partiesInclude<ExtArgs> | null;
    where?: Prisma.business_partiesWhereInput;
    orderBy?: Prisma.business_partiesOrderByWithRelationInput | Prisma.business_partiesOrderByWithRelationInput[];
    cursor?: Prisma.business_partiesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Business_partiesScalarFieldEnum | Prisma.Business_partiesScalarFieldEnum[];
};
export type business_partiesCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.business_partiesSelect<ExtArgs> | null;
    omit?: Prisma.business_partiesOmit<ExtArgs> | null;
    include?: Prisma.business_partiesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.business_partiesCreateInput, Prisma.business_partiesUncheckedCreateInput>;
};
export type business_partiesCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.business_partiesCreateManyInput | Prisma.business_partiesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type business_partiesCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.business_partiesSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.business_partiesOmit<ExtArgs> | null;
    data: Prisma.business_partiesCreateManyInput | Prisma.business_partiesCreateManyInput[];
    skipDuplicates?: boolean;
};
export type business_partiesUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.business_partiesSelect<ExtArgs> | null;
    omit?: Prisma.business_partiesOmit<ExtArgs> | null;
    include?: Prisma.business_partiesInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.business_partiesUpdateInput, Prisma.business_partiesUncheckedUpdateInput>;
    where: Prisma.business_partiesWhereUniqueInput;
};
export type business_partiesUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.business_partiesUpdateManyMutationInput, Prisma.business_partiesUncheckedUpdateManyInput>;
    where?: Prisma.business_partiesWhereInput;
    limit?: number;
};
export type business_partiesUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.business_partiesSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.business_partiesOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.business_partiesUpdateManyMutationInput, Prisma.business_partiesUncheckedUpdateManyInput>;
    where?: Prisma.business_partiesWhereInput;
    limit?: number;
};
export type business_partiesUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.business_partiesSelect<ExtArgs> | null;
    omit?: Prisma.business_partiesOmit<ExtArgs> | null;
    include?: Prisma.business_partiesInclude<ExtArgs> | null;
    where: Prisma.business_partiesWhereUniqueInput;
    create: Prisma.XOR<Prisma.business_partiesCreateInput, Prisma.business_partiesUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.business_partiesUpdateInput, Prisma.business_partiesUncheckedUpdateInput>;
};
export type business_partiesDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.business_partiesSelect<ExtArgs> | null;
    omit?: Prisma.business_partiesOmit<ExtArgs> | null;
    include?: Prisma.business_partiesInclude<ExtArgs> | null;
    where: Prisma.business_partiesWhereUniqueInput;
};
export type business_partiesDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.business_partiesWhereInput;
    limit?: number;
};
export type business_parties$delivery_notesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.delivery_notesSelect<ExtArgs> | null;
    omit?: Prisma.delivery_notesOmit<ExtArgs> | null;
    include?: Prisma.delivery_notesInclude<ExtArgs> | null;
    where?: Prisma.delivery_notesWhereInput;
    orderBy?: Prisma.delivery_notesOrderByWithRelationInput | Prisma.delivery_notesOrderByWithRelationInput[];
    cursor?: Prisma.delivery_notesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Delivery_notesScalarFieldEnum | Prisma.Delivery_notesScalarFieldEnum[];
};
export type business_parties$dispatch_ordersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.dispatch_ordersSelect<ExtArgs> | null;
    omit?: Prisma.dispatch_ordersOmit<ExtArgs> | null;
    include?: Prisma.dispatch_ordersInclude<ExtArgs> | null;
    where?: Prisma.dispatch_ordersWhereInput;
    orderBy?: Prisma.dispatch_ordersOrderByWithRelationInput | Prisma.dispatch_ordersOrderByWithRelationInput[];
    cursor?: Prisma.dispatch_ordersWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.Dispatch_ordersScalarFieldEnum | Prisma.Dispatch_ordersScalarFieldEnum[];
};
export type business_parties$documentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.documentsSelect<ExtArgs> | null;
    omit?: Prisma.documentsOmit<ExtArgs> | null;
    include?: Prisma.documentsInclude<ExtArgs> | null;
    where?: Prisma.documentsWhereInput;
    orderBy?: Prisma.documentsOrderByWithRelationInput | Prisma.documentsOrderByWithRelationInput[];
    cursor?: Prisma.documentsWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DocumentsScalarFieldEnum | Prisma.DocumentsScalarFieldEnum[];
};
export type business_parties$party_locationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type business_parties$party_contactsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type business_partiesDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.business_partiesSelect<ExtArgs> | null;
    omit?: Prisma.business_partiesOmit<ExtArgs> | null;
    include?: Prisma.business_partiesInclude<ExtArgs> | null;
};
