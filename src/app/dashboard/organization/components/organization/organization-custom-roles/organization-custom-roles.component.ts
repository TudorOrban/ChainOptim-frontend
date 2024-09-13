import {Component, Input, OnInit} from '@angular/core';
import { Organization } from '../../../models/organization';
import {
    FallbackManagerService,
    FallbackManagerState
} from "../../../../../shared/fallback/services/fallback-manager/fallback-manager.service";
import {CustomRole, Permissions, FeaturePermissions} from "../../../models/custom-role";
import {CustomRoleService} from "../../../services/custom-role.service";
import {faAngleDown, faAngleUp, faEdit, faPlus, faSave, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {
    GenericConfirmDialogComponent
} from "../../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component";
import {ConfirmDialogInput} from "../../../../../shared/common/models/confirmDialogTypes";
import {OperationOutcome} from "../../../../../shared/common/components/toast-system/toastTypes";
import {ToastService} from "../../../../../shared/common/components/toast-system/toast.service";
import {CreateCustomRoleDTO, UpdateCustomRoleDTO} from "../../../models/dto";

@Component({
  selector: 'app-organization-custom-roles',
  standalone: true,
    imports: [
        RouterLink,
        FaIconComponent,
        FormsModule,
        NgClass,
        GenericConfirmDialogComponent
    ],
  templateUrl: './organization-custom-roles.component.html',
  styleUrl: './organization-custom-roles.component.css'
})
export class OrganizationCustomRolesComponent implements OnInit {
    @Input({required: true}) organization!: Organization;
    @Input() updateCustomRoleDTO?: UpdateCustomRoleDTO;
    @Input() createCustomRoleDTO?: CreateCustomRoleDTO;
    createLink: string = '';
    fallbackManagerState: FallbackManagerState = {};
    customRolesNumber: number = 0;
    customRoles: CustomRole[] = [];
    showPermissions: { [key: number]: boolean } = {};
    isEditing: { [key: number]: boolean } = {};
    isDeleting: boolean = false;
    isConfirmDialogOpen: boolean = false;
    selectedRoleId!: number;

    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: 'Delete Custom Role',
        dialogMessage: 'Are you sure you want to delete this custom role?',
    };

    constructor(
        private customRoleService: CustomRoleService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService
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
    
    // getPermissionsArray(permissions: Permissions): { feature: string, permissions: FeaturePermissions }[] {
    //     return Object.keys(permissions)
    //         .filter(key => key !== 'organization')
    //         .map(key => ({
    //             feature: key,
    //             permissions: {
    //                 ...permissions[key as keyof Permissions],
    //                 featurePermissions: {}
    //             }
    //         }));
    // }

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

    // Delete
    expandDeleteButtons() {
        this.isDeleting = !this.isDeleting;
    }

    openConfirmDialog(roleId: number) {
        this.isConfirmDialogOpen = true;
        this.selectedRoleId = roleId;
    }

    handleDeleteCustomRole(roleId: number) {
        this.customRoleService
            .deleteCustomRole(roleId)
            .subscribe({
                next: (success) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Custom role deleted successfully.',
                        outcome: OperationOutcome.SUCCESS
                    });
                    this.isConfirmDialogOpen = false;
                    // this.fetchCustomRoles();
                },
                error: (error: Error) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Custom role deletion failed.',
                        outcome: OperationOutcome.ERROR
                    });
                    console.error('Error deleting custom role:', error);
                },
            });
        this.handleCancel();
    }

    handleCancel() {
        this.isConfirmDialogOpen = false;
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
    protected readonly faXmark = faXmark;
    protected readonly faSave = faSave;
    protected readonly faTrash = faTrash;
}
