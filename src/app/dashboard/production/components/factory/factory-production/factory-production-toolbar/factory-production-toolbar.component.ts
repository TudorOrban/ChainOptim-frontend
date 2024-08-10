import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SelectDurationComponent } from '../../../../../../shared/common/components/select/select-duration/select-duration.component';
import { ResourceAllocationService } from '../../../../services/resourceallocation.service';
import { AllocationPlan } from '../../../../models/ResourceAllocation';

@Component({
  selector: 'app-factory-production-toolbar',
  standalone: true,
  imports: [
    FontAwesomeModule, 
    CommonModule,
    SelectDurationComponent
],
  templateUrl: './factory-production-toolbar.component.html',
  styleUrl: './factory-production-toolbar.component.css'
})
export class FactoryProductionToolbarComponent {
    @Input() factoryId: number | undefined = undefined;

    @Output() addFactoryStage: EventEmitter<void> = new EventEmitter();
    @Output() updateFactoryStage: EventEmitter<void> = new EventEmitter();
    @Output() displayQuantities: EventEmitter<boolean> = new EventEmitter();
    @Output() displayCapacities: EventEmitter<boolean> = new EventEmitter();
    @Output() displayPriorities: EventEmitter<boolean> = new EventEmitter();
    @Output() viewActivePlan: EventEmitter<void> = new EventEmitter();
    @Output() displayAllocations: EventEmitter<AllocationPlan> = new EventEmitter();
    @Output() openAllocationPlan: EventEmitter<AllocationPlan> = new EventEmitter();
    @Output() viewProductionHistory: EventEmitter<void> = new EventEmitter();
    
    computeAllocationPlan: boolean = false;
    computedAllocationPlan: AllocationPlan | undefined = undefined;
    durationHours: number = 0;

    faPlus = faPlus;
    faEdit = faEdit;
    faTrash = faTrash;

    constructor(
        private resourceAllocationService: ResourceAllocationService,
    ) {} 

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
    }

    handleDeleteConnection() {
        console.log('Delete connection');
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
}
