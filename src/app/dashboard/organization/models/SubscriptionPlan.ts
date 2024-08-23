import { Feature } from "../../../shared/enums/commonEnums";

export type SubscriptionPlans = Record<PlanTier, SubscriptionPlan>;

export interface SubscriptionPlan {
    name: string;
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

export type CustomPlanPricing = Record<Feature, FeaturePricing>;

// At the quantity = key, price per unit = value
export type FeaturePricing = Record<number, QuantityPrice>; 

export type QuantityPrice = {
    dollarsMonthly: number; // per month, per unit
    dollarsYearly: number; // per month, per unit
}

export interface CustomSubscriptionPlan {
    basePlanTier: PlanTier;
    totalDollarsMonthly?: number;
    additionalFeatures: Record<Feature, number>;
}