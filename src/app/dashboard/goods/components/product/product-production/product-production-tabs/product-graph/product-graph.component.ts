import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductGraphService } from '../../../../../services/productgraph.service';
import { CreateConnectionDTO, ProductEdge, ProductProductionGraph } from '../../../../../models/ProductGraph';
import { Pair } from '../../../../../../overview/types/supplyChainMapTypes';
import { ProductStageConnectionService } from '../../../../../services/productstageconnection.service';
import { ToastService } from '../../../../../../../shared/common/components/toast-system/toast.service';
import { OperationOutcome } from '../../../../../../../shared/common/components/toast-system/toastTypes';
import { CommonModule } from '@angular/common';
import { FactoryEdge, NodeSelection, NodeType } from '../../../../../../production/models/FactoryGraph';
import { GraphRenderer } from '../../../../../../production/components/factory/factory-production/factory-production-tabs/factory-graph/d3/rendering/GraphRenderer';
import { ElementIdentifier } from '../../../../../../production/components/factory/factory-production/factory-production-tabs/factory-graph/d3/utils/ElementIdentifier';
import { GenericGraph } from '../../../../../../production/components/factory/factory-production/factory-production-tabs/factory-graph/d3/types/dataTypes';
import { transformProductToGenericGraph } from '../../../../../../production/components/factory/factory-production/factory-production-tabs/factory-graph/d3/utils/utils';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRotateRight, faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-product-graph',
    standalone: true,
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './product-graph.component.html',
    styleUrl: './product-graph.component.css',
})
export class ProductGraphComponent {
    @Input() inputData: { productId: number } | undefined = undefined;

    @Output() onNodeClicked = new EventEmitter<NodeSelection>();
    @Output() onEdgeClicked = new EventEmitter<ProductEdge>();

    productProductionGraph: ProductProductionGraph | undefined = undefined;

    isLoading: boolean = false;
    isAddConnectionModeOn: boolean = false;
    addConnectionClickedNodes: NodeSelection[] = [];
    readyForConnectionCreation: boolean = false;
    
    productGraphRenderer: GraphRenderer | null = null;
    elementIdentifier: ElementIdentifier = new ElementIdentifier();

    faArrowRotateRight = faArrowRotateRight;
    faSpinner = faSpinner;

    constructor(
        private productGraphService: ProductGraphService,
        private connectionService: ProductStageConnectionService,
        private toastService: ToastService,
    ) {}

    ngOnInit(): void {
        this.initializeGraphRenderers();
        
        this.loadGraphData();
        
        this.listenToClickEvents();
    }

    private initializeGraphRenderers(): void {
        this.productGraphRenderer = new GraphRenderer("#viz");
    }

    private loadGraphData(): void {
        this.isLoading = true;
        this.productGraphService.getProductProductionGraphByProductId(this.inputData?.productId as number)
            .subscribe(graphData => {
                this.isLoading = false;
                if (graphData?.length != 1) {
                    console.error("Error: Product graph data is not valid.: ", graphData);
                    return;
                }
                this.handleGraphDataResponse(graphData[0]);
            });
    }

    handleRefreshGraph(): void {
        this.isLoading = true;
        this.productGraphService.refreshProductProductionGraphByProductId(this.inputData?.productId as number)
            .subscribe(graphData => {
                this.isLoading = false;
                this.handleGraphDataResponse(graphData);
            });
    }

    private handleGraphDataResponse(graphData: ProductProductionGraph): void {
        if (!graphData) {
            console.error("Error: Product graph data is not valid.: ", graphData);
            return;
        }
        this.productProductionGraph = graphData;

        const genericGraph: GenericGraph = transformProductToGenericGraph(this.productProductionGraph.productGraph);

        this.productGraphRenderer?.renderGraph(genericGraph);
    }

    private listenToClickEvents(): void {
        if (!this.productGraphRenderer) {
            console.error("Error: Product graph renderer is not initialized.");
            return;
        }

        this.productGraphRenderer.getNodeClickEmitter().subscribe(nodeId => {
            this.handleNodeClicked(nodeId);
        });
        this.productGraphRenderer.getEdgeClickEmitter().subscribe(edgeId => {
            this.handleEdgeClicked(edgeId); 
        });
    }

