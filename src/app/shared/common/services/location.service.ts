import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { CreateLocationDTO, Location, UpdateLocationDTO } from '../models/reusableTypes';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    private apiUrl = 'http://localhost:8080/api/v1/locations';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {}

    getLocationsByOrganizationId(organizationId: number): Observable<Location[]> {
        return this.http
            .get<Location[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getLocationById(id: number): Observable<Location> {
        return this.http
            .get<Location>(`${this.apiUrl}/${id}/stages`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    createLocation(locationDTO: CreateLocationDTO): Observable<Location> {
        return this.http.post<Location>(`${this.apiUrl}/create`, locationDTO);
    }
        
    updateLocation(locationDTO: UpdateLocationDTO): Observable<Location> {
        return this.http.put<Location>(`${this.apiUrl}/update`, locationDTO);
    }

    deleteLocation(locationId: number): Observable<number> {
        return this.http.delete<number>(`${this.apiUrl}/delete/${locationId}`);
    }
}
