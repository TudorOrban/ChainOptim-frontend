import {Component, Input, OnInit} from '@angular/core';
import { Organization } from '../../../models/organization';
import {
    FallbackManagerService,
    FallbackManagerState
} from "../../../../../shared/fallback/services/fallback-manager/fallback-manager.service";
import {CustomRole, Permissions, FeaturePermissions} from "../../../models/custom-role";
import {CustomRoleService} from "../../../services/custom-role.service";
import {faAngleDown, faAngleUp, faCancel, faEdit, faPlus, faSave, faXmark} from "@fortawesome/free-solid-svg-icons";
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-organization-custom-roles',
  standalone: true,
    imports: [
        RouterLink,
        FaIconComponent,
        FormsModule,
        NgClass
    ],
  templateUrl: './organization-custom-roles.component.html',
  styleUrl: './organization-custom-roles.component.css'
})
export class OrganizationCustomRolesComponent implements OnInit {
    @Input({required: true}) organization!: Organization;
    createLink: string = '';
    fallbackManagerState: FallbackManagerState = {};
    customRolesNumber: number = 0;
    customRoles: CustomRole[] = [];
    showPermissions: { [key: number]: boolean } = {};
    isEditing: { [key: number]: boolean } = {};

    constructor(
        private customRoleService: CustomRoleService,
        private fallbackManagerService: FallbackManagerService
    ) {}

    ngOnInit() {
        this.fetchCustomRoles();

        // Manage fallbacks
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        })
        this.fallbackManagerService.updateLoading(true);
    }

    private fetchCustomRoles(): void {
        if (!this.organization) {
            this.fallbackManagerService.updateError('Organization not found');
            return;
        }
        this.customRoleService.getCustomRolesByOrganizationId(this.organization.id).subscribe({
            next: (customRoles: CustomRole[]) : void => {
                this.customRoles = customRoles;
                this.customRolesNumber = customRoles.length;
                this.fallbackManagerService.updateLoading(false);
            },
            error: () : void => {
                this.fallbackManagerService.updateError('Error fetching custom roles');
            }
        })
    }

    getPermissionsArray(permissions: Permissions): { feature: string, permissions: FeaturePermissions }[] {
        return Object.keys(permissions)
            .filter(key => key !== 'organization')
            .map(key => ({
                feature: key,
                permissions: permissions[key as keyof Permissions]
            }));
    }

    areAllPermissionsGranted(permissions: Permissions, action: keyof FeaturePermissions): boolean {
        for (const key in permissions) {
            if (permissions.hasOwnProperty(key) && key !== 'organization') {
                const featurePermissions = permissions[key as keyof Permissions] as FeaturePermissions;
                if (!featurePermissions || !featurePermissions[action]) {
                    return false;
                }
            }
        }
        return true;
    }

    togglePermissions(roleId: number): void {
        this.showPermissions[roleId] = !this.showPermissions[roleId];
    }

    editRole(roleId: number) {
        this.isEditing[roleId] = true;
    }

    cancelEdit(roleId: number) {
        this.isEditing[roleId] = false;
    }

    saveEdit(roleId: number) {
        this.isEditing[roleId] = false
    }

    protected readonly faPlus = faPlus;
    protected readonly faEdit = faEdit;
    protected readonly faAngleDown = faAngleDown;
    protected readonly faAngleUp = faAngleUp;
    protected readonly faCancel = faCancel;
    protected readonly faXmark = faXmark;
    protected readonly faSave = faSave;
}
