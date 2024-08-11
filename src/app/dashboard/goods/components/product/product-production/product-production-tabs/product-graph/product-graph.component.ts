import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-graph',
  standalone: true,
  imports: [],
  templateUrl: './product-graph.component.html',
  styleUrl: './product-graph.component.css'
})
export class ProductGraphComponent {

    @Input() inputData: { productId: number } | undefined = undefined;
}
