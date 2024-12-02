import { Component, Input, OnInit } from '@angular/core';
import { ErrorFallbackComponent } from '../error-fallback/error-fallback.component';
import { NoOrganizationFallbackComponent } from '../no-organization-fallback/no-organization-fallback.component';
import { NoResultsFallbackComponent } from '../no-results-fallback/no-results-fallback.component';
import { CommonModule } from '@angular/common';
import {
    FallbackManagerService,
    FallbackManagerState,
} from '../../services/fallback-manager/fallback-manager.service';
import { LoadingFallbackComponent } from '../loading-fallback/loading-fallback.component';

@Component({
    selector: 'app-fallback-manager',
    standalone: true,
    imports: [
        CommonModule,
        ErrorFallbackComponent,
        LoadingFallbackComponent,
        NoOrganizationFallbackComponent,
        NoResultsFallbackComponent,
    ],
    templateUrl: './fallback-manager.component.html',
    styleUrl: './fallback-manager.component.css',
})
export class FallbackManagerComponent implements OnInit {
    @Input() fallbackManagerState: FallbackManagerState = {};

    constructor(private readonly fallbackManagerService: FallbackManagerService) {}

    ngOnInit() {
        // Subscribe to state changes
        this.fallbackManagerService.fallbackManagerState$.subscribe((state) => {
            this.fallbackManagerState = state;
        });
    }

}
