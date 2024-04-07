import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Warehouse } from '../models/Warehouse';
import { PaginatedResults } from '../../../shared/search/models/PaginatedResults';
import { CachingService } from '../../../shared/search/services/caching.service';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';

@Injectable({
    providedIn: 'root',
})
export class WarehouseService {
    private apiUrl = 'http://localhost:8080/api/v1/warehouses';
    // private currentWarehouseSubject = new BehaviorSubject<Warehouse | null>(null);

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private cachingService: CachingService<PaginatedResults<Warehouse>>
    ) {}


    getWarehousesByOrganizationId(organizationId: number): Observable<Warehouse[]> {
        return this.http.get<Warehouse[]>(`${this.apiUrl}/organization/${organizationId}`);
    }

    getWarehousesByOrganizationIdAdvanced(
        organizationId: number,
        searchQuery: string,
        sortOption: string,
        ascending: boolean,
        page: number,
        itemsPerPage: number
    ): Observable<PaginatedResults<Warehouse>> {
        let url = `${this.apiUrl}/organization/advanced/${organizationId}?searchQuery=${encodeURIComponent(searchQuery)}&sortBy=${encodeURIComponent(sortOption)}&ascending=${ascending}&page=${page}&itemsPerPage=${itemsPerPage}`;
        
        // Check in cache
        let cacheKey = this.cachingService.createCacheKey('warehouses', organizationId, { searchQuery, sortOption, ascending, page, itemsPerPage });
        if (this.cachingService.isCached(cacheKey) && !this.cachingService.isStale(cacheKey)) {
            console.log("Cache hit", cacheKey);
            return new Observable((observer) => {
                observer.next(this.cachingService.getFromCache(cacheKey));
                observer.complete();
            });
        }

        // Hit endpoint
        const STALE_TIME = 300000; // 5 minutes

        return this.http.get<PaginatedResults<Warehouse>>(url).pipe(
            catchError(error => {
                // Pass error through without caching
                console.error("Error fetching warehouses:", error);
                this.errorHandlerService.handleError(error);
                return throwError(() => error);
            }),
            tap(data => {
                // Cache results on successful fetch
                this.cachingService.addToCache(cacheKey, data, STALE_TIME); 
            })
        );
    }

    getWarehouseById(id: number): Observable<Warehouse> {
        return this.http.get<Warehouse>(`${this.apiUrl}/${id}`);
    }

    // createWarehouse(warehouse: CreateWarehouseDTO): Observable<CreateWarehouseDTO> {
    //     return this.http.post<CreateWarehouseDTO>(this.apiUrl, warehouse);
    // }
    
    // getAllWarehouses(): Observable<Warehouse[]> {
    //     return this.http.get<Warehouse[]>(this.apiUrl);
    // }

    // updateWarehouse(warehouse: Warehouse): Observable<Warehouse> {
    //     return this.http.put<Warehouse>(this.apiUrl, warehouse);
    // }

    // deleteWarehouse(id: number): Observable<void> {
    //     return this.http.delete<void>(`${this.apiUrl}/${id}`);
    // }

    // // Current warehouse
    // async fetchAndSetCurrentWarehouse(warehouseId: number): Promise<void> {
    //     this.getWarehouseById(warehouseId).subscribe(
    //         (warehouse) => {
    //             this.setCurrentWarehouse(warehouse);
    //         },
    //         (error) => {
    //             console.error('Error fetching warehouse:', error);
    //             this.setCurrentWarehouse(null);
    //         }
    //     );
    // }

    // setCurrentWarehouse(warehouse: Warehouse | null): void {
    //     this.currentWarehouseSubject.next(warehouse);
    // }

    // getCurrentWarehouse(): Observable<Warehouse | null> {
    //     return this.currentWarehouseSubject.asObservable();
    // }
}
