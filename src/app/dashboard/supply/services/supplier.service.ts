import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { PaginatedResults } from '../../../shared/search/models/PaginatedResults';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { CachingService } from '../../../shared/search/services/caching.service';
import { Supplier } from '../models/Supplier';

@Injectable({
    providedIn: 'root',
})
export class SupplierService {
    private apiUrl = 'http://localhost:8080/api/v1/suppliers';
    // private currentSupplierSubject = new BehaviorSubject<Supplier | null>(null);

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private cachingService: CachingService<PaginatedResults<Supplier>>
    ) {}

    getSuppliersByOrganizationId(organizationId: number): Observable<Supplier[]> {
        return this.http.get<Supplier[]>(`${this.apiUrl}/organization/${organizationId}`);
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
        return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
    }

    // createSupplier(supplier: CreateSupplierDTO): Observable<CreateSupplierDTO> {
    //     return this.http.post<CreateSupplierDTO>(this.apiUrl, supplier);
    // }

    // getAllSuppliers(): Observable<Supplier[]> {
    //     return this.http.get<Supplier[]>(this.apiUrl);
    // }

    // updateSupplier(supplier: Supplier): Observable<Supplier> {
    //     return this.http.put<Supplier>(this.apiUrl, supplier);
    // }

    // deleteSupplier(id: number): Observable<void> {
    //     return this.http.delete<void>(`${this.apiUrl}/${id}`);
    // }

    // // Current supplier
    // async fetchAndSetCurrentSupplier(supplierId: number): Promise<void> {
    //     this.getSupplierById(supplierId).subscribe(
    //         (supplier) => {
    //             this.setCurrentSupplier(supplier);
    //         },
    //         (error) => {
    //             console.error('Error fetching supplier:', error);
    //             this.setCurrentSupplier(null);
    //         }
    //     );
    // }

    // setCurrentSupplier(supplier: Supplier | null): void {
    //     this.currentSupplierSubject.next(supplier);
    // }

    // getCurrentSupplier(): Observable<Supplier | null> {
    //     return this.currentSupplierSubject.asObservable();
    // }
}
