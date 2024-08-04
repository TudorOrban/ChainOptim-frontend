import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Organization } from '../../../models/organization';
import { User } from "../../../../../core/user/model/user";
import { OrganizationService } from "../../../services/organization.service";
import { DatePipe, NgForOf } from "@angular/common";
import { CustomRole } from "../../../models/custom-role";
import { CustomRoleService } from "../../../services/custom-role.service";
import { FallbackManagerService, FallbackManagerState } from "../../../../../shared/fallback/services/fallback-manager/fallback-manager.service";

@Component({
  selector: 'app-organization-overview',
  standalone: true,
    imports: [
        NgForOf,
        DatePipe
    ],
  templateUrl: './organization-overview.component.html',
  styleUrl: './organization-overview.component.css'
})
export class OrganizationOverviewComponent implements OnInit {
    @Input() organization!: Organization;
    users!: User[];
    fallbackManagerState: FallbackManagerState = {};
    membersNumber: number = 0;

    constructor(
        private organizationService: OrganizationService,
        private customRoleService: CustomRoleService,
        private fallbackManagerService: FallbackManagerService
    ) {}

    ngOnInit() {
        this.fetchOrganizationUsers();

        // Manage fallbacks
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
        this.fallbackManagerService.updateLoading(true);
    }

    private fetchOrganizationUsers(): void {
        if (!this.organization) {
            this.fallbackManagerService.updateError('Organization not found');
            return;
        }
        this.organizationService.getOrganizationById(this.organization.id, true).subscribe({
            next: (organization: Organization) => {
                if (!organization.users) {
                    return;
                }
                this.users = organization.users;
                this.customRoleService.getCustomRolesByOrganizationId(this.organization.id).subscribe({
                    next: (customRoles: CustomRole[]) : void => {
                        this.users.forEach(user  => {
                            const userRole: CustomRole | undefined = customRoles.find(role => role.id === user.customRole?.id);
                            if (userRole) {
                                user.customRole = userRole;
                            }
                        });
                        this.fallbackManagerService.updateLoading(false);
                    },
                    error: () => {
                        this.fallbackManagerService.updateError('Error fetching custom roles');
                        this.fallbackManagerService.updateLoading(false);
                    }
                });
                this.membersNumber = this.users.length;
                console.log('MembersNumber', this.membersNumber);
            },
            error: () => {
                this.fallbackManagerService.updateError('Error fetching organization users');
                this.fallbackManagerService.updateLoading(false);
            }
        });
    }
}
