import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CreateSupplierOrderDTO, SupplierOrder, UpdateSupplierOrderDTO } from '../models/SupplierOrder';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from '../../../shared/search/models/PaginatedResults';
import { CachingService } from '../../../shared/search/services/caching.service';
import { SearchParams } from '../../../shared/search/models/Search';
import { SearchMode } from '../../../shared/enums/commonEnums';

@Injectable({
    providedIn: 'root',
})
export class SupplierOrderService {
    private apiUrl = 'http://localhost:8080/api/v1/supplier-orders';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private cachingService: CachingService<PaginatedResults<SupplierOrder>>
    ) {}

    getSupplierOrdersByOrganizationId(organizationId: number): Observable<SupplierOrder[]> {
        return this.http
            .get<SupplierOrder[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getSupplierOrdersByOrganizationIdAdvanced(
        entityId: number,
        searchParams: SearchParams,
        searchMode: SearchMode
    ): Observable<PaginatedResults<SupplierOrder>> {
        let url = `${this.apiUrl}/${searchMode === SearchMode.ORGANIZATION ? "organization" : "supplier"}/advanced/${entityId}?searchQuery=${encodeURIComponent(searchParams.searchQuery)}&sortBy=${encodeURIComponent(searchParams.sortOption)}&ascending=${searchParams.ascending}&page=${searchParams.page}&itemsPerPage=${searchParams.itemsPerPage}`;

        // Check in cache
        let cacheKey = this.cachingService.createCacheKey('supplier-orders', entityId, searchParams);
        if (this.cachingService.isCached(cacheKey) && !this.cachingService.isStale(cacheKey)) {
            console.log("Cache hit", cacheKey);
            return new Observable((observer) => {
                observer.next(this.cachingService.getFromCache(cacheKey));
                observer.complete();
            });
        }

        // Hit endpoint
        const STALE_TIME = 300000; // 5 minutes

        return this.http.get<PaginatedResults<SupplierOrder>>(url).pipe(
            catchError(error => {
                // Pass error through without caching
                console.error("Error fetching supplierOrders:", error);
                this.errorHandlerService.handleError(error);
                return throwError(() => error);
            }),
            tap(data => {
                // Cache results on successful fetch
                this.cachingService.addToCache(cacheKey, data, STALE_TIME); 
            })
        );
    }

    getSupplierOrderById(id: number): Observable<SupplierOrder> {
        return this.http
            .get<SupplierOrder>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    createSupplierOrder(supplierOrderDTO: CreateSupplierOrderDTO): Observable<SupplierOrder> {
        return this.http.post<SupplierOrder>(`${this.apiUrl}/create`, supplierOrderDTO);
    }
        
    updateSupplierOrder(supplierOrderDTO: UpdateSupplierOrderDTO): Observable<SupplierOrder> {
        return this.http.put<SupplierOrder>(`${this.apiUrl}/update`, supplierOrderDTO);
    }

    deleteSupplierOrder(supplierOrderId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${supplierOrderId}`);
    }
}
