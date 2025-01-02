import {Component, Input} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Organization } from '../../../models/organization';
import {
    FallbackManagerService,
    FallbackManagerState
} from "../../../../../shared/fallback/services/fallback-manager/fallback-manager.service";
import {CustomRole, Permissions, FeaturePermissions} from "../../../models/custom-role";
import {CustomRoleService} from "../../../services/custom-role.service";
import {faAngleDown, faAngleUp, faEdit, faPlus, faSave, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {
    GenericConfirmDialogComponent
} from "../../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component";
import {ConfirmDialogInput} from "../../../../../shared/common/models/confirmDialogTypes";
import {OperationOutcome} from "../../../../../shared/common/components/toast-system/toastTypes";
import {ToastService} from "../../../../../shared/common/components/toast-system/toast.service";
import {CreateCustomRoleDTO, UpdateCustomRoleDTO} from "../../../models/dto";
import { PaymentCalculatorService } from '../../../services/paymentcalculator.service';
import { UIUtilService } from '../../../../../shared/common/services/uiutil.service';
import { Feature } from '../../../../../shared/enums/commonEnums';

@Component({
  selector: 'app-organization-custom-roles',
  standalone: true,
  imports: [
      MatExpansionModule,
      FormsModule,
      CommonModule,
      FontAwesomeModule,
      GenericConfirmDialogComponent
  ],
  templateUrl: './organization-custom-roles.component.html',
  styleUrl: './organization-custom-roles.component.css'
})
export class OrganizationCustomRolesComponent {
    @Input() organization: Organization | null = null;

    customRoles: CustomRole[] = [];

    temporaryRole?: CustomRole;
    initialPermissions: Permissions | undefined = undefined;
    editedRoleId: number | undefined = undefined;
    isDeleteModeOn: boolean = false;
    toBeDeletedRoleId: number | undefined = undefined;
    isConfirmDialogOpen: boolean = false;
    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: 'Delete Role',
        dialogMessage: 'Are you sure you want to delete this role? All members having it will lose their privileges.',
    };

    fallbackManagerState: FallbackManagerState = {};

    calculatorService: PaymentCalculatorService;
    uiUtilService: UIUtilService;

    faEdit = faEdit;
    faPlus = faPlus;
    faTrash = faTrash;
    faXmark = faXmark;
    faAngleDown = faAngleDown;
    faAngleUp = faAngleUp;
    faSave = faSave;

    constructor(
        private readonly customRoleService: CustomRoleService,
        private readonly fallbackManagerService: FallbackManagerService,
        private readonly toastService: ToastService,
        calculatorService: PaymentCalculatorService,
        uiUtilService: UIUtilService
    ) {
        this.calculatorService = calculatorService;
        this.uiUtilService = uiUtilService;
    }

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
                this.customRoles = customRoles.map(role => ({
                    ...role,
                    permissions: {
                        ...role.permissions,
                        featurePermissions: this.initializeNullPermissions(role.permissions.featurePermissions)
                    }
                }));
                this.fallbackManagerService.updateLoading(false);
                console.log('Custom roles:', customRoles);
            },
            error: () : void => {
                this.fallbackManagerService.updateError('Error fetching custom roles');
            }
        })
    }

    private initializeNullPermissions(featurePermissions?: Record<string, FeaturePermissions>): Record<string, FeaturePermissions> {
        const initializedPermissions: Record<string, FeaturePermissions> = {};

        if (featurePermissions) {
            for (const key in featurePermissions) {
                initializedPermissions[key] = featurePermissions[key] || { canRead: false, canCreate: false, canUpdate: false, canDelete: false };
            }
        } else {
            for (const key in Feature) {
                initializedPermissions[key] = { canRead: false, canCreate: false, canUpdate: false, canDelete: false };
            }
        }

        return initializedPermissions;
    }

    // Handlers
    // - Add
    addTemporaryRole(): void {
        console.log('Adding temporary role');
        this.temporaryRole = {
            id: 0,
            name: 'New Role',
            permissions: {
                featurePermissions: this.initializeNullPermissions()
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            organizationId: this.organization?.id ?? 0
        };
    }

    saveTemporaryRole(): void {
        if (!this.temporaryRole) return;

        const roleDTO: CreateCustomRoleDTO = {
            name: this.temporaryRole.name,
            permissions: this.temporaryRole.permissions,
            organizationId: this.temporaryRole.organizationId
        };

        this.customRoleService.createCustomRole(roleDTO).subscribe({
            next: (createdRole: CustomRole) => {
                console.log('Role created:', createdRole);
                this.customRoles.push(createdRole);
                this.temporaryRole = undefined;
                this.toastService.addToast({
                    id: 0,
                    title: 'Role created',
                    message: 'Role created successfully',
                    outcome: OperationOutcome.SUCCESS
                });
            },
            error: (error) => {
                console.error('Error creating role:', error);
                this.toastService.addToast({
                    id: 0,
                    title: 'Error creating role',
                    message: 'Error creating role',
                    outcome: OperationOutcome.ERROR
                });
            }
        });
    }

    cancelAddRole(): void {
        this.temporaryRole = undefined;
    }

    // - Edit
    editRole(event: MouseEvent, roleId: number): void {
        event.stopPropagation();

        if (this.editedRoleId === roleId) {
            return;
        }

        const role = this.customRoles.find(role => role.id === roleId);
        if (role) {
            // Creating a deep copy of permissions
            this.initialPermissions = JSON.parse(JSON.stringify(role.permissions));
            console.log("Initial permissions set:", this.initialPermissions);
        }
        this.editedRoleId = roleId;
    }

    saveEditedRole(event: MouseEvent): void {
        event.stopPropagation();
        console.log('Saving role:', this.editedRoleId);
        const editedRole = this.customRoles.find(role => role.id === this.editedRoleId);
        if (!editedRole) {
            return;
        }

        const roleDTO: UpdateCustomRoleDTO = {
            id: editedRole.id,
            name: editedRole.name,
            permissions: editedRole.permissions ?? {}
        };

        this.customRoleService.updateCustomRole(roleDTO).subscribe({
            next: (updatedRole: CustomRole) => {
                console.log('Role updated:', updatedRole);
                this.editedRoleId = undefined;
                this.initialPermissions = undefined;
                this.toastService.addToast({
                    id: 0,
                    title: 'Role updated',
                    message: 'Role updated successfully',
                    outcome: OperationOutcome.SUCCESS
                });
            },
            error: (error) => {
                console.error('Error updating role:', error);
                this.toastService.addToast({
                    id: 0,
                    title: 'Error updating role',
                    message: 'Error updating role',
                    outcome: OperationOutcome.ERROR
                });
            }
        });
    }

    cancelEditRole(event: MouseEvent): void {
        event.stopPropagation();
        this.customRoles = this.customRoles.map(role => {
            if (role.id === this.editedRoleId) {
                return {
                    ...role,
                    permissions: this.initialPermissions ?? role.permissions
                }
            }
            return role;
        });
        this.editedRoleId = undefined;
    }

    // - Delete
    toggleDeleteMode(): void {
        this.isDeleteModeOn = !this.isDeleteModeOn;
    }

    openDeleteConfirmDialog(event: MouseEvent, roleId: number): void {
        event.stopPropagation();
        this.toBeDeletedRoleId = roleId;
        this.isConfirmDialogOpen = true;
    }

    handleDeleteRole(): void {
        console.log('Deleting role:', this.toBeDeletedRoleId);
        if (!this.toBeDeletedRoleId) {
            console.error('No role ID to delete');
            return;
        }

        this.customRoleService.deleteCustomRole(this.toBeDeletedRoleId).subscribe({
            next: () => {
                this.customRoles = this.customRoles.filter(role => role.id !== this.toBeDeletedRoleId);
                this.toBeDeletedRoleId = undefined;
                this.isConfirmDialogOpen = false;
                this.toastService.addToast({
                    id: 0,
                    title: 'Role deleted',
                    message: 'Role deleted successfully',
                    outcome: OperationOutcome.SUCCESS
                });
            },
            error: (error) => {
                console.error('Error deleting role:', error);
                this.toastService.addToast({
                    id: 0,
                    title: 'Error deleting role',
                    message: 'Error deleting role',
                    outcome: OperationOutcome.ERROR
                });
            }
        });
    }

    handleCancelDelete(): void {
        this.toBeDeletedRoleId = undefined;
        this.isConfirmDialogOpen = false;
    }
}
