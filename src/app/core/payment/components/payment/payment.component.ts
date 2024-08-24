import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { CustomSubscriptionPlan } from '../../../../dashboard/organization/models/SubscriptionPlan';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit, OnChanges {
    @Input() customPlan: CustomSubscriptionPlan | undefined = undefined;

    constructor(
        private paymentService: PaymentService,
    ) {}

    ngOnInit() {
        this.startStripeSession();
    }
    
    ngOnChanges() {
        this.startStripeSession();
    }

    private startStripeSession(): void {
        if (!this.customPlan) {
            console.log('No custom plan to start session');
            return;
        }
        this.paymentService.createCheckoutSession(this.customPlan).subscribe({
            next: session => console.log('Stripe session created:', session),
            error: error => console.error('Error creating Stripe session:', error)
        });
    }

}
