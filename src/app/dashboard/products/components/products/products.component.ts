import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrganizationService } from '../../../organization/services/OrganizationService';
import { faBox, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/ProductService';
import { Organization } from '../../../organization/models/organization';
import { FallbackManagerComponent } from '../../../../shared/components/fallback/fallback-manager/fallback-manager.component';
import {
    FallbackManagerService,
    FallbackManagerState,
} from '../../../../shared/services/fallback/fallback-manager/fallback-manager.service';
import { distinctUntilChanged, filter } from 'rxjs';

@Component({
    selector: 'app-organization',
    standalone: true,
    imports: [
        CommonModule,
        FontAwesomeModule,
        RouterModule,
        FallbackManagerComponent,
    ],
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
    currentOrganization: Organization | null = null;
    products: Product[] = [];
    fallbackManagerState: FallbackManagerState = {};

    constructor(
        private organizationService: OrganizationService,
        private productService: ProductService,
        private fallbackManagerService: FallbackManagerService
    ) {}

    ngOnInit() {
        // Manage fallbacks
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
        this.fallbackManagerState.loading = true;

        // Get current user's organization
        this.organizationService
            .getCurrentOrganization()
            // Prevent receiving null emissions after the first one
            .pipe(
                distinctUntilChanged(),
                filter((org, index) => org !== null || index === 0)
            )
            .subscribe({
                next: (orgData) => {
                    console.log('Organization Data:', orgData);
                    if (orgData) {
                        this.currentOrganization = orgData;

                        this.fallbackManagerService.updateNoOrganization(false);

                        // Load products
                        this.loadProducts(orgData.id);
                    } else {
                        this.fallbackManagerService.updateNoOrganization(true);
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

    private loadProducts(organizationId: number) {
        this.productService
            .getProductsByOrganizationId(organizationId)
            .subscribe({
                next: (products) => {
                    this.products = products;

                    // Manage fallback state
                    if (products.length === 0) {
                        this.fallbackManagerService.updateNoResults(true);
                    }
                    this.fallbackManagerService.updateLoading(false);
                },
                error: (err: Error) => {
                    this.fallbackManagerService.updateError(err.message ?? '');
                },
            });
    }

    faBuilding = faBuilding;
    faBox = faBox;
}
