import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateSupplierDTO, Supplier } from '../../models/Supplier';
import { User } from '../../../../core/user/model/user';
import { UserService } from '../../../../core/auth/services/user.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { SupplierService } from '../../services/supplier.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationOutcome } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';
import { SelectOrCreateLocationComponent } from '../../../../shared/common/components/select/select-or-create-location/select-or-create-location.component';
import { CreateLocationDTO } from '../../../../shared/common/models/reusableTypes';

@Component({
  selector: 'app-update-supplier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectOrCreateLocationComponent],
  templateUrl: './update-supplier.component.html',
  styleUrl: './update-supplier.component.css'
})
export class UpdateSupplierComponent implements OnInit {
    supplierId: number | undefined = undefined;
    supplier: Supplier | undefined = undefined;
    currentUser: User | undefined = undefined;
    supplierForm: FormGroup = new FormGroup({});
    createLocation: boolean = false;
    locationId: number = 0;
    newLocationData: CreateLocationDTO = {
        organizationId: 0
    };
    isLocationFormValid: boolean = false;
  
    constructor(
        private supplierService: SupplierService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
    ) {}
  
    ngOnInit() {
        this.supplierForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.maxLength(200)]]
        });

        this.loadData();
    }

    private loadData() {
        this.userService
            .getCurrentUser()
            .subscribe({
                next: (user) => {
                    if (user) {
                        this.currentUser = user;
                        this.loadSupplier();
                    }
                    this.fallbackManagerService.updateLoading(false);
                },
                error: (error: Error) => {
                    this.fallbackManagerService.updateError(
                        error.message ?? ''
                    );
                    this.fallbackManagerService.updateLoading(false);
                },
            });
    }

    private loadSupplier(): void {
        this.route.paramMap.subscribe((params) => {
            this.supplierId = parseInt(params.get('supplierId') || "");
            if (!this.supplierId) {
                return;
            }

            this.supplierService
                .getSupplierById(Number(this.supplierId))
                .subscribe({
                    next: (supplier) => {
                        console.log('SUPPLIER', supplier);
                        this.supplier = supplier;
                        this.supplierForm.patchValue({
                            name: supplier.name,
                            location: {
                                address: supplier.location?.address,
                                city: supplier.location?.city,
                                state: supplier.location?.state,
                                country: supplier.location?.country,
                                zipCode: supplier.location?.zipCode,
                                latitude: supplier.location?.latitude,
                                longitude: supplier.location?.longitude
                            }
                        });
                        this.fallbackManagerService.updateLoading(false);
                    },

                    error: (error: Error) => {
                        this.fallbackManagerService.updateError(
                            error.message ?? ''
                        );
                        this.fallbackManagerService.updateLoading(false);
                    },
                });
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        const control = this.supplierForm.get(controlName);
        return (control?.hasError(errorName) && control?.touched) || false;
    }

    onSubmit(): void {
        if (!this.currentUser?.organization?.id) {
            console.error("Missing user");
            return;
        }
        const isFormInvalid = this.isFormInvalid();
        if (isFormInvalid) {
            this.toastService.addToast({ id: 123, title: 'Error', message: 'Some of the inputs are not valid.', outcome: OperationOutcome.ERROR });
            return;
        }

        const supplierDTO = this.getSupplierDTO();        

        this.supplierService.createSupplier(supplierDTO).subscribe(
            supplier => {
                this.toastService.addToast({ id: 123, title: 'Success', message: 'Supplier created successfully.', outcome: OperationOutcome.SUCCESS });
                this.router.navigate(['/dashboard/suppliers', supplier.id]);
            },
            error => {
                this.toastService.addToast({ id: 123, title: 'Error', message: 'Supplier creation failed.', outcome: OperationOutcome.ERROR });
                console.error('Error creating supplier:', error);
            }
        );
    }

    private isFormInvalid(): boolean {
        return this.supplierForm.invalid || 
            (!this.createLocation && !this.locationId) || 
            (this.createLocation && (!this.isLocationFormValid || 
                (!this.newLocationData || (this.newLocationData as CreateLocationDTO).organizationId === 0)));
    }

    private getSupplierDTO(): CreateSupplierDTO {
        const supplierDTO: CreateSupplierDTO = {
            name: this.supplierForm.value.name,
            organizationId: this.currentUser?.organization?.id ?? 0,
        };
        if (this.createLocation && this.newLocationData) {
            this.newLocationData.organizationId = this.currentUser?.organization?.id ?? 0;
            supplierDTO.location = this.newLocationData;
            supplierDTO.createLocation = true;
        } else if (!this.createLocation && this.locationId) {
            supplierDTO.locationId = this.locationId;
            supplierDTO.createLocation = false;
        }
        console.log('Supplier DTO:', supplierDTO);

        return supplierDTO;
    }

    
    handleLocationChoice(choice: string) {
        this.createLocation = (choice === 'create');
    }

    handleLocationSelection(locationId: number) {
        this.locationId = locationId;
    }

    handleNewLocationData(locationData: CreateLocationDTO) {
        this.newLocationData = locationData;
    }

    handleLocationFormValidity(isValid: boolean) {
        this.isLocationFormValid = isValid;
    }
}