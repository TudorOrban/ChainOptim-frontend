import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Component } from '../models/Product';

@Injectable({
    providedIn: 'root',
})
export class ComponentService {
    private apiUrl = 'http://localhost:8080/api/v1/components';
    // private currentComponentSubject = new BehaviorSubject<Component | null>(null);

    constructor(private http: HttpClient) {}

    // createComponent(component: CreateComponentDTO): Observable<CreateComponentDTO> {
    //     return this.http.post<CreateComponentDTO>(this.apiUrl, component);
    // }

    getComponentsByOrganizationId(organizationId: number): Observable<Component[]> {
        return this.http.get<Component[]>(`${this.apiUrl}/organization/${organizationId}`);
    }

    getComponentById(id: number): Observable<Component> {
        return this.http.get<Component>(`${this.apiUrl}/${id}`);
    }

    // getAllComponents(): Observable<Component[]> {
    //     return this.http.get<Component[]>(this.apiUrl);
    // }

    // updateComponent(component: Component): Observable<Component> {
    //     return this.http.put<Component>(this.apiUrl, component);
    // }

    // deleteComponent(id: number): Observable<void> {
    //     return this.http.delete<void>(`${this.apiUrl}/${id}`);
    // }

    // // Current component
    // async fetchAndSetCurrentComponent(componentId: number): Promise<void> {
    //     this.getComponentById(componentId).subscribe(
    //         (component) => {
    //             this.setCurrentComponent(component);
    //         },
    //         (error) => {
    //             console.error('Error fetching component:', error);
    //             this.setCurrentComponent(null);
    //         }
    //     );
    // }

    // setCurrentComponent(component: Component | null): void {
    //     this.currentComponentSubject.next(component);
    // }

    // getCurrentComponent(): Observable<Component | null> {
    //     return this.currentComponentSubject.asObservable();
    // }
}
