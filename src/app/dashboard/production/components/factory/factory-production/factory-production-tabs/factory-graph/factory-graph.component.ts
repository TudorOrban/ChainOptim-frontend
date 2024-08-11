import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GraphRenderer } from './d3/rendering/GraphRenderer';
import { FactoryGraphService } from '../../../../../services/factorygraph.service';
import { GenericGraph } from './d3/types/dataTypes';
import { transformFactoryToGenericGraph } from './d3/utils/utils';
import { AllocationPlan } from '../../../../../models/ResourceAllocation';
import { FactoryEdge, FactoryProductionGraph, NodeSelection } from '../../../../../models/FactoryGraph';
import { Pair } from '../../../../../../overview/types/supplyChainMapTypes';
import { ElementIdentifier } from './d3/utils/ElementIdentifier';
import { FactoryStageConnectionService } from '../../../../../services/factorystageconnection.service';
import { CreateConnectionDTO } from '../../../../../models/Factory';
import { ToastService } from '../../../../../../../shared/common/components/toast-system/toast.service';
import { OperationOutcome } from '../../../../../../../shared/common/components/toast-system/toastTypes';

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

    isAddConnectionModeOn: boolean = false;
    addConnectionClickedNodes: NodeSelection[] = [];
    
    factoryGraphRenderer: GraphRenderer | null = null;
    elementIdentifier: ElementIdentifier = new ElementIdentifier();

    @Output() onNodeClicked = new EventEmitter<NodeSelection>();
    @Output() onEdgeClicked = new EventEmitter<FactoryEdge>();

    constructor(
        private factoryGraphService: FactoryGraphService,
        private connectionService: FactoryStageConnectionService,
        private toastService: ToastService,
    ) {}

    ngOnInit(): void {
        this.initializeGraphRenderers();
        
        this.loadGraphData();
        
        this.listenToClickEvents();
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

    private listenToClickEvents(): void {
        if (!this.factoryGraphRenderer) {
            console.error("Error: Factory graph renderer is not initialized.");
            return;
        }

        this.factoryGraphRenderer.getNodeClickEmitter().subscribe(nodeId => {
            this.handleNodeClicked(nodeId);
        });
        this.factoryGraphRenderer.getEdgeClickEmitter().subscribe(edgeId => {
            const edge: FactoryEdge = this.elementIdentifier.getEdgeFromOuterEdgeId(edgeId);

            console.log("Edge clicked: ", edge);
            this.onEdgeClicked.emit(edge);
        });
    }

    private handleNodeClicked(nodeId: string): void {
        const nodeSelection = this.determineNodeSelection(nodeId);
        this.onNodeClicked.emit(nodeSelection);

        this.handleAddConnectionMode(nodeSelection);
    }

    private handleAddConnectionMode(nodeSelection: NodeSelection): void {
        if (!this.isAddConnectionModeOn) {
            return;
        }
        this.addConnectionClickedNodes.push(nodeSelection);
        console.log("Add connection clicked nodes: ", this.addConnectionClickedNodes);
        const areNodeSelectionsValid = this.areNodeSelectionsValid(this.addConnectionClickedNodes);
        if (!areNodeSelectionsValid) {
            return;
        }

        const connectionDTO: CreateConnectionDTO = {
            factoryId: this.inputData?.factoryId as number,
            outgoingFactoryStageId: this.addConnectionClickedNodes[0]?.nodeId || 0,
            outgoingStageInputId: this.addConnectionClickedNodes[0]?.subNodeId || 0,
            incomingFactoryStageId: this.addConnectionClickedNodes[1]?.nodeId || 0,
            incomingStageOutputId: this.addConnectionClickedNodes[1]?.subNodeId || 0
        };
        console.log("Create connection: ", connectionDTO);

        this.connectionService.createConnection(connectionDTO).subscribe(() => {
            console.log("Connection created.");
            this.toastService.addToast({ id: 0, title: "Success", message: "Connection created successfully.", outcome: OperationOutcome.SUCCESS });
            this.resetAddConnectionMode();
        });
    }

    private determineNodeSelection(nodeId: string): NodeSelection {
        let nodeSelection: NodeSelection = {};

        const isStageInputNode = nodeId.includes("si"); 
        const isStageOutputNode = nodeId.includes("so");

        if (isStageInputNode) {
            nodeSelection = this.elementIdentifier.getStageInputId(nodeId);
            console.log("Stage input clicked in factory graph: ", nodeSelection);
        } else if (isStageOutputNode) {
            nodeSelection = this.elementIdentifier.getStageOutputId(nodeId);
            console.log("Stage output clicked in factory graph: ", nodeSelection);
        } else {
            nodeSelection = this.elementIdentifier.getStageNodeId(nodeId);
            console.log("Node clicked in factory graph: ", nodeId);
        }

        return nodeSelection;
    }
    
    private areNodeSelectionsValid(nodeSelections: NodeSelection[]): boolean {
        if (nodeSelections.length != 2) {
            return false;
        }
        if (!nodeSelections[0]?.nodeId || !nodeSelections[0]?.subNodeId || !nodeSelections[1]?.nodeId || !nodeSelections[1]?.subNodeId) {
            return false;
        }
        return true;
    }

    private resetAddConnectionMode(): void {
        this.isAddConnectionModeOn = false;
        this.addConnectionClickedNodes = [];
    }

    // Communication with Tabs Component
    // - CRUD ops
    toggleAddConnectionMode(): void {
        console.log("Toggle add connection mode in factory graph.");
        this.isAddConnectionModeOn = !this.isAddConnectionModeOn;
    }

    // - Display info
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
