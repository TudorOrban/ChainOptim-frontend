import { Component, Input } from '@angular/core';
import { User } from '../../../../../../../core/user/model/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../../../../shared/common/components/toast-system/toast.service';
import { UserService } from '../../../../../../../core/auth/services/user.service';
import { FallbackManagerService } from '../../../../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { FactoryStageService } from '../../../../../services/factorystage.service';
import { UpdateFactoryStageDTO } from '../../../../../models/Factory';
import { OperationOutcome } from '../../../../../../../shared/common/components/toast-system/toastTypes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-factory-stage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-factory-stage.component.html',
  styleUrl: './update-factory-stage.component.css'
})
export class UpdateFactoryStageComponent {
    @Input() inputData: { factoryId: number, factoryStageId: number } | undefined = undefined;

    currentUser: User | undefined = undefined;
    factoryStageForm: FormGroup = new FormGroup({});
  
    constructor(
        private fb: FormBuilder,
        private factoryStageService: FactoryStageService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
    ) {}
  
    ngOnInit() {
        this.initializeForm();

        this.loadData();
    }

    private initializeForm() {
        this.factoryStageForm = this.fb.group({
            capacity: ['', [   
                Validators.min(0),
                Validators.pattern("^-?[0-9]+(\.[0-9]+)?$")
            ]],
            duration: ['', [
                Validators.min(0),
                Validators.pattern("^-?[0-9]+(\.[0-9]+)?$")
            ]],
            priority: ['', [
                Validators.min(0),
                Validators.pattern("^-?[0-9]+(\.[0-9]+)?$")
            ]],
            minimumRequiredCapacity: ['', [
                Validators.min(0),
                Validators.pattern("^-?[0-9]+(\.[0-9]+)?$")
            ]],
        });
    }

    private loadData() {
        this.loadCurrentUser();
    }

    private loadCurrentUser() {
        this.userService
            .getCurrentUser()
            .subscribe({
                next: (user) => {
                    
                    this.fallbackManagerService.updateLoading(false);
                    if (!user) {
                        return;
                    }
                    this.currentUser = user;

                    this.loadFactoryStage();
                },
                error: (error: Error) => {
                    this.fallbackManagerService.updateError(
                        error.message ?? ''
                    );
                    this.fallbackManagerService.updateLoading(false);
                },
            });
    }

    private loadFactoryStage() {
        this.factoryStageService.getFactoryStageById(this.inputData?.factoryStageId ?? 0)
            .subscribe(factoryStage => {
                this.factoryStageForm.patchValue({
                    capacity: factoryStage.capacity,
                    duration: factoryStage.duration,
                    priority: factoryStage.priority,
                    minimumRequired: factoryStage.minimumRequiredCapacity
                });
            });
    }


    hasError(controlName: string, errorName: string): boolean {
        const control = this.factoryStageForm.get(controlName);
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

        const factoryStageDTO = this.getFactoryStageDTO();        

        this.factoryStageService.updateFactoryStage(factoryStageDTO).subscribe(
            factory => {
                this.toastService.addToast({ id: 123, title: 'Success', message: 'Factory stage updated successfully.', outcome: OperationOutcome.SUCCESS });
            },
            error => {
                this.toastService.addToast({ id: 123, title: 'Error', message: 'Factory stage update failed.', outcome: OperationOutcome.ERROR });
                console.error('Error updating factory stage:', error);
            }
        );
    }

    private isFormInvalid(): boolean {
        return this.factoryStageForm.invalid;
    }

    private getFactoryStageDTO(): UpdateFactoryStageDTO {
        console.log('Factory ID:', this.inputData?.factoryId);
        console.log('Factory Stage ID:', this.inputData?.factoryStageId);
        if (!this.inputData?.factoryId || !this.inputData?.factoryStageId) {
            throw new Error('Factory ID and Factory Stage ID is required');
        }

        const factoryStageDTO: UpdateFactoryStageDTO = {
            id: this.inputData?.factoryStageId ?? 0,
            factoryId: this.inputData?.factoryId,
            organizationId: this.currentUser?.organization?.id ?? 0,
            capacity: this.factoryStageForm.value.capacity,
            duration: this.factoryStageForm.value.duration,
            priority: this.factoryStageForm.value.priority,
            minimumRequiredCapacity: this.factoryStageForm.value.minimumRequiredCapacity
        };
        console.log('Factory DTO:', factoryStageDTO);

        return factoryStageDTO;
    }
}
