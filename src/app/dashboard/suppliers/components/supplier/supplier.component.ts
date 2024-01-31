import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SupplierService } from '../../services/SupplierService';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faBox,
    faGear,
    faTruckArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import {
    Supplier,
} from '../../models/Supplier';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../../../organization/services/OrganizationService';
import {
    FallbackManagerService,
    FallbackManagerState,
} from '../../../../shared/services/fallback/fallback-manager/fallback-manager.service';
import { FallbackManagerComponent } from '../../../../shared/components/fallback/fallback-manager/fallback-manager.component';

@Component({
    selector: 'app-supplier',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,
        FallbackManagerComponent,
    ],
    templateUrl: './supplier.component.html',
    styleUrl: './supplier.component.css',
})
export class SupplierComponent implements OnInit {
    supplierId: string | null = null;
    supplier: Supplier | null = null;
    fallbackManagerState: FallbackManagerState = {};

    constructor(
        private route: ActivatedRoute,
        private supplierService: SupplierService,
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

    faTruckArrowRight = faTruckArrowRight;
    faGear = faGear;
}
