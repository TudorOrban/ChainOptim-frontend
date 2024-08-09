import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-allocation-plan',
  standalone: true,
  imports: [],
  templateUrl: './allocation-plan.component.html',
  styleUrl: './allocation-plan.component.css'
})
export class AllocationPlanComponent {
    @Input() inputData: any;

}
