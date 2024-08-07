import { HttpClient } from '@angular/common/http';
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

    getUpcomingEventsByUserIdAdvanced(organizationId: number, searchParams: SearchParams): Observable<UpcomingEvent[]> {
        return this.http
            .get<UpcomingEvent[]>(`${this.apiUrl}/organization/advanced/${organizationId}`, {
                params: {
                    searchQuery: searchParams.searchQuery,
                    sortBy: searchParams.sortOption,
                    ascending: searchParams.ascending.toString(),
                    page: searchParams.page.toString(),
                    itemsPerPage: searchParams.itemsPerPage.toString(),
                },
            })
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }
}