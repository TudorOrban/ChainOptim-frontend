import { Component, Input } from '@angular/core';
import { Product } from '../../../models/Product';

@Component({
  selector: 'app-product-evaluation',
  standalone: true,
  imports: [],
  templateUrl: './product-evaluation.component.html',
  styleUrl: './product-evaluation.component.css'
})
export class ProductEvaluationComponent {
    @Input() product: Product | null = null;

    ngOnInit(): void {
        console.log('Product in Evaluation', this.product);
    }
}
