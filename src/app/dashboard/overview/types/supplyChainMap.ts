export interface SupplyChainMap {
    id: number;
    organizationId: number;
    createdAt: Date;
    updatedAt: Date;
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
    FACTORY = 'Factory',
    WAREHOUSE = 'Warehouse',
    SUPPLIER = 'Supplier',
    CLIENT = 'Client',
}