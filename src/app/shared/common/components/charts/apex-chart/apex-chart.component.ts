import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexTooltip,
    ApexXAxis,
    NgApexchartsModule,
} from 'ng-apexcharts';
import { SupplierPerformanceReport } from '../../../../../dashboard/supply/models/SupplierPerformance';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-apex-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './apex-chart.component.html',
  styleUrl: './apex-chart.component.css'
})
export class ApexChartComponent implements OnInit, OnChanges {

    @Input() chartOptions: ChartOptions = {
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
    @Input() performanceReport: SupplierPerformanceReport | undefined = undefined;
    @Input() data: Record<number, number> = {};

    ngOnInit(): void {
        this.updateChartData();
    }

    ngOnChanges(): void {
        // this.updateChartData();
    }

    updateChartData(): void {
        console.log('Data: ', this.data);
        if (!this.data) {
            console.error('No data provided');
        }
        this.chartOptions.series = [{
            name: "",
            data: this.prepareSeriesData(this.data)
        }];

        this.chartOptions.xaxis = {
            categories: this.prepareXAxisCategories(this.data)
        };
    }
        
    prepareSeriesData(deliveredQuantityOverTime: Record<number, number>): { x: number, y: number }[] {
        return Object.entries(deliveredQuantityOverTime).map(([day, quantity]) => ({
            x: Number(day),
            y: quantity
        }));
    }

    prepareXAxisCategories(deliveredQuantityOverTime: Record<number, number>): string[] {
        return Object.keys(deliveredQuantityOverTime).map(day => `Day ${day}`);
    }
}
