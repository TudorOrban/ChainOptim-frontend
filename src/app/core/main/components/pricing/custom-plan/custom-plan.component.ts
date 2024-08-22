import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Feature } from '../../../../../shared/enums/commonEnums';
import { CustomSubscriptionPlan, FeaturePricing, PlanTier } from '../../../../../dashboard/organization/models/SubscriptionPlan';
import { SubscriptionPlanService } from '../../../../../dashboard/organization/services/subscriptionplan.service';

@Component({
  selector: 'app-custom-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

    selectPlanTier(planTier: PlanTier): void {
        this.selectedPlanTier = planTier;
        this.resetCustomPlan(planTier);
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

    getObjectValues(obj: any): any[] {
        return Object.values(obj);
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
