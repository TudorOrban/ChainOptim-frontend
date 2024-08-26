import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../user/services/user.service';
import { CurrentPlanService } from '../../../../dashboard/organization/services/currentplan.service';

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
        private currentPlanService: CurrentPlanService,
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
                if (!username) {
                    console.error('No username found in token');
                    return;
                }

                this.userService.fetchAndSetCurrentUser(username);

                this.userService.getCurrentUser().subscribe((user) => {
                    console.log('User:', user);
                    if (this.currentPlanService.getPreparingToSubscribe()) {
                        if (!user?.organization?.id) {
                            this.router.navigate(['/dashboard/organization/create-organization']);
                        }

                        this.router.navigate(['/subscribe']);
                    } else {
                        this.router.navigate(['']);
                    }
                });
            },
            (error) => {
                console.log(error);
            }
        );
    }
}
