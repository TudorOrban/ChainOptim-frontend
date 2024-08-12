import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Factory, FactoryOverviewDTO } from '../../../models/Factory';
import { FactoryService } from '../../../services/factory.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OverviewSectionComponent } from '../../../../../shared/common/components/overview-section/overview-section.component';

@Component({
    selector: 'app-factory-overview',
    standalone: true,
    imports: [CommonModule, RouterModule, OverviewSectionComponent],
    templateUrl: './factory-overview.component.html',
    styleUrl: './factory-overview.component.css'
})
export class FactoryOverviewComponent implements OnInit, OnChanges {
    @Input() factory: Factory | undefined = undefined;

    factoryOverview: FactoryOverviewDTO | undefined = undefined;
    hasLoadedOverview: boolean = false;

    constructor(
        private factoryService: FactoryService
    ) { }


    ngOnInit(): void {
        if (!this.factory) {
            return;
        }

        this.factoryService.getFactoryOverview(this.factory!.id).subscribe((overview) => {
            this.factoryOverview = overview
            this.hasLoadedOverview = true;
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.factory || this.hasLoadedOverview) {
            return;
        }
        if (changes['factory'] && this.factory) {
            this.factoryService.getFactoryOverview(this.factory.id).subscribe((overview) => {
                this.factoryOverview = overview;
            });
        }
    }
}
