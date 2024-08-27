import { Component, Input } from '@angular/core';
import { Product } from '../../../models/Product';

@Component({
  selector: 'app-product-pricing',
  standalone: true,
  imports: [],
  templateUrl: './product-pricing.component.html',
  styleUrl: './product-pricing.component.css'
})
export class ProductPricingComponent {
    @Input() product: Product | undefined = undefined;

}
