import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    Event,
    NavigationEnd,
    Router,
    RouterModule,
    RouterOutlet,
} from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './core/services/jwt-interceptor.service';
import { AuthenticationService } from './core/services/authentication.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { filter } from 'rxjs';
import { UserService } from './dashboard/services/UserService';

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
    hideHeader = false;

    constructor(
        public authService: AuthenticationService,
        private userService: UserService,
        private router: Router
    ) {
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

    ngOnInit() {
        const username = this.authService.getUsernameFromToken();
        if (username) {
            this.userService.fetchAndSetCurrentUser(username);
        }
    }

    get isDashboardRoute(): boolean {
        return this.router.url.startsWith('/dashboard');
    }
    logout() {
        this.authService.logout();
    }

    title = 'Chain Optimizer';
    faSearch = faSearch;
}
