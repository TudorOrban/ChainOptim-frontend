import { Injectable } from "@angular/core";
import { CustomPlanPricing, FeaturePricing, PlanTier, SubscriptionPlan, SubscriptionPlans } from "../models/SubscriptionPlan";
import { Feature } from "../../../shared/enums/commonEnums";

@Injectable({
    providedIn: 'root'
})
export class SubscriptionPlanService {
    
    getSubscriptionPlan(tier: PlanTier): SubscriptionPlan {
        return this.subscriptionPlans[tier];
    }

    getFeaturePricing(feature: Feature): FeaturePricing {
        return this.customPlanPricing[feature];
    }

    
    private subscriptionPlans: SubscriptionPlans = {
        [PlanTier.NONE]: {
            name: 'No Plan',
            dollarsPerMonth: 0,
            maxMembers: 2,
            maxRoles: 2,
            maxProducts: 1,
            realTimeNotificationsOn: false,
            emailNotificationsOn: false,
            customNotificationsOn: false,
            maxComponents: 1,
            maxProductStages: 1,
            maxFactories: 1,
            maxFactoryStages: 2,
            maxFactoryInventoryItems: 2,
            factoryPerformanceOn: false,
            maxWarehouses: 1,
            maxWarehouseInventoryItems: 2,
            maxSuppliers: 1,
            maxSupplierOrders: 2,
            maxSupplierShipments: 2,
            supplierPerformanceOn: false,
            maxClients: 1,
            maxClientOrders: 2,
            maxClientShipments: 2,
            clientEvaluationOn: false,
        },
        [PlanTier.BASIC]: {
            name: 'Basic Plan',
            dollarsPerMonth: 30,
            maxMembers: 4,
            maxRoles: 6,
            maxProducts: 5,
            realTimeNotificationsOn: false,
            emailNotificationsOn: false,
            customNotificationsOn: false,
            maxComponents: 5,
            maxProductStages: 5,
            maxFactories: 5,
            maxFactoryStages: 20,
            maxFactoryInventoryItems: 20,
            factoryPerformanceOn: false,
            maxWarehouses: 5,
            maxWarehouseInventoryItems: 20,
            maxSuppliers: 5,
            maxSupplierOrders: 20,
            maxSupplierShipments: 20,
            supplierPerformanceOn: false,
            maxClients: 5,
            maxClientOrders: 20,
            maxClientShipments: 20,
            clientEvaluationOn: false,
        },
        [PlanTier.PROFESSIONAL]: {
            name: 'Professional Plan',
            dollarsPerMonth: 120,
            maxMembers: 10,
            maxRoles: 20,
            maxProducts: 20,
            realTimeNotificationsOn: true,
            emailNotificationsOn: true,
            customNotificationsOn: false,
            maxComponents: 100,
            maxProductStages: 100,
            maxFactories: 100,
            maxFactoryStages: 2,
            maxFactoryInventoryItems: 2,
            factoryPerformanceOn: true,
            maxWarehouses: 100,
            maxWarehouseInventoryItems: 2,
            maxSuppliers: 100,
            maxSupplierOrders: 2,
            maxSupplierShipments: 2,
            supplierPerformanceOn: true,
            maxClients: 100,
            maxClientOrders: 2,
            maxClientShipments: 2,
            clientEvaluationOn: true,
        },
        [PlanTier.ENTERPRISE]: {
            name: 'Enterprise Plan',
            dollarsPerMonth: 700,
            maxMembers: -1,
            maxRoles: -1,
            maxProducts: -1,
            realTimeNotificationsOn: true,
            emailNotificationsOn: true,
            customNotificationsOn: true,
            maxComponents: -1,
            maxProductStages: -1,
            maxFactories: -1,
            maxFactoryStages: -1,
            maxFactoryInventoryItems: -1,
            factoryPerformanceOn: true,
            maxWarehouses: -1,
            maxWarehouseInventoryItems: -1,
            maxSuppliers: -1,
            maxSupplierOrders: -1,
            maxSupplierShipments: -1,
            supplierPerformanceOn: true,
            maxClients: -1,
            maxClientOrders: -1,
            maxClientShipments: -1,
            clientEvaluationOn: true,
        }
    }

    private customPlanPricing: CustomPlanPricing = {
        [Feature.USER]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.PRODUCT]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.FACTORY]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.WAREHOUSE]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.SUPPLIER]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.CLIENT]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.COMPONENT]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.PRODUCT_STAGE]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.FACTORY_STAGE]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.FACTORY_INVENTORY_ITEM]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.FACTORY_PRODUCTION_HISTORY]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.FACTORY_PERFORMANCE]: {},
        [Feature.RESOURCE_ALLOCATION_PLAN]: {},
        [Feature.WAREHOUSE_INVENTORY_ITEM]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.SUPPLIER_ORDER]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.SUPPLIER_SHIPMENT]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.SUPPLIER_PERFORMANCE]: {},
        [Feature.CLIENT_ORDER]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.CLIENT_SHIPMENT]: {
            1: {
                dollarsMonthly: 1,
                dollarsYearly: 0.8,
            },
            5: {
                dollarsMonthly: 0.8,
                dollarsYearly: 0.6,
            },
            20: {
                dollarsMonthly: 0.6,
                dollarsYearly: 0.5,
            },
            100: {
                dollarsMonthly: 0.5,
                dollarsYearly: 0.4,
            },
        },
        [Feature.CLIENT_EVALUATION]: {},
    };

}