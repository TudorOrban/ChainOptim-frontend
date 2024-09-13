import {Component, Input, OnInit} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Organization } from '../../../models/organization';
import {
    FallbackManagerService,
    FallbackManagerState
} from "../../../../../shared/fallback/services/fallback-manager/fallback-manager.service";
import {CustomRole, Permissions, FeaturePermissions} from "../../../models/custom-role";
import {CustomRoleService} from "../../../services/custom-role.service";
import {faAngleDown, faAngleUp, faEdit, faPlus, faSave, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {RouterLink} from "@angular/router";
import {FaIconComponent, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {CommonModule, NgClass} from "@angular/common";
import {
    GenericConfirmDialogComponent
} from "../../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component";
import {ConfirmDialogInput} from "../../../../../shared/common/models/confirmDialogTypes";
import {OperationOutcome} from "../../../../../shared/common/components/toast-system/toastTypes";
import {ToastService} from "../../../../../shared/common/components/toast-system/toast.service";
import {CreateCustomRoleDTO, UpdateCustomRoleDTO} from "../../../models/dto";
import { PaymentCalculatorService } from '../../../services/paymentcalculator.service';
import { UIUtilService } from '../../../../../shared/common/services/uiutil.service';

@Component({
  selector: 'app-organization-custom-roles-new',
  standalone: true,
  imports: [
      RouterLink,
      MatExpansionModule,
      FormsModule,
      CommonModule,
      FontAwesomeModule,
      GenericConfirmDialogComponent
  ],
  templateUrl: './organization-custom-roles-new.component.html',
  styleUrl: './organization-custom-roles-new.component.css'
})
export class OrganizationCustomRolesNewComponent {
    @Input() organization: Organization | null = null;

    customRoles: CustomRole[] = [];

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
        private customRoleService: CustomRoleService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
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
        const defaultPermissions: FeaturePermissions = { canRead: false, canCreate: false, canUpdate: false, canDelete: false };
        
        if (featurePermissions) {
            for (const key in featurePermissions) {
            initializedPermissions[key] = featurePermissions[key] || defaultPermissions;
            }
        }
        
        return initializedPermissions;
    }
      
}
