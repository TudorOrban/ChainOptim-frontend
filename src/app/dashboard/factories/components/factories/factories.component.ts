import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrganizationService } from '../../../organization/services/OrganizationService';
import { faBox, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Factory } from '../../models/Factory';
import { FactoryService } from '../../services/FactoryService';
import { Organization } from '../../../organization/models/organization';


@Component({
    selector: 'app-organization',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, RouterModule],
    templateUrl: './factories.component.html',
    styleUrl: './factories.component.css',
})
export class FactoriesComponent implements OnInit {
    currentOrganization: Organization | null = null;
    factories: Factory[] = [];

    constructor(
        private organizationService: OrganizationService,
        private factoryService: FactoryService
    ) {}
    
    ngOnInit() {
        this.organizationService.getCurrentOrganization().subscribe((orgData) => {
            if (orgData) {
                this.currentOrganization = orgData;
                this.factoryService.getFactoriesByOrganizationId(orgData.id).subscribe((factories) => {
                    this.factories = factories;
                    console.log("DAS", orgData, factories);
                });
            }
        });
    }
    

    faBuilding = faBuilding;
    faBox = faBox;
}
