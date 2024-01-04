import { Component, OnInit } from '@angular/core';
import { Organization, User } from '../../../models/organization';
import { UserService } from '../../services/UserService';
import { OrganizationService } from '../../services/OrganizationService';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-organization',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, RouterModule],
    templateUrl: './organization.component.html',
    styleUrl: './organization.component.css',
})
export class OrganizationComponent implements OnInit {
    currentUser: User | null = null;
    currentOrganization: Organization | null = null;
    admins: User[] = [];
    members: User[] = [];
    noRoles: User[] = [];

    constructor(
        private userService: UserService,
        private organizationService: OrganizationService
    ) {}

    ngOnInit() {
        this.userService.getCurrentUser().subscribe((data) => {
            this.currentUser = data;
            console.log('User', data);
            if (this.currentUser?.organization?.id) {
                this.organizationService
                    .getOrganizationById(this.currentUser?.organization.id, true)
                    .subscribe((orgData) => {
                        console.log('Organization', orgData);
                        this.currentOrganization = orgData;
                        this.admins = this.currentOrganization?.users.filter((user) => user.role === 'ADMIN') || [];
                        this.members = this.currentOrganization?.users.filter((user) => user.role === 'MEMBER') || [];
                        this.noRoles = this.currentOrganization?.users.filter((user) => user.role === 'NONE') || [];
                    });
            }
        });
    }

    faBuilding = faBuilding;
}
