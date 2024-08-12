import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Supplier, SupplierOverviewDTO } from '../../../models/Supplier';
import { SupplierService } from '../../../services/supplier.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OverviewSectionComponent } from '../../../../../shared/common/components/overview-section/overview-section.component';

@Component({
    selector: 'app-supplier-overview',
    standalone: true,
    imports: [CommonModule, RouterModule, OverviewSectionComponent],
    templateUrl: './supplier-overview.component.html',
    styleUrl: './supplier-overview.component.css'
})
export class SupplierOverviewComponent implements OnInit, OnChanges {
    @Input() supplier: Supplier | undefined = undefined;

    supplierOverview: SupplierOverviewDTO | undefined = undefined;
    hasLoadedOverview: boolean = false;

    constructor(
        private supplierService: SupplierService
    ) { }


    ngOnInit(): void {
        if (!this.supplier) {
            return;
        }

        this.supplierService.getSupplierOverview(this.supplier!.id).subscribe((overview) => {
            this.supplierOverview = overview
            this.hasLoadedOverview = true;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.supplier || this.hasLoadedOverview) {
            return;
        }
        if (changes['supplier'] && this.supplier) {
            this.supplierService.getSupplierOverview(this.supplier.id).subscribe((overview) => {
                this.supplierOverview = overview;
            });
        }
    }
}
