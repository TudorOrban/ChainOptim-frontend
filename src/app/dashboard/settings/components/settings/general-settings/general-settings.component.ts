import { Component, Input } from '@angular/core';
import { UserSettings } from '../../../models/UserSettings';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [],
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.css'
})
export class GeneralSettingsComponent {
    @Input() settings: UserSettings | null = null;

}
