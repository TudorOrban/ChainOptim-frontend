import { CreateLocationDTO, Location } from "../../../shared/common/models/reusableTypes";
import { Stage } from "../../goods/models/Product";

export interface Factory {
    id: number;
    name: string;
    organizationId: number;
    createdAt: Date;
    updatedAt: Date;
    location: Location;
    overallScore: number;
    resourceDistributionScore: number;
    resourceReadinessScore: number;
    resourceUtilizationScore: number;
    factoryStages: FactoryStage[];
}

export interface FactoryStage {
    id: number;
    capacity: number;
    duration: number;
    priority: number;
    minimumRequiredCapacity: number;
    stage: Stage;
}

export interface CreateFactoryDTO {
    name: string;
    organizationId: number;
    locationId?: number;
    location?: CreateLocationDTO;
    createLocation?: boolean;
}

export interface UpdateFactoryDTO {
    id: number;
    name: string;
    organizationId: number;
    locationId?: number;
    location?: CreateLocationDTO;
    createLocation?: boolean;
}