import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/Product';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private apiUrl = 'http://localhost:8080/api/products';
    // private currentProductSubject = new BehaviorSubject<Product | null>(null);

    constructor(private http: HttpClient) {}

    // createProduct(product: CreateProductDTO): Observable<CreateProductDTO> {
    //     return this.http.post<CreateProductDTO>(this.apiUrl, product);
    // }

    getProductsByOrganizationId(organizationId: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/organizations/${organizationId}`);
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

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
