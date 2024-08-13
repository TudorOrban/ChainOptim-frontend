import { Component, ComponentRef, Inject, Input, PLATFORM_ID, ViewChild, ViewContainerRef } from '@angular/core';
import { ProductionHistoryService } from '../../../../../services/productionhistory.service';
import { isPlatformBrowser } from '@angular/common';
import { FactoryProductionHistory, ProductionHistory } from '../../../../../models/ResourceAllocation';
import { BarChartComponent } from '../../../../../../../shared/common/components/charts/bar-chart/bar-chart.component';

@Component({
  selector: 'app-production-history',
  standalone: true,
  imports: [],
  templateUrl: './production-history.component.html',
  styleUrl: './production-history.component.css'
})
export class ProductionHistoryComponent {
    @Input() inputData: { factoryId: number } | undefined = undefined;

    @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef | undefined;
    componentRef: ComponentRef<BarChartComponent> | undefined;
    
    isBrowser: boolean;

    history: FactoryProductionHistory | undefined = undefined;
    
    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private productionHistoryService: ProductionHistoryService,
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    ngOnInit(): void {
        this.loadProductionHistory();
    }
    
    private loadProductionHistory(): void {
        if (!this.inputData?.factoryId) {
            console.error("Error: Factory ID is not valid: ", this.inputData);
            return;
        }

        this.productionHistoryService.getFactoryProductionHistoryByFactoryId(this.inputData.factoryId)
            .subscribe(factoryProductionHistory => {
                console.log("Production History: ", factoryProductionHistory);
                this.loadMapComponent(factoryProductionHistory);
            });
    }
    
    private loadMapComponent(history: FactoryProductionHistory) {
        this.history = history;
        if (!this.isBrowser) {
            return;
        }
        import('../../../../../../../shared/common/components/charts/bar-chart/bar-chart.component').then(({ BarChartComponent }) => {
            this.componentRef = this.chartContainer?.createComponent(BarChartComponent);
            if (!this.componentRef) {
                return;
            }
            this.componentRef.instance.history = history.productionHistory;
            
            // this.handleComponentIdChange(this.selectedComponentId);
        })
    }
}
