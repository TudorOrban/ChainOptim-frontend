import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Organization } from '../../../../models/organization';
import { OrganizationService } from '../../../organization/services/OrganizationService';
import { faBox, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/ProductService';


@Component({
    selector: 'app-organization',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, RouterModule],
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
    currentOrganization: Organization | null = null;
    products: Product[] = [];

    constructor(
        private organizationService: OrganizationService,
        private productService: ProductService
    ) {}
    
    ngOnInit() {
        this.organizationService.getCurrentOrganization().subscribe((orgData) => {
            if (orgData) {
                this.currentOrganization = orgData;
                this.productService.getProductsByOrganizationId(orgData.id).subscribe((products) => {
                    this.products = products;
                    console.log("DAS", orgData, products);
                });
            }
        });
    }
    

    faBuilding = faBuilding;
    faBox = faBox;
}
