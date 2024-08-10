import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-factory-production-toolbar',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './factory-production-toolbar.component.html',
  styleUrl: './factory-production-toolbar.component.css'
})
export class FactoryProductionToolbarComponent {

    @Output() addFactoryStage: EventEmitter<void> = new EventEmitter();
    @Output() updateFactoryStage: EventEmitter<void> = new EventEmitter();
    @Output() displayQuantities: EventEmitter<boolean> = new EventEmitter();
    @Output() displayCapacities: EventEmitter<boolean> = new EventEmitter();
    @Output() displayPriorities: EventEmitter<boolean> = new EventEmitter();

    faPlus = faPlus;
    faEdit = faEdit;
    faTrash = faTrash;

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
    }

    handleComputeAllocationPlan() {
        console.log('Compute allocation plan');
    }

    handleViewProductionHistory() {
        console.log('View production history');
    }

    handleSeekMissingResources() {
        console.log('Seek missing resources');
    }
}
