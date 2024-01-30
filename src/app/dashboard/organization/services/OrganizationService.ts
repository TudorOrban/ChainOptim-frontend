import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateOrganizationDTO, Organization } from '../models/organization';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class OrganizationService {
    private apiUrl = 'http://localhost:8080/api/organizations';
    private currentOrganizationSubject = new BehaviorSubject<Organization | null>(null);

    constructor(private http: HttpClient) {}

    createOrganization(organization: CreateOrganizationDTO): Observable<CreateOrganizationDTO> {
        return this.http.post<CreateOrganizationDTO>(this.apiUrl, organization);
    }

    getOrganizationById(id: number, includeUsers?: boolean): Observable<Organization> {
        const url = includeUsers ? `${this.apiUrl}/${id}?includeUsers=true` : `${this.apiUrl}/${id}`;
        return this.http.get<Organization>(url);
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

    // Current organization
    async fetchAndSetCurrentOrganization(organizationId: number): Promise<void> {
        this.getOrganizationById(organizationId, true).subscribe(
            (organization) => {
                this.setCurrentOrganization(organization);
            },
            (error) => {
                console.error('Error fetching organization:', error);
                this.setCurrentOrganization(null);
            }
        );
    }

    setCurrentOrganization(organization: Organization | null): void {
        this.currentOrganizationSubject.next(organization);
    }

    getCurrentOrganization(): Observable<Organization | null> {
        return this.currentOrganizationSubject.asObservable();
    }
}
