import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RawMaterial } from '../models/Product';

@Injectable({
    providedIn: 'root',
})
export class RawMaterialService {
    private apiUrl = 'http://localhost:8080/api/raw-materials';
    // private currentRawMaterialSubject = new BehaviorSubject<RawMaterial | null>(null);

    constructor(private http: HttpClient) {}

    // createRawMaterial(RawMaterial: CreateRawMaterialDTO): Observable<CreateRawMaterialDTO> {
    //     return this.http.post<CreateRawMaterialDTO>(this.apiUrl, RawMaterial);
    // }

    getRawMaterialsByOrganizationId(organizationId: number): Observable<RawMaterial[]> {
        return this.http.get<RawMaterial[]>(`${this.apiUrl}/organizations/${organizationId}`);
    }

    getRawMaterialById(id: number): Observable<RawMaterial> {
        return this.http.get<RawMaterial>(`${this.apiUrl}/${id}`);
    }

    // getAllRawMaterials(): Observable<RawMaterial[]> {
    //     return this.http.get<RawMaterial[]>(this.apiUrl);
    // }

    // updateRawMaterial(RawMaterial: RawMaterial): Observable<RawMaterial> {
    //     return this.http.put<RawMaterial>(this.apiUrl, RawMaterial);
    // }

    // deleteRawMaterial(id: number): Observable<void> {
    //     return this.http.delete<void>(`${this.apiUrl}/${id}`);
    // }

    // // Current RawMaterial
    // async fetchAndSetCurrentRawMaterial(RawMaterialId: number): Promise<void> {
    //     this.getRawMaterialById(RawMaterialId).subscribe(
    //         (RawMaterial) => {
    //             this.setCurrentRawMaterial(RawMaterial);
    //         },
    //         (error) => {
    //             console.error('Error fetching RawMaterial:', error);
    //             this.setCurrentRawMaterial(null);
    //         }
    //     );
    // }

    // setCurrentRawMaterial(RawMaterial: RawMaterial | null): void {
    //     this.currentRawMaterialSubject.next(RawMaterial);
    // }

    // getCurrentRawMaterial(): Observable<RawMaterial | null> {
    //     return this.currentRawMaterialSubject.asObservable();
    // }
}
