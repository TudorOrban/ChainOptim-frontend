import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CreateFactoryInventoryItemDTO, FactoryInventoryItem, UpdateFactoryInventoryItemDTO } from '../models/FactoryInventoryItem';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from "../../../shared/search/models/searchTypes";
import { CachingService } from '../../../shared/search/services/caching.service';
import { SearchParams } from '../../../shared/search/models/searchTypes';
import { SearchMode } from '../../../shared/enums/commonEnums';

@Injectable({
    providedIn: 'root',
})
export class FactoryInventoryItemService {
    private apiUrl = 'http://localhost:8080/api/v1/factory-inventory-items';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private cachingService: CachingService<PaginatedResults<FactoryInventoryItem>>
    ) {}

    getFactoryInventoryItemsByOrganizationId(organizationId: number): Observable<FactoryInventoryItem[]> {
        return this.http
            .get<FactoryInventoryItem[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getFactoryInventoryItemsByOrganizationIdAdvanced(
        entityId: number,
        searchParams: SearchParams,
        searchMode: SearchMode
    ): Observable<PaginatedResults<FactoryInventoryItem>> {
        let url = `${this.apiUrl}/${searchMode === SearchMode.ORGANIZATION ? "organization" : "factory"}/advanced/${entityId}?searchQuery=${encodeURIComponent(searchParams.searchQuery)}&sortBy=${encodeURIComponent(searchParams.sortOption)}&ascending=${searchParams.ascending}&page=${searchParams.page}&itemsPerPage=${searchParams.itemsPerPage}`;
        if (searchParams.filters && Object.keys(searchParams.filters).length > 0) {
            const filtersJson = JSON.stringify(searchParams.filters);
            const encodedFilters = encodeURIComponent(filtersJson);
            url += `&filters=${encodedFilters}`;
        }
        console.log("Fetching factoryInventoryItems from:", url);

        // Check in cache
        let cacheKey = this.cachingService.createCacheKey('factory-orders', entityId, searchParams);
        if (this.cachingService.isCached(cacheKey) && !this.cachingService.isStale(cacheKey)) {
            console.log("Cache hit", cacheKey);
            return new Observable((observer) => {
                observer.next(this.cachingService.getFromCache(cacheKey));
                observer.complete();
            });
        }

        // Hit endpoint
        const STALE_TIME = 300000; // 5 minutes

        return this.http.get<PaginatedResults<FactoryInventoryItem>>(url).pipe(
            catchError(error => {
                // Pass error through without caching
                console.error("Error fetching factoryInventoryItems:", error);
                this.errorHandlerService.handleError(error);
                return throwError(() => error);
            }),
            tap(data => {
                // Cache results on successful fetch
                this.cachingService.addToCache(cacheKey, data, STALE_TIME); 
            })
        );
    }

    getFactoryInventoryItemById(id: number): Observable<FactoryInventoryItem> {
        return this.http
            .get<FactoryInventoryItem>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    
    createFactoryInventoryItem(factoryInventoryItemDTO: CreateFactoryInventoryItemDTO): Observable<FactoryInventoryItem> {
        return this.http.post<FactoryInventoryItem>(`${this.apiUrl}/create`, factoryInventoryItemDTO).pipe(
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

    createFactoryInventoryItemsInBulk(orderDTOs: CreateFactoryInventoryItemDTO[]): Observable<FactoryInventoryItem[]> {
        return this.http.post<FactoryInventoryItem[]>(`${this.apiUrl}/create/bulk`, orderDTOs).pipe(
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
        
    updateFactoryInventoryItem(factoryInventoryItemDTO: UpdateFactoryInventoryItemDTO): Observable<FactoryInventoryItem> {
        return this.http.put<FactoryInventoryItem>(`${this.apiUrl}/update`, factoryInventoryItemDTO);
    }

    updateFactoryInventoryItemsInBulk(orderDTOs: UpdateFactoryInventoryItemDTO[]): Observable<FactoryInventoryItem[]> {
        return this.http.put<FactoryInventoryItem[]>(`${this.apiUrl}/update/bulk`, orderDTOs).pipe(
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

    deleteFactoryInventoryItem(factoryInventoryItemId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${factoryInventoryItemId}`);
    }

    deleteFactoryInventoryItemsInBulk(factoryInventoryItemIds: number[]): Observable<number[]> {
        const options = {
            body: factoryInventoryItemIds,
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
