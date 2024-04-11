import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserSettings } from "../models/UserSettings";

@Injectable({
    providedIn: 'root'
})
export class UserSettingsService {
    private apiUrl = 'http://localhost:8080/api/v1/user-settings';

    constructor(
        private http: HttpClient
    ) {}

    getUserSettings(userId: string): Observable<UserSettings> {
        return this.http.get<UserSettings>(`${this.apiUrl}/user/${userId}`);
    }
}