import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from '../../../shared/search/models/PaginatedResults';
import { CachingService } from '../../../shared/search/services/caching.service';
import { Component, CreateComponentDTO, UpdateComponentDTO } from '../models/Component';

@Injectable({
    providedIn: 'root',
})
export class ComponentService {
    private apiUrl = 'http://localhost:8080/api/v1/components';
    // private currentComponentSubject = new BehaviorSubject<Component | null>(null);

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private cachingService: CachingService<PaginatedResults<Component>>
    ) {}

    getComponentsByOrganizationId(organizationId: number, small: boolean): Observable<Component[]> {
        return this.http
            .get<Component[]>(`${this.apiUrl}/organization/${organizationId}${small ? '/small' : ''}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getComponentsByOrganizationIdAdvanced(
        organizationId: number,
        searchQuery: string,
        sortOption: string,
        ascending: boolean,
        page: number,
        itemsPerPage: number
    ): Observable<PaginatedResults<Component>> {
        let url = `${this.apiUrl}/organization/advanced/${organizationId}?searchQuery=${encodeURIComponent(searchQuery)}&sortBy=${encodeURIComponent(sortOption)}&ascending=${ascending}&page=${page}&itemsPerPage=${itemsPerPage}`;
        
        // Check in cache
        let cacheKey = this.cachingService.createCacheKey('components', organizationId, { searchQuery, sortOption, ascending, page, itemsPerPage });
        if (this.cachingService.isCached(cacheKey) && !this.cachingService.isStale(cacheKey)) {
            console.log("Cache hit", cacheKey);
            return new Observable((observer) => {
                observer.next(this.cachingService.getFromCache(cacheKey));
                observer.complete();
            });
        }

        // Hit endpoint
        const STALE_TIME = 300000; // 5 minutes

        return this.http.get<PaginatedResults<Component>>(url).pipe(
            catchError(error => {
                // Pass error through without caching
                console.error("Error fetching components:", error);
                this.errorHandlerService.handleError(error);
                return throwError(() => error);
            }),
            tap(data => {
                // Cache results on successful fetch
                this.cachingService.addToCache(cacheKey, data, STALE_TIME); 
            })
        );
    }

    getComponentById(id: number): Observable<Component> {
        return this.http
            .get<Component>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    createComponent(componentDTO: CreateComponentDTO): Observable<Component> {
        return this.http.post<Component>(`${this.apiUrl}/create`, componentDTO);
    }
        
    updateComponent(componentDTO: UpdateComponentDTO): Observable<Component> {
        return this.http.put<Component>(`${this.apiUrl}/update`, componentDTO);
    }

    deleteComponent(componentId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${componentId}`);
    }
}
