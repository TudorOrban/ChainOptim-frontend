import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-user-avatar',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './user-avatar.component.html',
    styleUrl: './user-avatar.component.css'
})
export class UserAvatarComponent implements OnInit {
    @Input() user?: User;
    @Input() shouldUseCurrentUser?: boolean = false;
    @Input() isEditing?: boolean = false;

    faPlus = faPlus;
    faEdit = faEdit;

    constructor(
        private userService: UserService
    ) {}

    ngOnInit(): void {
        if (!this.shouldUseCurrentUser) {
            return;
        }
        this.userService.getCurrentUser().subscribe(user => {
            if (!user) {
                return;
            }
            console.log('UserAvatarComponent -> ngOnInit -> user', user);
            this.user = user;
        });
    }

    getAvatarLetters(): string {
        // Find capital letters in the username, 2 at max
        const letters = this.user?.username.match(/[A-Z]/g);
        if (!letters) {
            return '';
        }
        return letters.slice(0, 2).join('');
    }
}
