import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Feature } from '../../../../../shared/enums/commonEnums';
import { CustomSubscriptionPlan, FeaturePricing, PlanTier, SubscriptionPlan } from '../../../../../dashboard/organization/models/SubscriptionPlan';
import { SubscriptionPlanService } from '../../../../../dashboard/organization/services/subscriptionplan.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { CurrentPlanService } from '../../../../payment/services/currentplan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, MatExpansionModule],
  templateUrl: './custom-plan.component.html',
  styleUrl: './custom-plan.component.css'
})
export class CustomPlanComponent {

    isMonthly: boolean = true;
    selectedPlanTier: PlanTier = PlanTier.NONE;
    currentPlan: SubscriptionPlan | undefined = undefined;

    customPlan: CustomSubscriptionPlan = {
        basePlanTier: PlanTier.NONE,
        additionalFeatures: this.initializeFeatures(0),
    }

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

    Feature = Feature;
    PlanTier = PlanTier;

    planService: SubscriptionPlanService;

    constructor(
        planService: SubscriptionPlanService,
        private currentPlanService: CurrentPlanService,
        private router: Router
    ) {
        this.planService = planService;
        this.currentPlan = this.planService.getSubscriptionPlan(this.selectedPlanTier);
    }

    selectPlanTier(planTier: PlanTier): void {
        this.selectedPlanTier = planTier;
        this.resetCustomPlan(planTier);
        this.currentPlan = this.planService.getSubscriptionPlan(planTier);
    }

    getPlanFeatureDetail(feature: Feature, plan?: SubscriptionPlan): number | boolean {
        if (!plan) {
            plan = this.planService.getSubscriptionPlan(this.selectedPlanTier);
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

    getFeaturePrice(featureKey: string): number {
        const feature = this.parseFeatureKey(featureKey);
        return this.getPriceByFeature(feature);
    }

    getPriceByFeature(feature: Feature): number {
        const pricing = this.planService.getFeaturePricing(feature);

        if (!pricing) {
            return 0;
        }

        const featureQuantity = this.customPlan.additionalFeatures[feature];
        const closestTier = this.findClosestTier(pricing, featureQuantity);
        if (closestTier === undefined) {
            return 0; // No applicable tier found
        }

        // Calculate total price based on the chosen tier's rate
        const pricePerUnit = this.isMonthly ? pricing[closestTier].dollarsMonthly : pricing[closestTier].dollarsYearly;
        return featureQuantity * pricePerUnit;
    }

    getTotalPrice(): number {
        let total = this.planService.getSubscriptionPlan(this.customPlan.basePlanTier).dollarsPerMonth;

        for (const feature in this.customPlan.additionalFeatures) {
            total += this.getPriceByFeature(feature as Feature);
        }

        this.customPlan.totalDollarsMonthly = total;
        
        return total;
    }

    continueWithCustomPlan(): void {
        console.log('Custom plan:', this.customPlan);
        this.currentPlanService.setCurrentPlan(this.customPlan);

        this.router.navigate(['/subscribe']);
    }

    // Utils
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

    private resetCustomPlan(planTier: PlanTier): void {
        this.customPlan = {
            basePlanTier: planTier,
            additionalFeatures: this.initializeFeatures(0),
        };
    }
    
    getObjectValues<T extends object>(enumObj: T): Array<keyof T> {
        return Object.keys(enumObj) as Array<keyof T>;
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
    
    decapitalize(word?: string) {
        if (!word) return '';
        return word.charAt(0) + word.slice(1).toLowerCase();
    }

    initializeFeatures(defaultValue: number): Record<Feature, number> {
        return Object.values(Feature).reduce((acc, key) => {
            acc[key as Feature] = defaultValue;
            return acc;
        }, {} as Record<Feature, number>);
    }
    
    toTitleCase(text: string): string {
        return text.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase()).replace(/_/g, ' ');
    }
}
