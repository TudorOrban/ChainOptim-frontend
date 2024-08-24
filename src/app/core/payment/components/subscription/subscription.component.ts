import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PaymentComponent } from '../payment/payment.component';
import { CustomSubscriptionPlan } from '../../../../dashboard/organization/models/SubscriptionPlan';
import { CurrentPlanService } from '../../services/currentplan.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, PaymentComponent],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent implements OnInit, OnDestroy {
    
    customPlan: CustomSubscriptionPlan | undefined = undefined;
    
    private planSubscription: Subscription = new Subscription();
    
    constructor(
        private currentPlanService: CurrentPlanService,
    ) {}

    ngOnInit() {
        this.planSubscription = this.currentPlanService.currentPlan$.subscribe(data => {
            this.customPlan = data;
        });
    }
    
    ngOnDestroy(): void {
        this.planSubscription.unsubscribe();
    }
}
