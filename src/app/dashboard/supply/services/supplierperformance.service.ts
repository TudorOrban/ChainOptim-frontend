import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ErrorHandlerService } from "../../../shared/fallback/services/error/error-handler.service";
import { catchError, Observable } from "rxjs";
import { SupplierPerformance } from "../models/SupplierPerformance";

@Injectable({
    providedIn: 'root',
})
export class SupplierPerformanceService {
    private apiUrl = 'http://localhost:8080/api/v1/supplier-performance';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {}

    getSupplierPerformanceBySupplierId(supplierId: number, refresh: boolean): Observable<SupplierPerformance> {
        return this.http
            .get<SupplierPerformance>(`${this.apiUrl}/supplier/${supplierId}${refresh ? '/refresh' : ''}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }
}