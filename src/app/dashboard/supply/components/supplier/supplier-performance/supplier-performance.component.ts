import { Component, ComponentRef, Inject, Input, OnInit, PLATFORM_ID, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Supplier } from '../../../models/Supplier';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApexChartComponent, ChartOptions } from '../../../../../shared/common/components/charts/apex-chart/apex-chart.component';
import { SupplierPerformanceService } from '../../../services/supplierperformance.service';
import { SupplierPerformance, SupplierPerformanceReport } from '../../../models/SupplierPerformance';
import { ComponentService } from '../../../../goods/services/component.service';
import { ComponentSearchDTO } from '../../../../goods/models/Component';
import { UserService } from '../../../../../core/auth/services/user.service';
import { SelectComponentComponent } from '../../../../../shared/common/components/select/select-component/select-component.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { ScoreComponent } from '../../../../../shared/common/components/score/score.component';

@Component({
    selector: 'app-supplier-performance',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, SelectComponentComponent, ScoreComponent],
    templateUrl: './supplier-performance.component.html',
    styleUrl: './supplier-performance.component.css',
})
export class SupplierPerformanceComponent implements OnInit {
    @Input() supplier: Supplier | undefined = undefined;

    @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef | undefined;
    componentRef: ComponentRef<ApexChartComponent> | undefined;
    
    isBrowser: boolean;

    performance: SupplierPerformance | undefined = undefined;
    componentIds: number[] = [];
    orgComponents: Record<number, ComponentSearchDTO> = {};
    selectedComponentId: number = 0;

    faArrowRotateRight = faArrowRotateRight;

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private userService: UserService,
        private performanceService: SupplierPerformanceService,
        private componentService: ComponentService,
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    async ngOnInit() {
        this.loadData();
        
    }

    private loadData() {
        this.loadOrgComponents();
        this.loadPerformance();
    }

    private loadOrgComponents() {
        this.userService.getCurrentUser().subscribe((user) => {
            if (!user?.organization?.id) {
                console.error("Organization ID not set");
                return;
            }
            this.componentService.getComponentsByOrganizationId(user?.organization?.id, true).subscribe((components) => {
                this.orgComponents = components.reduce((acc, component) => {
                    acc[component.id] = component;
                    return acc;
                }, {} as Record<number, ComponentSearchDTO>);
            });
        });
    }

    private loadPerformance() {
        if (!this.supplier?.id) {
            console.error("Supplier ID not set");
            return;
        }

        this.performanceService.getSupplierPerformanceBySupplierId(this.supplier.id, false).subscribe((performance) => {
            this.componentIds = Object.keys(performance.report.componentPerformances).map(key => Number(key));
            this.selectedComponentId = this.componentIds.length > 2 ? this.componentIds[2] : 0;
            this.loadMapComponent(performance);
        });
    }

    private loadMapComponent(performance: SupplierPerformance) {
        this.performance = performance;
        if (!this.isBrowser) {
            return;
        }
        import('../../../../../shared/common/components/charts/apex-chart/apex-chart.component').then(({ ApexChartComponent }) => {
            this.componentRef = this.chartContainer?.createComponent(ApexChartComponent);
            if (!this.componentRef) {
                return;
            }
            this.componentRef.instance.performanceReport = performance.report;
            
            this.handleComponentIdChange(this.selectedComponentId);
        })
    }

    getAvailableComponents(): ComponentSearchDTO[] {
        return this.componentIds.map(id => this.orgComponents[id]).filter(component => !!component);
    }
 
    handleComponentIdChange(componentId: number) {
        if (!this.performance?.report?.componentPerformances) {
            return;
        }

        this.componentIds = Object.keys(this.performance?.report.componentPerformances).map(key => Number(key));
        if (this.componentIds.length == 0) {
            return;
        }
        this.selectedComponentId = componentId;
        if (!this.performance?.report.componentPerformances[this.selectedComponentId] || !this.componentRef) {
            return;
        }

        const componentData = this.performance?.report.componentPerformances[this.selectedComponentId];
        this.componentRef.instance.data = {...componentData.deliveredQuantityOverTime};
        this.componentRef.instance.startingDate = new Date(componentData.firstDeliveryDate);
        this.componentRef.instance.updateChartData();
    }

    handleRefreshReport() {
        if (!this.supplier?.id) {
            console.error("Supplier ID not set");
            return;
        }
        this.performanceService.getSupplierPerformanceBySupplierId(this.supplier.id, true).subscribe((performance) => {
            console.log("Performance data refreshed", performance);
            this.componentIds = Object.keys(performance.report.componentPerformances).map(key => Number(key));
            this.selectedComponentId = this.componentIds.length > 0 ? this.componentIds[0] : 0;
            this.loadMapComponent(performance);
        });
    }

    formatTimePeriod(days: number | undefined): string {
        if (!days) {
            return '0 days';
        }
        if (days >= 30) {
            const months = Math.floor(days / 30);
            return `${months} month${months > 1 ? 's' : ''}`;
        } else if (days >= 7) {
            const weeks = Math.floor(days / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''}`;
        } else {
            return `${Math.floor(days)} day${days > 1 ? 's' : ''}`;
        }
    }
    
    formatPercentage(value: number | undefined): string {
        if (value === undefined) return '0%';
        return `${(value * 100).toFixed(2)}%`;
    }
}
