import { Injectable } from "@angular/core";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { CustomSubscriptionPlan } from "../../../dashboard/organization/models/SubscriptionPlan";
import { environment } from "../../../../environments/environment";
import { ConfigService } from "./config.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserService } from "../../auth/services/user.service";

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
        this.stripe = await loadStripe(stripeKey);
    }

    createCheckoutSession(customPlan: CustomSubscriptionPlan, organizationId: number): Observable<{ sessionId: string }> {
        console.log('Creating checkout session for custom plan:', customPlan);
        return this.http.post<{ sessionId: string }>(`${this.apiUrl}/create`, customPlan);
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