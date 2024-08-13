import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { StageService } from '../../../../../services/stage.service';
import { OperationOutcome } from '../../../../../../../shared/common/components/toast-system/toastTypes';
import { CommonModule } from '@angular/common';
import { SelectDurationComponent } from '../../../../../../../shared/common/components/select/select-duration/select-duration.component';
import { SelectStageComponent } from '../../../../../../../shared/common/components/select/select-stage/select-stage.component';
import { Stage, UpdateStageDTO } from '../../../../../../goods/models/Product';

@Component({
    selector: 'app-update-stage',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SelectDurationComponent, SelectStageComponent],
    templateUrl: './update-stage.component.html',
    styleUrl: './update-stage.component.css',
})
export class UpdateStageComponent {
    @Input() inputData:
        | { productId: number; stageId: number }
        | undefined = undefined;

    currentUser: User | undefined = undefined;
    stageForm: FormGroup = new FormGroup({});
    currentStage: Stage | undefined = undefined;

    @Output() onStageUpdated = new EventEmitter<Stage>();

    constructor(
        private fb: FormBuilder,
        private stageService: StageService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.initializeForm();

        this.loadData();
    }

    private initializeForm() {
        
        this.stageForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.maxLength(200)]]
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

                this.loadStage();
            },
            error: (error: Error) => {
                this.fallbackManagerService.updateError(error.message ?? '');
                this.fallbackManagerService.updateLoading(false);
            },
        });
    }

    private loadStage() {
        this.stageService
            .getStageById(this.inputData?.stageId ?? 0)
            .subscribe((stage) => {
                this.stageForm.patchValue({
                    name: stage.name,
                    description: stage.description,
                });
                this.currentStage = stage;
            });
    }

    hasError(controlName: string, errorName: string): boolean {
        const control = this.stageForm.get(controlName);
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

        const stageDTO = this.getStageDTO();

        this.stageService.updateStage(stageDTO, true).subscribe(
            (stage) => {
                this.toastService.addToast({
                    id: 123,
                    title: 'Success',
                    message: 'Product stage updated successfully.',
                    outcome: OperationOutcome.SUCCESS,
                });
                this.onStageUpdated.emit(stage);
            },
            (error) => {
                this.toastService.addToast({
                    id: 123,
                    title: 'Error',
                    message: 'Product stage update failed.',
                    outcome: OperationOutcome.ERROR,
                });
                console.error('Error updating product stage:', error);
            }
        );
    }

    private isFormInvalid(): boolean {
        return this.stageForm.invalid;
    }

    private getStageDTO(): UpdateStageDTO {
        if (!this.inputData?.productId || !this.inputData?.stageId) {
            throw new Error('Product ID and Product Stage ID is required');
        }

        const stageDTO: UpdateStageDTO = {
            id: this.inputData?.stageId ?? 0,
            productId: this.inputData?.productId,
            organizationId: this.currentUser?.organization?.id ?? 0,
            name: this.stageForm.value.name,
            description:
                this.stageForm.value.description,
        };

        return stageDTO;
    }
}
