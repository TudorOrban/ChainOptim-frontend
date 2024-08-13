import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ErrorHandlerService } from "../../../shared/fallback/services/error/error-handler.service";
import { catchError, Observable } from "rxjs";
import { FactoryPerformance } from "../models/FactoryPerformance";

@Injectable({
    providedIn: 'root',
})
export class FactoryPerformanceService {
    private apiUrl = 'http://localhost:8080/api/v1/factory-performances';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {}

    getFactoryPerformanceByFactoryId(factoryId: number, refresh: boolean): Observable<FactoryPerformance> {
        return this.http
            .get<FactoryPerformance>(`${this.apiUrl}/factory/${factoryId}${refresh ? '/refresh' : ''}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }
}