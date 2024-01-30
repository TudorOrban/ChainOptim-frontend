import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SupplierService } from '../../services/SupplierService';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear, faIndustry, faTruckArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Supplier } from '../../models/Supplier';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../../../organization/services/OrganizationService';

@Component({
    selector: 'app-supplier',
    standalone: true,
    imports: [CommonModule, RouterModule, FontAwesomeModule],
    templateUrl: './supplier.component.html',
    styleUrl: './supplier.component.css',
})
export class SupplierComponent implements OnInit {
    supplierId: string | null = null;
    supplier: Supplier | null = null;

    constructor(
        private route: ActivatedRoute,
        private supplierService: SupplierService,
        private organizationService: OrganizationService,
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            this.supplierId = params.get('supplierId');
            this.supplierService
                .getSupplierById(Number(this.supplierId))
                .subscribe((supplier) => {
                    console.log('SUPPLIER', supplier);
                    this.supplier = supplier;
                });

            
        });
    }
    
    faTruckArrowRight = faTruckArrowRight;
}
