import { Component, Input, OnInit } from '@angular/core';
import { Pricing, Product } from '../../../models/Product';
import { PricingService } from '../../../services/pricing.service';

@Component({
  selector: 'app-product-pricing',
  standalone: true,
  imports: [],
  templateUrl: './product-pricing.component.html',
  styleUrl: './product-pricing.component.css'
})
export class ProductPricingComponent implements OnInit {
    @Input() product: Product | undefined = undefined;

    pricing: Pricing | undefined = undefined;

    constructor(
        private pricingService: PricingService,
    ) {}

    ngOnInit(): void {
        if (!this.product) {
            return console.error("Product not set");
        }

        this.pricingService.getPricingByProductId(this.product.id).subscribe((pricing) => {
            console.log("Got pricing:", pricing);
            this.pricing = pricing;
        });
    }

}
