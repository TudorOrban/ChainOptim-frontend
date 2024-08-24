import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root',
})
export class StripeService {
    private stripe: any;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private configService: ConfigService
    ) {
        const stripeKey = this.configService.getStripePublishableKey();
        console.log('Stripe key:', stripeKey);
        this.stripe = (window as any).Stripe(stripeKey);
    }

    redirectToCheckout(sessionId: string): Promise<any> {
        return this.stripe
            .redirectToCheckout({ sessionId: sessionId })
            .then((result: any) => {
                return result;
            })
            .catch((error: any) => {
                throw error;
            });
    }
}
