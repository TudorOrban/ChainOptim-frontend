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

export interface FactoryStage {
    id: number;
    capacity?: number;
    duration?: number;
    priority?: number;
    minimumRequiredCapacity?: number;
    stage: Stage;
}

export interface CreateFactoryStageDTO {
    factoryId: number;
    stageId: number;
    organizationId: number;
    capacity?: number;
    duration?: number;
    priority?: number;
    minimumRequiredCapacity?: number;
}

export interface UpdateFactoryStageDTO {
    id: number;
    factoryId: number;
    organizationId: number;
    capacity?: number;
    duration?: number;
    priority?: number;
    minimumRequiredCapacity?: number;
}

export interface FactoryStageConnection {
    id: number;
    factoryId: number;
    outgoingFactoryStageId: number;
    incomingFactoryStageId: number;
    outgoingStageInputId: number;
    incomingStageOutputId: number;    
}

export interface CreateConnectionDTO {
    factoryId: number;
    outgoingFactoryStageId: number;
    incomingFactoryStageId: number;
    outgoingStageInputId: number;
    incomingStageOutputId: number;
}

export interface UpdateConnectionDTO {
    id: number;
    factoryId: number;
    outgoingFactoryStageId: number;
    incomingFactoryStageId: number;
    outgoingStageInputId: number;
    incomingStageOutputId: number;
}

export interface DeleteConnectionDTO {
    factoryId: number;
    organizationId: number;
    outgoingFactoryStageId: number;
    incomingFactoryStageId: number;
    outgoingStageInputId: number;
    incomingStageOutputId: number;
}