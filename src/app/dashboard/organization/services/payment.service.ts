import { Injectable } from "@angular/core";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { ConfigService } from "./config.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = 'http://localhost:8080/api/v1/subscription-plans';

    private stripe: Stripe | null = null;

    constructor(
        private configService: ConfigService,
        private http: HttpClient
    ) {
        this.initializeStripe();
    }

    private async initializeStripe() {
        const stripeKey = this.configService.getStripePublishableKey();
        if (!stripeKey) {
            return;
        }
        this.stripe = await loadStripe(stripeKey);
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