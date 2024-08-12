import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-update-stage-output',
  standalone: true,
  imports: [],
  templateUrl: './update-stage-output.component.html',
  styleUrl: './update-stage-output.component.css'
})
export class UpdateStageOutputComponent {
    @Input() inputData: { productId: number, stageOutputId: number } | undefined = undefined;

}
