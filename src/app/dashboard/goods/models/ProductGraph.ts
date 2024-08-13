import { SmallStage } from "../../production/models/FactoryGraph";

export interface ProductProductionGraph {
    id: number;
    productId: number;
    createdAt: string;
    updatedAt: string;
    productGraph: ProductGraph;
}

export interface ProductGraph {
    nodes: Record<number, SmallStage>;
    adjList: Record<number, ProductEdge[]>;
}

export interface ProductStageNode {
    smallStage: SmallStage;
    numberOfStepsCapacity: number;
    perDuration: number;
    minimumRequiredCapacity: number;
    priority: number;
    allocationCapacityRatio: number;
}

export interface ProductEdge {
    srcStageId: number;
    srcStageOutputId: number;
    destStageId: number;
    destStageInputId: number;
}

export interface ProductStageConnection {
    id: number;
    productId: number;
    srcStageId: number;
    srcStageOutputId: number;
    destStageId: number;
    destStageInputId: number;
}

export interface CreateConnectionDTO {
    productId: number;
    srcStageId: number;
    srcStageOutputId: number;
    destStageId: number;
    destStageInputId: number;
}

export interface UpdateConnectionDTO {
    id: number;
    productId: number;
    srcStageId: number;
    srcStageOutputId: number;
    destStageId: number;
    destStageInputId: number;
}

export interface DeleteConnectionDTO {
    organizationId: number;
    productId: number;
    srcStageId: number;
    srcStageOutputId: number;
    destStageId: number;
    destStageInputId: number;
}