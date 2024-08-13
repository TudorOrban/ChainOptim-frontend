import { CreateLocationDTO, Location, SmallEntityDTO } from "../../../shared/common/models/reusableTypes";

export interface Client {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: number;
    location: Location;
}

export interface CreateClientDTO {
    name: string;
    organizationId: number;
    locationId?: number;
    location?: CreateLocationDTO;
    createLocation?: boolean;
}

export interface UpdateClientDTO {
    id: number;
    name: string;
    organizationId: number;
    locationId?: number;
    location?: CreateLocationDTO;
    createLocation?: boolean;
}

export interface ClientOverviewDTO {
    suppliedProducts: SmallEntityDTO[];
    deliveredFromFactories: SmallEntityDTO[];
    deliveredFromWarehouses: SmallEntityDTO[];
}
