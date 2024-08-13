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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CommonModule, formatDate } from '@angular/common';

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
  imports: [CommonModule, NgApexchartsModule, FontAwesomeModule],
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
            height: 300,
        },
        xaxis: {
            type: 'category',
            categories: ['Jan 01', 'Jan 02', 'Jan 03', 'Jan 04'],
            labels: {
                rotate: -45,
                rotateAlways: true,
                hideOverlappingLabels: false,
                trim: false,
                minHeight: 200
            },
            tickPlacement: 'on',
        },
        tooltip: {}, 
        dataLabels: {} 
    };
    @Input() data: Record<number, number> = {};
    @Input() startingDate: Date | undefined = undefined;

    isLoading: boolean = false;

    numOfSegments = 20;

    faSpinner = faSpinner;


    ngOnInit(): void {
        this.updateChartData();
    }

    updateChartData(): void {
        console.log('Data: ', this.data);
        if (!this.data) {
            console.error('No data provided');
        }

        this.isLoading = true;
        this.chartOptions.series = [{
            name: "",
            data: this.prepareSeriesData(this.data)
        }];

        const categories = this.prepareXAxisCategories(this.data);
        this.chartOptions.xaxis = {
            categories: categories,
        };
        
        this.isLoading = false;
    }
        
    prepareSeriesData(deliveredQuantityOverTime: Record<number, number>): { x: number, y: number }[] {
        const dayKeys = Object.keys(deliveredQuantityOverTime).map(Number); // Convert keys to numbers
        const maxDay = Math.max(...dayKeys);
        const minDay = Math.min(...dayKeys);
        const totalInterval = maxDay - minDay;
        const segmentSize = totalInterval / this.numOfSegments;
    
        // Create a new map to ensure float keys are handled correctly
        const flooredDeliveredQuantityOverTime = Object.entries(deliveredQuantityOverTime).reduce((acc, [key, value]) => {
            const flooredKey = Math.floor(parseFloat(key));
            acc[flooredKey] = value;
            return acc;
        }, {} as Record<number, number>);
    
        let seriesData = [];
        for (let i = 0; i < this.numOfSegments; i++) {
            const segmentStart = minDay + i * segmentSize;
            const segmentEnd = segmentStart + segmentSize;
    
            const segmentPoints = dayKeys.filter(day => day >= segmentStart && day < segmentEnd);
            
            const sum = segmentPoints.reduce((acc, day) => {
                const value = flooredDeliveredQuantityOverTime[day];
                return acc + (value !== undefined ? value : 0);
            }, 0);
    
            seriesData.push({
                x: i,
                y: segmentPoints.length > 0 ? sum / segmentPoints.length : 0 // Average, or sum if you prefer
            });
        }
    
        return seriesData;
    }
    
    prepareXAxisCategories(deliveredQuantityOverTime: Record<number, number>): string[] {
        if (!this.startingDate) {
            console.error('Starting date not provided');
            return [];
        }
    
        const totalDays = Object.keys(deliveredQuantityOverTime).map(day => parseFloat(day));
        const maxDay = Math.max(...totalDays);
        const minDay = Math.min(...totalDays);
        const totalInterval = maxDay - minDay;

        let categories = [];
        for (let i = 0; i < this.numOfSegments; i++) {
            const segmentDay = minDay + i * (totalInterval / this.numOfSegments);
            const date = new Date(this.startingDate.getTime() + segmentDay * 86400000);
            categories.push(formatDate(date, 'MMM d, yyyy', 'en-US'));
        }
    
        return categories;
    }

    determineDateFormat(maxDay: number): string {
        if (maxDay > 365) {
            return 'MMM yyyy';
        } else if (maxDay > 30) {
            return 'MMM d';
        }
        return 'MMM d, yyyy';
    }
}
