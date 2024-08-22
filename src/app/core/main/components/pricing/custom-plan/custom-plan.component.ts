import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Feature } from '../../../../../shared/enums/commonEnums';
import { PlanTier } from '../../../../../dashboard/organization/models/SubscriptionPlan';
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
    selectedPlanTier: PlanTier | undefined = PlanTier.NONE;

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
    }
    
    // Utils
    getObjectValues(obj: any): any[] {
        return Object.values(obj);
    }

    decapitalize(word?: string) {
        if (!word) return '';
        return word.charAt(0) + word.slice(1).toLowerCase();
    }
}
