import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { metaReducers, reducers } from './core/caching/reducers';
import { ProductEffects } from './core/caching/effects/ProductEffects';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes), 
        provideClientHydration(), 
        provideHttpClient(withFetch()), 
        provideStore(reducers, { metaReducers }), 
        provideEffects([ProductEffects]), 
        provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    ]
};
