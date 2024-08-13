import { FactoryGraph } from "./FactoryGraph";
import { FactoryInventoryItem } from "./FactoryInventoryItem";

export interface FactoryProductionHistory {
    id: number;
    factoryId: number;
    createdAt: string;
    updatedAt: string;
    productionHistory: ProductionHistory;

}

export interface ProductionHistory {
    startDate: Date;
    dailyProductionRecords: Record<number, DailyProductionRecord>;
}

export interface DailyProductionRecord {
    allocations: ResourceAllocation[];
    results: AllocationResult[];
    durationDays: number;
}

export interface ResourceAllocationPlan {
    id: number;
    factoryId: number;
    createdAt: string;
    updatedAt: string;
    activationDate: Date;
    isActive: boolean;
    allocationPlan: AllocationPlan;
}

export interface AllocationPlan {
    factoryGraph?: FactoryGraph;
    inventoryBalance: Record<number, FactoryInventoryItem>;
    allocations: ResourceAllocation[];
}


export interface ResourceAllocation {
    stageInputId: number;
    factoryStageId: number;
    stageName: string;
    componentId: number;
    componentName: string;
    allocatorInventoryItemId: number;
    allocatedAmount?: number;
    requestedAmount?: number;
    actualAmount?: number;
}

export interface AllocationResult {
    stageOutputId: number;
    factoryStageId: number;
    stageName: string;
    componentId: number;
    componentName: string;
    resultedAmount: number;
    fullAmount: number;
    actualAmount: number;
}

// UI
export interface HistoryChartData {
    datasets: HistoryChartDataset[];
    categories?: string[];
}

export interface HistoryChartDataset {
    name: string;
    data: number[];
}