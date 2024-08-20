import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UserSettings } from "../models/UserSettings";

@Injectable({
    providedIn: 'root'
})
export class UserSettingsService {
    private apiUrl = 'http://localhost:8080/api/v1/user-settings';
    private currentSettingsSubject = new BehaviorSubject<UserSettings | null>(null);

    constructor(
        private http: HttpClient
    ) {}

    getUserSettings(userId: string): Observable<UserSettings> {
        return this.http.get<UserSettings>(`${this.apiUrl}/user/${userId}`);
    }

    fetchAndSetUserSettings(userId: string): void {
        this.getUserSettings(userId).subscribe(
            (settings) => {
                console.log('Fetched user settings:', settings);
                this.setCurrentSettings(settings);
            },
            (error) => {
                console.error('Error fetching user settings:', error);
                this.setCurrentSettings(null);
            }
        );
    }

    setCurrentSettings(settings: UserSettings | null): void {
        this.currentSettingsSubject.next(settings);
    }

    getCurrentSettings(): Observable<UserSettings | null> {
        return this.currentSettingsSubject.asObservable();
    }
}