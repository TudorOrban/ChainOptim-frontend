import { Component, ComponentRef, Inject, Input, PLATFORM_ID, ViewChild, ViewContainerRef } from '@angular/core';
import { ProductionHistoryService } from '../../../../../services/productionhistory.service';
import { CommonModule, formatDate, isPlatformBrowser } from '@angular/common';
import { FactoryProductionHistory, HistoryChartData, ProductionHistory } from '../../../../../models/ResourceAllocation';
import { BarChartComponent } from '../../../../../../../shared/common/components/charts/bar-chart/bar-chart.component';
import { UIItem } from '../../../../../../../shared/search/models/searchTypes';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-production-history',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './production-history.component.html',
  styleUrl: './production-history.component.css'
})
export class ProductionHistoryComponent {
    @Input() inputData: { factoryId: number } | undefined = undefined;

    @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef | undefined;
    componentRef: ComponentRef<BarChartComponent> | undefined;
    
    isBrowser: boolean;

    history: FactoryProductionHistory | undefined = undefined;
    durationOptions: UIItem[] = [
        {
            label: "Last Week", value: "week"
        },
        {
            label: "Last Month", value: "month"
        },
        {
            label: "Last 6 Months", value: "6months"
        },
        {
            label: "Last Year", value: "year"
        },
        {
            label: "Last 2 Years", value: "2years"
        },
    ];
    selectedDuration: string = "week";
    
    faArrowRotateRight = faArrowRotateRight;

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
            
            // this.handleComponentIdChange(this.selectedComponentId);
            this.componentRef.instance.data = this.getChartInputData(history.productionHistory);
        })
    }
    
    getChartInputData(productionHistory: ProductionHistory): HistoryChartData {
        const numOfSegments = 10;  // Adjust based on desired granularity
        const startDate = new Date(productionHistory.startDate);
        const endDate = this.calculateEndDate(productionHistory);
        const totalDuration = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24); // Duration in days
        const segmentSize = totalDuration / numOfSegments;

        const requestedAmountsDataset: number[] = new Array(numOfSegments).fill(0);
        const allocatedAmountsDataset: number[] = new Array(numOfSegments).fill(0);
        const actualAmountsDataset: number[] = new Array(numOfSegments).fill(0);
        const categories: string[] = new Array(numOfSegments);

        for (let i = 0; i < numOfSegments; i++) {
            const segmentStartDay = startDate.getTime() + (segmentSize * i * 86400000);
            const segmentMidPoint = new Date(segmentStartDay + (segmentSize * 86400000 / 2));
            categories[i] = formatDate(segmentMidPoint, 'MMM d, yyyy', 'en-US');  // Format the date for the category label
        }

        Object.entries(productionHistory.dailyProductionRecords).forEach(([daysSinceStart, record]) => {
            const segmentIndex = Math.floor((parseFloat(daysSinceStart) + record.durationDays / 2) / segmentSize);
            if (segmentIndex >= 0 && segmentIndex < numOfSegments) {
                record.allocations.forEach(allocation => {
                    if (allocation.requestedAmount !== undefined) {
                        requestedAmountsDataset[segmentIndex] += allocation.requestedAmount;
                    }
                    if (allocation.allocatedAmount !== undefined) {
                        allocatedAmountsDataset[segmentIndex] += allocation.allocatedAmount;
                    }
                    if (allocation.actualAmount !== undefined) {
                        actualAmountsDataset[segmentIndex] += allocation.actualAmount;
                    }
                });
            }
        });

        return {
            datasets: [
                { name: 'Requested Amounts', data: requestedAmountsDataset },
                { name: 'Allocated Amounts', data: allocatedAmountsDataset },
                { name: 'Actual Amounts', data: actualAmountsDataset }
            ],
            categories  // Include formatted date categories
        };
    }

    private calculateEndDate(productionHistory: ProductionHistory): Date {
        const endDate = new Date(productionHistory.startDate);
        const maxDays = Math.max(...Object.keys(productionHistory.dailyProductionRecords).map(day => parseFloat(day)));
        endDate.setDate(endDate.getDate() + maxDays);
        return endDate;
    }
}
