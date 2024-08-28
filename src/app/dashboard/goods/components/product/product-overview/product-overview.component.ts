import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Product, ProductOverviewDTO } from '../../../models/Product';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OverviewSectionComponent } from '../../../../../shared/common/components/overview-section/overview-section.component';
import { UIUtilService } from '../../../../../shared/common/services/uiutil.service';

@Component({
  selector: 'app-product-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, OverviewSectionComponent],
  templateUrl: './product-overview.component.html',
  styleUrl: './product-overview.component.css'
})
export class ProductOverviewComponent implements OnInit, OnChanges {
    @Input() product: Product | undefined = undefined;

    productOverview: ProductOverviewDTO | undefined = undefined;
    hasLoadedOverview: boolean = false;

    uiUtilService: UIUtilService;

    constructor(
        private productService: ProductService,
        uiUtilService: UIUtilService
    ) { 
        this.uiUtilService = uiUtilService;
    }


    ngOnInit(): void {
        if (!this.product) {
            return;
        }

        this.productService.getProductOverview(this.product!.id).subscribe((overview) => {
            this.productOverview = overview
            this.hasLoadedOverview = true;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.product || this.hasLoadedOverview) {
            return;
        }
        if (changes['product'] && this.product) {
            this.productService.getProductOverview(this.product.id).subscribe((overview) => {
                this.productOverview = overview;
            });
        }
    }
}
