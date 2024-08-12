import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-update-stage',
  standalone: true,
  imports: [],
  templateUrl: './update-stage.component.html',
  styleUrl: './update-stage.component.css'
})
export class UpdateStageComponent {
    @Input() inputData: any;

}
