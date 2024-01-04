import { Component } from '@angular/core';
import { OrganizationService } from '../../services/OrganizationService';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { User } from '../../../models/organization';
import { UserService } from '../../services/UserService';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
    currentUser: User | null = null;

    constructor(
        private authService: AuthenticationService,
        private userService: UserService,
        private organizationService: OrganizationService
    ) {}

}
