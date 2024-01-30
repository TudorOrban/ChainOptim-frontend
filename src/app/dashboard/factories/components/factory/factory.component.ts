import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FactoryService } from '../../services/FactoryService';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faGear, faIndustry } from '@fortawesome/free-solid-svg-icons';
import { Factory } from '../../models/Factory';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../../../organization/services/OrganizationService';

@Component({
    selector: 'app-factory',
    standalone: true,
    imports: [CommonModule, RouterModule, FontAwesomeModule],
    templateUrl: './factory.component.html',
    styleUrl: './factory.component.css',
})
export class FactoryComponent implements OnInit {
    factoryId: string | null = null;
    factory: Factory | null = null;

    constructor(
        private route: ActivatedRoute,
        private factoryService: FactoryService,
        private organizationService: OrganizationService,
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            this.factoryId = params.get('factoryId');
            this.factoryService
                .getFactoryById(Number(this.factoryId))
                .subscribe((factory) => {
                    console.log('FACTORY', factory);
                    this.factory = factory;
                });

            
        });
    }
    
    faIndustry = faIndustry;
}
