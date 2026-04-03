export declare const DispatchStatus: {
    readonly PENDING: "PENDING";
    readonly ASSIGNED: "ASSIGNED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type DispatchStatus = (typeof DispatchStatus)[keyof typeof DispatchStatus];
export declare const TripStatus: {
    readonly PLANNED: "PLANNED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type TripStatus = (typeof TripStatus)[keyof typeof TripStatus];
