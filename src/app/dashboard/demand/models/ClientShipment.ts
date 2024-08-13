import { Location } from "../../../shared/common/models/reusableTypes";


export interface ClientShipment {
    id: number;
    clientId: number;
    clientOrderId: number;
    organizationId: number;
    createdAt: Date;
    updatedAt: Date;
    shipmentStartingDate?: Date;
    estimatedArrivalDate?: Date;
    departureDate?: Date;
    arrivalDate?: Date;
    quantity?: number;
    companyId?: string;
    transportType?: TransportType;
    status: ShipmentStatus;
    destinationLocation?: Location;
    currentLocationLatitude?: number;
    currentLocationLongitude?: number;
    destFactoryId?: number;
    destWarehouseId?: number;
    selected?: boolean; // For UI purposes
    isEditing?: boolean; // For UI purposes
}

export enum TransportType {
    ROAD = 'ROAD',
    RAIL = 'RAIL',
    SEA = 'SEA',
    AIR = 'AIR',
}

export enum ShipmentStatus {
    PLANNED,
    IN_TRANSIT,
    DELIVERED,
    CANCELLED
}

export interface CreateClientShipmentDTO {
    clientId: number;
    clientOrderId: number;
    organizationId: number;
    createdAt?: Date;
    updatedAt?: Date;
    shipmentStartingDate?: Date;
    estimatedArrivalDate?: Date;
    departureDate?: Date;
    arrivalDate?: Date;
    quantity?: number;
    companyId?: string;
    transportType?: TransportType;
    status: ShipmentStatus;
    destinationLocationId?: number;
    currentLocationLatitude?: number;
    currentLocationLongitude?: number;
    destFactoryId?: number;
    destWarehouseId?: number;

}

export interface UpdateClientShipmentDTO {
    id: number;
    clientId: number;
    clientOrderId: number;
    organizationId: number;
    createdAt?: Date;
    updatedAt?: Date;
    shipmentStartingDate?: Date;
    estimatedArrivalDate?: Date;
    departureDate?: Date;
    arrivalDate?: Date;
    quantity?: number;
    companyId?: string;
    transportType?: TransportType;
    status: ShipmentStatus;
    destinationLocationId?: number;
    currentLocationLatitude?: number;
    currentLocationLongitude?: number;
    destFactoryId?: number;
    destWarehouseId?: number;
}
