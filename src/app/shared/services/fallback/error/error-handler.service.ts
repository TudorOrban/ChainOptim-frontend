import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlerService {
    constructor() {}

    public handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(() => {
            const friendlyMessage = this.mapErrorCodeToMessage(error.status);
            return new Error(friendlyMessage);
        });
    }

    private mapErrorCodeToMessage(statusCode: number): string {
        switch (statusCode) {
            case 0:
                return 'Unable to connect to the server. Please check your internet connection and try again.';
            case 400:
                return 'The request was invalid. Please check your input.';
            case 401:
                return 'You are not authorized to view this content.';
            case 403:
                return 'Something went wrong.';
            case 404:
                return 'The requested resource was not found.';
            case 500:
                return 'An unexpected error occurred. Please try again later.';
            default:
                return 'An unexpected error occurred.';
        }
    }
}
