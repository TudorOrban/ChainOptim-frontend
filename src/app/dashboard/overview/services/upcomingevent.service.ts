import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { UpcomingEvent } from '../types/upcomingEventTypes';
import { SearchParams } from '../../../shared/search/models/Search';
import { PaginatedResults } from '../../../shared/search/models/PaginatedResults';

@Injectable({
    providedIn: 'root',
})
export class UpcomingEventService {
    private apiUrl = 'http://localhost:8080/api/v1/upcoming-events';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService
    ) {}

    getUpcomingEventsByUserId(organizationId: number): Observable<UpcomingEvent[]> {
        return this.http
            .get<UpcomingEvent[]>(`${this.apiUrl}/organization/${organizationId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    
    getUpcomingEventsByOrganizationIdAdvanced(organizationId: number, searchParams: SearchParams): Observable<UpcomingEvent[]> {
        let params = new HttpParams()
            .set('searchQuery', searchParams.searchQuery)
            .set('sortBy', searchParams.sortOption)
            .set('ascending', searchParams.ascending.toString())
            .set('page', searchParams.page.toString())
            .set('itemsPerPage', searchParams.itemsPerPage.toString());

        if (searchParams.filters && Object.keys(searchParams.filters).length > 0) {
            const filtersJson = JSON.stringify(searchParams.filters);
           params = params.set('filters', filtersJson);
        }
          
        return this.http.get<UpcomingEvent[]>(`${this.apiUrl}/organization/advanced/${organizationId}`, { params })
            .pipe(
                catchError((error) => this.errorHandlerService.handleError(error))
            );
    }
}