import { Component, Input } from '@angular/core';
import { Factory } from '../../../models/Factory';

@Component({
  selector: 'app-factory-inventory',
  standalone: true,
  imports: [],
  templateUrl: './factory-inventory.component.html',
  styleUrl: './factory-inventory.component.css'
})
export class FactoryInventoryComponent {
    @Input() factory: Factory | null = null;

}
