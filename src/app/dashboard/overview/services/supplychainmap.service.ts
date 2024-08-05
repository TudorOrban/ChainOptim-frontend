import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { SupplyChainMap } from '../types/supplyChainMapTypes';

@Injectable({
    providedIn: 'root',
})
export class SupplyChainMapService {
    private apiUrl = 'http://localhost:8080/api/v1/supply-chain-maps';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService
    ) {}

    getSupplyChainMapByOrganizationId(organizationId: number): Observable<SupplyChainMap> {
        return this.http
            .get<SupplyChainMap>(`${this.apiUrl}/${organizationId}/refresh`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    refreshSupplyChainMap(organizationId: number): Observable<SupplyChainMap> {
        return this.http
            .post<SupplyChainMap>(`${this.apiUrl}/${organizationId}/refresh`, {})
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }


}