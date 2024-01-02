import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    username: string = "";
    password: string = "";

    constructor(private http: HttpClient, private authService: AuthenticationService) {}

    onSubmit() {
        const loginPayload = { username: this.username, password: this.password };
        this.http.post<any>("api/login", loginPayload).subscribe(
            (response) => {
                console.log("Login successful", response);
                this.authService.login(response.accessToken);
            },
            (error) => {
                console.log(error);
            }
        );
    }
}
