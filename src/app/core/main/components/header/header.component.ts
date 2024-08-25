import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

    authService: AuthenticationService;

    faSearch = faSearch;

    constructor(
        authService: AuthenticationService,
    ) {
        this.authService = authService;
    }

    logout() {
        this.authService.logout();
    }
}
