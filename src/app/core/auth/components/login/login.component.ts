import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
})
export class LoginComponent {
    username: string = '';
    password: string = '';

    constructor(
        private http: HttpClient,
        public authService: AuthenticationService,
        public userService: UserService,
        private router: Router
    ) {}

    onSubmit() {
        const loginPayload = {
            username: this.username,
            password: this.password,
        };
        this.http.post<any>('api/v1/login', loginPayload).subscribe(
            (response) => {
                console.log('Login successful', response);
                this.authService.login(response.accessToken);
                const username = this.authService.getUsernameFromToken();
                if (username) {
                    this.userService.fetchAndSetCurrentUser(username);
                }
                this.router.navigate(['']);
            },
            (error) => {
                console.log(error);
            }
        );
    }
}
