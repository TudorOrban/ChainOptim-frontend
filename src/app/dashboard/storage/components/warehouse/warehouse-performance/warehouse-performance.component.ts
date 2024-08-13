import { Component, Input } from '@angular/core';
import { Warehouse } from '../../../models/Warehouse';

@Component({
  selector: 'app-warehouse-performance',
  standalone: true,
  imports: [],
  templateUrl: './warehouse-performance.component.html',
  styleUrl: './warehouse-performance.component.css'
})
export class WarehousePerformanceComponent {
    @Input() warehouse: Warehouse | null = null;

}
