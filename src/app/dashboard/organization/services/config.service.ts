import { Injectable } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    private stripePublishableKey: string = '';

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            // Running in the browser
            console.log('Running in the browser');
            this.stripePublishableKey = environment.stripePublishableKey;
        } else if (isPlatformServer(this.platformId)) {
            // Running on the server
            console.log('Running on the server');
            this.stripePublishableKey =
                process.env['STRIPE_PUBLISHABLE_KEY'] || '';
        }
    }

    getStripePublishableKey(): string {
        return this.stripePublishableKey;
    }
}
