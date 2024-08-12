import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Supplier } from '../../../models/Supplier';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexTooltip,
    ApexXAxis,
} from 'ng-apexcharts';
import { isPlatformBrowser } from '@angular/common';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
};

@Component({
    selector: 'app-supplier-performance',
    standalone: true,
    imports: [],
    templateUrl: './supplier-performance.component.html',
    styleUrl: './supplier-performance.component.css',
})
export class SupplierPerformanceComponent implements OnInit {
    @Input() supplier: Supplier | undefined = undefined;
    public chartOptions: ChartOptions = {
        series: [{
            name: 'Initial',
            data: [],
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
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);

        
    }

    async ngOnInit() {
        if (this.isBrowser) {
            import('ng-apexcharts').then((module) => {
                // Now that we know we're in the browser, initialize chart options
                this.chartOptions = {
                    series: [{
                        name: 'Delivered Quantity',
                        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
                    }],
                    chart: {
                        height: 350,
                        type: 'line'
                    },
                    xaxis: {
                        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
                    },
                    tooltip: {},
                    dataLabels: {}
                };
            }).catch(err => console.error("Failed to load ng-apexcharts", err));
        }
    }
}
