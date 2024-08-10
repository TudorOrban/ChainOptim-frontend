import { Component, Input } from '@angular/core';
import { ProductionHistoryService } from '../../../../../services/productionhistory.service';

@Component({
  selector: 'app-production-history',
  standalone: true,
  imports: [],
  templateUrl: './production-history.component.html',
  styleUrl: './production-history.component.css'
})
export class ProductionHistoryComponent {
    @Input() inputData: { factoryId: number } | undefined = undefined;

    constructor(
        private productionHistoryService: ProductionHistoryService,
    ) {}

    ngOnInit(): void {
        this.loadProductionHistory();
    }

    private loadProductionHistory(): void {
        if (!this.inputData?.factoryId) {
            console.error("Error: Factory ID is not valid: ", this.inputData);
            return;
        }

        this.productionHistoryService.getFactoryProductionHistoryByFactoryId(this.inputData.factoryId)
            .subscribe(factoryProductionHistory => {
                console.log("Production History: ", factoryProductionHistory);
            });
    }
}
