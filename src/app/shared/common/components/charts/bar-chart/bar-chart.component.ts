import { Component, Input, OnInit } from '@angular/core';
import { HistoryChartData, ProductionHistory } from '../../../../../dashboard/production/models/ResourceAllocation';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartType } from 'ng-apexcharts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-bar-chart',
    standalone: true,
    imports: [CommonModule, NgApexchartsModule, FontAwesomeModule],
    templateUrl: './bar-chart.component.html',
    styleUrl: './bar-chart.component.css',
})
export class BarChartComponent implements OnInit{
    @Input() chartOptions = {
        series: [
            {
                name: 'Requested Amount',
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
            },
            {
                name: 'Allocated Amount',
                data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
            },
            {
                name: 'Actual Amount',
                data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
            },
        ],
        chart: {
            type: "bar" as ChartType,
            height: 400,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories: [
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
            ],
        },
        yaxis: {
            title: {
                text: '',
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return `${val}`;
                },
            },
        },
    };

    @Input() data: HistoryChartData | undefined = undefined;

    isLoading: boolean = false;
    
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
        this.chartOptions.series = [
            {
                name: this.data?.datasets?.[0]?.name ?? '',
                data: this.data?.datasets?.[0]?.data ?? [],
            },
            {
                name: this.data?.datasets?.[1]?.name ?? '',
                data: this.data?.datasets?.[1]?.data ?? [],
            },
            {
                name: this.data?.datasets?.[2]?.name ?? '',
                data: this.data?.datasets?.[2]?.data ?? [],
            },
        ];

        this.isLoading = false;

        if (!this.data?.categories) {
            return;
        }
        this.chartOptions.xaxis = {
            categories: this.data?.categories,
        };
    }
}
