import { FacilityType, Pair } from "../../overview/types/supplyChainMapTypes";
import { ShipmentStatus, TransportType } from "../../supply/models/SupplierShipment";

export interface ResourceTransportRoute {
    id: number;
    organizationId: number;
    createdAt?: string;
    updatedAt?: string;
    companyId?: number;
    transportRoute?: TransportRoute;

    // UI Utils
    selected?: boolean;
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
    shipmentStatus: ShipmentStatus;

    departureDateTime?: string;
    estimatedArrivalDateTime?: string;
    arrivalDateTime?: string;
}