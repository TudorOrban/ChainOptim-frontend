import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { NotificationUser } from '../types/notificationTypes';
import { SearchParams } from '../../../shared/search/models/Search';
import { PaginatedResults } from '../../../shared/search/models/PaginatedResults';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private apiUrl = 'http://localhost:8080/api/v1/notifications';

    constructor(
        private http: HttpClient,
        private errorHandlerService: ErrorHandlerService
    ) {}

    getNotificationsByUserId(userId: string): Observable<NotificationUser[]> {
        return this.http
            .get<NotificationUser[]>(`${this.apiUrl}/user/${userId}`)
            .pipe(
                catchError((error) =>
                    this.errorHandlerService.handleError(error)
                )
            );
    }

    getNotificationsByUserIdAdvanced(userId: string, searchParams: SearchParams): Observable<PaginatedResults<NotificationUser>> {
        const key = `notifications/user/advanced/${userId}
                ?searchQuery=${encodeURIComponent(searchParams.searchQuery)}
                &sortBy=${encodeURIComponent(searchParams.sortOption)}
                &ascending=${searchParams.ascending}
                &page=${searchParams.page}
                &itemsPerPage=${searchParams.itemsPerPage}`;

        return this.http
            .get<PaginatedResults<NotificationUser>>(`${this.apiUrl}/user/advanced/${userId}`, {
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