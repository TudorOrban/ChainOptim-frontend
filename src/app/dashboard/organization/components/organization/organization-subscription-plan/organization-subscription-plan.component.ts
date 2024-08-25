import { Component, Input } from '@angular/core';
import { Organization } from '../../../models/organization';

@Component({
  selector: 'app-organization-subscription-plan',
  standalone: true,
  imports: [],
  templateUrl: './organization-subscription-plan.component.html',
  styleUrl: './organization-subscription-plan.component.css'
})
export class OrganizationSubscriptionPlanComponent {
    @Input() organization: Organization | null = null;

    constructor() {
        
    }
}
