import { Component } from '@angular/core';
import { OrganizationService } from '../../../organization/services/OrganizationService';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { User } from '../../../../models/organization';
import { UserService } from '../../../../core/services/UserService';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGlobe, faMap } from '@fortawesome/free-solid-svg-icons';
import { MapComponent } from '../map/map.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [MapComponent, FontAwesomeModule],
    templateUrl: './overview.component.html',
    styleUrl: './overview.component.css',
})
export class DashboardComponent {
    currentUser: User | null = null;

    constructor(
        private authService: AuthenticationService,
        private userService: UserService,
        private organizationService: OrganizationService
    ) {}


    faGlobe = faGlobe;
    faMap = faMap;
}
