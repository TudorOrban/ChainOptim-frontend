import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CreateWarehouseDTO, Warehouse, UpdateWarehouseDTO } from '../models/Warehouse';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from '../../../shared/search/models/PaginatedResults';
import { CachingService } from '../../../shared/search/services/caching.service';

@Injectable({
    providedIn: 'root',
})
export class WarehouseService {
    private apiUrl = 'http://localhost:8080/api/v1/warehouses';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private cachingService: CachingService<PaginatedResults<Warehouse>>
    ) {}

    getWarehousesByOrganizationId(organizationId: number): Observable<Warehouse[]> {
        return this.http
            .get<Warehouse[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
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
        return this.http
            .get<Warehouse>(`${this.apiUrl}/${id}/stages`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    createWarehouse(warehouseDTO: CreateWarehouseDTO): Observable<Warehouse> {
        return this.http.post<Warehouse>(`${this.apiUrl}/create`, warehouseDTO);
    }
        
    updateWarehouse(warehouseDTO: UpdateWarehouseDTO): Observable<Warehouse> {
        return this.http.put<Warehouse>(`${this.apiUrl}/update`, warehouseDTO);
    }

    deleteWarehouse(warehouseId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${warehouseId}`);
    }
}
