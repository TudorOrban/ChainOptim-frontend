import { Component, Input } from '@angular/core';
import { Factory } from '../../../models/Factory';

@Component({
  selector: 'app-factory-overview',
  standalone: true,
  imports: [],
  templateUrl: './factory-overview.component.html',
  styleUrl: './factory-overview.component.css'
})
export class FactoryOverviewComponent {
    @Input() factory: Factory | null = null;

}
