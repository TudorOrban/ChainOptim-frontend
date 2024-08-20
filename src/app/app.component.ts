import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
    Event,
    NavigationEnd,
    Router,
    RouterModule,
    RouterOutlet,
} from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './core/auth/services/jwt-interceptor.service';
import { AuthenticationService } from './core/auth/services/authentication.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SidebarComponent } from './core/main/components/sidebar/sidebar.component';
import { filter, Observable, switchMap } from 'rxjs';
import { UserService } from './core/auth/services/user.service';
import { OrganizationService } from './dashboard/organization/services/organization.service';
import { ToastManagerComponent } from './shared/common/components/toast-system/toast-manager/toast-manager.component';
import { NotificationLiveService } from './dashboard/overview/services/notificationlive.service';
import { User } from './core/user/model/user';
import { UserSettingsService } from './dashboard/settings/services/user-settings.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        FontAwesomeModule,
        RouterModule,
        SidebarComponent,
        ToastManagerComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
    messages$: Observable<any> | undefined = undefined;
    hideHeader = false;
    title = 'Chain Optimizer';
    faSearch = faSearch;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        public authService: AuthenticationService,
        private userService: UserService,
        private userSettingsService: UserSettingsService,
        private notificationLiveService: NotificationLiveService,
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
                this.userService.getCurrentUser().subscribe((user: User | null) => {
                    if (user) {
                        console.log('Current in app:', user);
                        this.messages$ = this.notificationLiveService.connect(`ws://localhost:8080/ws?userId=${user.id}`);

                    }
                });
                this.userSettingsService.fetchAndSetUserSettings(username);
            }
        }
    }

    logout() {
        this.authService.logout();
    }
}
