import { Component } from '@angular/core';
import { PlanTier } from '../../../../dashboard/organization/models/SubscriptionPlan';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {

    PlanTier = PlanTier;
    
    openPlan(planTier: PlanTier): void {
        console.log('Open plan', planTier);
    }
}
