import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SelectDurationComponent } from '../../../../../../shared/common/components/select/select-duration/select-duration.component';
import { ResourceAllocationService } from '../../../../services/resourceallocation.service';
import { AllocationPlan } from '../../../../models/ResourceAllocation';
import { Pair } from '../../../../../overview/types/supplyChainMapTypes';
import { FactoryEdge, NodeSelection } from '../../../../models/FactoryGraph';
import { FactoryStageConnectionService } from '../../../../services/factorystageconnection.service';
import { DeleteConnectionDTO } from '../../../../models/Factory';
import { User } from '../../../../../../core/user/model/user';
import { UserService } from '../../../../../../core/auth/services/user.service';
import { ToastService } from '../../../../../../shared/common/components/toast-system/toast.service';
import { GenericConfirmDialogComponent } from '../../../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { ConfirmDialogInput } from '../../../../../../shared/common/models/confirmDialogTypes';
import { OperationOutcome, ToastInfo } from '../../../../../../shared/common/components/toast-system/toastTypes';
import { FactoryStageService } from '../../../../services/factorystage.service';

@Component({
  selector: 'app-factory-production-toolbar',
  standalone: true,
  imports: [
    FontAwesomeModule, 
    CommonModule,
    SelectDurationComponent,
    GenericConfirmDialogComponent
],
  templateUrl: './factory-production-toolbar.component.html',
  styleUrl: './factory-production-toolbar.component.css'
})
export class FactoryProductionToolbarComponent {
    // Inputs & Outputs
    @Input() factoryId: number | undefined = undefined;

    @Output() addFactoryStage: EventEmitter<void> = new EventEmitter();
    @Output() updateFactoryStage: EventEmitter<void> = new EventEmitter();
    @Output() toggleAddConnectionMode: EventEmitter<void> = new EventEmitter();
    @Output() displayQuantities: EventEmitter<boolean> = new EventEmitter();
    @Output() displayCapacities: EventEmitter<boolean> = new EventEmitter();
    @Output() displayPriorities: EventEmitter<boolean> = new EventEmitter();
    @Output() viewActivePlan: EventEmitter<void> = new EventEmitter();
    @Output() displayAllocations: EventEmitter<AllocationPlan> = new EventEmitter();
    @Output() openAllocationPlan: EventEmitter<AllocationPlan> = new EventEmitter();
    @Output() viewProductionHistory: EventEmitter<void> = new EventEmitter();

    // State
    currentUser: User | undefined = undefined;

    selectedNode: NodeSelection | undefined = undefined;
    selectedEdge: FactoryEdge | undefined = undefined;
    isAddConnectionModeOn: boolean = false;

    durationHours: number = 0;
    computeAllocationPlan: boolean = false;
    computedAllocationPlan: AllocationPlan | undefined = undefined;

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
        private factoryStageService: FactoryStageService,
        private connectionService: FactoryStageConnectionService,
        private resourceAllocationService: ResourceAllocationService,
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

    handleAddFactoryStage() {
        this.addFactoryStage.emit();
    }

    handleUpdateFactoryStage() {
        this.updateFactoryStage.emit();
    }
    
    handleOpenDeleteStageDialog() {
        this.isDeleteStageConfirmDialogOpen = true;
    }
    
    handleDeleteFactoryStage() {
        if (!this.selectedNode?.nodeId) {
            console.error('Error: No node selected');
            return
        }

        this.factoryStageService.deleteFactoryStage(this.selectedNode?.nodeId, true).subscribe(() => {
            console.log('Deleted stage with ID');

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
        if (!this.selectedEdge || !this.factoryId || !this.currentUser?.organization?.id) {
            console.error('Error: No edge selected');
            return
        }

        const connectionDTO: DeleteConnectionDTO = {
            factoryId: this.factoryId,
            organizationId: this.currentUser?.organization?.id,
            srcFactoryStageId: this.selectedEdge.srcFactoryStageId,
            srcStageOutputId: this.selectedEdge.srcStageOutputId,
            destFactoryStageId: this.selectedEdge.destFactoryStageId,
            destStageInputId: this.selectedEdge.destStageInputId
        };

        this.connectionService.findAndDeleteConnection(connectionDTO).subscribe(() => {
            console.log('Deleted connection with ID');

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

    handleViewActivePlan() {
        this.viewActivePlan.emit();
    }

    handleOpenAllocationPlanMenu() {
        this.computeAllocationPlan = !this.computeAllocationPlan;
    }

    handleDurationChange(durationHours: number) {
        this.durationHours = durationHours;
    }

    handleComputeAllocationPlan() {
        if (!this.factoryId || !this.durationHours) {
            console.error('Error: Factory ID or duration is not valid: ', this.factoryId, this.durationHours);
            return
        }

        this.resourceAllocationService.computeAllocationPlan(this.factoryId, this.durationHours).subscribe(allocationPlan => {
            console.log('Allocation plan computed: ', allocationPlan);
            this.computedAllocationPlan = allocationPlan
            this.displayAllocations.emit(allocationPlan);
        });
    }

    handleOpenComputedAllocationPlan() {
        this.openAllocationPlan.emit(this.computedAllocationPlan);
    }

    handleViewProductionHistory() {
        this.viewProductionHistory.emit();
    }

    handleSeekMissingResources() {
        console.log('Seek missing resources');
    }

    // Communication with Production parent component
    handleNodeClicked(node: NodeSelection) {
        this.selectedNode = node;
    }

    handleEdgeClicked(edge: FactoryEdge) {
        this.selectedEdge = edge;
    }
}
