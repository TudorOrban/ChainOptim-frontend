import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CreateWarehouseInventoryItemDTO, WarehouseInventoryItem, UpdateWarehouseInventoryItemDTO } from '../models/WarehouseInventoryItem';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from "../../../shared/search/models/searchTypes";
import { CachingService } from '../../../shared/search/services/caching.service';
import { SearchParams } from '../../../shared/search/models/searchTypes';
import { SearchMode } from '../../../shared/enums/commonEnums';

@Injectable({
    providedIn: 'root',
})
export class WarehouseInventoryItemService {
    private apiUrl = 'http://localhost:8080/api/v1/warehouse-inventory-items';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private cachingService: CachingService<PaginatedResults<WarehouseInventoryItem>>
    ) {}

    getWarehouseInventoryItemsByOrganizationId(organizationId: number): Observable<WarehouseInventoryItem[]> {
        return this.http
            .get<WarehouseInventoryItem[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getWarehouseInventoryItemsByOrganizationIdAdvanced(
        entityId: number,
        searchParams: SearchParams,
        searchMode: SearchMode
    ): Observable<PaginatedResults<WarehouseInventoryItem>> {
        let url = `${this.apiUrl}/${searchMode === SearchMode.ORGANIZATION ? "organization" : "warehouse"}/advanced/${entityId}?searchQuery=${encodeURIComponent(searchParams.searchQuery)}&sortBy=${encodeURIComponent(searchParams.sortOption)}&ascending=${searchParams.ascending}&page=${searchParams.page}&itemsPerPage=${searchParams.itemsPerPage}`;
        if (searchParams.filters && Object.keys(searchParams.filters).length > 0) {
            const filtersJson = JSON.stringify(searchParams.filters);
            const encodedFilters = encodeURIComponent(filtersJson);
            url += `&filters=${encodedFilters}`;
        }
        console.log("Fetching warehouseInventoryItems from:", url);

        // Check in cache
        let cacheKey = this.cachingService.createCacheKey('warehouse-orders', entityId, searchParams);
        if (this.cachingService.isCached(cacheKey) && !this.cachingService.isStale(cacheKey)) {
            console.log("Cache hit", cacheKey);
            return new Observable((observer) => {
                observer.next(this.cachingService.getFromCache(cacheKey));
                observer.complete();
            });
        }

        // Hit endpoint
        const STALE_TIME = 300000; // 5 minutes

        return this.http.get<PaginatedResults<WarehouseInventoryItem>>(url).pipe(
            catchError(error => {
                // Pass error through without caching
                console.error("Error fetching warehouseInventoryItems:", error);
                this.errorHandlerService.handleError(error);
                return throwError(() => error);
            }),
            tap(data => {
                // Cache results on successful fetch
                this.cachingService.addToCache(cacheKey, data, STALE_TIME); 
            })
        );
    }

    getWarehouseInventoryItemById(id: number): Observable<WarehouseInventoryItem> {
        return this.http
            .get<WarehouseInventoryItem>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    
    createWarehouseInventoryItem(warehouseInventoryItemDTO: CreateWarehouseInventoryItemDTO): Observable<WarehouseInventoryItem> {
        return this.http.post<WarehouseInventoryItem>(`${this.apiUrl}/create`, warehouseInventoryItemDTO).pipe(
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

    createWarehouseInventoryItemsInBulk(orderDTOs: CreateWarehouseInventoryItemDTO[]): Observable<WarehouseInventoryItem[]> {
        return this.http.post<WarehouseInventoryItem[]>(`${this.apiUrl}/create/bulk`, orderDTOs).pipe(
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
        
    updateWarehouseInventoryItem(warehouseInventoryItemDTO: UpdateWarehouseInventoryItemDTO): Observable<WarehouseInventoryItem> {
        return this.http.put<WarehouseInventoryItem>(`${this.apiUrl}/update`, warehouseInventoryItemDTO);
    }

    updateWarehouseInventoryItemsInBulk(orderDTOs: UpdateWarehouseInventoryItemDTO[]): Observable<WarehouseInventoryItem[]> {
        return this.http.put<WarehouseInventoryItem[]>(`${this.apiUrl}/update/bulk`, orderDTOs).pipe(
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

    deleteWarehouseInventoryItem(warehouseInventoryItemId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${warehouseInventoryItemId}`);
    }

    deleteWarehouseInventoryItemsInBulk(warehouseInventoryItemIds: number[]): Observable<number[]> {
        const options = {
            body: warehouseInventoryItemIds,
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
