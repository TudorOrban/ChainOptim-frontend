import { CreateLocationDTO, Location, SmallEntityDTO } from "../../../shared/common/models/reusableTypes";

export interface Supplier {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    organizationId: number;
    location: Location;

    // Performance Metrics
    overallScore: number;
    timelinessScore: number;
    quantityPerTimeScore: number;
    availabilityScore: number;
    qualityScore: number;
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

export interface SupplierOverviewDTO {
    suppliedComponents: SmallEntityDTO[];
    deliveredToFactories: SmallEntityDTO[];
    deliveredToWarehouses: SmallEntityDTO[];
}