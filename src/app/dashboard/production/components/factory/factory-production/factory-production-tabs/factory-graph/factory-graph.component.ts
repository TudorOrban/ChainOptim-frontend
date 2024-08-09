import { Component, Input } from '@angular/core';
import { GraphRenderer } from './d3/rendering/GraphRenderer';

@Component({
    selector: 'app-factory-graph',
    standalone: true,
    imports: [],
    templateUrl: './factory-graph.component.html',
    styleUrl: './factory-graph.component.css',
})
export class FactoryGraphComponent {
    @Input() inputData: any;

    
    factoryGraphRenderer: GraphRenderer | null = null;

    ngOnInit(): void {}

    private initializeGraphRenderers(): void {
        this.factoryGraphRenderer = new GraphRenderer("viz");
    }
}
