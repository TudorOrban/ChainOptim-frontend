export type SubscriptionPlans = Record<PlanTier, SubscriptionPlan>;

export interface SubscriptionPlan {
    dollarsPerMonth: number;
    maxMembers: number;
    maxRoles: number;
    realTimeNotificationsOn: boolean;
    emailNotificationsOn: boolean;
    customNotificationsOn: boolean;
    maxProducts: number;
    maxComponents: number;
    maxProductStages: number;
    maxFactories: number;
    maxFactoryStages: number;
    maxFactoryInventoryItems: number;
    factoryPerformanceOn: boolean;
    maxWarehouses: number;
    maxWarehouseInventoryItems: number;
    maxSuppliers: number;
    maxSupplierOrders: number;
    maxSupplierShipments: number;
    supplierPerformanceOn: boolean;
    maxClients: number;
    maxClientOrders: number;
    maxClientShipments: number;
    clientEvaluationOn: boolean;
}

export enum PlanTier {
    NONE = 'NONE',
    BASIC = 'BASIC',
    PROFESSIONAL = 'PROFESSIONAL',
    ENTERPRISE = 'ENTERPRISE',
}