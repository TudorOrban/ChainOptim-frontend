import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/ProductService';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear } from '@fortawesome/free-solid-svg-icons';
import {
    Product,
    RawMaterial,
    Component as ProdComponent,
} from '../../models/Product';
import { CommonModule } from '@angular/common';
import { RawMaterialService } from '../../services/RawMaterialService';
import { ComponentService } from '../../services/ComponentService';
import { OrganizationService } from '../../../organization/services/OrganizationService';
import {
    FallbackManagerService,
    FallbackManagerState,
} from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,
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

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private organizationService: OrganizationService,
        private rawMaterialService: RawMaterialService,
        private componentService: ComponentService,
        private fallbackManagerService: FallbackManagerService
    ) {}

    ngOnInit() {
        // Manage fallbacks
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
        this.fallbackManagerState.loading = true;

        this.route.paramMap.subscribe((params) => {
            this.productId = params.get('productId');
            this.productService
                .getProductById(Number(this.productId))
                .subscribe({
                    next: (product) => {
                        console.log('PRODUCT', product);
                        this.product = product;
                    },

                    error: (error: Error) => {
                        this.fallbackManagerService.updateError(
                            error.message ?? ''
                        );
                        this.fallbackManagerService.updateLoading(false);
                    },
                });

            // Fetch all organization raw materials and components
            if (
                (this.product?.stages?.filter(
                    (stage) =>
                        (stage.stageInputs?.length || 0) > 0 ||
                        (stage.stageOutputs?.length || 0) > 0
                ).length || 0) > 0
            ) {
                this.organizationService.getCurrentOrganization().subscribe({
                    next: (orgData) => {
                        if (orgData) {
                            this.rawMaterialService
                                .getRawMaterialsByOrganizationId(orgData.id)
                                .subscribe((rawMaterials) => {
                                    this.rawMaterials = rawMaterials;
                                    // Attach raw materials to the product's stages' inputs and outputs
                                    this.attachRawMaterialsToProduct();
                                });
                            this.componentService
                                .getComponentsByOrganizationId(orgData.id)
                                .subscribe((components) => {
                                    this.components = components;
                                    // Attach components to the product's stages' inputs and outputs
                                    this.attachComponentsToProduct();
                                    this.fallbackManagerService.updateLoading(false);
                                    console.log('COMPONENTS', this.product);
                                });
                        }
                    },
                    error: (error: Error) => {
                        this.fallbackManagerService.updateError(
                            error.message ?? ''
                        );
                        this.fallbackManagerService.updateLoading(false);
                    },
                });
            }
        });
    }

    attachRawMaterialsToProduct() {
        this.product?.stages?.forEach((stage) => {
            stage.stageInputs?.forEach((stageInput) => {
                stageInput.material = this.rawMaterials.find(
                    (rawMaterial) => rawMaterial.id === stageInput.materialId
                );
            });
        });
    }

    attachComponentsToProduct() {
        this.product?.stages?.forEach((stage) => {
            stage.stageInputs?.forEach((stageInput) => {
                stageInput.component = this.components.find(
                    (component) => component.id === stageInput.componentId
                );
            });
            stage.stageOutputs?.forEach((stageOutput) => {
                stageOutput.component = this.components.find(
                    (component) => component.id === stageOutput.componentId
                );
            });
        });
    }

    faBox = faBox;
    faGear = faGear;
}
