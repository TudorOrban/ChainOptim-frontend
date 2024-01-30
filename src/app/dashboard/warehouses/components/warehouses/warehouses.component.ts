import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrganizationService } from '../../../organization/services/OrganizationService';
import { faBox, faBuilding, faWarehouse } from '@fortawesome/free-solid-svg-icons';
import { Warehouse } from '../../models/Warehouse';
import { WarehouseService } from '../../services/WarehouseService';
import { Organization } from '../../../organization/models/organization';


@Component({
    selector: 'app-organization',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, RouterModule],
    templateUrl: './warehouses.component.html',
    styleUrl: './warehouses.component.css',
})
export class WarehousesComponent implements OnInit {
    currentOrganization: Organization | null = null;
    warehouses: Warehouse[] = [];

    constructor(
        private organizationService: OrganizationService,
        private warehouseService: WarehouseService
    ) {}
    
    ngOnInit() {
        this.organizationService.getCurrentOrganization().subscribe((orgData) => {
            if (orgData) {
                this.currentOrganization = orgData;
                this.warehouseService.getWarehousesByOrganizationId(orgData.id).subscribe((warehouses) => {
                    this.warehouses = warehouses;
                    console.log("DAS", orgData, warehouses);
                });
            }
        });
    }
    

    faBuilding = faBuilding;
    faWarehouse = faWarehouse;
}
