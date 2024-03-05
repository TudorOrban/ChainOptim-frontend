import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrganizationService } from '../../../organization/services/OrganizationService';
import { faBox, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/ProductService';
import { Organization } from '../../../organization/models/organization';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import {
    FallbackManagerService,
    FallbackManagerState,
} from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { distinctUntilChanged, filter } from 'rxjs';
import { ListHeaderComponent } from '../../../../shared/common/components/list-header/list-header.component';

@Component({
    selector: 'app-organization',
    standalone: true,
    imports: [
        CommonModule,
        FontAwesomeModule,
        RouterModule,
        FallbackManagerComponent,
        ListHeaderComponent
    ],
    templateUrl: './products.component.html',
    styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
    currentOrganization: Organization | null = null;
    products: Product[] = [];
    fallbackManagerState: FallbackManagerState = {};

    // Search params
    searchQuery = '';
    sortOption = 'createdAt';
    ascending = false;
    page = 1;
    itemsPerPage = 2;

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
            .getProductsByOrganizationIdAdvanced(organizationId, this.searchQuery, this.sortOption, this.ascending, this.page, this.itemsPerPage)
            .subscribe({
                next: (paginatedResults) => {
                    this.products = paginatedResults.results;

                    // Manage fallback state
                    if (this.products.length === 0) {
                        this.fallbackManagerService.updateNoResults(true);
                    }
                    this.fallbackManagerService.updateLoading(false);
                },
                error: (err: Error) => {
                    this.fallbackManagerService.updateError(err.message ?? '');
                    this.fallbackManagerService.updateLoading(false);
                },
            });
    }

    faBuilding = faBuilding;
    faBox = faBox;
}
