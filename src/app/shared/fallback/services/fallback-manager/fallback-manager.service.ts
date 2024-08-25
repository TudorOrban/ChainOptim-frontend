import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Fallback Manager Service
 *
 * Centralized management of fallback states. It connects with the FallbackManagerComponent
 * to display the fallbacks.
 *
 * Usage:
 * See e.g. products component.
 */
export interface FallbackManagerState {
    errorMessage?: string;
    loading?: boolean;
    noOrganization?: boolean;
    noResults?: boolean;
    fallBack?: boolean;
}

@Injectable({ providedIn: 'root' })
export class FallbackManagerService {
    private _fallbackManagerState = new BehaviorSubject<FallbackManagerState>({});
    fallbackManagerState$ = this._fallbackManagerState.asObservable();

    updateError(message?: string) {
        const currentState = this._fallbackManagerState.value;
        currentState.errorMessage = message;
        this.updateState(currentState);
    }

    updateLoading(loading: boolean) {
        const currentState = { ...this._fallbackManagerState.value, loading };
        this._fallbackManagerState.next(currentState);
    }


    updateNoOrganization(noOrganization: boolean) {
        const currentState = this._fallbackManagerState.value;
        currentState.noOrganization = noOrganization;
        this.updateState(currentState);
    }

    updateNoResults(noResults: boolean) {
        const currentState = this._fallbackManagerState.value;
        currentState.noResults = noResults;
        this.updateState(currentState);
    }

    private updateState(newState: FallbackManagerState) {
        newState.fallBack = !!newState.errorMessage || !!newState.noOrganization || !!newState.noResults;
        this._fallbackManagerState.next(newState);
    }
}
