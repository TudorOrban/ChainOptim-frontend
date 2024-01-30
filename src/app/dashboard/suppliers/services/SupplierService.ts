import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Supplier } from '../models/Supplier';

@Injectable({
    providedIn: 'root',
})
export class SupplierService {
    private apiUrl = 'http://localhost:8080/api/suppliers';
    // private currentSupplierSubject = new BehaviorSubject<Supplier | null>(null);

    constructor(private http: HttpClient) {}

    // createSupplier(supplier: CreateSupplierDTO): Observable<CreateSupplierDTO> {
    //     return this.http.post<CreateSupplierDTO>(this.apiUrl, supplier);
    // }

    getSuppliersByOrganizationId(organizationId: number): Observable<Supplier[]> {
        return this.http.get<Supplier[]>(`${this.apiUrl}/organization/${organizationId}`);
    }

    getSupplierById(id: number): Observable<Supplier> {
        return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
    }

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
