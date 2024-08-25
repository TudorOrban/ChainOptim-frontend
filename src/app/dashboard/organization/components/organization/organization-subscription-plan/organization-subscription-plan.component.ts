import { Component, Input, OnInit } from '@angular/core';
import { Organization } from '../../../models/organization';
import { SubscriptionPlanService } from '../../../services/subscriptionplan.service';
import { UserService } from '../../../../../core/auth/services/user.service';
import { SubscriptionPlan } from '../../../models/SubscriptionPlan';

@Component({
  selector: 'app-organization-subscription-plan',
  standalone: true,
  imports: [],
  templateUrl: './organization-subscription-plan.component.html',
  styleUrl: './organization-subscription-plan.component.css'
})
export class OrganizationSubscriptionPlanComponent implements OnInit {
    @Input() organization: Organization | null = null;

    currentPlan: SubscriptionPlan | undefined = undefined;

    constructor(
        private userService: UserService,
        private planService: SubscriptionPlanService,
    ) {}

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
                error: error => console.error('Error getting subscription plan:', error)
            });
        });
    }
}
