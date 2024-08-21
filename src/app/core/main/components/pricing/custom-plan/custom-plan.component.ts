import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-plan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-plan.component.html',
  styleUrl: './custom-plan.component.css'
})
export class CustomPlanComponent {

    isMonthly: boolean = true;

    switchTime(): void {
        this.isMonthly = !this.isMonthly;
    }
}
