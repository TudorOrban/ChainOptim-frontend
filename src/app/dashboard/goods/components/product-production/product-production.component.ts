import { Component, Input } from '@angular/core';
import { Product } from '../../models/Product';

@Component({
  selector: 'app-product-production',
  standalone: true,
  imports: [],
  templateUrl: './product-production.component.html',
  styleUrl: './product-production.component.css'
})
export class ProductProductionComponent {
    @Input() product: Product | null = null;

    ngOnInit(): void {
        console.log('Product in Production', this.product);
    }
}
