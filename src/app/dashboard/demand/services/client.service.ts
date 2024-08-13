import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CreateClientDTO, Client, UpdateClientDTO, ClientOverviewDTO } from '../models/Client';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from "../../../shared/search/models/searchTypes";
import { CachingService } from '../../../shared/search/services/caching.service';

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

    getClientOverview(id: number): Observable<ClientOverviewDTO> {
        return this.http
            .get<ClientOverviewDTO>(`${this.apiUrl}/${id}/overview`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    createClient(clientDTO: CreateClientDTO): Observable<Client> {
        return this.http.post<Client>(`${this.apiUrl}/create`, clientDTO);
    }
        
    updateClient(clientDTO: UpdateClientDTO): Observable<Client> {
        return this.http.put<Client>(`${this.apiUrl}/update`, clientDTO);
    }

    deleteClient(clientId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${clientId}`);
    }
}
