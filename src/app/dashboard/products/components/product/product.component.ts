import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/ProductService';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear } from '@fortawesome/free-solid-svg-icons';
import { Product, RawMaterial, Component as ProdComponent } from '../../models/Product';
import { CommonModule } from '@angular/common';
import { RawMaterialService } from '../../services/RawMaterialService';
import { ComponentService } from '../../services/ComponentService';
import { OrganizationService } from '../../../organization/services/OrganizationService';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [CommonModule, RouterModule, FontAwesomeModule],
    templateUrl: './product.component.html',
    styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
    productId: string | null = null;
    product: Product | null = null;
    rawMaterials: RawMaterial[] = [];
    components: ProdComponent[] = [];

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private organizationService: OrganizationService,
        private rawMaterialService: RawMaterialService,
        private componentService: ComponentService
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            this.productId = params.get('productId');
            this.productService
                .getProductById(Number(this.productId))
                .subscribe((product) => {
                    console.log('PRODUCT', product);
                    this.product = product;
                });

            // Fetch all organization raw materials and components
            if (
                (this.product?.stages?.filter(
                    (stage) =>
                        (stage.stageInputs?.length || 0) > 0 ||
                        (stage.stageOutputs?.length || 0) > 0
                ).length || 0) > 0
            ) {
                this.organizationService
                    .getCurrentOrganization()
                    .subscribe((orgData) => {
                        if (orgData) {
                            this.rawMaterialService.getRawMaterialsByOrganizationId(
                                orgData.id
                            ).subscribe((rawMaterials) => {
                                this.rawMaterials = rawMaterials;
                                // Attach raw materials to the product's stages' inputs and outputs
                                this.attachRawMaterialsToProduct();
                            });
                            this.componentService.getComponentsByOrganizationId(
                                orgData.id
                            ).subscribe((components) => {
                                this.components = components;
                                // Attach components to the product's stages' inputs and outputs
                                this.attachComponentsToProduct();
                                console.log('COMPONENTS', this.product);
                            });


                        }
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
