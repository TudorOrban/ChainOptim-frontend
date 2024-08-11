import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { StageService } from '../../../../../dashboard/goods/services/stage.service';
import { UserService } from '../../../../../core/auth/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Stage } from '../../../../../dashboard/goods/models/Product';

@Component({
  selector: 'app-select-stage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-stage.component.html',
  styleUrl: './select-stage.component.css'
})
export class SelectStageComponent implements OnChanges {    
    @Input() initialData?: Stage | undefined = undefined;

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
            this.selectStage(this.initialData.id);
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

                if (this.initialData) {
                    this.selectStage(this.initialData.id);
                }
            });
    }

    selectStage(stageId: number | undefined): void {
        console.log("Selected stage: ", stageId);
        this.selectedStageId = stageId;
        this.stageSelected.emit(stageId);
    }
}
