import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/ProductService';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear } from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../models/Product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
    productId: string | null = null;
    product: Product | null = null;

    constructor(private route: ActivatedRoute, private productService: ProductService) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.productId = params.get('productId');
            this.productService.getProductById(Number(this.productId)).subscribe(product => {
                console.log("PRODUCT", product);
                this.product = product;
            });  
        })
    }

    faBox = faBox;
    faGear = faGear;
}
