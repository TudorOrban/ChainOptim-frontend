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
import { NodeSelection, NodeType } from '../../../../../production/models/FactoryGraph';
import { StageService } from '../../../../services/stage.service';
import { ProductStageConnectionService } from '../../../../services/productstageconnection.service';
import { StageInputService } from '../../../../services/stageinput.service';
import { StageOutputService } from '../../../../services/stageoutput.service';
import { DeleteStageInputDTO, DeleteStageOutputDTO } from '../../../../models/Product';

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
    @Output() addStageInput: EventEmitter<void> = new EventEmitter();
    @Output() updateStageInput: EventEmitter<void> = new EventEmitter();
    @Output() addStageOutput: EventEmitter<void> = new EventEmitter();
    @Output() updateStageOutput: EventEmitter<void> = new EventEmitter();
    @Output() toggleAddConnectionMode: EventEmitter<void> = new EventEmitter();
    @Output() displayQuantities: EventEmitter<boolean> = new EventEmitter();

    // State
    currentUser: User | undefined = undefined;

    selectedNode: NodeSelection | undefined = undefined;
    selectedEdge: ProductEdge | undefined = undefined;
    isAddConnectionModeOn: boolean = false;

    // Confirm dialogs
    deleteStageDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Stage",
        dialogMessage: "Are you sure you want to delete this stage?",
    };
    isDeleteStageConfirmDialogOpen = false;
    
    deleteStageInputDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Stage Input",
        dialogMessage: "Are you sure you want to delete this stage input?",
    };
    isDeleteStageInputConfirmDialogOpen = false;

    deleteStageOutputDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Stage Output",
        dialogMessage: "Are you sure you want to delete this stage output?",
    };
    isDeleteStageOutputConfirmDialogOpen = false;

    deleteConnectionDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Connection",
        dialogMessage: "Are you sure you want to delete this stage connection?",
    };
    isDeleteConnectionConfirmDialogOpen = false;
    
    NodeType = NodeType;

    // Icons
    faPlus = faPlus;
    faEdit = faEdit;
    faTrash = faTrash;

    constructor(
        private userService: UserService,
        private stageService: StageService,
        private stageInputService: StageInputService,
        private stageOutputService: StageOutputService,
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

    // CRUD ops handlers
    // - Stages
    handleAddStage() {
        this.addStage.emit();
    }

    handleUpdateStage() {
        this.updateStage.emit();
    }
    
    handleOpenDeleteStageDialog() {
        this.isDeleteStageConfirmDialogOpen = true;
    }
    
    handleDeleteStage() {
        if (!this.selectedNode?.nodeId) {
            console.error('Error: No node selected');
            return
        }

        this.stageService.deleteStage(this.selectedNode?.nodeId, true).subscribe(() => {
            this.toastService.addToast({
                id: 1,
                title: "Stage deleted",
                message: "The Stage has been deleted successfully",
                outcome: OperationOutcome.SUCCESS
            });
            this.isDeleteStageConfirmDialogOpen = false;
        });
    }

    handleCancelDeleteStage() {
        this.isDeleteStageConfirmDialogOpen = false;
    }

    // - Stage Inputs
    handleAddStageInput() {
        this.addStageInput.emit();
    }

    handleUpdateStageInput() {
        this.updateStageInput.emit();
    }
    
    handleOpenDeleteStageInputDialog() {
        this.isDeleteStageInputConfirmDialogOpen = true;
    }
    
    handleDeleteStageInput() {
        if (!this.selectedNode?.subNodeId || this.selectedNode.nodeType != NodeType.INPUT || !this.productId || !this.currentUser?.organization?.id) {
            console.error('Error: No node selected');
            return
        }

        const inputDTO: DeleteStageInputDTO = {
            productId: this.productId,
            organizationId: this.currentUser?.organization?.id,
            stageInputId: this.selectedNode?.subNodeId,
        };

        this.stageInputService.deleteStageInput(inputDTO).subscribe(() => {
            this.toastService.addToast({
                id: 1,
                title: "Stage Input deleted",
                message: "The Stage Input has been deleted successfully",
                outcome: OperationOutcome.SUCCESS
            });
            this.isDeleteStageInputConfirmDialogOpen = false;
        });
    }

    handleCancelDeleteStageInput() {
        this.isDeleteStageInputConfirmDialogOpen = false;
    }

    // - Stage Outputs
    handleAddStageOutput() {
        this.addStageOutput.emit();
    }

    handleUpdateStageOutput() {
        this.updateStageOutput.emit();
    }
    
    handleOpenDeleteStageOutputDialog() {
        this.isDeleteStageOutputConfirmDialogOpen = true;
    }
    
    handleDeleteStageOutput() {
        if (!this.selectedNode?.subNodeId || this.selectedNode.nodeType != NodeType.OUTPUT || !this.productId || !this.currentUser?.organization?.id) {
            console.error('Error: No node selected');
            return
        }

        const outputDTO: DeleteStageOutputDTO = {
            productId: this.productId,
            organizationId: this.currentUser?.organization?.id,
            stageOutputId: this.selectedNode?.subNodeId,
        };

        this.stageOutputService.deleteStageOutput(outputDTO).subscribe(() => {
            this.toastService.addToast({
                id: 1,
                title: "Stage Output deleted",
                message: "The Stage Output has been deleted successfully",
                outcome: OperationOutcome.SUCCESS
            });
            this.isDeleteStageOutputConfirmDialogOpen = false;
        });
    }

    handleCancelDeleteStageOutput() {
        this.isDeleteStageConfirmDialogOpen = false;
    }

    // - Connections
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

    // Communication with Production parent component
    handleNodeClicked(node: NodeSelection) {
        this.selectedNode = node;
        console.log('Selected node:', this.selectedNode);
    }

    handleEdgeClicked(edge: ProductEdge) {
        this.selectedEdge = edge;
    }

    // Helper functions
    isInputSelected(): boolean {
        return this.selectedNode?.nodeType === NodeType.INPUT;
    }

    isOutputSelected(): boolean {
        return this.selectedNode?.nodeType === NodeType.OUTPUT;
    }

    isStageSelected(): boolean {
        return this.selectedNode?.nodeType === NodeType.STAGE;
    }

    isEdgeSelected(): boolean {
        return !!this.selectedEdge;
    }
}
