import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FactoryService } from '../../services/FactoryService';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear, faIndustry } from '@fortawesome/free-solid-svg-icons';
import {
    Factory,
} from '../../models/Factory';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../../../organization/services/OrganizationService';
import {
    FallbackManagerService,
    FallbackManagerState,
} from '../../../../shared/services/fallback/fallback-manager/fallback-manager.service';
import { FallbackManagerComponent } from '../../../../shared/components/fallback/fallback-manager/fallback-manager.component';

@Component({
    selector: 'app-factory',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,
        FallbackManagerComponent,
    ],
    templateUrl: './factory.component.html',
    styleUrl: './factory.component.css',
})
export class FactoryComponent implements OnInit {
    factoryId: string | null = null;
    factory: Factory | null = null;
    fallbackManagerState: FallbackManagerState = {};

    constructor(
        private route: ActivatedRoute,
        private factoryService: FactoryService,
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

    faIndustry = faIndustry;
    faGear = faGear;
}
