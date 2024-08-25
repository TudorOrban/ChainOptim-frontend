import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { User } from '../../../../../../../core/user/model/user';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ToastService } from '../../../../../../../shared/common/components/toast-system/toast.service';
import { UserService } from '../../../../../../../core/auth/services/user.service';
import { FallbackManagerService } from '../../../../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { OperationOutcome } from '../../../../../../../shared/common/components/toast-system/toastTypes';
import { CommonModule } from '@angular/common';
import { SelectStageComponent } from '../../../../../../../shared/common/components/select/select-stage/select-stage.component';
import { Stage, StageInput, UpdateStageInputDTO } from '../../../../../models/Product';
import { StageInputService } from '../../../../../services/stageinput.service';
import { SelectComponentComponent } from '../../../../../../../shared/common/components/select/select-component/select-component.component';
import { ComponentSearchDTO } from '../../../../../models/Component';

@Component({
    selector: 'app-update-stage-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SelectStageComponent, SelectComponentComponent],
    templateUrl: './update-stage-input.component.html',
    styleUrl: './update-stage-input.component.css',
})
export class UpdateStageInputComponent {
    @Input() inputData: { productId: number, initialStageId?: number, initialStageInputId?: number } | undefined = undefined;
    @Output() onStageInputUpdated = new EventEmitter<StageInput>();

    currentUser: User | undefined = undefined;
    stageInputForm: FormGroup = new FormGroup({});

    selectedStageId: number | undefined = undefined;
    selectedComponentId: number | undefined = undefined;
    currentStageInput: StageInput | undefined = undefined;

    constructor(
        private fb: FormBuilder,
        private stageInputService: StageInputService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.initializeForm();
        this.loadData();
    }

    private initializeForm() {
        this.stageInputForm = this.fb.group({
            quantity: [
                '',
                [Validators.min(0), Validators.pattern('^-?[0-9]+(.[0-9]+)?$')],
            ]
        });
        
    }

    private loadData() {
        this.loadCurrentUser();
        this.loadCurrentStageInput();
    }

    private loadCurrentUser() {
        this.userService.getCurrentUser().subscribe({
            next: (user) => {
                if (user) {
                    this.currentUser = user;
                }
                this.fallbackManagerService.updateLoading(false);
            },
            error: (error: Error) => {
                this.fallbackManagerService.updateError(error.message ?? '');
                this.fallbackManagerService.updateLoading(false);
            },
        });
    }

    private loadCurrentStageInput() {
        if (!this.inputData?.initialStageInputId) {
            console.error('Missing initial stage input id');
            return;
        }

        this.stageInputService.getStageInputById(this.inputData?.initialStageInputId).subscribe({
            next: (stageInput) => {
                if (!stageInput.componentId) {
                    this.selectedComponentId = stageInput.componentId;
                }
                this.stageInputForm.patchValue({
                    quantity: stageInput.quantity,
                });
                console.log('Current stage input:', stageInput);
                this.currentStageInput = stageInput;
            },
            error: (error: Error) => {
                console.error('Error loading stage input:', error);
            },
        });
        
    }

    hasError(controlName: string, errorName: string): boolean {
        const control = this.stageInputForm.get(controlName);
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

        const stageInputDTO = this.getStageInputDTO();

        this.stageInputService
            .updateStageInput(stageInputDTO, true)
            .subscribe(
                (stageInput) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Stage input updated successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                    this.onStageInputUpdated.emit(stageInput);
                },
                (error) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Stage input update failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Error creating stage input:', error);
                }
            );
    }

    private isFormInvalid(): boolean {
        return this.stageInputForm.invalid;
    }

    private getStageInputDTO(): UpdateStageInputDTO {
        if (!this.inputData?.productId || !this.selectedStageId || !this.currentUser?.organization?.id || !this.selectedComponentId) {
            throw new Error('Invalid form data');
        }

        const stageInputDTO: UpdateStageInputDTO = {
            id: this.inputData?.initialStageId ?? 0,
            productId: this.inputData?.productId,
            stageId: this.selectedStageId,
            organizationId: this.currentUser?.organization?.id ?? 0,
            componentId: this.selectedComponentId || 0,
            quantity: this.stageInputForm.value.quantity,
        };

        return stageInputDTO;
    }

    handleStageIdChange(stageId: number) {
        this.selectedStageId = stageId;
    }

    handleComponentChange(component: ComponentSearchDTO) {
        this.selectedComponentId = component.id;
    }
}
