import { FacilityType } from "../../overview/types/supplyChainMapTypes";
import { ShipmentStatus } from "../../supply/models/SupplierShipment";

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
    entityId?: number;
    entityType?: EntityType;

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


export enum TransportType {
    ROAD = 'ROAD',
    RAIL = 'RAIL',
    SEA = 'SEA',
    AIR = 'AIR'
}

export enum EntityType {
    SUPPLIER_SHIPMENT = 'SUPPLIER_SHIPMENT',
    CLIENT_SHIPMENT = 'CLIENT_SHIPMENT',
    TRANSPORT = 'TRANSPORT'
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

export interface Pair<S, T> {
    first: S;
    second: T;
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