import { Component } from '@angular/core';
import { Organization, UpdateOrganizationDTO } from '../../../models/organization';
import { User } from '../../../../../core/user/model/user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../../core/user/services/user.service';
import { FallbackManagerService } from '../../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { ToastService } from '../../../../../shared/common/components/toast-system/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../../../services/organization.service';
import { OperationOutcome } from '../../../../../shared/common/components/toast-system/toastTypes';

@Component({
  selector: 'app-update-organization',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-organization.component.html',
  styleUrl: './update-organization.component.css'
})
export class UpdateOrganizationComponent {
    organizationId: number | undefined = undefined;
    organization: Organization | undefined = undefined;
    currentUser: User | undefined = undefined;
    organizationForm: FormGroup = new FormGroup({});
    
    constructor(
        private userService: UserService,
        private organizationService: OrganizationService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
    ) {}

    
    ngOnInit(): void {
        this.organizationForm = this.fb.group({
            name: ["", [Validators.required, Validators.minLength(3)]],
            address: ["", [Validators.maxLength(200)]],
            contactInfo: ["", [Validators.maxLength(200)]]
        });

        this.loadData();
    }

    private loadData(): void {
        this.userService.getCurrentUser().subscribe((user) => {
            if (!user) {
                return;
            }
            this.currentUser = user;
            if (!this.currentUser?.organization) {
                console.error("User does not have an organization");
                return;
            }
            
            this.loadOrganization();    
        });
    }

    private loadOrganization(): void {
        this.route.paramMap.subscribe((params) => {
            this.organizationId = parseInt(params.get('organizationId') ?? "");
            if (!this.organizationId) {
                console.error("Organization ID is not valid");
                return;
            }
            if (this.organizationId !== this.currentUser?.organization?.id) {
                console.error("User does not have permission to update this organization");
                return;
            }   
            this.organization = this.currentUser.organization;

            this.organizationForm.patchValue({
                name: this.organization?.name,
                address: this.organization?.address ?? '',
                contactInfo: this.organization?.contactInfo ?? '',
            });
        });
    }

    onSubmit(): void {
        if (!this.organizationId || this.organizationForm.invalid) {
            console.error('Organization ID is not valid');
            return;
        }

        const updateOrganizationDTO = this.getUpdateOrganizationDTO();

        this.organizationService.updateOrganization(updateOrganizationDTO).subscribe({  
            next: (organization) => {
                this.toastService.addToast({
                    id: 0,
                    title: 'Organization Updated',
                    message: 'The Organization has been successfully updated',
                    outcome: OperationOutcome.SUCCESS,
                })
                this.router.navigate([`dashboard/organization`]);
            },
            error: (error) => {
                console.error('Error updating organization:', error);
                this.toastService.addToast({
                    id: 0,
                    title: 'Error Updating Organization',
                    message: 'An error occurred while updating the organization',
                    outcome: OperationOutcome.ERROR,
                });
            }
        });

    }

    private getUpdateOrganizationDTO(): UpdateOrganizationDTO {
        return {
            id: this.organizationId ?? 0,
            name: this.organizationForm.get('name')?.value,
            address: this.organizationForm.get('address')?.value,
            contactInfo: this.organizationForm.get('contactInfo')?.value,
        };
    }

}
