export interface SupplyChainMap {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    mapData: MapData;
}

export interface MapData {
    facilities: Facility[];
}

export interface Facility {
    id: number;
    name: string;
    type: FacilityType;
    latitude: number;
    longitude: number;
}

export enum FacilityType {
    FACTORY = "FACTORY",
    WAREHOUSE = "WAREHOUSE",
    SUPPLIER = "SUPPLIER",
    CLIENT = "CLIENT"
}