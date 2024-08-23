import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { metaReducers, reducers } from './core/caching/reducers';
import { ProductEffects } from './core/caching/effects/ProductEffects';
import { JwtInterceptor } from './core/auth/services/jwt-interceptor.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes), 
        provideClientHydration(), 
        provideHttpClient(
            withInterceptorsFromDi(),
            withFetch(),
            ), 
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        provideStore(reducers, { metaReducers }), 
        provideEffects([ProductEffects]), 
        provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }), provideAnimationsAsync(),
    ]
};
