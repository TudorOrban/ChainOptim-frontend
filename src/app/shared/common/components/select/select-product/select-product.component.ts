import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ProductService } from '../../../../../dashboard/goods/services/product.service';
import { UserService } from '../../../../../core/user/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../../dashboard/goods/models/Product';
import { ProductSearchDTO } from "../../../../../dashboard/goods/models/Product";

@Component({
    selector: 'app-select-product',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './select-product.component.html',
    styleUrl: './select-product.component.css'
})
export class SelectProductComponent implements OnChanges {    
    @Input() initialData?: { product?: Product, productId?: number } | undefined = undefined;

    products: Product[] = [];
    selectedProductId: number | undefined = undefined;

    @Output() productSelected = new EventEmitter<ProductSearchDTO>();

    constructor(
        private productService: ProductService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.loadProducts();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['initialData'] && this.initialData && this.products.length > 0) {
            if (this.initialData?.product) {
                this.selectProduct(this.initialData.product.id);
            } else if (this.initialData?.productId) {
                this.selectProduct(this.initialData.productId);
            }
        }
    }
    
    private loadProducts(): void {
        this.userService.getCurrentUser().subscribe({
            next: (user) => {
                if (!user?.organization) {
                    return;
                }
                this.loadProductsByOrganizationId(user.organization?.id ?? 0);
            },
            error: (error: Error) => {
                console.error('Error loading current user', error);
            }
        });
    }

    private loadProductsByOrganizationId(organizationId: number): void {
        this.productService.getProductsByOrganizationId(organizationId, true)
            .subscribe(products => {
                if (products?.length == 0) {
                    console.error("Error: Products data is not valid.: ", products);
                    return;
                }

                this.products = products;

                if (this.initialData && this.initialData.product) {
                    this.selectProduct(this.initialData.product.id);
                }
            });
    }

    selectProduct(productId: number | undefined): void {
        console.log("Selected product: ", productId);
        this.selectedProductId = productId;
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            console.error("Error: Product not found: ", productId);
            return;
        }
        this.productSelected.emit(product);
    }
}
