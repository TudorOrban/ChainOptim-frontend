import { Component, ComponentRef, Inject, Input, PLATFORM_ID, ViewChild, ViewContainerRef } from '@angular/core';
import { ProductionHistoryService } from '../../../../../services/productionhistory.service';
import { CommonModule, formatDate, isPlatformBrowser } from '@angular/common';
import { DailyProductionRecord, FactoryProductionHistory, HistoryChartData, ProductionHistory } from '../../../../../models/ResourceAllocation';
import { BarChartComponent } from '../../../../../../../shared/common/components/charts/bar-chart/bar-chart.component';
import { UIItem } from '../../../../../../../shared/search/models/searchTypes';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-production-history',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
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
    selectedDuration: string = "year";
    
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
            this.handleDurationChange();
        })
    }

    handleDurationChange() {
        console.log("Duration changed to: ", this.selectedDuration);

        if (!this.componentRef) {
            return;
        }
        if (!this.history?.productionHistory?.dailyProductionRecords) {
            return;
        }

        this.componentRef.instance.data = this.getChartInputData(this.history.productionHistory);
        this.componentRef.instance.startingDate = new Date(this.history.productionHistory.startDate);
        this.componentRef.instance.updateChartData();
    }
    
    getChartInputData(productionHistory: ProductionHistory): HistoryChartData {
        const endDate = new Date();
        const startDate = this.calculateStartDate(endDate);
        const totalDuration = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
        const numOfSegments = 10;
        const segmentSize = totalDuration / numOfSegments;

        return this.fillDataSegments(productionHistory, startDate, segmentSize, numOfSegments);
    }

    private fillDataSegments(productionHistory: ProductionHistory, startDate: Date, segmentSize: number, numOfSegments: number): HistoryChartData {
        const requestedAmountsDataset: number[] = new Array(numOfSegments).fill(0);
        const allocatedAmountsDataset: number[] = new Array(numOfSegments).fill(0);
        const actualAmountsDataset: number[] = new Array(numOfSegments).fill(0);
        const categories = this.formatDateCategories(startDate, segmentSize, numOfSegments);

        Object.entries(productionHistory.dailyProductionRecords || {}).forEach(([daysSinceStart, record]) => {
            const segmentIndex = Math.floor((parseFloat(daysSinceStart) + record.durationDays / 2) / segmentSize);
            if (segmentIndex >= 0 && segmentIndex < numOfSegments) {
                this.aggregateSegmentData(segmentIndex, record, requestedAmountsDataset, allocatedAmountsDataset, actualAmountsDataset);
            }
        });

        return {
            datasets: [
                { name: 'Requested Amounts', data: requestedAmountsDataset },
                { name: 'Allocated Amounts', data: allocatedAmountsDataset },
                { name: 'Actual Amounts', data: actualAmountsDataset }
            ],
            categories
        };
    }
    
    private aggregateSegmentData(segmentIndex: number, record: DailyProductionRecord, requestedAmountsDataset: number[], allocatedAmountsDataset: number[], actualAmountsDataset: number[]) {
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

    private formatDateCategories(startDate: Date, segmentSize: number, numOfSegments: number): string[] {
        const categories = new Array(numOfSegments);
        for (let i = 0; i < numOfSegments; i++) {
            const segmentStartDay = startDate.getTime() + (segmentSize * i * 86400000);
            const segmentMidPoint = new Date(segmentStartDay + (segmentSize * 86400000 / 2));
            categories[i] = formatDate(segmentMidPoint, 'MMM d, yyyy', 'en-US');
        }
        return categories;
    }
    
    private calculateStartDate(currentDate: Date): Date {
        const startDate = new Date(currentDate);
        switch (this.selectedDuration) {
            case 'week':
                startDate.setDate(currentDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(currentDate.getMonth() - 1);
                break;
            case '6months':
                startDate.setMonth(currentDate.getMonth() - 6);
                break;
            case 'year':
                startDate.setFullYear(currentDate.getFullYear() - 1);
                break;
            case '2years':
                startDate.setFullYear(currentDate.getFullYear() - 2);
                break;
        }
        return startDate;
    }
}
