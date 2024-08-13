import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { SupplyChainSnapshot } from '../types/scSnapshotTypes';

@Injectable({
    providedIn: 'root',
})
export class SCSnapshotService {
    private apiUrl = 'http://localhost:8080/api/v1/supply-chain-snapshots';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService
    ) {}

    getSCSnapshotByOrganizationId(organizationId: number): Observable<SupplyChainSnapshot> {
        return this.http
            .get<SupplyChainSnapshot>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }
}