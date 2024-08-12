import { Component, Input } from '@angular/core';
import { Supplier } from '../../../models/Supplier';

@Component({
  selector: 'app-supplier-shipments',
  standalone: true,
  imports: [],
  templateUrl: './supplier-shipments.component.html',
  styleUrl: './supplier-shipments.component.css'
})
export class SupplierShipmentsComponent {
    @Input() supplier: Supplier | undefined = undefined;

}
