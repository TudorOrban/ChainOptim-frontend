import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-stage-output',
  standalone: true,
  imports: [],
  templateUrl: './add-stage-output.component.html',
  styleUrl: './add-stage-output.component.css'
})
export class AddStageOutputComponent {
    @Input() inputData: { productId: number } | undefined = undefined;

}
