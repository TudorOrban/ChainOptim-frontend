import { TransportRoute } from "../../goods/models/TransportRoute";

export interface SupplyChainMap {
    id: number;
    organizationId: number;
    createdAt: Date;
    updatedAt: Date;
    mapData: MapData;
}

export interface MapData {
    facilities: Facility[];
    transportRoutes: TransportRoute[];
}

export interface Facility {
    id: number;
    name: string;
    type: FacilityType;
    latitude: number;
    longitude: number;
}

export enum FacilityType {
    FACTORY = 'FACTORY',
    WAREHOUSE = 'WAREHOUSE',
    SUPPLIER = 'SUPPLIER',
    CLIENT = 'CLIENT',
}
