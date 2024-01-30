import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrganizationService } from '../../../organization/services/OrganizationService';
import { faBox, faBuilding, faIndustry } from '@fortawesome/free-solid-svg-icons';
import { Factory } from '../../models/Factory';
import { FactoryService } from '../../services/FactoryService';
import { Organization } from '../../../organization/models/organization';
import { FallbackManagerComponent } from '../../../../shared/components/fallback/fallback-manager/fallback-manager.component';
import {
    FallbackManagerService,
    FallbackManagerState,
} from '../../../../shared/services/fallback/fallback-manager/fallback-manager.service';
import { distinctUntilChanged, filter } from 'rxjs';

@Component({
    selector: 'app-factory',
    standalone: true,
    imports: [
        CommonModule,
        FontAwesomeModule,
        RouterModule,
        FallbackManagerComponent,
    ],
    templateUrl: './factories.component.html',
    styleUrl: './factories.component.css',
})
export class FactoriesComponent implements OnInit {
    currentOrganization: Organization | null = null;
    factories: Factory[] = [];
    fallbackManagerState: FallbackManagerState = {};

    constructor(
        private organizationService: OrganizationService,
        private factoryService: FactoryService,
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

                        // Load factories
                        this.loadFactories(orgData.id);
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

    private loadFactories(organizationId: number) {
        this.factoryService
            .getFactoriesByOrganizationId(organizationId)
            .subscribe({
                next: (factories) => {
                    this.factories = factories;

                    // Manage fallback state
                    if (factories.length === 0) {
                        this.fallbackManagerService.updateNoResults(true);
                    }
                    this.fallbackManagerService.updateLoading(false);
                },
                error: (err: Error) => {
                    this.fallbackManagerService.updateError(err.message ?? '');
                },
            });
    }

    faIndustry = faIndustry;
}
