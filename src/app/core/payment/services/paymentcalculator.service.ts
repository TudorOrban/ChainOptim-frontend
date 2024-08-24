import { Injectable } from "@angular/core";
import { CustomSubscriptionPlan, FeaturePricing, PlanTier, SubscriptionPlan } from "../../../dashboard/organization/models/SubscriptionPlan";
import { Feature } from "../../../shared/enums/commonEnums";
import { SubscriptionPlanService } from "../../../dashboard/organization/services/subscriptionplan.service";

@Injectable({
    providedIn: 'root'
})
export class PaymentCalculatorService {

    constructor(
        private planService: SubscriptionPlanService,
    ) {}

    featuresByGroup: Record<string, Feature[]> = {
        'Members': [Feature.MEMBER, Feature.CUSTOM_ROLE],
        'Goods': [Feature.PRODUCT, Feature.PRODUCT_STAGE, Feature.COMPONENT],
        'Supply': [Feature.SUPPLIER, Feature.SUPPLIER_ORDER, Feature.SUPPLIER_SHIPMENT],
        'Production': [Feature.FACTORY, Feature.FACTORY_STAGE, Feature.FACTORY_INVENTORY],
        'Storage': [Feature.WAREHOUSE, Feature.WAREHOUSE_INVENTORY],
        'Demand': [Feature.CLIENT, Feature.CLIENT_ORDER, Feature.CLIENT_SHIPMENT],
    }

    featureToPlanPropMap: { [key in Feature]?: keyof SubscriptionPlan } = {
        MEMBER: 'maxMembers',
        PRODUCT: 'maxProducts',
        PRODUCT_STAGE: 'maxProductStages',
        COMPONENT: 'maxComponents',
        FACTORY: 'maxFactories',
        FACTORY_STAGE: 'maxFactoryStages',
        FACTORY_INVENTORY: 'maxFactoryInventoryItems',
        WAREHOUSE: 'maxWarehouses',
        WAREHOUSE_INVENTORY: 'maxWarehouseInventoryItems',
        SUPPLIER: 'maxSuppliers',
        SUPPLIER_ORDER: 'maxSupplierOrders',
        SUPPLIER_SHIPMENT: 'maxSupplierShipments',
        CLIENT: 'maxClients',
        CLIENT_ORDER: 'maxClientOrders',
        CLIENT_SHIPMENT: 'maxClientShipments',
    };
    
    getTotalPrice(customPlan: CustomSubscriptionPlan, isMonthly: boolean): number {
        let total = this.planService.getSubscriptionPlan(customPlan.basePlanTier).dollarsPerMonth;

        for (const feature in customPlan.additionalFeatures) {
            total += this.getPriceByFeature(feature as Feature, customPlan, isMonthly);
        }

        customPlan.totalDollarsMonthly = total;
        
        return total;
    }

    getFeaturePrice(featureKey: string, customPlan: CustomSubscriptionPlan, isMonthly: boolean): number {
        const feature = this.parseFeatureKey(featureKey);
        return this.getPriceByFeature(feature, customPlan, isMonthly);
    }

    getPriceByFeature(feature: Feature, customPlan: CustomSubscriptionPlan, isMonthly: boolean): number {
        const pricing = this.planService.getFeaturePricing(feature);

        if (!pricing) {
            return 0;
        }

        const featureQuantity = customPlan.additionalFeatures[feature];
        const closestTier = this.findClosestTier(pricing, featureQuantity);
        if (closestTier === undefined) {
            return 0; // No applicable tier found
        }

        // Calculate total price based on the chosen tier's rate
        const pricePerUnit = isMonthly ? pricing[closestTier].dollarsMonthly : pricing[closestTier].dollarsYearly;
        return featureQuantity * pricePerUnit;
    }
    
    getPlanFeatureDetail(feature: Feature, selectedPlanTier: PlanTier, plan?: SubscriptionPlan): number | boolean {
        if (!plan) {
            plan = this.planService.getSubscriptionPlan(selectedPlanTier);
        }

        const planProp = this.featureToPlanPropMap[feature];
        if (planProp) {
            const value = plan[planProp];
            if (typeof value === 'number' || typeof value === 'boolean') {
                return value;
            }
        }
        return 0;
    }    
    
    private findClosestTier(pricing: FeaturePricing, quantity: number): number | undefined {
        let closest = undefined;
        for (const tierQuantity in pricing) {
            const tier = parseInt(tierQuantity, 10);
            if (tier <= quantity && (closest === undefined || tier > closest)) {
                closest = tier;
            }
        }
        return closest;
    }
    
    initializeFeatures(defaultValue: number): Record<Feature, number> {
        return Object.values(Feature).reduce((acc, key) => {
            acc[key as Feature] = defaultValue;
            return acc;
        }, {} as Record<Feature, number>);
    }

    getPlanTierEnum(key: string): PlanTier {
        return PlanTier[key as keyof typeof PlanTier];
    }
    
    getFeatureEnum(key: string): Feature {
        return Feature[key as keyof typeof Feature];
    }

    parseFeatureKey(key: string): Feature {
        return Feature[key as keyof typeof Feature];
    }
    
    parsePlanTier(key: string): PlanTier {
        return PlanTier[key as keyof typeof PlanTier];
    }
    
    getObjectValues<T extends object>(enumObj: T): Array<keyof T> {
        return Object.keys(enumObj) as Array<keyof T>;
    }

    getFeaturesByGroup(): Record<string, Feature[]> {
        return this.featuresByGroup;
    }
}