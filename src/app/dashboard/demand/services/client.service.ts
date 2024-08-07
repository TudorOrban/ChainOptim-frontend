import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from '../../../shared/search/models/PaginatedResults';
import { CachingService } from '../../../shared/search/services/caching.service';
import { Client } from '../models/client';

@Injectable({
    providedIn: 'root',
})
export class ClientService {
    private apiUrl = 'http://localhost:8080/api/v1/clients';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private cachingService: CachingService<PaginatedResults<Client>>
    ) {}

    getClientsByOrganizationId(organizationId: number): Observable<Client[]> {
        return this.http
            .get<Client[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getClientsByOrganizationIdAdvanced(
        organizationId: number,
        searchQuery: string,
        sortOption: string,
        ascending: boolean,
        page: number,
        itemsPerPage: number
    ): Observable<PaginatedResults<Client>> {
        let url = `${this.apiUrl}/organization/advanced/${organizationId}?searchQuery=${encodeURIComponent(searchQuery)}&sortBy=${encodeURIComponent(sortOption)}&ascending=${ascending}&page=${page}&itemsPerPage=${itemsPerPage}`;
        
        // Check in cache
        let cacheKey = this.cachingService.createCacheKey('clients', organizationId, { searchQuery, sortOption, ascending, page, itemsPerPage });
        if (this.cachingService.isCached(cacheKey) && !this.cachingService.isStale(cacheKey)) {
            console.log("Cache hit", cacheKey);
            return new Observable((observer) => {
                observer.next(this.cachingService.getFromCache(cacheKey));
                observer.complete();
            });
        }

        // Hit endpoint
        const STALE_TIME = 300000; // 5 minutes

        return this.http.get<PaginatedResults<Client>>(url).pipe(
            catchError(error => {
                // Pass error through without caching
                console.error("Error fetching clients:", error);
                this.errorHandlerService.handleError(error);
                return throwError(() => error);
            }),
            tap(data => {
                // Cache results on successful fetch
                this.cachingService.addToCache(cacheKey, data, STALE_TIME); 
            })
        );
    }

    getClientById(id: number): Observable<Client> {
        return this.http
            .get<Client>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }
    

    // createClient(client: CreateClientDTO): Observable<CreateClientDTO> {
    //     return this.http.post<CreateClientDTO>(this.apiUrl, client);
    // }


    // getAllClients(): Observable<Client[]> {
    //     return this.http.get<Client[]>(this.apiUrl);
    // }

    // updateClient(client: Client): Observable<Client> {
    //     return this.http.put<Client>(this.apiUrl, client);
    // }

    // deleteClient(id: number): Observable<void> {
    //     return this.http.delete<void>(`${this.apiUrl}/${id}`);
    // }
}
