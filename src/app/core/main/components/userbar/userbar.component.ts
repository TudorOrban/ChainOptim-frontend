import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../auth/services/user.service';
import { User } from '../../../user/model/user';

@Component({
  selector: 'app-userbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './userbar.component.html',
  styleUrl: './userbar.component.css'
})
export class UserbarComponent implements OnInit{
    currentUser: User | undefined = undefined;

    constructor(
        private authService: AuthenticationService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            if (!user) {
                return;
            }
            this.currentUser = user;
        });
    }

    logout() {
        this.authService.logout();
    }
}
