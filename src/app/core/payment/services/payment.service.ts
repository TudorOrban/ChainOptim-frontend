import { Injectable } from "@angular/core";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { CustomSubscriptionPlan } from "../../../dashboard/organization/models/SubscriptionPlan";
import { environment } from "../../../../environments/environment";
import { ConfigService } from "./config.service";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private stripe: Stripe | null = null;

    constructor(
        private configService: ConfigService
    ) {
        this.initializeStripe();
    }

    private async initializeStripe() {
        const stripeKey = this.configService.getStripePublishableKey();
        this.stripe = await loadStripe(stripeKey);
    }

    async createCheckoutSession(customPlan: CustomSubscriptionPlan) {
        console.log('Creating checkout session for custom plan', customPlan);
    }

    async redirectToCheckout(sessionId: string) {
        if (!this.stripe) {
            await this.initializeStripe();
        }
        if (this.stripe) {
            const { error } = await this.stripe.redirectToCheckout({ sessionId });
            if (error) {
                console.error('Error redirecting to checkout', error);
            }
        }
    }
}