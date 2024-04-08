import { Component, Input } from '@angular/core';
import { Warehouse } from '../../../models/Warehouse';

@Component({
  selector: 'app-warehouse-overview',
  standalone: true,
  imports: [],
  templateUrl: './warehouse-overview.component.html',
  styleUrl: './warehouse-overview.component.css'
})
export class WarehouseOverviewComponent {
    @Input() warehouse: Warehouse | null = null;

}
