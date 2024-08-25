import { Component } from '@angular/core';
import { AuthenticationService } from '../../../auth/services/authentication.service';

@Component({
  selector: 'app-userbar',
  standalone: true,
  imports: [],
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
