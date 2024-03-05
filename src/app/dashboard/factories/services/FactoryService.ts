import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { Factory } from '../models/Factory';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';

@Injectable({
    providedIn: 'root',
})
export class FactoryService {
    private apiUrl = 'http://localhost:8080/api/factories';
    // private currentFactorySubject = new BehaviorSubject<Factory | null>(null);

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService
    ) {}

    // createFactory(factory: CreateFactoryDTO): Observable<CreateFactoryDTO> {
    //     return this.http.post<CreateFactoryDTO>(this.apiUrl, factory);
    // }

    getFactoriesByOrganizationId(
        organizationId: number
    ): Observable<Factory[]> {
        return this.http
            .get<Factory[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getFactoryById(id: number): Observable<Factory> {
        return this.http
            .get<Factory>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    // getAllFactories(): Observable<Factory[]> {
    //     return this.http.get<Factory[]>(this.apiUrl);
    // }

    // updateFactory(factory: Factory): Observable<Factory> {
    //     return this.http.put<Factory>(this.apiUrl, factory);
    // }

    // deleteFactory(id: number): Observable<void> {
    //     return this.http.delete<void>(`${this.apiUrl}/${id}`);
    // }

    // // Current factory
    // async fetchAndSetCurrentFactory(factoryId: number): Promise<void> {
    //     this.getFactoryById(factoryId).subscribe(
    //         (factory) => {
    //             this.setCurrentFactory(factory);
    //         },
    //         (error) => {
    //             console.error('Error fetching factory:', error);
    //             this.setCurrentFactory(null);
    //         }
    //     );
    // }

    // setCurrentFactory(factory: Factory | null): void {
    //     this.currentFactorySubject.next(factory);
    // }

    // getCurrentFactory(): Observable<Factory | null> {
    //     return this.currentFactorySubject.asObservable();
    // }
}
