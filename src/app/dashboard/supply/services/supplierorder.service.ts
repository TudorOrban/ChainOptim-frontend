import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CreateSupplierOrderDTO, SupplierOrder, UpdateSupplierOrderDTO } from '../models/SupplierOrder';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults, SearchParams } from "../../../shared/search/models/searchTypes";
import { CachingService } from '../../../shared/search/services/caching.service';
import { SearchMode } from '../../../shared/enums/commonEnums';

@Injectable({
    providedIn: 'root',
})
export class SupplierOrderService {
    private readonly apiUrl = 'http://localhost:8080/api/v1/supplier-orders';

    constructor(
        private readonly http: HttpClient,
        private readonly errorHandlerService: ErrorHandlerService,
        private readonly cachingService: CachingService<PaginatedResults<SupplierOrder>>
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
        if (searchParams.filters && Object.keys(searchParams.filters).length > 0) {
            const filtersJson = JSON.stringify(searchParams.filters);
            const encodedFilters = encodeURIComponent(filtersJson);
            url += `&filters=${encodedFilters}`;
        }

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
        return this.http.post<SupplierOrder>(`${this.apiUrl}/create`, supplierOrderDTO).pipe(
            tap(order => {
                console.log("Created order:", order);
                if (!order.id) {
                    throw new Error("Order creation failed: No ID found");
                }
                this.cachingService.invalidateAllCache();
            }),
            catchError(error => {
                console.error("Error in creating order", error);
                throw error;
            })
        );
    }

    createSupplierOrdersInBulk(orderDTOs: CreateSupplierOrderDTO[]): Observable<SupplierOrder[]> {
        return this.http.post<SupplierOrder[]>(`${this.apiUrl}/create/bulk`, orderDTOs).pipe(
            tap(orders => {
                console.log("Created orders:", orders);
                if (orders.length === 0) {
                    throw new Error("Order creation failed: No orders created");
                }
                this.cachingService.invalidateAllCache();
            }),
            catchError(error => {
                console.error("Error in creating orders", error);
                throw error;
            })
        );
    }
        
    updateSupplierOrder(supplierOrderDTO: UpdateSupplierOrderDTO): Observable<SupplierOrder> {
        return this.http.put<SupplierOrder>(`${this.apiUrl}/update`, supplierOrderDTO);
    }

    updateSupplierOrdersInBulk(orderDTOs: UpdateSupplierOrderDTO[]): Observable<SupplierOrder[]> {
        return this.http.put<SupplierOrder[]>(`${this.apiUrl}/update/bulk`, orderDTOs).pipe(
            tap(orders => {
                console.log("Updated orders:", orders);
                if (orders.length === 0) {
                    throw new Error("Order update failed: No orders updated");
                }
                this.cachingService.invalidateAllCache();
            }),
            catchError(error => {
                console.error("Error in updating orders", error);
                throw error;
            })
        );
    }

    deleteSupplierOrder(supplierOrderId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${supplierOrderId}`);
    }

    deleteSupplierOrdersInBulk(supplierOrderIds: number[]): Observable<number[]> {
        const options = {
            body: supplierOrderIds,
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.delete<number[]>(`${this.apiUrl}/delete/bulk`, options).pipe(
            tap(orders => {
                console.log("Deleted orders:", orders);
                if (orders.length === 0) {
                    throw new Error("Order deletion failed: No orders deleted");
                }
                this.cachingService.invalidateAllCache();
            }),
            catchError(error => {
                console.error("Error in deleting orders", error);
                throw error;
            })
        );
    }
    
}
