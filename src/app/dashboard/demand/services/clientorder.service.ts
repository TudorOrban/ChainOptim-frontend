import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CreateClientOrderDTO, ClientOrder, UpdateClientOrderDTO } from '../models/ClientOrder';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { CachingService } from '../../../shared/search/services/caching.service';
import { SearchParams, PaginatedResults } from '../../../shared/search/models/searchTypes';
import { SearchMode } from '../../../shared/enums/commonEnums';

@Injectable({
    providedIn: 'root',
})
export class ClientOrderService {
    private readonly apiUrl = 'http://localhost:8080/api/v1/client-orders';

    constructor(
        private readonly http: HttpClient,
        private readonly errorHandlerService: ErrorHandlerService,
        private readonly cachingService: CachingService<PaginatedResults<ClientOrder>>
    ) {}

    getClientOrdersByOrganizationId(organizationId: number): Observable<ClientOrder[]> {
        return this.http
            .get<ClientOrder[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getClientOrdersByOrganizationIdAdvanced(
        entityId: number,
        searchParams: SearchParams,
        searchMode: SearchMode
    ): Observable<PaginatedResults<ClientOrder>> {
        let url = `${this.apiUrl}/${searchMode === SearchMode.ORGANIZATION ? "organization" : "client"}/advanced/${entityId}?searchQuery=${encodeURIComponent(searchParams.searchQuery)}&sortBy=${encodeURIComponent(searchParams.sortOption)}&ascending=${searchParams.ascending}&page=${searchParams.page}&itemsPerPage=${searchParams.itemsPerPage}`;
        if (searchParams.filters && Object.keys(searchParams.filters).length > 0) {
            const filtersJson = JSON.stringify(searchParams.filters);
            const encodedFilters = encodeURIComponent(filtersJson);
            url += `&filters=${encodedFilters}`;
        }

        // Check in cache
        let cacheKey = this.cachingService.createCacheKey('client-orders', entityId, searchParams);
        if (this.cachingService.isCached(cacheKey) && !this.cachingService.isStale(cacheKey)) {
            console.log("Cache hit", cacheKey);
            return new Observable((observer) => {
                observer.next(this.cachingService.getFromCache(cacheKey));
                observer.complete();
            });
        }

        // Hit endpoint
        const STALE_TIME = 300000; // 5 minutes

        return this.http.get<PaginatedResults<ClientOrder>>(url).pipe(
            catchError(error => {
                // Pass error through without caching
                console.error("Error fetching clientOrders:", error);
                this.errorHandlerService.handleError(error);
                return throwError(() => error);
            }),
            tap(data => {
                // Cache results on successful fetch
                this.cachingService.addToCache(cacheKey, data, STALE_TIME); 
            })
        );
    }

    getClientOrderById(id: number): Observable<ClientOrder> {
        return this.http
            .get<ClientOrder>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    
    createClientOrder(clientOrderDTO: CreateClientOrderDTO): Observable<ClientOrder> {
        return this.http.post<ClientOrder>(`${this.apiUrl}/create`, clientOrderDTO).pipe(
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

    createClientOrdersInBulk(orderDTOs: CreateClientOrderDTO[]): Observable<ClientOrder[]> {
        return this.http.post<ClientOrder[]>(`${this.apiUrl}/create/bulk`, orderDTOs).pipe(
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
        
    updateClientOrder(clientOrderDTO: UpdateClientOrderDTO): Observable<ClientOrder> {
        return this.http.put<ClientOrder>(`${this.apiUrl}/update`, clientOrderDTO);
    }

    updateClientOrdersInBulk(orderDTOs: UpdateClientOrderDTO[]): Observable<ClientOrder[]> {
        return this.http.put<ClientOrder[]>(`${this.apiUrl}/update/bulk`, orderDTOs).pipe(
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

    deleteClientOrder(clientOrderId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${clientOrderId}`);
    }

    deleteClientOrdersInBulk(clientOrderIds: number[]): Observable<number[]> {
        const options = {
            body: clientOrderIds,
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
