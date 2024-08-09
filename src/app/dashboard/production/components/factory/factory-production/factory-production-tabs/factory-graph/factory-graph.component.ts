import { Component, Input } from '@angular/core';
import { GraphRenderer } from './d3/rendering/GraphRenderer';
import { FactoryGraphService } from '../../../../../services/factorygraph.service';
import { FactoryProductionGraph, GenericGraph } from './d3/types/dataTypes';
import { transformFactoryToGenericGraph } from './d3/utils/utils';

@Component({
    selector: 'app-factory-graph',
    standalone: true,
    imports: [],
    templateUrl: './factory-graph.component.html',
    styleUrl: './factory-graph.component.css',
})
export class FactoryGraphComponent {
    @Input() inputData: { factoryId: number } | undefined = undefined;
    
    factoryProductionGraph: FactoryProductionGraph | undefined = undefined;

    factoryGraphRenderer: GraphRenderer | null = null;

    constructor(
        private factoryGraphService: FactoryGraphService,
    ) {}

    ngOnInit(): void {
        this.initializeGraphRenderers();
        
        this.loadGraphData();
        
    }

    private initializeGraphRenderers(): void {
        this.factoryGraphRenderer = new GraphRenderer("#viz");
    }

    private loadGraphData(): void {
        this.factoryGraphService.getFactoryProductionGraphByFactoryId(this.inputData?.factoryId as number)
            .subscribe(graphData => {
                if (graphData?.length == 0) {
                    console.error("Error: Factory graph data is not valid.: ", graphData);
                    return;
                }
                this.factoryProductionGraph = graphData[0];

                const genericGraph: GenericGraph = transformFactoryToGenericGraph(this.factoryProductionGraph.factoryGraph);
    
                this.factoryGraphRenderer?.renderGraph(genericGraph);
            });
    }
}
