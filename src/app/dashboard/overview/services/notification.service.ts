import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared/fallback/services/error/error-handler.service';
import { NotificationUser } from '../types/notificationTypes';

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
}