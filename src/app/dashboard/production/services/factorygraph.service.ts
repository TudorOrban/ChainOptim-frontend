import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { FactoryProductionGraph } from '../models/FactoryGraph';

@Injectable({
    providedIn: 'root',
})
export class FactoryGraphService {
    private apiUrl = 'http://localhost:8080/api/v1/factory-graphs';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {}

    getFactoryProductionGraphByFactoryId(factoryId: number): Observable<FactoryProductionGraph[]> {
        return this.http
            .get<FactoryProductionGraph[]>(`${this.apiUrl}/${factoryId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    refreshFactoryProductionGraphByFactoryId(factoryId: number): Observable<FactoryProductionGraph> {
        return this.http
            .get<FactoryProductionGraph>(`${this.apiUrl}/update/${factoryId}/refresh`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }
    
}
