import { CreateLocationDTO, Location, SmallEntityDTO } from "../../../shared/common/models/reusableTypes";
import { Stage } from "../../goods/models/Stage";

export interface Factory {
    id: number;
    name: string;
    organizationId: number;
    createdAt: Date;
    updatedAt: Date;
    location: Location;
    overallScore: number;
    resourceDistributionScore?: number;
    resourceReadinessScore?: number;
    resourceUtilizationScore?: number;
    resourceEfficiencyScore?: number;
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

export interface FactoryStageSearchDTO {
    id: number;
    factoryId: number;
    stageId: number;
    stageName: string;
}

export interface FactoryStageConnection {
    id: number;
    factoryId: number;
    srcFactoryStageId: number;
    srcStageOutputId: number;
    destFactoryStageId: number;
    destStageInputId: number; 
}

export interface CreateConnectionDTO {
    factoryId: number;
    srcFactoryStageId: number;
    srcStageOutputId: number;
    destFactoryStageId: number;
    destStageInputId: number;
}

export interface UpdateConnectionDTO {
    id: number;
    factoryId: number;
    srcFactoryStageId: number;
    srcStageOutputId: number;
    destFactoryStageId: number;
    destStageInputId: number;
}

export interface DeleteConnectionDTO {
    factoryId: number;
    organizationId: number;
    srcFactoryStageId: number;
    srcStageOutputId: number;
    destFactoryStageId: number;
    destStageInputId: number;
}

export interface FactoryOverviewDTO {
    factoryStages: SmallEntityDTO[];
    manufacturedComponents: SmallEntityDTO[];
    manufacturedProducts: SmallEntityDTO[];
    deliveredFromSuppliers: SmallEntityDTO[];
    deliveredToClients: SmallEntityDTO[];
}