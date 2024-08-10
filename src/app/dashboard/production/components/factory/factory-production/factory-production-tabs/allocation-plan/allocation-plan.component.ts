import { Component, Input, OnInit } from '@angular/core';
import { AllocationPlan } from '../../../../../models/ResourceAllocation';

@Component({
  selector: 'app-allocation-plan',
  standalone: true,
  imports: [],
  templateUrl: './allocation-plan.component.html',
  styleUrl: './allocation-plan.component.css'
})
export class AllocationPlanComponent implements OnInit {
    @Input() inputData: { allocationPlan: AllocationPlan, loadActivePlan: boolean } | undefined = undefined;

    ngOnInit(): void {
        console.log("Allocation Plan Component: ", this.inputData);
    }

}
