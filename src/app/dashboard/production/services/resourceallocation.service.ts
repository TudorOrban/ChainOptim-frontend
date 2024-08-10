import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { AllocationPlan } from '../models/ResourceAllocation';

@Injectable({
    providedIn: 'root',
})
export class ResourceAllocationService {
    private apiUrl = 'http://localhost:8080/api/v1/factories/allocate-resources';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {}

    computeAllocationPlan(factoryId: number, durationHours: number): Observable<AllocationPlan> {
        return this.http
            .post<AllocationPlan>(`${this.apiUrl}/${factoryId}`, durationHours)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }
    
}
