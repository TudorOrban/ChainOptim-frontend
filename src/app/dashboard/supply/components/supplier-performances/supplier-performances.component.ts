import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faIndustry } from '@fortawesome/free-solid-svg-icons';
import { Supplier } from '../../models/Supplier';
import { SupplierService } from '../../services/supplier.service';
import { Organization } from '../../../organization/models/organization';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import {
    FallbackManagerService,
    FallbackManagerState,
} from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { ListHeaderComponent } from '../../../../shared/common/components/list-header/list-header.component';
import { PageSelectorComponent } from '../../../../shared/search/components/page-selector/page-selector.component';
import { SortOption } from '../../../../shared/search/models/searchTypes';
import { UserService } from '../../../../core/user/services/user.service';
import { ScoreComponent } from '../../../../shared/common/components/score/score.component';

@Component({
    selector: 'app-supplier-performances',
    standalone: true,
    imports: [
        CommonModule,
        FontAwesomeModule,
        RouterModule,
        FallbackManagerComponent,
        ListHeaderComponent,
        PageSelectorComponent,
        ScoreComponent
    ],
    templateUrl: './supplier-performances.component.html',
    styleUrl: './supplier-performances.component.css',
})
export class SupplierPerformancesComponent implements OnInit {
    currentOrganization: Organization | undefined = undefined;
    suppliers: Supplier[] = [];
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
        private readonly userService: UserService,
        private readonly supplierService: SupplierService,
        private readonly fallbackManagerService: FallbackManagerService
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
                    if (user?.organization) {
                        this.fallbackManagerService.updateNoOrganization(false);

                        // Load suppliers
                        this.loadSuppliers(this.currentOrganization?.id ?? 0);
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

    private loadSuppliers(organizationId: number) {
        this.fallbackManagerService.updateLoading(true);

        this.supplierService
            .getSuppliersByOrganizationIdAdvanced(organizationId, this.searchQuery, this.currentSortOption.value, this.ascending, this.page, this.itemsPerPage)
            .subscribe({
                next: (paginatedResults) => {
                    this.suppliers = paginatedResults.results;
                    this.totalCount = paginatedResults.totalCount;

                    console.log('Suppliers:', this.suppliers);
                    // Manage fallback state
                    if (this.suppliers.length === 0) {
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
            this.loadSuppliers(this.currentOrganization!.id);
        }
    }

    handleSortChange(sortChange: { value: string, ascending: boolean }): void {
        if (this.currentSortOption.value !== sortChange.value || this.ascending !== sortChange.ascending) {
            this.currentSortOption = this.sortOptions.find((option) => option.value === sortChange.value)!;
            this.ascending = sortChange.ascending;
            this.page = 1; // Reset page
            this.loadSuppliers(this.currentOrganization!.id);
        }
    }

    changePage(page: number): void {
        if (this.page !== page) {
            this.page = page;
            this.loadSuppliers(this.currentOrganization!.id);
        }
    }

    faIndustry = faIndustry;
}