    private handleNodeClicked(nodeId: string): void {
        const nodeSelection = this.determineNodeSelection(nodeId);
        this.onNodeClicked.emit(nodeSelection);

        this.handleAddConnectionMode(nodeSelection);
    }

    private handleEdgeClicked(edgeId: string): void {
        const factoryEdge: FactoryEdge = this.elementIdentifier.getEdgeFromOuterEdgeId(edgeId);
        const productEdge: ProductEdge = {
            srcStageId: factoryEdge.srcFactoryStageId,
            srcStageOutputId: factoryEdge.srcStageOutputId,
            destStageId: factoryEdge.destFactoryStageId,
            destStageInputId: factoryEdge.destStageInputId,
        };                
        console.log("Product edge clicked: ", productEdge);
        this.onEdgeClicked.emit(productEdge);
    }

    // Add connection mode
    private handleAddConnectionMode(nodeSelection: NodeSelection): void {
        const shouldAddClickedNode = this.shouldAddClickedNode(nodeSelection);
        if (!shouldAddClickedNode) {
            return;
        }

        this.addConnectionClickedNodes.push(nodeSelection);
        const areNodeSelectionsValid = this.areNodeSelectionsValid(this.addConnectionClickedNodes);
        if (!areNodeSelectionsValid) {
            return;
        }

        this.readyForConnectionCreation = true;
        this.productGraphRenderer?.renderNewEdge(this.addConnectionClickedNodes?.[0], this.addConnectionClickedNodes?.[1], true);
        
    }

    private shouldAddClickedNode(nodeSelection: NodeSelection): boolean {
        if (!this.isAddConnectionModeOn || !nodeSelection.nodeId || this.addConnectionClickedNodes.map(node => node.nodeId).includes(nodeSelection.nodeId)) {
            return false;
        }
        if (this.addConnectionClickedNodes.length >= 2) {
            return false;
        }
        if (this.addConnectionClickedNodes.length == 1 && nodeSelection.nodeType != NodeType.INPUT) {
            return false;
        }
        if (this.addConnectionClickedNodes.length == 0 && nodeSelection.nodeType != NodeType.OUTPUT) {
            return false;
        }
        return true;
    }

    private determineNodeSelection(nodeId: string): NodeSelection {
        let nodeSelection: NodeSelection = {};

        const isStageInputNode = nodeId.includes("si"); 
        const isStageOutputNode = nodeId.includes("so");

        if (isStageInputNode) {
            nodeSelection = this.elementIdentifier.getStageInputId(nodeId);
        } else if (isStageOutputNode) {
            nodeSelection = this.elementIdentifier.getStageOutputId(nodeId);
        } else {
            nodeSelection = this.elementIdentifier.getStageNodeId(nodeId);
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
    
    handleCreateConnection(): void {
        const connectionDTO: CreateConnectionDTO = {
            productId: this.inputData?.productId as number,
            srcStageId: this.addConnectionClickedNodes[0]?.nodeId ?? 0,
            srcStageOutputId: this.addConnectionClickedNodes[0]?.subNodeId ?? 0,
            destStageId: this.addConnectionClickedNodes[1]?.nodeId ?? 0,
            destStageInputId: this.addConnectionClickedNodes[1]?.subNodeId ?? 0
        };

        this.connectionService.createConnection(connectionDTO).subscribe(() => {
            this.toastService.addToast({ id: 0, title: "Success", message: "Connection created successfully.", outcome: OperationOutcome.SUCCESS });
            this.productGraphRenderer?.renderNewEdge(this.addConnectionClickedNodes[0], this.addConnectionClickedNodes[1], false);
            this.resetAddConnectionMode();
        });
    }
    
    resetAddConnectionMode(): void {
        this.isAddConnectionModeOn = false;
        this.addConnectionClickedNodes = [];
        this.productGraphRenderer?.removeTemporaryEdges();
        this.readyForConnectionCreation = false;
    }

    // Communication with Tabs Component
    // - CRUD ops
    toggleAddConnectionMode(): void {
        this.isAddConnectionModeOn = !this.isAddConnectionModeOn;
    }
    
    displayQuantities(display: boolean): void {
        this.productGraphRenderer?.renderInfo("quantities", display);
    }
}
