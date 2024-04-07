import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CustomRole } from "../models/custom-role";
import { Observable } from "rxjs";
import { CreateCustomRoleDTO, UpdateCustomRoleDTO } from "../models/dto";

@Injectable({
    providedIn: 'root',
})
export class OrganizationService {
    private apiUrl = 'http://localhost:8080/api/v1/custom-roles';

    constructor(private http: HttpClient) {}

    getCustomRolesByOrganizationId(organizationId: number): Observable<CustomRole[]> {
        return this.http.get<CustomRole[]>(`${this.apiUrl}/organization/${organizationId}`);
    }

    createCustomRole(roleDTO: CreateCustomRoleDTO): Observable<CustomRole> {
        return this.http.post<CustomRole>(`${this.apiUrl}/create`, roleDTO);
    }

    updateCustomRole(roleDTO: UpdateCustomRoleDTO): Observable<CustomRole> {
        return this.http.put<CustomRole>(`${this.apiUrl}/update`, roleDTO);
    }

    deleteCustomRole(roleId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${roleId}`);
    }
}