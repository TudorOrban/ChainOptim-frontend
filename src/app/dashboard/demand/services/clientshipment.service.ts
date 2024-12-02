import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CreateClientShipmentDTO, ClientShipment, UpdateClientShipmentDTO } from '../models/ClientShipment';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { CachingService } from '../../../shared/search/services/caching.service';
import { SearchParams, PaginatedResults } from '../../../shared/search/models/searchTypes';
import { SearchMode } from '../../../shared/enums/commonEnums';

@Injectable({
    providedIn: 'root',
})
export class ClientShipmentService {
    private readonly apiUrl = 'http://localhost:8080/api/v1/client-shipments';

    constructor(
        private readonly http: HttpClient,
        private readonly errorHandlerService: ErrorHandlerService,
        private readonly cachingService: CachingService<PaginatedResults<ClientShipment>>
    ) {}

    getClientShipmentsByOrganizationId(organizationId: number): Observable<ClientShipment[]> {
        return this.http
            .get<ClientShipment[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getClientShipmentsByOrganizationIdAdvanced(
        entityId: number,
        searchParams: SearchParams,
        searchMode: SearchMode
    ): Observable<PaginatedResults<ClientShipment>> {
        let url = `${this.apiUrl}/${searchMode === SearchMode.ORGANIZATION ? "organization" : "client"}/advanced/${entityId}?searchQuery=${encodeURIComponent(searchParams.searchQuery)}&sortBy=${encodeURIComponent(searchParams.sortOption)}&ascending=${searchParams.ascending}&page=${searchParams.page}&itemsPerPage=${searchParams.itemsPerPage}`;
        if (searchParams.filters && Object.keys(searchParams.filters).length > 0) {
            const filtersJson = JSON.stringify(searchParams.filters);
            const encodedFilters = encodeURIComponent(filtersJson);
            url += `&filters=${encodedFilters}`;
        }

        // Check in cache
        let cacheKey = this.cachingService.createCacheKey('client-shipments', entityId, searchParams);
        if (this.cachingService.isCached(cacheKey) && !this.cachingService.isStale(cacheKey)) {
            console.log("Cache hit", cacheKey);
            return new Observable((observer) => {
                observer.next(this.cachingService.getFromCache(cacheKey));
                observer.complete();
            });
        }

        // Hit endpoint
        const STALE_TIME = 300000; // 5 minutes

        return this.http.get<PaginatedResults<ClientShipment>>(url).pipe(
            catchError(error => {
                // Pass error through without caching
                console.error("Error fetching clientShipments:", error);
                this.errorHandlerService.handleError(error);
                return throwError(() => error);
            }),
            tap(data => {
                // Cache results on successful fetch
                this.cachingService.addToCache(cacheKey, data, STALE_TIME); 
            })
        );
    }

    getClientShipmentById(id: number): Observable<ClientShipment> {
        return this.http
            .get<ClientShipment>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    
    createClientShipment(clientShipmentDTO: CreateClientShipmentDTO): Observable<ClientShipment> {
        return this.http.post<ClientShipment>(`${this.apiUrl}/create`, clientShipmentDTO).pipe(
            tap(shipment => {
                console.log("Created shipment:", shipment);
                if (!shipment.id) {
                    throw new Error("Shipment creation failed: No ID found");
                }
                this.cachingService.invalidateAllCache();
            }),
            catchError(error => {
                console.error("Error in creating shipment", error);
                throw error;
            })
        );
    }

    createClientShipmentsInBulk(shipmentDTOs: CreateClientShipmentDTO[]): Observable<ClientShipment[]> {
        return this.http.post<ClientShipment[]>(`${this.apiUrl}/create/bulk`, shipmentDTOs).pipe(
            tap(shipments => {
                console.log("Created shipments:", shipments);
                if (shipments.length === 0) {
                    throw new Error("Shipment creation failed: No shipments created");
                }
                this.cachingService.invalidateAllCache();
            }),
            catchError(error => {
                console.error("Error in creating shipments", error);
                throw error;
            })
        );
    }
        
    updateClientShipment(clientShipmentDTO: UpdateClientShipmentDTO): Observable<ClientShipment> {
        return this.http.put<ClientShipment>(`${this.apiUrl}/update`, clientShipmentDTO);
    }

    updateClientShipmentsInBulk(shipmentDTOs: UpdateClientShipmentDTO[]): Observable<ClientShipment[]> {
        return this.http.put<ClientShipment[]>(`${this.apiUrl}/update/bulk`, shipmentDTOs).pipe(
            tap(shipments => {
                console.log("Updated shipments:", shipments);
                if (shipments.length === 0) {
                    throw new Error("Shipment update failed: No shipments updated");
                }
                this.cachingService.invalidateAllCache();
            }),
            catchError(error => {
                console.error("Error in updating shipments", error);
                throw error;
            })
        );
    }

    deleteClientShipment(clientShipmentId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${clientShipmentId}`);
    }

    deleteClientShipmentsInBulk(clientShipmentIds: number[]): Observable<number[]> {
        const options = {
            body: clientShipmentIds,
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.delete<number[]>(`${this.apiUrl}/delete/bulk`, options).pipe(
            tap(shipments => {
                console.log("Deleted shipments:", shipments);
                if (shipments.length === 0) {
                    throw new Error("Shipment deletion failed: No shipments deleted");
                }
                this.cachingService.invalidateAllCache();
            }),
            catchError(error => {
                console.error("Error in deleting shipments", error);
                throw error;
            })
        );
    }
    
}
