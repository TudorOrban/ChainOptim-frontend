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
import { OperationOutcome } from '../../../../../../../shared/common/components/toast-system/toastTypes';
import { CommonModule } from '@angular/common';
import { SelectStageComponent } from '../../../../../../../shared/common/components/select/select-stage/select-stage.component';
import { CreateStageInputDTO } from "../../../../../models/Stage";
import { StageInput } from "../../../../../models/Stage";
import { StageInputService } from '../../../../../services/stageinput.service';
import { SelectComponentComponent } from '../../../../../../../shared/common/components/select/select-component/select-component.component';
import { ComponentSearchDTO } from '../../../../../models/Component';

@Component({
    selector: 'app-add-stage-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SelectStageComponent, SelectComponentComponent],
    templateUrl: './add-stage-input.component.html',
    styleUrl: './add-stage-input.component.css',
})
export class AddStageInputComponent {
    @Input() inputData: { productId: number, initialStageId?: number } | undefined = undefined;

    currentUser: User | undefined = undefined;
    stageInputForm: FormGroup = new FormGroup({});

    selectedStageId: number | undefined = undefined;
    selectedComponentId: number | undefined = undefined;
    duration: number = 0;

    @Output() onStageInputAdded = new EventEmitter<StageInput>();

    constructor(
        private fb: FormBuilder,
        private stageInputService: StageInputService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.initializeForm();
        this.loadCurrentUser();
    }

    private initializeForm() {
        this.stageInputForm = this.fb.group({
            quantity: [
                '',
                [Validators.min(0), Validators.pattern('^-?[0-9]+(.[0-9]+)?$')],
            ]
        });
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
            .createStageInput(stageInputDTO, true)
            .subscribe(
                (stageInput) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Stage input created successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                    this.onStageInputAdded.emit(stageInput);
                },
                (error) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Stage input creation failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Error creating stage input:', error);
                }
            );
    }

    private isFormInvalid(): boolean {
        return this.stageInputForm.invalid;
    }

    private getStageInputDTO(): CreateStageInputDTO {
        if (!this.inputData?.productId || !this.selectedStageId || !this.currentUser?.organization?.id || !this.selectedComponentId) {
            throw new Error('Missing factory or stage ID');
        }

        const stageInputDTO: CreateStageInputDTO = {
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
