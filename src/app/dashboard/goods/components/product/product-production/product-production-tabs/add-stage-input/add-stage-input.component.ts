import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-stage-input',
  standalone: true,
  imports: [],
  templateUrl: './add-stage-input.component.html',
  styleUrl: './add-stage-input.component.css'
})
export class AddStageInputComponent {
    @Input() inputData: { productId: number } | undefined = undefined;

}
