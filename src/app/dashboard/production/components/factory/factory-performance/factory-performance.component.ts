import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Factory, FactoryStageSearchDTO } from '../../../models/Factory';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FactoryPerformanceService } from '../../../services/factoryperformance.service';
import { FactoryPerformance, FactoryStagePerformanceReport } from '../../../models/FactoryPerformance';
import { UserService } from '../../../../../core/user/services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { ScoreComponent } from '../../../../../shared/common/components/score/score.component';
import { FactoryStageService } from '../../../services/factorystage.service';
import { SelectFactoryStageComponent } from '../../../../../shared/common/components/select/select-factory-stage/select-factory-stage.component';
import { UIUtilService } from '../../../../../shared/common/services/uiutil.service';

@Component({
    selector: 'app-factory-performance',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule, SelectFactoryStageComponent, ScoreComponent],
    templateUrl: './factory-performance.component.html',
    styleUrl: './factory-performance.component.css',
})
export class FactoryPerformanceComponent implements OnInit {
    @Input() factory: Factory | undefined = undefined;

    isBrowser: boolean;

    performance: FactoryPerformance | undefined = undefined;
    stageIds: number[] = [];
    orgStages: Record<number, FactoryStageSearchDTO> = {};
    selectedStageId: number = 0;
    currentStageReport: FactoryStagePerformanceReport | undefined = undefined;

    faArrowRotateRight = faArrowRotateRight;

    uiUtilService: UIUtilService;

    constructor(
        @Inject(PLATFORM_ID) platformId: Object,
        private userService: UserService,
        private performanceService: FactoryPerformanceService,
        private stageService: FactoryStageService,
        uiUtilService: UIUtilService,
    ) {
        this.uiUtilService = uiUtilService;
        this.isBrowser = isPlatformBrowser(platformId);
    }

    async ngOnInit() {
        this.loadData();
        
    }

    private loadData() {
        this.loadOrgStages();
        this.loadPerformance();
    }

    private loadOrgStages() {
        this.userService.getCurrentUser().subscribe((user) => {
            if (!user?.organization?.id) {
                console.error("Organization ID not set");
                return;
            }
            this.stageService.getFactoryStagesByOrganizationId(user?.organization?.id).subscribe((stages) => {
                this.orgStages = stages.reduce((acc, stage) => {
                    acc[stage.id] = stage;
                    return acc;
                }, {} as Record<number, FactoryStageSearchDTO>);
            });
        });
    }

    private loadPerformance() {
        if (!this.factory?.id) {
            console.error("Factory ID not set");
            return;
        }

        this.performanceService.getFactoryPerformanceByFactoryId(this.factory.id, false).subscribe((performance) => {
            console.log("Performance data loaded", performance);
            this.performance = performance;
            this.stageIds = Object.keys(performance.report.stageReports).map(key => Number(key));
            this.selectedStageId = this.stageIds.length > 2 ? this.stageIds[2] : 0;
            this.handleStageIdChange(this.selectedStageId);
        });
    }

    getAvailableStages(): FactoryStageSearchDTO[] {
        return this.stageIds.map(id => this.orgStages[id]).filter(stage => !!stage);
    }
 
    handleStageIdChange(stageId: number) {
        console.log("Report:", this.performance?.report.stageReports[this.selectedStageId]);
        if (!this.performance?.report?.stageReports) {
            return;
        }

        this.stageIds = Object.keys(this.performance?.report.stageReports).map(key => Number(key));
        if (this.stageIds.length == 0) {
            return;
        }
        this.selectedStageId = stageId;
        if (!this.performance?.report.stageReports[this.selectedStageId]) {
            return;
        }

        this.currentStageReport = this.performance?.report.stageReports[this.selectedStageId];
    }

    handleRefreshReport() {
        if (!this.factory?.id) {
            console.error("Factory ID not set");
            return;
        }
        this.performanceService.getFactoryPerformanceByFactoryId(this.factory.id, true).subscribe((performance) => {
            console.log("Performance data refreshed", performance);
            this.stageIds = Object.keys(performance.report.stageReports).map(key => Number(key));
            this.selectedStageId = this.stageIds.length > 0 ? this.stageIds[0] : 0;
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
