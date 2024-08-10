import { Component, Input, OnInit } from '@angular/core';
import { AllocationPlan, ResourceAllocationPlan } from '../../../../../models/ResourceAllocation';
import { CommonModule } from '@angular/common';
import { ResourceAllocationService } from '../../../../../services/resourceallocation.service';

@Component({
  selector: 'app-allocation-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './allocation-plan.component.html',
  styleUrl: './allocation-plan.component.css'
})
export class AllocationPlanComponent implements OnInit {
    @Input() inputData: { allocationPlan: AllocationPlan, loadActivePlan: boolean, factoryId: number } | undefined = undefined;

    currentAllocationPlan: AllocationPlan | undefined = undefined;

    constructor(
        private resourceAllocationService: ResourceAllocationService,
    ) {}

    ngOnInit(): void {
        console.log("Allocation Plan Component: ", this.inputData);

        if (this.inputData?.loadActivePlan) {
            this.loadActivePlan();
        } else {
            this.currentAllocationPlan = this.inputData?.allocationPlan;
        }
    }

    private loadActivePlan(): void {

        this.resourceAllocationService.getActivePlan(this.inputData?.factoryId as number).subscribe(activePlan => {
            console.log("Active plan: ", activePlan);
            this.currentAllocationPlan = activePlan.allocationPlan;
        });

    }

}
