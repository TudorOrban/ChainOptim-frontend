import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Factory } from '../models/Factory';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from '../../../shared/search/models/PaginatedResults';
import { CachingService } from '../../../shared/search/services/caching.service';

@Injectable({
    providedIn: 'root',
})
export class FactoryService {
    private apiUrl = 'http://localhost:8080/api/v1/factories';
    
    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private cachingService: CachingService<PaginatedResults<Factory>>
    ) {}

    getFactoriesByOrganizationId(
        organizationId: number
    ): Observable<Factory[]> {
        return this.http
            .get<Factory[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getFactoriesByOrganizationIdAdvanced(
        organizationId: number,
        searchQuery: string,
        sortOption: string,
        ascending: boolean,
        page: number,
        itemsPerPage: number
    ): Observable<PaginatedResults<Factory>> {
        let url = `${this.apiUrl}/organization/advanced/${organizationId}?searchQuery=${encodeURIComponent(searchQuery)}&sortBy=${encodeURIComponent(sortOption)}&ascending=${ascending}&page=${page}&itemsPerPage=${itemsPerPage}`;
        
        // Check in cache
        let cacheKey = this.cachingService.createCacheKey('factories', organizationId, { searchQuery, sortOption, ascending, page, itemsPerPage });
        if (this.cachingService.isCached(cacheKey) && !this.cachingService.isStale(cacheKey)) {
            console.log("Cache hit", cacheKey);
            return new Observable((observer) => {
                observer.next(this.cachingService.getFromCache(cacheKey));
                observer.complete();
            });
        }

        // Hit endpoint
        const STALE_TIME = 300000; // 5 minutes
        
        return this.http.get<PaginatedResults<Factory>>(url).pipe(
            catchError(error => {
                // Pass error through without caching
                console.error("Error fetching factories:", error);
                return throwError(() => error);
            }),
            tap(data => {
                // Cache results on successful fetch
                this.cachingService.addToCache(cacheKey, data, STALE_TIME); 
            })
        );
    }

    // createFactory(factory: CreateFactoryDTO): Observable<CreateFactoryDTO> {
    //     return this.http.post<CreateFactoryDTO>(this.apiUrl, factory);
    // }

    getFactoryById(id: number): Observable<Factory> {
        return this.http
            .get<Factory>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    // getAllFactories(): Observable<Factory[]> {
    //     return this.http.get<Factory[]>(this.apiUrl);
    // }

    // updateFactory(factory: Factory): Observable<Factory> {
    //     return this.http.put<Factory>(this.apiUrl, factory);
    // }

    // deleteFactory(id: number): Observable<void> {
    //     return this.http.delete<void>(`${this.apiUrl}/${id}`);
    // }

    // // Current factory
    // async fetchAndSetCurrentFactory(factoryId: number): Promise<void> {
    //     this.getFactoryById(factoryId).subscribe(
    //         (factory) => {
    //             this.setCurrentFactory(factory);
    //         },
    //         (error) => {
    //             console.error('Error fetching factory:', error);
    //             this.setCurrentFactory(null);
    //         }
    //     );
    // }

    // setCurrentFactory(factory: Factory | null): void {
    //     this.currentFactorySubject.next(factory);
    // }

    // getCurrentFactory(): Observable<Factory | null> {
    //     return this.currentFactorySubject.asObservable();
    // }
}
