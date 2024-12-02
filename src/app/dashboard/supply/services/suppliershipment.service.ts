import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CreateSupplierShipmentDTO, SupplierShipment, UpdateSupplierShipmentDTO } from '../models/SupplierShipment';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults, SearchParams } from "../../../shared/search/models/searchTypes";
import { CachingService } from '../../../shared/search/services/caching.service';
import { SearchMode } from '../../../shared/enums/commonEnums';

@Injectable({
    providedIn: 'root',
})
export class SupplierShipmentService {
    private readonly apiUrl = 'http://localhost:8080/api/v1/supplier-shipments';

    constructor(
        private readonly http: HttpClient,
        private readonly errorHandlerService: ErrorHandlerService,
        private readonly cachingService: CachingService<PaginatedResults<SupplierShipment>>
    ) {}

    getSupplierShipmentsByOrganizationId(organizationId: number): Observable<SupplierShipment[]> {
        return this.http
            .get<SupplierShipment[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getSupplierShipmentsByOrganizationIdAdvanced(
        entityId: number,
        searchParams: SearchParams,
        searchMode: SearchMode
    ): Observable<PaginatedResults<SupplierShipment>> {
        let url = `${this.apiUrl}/${searchMode === SearchMode.ORGANIZATION ? "organization" : "supplier"}/advanced/${entityId}?searchQuery=${encodeURIComponent(searchParams.searchQuery)}&sortBy=${encodeURIComponent(searchParams.sortOption)}&ascending=${searchParams.ascending}&page=${searchParams.page}&itemsPerPage=${searchParams.itemsPerPage}`;
        if (searchParams.filters && Object.keys(searchParams.filters).length > 0) {
            const filtersJson = JSON.stringify(searchParams.filters);
            const encodedFilters = encodeURIComponent(filtersJson);
            url += `&filters=${encodedFilters}`;
        }

        // Check in cache
        let cacheKey = this.cachingService.createCacheKey('supplier-shipments', entityId, searchParams);
        if (this.cachingService.isCached(cacheKey) && !this.cachingService.isStale(cacheKey)) {
            console.log("Cache hit", cacheKey);
            return new Observable((observer) => {
                observer.next(this.cachingService.getFromCache(cacheKey));
                observer.complete();
            });
        }

        // Hit endpoint
        const STALE_TIME = 300000; // 5 minutes

        return this.http.get<PaginatedResults<SupplierShipment>>(url).pipe(
            catchError(error => {
                // Pass error through without caching
                console.error("Error fetching supplierShipments:", error);
                this.errorHandlerService.handleError(error);
                return throwError(() => error);
            }),
            tap(data => {
                // Cache results on successful fetch
                this.cachingService.addToCache(cacheKey, data, STALE_TIME); 
            })
        );
    }

    getSupplierShipmentById(id: number): Observable<SupplierShipment> {
        return this.http
            .get<SupplierShipment>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    
    createSupplierShipment(supplierShipmentDTO: CreateSupplierShipmentDTO): Observable<SupplierShipment> {
        return this.http.post<SupplierShipment>(`${this.apiUrl}/create`, supplierShipmentDTO).pipe(
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

    createSupplierShipmentsInBulk(shipmentDTOs: CreateSupplierShipmentDTO[]): Observable<SupplierShipment[]> {
        return this.http.post<SupplierShipment[]>(`${this.apiUrl}/create/bulk`, shipmentDTOs).pipe(
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
        
    updateSupplierShipment(supplierShipmentDTO: UpdateSupplierShipmentDTO): Observable<SupplierShipment> {
        return this.http.put<SupplierShipment>(`${this.apiUrl}/update`, supplierShipmentDTO);
    }

    updateSupplierShipmentsInBulk(shipmentDTOs: UpdateSupplierShipmentDTO[]): Observable<SupplierShipment[]> {
        return this.http.put<SupplierShipment[]>(`${this.apiUrl}/update/bulk`, shipmentDTOs).pipe(
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

    deleteSupplierShipment(supplierShipmentId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${supplierShipmentId}`);
    }

    deleteSupplierShipmentsInBulk(supplierShipmentIds: number[]): Observable<number[]> {
        const options = {
            body: supplierShipmentIds,
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
