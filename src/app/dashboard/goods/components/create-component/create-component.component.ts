import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectUnitOfMeasurementComponent } from '../../../../shared/common/components/select/select-unit-of-measurement/select-unit-of-measurement.component';
import { UnitOfMeasurement } from '../../models/UnitOfMeasurement';
import { StandardUnit, UnitMagnitude } from '../../../../shared/enums/unitEnums';
import { CreateComponentDTO } from '../../models/Component';
import { User } from '../../../../core/user/model/user';
import { UserService } from '../../../../core/user/services/user.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { ComponentService } from '../../services/component.service';
import { Router } from '@angular/router';
import { OperationOutcome } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';

@Component({
  selector: 'app-create-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectUnitOfMeasurementComponent],
  templateUrl: './create-component.component.html',
  styleUrl: './create-component.component.css'
})
export class CreateComponentComponent implements OnInit {
    currentUser: User | undefined = undefined;
    componentForm: FormGroup = new FormGroup({});
    unitOfMeasurement: UnitOfMeasurement = { standardUnit: StandardUnit.METER, unitMagnitude: UnitMagnitude.BASE};
  
    constructor(
        private fb: FormBuilder,
        private componentService: ComponentService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
        private router: Router
    ) {}
  
    ngOnInit() {
        this.componentForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.maxLength(200)]]
        });

        this.loadCurrentUser();
    }

    private loadCurrentUser() {
        this.userService
            .getCurrentUser()
            .subscribe({
                next: (user) => {
                    if (user) {
                        this.currentUser = user;
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

    hasError(controlName: string, errorName: string): boolean {
        const control = this.componentForm.get(controlName);
        return (control?.hasError(errorName) && control?.touched) || false;
    }
    
    onUnitChange(unitData: UnitOfMeasurement) {
        this.unitOfMeasurement = unitData;
    }

    onSubmit(): void {
        if (!this.currentUser?.organization?.id) {
            console.error("Missing user");
            return;
        }

        const componentDTO = this.getComponentDTO();        

        this.componentService.createComponent(componentDTO).subscribe(
            component => {
                this.toastService.addToast({ id: 123, title: 'Success', message: 'Component created successfully.', outcome: OperationOutcome.SUCCESS });
                this.router.navigate(['/dashboard/components', component.id]);
            },
            error => {
                this.toastService.addToast({ id: 123, title: 'Error', message: 'Component creation failed.', outcome: OperationOutcome.ERROR });
                console.error('Error creating component:', error);
            }
        );
    }

    private getComponentDTO(): CreateComponentDTO {
        const componentDTO: CreateComponentDTO = {
            name: this.componentForm.value.name,
            description: this.componentForm.value.description,
            newUnit: this.unitOfMeasurement,
            organizationId: this.currentUser?.organization?.id ?? 0
        };

        return componentDTO;
    }
}