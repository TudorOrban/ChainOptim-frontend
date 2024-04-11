import { Component, Input } from '@angular/core';
import { Organization } from '../../../models/organization';

@Component({
  selector: 'app-organization-overview',
  standalone: true,
  imports: [],
  templateUrl: './organization-overview.component.html',
  styleUrl: './organization-overview.component.css'
})
export class OrganizationOverviewComponent {
    @Input() organization: Organization | null = null;

}
