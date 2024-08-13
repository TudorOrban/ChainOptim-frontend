import { Component, Input } from '@angular/core';
import { Factory } from '../../../models/Factory';

@Component({
  selector: 'app-factory-performance',
  standalone: true,
  imports: [],
  templateUrl: './factory-performance.component.html',
  styleUrl: './factory-performance.component.css'
})
export class FactoryPerformanceComponent {
    @Input() factory: Factory | null = null;

}
