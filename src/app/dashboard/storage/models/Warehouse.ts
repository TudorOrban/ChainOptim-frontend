import { CreateLocationDTO, Location, SmallEntityDTO } from "../../../shared/common/models/reusableTypes";

export interface Warehouse {
    id: number;
    name: string;
    organizationId: number;
    createdAt: Date;
    updatedAt: Date;
    location: Location;
}

export interface CreateWarehouseDTO {
    name: string;
    organizationId: number;
    locationId?: number;
    location?: CreateLocationDTO;
    createLocation?: boolean;
}

export interface UpdateWarehouseDTO {
    id: number;
    name: string;
    organizationId: number;
    locationId?: number;
    location?: CreateLocationDTO;
    createLocation?: boolean;
}

export interface WarehouseOverviewDTO {
    compartments: SmallEntityDTO[];
    storedComponents: SmallEntityDTO[];
    storedProducts: SmallEntityDTO[];
    deliveredFromSuppliers: SmallEntityDTO[];
    deliveredToClients: SmallEntityDTO[];
}