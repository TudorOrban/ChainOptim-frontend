import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { SupplierOverviewComponent } from './supplier-overview/supplier-overview.component';
import { TabsComponent } from '../../../../shared/common/components/tabs/tabs.component';
import { SupplierOrdersComponent } from './supplier-orders/supplier-orders.component';
import { SupplierPerformanceComponent } from './supplier-performance/supplier-performance.component';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import { Supplier } from '../../models/Supplier';
import { FallbackManagerService, FallbackManagerState } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { NavigationItem } from '../../../../shared/common/models/uiTypes';
import { SupplierShipmentsComponent } from './supplier-shipments/supplier-shipments.component';
import { SupplierService } from '../../services/supplier.service';

@Component({
    selector: 'app-supplier',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,
        TabsComponent,
        SupplierOverviewComponent,
        SupplierOrdersComponent,
        SupplierShipmentsComponent,
        SupplierPerformanceComponent,
        FallbackManagerComponent,
    ],
    templateUrl: './supplier.component.html',
    styleUrl: './supplier.component.css',
})
export class SupplierComponent implements OnInit {
    supplierId: string | null = null;
    supplier: Supplier | null = null;
    fallbackManagerState: FallbackManagerState = {};
    tabs: NavigationItem[] = [
        {
            label: "Overview",
        },
        {
            label: "Supplier Orders",
        },
        {
            label: "Supplier Shipments",
        },
        {
            label: "Performance",
        },
    ]
    activeTab: string = "Overview";

    constructor(
        private route: ActivatedRoute,
        private supplierService: SupplierService,
        private fallbackManagerService: FallbackManagerService
    ) {}

    ngOnInit() {
        // Manage fallbacks
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
        this.fallbackManagerService.updateLoading(true);

        this.route.paramMap.subscribe((params) => {
            this.supplierId = params.get('supplierId');
            
            this.supplierService
                .getSupplierById(Number(this.supplierId))
                .subscribe({
                    next: (supplier) => {
                        console.log('SUPPLIER', supplier);
                        this.supplier = supplier;
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
