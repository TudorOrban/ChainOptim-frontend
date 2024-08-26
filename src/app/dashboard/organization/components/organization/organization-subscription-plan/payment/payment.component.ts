import { Component, Input, OnInit } from '@angular/core';
import { CustomSubscriptionPlan } from '../../../../models/SubscriptionPlan';
import { StripeService } from '../../../../services/stripe.service';
import { UserService } from '../../../../../../core/auth/services/user.service';
import { User } from '../../../../../../core/user/model/user';
import { CreateSubscriptionPlanDTO } from "../../../../models/SubscriptionPlan";
import { SubscriptionPlanService } from '../../../../services/subscriptionplan.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{
    @Input() customPlan: CustomSubscriptionPlan | undefined = undefined;

    currentUser: User | undefined = undefined;

    constructor(
        private userService: UserService,
        private planService: SubscriptionPlanService,
        private stripeService: StripeService
    ) {}

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            if (!user) {
                return;
            }
            this.currentUser = user;

        });
    }

    confirmPayment(): void {
        this.startStripeSession();
    }

    private startStripeSession(): void {
        if (!this.customPlan || !this.currentUser?.organization?.id) {
            console.log('No custom plan to start session');
            return;
        }
        
        const planDTO: CreateSubscriptionPlanDTO = {
            organizationId: this.currentUser.organization.id,
            customPlan: this.customPlan
        };

        this.planService.createSubscriptionPlan(planDTO).subscribe({
            next: response => {
                console.log('Stripe session created:', response);
                this.stripeService.redirectToCheckout(response.sessionId).then(result => {
                    console.log('Redirecting to checkout:', result);
                });
            },
            error: error => console.error('Error creating Stripe session:', error)
        });
    }

}
