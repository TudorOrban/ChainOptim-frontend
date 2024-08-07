import { Component, Input } from '@angular/core';
import { Supplier } from '../../../models/Supplier';

@Component({
  selector: 'app-supplier-overview',
  standalone: true,
  imports: [],
  templateUrl: './supplier-overview.component.html',
  styleUrl: './supplier-overview.component.css'
})
export class SupplierOverviewComponent {
    @Input() supplier: Supplier | null = null;

}
