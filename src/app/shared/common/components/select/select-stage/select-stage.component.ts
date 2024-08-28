import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { StageService } from '../../../../../dashboard/goods/services/stage.service';
import { UserService } from '../../../../../core/user/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Stage } from "../../../../../dashboard/goods/models/Stage";

@Component({
  selector: 'app-select-stage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-stage.component.html',
  styleUrl: './select-stage.component.css'
})
export class SelectStageComponent implements OnChanges {    
    @Input() initialData?: { stage?: Stage, stageId?: number } | undefined = undefined;

    stages: Stage[] = [];
    selectedStageId: number | undefined = undefined;

    @Output() stageSelected = new EventEmitter<number>();

    constructor(
        private stageService: StageService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.loadStages();
    }

    ngOnChanges(changes: SimpleChanges): void {
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
        this.stageService.getStagesByOrganizationId(organizationId)
            .subscribe(stages => {
                if (stages?.length == 0) {
                    console.error("Error: Stages data is not valid.: ", stages);
                    return;
                }

                console.log("Stages: ", stages);
                this.stages = stages;

                if (this.initialData && this.initialData.stageId) {
                    this.selectStage(this.initialData.stageId);
                }
            });
    }

    selectStage(stageId: number | undefined): void {
        console.log("Selected stage: ", stageId);
        this.selectedStageId = stageId;
        this.stageSelected.emit(stageId);
    }
}
