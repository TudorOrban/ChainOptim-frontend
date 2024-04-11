import { Component, Input } from '@angular/core';
import { UserSettings } from '../../../models/UserSettings';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [],
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.css'
})
export class NotificationSettingsComponent {
    @Input() settings: UserSettings | null = null;
    
}
