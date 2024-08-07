import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import { FallbackManagerService, FallbackManagerState } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { NavigationItem } from '../../../../shared/common/models/uiTypes';
import { WarehouseService } from '../../services/warehouse.service';
import { TabsComponent } from '../../../../shared/common/components/tabs/tabs.component';
import { WarehouseOverviewComponent } from './warehouse-overview/warehouse-overview.component';
import { WarehouseInventoryComponent } from './warehouse-inventory/warehouse-inventory.component';
import { WarehousePerformanceComponent } from './warehouse-performance/warehouse-performance.component';
import { Warehouse } from '../../models/Warehouse';

@Component({
    selector: 'app-warehouse',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,
        TabsComponent,
        WarehouseOverviewComponent,
        WarehouseInventoryComponent,
        WarehousePerformanceComponent,
        FallbackManagerComponent,
    ],
    templateUrl: './warehouse.component.html',
    styleUrl: './warehouse.component.css',
})
export class WarehouseComponent implements OnInit {
    warehouseId: string | null = null;
    warehouse: Warehouse | null = null;
    fallbackManagerState: FallbackManagerState = {};
    tabs: NavigationItem[] = [
        {
            label: "Overview",
        },
        {
            label: "Inventory",
        },
        {
            label: "Performance",
        },
    ]
    activeTab: string = "Overview";

    constructor(
        private route: ActivatedRoute,
        private warehouseService: WarehouseService,
        private fallbackManagerService: FallbackManagerService
    ) {}

    ngOnInit() {
        // Manage fallbacks
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
        this.fallbackManagerService.updateLoading(true);

        this.route.paramMap.subscribe((params) => {
            this.warehouseId = params.get('warehouseId');
            
            this.warehouseService
                .getWarehouseById(Number(this.warehouseId))
                .subscribe({
                    next: (warehouse) => {
                        console.log('WAREHOUSE', warehouse);
                        this.warehouse = warehouse;
                        this.fallbackManagerService.updateLoading(false);
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

    onTabSelected(selectedTabLabel: string) {
        this.activeTab = selectedTabLabel;
    }

    faBox = faBox;
    faGear = faGear;
}
