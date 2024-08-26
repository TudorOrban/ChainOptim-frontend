import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SearchUserDTO } from '../../../dashboard/organization/models/organization';
import { User, UserRole } from '../model/user';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = 'http://localhost:8080/api/v1/users';
    private currentUserSubject = new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient) {}

    fetchAndSetCurrentUser(username: string): void {
        this.getUserByUsername(username).subscribe(
            (user) => {
                console.log('Fetched user:', user);
                this.setCurrentUser(user);
            },
            (error) => {
                console.error('Error fetching user:', error);
                this.setCurrentUser(null);
            }
        );
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

    getUsersByCustomRoleId(customRoleId: number): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/search/custom-role/${customRoleId}`);
    }

    searchPulbicUsers(searchQuery: string, page: number, itemsPerPage: number): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/search/public/?searchQuery=${searchQuery}&page=${page}&itemsPerPage=${itemsPerPage}`);
    }

    assignBasicRoleToUser(userId: String, role: UserRole): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${userId}/assign-basic-role`, { role: role });
    }

    assignCustomRoleToUser(userId: String, customRoleId: number): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${userId}/assign-custom-role`, { roleId: customRoleId });
    }

    removeUserFromOrganization(userId: string, organizationId: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${userId}/remove-from-organization/${organizationId}`, {});
    }


    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    updateUser(user: User): Observable<User> {
        return this.http.put<User>(this.apiUrl, user);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }


    setCurrentUser(user: User | null): void {
        this.currentUserSubject.next(user);
    }

    getCurrentUser(): Observable<User | null> {
        return this.currentUserSubject.asObservable();
    }
}
