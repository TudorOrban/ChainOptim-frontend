import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    username: string = "";
    password: string = "";

    constructor(private http: HttpClient, public authService: AuthenticationService, private router: Router) {}

    onSubmit() {
        const loginPayload = { username: this.username, password: this.password };
        this.http.post<any>("api/login", loginPayload).subscribe(
            (response) => {
                console.log("Login successful", response);
                this.authService.login(response.accessToken);
                this.router.navigate([""]);
            },
            (error) => {
                console.log(error);
            }
        );
    }
}
