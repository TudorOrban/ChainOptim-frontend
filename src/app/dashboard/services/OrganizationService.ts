import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Organization } from '../../models/organization';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class OrganizationService {
    private apiUrl = 'http://localhost:8080/api/organizations';

    constructor(private http: HttpClient) {}

    createOrganization(organization: Organization): Observable<Organization> {
        return this.http.post<Organization>(this.apiUrl, organization);
    }

    getOrganizationById(id: number): Observable<Organization> {
        return this.http.get<Organization>(`${this.apiUrl}/${id}`);
    }

    getAllOrganizations(): Observable<Organization[]> {
        return this.http.get<Organization[]>(this.apiUrl);
    }

    updateOrganization(organization: Organization): Observable<Organization> {
        return this.http.put<Organization>(this.apiUrl, organization);
    }

    deleteOrganization(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
