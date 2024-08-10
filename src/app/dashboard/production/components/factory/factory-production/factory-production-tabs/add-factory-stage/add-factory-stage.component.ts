import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../../../../core/user/model/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../../../../../shared/common/components/toast-system/toast.service';
import { UserService } from '../../../../../../../core/auth/services/user.service';
import { FallbackManagerService } from '../../../../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { FactoryStageService } from '../../../../../services/factorystage.service';
import { CreateFactoryStageDTO, FactoryStage } from '../../../../../models/Factory';
import { OperationOutcome } from '../../../../../../../shared/common/components/toast-system/toastTypes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-factory-stage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-factory-stage.component.html',
  styleUrl: './add-factory-stage.component.css'
})
export class AddFactoryStageComponent {
    @Input() inputData: { factoryId: number } | undefined = undefined;

    currentUser: User | undefined = undefined;
    factoryStageForm: FormGroup = new FormGroup({});

    @Output() onFactoryStageAdded = new EventEmitter<FactoryStage>();
  
    constructor(
        private fb: FormBuilder,
        private factoryStageService: FactoryStageService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
    ) {}
  
    ngOnInit() {
        this.initializeForm();

        this.loadCurrentUser();
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

        this.factoryStageService.createFactoryStage(factoryStageDTO, true).subscribe(
            factoryStage => {
                this.toastService.addToast({ id: 123, title: 'Success', message: 'Factory stage created successfully.', outcome: OperationOutcome.SUCCESS });
                this.onFactoryStageAdded.emit(factoryStage);
            },
            error => {
                this.toastService.addToast({ id: 123, title: 'Error', message: 'Factory stage creation failed.', outcome: OperationOutcome.ERROR });
                console.error('Error creating factory stage:', error);
            }
        );
    }

    private isFormInvalid(): boolean {
        return this.factoryStageForm.invalid;
    }

    private getFactoryStageDTO(): CreateFactoryStageDTO {
        if (!this.inputData?.factoryId) {
            throw new Error("Missing factory ID");
        }

        const factoryStageDTO: CreateFactoryStageDTO = {
            factoryId: this.inputData?.factoryId,
            stageId: 1,
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
