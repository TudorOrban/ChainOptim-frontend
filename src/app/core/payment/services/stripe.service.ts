import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root',
})
export class StripeService {
    private stripe: any;
    private configService: ConfigService;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document,
        private injectors: Injector
    ) {
        this.configService = this.injectors.get(ConfigService);
        const stripeKey = this.configService.getStripePublishableKey();
        if (isPlatformBrowser(platformId) && stripeKey && !window) {
            this.stripe = (window as any).Stripe(stripeKey);
        }
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
