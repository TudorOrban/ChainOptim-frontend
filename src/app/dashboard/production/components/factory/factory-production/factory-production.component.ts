import { Component, Input } from '@angular/core';
import { Factory } from '../../../models/Factory';

@Component({
  selector: 'app-factory-production',
  standalone: true,
  imports: [],
  templateUrl: './factory-production.component.html',
  styleUrl: './factory-production.component.css'
})
export class FactoryProductionComponent {
    @Input() factory: Factory | null = null;

}
