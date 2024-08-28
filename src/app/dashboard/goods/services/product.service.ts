import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { CreateProductDTO, Product, ProductOverviewDTO, UpdateProductDTO } from '../models/Product';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from "../../../shared/search/models/searchTypes";
import { CachingService } from '../../../shared/search/services/caching.service';
import { StandardUnit, UnitMagnitude } from '../../../shared/enums/unitEnums';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private apiUrl = 'http://localhost:8080/api/v1/products';
    // private currentProductSubject = new BehaviorSubject<Product | null>(null);

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private cachingService: CachingService<PaginatedResults<Product>>
    ) {}

    getProductsByOrganizationId(organizationId: number, small: boolean): Observable<Product[]> {
        return this.http
            .get<Product[]>(`${this.apiUrl}/organization/${organizationId}${small ? '/small' : ''}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getProductsByOrganizationIdAdvanced(
        organizationId: number,
        searchQuery: string,
        sortOption: string,
        ascending: boolean,
        page: number,
        itemsPerPage: number
    ): Observable<PaginatedResults<Product>> {
        let url = `${this.apiUrl}/organization/advanced/${organizationId}?searchQuery=${encodeURIComponent(searchQuery)}&sortBy=${encodeURIComponent(sortOption)}&ascending=${ascending}&page=${page}&itemsPerPage=${itemsPerPage}`;
        
        // Check in cache
        let cacheKey = this.cachingService.createCacheKey('products', organizationId, { searchQuery, sortOption, ascending, page, itemsPerPage });
        if (this.cachingService.isCached(cacheKey) && !this.cachingService.isStale(cacheKey)) {
            console.log("Cache hit", cacheKey);
            return new Observable((observer) => {
                observer.next(this.cachingService.getFromCache(cacheKey));
                observer.complete();
            });
        }

        // Hit endpoint
        const STALE_TIME = 300000; // 5 minutes

        return this.http.get<PaginatedResults<Product>>(url).pipe(
            catchError(error => {
                // Pass error through without caching
                console.error("Error fetching products:", error);
                this.errorHandlerService.handleError(error);
                return throwError(() => error);
            }),
            tap(data => {
                // Cache results on successful fetch
                this.cachingService.addToCache(cacheKey, data, STALE_TIME); 
            })
        );
    }

    getProductById(id: number): Observable<Product> {
        return this.http
            .get<Product>(`${this.apiUrl}/${id}/stages`)
            .pipe(
                // map(product => {
                //     console.log('PRODUCT', product);
                //     if (product.unit) {
                //         console.log('UNIT', product.unit);
                //         const standardUnitInstance = StandardUnit.fromName(product.unit.standardUnit.name);
                //         const unitMagnitudeInstance = UnitMagnitude.fromName(product.unit.unitMagnitude.name);
    
                //         console.log('STANDARD UNIT', standardUnitInstance);
                //         if (standardUnitInstance && unitMagnitudeInstance) {
                //             // Assuming unit might be a shallow copy from backend, reassigning instances
                //             product.unit.standardUnit = standardUnitInstance;
                //             product.unit.unitMagnitude = unitMagnitudeInstance;
                //         }
                //     }
                //     return product;
                // }),
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getProductOverview(id: number): Observable<ProductOverviewDTO> {
        return this.http
            .get<ProductOverviewDTO>(`${this.apiUrl}/${id}/overview`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    createProduct(productDTO: CreateProductDTO): Observable<Product> {
        return this.http.post<Product>(`${this.apiUrl}/create`, productDTO);
    }
        
    updateProduct(productDTO: UpdateProductDTO): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/update`, productDTO);
    }

    deleteProduct(productId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${productId}`);
    }
}
