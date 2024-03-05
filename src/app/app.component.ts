import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    Event,
    NavigationEnd,
    Router,
    RouterModule,
    RouterOutlet,
} from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './core/auth/services/jwt-interceptor.service';
import { AuthenticationService } from './core/auth/services/authentication.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SidebarComponent } from './core/main/components/sidebar/sidebar.component';
import { filter, switchMap } from 'rxjs';
import { UserService } from './core/auth/services/UserService';
import { OrganizationService } from './dashboard/organization/services/OrganizationService';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        HttpClientModule,
        FontAwesomeModule,
        RouterModule,
        SidebarComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
    // Display variables
    hideHeader = false;
    title = 'Chain Optimizer';
    faSearch = faSearch;

    // Constructor
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        public authService: AuthenticationService,
        private userService: UserService,
        private organizationService: OrganizationService,
        private router: Router
    ) {
        // Hide header on dashboard routes
        this.router.events
            .pipe(
                filter(
                    (event: Event): event is NavigationEnd =>
                        event instanceof NavigationEnd
                )
            )
            .subscribe((event: NavigationEnd) => {
                this.hideHeader = event.url.startsWith('/dashboard');
            });
    }

    get isDashboardRoute(): boolean {
        return this.router.url.startsWith('/dashboard');
    }

    // Fetch current user and organization data on init
    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            const username = this.authService.getUsernameFromToken();
            if (username) {
                this.userService.fetchAndSetCurrentUser(username);

                this.userService
                    .getCurrentUser()
                    .pipe(
                        filter(
                            (user) =>
                                user !== null &&
                                user.organization !== undefined &&
                                user.organization.id !== undefined
                        ),
                        switchMap((user) => {
                            return this.organizationService.fetchAndSetCurrentOrganization(
                                user?.organization?.id as number
                            );
                        })
                    )
                    .subscribe();
            }
        }
    }

    // Logout
    logout() {
        this.authService.logout();
    }
}
