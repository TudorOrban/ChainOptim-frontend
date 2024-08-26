import { Component, Input, OnInit } from '@angular/core';
import { Organization } from '../../../models/organization';
import { SubscriptionPlanService } from '../../../services/subscriptionplan.service';
import { UserService } from '../../../../../core/auth/services/user.service';
import { SubscriptionPlan } from '../../../models/SubscriptionPlan';
import { CommonModule } from '@angular/common';
import { UIUtilService } from '../../../../../shared/common/services/uiutil.service';
import { CustomPlanComponent } from './custom-plan/custom-plan.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { Router, RouterModule } from '@angular/router';
import { GenericConfirmDialogComponent } from '../../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { ConfirmDialogInput } from '../../../../../shared/common/models/confirmDialogTypes';
import { ToastService } from '../../../../../shared/common/components/toast-system/toast.service';
import { OrganizationService } from '../../../services/organization.service';
import { OperationOutcome } from '../../../../../shared/common/components/toast-system/toastTypes';

@Component({
    selector: 'app-organization-subscription-plan',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, RouterModule, CustomPlanComponent, GenericConfirmDialogComponent],
    templateUrl: './organization-subscription-plan.component.html',
    styleUrl: './organization-subscription-plan.component.css'
})
export class OrganizationSubscriptionPlanComponent implements OnInit {
    @Input() organization: Organization | null = null;

    currentPlan: SubscriptionPlan | undefined = undefined;
    noPlan: boolean = false;
    isEditingPlan: boolean = false;
    isExpanded: boolean = false;
    
    faPlus = faPlus;
    faEdit = faEdit;
    faSave = faSave;

    uiUtilService: UIUtilService;

    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: 'Cancel Subscription',
        dialogMessage: 'Are you sure you want to unsubscribe? Resources belonging to this organization will be deleted beyond those covered by the \'None\' plan.',
    };
    isConfirmDialogOpen = false;

    constructor(
        private userService: UserService,
        private planService: SubscriptionPlanService,
        private toastService: ToastService,
        private organizationService: OrganizationService,
        uiUtilService: UIUtilService,
        private router: Router
    ) {
        this.uiUtilService = uiUtilService;
    }

    ngOnInit(): void {
        console.log('OrganizationSubscriptionPlanComponent initialized');

        this.userService.getCurrentUser().subscribe(user => {
            if (!user?.organization) {
                return;
            }

            this.planService.getSubscriptionPlanByOrganizationId(user.organization.id).subscribe({
                next: plan => {
                    console.log('Subscription plan:', plan);
                    this.currentPlan = plan;
                },
                error: error => {
                    console.log('Error getting subscription plan:', error);
                    this.noPlan = true;
                }
            });
        });
    }

    // Handlers
    handleOpenUnsubscribeConfirmDialog(): void {
        this.isConfirmDialogOpen = true;
    }

    handleUnsubscribe(): void {
        this.organizationService.unsubscribeOrganization(this.organization?.id ?? 0).subscribe({
            next: () => {
                this.toastService.addToast({
                    id: 0,
                    title: 'Unsubscribed successfully',
                    message: 'You have successfully unsubscribed from the organization',
                    outcome: OperationOutcome.SUCCESS
                })
                this.router.navigate(['/dashboard/organization']);
            },
            error: error => {
                console.error('Error unsubscribing:', error);
                this.toastService.addToast({
                    id: 0,
                    title: 'Error unsubscribing',
                    message: 'There was an error unsubscribing from the organization',
                    outcome: OperationOutcome.ERROR
                })
            }
        });
    }

    handleCancelUnsubscription(): void {
        this.isConfirmDialogOpen = false;
    }

    handleCreatePlan(): void {
        console.log('Create plan');
        
        this.router.navigate(['/dashboard/organization/subscribe']);
    }

    handleEditPlan(): void {
        console.log('Edit plan');
        this.isEditingPlan = true;
        this.isExpanded = true;
    }

    handleSavePlan(): void {
        console.log('Save plan');
    }

    handleCancelEditPlan(): void {
        console.log('Cancel edit plan');
        this.isEditingPlan = false;
    }
}
