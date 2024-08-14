import { FacilityType, Pair } from "../../overview/types/supplyChainMapTypes";
import { ShipmentStatus, TransportType } from "../../supply/models/SupplierShipment";

export interface ResourceTransportRoute {
    id: number;
    organizationId: number;
    createdAt?: string;
    updatedAt?: string;
    companyId?: number;
    transportRoute: TransportRoute;

    // UI Utils
    selected?: boolean;
    isEditing?: boolean;
}

export interface TransportRoute {
    srcLocation?: Pair<number, number>;
    srcLocationId?: number;
    srcFacilityId?: number;
    srcFacilityType?: FacilityType;
    srcFacilityName?: string;

    destLocation?: Pair<number, number>;
    destLocationId?: number;
    destFacilityId?: number;
    destFacilityType?: FacilityType;
    destFacilityName?: string;

    waypoints?: Pair<number, number>[];
    liveLocation?: Pair<number, number>;

    transportType?: TransportType;
    status: ShipmentStatus;

    departureDateTime: Date;
    estimatedArrivalDateTime: Date;
    arrivalDateTime: Date;

    transportedEntities?: TransportedEntity[];
}

export interface TransportedEntity {
    entityId: number;
    entityType: TransportedEntityType;
    entityName: string;
    quantity: number;
    deliveredQuantity: number;
}

export enum TransportedEntityType {
    PRODUCT,
    COMPONENT
}

export interface CreateRouteDTO {
    organizationId: number;
    companyId?: number;
    transportRoute?: TransportRoute;
}

export interface UpdateRouteDTO {
    id: number;
    organizationId: number;
    companyId?: number;
    transportRoute?: TransportRoute;
}