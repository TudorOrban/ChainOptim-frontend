import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from "../../../shared/search/models/searchTypes";
import { CachingService } from '../../../shared/search/services/caching.service';
import { CreateConnectionDTO, DeleteConnectionDTO, ProductStageConnection, UpdateConnectionDTO } from '../models/ProductGraph';
import { Product } from '../models/Product';

@Injectable({
    providedIn: 'root',
})
export class ProductStageConnectionService {
    private apiUrl = 'http://localhost:8080/api/v1/product-stage-connections';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private cachingService: CachingService<PaginatedResults<Product>>
    ) {}

    getConnectionsByProductId(productId: number): Observable<ProductStageConnection[]> {
        return this.http
            .get<ProductStageConnection[]>(`${this.apiUrl}/product/${productId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    createConnection(connectionDTO: CreateConnectionDTO): Observable<ProductStageConnection> {
        return this.http.post<ProductStageConnection>(`${this.apiUrl}/create`, connectionDTO);
    }
        
    updateConnection(connectionDTO: UpdateConnectionDTO): Observable<ProductStageConnection> {
        return this.http.put<ProductStageConnection>(`${this.apiUrl}/update`, connectionDTO);
    }

    deleteConnection(connectionId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${connectionId}`);
    }

    findAndDeleteConnection(connectionDTO: DeleteConnectionDTO): Observable<void> {
        const options = {
            body: connectionDTO,
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.delete<void>(`${this.apiUrl}/delete`, options);
    }
}
