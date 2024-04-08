import { Component, Input } from '@angular/core';
import { Warehouse } from '../../../models/Warehouse';

@Component({
  selector: 'app-warehouse-inventory',
  standalone: true,
  imports: [],
  templateUrl: './warehouse-inventory.component.html',
  styleUrl: './warehouse-inventory.component.css'
})
export class WarehouseInventoryComponent {
    @Input() warehouse: Warehouse | null = null;

}
