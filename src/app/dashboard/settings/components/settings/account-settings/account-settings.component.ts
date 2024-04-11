import { Component, Input } from '@angular/core';
import { UserSettings } from '../../../models/UserSettings';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent {
    @Input() settings: UserSettings | null = null;

}
