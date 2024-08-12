import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-update-stage-input',
  standalone: true,
  imports: [],
  templateUrl: './update-stage-input.component.html',
  styleUrl: './update-stage-input.component.css'
})
export class UpdateStageInputComponent {
    @Input() inputData: { productId: number, stageInputId: number } | undefined = undefined;

}
