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
import { StageService } from '../../../../../services/stage.service';
import { OperationOutcome } from '../../../../../../../shared/common/components/toast-system/toastTypes';
import { CommonModule } from '@angular/common';
import { SelectDurationComponent } from '../../../../../../../shared/common/components/select/select-duration/select-duration.component';
import { SelectStageComponent } from '../../../../../../../shared/common/components/select/select-stage/select-stage.component';
import { CreateStageDTO, Stage } from '../../../../../models/Product';

@Component({
    selector: 'app-add-stage',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SelectDurationComponent, SelectStageComponent],
    templateUrl: './add-stage.component.html',
    styleUrl: './add-stage.component.css',
})
export class AddStageComponent {
    @Input() inputData: { productId: number } | undefined = undefined;

    currentUser: User | undefined = undefined;
    stageForm: FormGroup = new FormGroup({});

    @Output() onStageAdded = new EventEmitter<Stage>();

    constructor(
        private fb: FormBuilder,
        private stageService: StageService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.initializeForm();
        this.loadCurrentUser();
    }

    private initializeForm() {
        this.stageForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.maxLength(200)]]
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

        this.stageService
            .createStage(stageDTO, true)
            .subscribe(
                (stage) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Product stage created successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                    this.onStageAdded.emit(stage);
                },
                (error) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Product stage creation failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Error creating product stage:', error);
                }
            );
    }

    private isFormInvalid(): boolean {
        return this.stageForm.invalid;
    }

    private getStageDTO(): CreateStageDTO {
        if (!this.inputData?.productId) {
            throw new Error('Missing product ID');
        }

        const stageDTO: CreateStageDTO = {
            productId: this.inputData?.productId,
            organizationId: this.currentUser?.organization?.id ?? 0,
            name: this.stageForm.get('name')?.value,
            description: this.stageForm.get('description')?.value,
        };

        return stageDTO;
    }
}
