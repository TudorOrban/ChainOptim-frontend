import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { ClientEvaluationComponent } from './client-evaluation/client-evaluation.component';
import { ClientOverviewComponent } from './client-overview/client-overview.component';
import { TabsComponent } from '../../../../shared/common/components/tabs/tabs.component';
import { ClientOrdersComponent } from './client-orders/client-orders.component';
import { ClientShipmentsComponent } from './client-shipments/client-shipments.component';
import { FallbackManagerComponent } from '../../../../shared/fallback/components/fallback-manager/fallback-manager.component';
import { Client } from '../../models/client';
import { FallbackManagerService, FallbackManagerState } from '../../../../shared/fallback/services/fallback-manager/fallback-manager.service';
import { NavigationItem } from '../../../../shared/common/models/UITypes';
import { ClientService } from '../../services/client.service';
import { OrganizationService } from '../../../organization/services/organization.service';

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
    ],
    templateUrl: './client.component.html',
    styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
    clientId: string | null = null;
    client: Client | null = null;
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
    activeTab: string = "Overview";

    constructor(
        private route: ActivatedRoute,
        private clientService: ClientService,
        private fallbackManagerService: FallbackManagerService
    ) {}

    ngOnInit() {
        // Manage fallbacks
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
        this.fallbackManagerService.updateLoading(true);

        this.route.paramMap.subscribe((params) => {
            this.clientId = params.get('clientId');
            
            this.clientService
                .getClientById(Number(this.clientId))
                .subscribe({
                    next: (client) => {
                        console.log('CLIENT', client);
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

    faBox = faBox;
    faGear = faGear;
}
