import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Feature } from '../../../../../shared/enums/commonEnums';
import { CustomSubscriptionPlan, FeaturePricing, PlanTier, SubscriptionPlan } from '../../../../../dashboard/organization/models/SubscriptionPlan';
import { SubscriptionPlanService } from '../../../../../dashboard/organization/services/subscriptionplan.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { CurrentPlanService } from '../../../../payment/services/currentplan.service';
import { Router } from '@angular/router';
import { PaymentCalculatorService } from '../../../../payment/services/paymentcalculator.service';
import { UIUtilService } from '../../../../../shared/common/services/uiutil.service';

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

    Feature = Feature;
    PlanTier = PlanTier;

    planService: SubscriptionPlanService;
    calculatorService: PaymentCalculatorService;
    uiUtilService: UIUtilService;

    constructor(
        planService: SubscriptionPlanService,
        private currentPlanService: CurrentPlanService,
        private paymentCalculatorService: PaymentCalculatorService,
        private utilService: UIUtilService,
        private router: Router
    ) {
        this.planService = planService;
        this.calculatorService = paymentCalculatorService;
        this.uiUtilService = utilService;
        this.currentPlan = this.planService.getSubscriptionPlan(this.selectedPlanTier);
    }
    
    selectPlanTier(planTier: PlanTier): void {
        this.selectedPlanTier = planTier;
        this.resetCustomPlan(planTier);
        this.currentPlan = this.planService.getSubscriptionPlan(planTier);
    }

    continueWithCustomPlan(): void {
        console.log('Custom plan:', this.customPlan);
        this.currentPlanService.setCurrentPlan(this.customPlan);

        this.router.navigate(['/subscribe']);
    }

    // Utils
    private resetCustomPlan(planTier: PlanTier): void {
        this.customPlan = {
            basePlanTier: planTier,
            additionalFeatures: this.initializeFeatures(0),
        };
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
