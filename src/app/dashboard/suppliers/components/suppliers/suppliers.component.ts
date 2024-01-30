import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrganizationService } from '../../../organization/services/OrganizationService';
import { faBox, faBuilding, faTruckArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Supplier } from '../../models/Supplier';
import { SupplierService } from '../../services/SupplierService';
import { Organization } from '../../../organization/models/organization';


@Component({
    selector: 'app-organization',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, RouterModule],
    templateUrl: './suppliers.component.html',
    styleUrl: './suppliers.component.css',
})
export class SuppliersComponent implements OnInit {
    currentOrganization: Organization | null = null;
    suppliers: Supplier[] = [];

    constructor(
        private organizationService: OrganizationService,
        private supplierService: SupplierService
    ) {}
    
    ngOnInit() {
        this.organizationService.getCurrentOrganization().subscribe((orgData) => {
            if (orgData) {
                this.currentOrganization = orgData;
                this.supplierService.getSuppliersByOrganizationId(orgData.id).subscribe((suppliers) => {
                    this.suppliers = suppliers;
                    console.log("DAS", orgData, suppliers);
                });
            }
        });
    }
    

    faBuilding = faBuilding;
    faTruckArrowRight = faTruckArrowRight;
}
