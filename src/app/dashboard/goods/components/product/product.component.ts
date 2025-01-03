import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
    Product,
} from '../../models/Product';
import { Component as ProdComponent } from '../../models/Component';
import { CommonModule } from '@angular/common';
import {
    FallbackManagerService,
    FallbackManagerState,
} from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import { TabsComponent } from '../../../../shared/common/components/tabs/tabs.component';
import { NavigationItem } from '../../../../shared/common/models/uiTypes';
import { ProductProductionComponent } from './product-production/product-production.component';
import { ProductOverviewComponent } from './product-overview/product-overview.component';
import { ProductEvaluationComponent } from './product-evaluation/product-evaluation.component';
import { ConfirmDialogInput } from '../../../../shared/common/models/confirmDialogTypes';
import { GenericConfirmDialogComponent } from '../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { OperationOutcome, ToastInfo } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';
import { ProductPricingComponent } from './product-pricing/product-pricing.component';

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
        ProductPricingComponent,
        ProductEvaluationComponent,
        FallbackManagerComponent,
        GenericConfirmDialogComponent,
    ],
    templateUrl: './product.component.html',
    styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
    productId: number | undefined = undefined;
    product: Product | undefined = undefined;
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
            label: "Pricing",
        },
        {
            label: "Evaluation",
        },
    ];
    activeTab: string = "Overview";
    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Product",
        dialogMessage: "Are you sure you want to delete this product?",
    };
    isConfirmDialogOpen = false;
    toastInfo: ToastInfo = {
        id: 1,
        title: "Product deleted",
        message: "The product has been deleted successfully",
        outcome: OperationOutcome.SUCCESS
    };

    constructor(
        private readonly route: ActivatedRoute,
        private readonly productService: ProductService,
        private readonly fallbackManagerService: FallbackManagerService,
        private readonly toastService: ToastService,
        private readonly router: Router
    ) {}

    ngOnInit() {
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
        this.fallbackManagerService.updateLoading(true);

        this.route.paramMap.subscribe((params) => {
            this.productId = Number(params.get('productId'));
            
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

    openConfirmDialog() {
        this.isConfirmDialogOpen = true;
    }

    handleDeleteProduct() {
        this.productService
            .deleteProduct(Number(this.productId))
            .subscribe({
                next: (success) => {
                    this.toastService.addToast({ id: 123, title: 'Success', message: 'Product deleted successfully.', outcome: OperationOutcome.SUCCESS });
                    this.router.navigate(['/dashboard/products']);
                },
                error: (error: Error) => {
                    this.toastService.addToast({ id: 123, title: 'Error', message: 'Product deletion failed.', outcome: OperationOutcome.ERROR });
                    console.error('Error deleting product:', error);
                },
            });   
    }

    handleCancel() {
        this.isConfirmDialogOpen = false;
    }

    faBox = faBox;
    faGear = faGear;
    faTrash = faTrash;
}
