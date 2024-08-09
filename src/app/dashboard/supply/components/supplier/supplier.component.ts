import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { SupplierOverviewComponent } from './supplier-overview/supplier-overview.component';
import { TabsComponent } from '../../../../shared/common/components/tabs/tabs.component';
import { SupplierOrdersComponent } from '../supplier-orders/supplier-orders.component';
import { SupplierPerformanceComponent } from './supplier-performance/supplier-performance.component';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import { Supplier } from '../../models/Supplier';
import { FallbackManagerService, FallbackManagerState } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { NavigationItem } from '../../../../shared/common/models/uiTypes';
import { SupplierShipmentsComponent } from '../supplier-shipments/supplier-shipments.component';
import { SupplierService } from '../../services/supplier.service';
import { GenericConfirmDialogComponent } from '../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { ConfirmDialogInput } from '../../../../shared/common/models/confirmDialogTypes';
import { OperationOutcome, ToastInfo } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';
import { SearchMode } from '../../../../shared/enums/commonEnums';

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
        GenericConfirmDialogComponent
    ],
    templateUrl: './supplier.component.html',
    styleUrl: './supplier.component.css',
})
export class SupplierComponent implements OnInit {
    supplierId: number | null = null;
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
    SearchMode = SearchMode;
    activeTab: string = "Overview";
    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Supplier",
        dialogMessage: "Are you sure you want to delete this supplier?",
    };
    isConfirmDialogOpen = false;
    toastInfo: ToastInfo = {
        id: 1,
        title: "Supplier deleted",
        message: "The supplier has been deleted successfully",
        outcome: OperationOutcome.SUCCESS
    };

    constructor(
        private route: ActivatedRoute,
        private supplierService: SupplierService,
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
            this.supplierId = Number(params.get('supplierId'));
            
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

    
    openConfirmDialog() {
        this.isConfirmDialogOpen = true;
    }

    handleDeleteSupplier() {
        this.supplierService
            .deleteSupplier(Number(this.supplierId))
            .subscribe({
                next: (success) => {
                    this.toastService.addToast({ id: 123, title: 'Success', message: 'Supplier deleted successfully.', outcome: OperationOutcome.SUCCESS });
                    this.router.navigate(['/dashboard/suppliers']);
                },
                error: (error: Error) => {
                    this.toastService.addToast({ id: 123, title: 'Error', message: 'Supplier deletion failed.', outcome: OperationOutcome.ERROR });
                    console.error('Error deleting supplier:', error);
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
