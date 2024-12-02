import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { ProductProductionGraph } from '../models/ProductGraph';

@Injectable({
    providedIn: 'root',
})
export class ProductGraphService {
    private readonly apiUrl = 'http://localhost:8080/api/v1/product-graphs';

    constructor(
        private readonly http: HttpClient,
        private readonly errorHandlerService: ErrorHandlerService,
    ) {}

    getProductProductionGraphByProductId(productId: number): Observable<ProductProductionGraph[]> {
        return this.http
            .get<ProductProductionGraph[]>(`${this.apiUrl}/${productId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }
    
    refreshProductProductionGraphByProductId(productId: number): Observable<ProductProductionGraph> {
        return this.http
            .put<ProductProductionGraph>(`${this.apiUrl}/update/${productId}/refresh`, null)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }   
}
