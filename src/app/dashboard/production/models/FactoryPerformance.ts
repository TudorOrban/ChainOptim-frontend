export interface FactoryPerformance {
    id: number;
    factoryId: number;
    createdAt: string;
    updatedAt: string;
    report: FactoryPerformanceReport;
}

export interface FactoryPerformanceReport {
    overallScore?: number;
    resourceDistributionScore?: number;
    resourceReadinessScore?: number;
    resourceUtilizationScore?: number;
    resourceEfficiencyScore?: number;
    stageReports: Record<number, FactoryStagePerformanceReport>;
}

export interface FactoryStagePerformanceReport {
    factoryStageId: number;
    stageName: string;
    totalExecutedStages?: number;
    totalTimeDays?: number;
    averageExecutedStagesPerDay?: number;
    minimumExecutedCapacityPerDay?: number;
    daysUnderCapacityPercentage?: number;
    totalDeficits: Record<number, number>;
    averageDeficits: Record<number, number>;
    errorRate?: number;
    overallScore?: number;
    resourceReadinessScore?: number;
    resourceUtilizationScore?: number;
    resourceDistributionScore?: number;
    resourceEfficiencyScore?: number;
}