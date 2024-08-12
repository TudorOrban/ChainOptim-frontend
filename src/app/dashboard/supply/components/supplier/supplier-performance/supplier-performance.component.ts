import { Component, Input } from '@angular/core';
import { Supplier } from '../../../models/Supplier';

@Component({
  selector: 'app-supplier-performance',
  standalone: true,
  imports: [],
  templateUrl: './supplier-performance.component.html',
  styleUrl: './supplier-performance.component.css'
})
export class SupplierPerformanceComponent {
    @Input() supplier: Supplier | undefined = undefined;

}
