import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { CustomSubscriptionPlan } from '../../../../dashboard/organization/models/SubscriptionPlan';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
    @Input() customPlan: CustomSubscriptionPlan | undefined = undefined;

    constructor(
        private paymentService: PaymentService,
        private stripeService: StripeService
    ) {}

    confirmPayment(): void {
        console.log('Confirm payment');
        this.startStripeSession();
    }

    private startStripeSession(): void {
        if (!this.customPlan) {
            console.log('No custom plan to start session');
            return;
        }
        this.paymentService.createCheckoutSession(this.customPlan).subscribe({
            next: response => {
                console.log('Stripe session created:', response);
                this.stripeService.redirectToCheckout(response.sessionId).then(result => {
                    if (result.error) {
                        console.error('Error redirecting to checkout:', result.error);
                    }
                });
            },
            error: error => console.error('Error creating Stripe session:', error)
        });
    }

}
