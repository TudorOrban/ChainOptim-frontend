import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateWarehouseDTO, Warehouse } from '../../models/Warehouse';
import { User } from '../../../../core/user/model/user';
import { UserService } from '../../../../core/user/services/user.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { WarehouseService } from '../../services/warehouse.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationOutcome } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';
import { SelectOrCreateLocationComponent } from '../../../../shared/common/components/select/select-or-create-location/select-or-create-location.component';
import { CreateLocationDTO } from '../../../../shared/common/models/reusableTypes';

@Component({
  selector: 'app-update-warehouse',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectOrCreateLocationComponent],
  templateUrl: './update-warehouse.component.html',
  styleUrl: './update-warehouse.component.css'
})
export class UpdateWarehouseComponent implements OnInit {
    warehouseId: number | undefined = undefined;
    warehouse: Warehouse | undefined = undefined;
    currentUser: User | undefined = undefined;
    warehouseForm: FormGroup = new FormGroup({});
    createLocation: boolean = false;
    locationId: number = 0;
    newLocationData: CreateLocationDTO = {
        organizationId: 0
    };
    isLocationFormValid: boolean = false;
  
    constructor(
        private warehouseService: WarehouseService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
    ) {}
  
    ngOnInit() {
        this.warehouseForm = this.fb.group({
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
                        this.loadWarehouse();
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

    private loadWarehouse(): void {
        this.route.paramMap.subscribe((params) => {
            this.warehouseId = parseInt(params.get('warehouseId') || "");
            if (!this.warehouseId) {
                return;
            }

            this.warehouseService
                .getWarehouseById(Number(this.warehouseId))
                .subscribe({
                    next: (warehouse) => {
                        this.warehouse = warehouse;
                        this.warehouseForm.patchValue({
                            name: warehouse.name,
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
        const control = this.warehouseForm.get(controlName);
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

        const warehouseDTO = this.getWarehouseDTO();        

        this.warehouseService.createWarehouse(warehouseDTO).subscribe(
            warehouse => {
                this.toastService.addToast({ id: 123, title: 'Success', message: 'Warehouse created successfully.', outcome: OperationOutcome.SUCCESS });
                this.router.navigate(['/dashboard/warehouses', warehouse.id]);
            },
            error => {
                this.toastService.addToast({ id: 123, title: 'Error', message: 'Warehouse creation failed.', outcome: OperationOutcome.ERROR });
                console.error('Error creating warehouse:', error);
            }
        );
    }

    private isFormInvalid(): boolean {
        return this.warehouseForm.invalid || 
            (!this.createLocation && !this.locationId) || 
            (this.createLocation && (!this.isLocationFormValid || 
                (!this.newLocationData || (this.newLocationData as CreateLocationDTO).organizationId === 0)));
    }

    private getWarehouseDTO(): CreateWarehouseDTO {
        const warehouseDTO: CreateWarehouseDTO = {
            name: this.warehouseForm.value.name,
            organizationId: this.currentUser?.organization?.id ?? 0,
        };
        if (this.createLocation && this.newLocationData) {
            this.newLocationData.organizationId = this.currentUser?.organization?.id ?? 0;
            warehouseDTO.location = this.newLocationData;
            warehouseDTO.createLocation = true;
        } else if (!this.createLocation && this.locationId) {
            warehouseDTO.locationId = this.locationId;
            warehouseDTO.createLocation = false;
        }
        console.log('Warehouse DTO:', warehouseDTO);

        return warehouseDTO;
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