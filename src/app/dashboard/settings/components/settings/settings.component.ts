import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabsComponent } from '../../../../shared/common/components/tabs/tabs.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import { FallbackManagerService, FallbackManagerState } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { UserSettings } from '../../models/UserSettings';
import { UserService } from '../../../../core/user/services/user.service';
import { User } from '../../../../core/user/model/user';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TabsComponent,
        GeneralSettingsComponent,
        AccountSettingsComponent,
        NotificationSettingsComponent,
        FallbackManagerComponent
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
    userSettings: UserSettings | null = null;
    currentUser: User | null = null;
    fallbackManagerState: FallbackManagerState = {};
    tabs = [
        {
            label: "General",
        },
        {
            label: "Account",
        },
        {
            label: "Notifications",
        },
    ];
    activeTab: string = "General";

    constructor(
        private userSettingsService: UserSettingsService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService
    ) {}

    ngOnInit() {
        // Manage fallbacks
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
        this.fallbackManagerService.updateLoading(true);

        this.loadUserSettings();
    }
    
    private loadUserSettings(): void {
        this.userService.getCurrentUser().subscribe((currentUser) => {
            if (!currentUser?.id) {
                return;
            }
            this.currentUser = currentUser;
            
            this.userSettingsService.getUserSettings(currentUser.id).subscribe((settings) => {
                this.userSettings = settings;
                console.log('User Settings:', settings);
                this.fallbackManagerService.updateLoading(false);
            });
        });
    }

    onTabSelected(selectedTabLabel: string) {
        this.activeTab = selectedTabLabel;
    }

    onNotificationSettingsChanged(settings: UserSettings) {
        console.log('Notification settings changed:', settings);
    }
}
