import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { UserService } from '../../../../../core/user/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactoryStage, FactoryStageSearchDTO } from '../../../../../dashboard/production/models/Factory';
import { FactoryStageService } from '../../../../../dashboard/production/services/factorystage.service';

@Component({
  selector: 'app-select-factory-stage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-factory-stage.component.html',
  styleUrl: './select-factory-stage.component.css'
})
export class SelectFactoryStageComponent implements OnChanges {    
    @Input() initialData?: { stage?: FactoryStage, stageId?: number, initialStages?: FactoryStageSearchDTO[], preventStageLoading?: boolean } | undefined = undefined;

    stages: FactoryStageSearchDTO[] = [];
    selectedStageId: number | undefined = undefined;

    @Output() stageSelected = new EventEmitter<number>();

    constructor(
        private stageService: FactoryStageService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.handleInitialData(undefined);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.handleInitialData(changes);
    }
    
    private handleInitialData(changes?: SimpleChanges): void {
        if (this.initialData?.preventStageLoading) {
            this.stages = this.initialData?.initialStages ?? [];
            this.selectedStageId = this.initialData?.stageId;
        } else {
            this.loadStages();
            this.handleInputData(changes);
        }
    }
    
    private handleInputData(changes?: SimpleChanges): void {
        if (!changes) return;
        if (changes['initialData'] && this.initialData && this.stages.length > 0) {
            if (this.initialData?.stage) {
                this.selectStage(this.initialData.stage.id);
            } else if (this.initialData?.stageId) {
                this.selectStage(this.initialData.stageId);
            }
        }
    }
    
    private loadStages(): void {
        this.userService.getCurrentUser().subscribe({
            next: (user) => {
                if (!user?.organization) {
                    return;
                }
                this.loadStagesByOrganizationId(user.organization?.id ?? 0);
            },
            error: (error: Error) => {
                console.error('Error loading current user', error);
            }
        });
    }

    private loadStagesByOrganizationId(organizationId: number): void {
        this.stageService.getFactoryStagesByOrganizationId(organizationId)
            .subscribe(stages => {
                if (stages?.length == 0) {
                    console.error("Error: Stages data is not valid.: ", stages);
                    return;
                }

                console.log("Stages: ", stages);
                this.stages = stages;

                if (this.initialData && this.initialData.stage) {
                    this.selectStage(this.initialData.stage.id);
                }
            });
    }

    selectStage(stageId: number | undefined): void {
        console.log("Selected stage: ", stageId);
        this.selectedStageId = stageId;
        this.stageSelected.emit(stageId);
    }
}
