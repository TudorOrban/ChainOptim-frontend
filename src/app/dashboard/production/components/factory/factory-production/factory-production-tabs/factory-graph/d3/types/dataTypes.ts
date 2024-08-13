import { SmallStage } from "../../../../../../../models/FactoryGraph";

// Generic types for unified rendering logic
export interface GenericGraph {
    nodes: Record<number, GenericNode>;
    adjList: Record<number, GenericEdge[]>;
    type?: "product" | "factory";
}

export interface GenericNode {
    smallStage: SmallStage;
    numberOfStepsCapacity?: number;
    minimumRequiredCapacity?: number;
    perDuration?: number;
    priority?: number;
    allocationCapacityRatio?: number;
}

export interface GenericEdge {
    srcStageId: number;
    srcStageOutputId: number;
    destStageId: number;
    destStageInputId: number;
}


