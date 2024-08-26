import { Feature } from "../../../shared/enums/commonEnums";

export type BaseSubscriptionPlans = Record<PlanTier, BaseSubscriptionPlan>;

export interface BaseSubscriptionPlan {
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

export interface SubscriptionPlan {
    id: number;
    organizationId: number;
    createdAt?: Date;
    updatedAt?: Date;
    isBasic?: boolean;
    isActive?: boolean;
    isPaid?: boolean;
    lastPaymentDate?: Date;
    customPlan: CustomSubscriptionPlan;
}

export interface CustomSubscriptionPlan {
    planTier: PlanTier;
    isMonthly?: boolean;
    totalDollarsMonthly?: number;
    additionalFeatures: Record<Feature, number>;
}

export interface CreateSubscriptionPlanDTO {
    organizationId: number;
    customPlan: CustomSubscriptionPlan;
    isBasic?: boolean;
}

export interface UpdateSubscriptionPlanDTO {
    id: number;
    organizationId: number;
    customPlan: CustomSubscriptionPlan;
    isBasic?: boolean;
}

