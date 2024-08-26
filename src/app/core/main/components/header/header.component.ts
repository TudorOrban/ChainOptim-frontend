import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { UserbarComponent } from '../../../user/components/userbar/userbar.component';
import { UserAvatarComponent } from '../../../user/components/user-avatar/user-avatar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule, UserbarComponent, UserAvatarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
    showDropdown = false;

    authService: AuthenticationService;

    faSearch = faSearch;

    constructor(
        authService: AuthenticationService,
    ) {
        this.authService = authService;
    }

    toggleDropdown(): void {
        this.showDropdown = !this.showDropdown;
    }

    logout() {
        this.authService.logout();
    }
}
