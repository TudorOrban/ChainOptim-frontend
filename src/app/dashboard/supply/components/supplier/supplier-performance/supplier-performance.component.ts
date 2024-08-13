import { Component, Inject, Input, OnInit, PLATFORM_ID, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Supplier } from '../../../models/Supplier';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApexChartComponent, ChartOptions } from '../../../../../shared/common/components/charts/apex-chart/apex-chart.component';
import { SupplierPerformanceService } from '../../../services/supplierperformance.service';
import { SupplierPerformanceReport } from '../../../models/SupplierPerformance';



@Component({
    selector: 'app-supplier-performance',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './supplier-performance.component.html',
    styleUrl: './supplier-performance.component.css',
})
export class SupplierPerformanceComponent implements OnInit {
    @Input() supplier: Supplier | undefined = undefined;
    @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef | undefined;
    public chartOptions: ChartOptions = {
        series: [{
            name: 'Initial',
            data: [15, 60, 50, 70, 80, 90, 100, 110, 120],
        }],
        chart: {
            type: 'line',
            height: 350,
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        },
        tooltip: {}, // Define a sensible default or an empty object
        dataLabels: {} // Define a sensible default or an empty object
    };
    isBrowser: boolean;

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private performanceService: SupplierPerformanceService,
    ) {
        this.isBrowser = isPlatformBrowser(platformId);

        
    }

    async ngOnInit() {
        this.loadData();
        
    }

    private loadData() {
        if (!this.supplier?.id) {
            console.error("Supplier ID not set");
            return;
        }

        this.performanceService.getSupplierPerformanceBySupplierId(this.supplier.id, false).subscribe((performance) => {
            console.log("Performance data loaded", performance);
            this.loadMapComponent(performance.report);
        });
    }

    private loadMapComponent(report: SupplierPerformanceReport) {
        if (!this.isBrowser) {
            return;
        }
        import('../../../../../shared/common/components/charts/apex-chart/apex-chart.component').then(({ ApexChartComponent }) => {
            const componentRef = this.chartContainer?.createComponent(ApexChartComponent);
            if (componentRef) {
                componentRef.instance.chartOptions = this.chartOptions;
                componentRef.instance.performanceReport = report;
            }
        })
    }
}
