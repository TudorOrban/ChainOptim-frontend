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

export interface TransportRoute {
    entityId: number;
    entityType: EntityType;

    srcLocation: Pair<number, number>;
    srcFacilityId: number;
    srcFacilityType: FacilityType;

    destLocation: Pair<number, number>;
    destFacilityId: number;
    destFacilityType: FacilityType;

    waypoints: Pair<number, number>[];
    liveLocation: Pair<number, number>;

    transportType: TransportType;
    status: ShipmentStatus;
    
    departureDateTime: Date;
    estimatedArrivalDateTime: Date;
    arrivalDateTime: Date;
}

export interface Pair<S, T> {
    first: S;
    second: T;
}

export enum TransportType {
    ROAD = 'ROAD',
    RAIL = 'RAIL',
    SEA = 'SEA',
    AIR = 'AIR'
}

export enum ShipmentStatus {
    PLANNED,
    IN_TRANSIT,
    DELIVERED,
    CANCELLED
}

export enum EntityType {
    SUPPLIER_SHIPMENT = 'SUPPLIER_SHIPMENT',
    CLIENT_SHIPMENT = 'CLIENT_SHIPMENT',
}