import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

    faPlus = faPlus;
    faEdit = faEdit;
    faTrash = faTrash;

    handleAddFactoryStage() {
        console.log('Add factory stage');
    }

    handleUpdateFactoryStage() {
        console.log('Update factory stage');
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
    }

    handleDisplayCapacities(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const isChecked = checkbox.checked
        
        console.log('Display capacities', isChecked);
    }

    handleDisplayPriorities(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        const isChecked = checkbox.checked;

        console.log('Display priorities', isChecked);
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
