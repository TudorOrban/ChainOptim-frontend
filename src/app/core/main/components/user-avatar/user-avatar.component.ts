import { Component, Input } from '@angular/core';
import { User } from '../../../user/model/user';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.css'
})
export class UserAvatarComponent {
    @Input() user: User | undefined = undefined;

    getAvatarLetters(): string {
        // Find capital letters in the username, 2 at max
        const letters = this.user?.username.match(/[A-Z]/g);
        if (!letters) {
            return '';
        }
        return letters.slice(0, 2).join('');
    }
}
