import { Component } from '@angular/core';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-userbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './userbar.component.html',
  styleUrl: './userbar.component.css'
})
export class UserbarComponent {

    constructor(
        private authService: AuthenticationService,
    ) {}

    logout() {
        this.authService.logout();
    }
}
