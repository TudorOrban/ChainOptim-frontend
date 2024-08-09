import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-update-factory-stage',
  standalone: true,
  imports: [],
  templateUrl: './update-factory-stage.component.html',
  styleUrl: './update-factory-stage.component.css'
})
export class UpdateFactoryStageComponent {
    @Input() inputData: any;

}
