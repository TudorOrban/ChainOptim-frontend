export interface FactoryProductionGraph {
    id: number;
    factoryId: number;
    createdAt: string;
    updatedAt: string;
    factoryGraph: FactoryGraph;
}

export interface FactoryGraph {
    nodes: Record<number, StageNode>;
    adjList: Record<number, Edge[]>;
    pipelinePriority: number;
}

export interface StageNode {
    smallStage: SmallStage;
    numberOfStepsCapacity: number;
    perDuration: number;
    minimumRequiredCapacity: number;
    priority: number;
    allocationCapacityRatio: number;
}

export interface SmallStage {
    id: number;
    stageName: string;
    stageInputs: SmallStageInput[];
    stageOutputs: SmallStageOutput[];
}

export interface SmallStageInput {
    id: number;
    componentId: number;
    componentName: string;
    quantityPerStage: number;
    allocatedQuantity: number;
    requestedQuantity: number;
}

export interface SmallStageOutput {
    id: number;
    componentId: number;
    componentName: string;
    quantityPerStage: number;
    expectedOutputPerAllocation: number;
    outputPerRequest: number;
}

export interface Edge {
    incomingFactoryStageId: number;
    incomingStageOutputId: number;
    outgoingFactoryStageId: number;
    outgoingStageInputId: number;
}