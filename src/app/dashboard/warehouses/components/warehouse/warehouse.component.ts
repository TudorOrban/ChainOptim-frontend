import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { WarehouseService } from '../../services/WarehouseService';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear, faIndustry, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { Warehouse } from '../../models/Warehouse';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../../../organization/services/OrganizationService';

@Component({
    selector: 'app-warehouse',
    standalone: true,
    imports: [CommonModule, RouterModule, FontAwesomeModule],
    templateUrl: './warehouse.component.html',
    styleUrl: './warehouse.component.css',
})
export class WarehouseComponent implements OnInit {
    warehouseId: string | null = null;
    warehouse: Warehouse | null = null;

    constructor(
        private route: ActivatedRoute,
        private warehouseService: WarehouseService,
        private organizationService: OrganizationService,
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            this.warehouseId = params.get('warehouseId');
            this.warehouseService
                .getWarehouseById(Number(this.warehouseId))
                .subscribe((warehouse) => {
                    console.log('WAREHOUSE', warehouse);
                    this.warehouse = warehouse;
                });

            
        });
    }
    
    faWarehouse = faWarehouse;
}
