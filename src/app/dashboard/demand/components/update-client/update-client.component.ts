import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateClientDTO, Client } from '../../models/Client';
import { User } from '../../../../core/user/model/user';
import { UserService } from '../../../../core/auth/services/user.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationOutcome } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';
import { SelectOrCreateLocationComponent } from '../../../../shared/common/components/select/select-or-create-location/select-or-create-location.component';
import { CreateLocationDTO } from '../../../../shared/common/models/reusableTypes';

@Component({
  selector: 'app-update-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectOrCreateLocationComponent],
  templateUrl: './update-client.component.html',
  styleUrl: './update-client.component.css'
})
export class UpdateClientComponent implements OnInit {
    clientId: number | undefined = undefined;
    client: Client | undefined = undefined;
    currentUser: User | undefined = undefined;
    clientForm: FormGroup = new FormGroup({});
    createLocation: boolean = false;
    locationId: number = 0;
    newLocationData: CreateLocationDTO = {
        organizationId: 0
    };
    isLocationFormValid: boolean = false;
  
    constructor(
        private clientService: ClientService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
    ) {}
  
    ngOnInit() {
        this.clientForm = this.fb.group({
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
                        this.loadClient();
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

    private loadClient(): void {
        this.route.paramMap.subscribe((params) => {
            this.clientId = parseInt(params.get('clientId') || "");
            if (!this.clientId) {
                return;
            }

            this.clientService
                .getClientById(Number(this.clientId))
                .subscribe({
                    next: (client) => {
                        this.client = client;
                        this.clientForm.patchValue({
                            name: client.name,
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
        const control = this.clientForm.get(controlName);
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

        const clientDTO = this.getClientDTO();        

        this.clientService.createClient(clientDTO).subscribe(
            client => {
                this.toastService.addToast({ id: 123, title: 'Success', message: 'Client created successfully.', outcome: OperationOutcome.SUCCESS });
                this.router.navigate(['/dashboard/clients', client.id]);
            },
            error => {
                this.toastService.addToast({ id: 123, title: 'Error', message: 'Client creation failed.', outcome: OperationOutcome.ERROR });
                console.error('Error creating client:', error);
            }
        );
    }

    private isFormInvalid(): boolean {
        return this.clientForm.invalid || 
            (!this.createLocation && !this.locationId) || 
            (this.createLocation && (!this.isLocationFormValid || 
                (!this.newLocationData || (this.newLocationData as CreateLocationDTO).organizationId === 0)));
    }

    private getClientDTO(): CreateClientDTO {
        const clientDTO: CreateClientDTO = {
            name: this.clientForm.value.name,
            organizationId: this.currentUser?.organization?.id ?? 0,
        };
        if (this.createLocation && this.newLocationData) {
            this.newLocationData.organizationId = this.currentUser?.organization?.id ?? 0;
            clientDTO.location = this.newLocationData;
            clientDTO.createLocation = true;
        } else if (!this.createLocation && this.locationId) {
            clientDTO.locationId = this.locationId;
            clientDTO.createLocation = false;
        }
        console.log('Client DTO:', clientDTO);

        return clientDTO;
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