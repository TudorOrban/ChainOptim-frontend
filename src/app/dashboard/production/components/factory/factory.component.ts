import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import { FallbackManagerService, FallbackManagerState } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { NavigationItem } from '../../../../shared/common/models/uiTypes';
import { FactoryService } from '../../services/factory.service';
import { TabsComponent } from '../../../../shared/common/components/tabs/tabs.component';
import { FactoryOverviewComponent } from './factory-overview/factory-overview.component';
import { FactoryInventoryComponent } from './factory-inventory/factory-inventory.component';
import { FactoryPerformanceComponent } from './factory-performance/factory-performance.component';
import { Factory } from '../../models/Factory';
import { FactoryProductionComponent } from './factory-production/factory-production.component';
import { GenericConfirmDialogComponent } from '../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { ConfirmDialogInput } from '../../../../shared/common/models/confirmDialogTypes';
import { OperationOutcome, ToastInfo } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';

@Component({
    selector: 'app-factory',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,
        TabsComponent,
        FactoryOverviewComponent,
        FactoryProductionComponent,
        FactoryInventoryComponent,
        FactoryPerformanceComponent,
        FallbackManagerComponent,
        GenericConfirmDialogComponent
    ],
    templateUrl: './factory.component.html',
    styleUrl: './factory.component.css',
})
export class FactoryComponent implements OnInit {
    factoryId: string | null = null;
    factory: Factory | null = null;
    fallbackManagerState: FallbackManagerState = {};
    tabs: NavigationItem[] = [
        {
            label: "Overview",
        },
        {
            label: "Production",
        },
        {
            label: "Inventory",
        },
        {
            label: "Performance",
        },
    ]
    activeTab: string = "Overview";
    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Factory",
        dialogMessage: "Are you sure you want to delete this factory?",
    };
    isConfirmDialogOpen = false;
    toastInfo: ToastInfo = {
        id: 1,
        title: "Factory deleted",
        message: "The factory has been deleted successfully",
        outcome: OperationOutcome.SUCCESS
    };

    constructor(
        private route: ActivatedRoute,
        private factoryService: FactoryService,
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
            this.factoryId = params.get('factoryId');
            
            this.factoryService
                .getFactoryById(Number(this.factoryId))
                .subscribe({
                    next: (factory) => {
                        console.log('FACTORY', factory);
                        this.factory = factory;
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

    handleDeleteFactory() {
        this.factoryService
            .deleteFactory(Number(this.factoryId))
            .subscribe({
                next: (success) => {
                    this.toastService.addToast({ id: 123, title: 'Success', message: 'Factory deleted successfully.', outcome: OperationOutcome.SUCCESS });
                    this.router.navigate(['/dashboard/factories']);
                },
                error: (error: Error) => {
                    this.toastService.addToast({ id: 123, title: 'Error', message: 'Factory deletion failed.', outcome: OperationOutcome.ERROR });
                    console.error('Error deleting factory:', error);
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
