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

    currentUser: User | undefined = undefined;

    selectedNode: NodeSelection | undefined = undefined;
    selectedEdge: FactoryEdge | undefined = undefined;
    isAddConnectionModeOn: boolean = false;

    durationHours: number = 0;
    computeAllocationPlan: boolean = false;
    computedAllocationPlan: AllocationPlan | undefined = undefined;

    deleteConnectionDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Connection",
        dialogMessage: "Are you sure you want to delete this stage connection?",
    };
    isDeleteConnectionConfirmDialogOpen = false;
    toastInfo: ToastInfo = {
        id: 1,
        title: "Stage connection deleted",
        message: "The stage connection has been deleted successfully",
        outcome: OperationOutcome.SUCCESS
    };
    
    faPlus = faPlus;
    faEdit = faEdit;
    faTrash = faTrash;

    constructor(
        private userService: UserService,
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
        console.log('Add factory stage');
        this.addFactoryStage.emit();
    }

    handleUpdateFactoryStage() {
        console.log('Update factory stage');
        this.updateFactoryStage.emit();
    }

    handleDeleteFactoryStage() {
        console.log('Delete factory stage');
    }

    handleAddConnection() {
        console.log('Add connection');
        this.isAddConnectionModeOn = !this.isAddConnectionModeOn;
        this.toggleAddConnectionMode.emit();
    }

    handleOpenDeleteConnectionDialog() {
        this.isDeleteConnectionConfirmDialogOpen = true;
        console.log('Open delete connection dialog');
    }

    handleDeleteConnection() {
        console.log('Delete connection');
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

            this.toastService.addToast(this.toastInfo);
            this.isDeleteConnectionConfirmDialogOpen = false;

        });
    }

    handleCancelDeleteConnection() {
        console.log('Cancel delete connection');
        this.isDeleteConnectionConfirmDialogOpen = false;
    }

    handleDisplayQuantities(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        const isChecked = checkbox.checked;

        console.log('Display quantities', isChecked);
        this.displayQuantities.emit(isChecked);
    }

    handleDisplayCapacities(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const isChecked = checkbox.checked
        
        console.log('Display capacities', isChecked);
        this.displayCapacities.emit(isChecked);
    }

    handleDisplayPriorities(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const isChecked = checkbox.checked;

        console.log('Display priorities', isChecked);
        this.displayPriorities.emit(isChecked);
    }

    handleViewActivePlan() {
        console.log('View active plan');
        this.viewActivePlan.emit();
    }

    handleOpenAllocationPlanMenu() {
        console.log('Compute allocation plan');
        this.computeAllocationPlan = !this.computeAllocationPlan;
    }

    handleDurationChange(durationHours: number) {
        console.log('Duration changed to', durationHours);
        this.durationHours = durationHours;
    }

    handleComputeAllocationPlan() {
        console.log('Compute allocation plan for', this.durationHours, 'hours');

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
        console.log('Open computed allocation plan');
        this.openAllocationPlan.emit(this.computedAllocationPlan);
    }

    handleViewProductionHistory() {
        console.log('View production history');
        this.viewProductionHistory.emit();
    }

    handleSeekMissingResources() {
        console.log('Seek missing resources');
    }

    // Communication with Production parent component
    handleNodeClicked(node: NodeSelection) {
        console.log('Node clicked in toolbar: ', node);
        this.selectedNode = node;
    }

    handleEdgeClicked(edge: FactoryEdge) {
        console.log('Edge clicked in toolbar: ', edge);
        this.selectedEdge = edge;
    }
}
