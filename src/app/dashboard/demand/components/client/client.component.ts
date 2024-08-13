import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { ClientEvaluationComponent } from './client-evaluation/client-evaluation.component';
import { ClientOverviewComponent } from './client-overview/client-overview.component';
import { TabsComponent } from '../../../../shared/common/components/tabs/tabs.component';
import { ClientOrdersComponent } from '../client-orders/client-orders.component';
import { ClientShipmentsComponent } from '../client-shipments/client-shipments.component';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import { Client } from '../../models/Client';
import { FallbackManagerService, FallbackManagerState } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { NavigationItem } from '../../../../shared/common/models/uiTypes';
import { ClientService } from '../../services/client.service';
import { ConfirmDialogInput } from '../../../../shared/common/models/confirmDialogTypes';
import { OperationOutcome, ToastInfo } from '../../../../shared/common/components/toast-system/toastTypes';
import { ToastService } from '../../../../shared/common/components/toast-system/toast.service';
import { GenericConfirmDialogComponent } from '../../../../shared/common/components/generic-confirm-dialog/generic-confirm-dialog.component';
import { SearchMode } from '../../../../shared/enums/commonEnums';

@Component({
    selector: 'app-client',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,
        TabsComponent,
        ClientOverviewComponent,
        ClientOrdersComponent,
        ClientShipmentsComponent,
        ClientEvaluationComponent,
        FallbackManagerComponent,
        GenericConfirmDialogComponent
    ],
    templateUrl: './client.component.html',
    styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
    clientId: number | undefined = undefined;
    client: Client | undefined = undefined;
    fallbackManagerState: FallbackManagerState = {};
    tabs: NavigationItem[] = [
        {
            label: "Overview",
        },
        {
            label: "Client Orders",
        },
        {
            label: "Client Shipments",
        },
        {
            label: "Evaluation",
        },
    ]
    SearchMode = SearchMode;
    activeTab: string = "Overview";
    deleteDialogInput: ConfirmDialogInput = {
        dialogTitle: "Delete Client",
        dialogMessage: "Are you sure you want to delete this client?",
    };
    isConfirmDialogOpen = false;
    toastInfo: ToastInfo = {
        id: 1,
        title: "Client deleted",
        message: "The client has been deleted successfully",
        outcome: OperationOutcome.SUCCESS
    };

    constructor(
        private route: ActivatedRoute,
        private clientService: ClientService,
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
            this.clientId = Number(params.get('clientId'));
            
            this.clientService
                .getClientById(Number(this.clientId))
                .subscribe({
                    next: (client) => {
                        this.client = client;
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

    handleDeleteClient() {
        this.clientService
            .deleteClient(Number(this.clientId))
            .subscribe({
                next: (success) => {
                    this.toastService.addToast({ id: 123, title: 'Success', message: 'Client deleted successfully.', outcome: OperationOutcome.SUCCESS });
                    this.router.navigate(['/dashboard/clients']);
                },
                error: (error: Error) => {
                    this.toastService.addToast({ id: 123, title: 'Error', message: 'Client deletion failed.', outcome: OperationOutcome.ERROR });
                    console.error('Error deleting client:', error);
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
