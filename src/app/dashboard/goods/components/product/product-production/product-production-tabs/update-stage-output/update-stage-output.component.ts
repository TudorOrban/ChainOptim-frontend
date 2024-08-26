import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
import { OperationOutcome } from '../../../../../../../shared/common/components/toast-system/toastTypes';
import { CommonModule } from '@angular/common';
import { SelectStageComponent } from '../../../../../../../shared/common/components/select/select-stage/select-stage.component';
import { Stage, StageOutput, UpdateStageOutputDTO } from '../../../../../models/Product';
import { StageOutputService } from '../../../../../services/stageoutput.service';
import { SelectComponentComponent } from '../../../../../../../shared/common/components/select/select-component/select-component.component';
import { ComponentSearchDTO } from '../../../../../models/Component';

@Component({
    selector: 'app-update-stage-output',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SelectStageComponent, SelectComponentComponent],
    templateUrl: './update-stage-output.component.html',
    styleUrl: './update-stage-output.component.css',
})
export class UpdateStageOutputComponent {
    @Input() inputData: { productId: number, initialStageId?: number, initialStageOutputId?: number } | undefined = undefined;
    @Output() onStageOutputUpdated = new EventEmitter<StageOutput>();

    currentUser: User | undefined = undefined;
    stageOutputForm: FormGroup = new FormGroup({});

    selectedStageId: number | undefined = undefined;
    selectedComponentId: number | undefined = undefined;
    currentStageOutput: StageOutput | undefined = undefined;

    constructor(
        private fb: FormBuilder,
        private stageOutputService: StageOutputService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.initializeForm();
        this.loadData();
    }

    private initializeForm() {
        this.stageOutputForm = this.fb.group({
            quantity: [
                '',
                [Validators.min(0), Validators.pattern('^-?[0-9]+(.[0-9]+)?$')],
            ]
        });
        
    }

    private loadData() {
        this.loadCurrentUser();
        this.loadCurrentStageOutput();
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

    private loadCurrentStageOutput() {
        if (!this.inputData?.initialStageOutputId) {
            console.error('Missing initial stage input id');
            return;
        }

        this.stageOutputService.getStageOutputById(this.inputData?.initialStageOutputId).subscribe({
            next: (stageOutput) => {
                if (!stageOutput.componentId) {
                    this.selectedComponentId = stageOutput.componentId;
                }
                this.stageOutputForm.patchValue({
                    quantity: stageOutput.quantity,
                });
                console.log('Current stage input:', stageOutput);
                this.currentStageOutput = stageOutput;
            },
            error: (error: Error) => {
                console.error('Error loading stage input:', error);
            },
        });
        
    }

    hasError(controlName: string, errorName: string): boolean {
        const control = this.stageOutputForm.get(controlName);
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

        const stageOutputDTO = this.getStageOutputDTO();

        this.stageOutputService
            .updateStageOutput(stageOutputDTO, true)
            .subscribe(
                (stageOutput) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Stage input updated successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                    this.onStageOutputUpdated.emit(stageOutput);
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
        return this.stageOutputForm.invalid;
    }

    private getStageOutputDTO(): UpdateStageOutputDTO {
        console.log("Product ID", this.inputData?.productId);
        console.log("Stage ID", this.selectedStageId);
        console.log("Organization ID", this.currentUser?.organization?.id);
        console.log("Component ID", this.selectedComponentId);
        if (!this.inputData?.productId || !this.selectedStageId || !this.currentUser?.organization?.id || !this.selectedComponentId) {
            throw new Error('Invalid form data');
        }

        const stageOutputDTO: UpdateStageOutputDTO = {
            id: this.inputData?.initialStageId ?? 0,
            productId: this.inputData?.productId,
            stageId: this.selectedStageId,
            organizationId: this.currentUser?.organization?.id ?? 0,
            componentId: this.selectedComponentId || 0,
            quantity: this.stageOutputForm.value.quantity,
        };

        return stageOutputDTO;
    }

    handleStageIdChange(stageId: number) {
        this.selectedStageId = stageId;
    }

    handleComponentChange(component: ComponentSearchDTO) {
        this.selectedComponentId = component.id;
    }
}
