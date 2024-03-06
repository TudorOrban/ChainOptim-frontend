import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Product } from '../models/Product';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { PaginatedResults } from '../../../shared/search/models/PaginatedResults';
import { CachingService } from '../../../shared/search/services/CachingService';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private apiUrl = 'http://localhost:8080/api/products';
    // private currentProductSubject = new BehaviorSubject<Product | null>(null);

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
        private cachingService: CachingService<PaginatedResults<Product>>
    ) {}

    getProductsByOrganizationId(organizationId: number): Observable<Product[]> {
        return this.http
            .get<Product[]>(`${this.apiUrl}/organizations/${organizationId}`)
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
        let url = `${this.apiUrl}/organizations/advanced/${organizationId}?searchQuery=${encodeURIComponent(searchQuery)}&sortBy=${encodeURIComponent(sortOption)}&ascending=${ascending}&page=${page}&itemsPerPage=${itemsPerPage}`;
        
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
            .get<Product>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }
    

    // createProduct(product: CreateProductDTO): Observable<CreateProductDTO> {
    //     return this.http.post<CreateProductDTO>(this.apiUrl, product);
    // }


    // getAllProducts(): Observable<Product[]> {
    //     return this.http.get<Product[]>(this.apiUrl);
    // }

    // updateProduct(product: Product): Observable<Product> {
    //     return this.http.put<Product>(this.apiUrl, product);
    // }

    // deleteProduct(id: number): Observable<void> {
    //     return this.http.delete<void>(`${this.apiUrl}/${id}`);
    // }

    // // Current product
    // async fetchAndSetCurrentProduct(productId: number): Promise<void> {
    //     this.getProductById(productId).subscribe(
    //         (product) => {
    //             this.setCurrentProduct(product);
    //         },
    //         (error) => {
    //             console.error('Error fetching product:', error);
    //             this.setCurrentProduct(null);
    //         }
    //     );
    // }

    // setCurrentProduct(product: Product | null): void {
    //     this.currentProductSubject.next(product);
    // }

    // getCurrentProduct(): Observable<Product | null> {
    //     return this.currentProductSubject.asObservable();
    // }
}
