import { Component, OnInit } from '@angular/core';
import { Organization } from '../../models/organization';
import { UserService } from '../../../../core/user/services/user.service';
import { OrganizationService } from '../../services/organization.service';
import { faBuilding, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../../core/user/model/user';
import { TabsComponent } from '../../../../shared/common/components/tabs/tabs.component';
import { OrganizationOverviewComponent } from './organization-overview/organization-overview.component';
import { OrganizationCustomRolesComponent } from './organization-custom-roles/organization-custom-roles.component';
import { OrganizationSubscriptionPlanComponent } from './organization-subscription-plan/organization-subscription-plan.component';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import { FallbackManagerService, FallbackManagerState } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { NavigationItem } from '../../../../shared/common/models/uiTypes';
import { UIUtilService } from '../../../../shared/common/services/uiutil.service';
import { ConfirmDialogInput } from '../../../../shared/common/models/confirmDialogTypes';
import { GenericConfirmDialogComponent } from '../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';
import { OperationOutcome } from '../../../../shared/common/components/toast-system/toastTypes';

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
        FallbackManagerComponent,
        GenericConfirmDialogComponent
    ],
    templateUrl: './organization.component.html',
    styleUrl: './organization.component.css',
})
export class OrganizationComponent implements OnInit {
    currentUser: User | null = null;
    organization: Organization | null = null;
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
    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: 'Delete Organization',
        dialogMessage: 'Are you sure you want to delete this organization?',
    };
    isConfirmDialogOpen = false;

    uiUtilService: UIUtilService;

    faTrash = faTrash;
    faBuilding = faBuilding;
    
    constructor(
        private readonly userService: UserService,
        private readonly organizationService: OrganizationService,
        private readonly fallbackManagerService: FallbackManagerService,
        private readonly toastService: ToastService,
        uiUtilService: UIUtilService,
        private readonly router: Router
    ) {
        this.uiUtilService = uiUtilService;
    }

    ngOnInit() {
        // Manage fallbacks
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
        this.fallbackManagerService.updateLoading(true);

        this.userService.getCurrentUser().subscribe((data) => {
            this.currentUser = data;
            console.log('User', data);

            this.getOrganization();
        });

    }

    private getOrganization(): void {
        if (!this.currentUser?.organization?.id) {
            console.error('No organization found');
            this.fallbackManagerService.updateLoading(false);
            return;
        }

        this.organizationService.getOrganizationById(this.currentUser?.organization?.id || 0).subscribe((orgData) => {
            this.fallbackManagerService.updateLoading(false);
            if (!orgData) {
                this.fallbackManagerService.updateError('Organization not found');
                return;
            }
            
            console.log('Organization', orgData);
                this.organization = orgData;
        });
    }

    // Handlers
    onTabSelected(selectedTabLabel: string) {
        this.activeTab = selectedTabLabel;
    }

    handleEditOrganization(): void {
        if (!this.currentUser?.organization?.id) return;
        this.router.navigate([`dashboard/organization/${this.currentUser?.organization?.id ?? 0}/update-organization`]);
    }

    handleDisplayConfirmDeleteDialog(): void {
        this.isConfirmDialogOpen = true;
    }

    handleDeleteOrganization(): void {
        this.organizationService.deleteOrganization(this.organization?.id ?? 0).subscribe({
            next: data => {

                console.log('Organization deleted', data);
                this.toastService.addToast({
                    id: 0,
                    title: 'Organization Deleted',
                    message: 'The organization has been successfully deleted',
                    outcome: OperationOutcome.SUCCESS,
                });
                this.router.navigate(['/dashboard']);
            },
            error: error => {
                console.error('Error deleting organization', error);
                this.toastService.addToast({
                    id: 0,
                    title: 'Error Deleting Organization',
                    message: 'An error occurred while deleting the organization',
                    outcome: OperationOutcome.ERROR,
                });
            }
        });
    }

    handleCancelDeletion(): void {
        this.isConfirmDialogOpen = false;
    }
}
