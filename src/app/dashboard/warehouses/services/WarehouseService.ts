import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Warehouse } from '../models/Warehouse';

@Injectable({
    providedIn: 'root',
})
export class WarehouseService {
    private apiUrl = 'http://localhost:8080/api/warehouses';
    // private currentWarehouseSubject = new BehaviorSubject<Warehouse | null>(null);

    constructor(private http: HttpClient) {}


    getWarehousesByOrganizationId(organizationId: number): Observable<Warehouse[]> {
        return this.http.get<Warehouse[]>(`${this.apiUrl}/organization/${organizationId}`);
    }

    getWarehouseById(id: number): Observable<Warehouse> {
        return this.http.get<Warehouse>(`${this.apiUrl}/${id}`);
    }

    // createWarehouse(warehouse: CreateWarehouseDTO): Observable<CreateWarehouseDTO> {
    //     return this.http.post<CreateWarehouseDTO>(this.apiUrl, warehouse);
    // }
    
    // getAllWarehouses(): Observable<Warehouse[]> {
    //     return this.http.get<Warehouse[]>(this.apiUrl);
    // }

    // updateWarehouse(warehouse: Warehouse): Observable<Warehouse> {
    //     return this.http.put<Warehouse>(this.apiUrl, warehouse);
    // }

    // deleteWarehouse(id: number): Observable<void> {
    //     return this.http.delete<void>(`${this.apiUrl}/${id}`);
    // }

    // // Current warehouse
    // async fetchAndSetCurrentWarehouse(warehouseId: number): Promise<void> {
    //     this.getWarehouseById(warehouseId).subscribe(
    //         (warehouse) => {
    //             this.setCurrentWarehouse(warehouse);
    //         },
    //         (error) => {
    //             console.error('Error fetching warehouse:', error);
    //             this.setCurrentWarehouse(null);
    //         }
    //     );
    // }

    // setCurrentWarehouse(warehouse: Warehouse | null): void {
    //     this.currentWarehouseSubject.next(warehouse);
    // }

    // getCurrentWarehouse(): Observable<Warehouse | null> {
    //     return this.currentWarehouseSubject.asObservable();
    // }
}
