import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { CreateRouteDTO, ResourceTransportRoute, UpdateRouteDTO } from '../models/TransportRoute';
import { PaginatedResults, SearchParams } from '../../../shared/search/models/searchTypes';
import { CachingService } from '../../../shared/search/services/caching.service';

@Injectable({
    providedIn: 'root',
})
export class TransportRouteService {
    private readonly apiUrl = 'http://localhost:8080/api/v1/resource-transport-routes';
    private readonly STALE_TIME = 300000; // 5 minutes

    constructor(
        private readonly http: HttpClient,
        private readonly errorHandlerService: ErrorHandlerService,
        private readonly cachingService: CachingService<PaginatedResults<ResourceTransportRoute>>
    ) {}

    getResourceTransportRoutesByOrganizationId(organizationId: number): Observable<ResourceTransportRoute[]> {
        return this.http
            .get<ResourceTransportRoute[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }
    
    getResourceTransportRoutesByOrganizationIdAdvanced(organizationId: number, searchParams: SearchParams): Observable<PaginatedResults<ResourceTransportRoute>> {
        let url = `${this.apiUrl}/organization/advanced/${organizationId}?searchQuery=${encodeURIComponent(searchParams.searchQuery)}&sortBy=${encodeURIComponent(searchParams.sortOption)}&ascending=${searchParams.ascending}&page=${searchParams.page}&itemsPerPage=${searchParams.itemsPerPage}`;
        if (searchParams.filters && Object.keys(searchParams.filters).length > 0) {
            const filtersJson = JSON.stringify(searchParams.filters);
            const encodedFilters = encodeURIComponent(filtersJson);
            url += `&filters=${encodedFilters}`;
        }

        // Check in cache
        let cacheKey = this.cachingService.createCacheKey('resource-transport-routes', organizationId, searchParams);
        if (this.cachingService.isCached(cacheKey) && !this.cachingService.isStale(cacheKey)) {
            console.log("Cache hit", cacheKey);
            return new Observable((observer) => {
                observer.next(this.cachingService.getFromCache(cacheKey));
                observer.complete();
            });
        }

        // Hit endpoint

        return this.http.get<PaginatedResults<ResourceTransportRoute>>(url).pipe(
            catchError(error => {
                // Pass error through without caching
                console.error("Error fetching clientOrders:", error);
                this.errorHandlerService.handleError(error);
                return throwError(() => error);
            }),
            tap(data => {
                // Cache results on successful fetch
                this.cachingService.addToCache(cacheKey, data, this.STALE_TIME); 
            })
        );
    }

    createRoute(routeDTO: CreateRouteDTO): Observable<ResourceTransportRoute> {
        return this.http
            .post<ResourceTransportRoute>(`${this.apiUrl}/create`, routeDTO)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    updateRoute(routeDTO: UpdateRouteDTO): Observable<ResourceTransportRoute> {
        return this.http
            .put<ResourceTransportRoute>(`${this.apiUrl}/update`, routeDTO)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    deleteRouteById(routeId: number): Observable<void> {
        return this.http
            .delete<void>(`${this.apiUrl}/delete/${routeId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }
}
