import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-factory-graph',
  standalone: true,
  imports: [],
  templateUrl: './factory-graph.component.html',
  styleUrl: './factory-graph.component.css'
})
export class FactoryGraphComponent {
    @Input() inputData: any;

}
