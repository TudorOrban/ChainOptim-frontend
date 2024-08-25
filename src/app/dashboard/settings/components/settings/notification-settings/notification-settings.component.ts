import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserSettings } from '../../../models/UserSettings';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.css'
})
export class NotificationSettingsComponent {
    @Input() settings: UserSettings | null = null;
    
    @Output() onSettingsChange = new EventEmitter<UserSettings>();

    onSupplierOrdersChange(): void {
        console.log('Supplier orders change:', this.settings?.notificationSettings.supplierOrdersOn);
        console.log('Supplier orders change:', this.settings?.notificationSettings);
        if (!this.settings) return;
        this.onSettingsChange.emit(this.settings);
    }
}
