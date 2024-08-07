import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/Product';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './product-overview.component.html',
  styleUrl: './product-overview.component.css'
})
export class ProductOverviewComponent implements OnInit {
    @Input() product: Product | null = null;
    
    ngOnInit(): void {
        console.log('Product in Overview', this.product);
    }

    faGear = faGear;
}
