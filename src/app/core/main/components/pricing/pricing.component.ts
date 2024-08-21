import { Component } from '@angular/core';
import { PlanTier } from '../../../../dashboard/organization/models/SubscriptionPlan';
import { CommonModule } from '@angular/common';
import { PlanBoxComponent } from './plan-box/plan-box.component';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, PlanBoxComponent],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {

    PlanTier = PlanTier;

    openPlan(planTier: PlanTier): void {
        console.log('Open plan', planTier);
    }
}
