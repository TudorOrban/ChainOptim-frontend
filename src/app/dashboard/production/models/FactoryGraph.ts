export interface FactoryProductionGraph {
    id: number;
    factoryId: number;
    createdAt: string;
    updatedAt: string;
    factoryGraph: FactoryGraph;
}

export interface FactoryGraph {
    nodes: Record<number, FactoryStageNode>;
    adjList: Record<number, FactoryEdge[]>;
    pipelinePriority?: number;
}

export interface FactoryStageNode {
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
    componentId?: number;
    componentName?: string;
    productId?: number;
    productName?: string;
    quantityPerStage: number;
    expectedOutputPerAllocation: number;
    outputPerRequest: number;
}

export interface FactoryEdge {
    srcFactoryStageId: number;
    srcStageOutputId: number;
    destFactoryStageId: number;
    destStageInputId: number;
}

export enum NodeType {
    STAGE = "STAGE",
    INPUT = "INPUT",
    OUTPUT = "OUTPUT",
}

export interface NodeSelection {
    nodeId?: number;
    subNodeId?: number;
    nodeType?: NodeType;
    encodedId?: string;
}