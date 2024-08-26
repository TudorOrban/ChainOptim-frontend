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
import { CreateStageOutputDTO, ProductSearchDTO, StageOutput } from '../../../../../models/Product';
import { StageOutputService } from '../../../../../services/stageoutput.service';
import { SelectComponentComponent } from '../../../../../../../shared/common/components/select/select-component/select-component.component';
import { SelectProductComponent } from '../../../../../../../shared/common/components/select/select-product/select-product.component';
import { ComponentSearchDTO } from '../../../../../models/Component';

@Component({
    selector: 'app-add-stage-output',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SelectStageComponent, SelectComponentComponent, SelectProductComponent],
    templateUrl: './add-stage-output.component.html',
    styleUrl: './add-stage-output.component.css',
})
export class AddStageOutputComponent {
    @Output() inputData: { productId: number, initialStageId?: number } | undefined = undefined;

    currentUser: User | undefined = undefined;
    stageOutputForm: FormGroup = new FormGroup({});

    selectedStageId: number | undefined = undefined;
    selectedComponentId: number | undefined = undefined;
    selectedProductId: number | undefined = undefined;
    duration: number = 0;

    @Output() onStageOutputAdded = new EventEmitter<StageOutput>();

    constructor(
        private fb: FormBuilder,
        private stageOutputService: StageOutputService,
        private userService: UserService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService
    ) {}

    ngOnInit() {
        this.initializeForm();
        this.loadCurrentUser();
    }

    private initializeForm() {
        this.stageOutputForm = this.fb.group({
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
                message: 'Some of the outputs are not valid.',
                outcome: OperationOutcome.ERROR,
            });
            return;
        }

        const stageOutputDTO = this.getStageOutputDTO();

        this.stageOutputService
            .createStageOutput(stageOutputDTO, true)
            .subscribe(
                (stageOutput) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Success',
                        message: 'Stage output created successfully.',
                        outcome: OperationOutcome.SUCCESS,
                    });
                    this.onStageOutputAdded.emit(stageOutput);
                },
                (error) => {
                    this.toastService.addToast({
                        id: 123,
                        title: 'Error',
                        message: 'Stage output creation failed.',
                        outcome: OperationOutcome.ERROR,
                    });
                    console.error('Error creating stage output:', error);
                }
            );
    }

    private isFormInvalid(): boolean {
        return this.stageOutputForm.invalid;
    }

    private getStageOutputDTO(): CreateStageOutputDTO {
        if (!this.inputData?.productId || !this.selectedStageId || !this.currentUser?.organization?.id || (!this.selectedComponentId && !this.selectedProductId)) {
            throw new Error('Invalid input data');
        }

        const stageOutputDTO: CreateStageOutputDTO = {
            productId: this.inputData.productId,
            stageId: this.selectedStageId,
            organizationId: this.currentUser?.organization?.id ?? 0,
            outputProductId: this.selectedProductId,
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

    handleProductChange(product: ProductSearchDTO) {
        this.selectedProductId = product.id;
    }
}
