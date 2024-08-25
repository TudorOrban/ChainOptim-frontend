import { Injectable } from "@angular/core";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { ConfigService } from "./config.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CreateSubscriptionPlanDTO } from "../models/SubscriptionPlan";

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

    createCheckoutSession(planDTO: CreateSubscriptionPlanDTO): Observable<{ sessionId: string }> {
        console.log('Creating checkout session for custom plan:', planDTO);
        return this.http.post<{ sessionId: string }>(`${this.apiUrl}/create`, planDTO);
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