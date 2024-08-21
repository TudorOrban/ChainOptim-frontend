import { Component } from '@angular/core';
import { PlanTier } from '../../../../dashboard/organization/models/SubscriptionPlan';
import { CommonModule } from '@angular/common';
import { PlanBoxComponent } from './plan-box/plan-box.component';
import { CustomPlanComponent } from './custom-plan/custom-plan.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, PlanBoxComponent, CustomPlanComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {

    PlanTier = PlanTier;

    openPlan(planTier: PlanTier): void {
        console.log('Open plan', planTier);
    }
}
