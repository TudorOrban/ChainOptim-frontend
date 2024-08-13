import { Component, Input } from '@angular/core';
import { ProductionHistory } from '../../../../../dashboard/production/models/ResourceAllocation';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartType } from 'ng-apexcharts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-bar-chart',
    standalone: true,
    imports: [CommonModule, NgApexchartsModule, FontAwesomeModule],
    templateUrl: './bar-chart.component.html',
    styleUrl: './bar-chart.component.css',
})
export class BarChartComponent {
    @Input() chartOptions = {
        series: [
            {
                name: 'Net Profit',
                data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
            },
            {
                name: 'Revenue',
                data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
            },
            {
                name: 'Free Cash Flow',
                data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
            },
        ],
        chart: {
            type: "bar" as ChartType,
            height: 350,
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
                text: '$ (thousands)',
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val: number) {
                    return '$ ' + val + ' thousands';
                },
            },
        },
    };

    @Input() history: ProductionHistory | undefined = undefined;

}
