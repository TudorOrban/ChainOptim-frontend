import { Component, Input } from '@angular/core';
import { Organization } from '../../../models/organization';

@Component({
  selector: 'app-organization-custom-roles',
  standalone: true,
  imports: [],
  templateUrl: './organization-custom-roles.component.html',
  styleUrl: './organization-custom-roles.component.css'
})
export class OrganizationCustomRolesComponent {
    @Input() organization: Organization | null = null;

}
