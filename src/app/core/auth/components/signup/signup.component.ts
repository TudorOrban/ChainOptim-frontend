import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
    username: string = "";
    password: string = "";
    email: string = "";

    constructor(private http: HttpClient, public authService: AuthenticationService, private router: Router) {}

    onSignupSubmit() {
        const signupPayload = { username: this.username, password: this.password, email: this.email };
        this.http.post<any>("api/users/signup", signupPayload).subscribe(
            (response) => {
                console.log("Signup successful", response);
                this.authService.login(response.accessToken);
                this.router.navigate([""]);
            },
            (error) => {
                console.log("Signup error: ", error);
            }
        )
    }
}
