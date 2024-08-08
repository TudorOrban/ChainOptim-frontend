import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectUnitOfMeasurementComponent } from '../../../../shared/common/components/select/select-unit-of-measurement/select-unit-of-measurement.component';
import { StandardUnit, UnitMagnitude } from '../../../../shared/enums/unitEnums';
import { CreateFactoryDTO } from '../../models/Factory';
import { User } from '../../../../core/user/model/user';
import { UserService } from '../../../../core/auth/services/user.service';
import { FallbackManagerService } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { FactoryService } from '../../services/factory.service';
import { Router } from '@angular/router';
import { OperationOutcome } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';

@Component({
  selector: 'app-create-factory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectUnitOfMeasurementComponent],
  templateUrl: './create-factory.component.html',
  styleUrl: './create-factory.component.css'
})
export class CreateFactoryComponent implements OnInit {
    currentUser: User | undefined = undefined;
    factoryForm: FormGroup = new FormGroup({});
  
    constructor(
        private fb: FormBuilder,
        private factoryService: FactoryService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
        private router: Router
    ) {}
  
    ngOnInit() {
        this.factoryForm = this.fb.group({
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
        const control = this.factoryForm.get(controlName);
        return (control?.hasError(errorName) && control?.touched) || false;
    }

    onSubmit(): void {
        if (!this.currentUser?.organization?.id) {
            console.error("Missing user");
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

    private getFactoryDTO(): CreateFactoryDTO {
        const factoryDTO: CreateFactoryDTO = {
            name: this.factoryForm.value.name,
            organizationId: this.currentUser?.organization?.id ?? 0
        };

        return factoryDTO;
    }
}