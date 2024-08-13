import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import { FallbackManagerService, FallbackManagerState } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { NavigationItem } from '../../../../shared/common/models/uiTypes';
import { WarehouseService } from '../../services/warehouse.service';
import { TabsComponent } from '../../../../shared/common/components/tabs/tabs.component';
import { WarehouseOverviewComponent } from './warehouse-overview/warehouse-overview.component';
import { WarehouseInventoryComponent } from '../warehouse-inventory/warehouse-inventory.component';
import { WarehousePerformanceComponent } from './warehouse-performance/warehouse-performance.component';
import { Warehouse } from '../../models/Warehouse';
import { GenericConfirmDialogComponent } from '../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { ConfirmDialogInput } from '../../../../shared/common/models/confirmDialogTypes';
import { OperationOutcome, ToastInfo } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';
import { SearchMode } from '../../../../shared/enums/commonEnums';

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
        GenericConfirmDialogComponent
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
    SearchMode = SearchMode;
    
    activeTab: string = "Overview";
    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Warehouse",
        dialogMessage: "Are you sure you want to delete this warehouse?",
    };
    isConfirmDialogOpen = false;
    toastInfo: ToastInfo = {
        id: 1,
        title: "Warehouse deleted",
        message: "The warehouse has been deleted successfully",
        outcome: OperationOutcome.SUCCESS
    };

    constructor(
        private route: ActivatedRoute,
        private warehouseService: WarehouseService,
        private fallbackManagerService: FallbackManagerService,
        private toastService: ToastService,
        private router: Router
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

    openConfirmDialog() {
        this.isConfirmDialogOpen = true;
    }

    handleDeleteWarehouse() {
        this.warehouseService
            .deleteWarehouse(Number(this.warehouseId))
            .subscribe({
                next: (success) => {
                    this.toastService.addToast({ id: 123, title: 'Success', message: 'Warehouse deleted successfully.', outcome: OperationOutcome.SUCCESS });
                    this.router.navigate(['/dashboard/warehouses']);
                },
                error: (error: Error) => {
                    this.toastService.addToast({ id: 123, title: 'Error', message: 'Warehouse deletion failed.', outcome: OperationOutcome.ERROR });
                    console.error('Error deleting warehouse:', error);
                },
            });   
    }

    handleCancel() {
        this.isConfirmDialogOpen = false;
    }
    
    faBox = faBox;
    faGear = faGear;
    faTrash = faTrash;
}
