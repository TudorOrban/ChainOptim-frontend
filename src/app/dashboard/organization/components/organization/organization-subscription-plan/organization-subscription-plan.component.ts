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
import { CurrentPlanService } from '../../../../../core/payment/services/currentplan.service';

@Component({
    selector: 'app-organization-subscription-plan',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, RouterModule, CustomPlanComponent],
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

    constructor(
        private userService: UserService,
        private planService: SubscriptionPlanService,
        private currentPlanService: CurrentPlanService,
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
                    console.error('Error getting subscription plan:', error);
                    this.noPlan = true;
                }
            });
        });
    }

    // Handlers
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
    }
}
