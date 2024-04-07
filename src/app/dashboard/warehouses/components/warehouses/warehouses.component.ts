import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faBuilding, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { Warehouse } from '../../models/Warehouse';
import { WarehouseService } from '../../services/warehouse.service';
import { Organization } from '../../../organization/models/organization';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import {
    FallbackManagerService,
    FallbackManagerState,
} from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { SortOption } from '../../../../shared/search/models/Search';
import { ListHeaderComponent } from '../../../../shared/common/components/list-header/list-header.component';
import { PageSelectorComponent } from '../../../../shared/search/components/page-selector/page-selector.component';
import { UserService } from '../../../../core/auth/services/user.service';

@Component({
    selector: 'app-organization',
    standalone: true,
    imports: [
        CommonModule,
        FontAwesomeModule,
        RouterModule,
        FallbackManagerComponent,
        ListHeaderComponent,
        PageSelectorComponent
    ],
    templateUrl: './warehouses.component.html',
    styleUrl: './warehouses.component.css',
})
export class WarehousesComponent implements OnInit {
    currentOrganization: Organization | undefined = undefined;
    warehouses: Warehouse[] = [];
    totalCount = 0;
    fallbackManagerState: FallbackManagerState = {};
    
    // Search params
    searchQuery = "";
    sortOptions: SortOption[] = [
        { label: "Created At", value: "createdAt" },
        { label: "Updated At", value: "updatedAt" },
        { label: "Name", value: "name" }
    ];
    currentSortOption: SortOption = { label: "createdAt", value: "createdAt" };
    ascending = false;
    page = 1;
    itemsPerPage = 10;

    constructor(
        private userService: UserService,
        private warehouseService: WarehouseService,
        private fallbackManagerService: FallbackManagerService
    ) {}

    ngOnInit() {
        // Manage fallbacks
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
        this.fallbackManagerService.updateLoading(true);

        // Get current user's organization
        this.userService
            .getCurrentUser()
            .subscribe({
                next: (user) => {
                    console.log('Current User:', user);
                    this.currentOrganization = user?.organization;
                    if (user && user.organization) {
                        this.fallbackManagerService.updateNoOrganization(false);

                        // Load warehouses
                        this.loadWarehouses(this.currentOrganization?.id ?? 0);
                    } else {
                        this.fallbackManagerService.updateNoOrganization(true);
                        this.fallbackManagerService.updateLoading(false);
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

    private loadWarehouses(organizationId: number) {
        this.fallbackManagerService.updateLoading(true);

        this.warehouseService
            .getWarehousesByOrganizationIdAdvanced(organizationId, this.searchQuery, this.currentSortOption.value, this.ascending, this.page, this.itemsPerPage)
            .subscribe({
                next: (paginatedResults) => {
                    // Get results and count
                    this.warehouses = paginatedResults.results;
                    this.totalCount = paginatedResults.totalCount;
                    
                    // Manage fallback state
                    if (this.warehouses.length === 0) {
                        this.fallbackManagerService.updateNoResults(true);
                    } else {
                        this.fallbackManagerService.updateNoResults(false);
                    }
                    this.fallbackManagerService.updateLoading(false);
                },
                error: (err: Error) => {
                    this.fallbackManagerService.updateError(err.message ?? '');
                    this.fallbackManagerService.updateLoading(false);
                },
            });
    }

    handleSearch(query: string): void {
        if (this.searchQuery !== query) {
            this.searchQuery = query;
            this.page = 1; // Reset page
            this.loadWarehouses(this.currentOrganization!.id);
        }
    }

    handleSortChange(sortChange: { value: string, ascending: boolean }): void {
        if (this.currentSortOption.value !== sortChange.value || this.ascending !== sortChange.ascending) {
            this.currentSortOption = this.sortOptions.find((option) => option.value === sortChange.value)!;
            this.ascending = sortChange.ascending;
            this.page = 1; // Reset page
            this.loadWarehouses(this.currentOrganization!.id);
        }
    }

    changePage(page: number): void {
        if (this.page !== page) {
            this.page = page;
            this.loadWarehouses(this.currentOrganization!.id);
        }
    }

    faBuilding = faBuilding;
    faWarehouse = faWarehouse;
}
