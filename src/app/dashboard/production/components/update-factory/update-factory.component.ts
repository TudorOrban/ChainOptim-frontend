import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateFactoryDTO, Factory } from '../../models/Factory';
import { User } from '../../../../core/user/model/user';
import { UserService } from '../../../../core/auth/services/user.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { FactoryService } from '../../services/factory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationOutcome } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';
import { SelectOrCreateLocationComponent } from '../../../../shared/common/components/select/select-or-create-location/select-or-create-location.component';
import { CreateLocationDTO } from '../../../../shared/common/models/reusableTypes';

@Component({
  selector: 'app-update-factory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectOrCreateLocationComponent],
  templateUrl: './update-factory.component.html',
  styleUrl: './update-factory.component.css'
})
export class UpdateFactoryComponent implements OnInit {
    factoryId: number | undefined = undefined;
    factory: Factory | undefined = undefined;
    currentUser: User | undefined = undefined;
    factoryForm: FormGroup = new FormGroup({});
    createLocation: boolean = false;
    locationId: number = 0;
    newLocationData: CreateLocationDTO = {
        organizationId: 0
    };
    isLocationFormValid: boolean = false;
  
    constructor(
        private factoryService: FactoryService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
    ) {}
  
    ngOnInit() {
        this.factoryForm = this.fb.group({
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
                        this.loadFactory();
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

    private loadFactory(): void {
        this.route.paramMap.subscribe((params) => {
            this.factoryId = parseInt(params.get('factoryId') || "");
            if (!this.factoryId) {
                return;
            }

            this.factoryService
                .getFactoryById(Number(this.factoryId))
                .subscribe({
                    next: (factory) => {
                        console.log('FACTORY', factory);
                        this.factory = factory;
                        this.factoryForm.patchValue({
                            name: factory.name,
                            location: {
                                address: factory.location?.address,
                                city: factory.location?.city,
                                state: factory.location?.state,
                                country: factory.location?.country,
                                zipCode: factory.location?.zipCode,
                                latitude: factory.location?.latitude,
                                longitude: factory.location?.longitude
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
        const control = this.factoryForm.get(controlName);
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

        const factoryDTO = this.getFactoryDTO();        

        this.factoryService.createFactory(factoryDTO).subscribe(
            factory => {
                this.toastService.addToast({ id: 123, title: 'Success', message: 'Factory created successfully.', outcome: OperationOutcome.SUCCESS });
                this.router.navigate(['/dashboard/factories', factory.id]);
            },
            error => {
                this.toastService.addToast({ id: 123, title: 'Error', message: 'Factory creation failed.', outcome: OperationOutcome.ERROR });
                console.error('Error creating factory:', error);
            }
        );
    }

    private isFormInvalid(): boolean {
        return this.factoryForm.invalid || 
            (!this.createLocation && !this.locationId) || 
            (this.createLocation && (!this.isLocationFormValid || 
                (!this.newLocationData || (this.newLocationData as CreateLocationDTO).organizationId === 0)));
    }

    private getFactoryDTO(): CreateFactoryDTO {
        const factoryDTO: CreateFactoryDTO = {
            name: this.factoryForm.value.name,
            organizationId: this.currentUser?.organization?.id ?? 0,
        };
        if (this.createLocation && this.newLocationData) {
            this.newLocationData.organizationId = this.currentUser?.organization?.id ?? 0;
            factoryDTO.location = this.newLocationData;
            factoryDTO.createLocation = true;
        } else if (!this.createLocation && this.locationId) {
            factoryDTO.locationId = this.locationId;
            factoryDTO.createLocation = false;
        }
        console.log('Factory DTO:', factoryDTO);

        return factoryDTO;
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