import { Component } from '@angular/core';
import { Organization } from '../../../models/organization';
import { User } from '../../../../../core/user/model/user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../../core/auth/services/user.service';
import { FallbackManagerService } from '../../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { ToastService } from '../../../../../shared/common/components/toast-system/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
    ) {}

    
    ngOnInit() {
        this.organizationForm = this.fb.group({
            name: ["", [Validators.required, Validators.minLength(3)]],
            address: ["", [Validators.maxLength(200)]],
            contactInfo: ["", [Validators.maxLength(200)]]
        });

        this.loadOrganization();
    }

    private loadOrganization() {
        this.userService.getCurrentUser().subscribe((user) => {
            if (!user) {
                return;
            }
            this.currentUser = user;
            if (!this.currentUser?.organization) {
                console.error("User does not have an organization");
                return;
            }
            
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
        });
    }

    onSubmit(): void {
        console.log('SUBMIT');
    }
}
