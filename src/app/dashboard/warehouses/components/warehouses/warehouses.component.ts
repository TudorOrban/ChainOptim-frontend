import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrganizationService } from '../../../organization/services/OrganizationService';
import { faBox, faBuilding, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { Warehouse } from '../../models/Warehouse';
import { WarehouseService } from '../../services/WarehouseService';
import { Organization } from '../../../organization/models/organization';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import {
    FallbackManagerService,
    FallbackManagerState,
} from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
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
    templateUrl: './warehouses.component.html',
    styleUrl: './warehouses.component.css',
})
export class WarehousesComponent implements OnInit {
    currentOrganization: Organization | null = null;
    warehouses: Warehouse[] = [];
    fallbackManagerState: FallbackManagerState = {};

    constructor(
        private organizationService: OrganizationService,
        private warehouseService: WarehouseService,
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

                        // Load warehouses
                        this.loadWarehouses(orgData.id);
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

    private loadWarehouses(organizationId: number) {
        this.warehouseService
            .getWarehousesByOrganizationId(organizationId)
            .subscribe({
                next: (warehouses) => {
                    this.warehouses = warehouses;

                    // Manage fallback state
                    if (warehouses.length === 0) {
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
    faWarehouse = faWarehouse;
}
