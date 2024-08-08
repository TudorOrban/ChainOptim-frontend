import { CreateLocationDTO, Location } from "../../../shared/common/models/reusableTypes";

export interface Supplier {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: number;
    location: Location;
}

export interface CreateSupplierDTO {
    name: string;
    organizationId: number;
    locationId?: number;
    location?: CreateLocationDTO;
    createLocation?: boolean;
}

export interface UpdateSupplierDTO {
    id: number;
    name: string;
    organizationId: number;
    locationId?: number;
    location?: CreateLocationDTO;
    createLocation?: boolean;
}