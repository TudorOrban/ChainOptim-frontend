import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { FactoryProductionHistory } from '../models/ResourceAllocation';

@Injectable({
    providedIn: 'root',
})
export class ProductionHistoryService {
    private apiUrl = 'http://localhost:8080/api/v1/factory-production-histories';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {}

    getFactoryProductionHistoryByFactoryId(factoryId: number): Observable<FactoryProductionHistory> {
        return this.http
            .get<FactoryProductionHistory>(`${this.apiUrl}/factory/${factoryId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }
    
}
