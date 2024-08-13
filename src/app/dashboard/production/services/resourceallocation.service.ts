import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { AllocationPlan, ResourceAllocationPlan } from '../models/ResourceAllocation';

@Injectable({
    providedIn: 'root',
})
export class ResourceAllocationService {
    private apiUrl = 'http://localhost:8080/api/v1';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {}

    computeAllocationPlan(factoryId: number, durationHours: number): Observable<AllocationPlan> {
        return this.http
            .post<AllocationPlan>(`${this.apiUrl}/factories/allocate-resources/${factoryId}`, durationHours)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getActivePlan(factoryId: number): Observable<ResourceAllocationPlan> {
        return this.http
            .get<ResourceAllocationPlan>(`${this.apiUrl}/active-resource-allocation-plans/factory/${factoryId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }
    
}
