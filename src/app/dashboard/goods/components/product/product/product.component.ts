import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear } from '@fortawesome/free-solid-svg-icons';
import {
    Product,
    RawMaterial,
    Component as ProdComponent,
} from '../../../models/Product';
import { CommonModule } from '@angular/common';
import {
    FallbackManagerService,
    FallbackManagerState,
} from '../../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { FallbackManagerComponent } from '../../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import { TabsComponent } from '../../../../../shared/common/components/tabs/tabs.component';
import { NavigationItem } from '../../../../../shared/common/models/UITypes';
import { ProductProductionComponent } from '../../product-production/product-production.component';
import { ProductOverviewComponent } from '../../product-overview/product-overview.component';
import { ProductEvaluationComponent } from '../../product-evaluation/product-evaluation.component';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,
        TabsComponent,
        ProductOverviewComponent,
        ProductProductionComponent,
        ProductEvaluationComponent,
        FallbackManagerComponent,
    ],
    templateUrl: './product.component.html',
    styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
    productId: string | null = null;
    product: Product | null = null;
    rawMaterials: RawMaterial[] = [];
    components: ProdComponent[] = [];
    fallbackManagerState: FallbackManagerState = {};
    tabs: NavigationItem[] = [
        {
            label: "Overview",
        },
        {
            label: "Production",
        },
        {
            label: "Evaluation",
        },
    ]
    activeTab: string = "Overview";

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private fallbackManagerService: FallbackManagerService
    ) {}

    ngOnInit() {
        // Manage fallbacks
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
        this.fallbackManagerService.updateLoading(true);

        this.route.paramMap.subscribe((params) => {
            this.productId = params.get('productId');
            
            this.productService
                .getProductById(Number(this.productId))
                .subscribe({
                    next: (product) => {
                        console.log('PRODUCT', product);
                        this.product = product;
                        this.fallbackManagerService.updateLoading(false);
                    },

                    error: (error: Error) => {
                        this.fallbackManagerService.updateError(
                            error.message ?? ''
                        );
                        this.fallbackManagerService.updateLoading(false);
                    },
                });
        });
    }

    onTabSelected(selectedTabLabel: string) {
        this.activeTab = selectedTabLabel;
    }

    faBox = faBox;
    faGear = faGear;
}
