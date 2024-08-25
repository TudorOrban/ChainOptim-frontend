import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Warehouse, WarehouseOverviewDTO } from '../../../models/Warehouse';
import { WarehouseService } from '../../../services/warehouse.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OverviewSectionComponent } from '../../../../../shared/common/components/overview-section/overview-section.component';

@Component({
    selector: 'app-warehouse-overview',
    standalone: true,
    imports: [CommonModule, RouterModule, OverviewSectionComponent],
    templateUrl: './warehouse-overview.component.html',
    styleUrl: './warehouse-overview.component.css'
})
export class WarehouseOverviewComponent implements OnInit, OnChanges {
    @Input() warehouse: Warehouse | undefined = undefined;

    warehouseOverview: WarehouseOverviewDTO | undefined = undefined;
    hasLoadedOverview: boolean = false;

    constructor(
        private warehouseService: WarehouseService
    ) { }


    ngOnInit(): void {
        if (!this.warehouse) {
            return;
        }

        this.warehouseService.getWarehouseOverview(this.warehouse!.id).subscribe((overview) => {
            this.warehouseOverview = overview
            this.hasLoadedOverview = true;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.warehouse || this.hasLoadedOverview) {
            return;
        }
        if (changes['warehouse'] && this.warehouse) {
            this.warehouseService.getWarehouseOverview(this.warehouse.id).subscribe((overview) => {
                this.warehouseOverview = overview;
            });
        }
    }
}
