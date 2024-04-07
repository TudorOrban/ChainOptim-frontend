import { Component } from '@angular/core';
import { OrganizationService } from '../../../organization/services/organization.service';
import { AuthenticationService } from '../../../../core/auth/services/authentication.service';
import { UserService } from '../../../../core/auth/services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGlobe, faMap } from '@fortawesome/free-solid-svg-icons';
import { MapComponent } from '../map/map.component';
import { User } from '../../../../core/user/model/user';

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
