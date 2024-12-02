import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CreateSupplierDTO, Supplier, SupplierOverviewDTO, UpdateSupplierDTO } from '../models/Supplier';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from "../../../shared/search/models/searchTypes";
import { CachingService } from '../../../shared/search/services/caching.service';

@Injectable({
    providedIn: 'root',
})
export class SupplierService {
    private readonly apiUrl = 'http://localhost:8080/api/v1/suppliers';

    constructor(
        private readonly http: HttpClient,
        private readonly errorHandlerService: ErrorHandlerService,
        private readonly cachingService: CachingService<PaginatedResults<Supplier>>
    ) {}

    getSuppliersByOrganizationId(organizationId: number): Observable<Supplier[]> {
        return this.http
            .get<Supplier[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getSuppliersByOrganizationIdAdvanced(
        organizationId: number,
        searchQuery: string,
        sortOption: string,
        ascending: boolean,
        page: number,
        itemsPerPage: number
    ): Observable<PaginatedResults<Supplier>> {
        let url = `${this.apiUrl}/organization/advanced/${organizationId}?searchQuery=${encodeURIComponent(searchQuery)}&sortBy=${encodeURIComponent(sortOption)}&ascending=${ascending}&page=${page}&itemsPerPage=${itemsPerPage}`;
        
        // Check in cache
        let cacheKey = this.cachingService.createCacheKey('suppliers', organizationId, { searchQuery, sortOption, ascending, page, itemsPerPage });
        if (this.cachingService.isCached(cacheKey) && !this.cachingService.isStale(cacheKey)) {
            console.log("Cache hit", cacheKey);
            return new Observable((observer) => {
                observer.next(this.cachingService.getFromCache(cacheKey));
                observer.complete();
            });
        }

        // Hit endpoint
        const STALE_TIME = 300000; // 5 minutes

        return this.http.get<PaginatedResults<Supplier>>(url).pipe(
            catchError(error => {
                // Pass error through without caching
                console.error("Error fetching suppliers:", error);
                this.errorHandlerService.handleError(error);
                return throwError(() => error);
            }),
            tap(data => {
                // Cache results on successful fetch
                this.cachingService.addToCache(cacheKey, data, STALE_TIME); 
            })
        );
    }

    getSupplierById(id: number): Observable<Supplier> {
        return this.http
            .get<Supplier>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getSupplierOverview(id: number): Observable<SupplierOverviewDTO> {
        return this.http
            .get<SupplierOverviewDTO>(`${this.apiUrl}/${id}/overview`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    createSupplier(supplierDTO: CreateSupplierDTO): Observable<Supplier> {
        return this.http.post<Supplier>(`${this.apiUrl}/create`, supplierDTO);
    }
        
    updateSupplier(supplierDTO: UpdateSupplierDTO): Observable<Supplier> {
        return this.http.put<Supplier>(`${this.apiUrl}/update`, supplierDTO);
    }

    deleteSupplier(supplierId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${supplierId}`);
    }
}
