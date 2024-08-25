export interface SupplierPerformance {
    id: number;
    supplierId: number;
    createdAt: string;
    updatedAt: string;
    report: SupplierPerformanceReport;
}

export interface SupplierPerformanceReport {
    overallScore: number;
    timelinessScore: number;
    quantityPerTimeScore: number;
    availabilityScore: number;
    qualityScore: number;
    totalDeliveredOrders: number;
    totalDelays: number;
    averageDelayPerOrder: number;
    ratioOfOnTimeOrderDeliveries: number;
    averageDelayPerShipment: number;
    ratioOfOnTimeShipmentDeliveries: number;
    averageShipmentsPerOrder: number;
    averageTimeToShipOrder: number;
    componentPerformances: Record<number, ComponentDeliveryPerformance>;
}

export interface ComponentDeliveryPerformance {
    componentId: number;
    componentName: string;
    totalDeliveredOrders: number;
    totalDeliveredQuantity: number;
    averageDeliveredQuantity: number;
    averageOrderQuantity: number;
    averageShipmentQuantity: number;
    deliveredPerOrderedRatio: number;
    firstDeliveryDate: string;
    deliveredQuantityOverTime: Record<number, number>;
}