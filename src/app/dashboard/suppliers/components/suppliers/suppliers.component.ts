import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrganizationService } from '../../../organization/services/OrganizationService';
import { faBox, faBuilding, faTruckArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Supplier } from '../../models/Supplier';
import { SupplierService } from '../../services/SupplierService';
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
    templateUrl: './suppliers.component.html',
    styleUrl: './suppliers.component.css',
})
export class SuppliersComponent implements OnInit {
    currentOrganization: Organization | null = null;
    suppliers: Supplier[] = [];
    fallbackManagerState: FallbackManagerState = {};

    constructor(
        private organizationService: OrganizationService,
        private supplierService: SupplierService,
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

                        // Load suppliers
                        this.loadSuppliers(orgData.id);
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
        this.supplierService
            .getSuppliersByOrganizationId(organizationId)
            .subscribe({
                next: (suppliers) => {
                    this.suppliers = suppliers;

                    // Manage fallback state
                    if (suppliers.length === 0) {
                        this.fallbackManagerService.updateNoResults(true);
                    }
                    this.fallbackManagerService.updateLoading(false);
                },
                error: (err: Error) => {
                    this.fallbackManagerService.updateError(err.message ?? '');
                },
            });
    }

    faTruckArrowRight = faTruckArrowRight;
}
