import { Component, Input } from '@angular/core';
import { StageService } from '../../../../../dashboard/goods/services/stage.service';

@Component({
  selector: 'app-select-stage',
  standalone: true,
  imports: [],
  templateUrl: './select-stage.component.html',
  styleUrl: './select-stage.component.css'
})
export class SelectStageComponent {
    @Input() productId: number | undefined = undefined;
    

    constructor(
        private stageService: StageService
    ) {}

    ngOnInit(): void {
        this.loadStages();
    }

    private loadStages(): void {
        if (!this.productId) {
            console.error("Error: Product ID is not valid.: ", this.productId);
            return;
        }
        
        this.stageService.getStagesByProductId(this.productId)
            .subscribe(stages => {
                if (stages?.length == 0) {
                    console.error("Error: Stages data is not valid.: ", stages);
                    return;
                }
            });
    }
}
