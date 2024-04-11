import { Component, OnInit } from '@angular/core';
import { Organization } from '../../models/organization';
import { UserService } from '../../../../core/auth/services/user.service';
import { OrganizationService } from '../../services/organization.service';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../../../core/user/model/user';
import { TabsComponent } from '../../../../shared/common/components/tabs/tabs.component';
import { OrganizationOverviewComponent } from './organization-overview/organization-overview.component';
import { OrganizationCustomRolesComponent } from './organization-custom-roles/organization-custom-roles.component';
import { OrganizationSubscriptionPlanComponent } from './organization-subscription-plan/organization-subscription-plan.component';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import { FallbackManagerService, FallbackManagerState } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { NavigationItem } from '../../../../shared/common/models/UITypes';

@Component({
    selector: 'app-organization',
    standalone: true,
    imports: [
        CommonModule, 
        FontAwesomeModule,
        RouterModule,
        TabsComponent,
        OrganizationOverviewComponent,
        OrganizationCustomRolesComponent,
        OrganizationSubscriptionPlanComponent,
        FallbackManagerComponent
    ],
    templateUrl: './organization.component.html',
    styleUrl: './organization.component.css',
})
export class OrganizationComponent implements OnInit {
    currentUser: User | null = null;
    organization: Organization | null = null;
    admins: User[] = [];
    members: User[] = [];
    noRoles: User[] = [];
    fallbackManagerState: FallbackManagerState = {};
    tabs: NavigationItem[] = [
        {
            label: "Overview",
        },
        {
            label: "Custom Roles",
        },
        {
            label: "Subscription Plan",
        },
    ];
    activeTab: string = "Overview";

    constructor(
        private userService: UserService,
        private organizationService: OrganizationService,
        private fallbackManagerService: FallbackManagerService
    ) {}
    
    ngOnInit() {
        // Manage fallbacks
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
        this.fallbackManagerService.updateLoading(true);

        this.userService.getCurrentUser().subscribe((data) => {
            this.currentUser = data;
            console.log('User', data);

            this.organizationService.getOrganizationById(this.currentUser?.organization?.id || 0).subscribe((orgData) => {
                if (orgData) {
                    console.log('Organization', orgData);
                    this.organization = orgData;
                    this.admins = orgData.users?.filter((user) => user.role === 'ADMIN') || [];
                    this.members = orgData.users?.filter((user) => user.role === 'MEMBER') || [];
                    this.noRoles = orgData.users?.filter((user) => user.role === 'NONE') || [];
                }
            });
        });
        
    }

    onTabSelected(selectedTabLabel: string) {
        this.activeTab = selectedTabLabel;
    }

    faBuilding = faBuilding;
}
