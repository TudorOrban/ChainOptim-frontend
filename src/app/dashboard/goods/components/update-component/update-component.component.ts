import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectUnitOfMeasurementComponent } from '../../../../shared/common/components/select/select-unit-of-measurement/select-unit-of-measurement.component';
import { UnitOfMeasurement } from '../../models/UnitOfMeasurement';
import { StandardUnit, UnitMagnitude } from '../../../../shared/enums/unitEnums';
import { Component as ProdComponent, UpdateComponentDTO } from '../../models/Component';
import { User } from '../../../../core/user/model/user';
import { UserService } from '../../../../core/user/services/user.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { ComponentService } from '../../services/component.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationOutcome } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';

@Component({
  selector: 'app-update-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectUnitOfMeasurementComponent],
  templateUrl: './update-component.component.html',
  styleUrl: './update-component.component.css'
})
export class UpdateComponentComponent implements OnInit {
    componentId: number | undefined = undefined;
    component: ProdComponent | undefined = undefined;
    currentUser: User | undefined = undefined;
    componentForm: FormGroup = new FormGroup({});
    unitOfMeasurement: UnitOfMeasurement = { standardUnit: StandardUnit.KILOGRAM, unitMagnitude: UnitMagnitude.BASE };
  
    constructor(
        private readonly componentService: ComponentService,
        private readonly userService: UserService,
        private readonly fallbackManagerService: FallbackManagerService,
        private readonly toastService: ToastService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly fb: FormBuilder,
    ) {}
  
    ngOnInit() {
        this.componentForm = this.fb.group({
            name: ["", [Validators.required, Validators.minLength(3)]],
            description: ["", [Validators.maxLength(200)]]
        });

        this.loadUser();
        this.loadComponent();
    }

    private loadUser() {
        this.userService.getCurrentUser().subscribe((user) => {
            if (!user) {
                return;
            }
            this.currentUser = user;
        });
    }

    private loadComponent() {
        this.route.paramMap.subscribe((params) => {
            this.componentId = parseInt(params.get('componentId') ?? "");
            if (!this.componentId) {
                return;
            }

            this.componentService
                .getComponentById(Number(this.componentId))
                .subscribe({
                    next: (component) => {
                        console.log('COMPONENT', component);
                        this.component = component;
                        this.componentForm.patchValue({
                            name: component.name,
                            description: component.description ?? ''
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

        this.componentService.updateComponent(componentDTO).subscribe(
            component => {
                this.toastService.addToast({ id: 123, title: 'Success', message: 'Component updated successfully.', outcome: OperationOutcome.SUCCESS });
                this.router.navigate(['/dashboard/components', component.id]);
            },
            error => {
                this.toastService.addToast({ id: 123, title: 'Error', message: 'Component update failed.', outcome: OperationOutcome.ERROR });
                console.error('Error updating component:', error);
            }
        );
    }

    private getComponentDTO(): UpdateComponentDTO {
        const componentDTO: UpdateComponentDTO = {
            id: this.componentId ?? 0,
            name: this.componentForm.value.name,
            description: this.componentForm.value.description,
            unit: this.unitOfMeasurement,
            organizationId: this.currentUser?.organization?.id ?? 0
        };

        return componentDTO;
    }
}