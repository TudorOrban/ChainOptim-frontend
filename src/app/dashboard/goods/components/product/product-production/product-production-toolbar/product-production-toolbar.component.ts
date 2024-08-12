import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SelectDurationComponent } from '../../../../../../shared/common/components/select/select-duration/select-duration.component';
import { DeleteConnectionDTO, ProductEdge } from '../../../../models/ProductGraph';
import { User } from '../../../../../../core/user/model/user';
import { UserService } from '../../../../../../core/auth/services/user.service';
import { ToastService } from '../../../../../../shared/common/components/toast-system/toast.service';
import { GenericConfirmDialogComponent } from '../../../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { ConfirmDialogInput } from '../../../../../../shared/common/models/confirmDialogTypes';
import { OperationOutcome } from '../../../../../../shared/common/components/toast-system/toastTypes';
import { NodeSelection } from '../../../../../production/models/FactoryGraph';
import { StageService } from '../../../../services/stage.service';
import { ProductStageConnectionService } from '../../../../services/productstageconnection.service';

@Component({
  selector: 'app-product-production-toolbar',
  standalone: true,
  imports: [
    FontAwesomeModule, 
    CommonModule,
    SelectDurationComponent,
    GenericConfirmDialogComponent
],
  templateUrl: './product-production-toolbar.component.html',
  styleUrl: './product-production-toolbar.component.css'
})
export class ProductProductionToolbarComponent {
    // Inputs & Outputs
    @Input() productId: number | undefined = undefined;

    @Output() addStage: EventEmitter<void> = new EventEmitter();
    @Output() updateStage: EventEmitter<void> = new EventEmitter();
    @Output() toggleAddConnectionMode: EventEmitter<void> = new EventEmitter();
    @Output() displayQuantities: EventEmitter<boolean> = new EventEmitter();
    @Output() displayCapacities: EventEmitter<boolean> = new EventEmitter();
    @Output() displayPriorities: EventEmitter<boolean> = new EventEmitter();

    // State
    currentUser: User | undefined = undefined;

    selectedNode: NodeSelection | undefined = undefined;
    selectedEdge: ProductEdge | undefined = undefined;
    isAddConnectionModeOn: boolean = false;

    // Confirm dialogs
    deleteStageDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Factory Stage",
        dialogMessage: "Are you sure you want to delete this factory stage?",
    };
    isDeleteStageConfirmDialogOpen = false;
    
    deleteConnectionDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Connection",
        dialogMessage: "Are you sure you want to delete this stage connection?",
    };
    isDeleteConnectionConfirmDialogOpen = false;
    
    // Icons
    faPlus = faPlus;
    faEdit = faEdit;
    faTrash = faTrash;

    constructor(
        private userService: UserService,
        private stageService: StageService,
        private connectionService: ProductStageConnectionService,
        private toastService: ToastService,
    ) {} 

    ngOnInit() {
        this.userService.getCurrentUser().subscribe(user => {
            if (!user) {
                return;
            }
            this.currentUser = user;
        });
    }

    handleAddStage() {
        this.addStage.emit();
    }

    handleUpdateStage() {
        this.updateStage.emit();
    }
    
    handleOpenDeleteStageDialog() {
        this.isDeleteStageConfirmDialogOpen = true;
    }
    
    handleDeleteFactoryStage() {
        if (!this.selectedNode?.nodeId) {
            console.error('Error: No node selected');
            return
        }

        this.stageService.deleteStage(this.selectedNode?.nodeId, true).subscribe(() => {
            this.toastService.addToast({
                id: 1,
                title: "Factory stage deleted",
                message: "The factory stage has been deleted successfully",
                outcome: OperationOutcome.SUCCESS
            });
            this.isDeleteStageConfirmDialogOpen = false;
        });
    }

    handleCancelDeleteStage() {
        this.isDeleteStageConfirmDialogOpen = false;
    }

    handleAddConnection() {
        this.isAddConnectionModeOn = !this.isAddConnectionModeOn;
        this.toggleAddConnectionMode.emit();
    }

    handleOpenDeleteConnectionDialog() {
        this.isDeleteConnectionConfirmDialogOpen = true;
    }

    handleDeleteConnection() {
        if (!this.selectedEdge || !this.productId || !this.currentUser?.organization?.id) {
            console.error('Error: No edge selected');
            return
        }

        const connectionDTO: DeleteConnectionDTO = {
            productId: this.productId,
            organizationId: this.currentUser?.organization?.id,
            srcStageId: this.selectedEdge.srcStageId,
            srcStageOutputId: this.selectedEdge.srcStageOutputId,
            destStageId: this.selectedEdge.destStageId,
            destStageInputId: this.selectedEdge.destStageInputId
        };

        this.connectionService.findAndDeleteConnection(connectionDTO).subscribe(() => {
            this.toastService.addToast({
                id: 1,
                title: "Stage connection deleted",
                message: "The stage connection has been deleted successfully",
                outcome: OperationOutcome.SUCCESS
            });
            this.isDeleteConnectionConfirmDialogOpen = false;

        });
    }

    handleCancelDeleteConnection() {
        this.isDeleteConnectionConfirmDialogOpen = false;
    }

    handleDisplayQuantities(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        const isChecked = checkbox.checked;

        this.displayQuantities.emit(isChecked);
    }

    handleDisplayCapacities(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const isChecked = checkbox.checked
        
        this.displayCapacities.emit(isChecked);
    }

    handleDisplayPriorities(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const isChecked = checkbox.checked;

        this.displayPriorities.emit(isChecked);
    }

    handleSeekMissingResources() {
        console.log('Seek missing resources');
    }

    // Communication with Production parent component
    handleNodeClicked(node: NodeSelection) {
        this.selectedNode = node;
    }

    handleEdgeClicked(edge: ProductEdge) {
        this.selectedEdge = edge;
    }
}
