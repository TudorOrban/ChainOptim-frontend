import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-factory-stage',
  standalone: true,
  imports: [],
  templateUrl: './add-factory-stage.component.html',
  styleUrl: './add-factory-stage.component.css'
})
export class AddFactoryStageComponent {
    @Input() inputData: any;

}
