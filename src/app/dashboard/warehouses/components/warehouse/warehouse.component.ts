import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../../../organization/services/OrganizationService';
import {
    FallbackManagerService,
    FallbackManagerState,
} from '../../../../shared/services/fallback/fallback-manager/fallback-manager.service';
import { FallbackManagerComponent } from '../../../../shared/components/fallback/fallback-manager/fallback-manager.component';
import { Warehouse } from '../../models/Warehouse';
import { WarehouseService } from '../../services/WarehouseService';

@Component({
    selector: 'app-warehouse',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,
        FallbackManagerComponent,
    ],
    templateUrl: './warehouse.component.html',
    styleUrl: './warehouse.component.css',
})
export class WarehouseComponent implements OnInit {
    warehouseId: string | null = null;
    warehouse: Warehouse | null = null;
    fallbackManagerState: FallbackManagerState = {};

    constructor(
        private route: ActivatedRoute,
        private warehouseService: WarehouseService,
        private organizationService: OrganizationService,
        private fallbackManagerService: FallbackManagerService
    ) {}

    ngOnInit() {
        // Manage fallbacks
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
        this.fallbackManagerState.loading = true;

        this.route.paramMap.subscribe((params) => {
            this.warehouseId = params.get('warehouseId');
            this.warehouseService
                .getWarehouseById(Number(this.warehouseId))
                .subscribe({
                    next: (warehouse) => {
                        console.log('WAREHOUSE', warehouse);
                        this.warehouse = warehouse;
                    },

                    error: (error: Error) => {
                        this.fallbackManagerService.updateError(
                            error.message ?? ''
                        );
                        this.fallbackManagerService.updateLoading(false);
                    },
                });
        });
    }

    faWarehouse = faWarehouse;
    faGear = faGear;
}
