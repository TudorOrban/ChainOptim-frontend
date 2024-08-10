import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GraphRenderer } from './d3/rendering/GraphRenderer';
import { FactoryGraphService } from '../../../../../services/factorygraph.service';
import { GenericGraph } from './d3/types/dataTypes';
import { transformFactoryToGenericGraph } from './d3/utils/utils';
import { AllocationPlan } from '../../../../../models/ResourceAllocation';
import { FactoryEdge, FactoryProductionGraph } from '../../../../../models/FactoryGraph';
import { Pair } from '../../../../../../overview/types/supplyChainMapTypes';
import { ElementIdentifier } from './d3/utils/ElementIdentifier';

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
    elementIdentifier: ElementIdentifier = new ElementIdentifier();

    @Output() onFactoryGraphClicked = new EventEmitter<Pair<string, number>>();

    constructor(
        private factoryGraphService: FactoryGraphService,
    ) {}

    ngOnInit(): void {
        this.initializeGraphRenderers();
        
        this.loadGraphData();
        
        if (this.factoryGraphRenderer) {
            this.factoryGraphRenderer.getNodeClickEmitter().subscribe(nodeId => {
                const splitNodeId = nodeId.split("_");
                if (splitNodeId.length != 2) {
                    console.error("Error: Node id is not valid: ", nodeId);
                    return;
                }
                console.log("Node clicked: ", splitNodeId);
                this.onFactoryGraphClicked.emit({ first: splitNodeId[0], second: Number(splitNodeId[1]) });
            });
            this.factoryGraphRenderer.getEdgeClickEmitter().subscribe(edgeId => {
                const edge: FactoryEdge = this.elementIdentifier.getEdgeFromOuterEdgeId(edgeId);

                console.log("Edge clicked: ", edge);
            });
        }
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

    // Communication with Tabs Component
    displayQuantities(display: boolean): void {
        console.log("Display quantities in factory graph: ", display);

        this.factoryGraphRenderer?.renderInfo("quantities", display);
    }

    displayCapacities(display: boolean): void {
        console.log("Display capacities in factory graph: ", display);

        this.factoryGraphRenderer?.renderInfo("capacities", display);
    }

    displayPriorities(display: boolean): void {
        console.log("Display priorities in factory graph: ", display);

        this.factoryGraphRenderer?.renderInfo("priorities", display);
    }

    displayAllocations(allocationPlan: AllocationPlan): void {
        console.log("Display allocations in factory graph: ", allocationPlan);

        this.factoryGraphRenderer?.renderResourceAllocations(allocationPlan);
    }
}
