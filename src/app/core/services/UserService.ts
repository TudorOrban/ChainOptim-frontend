import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchUserDTO, User } from '../../models/organization';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = 'http://localhost:8080/api/users';
    private currentUserSubject = new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient) {}

    // CRUD operations
    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    getUserByUsername(username: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/username/${username}`);
    }

    searchUserByUsername(username: string): Observable<SearchUserDTO[]> {
        return this.http.get<SearchUserDTO[]>(`${this.apiUrl}/search/${username}`);
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    updateUser(user: User): Observable<User> {
        return this.http.put<User>(this.apiUrl, user);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Current user
    fetchAndSetCurrentUser(username: string): void {
        this.getUserByUsername(username).subscribe(
            (user) => {
                this.setCurrentUser(user);
            },
            (error) => {
                console.error('Error fetching user:', error);
                this.setCurrentUser(null);
            }
        );
    }

    setCurrentUser(user: User | null): void {
        this.currentUserSubject.next(user);
    }

    getCurrentUser(): Observable<User | null> {
        return this.currentUserSubject.asObservable();
    }
}
