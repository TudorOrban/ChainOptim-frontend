import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Feature } from '../../../../../shared/enums/commonEnums';
import { CustomSubscriptionPlan, FeaturePricing, PlanTier, SubscriptionPlan } from '../../../../../dashboard/organization/models/SubscriptionPlan';
import { SubscriptionPlanService } from '../../../../../dashboard/organization/services/subscriptionplan.service';
import { MatExpansionModule } from '@angular/material/expansion';

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

    customPlan: CustomSubscriptionPlan = {
        basePlanTier: PlanTier.NONE,
        additionalFeatures: this.initializeFeatures(0),
    }

    Feature = Feature;
    PlanTier = PlanTier;

    planService: SubscriptionPlanService;

    constructor(
        planService: SubscriptionPlanService,
    ) {
        this.planService = planService;
    }

    switchTime(): void {
        this.isMonthly = !this.isMonthly;
    }

    featureToPlanPropMap: { [key in Feature]?: keyof SubscriptionPlan } = {
        USER: 'maxMembers',
        PRODUCT: 'maxProducts',
        PRODUCT_STAGE: 'maxProductStages',
        COMPONENT: 'maxComponents',
        FACTORY: 'maxFactories',
        // Continue mapping all other features...
    };

    getPlanFeatureDetail(plan: SubscriptionPlan, feature: Feature): number | boolean {
        const planProp = this.featureToPlanPropMap[feature];
        if (planProp) {
            const value = plan[planProp];
            if (typeof value === 'number' || typeof value === 'boolean') {
                return value;
            }
        }
        return 0; // Assuming 0 as a default for numbers, adjust based on what makes sense for your application
    }

    getPlanTierEnum(key: string): PlanTier {
        return PlanTier[key as keyof typeof PlanTier];
    }
    
    getFeatureEnum(key: string): Feature {
        return Feature[key as keyof typeof Feature];
    }
    

    selectPlanTier(planTier: PlanTier): void {
        this.selectedPlanTier = planTier;
        this.resetCustomPlan(planTier);
    }

    getFeaturePrice(featureKey: string): number {
        const feature = this.parseFeatureKey(featureKey);
        return this.getPriceByFeature(feature);
    }

    getPlanDetails(planKey: string): SubscriptionPlan {
        const planTier = this.parsePlanTier(planKey);
        return this.planService.getSubscriptionPlan(planTier);
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
        if (!this.isMonthly) {
            total *= 12;
        }

        for (const feature in this.customPlan.additionalFeatures) {
            total += this.getPriceByFeature(feature as Feature);
        }

        return total;
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
}
