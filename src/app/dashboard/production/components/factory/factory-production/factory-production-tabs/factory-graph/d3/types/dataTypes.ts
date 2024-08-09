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
    incomingStageId: number;
    incomingStageOutputId: number;
    outgoingStageId: number;
    outgoingStageInputId: number;
}

// Product
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

export interface ProductEdge {
    incomingStageId: number;
    incomingStageOutputId: number;
    outgoingStageId: number;
    outgoingStageInputId: number;
}

// Factory
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
}

export interface FactoryStageNode {
    smallStage: SmallStage;
    numberOfStepsCapacity: number;
    minimumRequiredCapacity: number;
    perDuration: number;
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
    quantityPerStage: number;
    allocatedQuantity: number;
    requestedQuantity: number;
}

export interface SmallStageOutput {
    id: number;
    componentId: number;
    quantityPerStage: number;
    expectedOutputPerAllocation: number;
    outputPerRequest: number;
}

export interface FactoryEdge {
    incomingFactoryStageId: number;
    incomingStageOutputId: number;
    outgoingFactoryStageId: number;
    outgoingStageInputId: number;
}

// Components and products
export interface Component {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    organizationId: number;
    unitId: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    organizationId: number;
    unitId: number;
}


// Inventory
export interface FactoryInventoryItem {
    id: number;
    factoryId: number;
    component: Component;
    product: Product;
    createdAt: string;
    updatedAt: string;
    quantity: number;
    minimumRequiredQuantity: number;
}

// Resource Allocation
export interface AllocationPlan {
    factoryGraph: FactoryGraph;
    inventoryBalance: Record<number, FactoryInventoryItem>;
    allocations: ResourceAllocation[];
}

export interface ResourceAllocation {
    stageInputId: number;
    componentId: number;
    allocatorInventoryItemId: number;
    allocatedAmount: number;
    requestedAmount: number;
}