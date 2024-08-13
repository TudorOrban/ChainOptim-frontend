import { Component, Input, OnInit } from '@angular/core';
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
export class ApexChartComponent implements OnInit {

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

    ngOnInit(): void {
        console.log("Performance report", this.performanceReport);
        
        if (this.performanceReport) {
            this.updateChartData();
        }
    }

    updateChartData(): void {
        console.log("Performance report components", this.performanceReport?.componentPerformances);
        if (this.performanceReport?.componentPerformances) {
            const componentIds = Object.keys(this.performanceReport.componentPerformances).map(key => Number(key));
            if (componentIds.length > 0) {
                // Assuming you're interested in the first component for demonstration
                const firstComponentId = componentIds[0];
                const componentData = this.performanceReport.componentPerformances[firstComponentId];
    
                console.log("Component data", componentData);
    
                // Transform the data into the series format expected by ApexCharts
                this.chartOptions.series = [{
                    name: componentData.componentName,
                    data: this.prepareSeriesData(componentData.deliveredQuantityOverTime)
                }];
    
                // Optionally update the x-axis categories if appropriate
                this.chartOptions.xaxis = {
                    categories: this.prepareXAxisCategories(componentData.deliveredQuantityOverTime)
                };
            }
        }
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
    // mapToChartData(deliveredQuantityOverTime: Map<number, number>): { x: number, y: number }[] {
    //     return Array.from(deliveredQuantityOverTime, ([days, quantity]) => ({ x: days, y: quantity }));
    // }

    // getCategories(deliveredQuantityOverTime: Map<number, number>): string[] {
    //     return Array.from(deliveredQuantityOverTime.keys()).map(day => `Day ${day}`);
    // }
}
