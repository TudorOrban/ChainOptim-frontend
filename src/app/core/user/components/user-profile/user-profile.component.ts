import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, UserAvatarComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
    currentUser: User | undefined = undefined;
    accessedUser: User | undefined = undefined;

    faUser = faUser;

    constructor(
        private authService: AuthenticationService,
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.loadAccessedUser();
        this.loadCurrentUser();
    }

    private async loadCurrentUser(): Promise<void> {
        this.userService.getCurrentUser().subscribe(user => {
            if (!user) {
                return;
            }
            this.currentUser = user;
        });
    }

    private async loadAccessedUser(): Promise<void> {
        this.route.paramMap.subscribe(params => {
            const username = params.get('username');
            if (!username) {
                console.error('No username provided');
                return;
            }

            this.userService.getUserByUsername(username).subscribe(user => {
                if (!user) {
                    console.error('User not found');
                    return;
                }
                this.accessedUser = user;
            });
        });
        
    }

}
