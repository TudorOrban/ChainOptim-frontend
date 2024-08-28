import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../../../../core/user/model/user';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ToastService } from '../../../../../../../shared/common/components/toast-system/toast.service';
import { UserService } from '../../../../../../../core/user/services/user.service';
import { FallbackManagerService } from '../../../../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { FactoryStageService } from '../../../../../services/factorystage.service';
import {
    FactoryStage,
    UpdateFactoryStageDTO,
} from '../../../../../models/Factory';
import { OperationOutcome } from '../../../../../../../shared/common/components/toast-system/toastTypes';
import { CommonModule } from '@angular/common';
import { SelectDurationComponent } from '../../../../../../../shared/common/components/select/select-duration/select-duration.component';
import { SelectStageComponent } from '../../../../../../../shared/common/components/select/select-stage/select-stage.component';
import { Stage } from "../../../../../../goods/models/Stage";

@Component({
    selector: 'app-update-factory-stage',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SelectDurationComponent, SelectStageComponent],
    templateUrl: './update-factory-stage.component.html',
    styleUrl: './update-factory-stage.component.css',
})
export class UpdateFactoryStageComponent {
    @Input() inputData:
        | { factoryId: number; factoryStageId: number }
        | undefined = undefined;

    currentUser: User | undefined = undefined;
    factoryStageForm: FormGroup = new FormGroup({});
    currentStage: Stage | undefined = undefined;

    @Output() onFactoryStageUpdated = new EventEmitter<FactoryStage>();

    selectedStageId: number | undefined = undefined;
    duration: number = 0;

    constructor(
        private fb: FormBuilder,
        private factoryStageService: FactoryStageService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.initializeForm();

        this.loadData();
    }

    private initializeForm() {
        this.factoryStageForm = this.fb.group({
            capacity: [
                '',
                [Validators.min(0), Validators.pattern('^-?[0-9]+(.[0-9]+)?$')],
            ],
            duration: [
                '',
                [Validators.min(0), Validators.pattern('^-?[0-9]+(.[0-9]+)?$')],
            ],
            priority: [
                '',
                [Validators.min(0), Validators.pattern('^-?[0-9]+(.[0-9]+)?$')],
            ],
            minimumRequiredCapacity: [
                '',
                [Validators.min(0), Validators.pattern('^-?[0-9]+(.[0-9]+)?$')],
            ],
        });
    }

    private loadData() {
        this.loadCurrentUser();
    }

    private loadCurrentUser() {
        this.userService.getCurrentUser().subscribe({
            next: (user) => {
                this.fallbackManagerService.updateLoading(false);
                if (!user) {
                    return;
                }
                this.currentUser = user;

                this.loadFactoryStage();
            },
            error: (error: Error) => {
                this.fallbackManagerService.updateError(error.message ?? '');
                this.fallbackManagerService.updateLoading(false);
            },
        });
    }

    private loadFactoryStage() {
        this.factoryStageService
            .getFactoryStageById(this.inputData?.factoryStageId ?? 0)
            .subscribe((factoryStage) => {
                this.factoryStageForm.patchValue({
                    capacity: factoryStage.capacity,
                    duration: factoryStage.duration,
                    priority: factoryStage.priority,
                    minimumRequired: factoryStage.minimumRequiredCapacity,
                });
                this.currentStage = factoryStage.stage;
            });
    }

    hasError(controlName: string, errorName: string): boolean {
        const control = this.factoryStageForm.get(controlName);
        return (control?.hasError(errorName) && control?.touched) || false;
    }

    onSubmit(): void {
        if (!this.currentUser?.organization?.id) {
            console.error('Missing user');
            return;
        }
        const isFormInvalid = this.isFormInvalid();
        if (isFormInvalid) {
            this.toastService.addToast({
                id: 123,
                title: 'Error',
                message: 'Some of the inputs are not valid.',
                outcome: OperationOutcome.ERROR,
            });
            return;
        }

        const factoryStageDTO = this.getFactoryStageDTO();

        this.factoryStageService.updateFactoryStage(factoryStageDTO, true).subscribe(
            (factoryStage) => {
                this.toastService.addToast({
                    id: 123,
                    title: 'Success',
                    message: 'Factory stage updated successfully.',
                    outcome: OperationOutcome.SUCCESS,
                });
                this.onFactoryStageUpdated.emit(factoryStage);
            },
            (error) => {
                this.toastService.addToast({
                    id: 123,
                    title: 'Error',
                    message: 'Factory stage update failed.',
                    outcome: OperationOutcome.ERROR,
                });
                console.error('Error updating factory stage:', error);
            }
        );
    }

    private isFormInvalid(): boolean {
        return this.factoryStageForm.invalid;
    }

    private getFactoryStageDTO(): UpdateFactoryStageDTO {
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
            minimumRequiredCapacity:
                this.factoryStageForm.value.minimumRequiredCapacity,
        };

        return factoryStageDTO;
    }

    handleStageIdChange(stageId: number) {
        this.selectedStageId = stageId;
    }

    handleDurationChange(duration: number) {
        this.duration = duration;
    }
}
