import { Component, Input } from '@angular/core';
import { Supplier } from '../../../models/Supplier';

@Component({
  selector: 'app-supplier-orders',
  standalone: true,
  imports: [],
  templateUrl: './supplier-orders.component.html',
  styleUrl: './supplier-orders.component.css'
})
export class SupplierOrdersComponent {
    @Input() supplier: Supplier | null = null;

}
