import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { ConfigService } from './config.service';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
    providedIn: 'root',
})
export class StripeService {
    private stripePromise: Promise<Stripe | null> = Promise.resolve(null);

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private configService: ConfigService
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.initializeStripe();
        }
    }

    private initializeStripe(): void {
        const stripeKey = this.configService.getStripePublishableKey();
        if (!stripeKey) {
            console.error('Stripe key is missing or invalid');
            this.stripePromise = Promise.resolve(null);
            return;
        }
        
        this.stripePromise = loadStripe(stripeKey);
        this.stripePromise.then(stripe => {
            console.log('Stripe is initialized:', !!stripe);
        }).catch(error => {
            console.error('Error initializing Stripe:', error);
        });
    }

    async redirectToCheckout(sessionId: string): Promise<void> {
        const stripe = await this.stripePromise;
        if (!stripe) {
            throw new Error('Stripe is not initialized');
        }

        const { error } = await stripe.redirectToCheckout({ sessionId: sessionId });
        if (error) {
            console.error('Error redirecting to checkout:', error);
            throw error;
        }
    }
}