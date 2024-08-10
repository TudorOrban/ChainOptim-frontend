import * as d3 from "d3";
import { InteractionManager } from "./InteractionManager";
import { NodeRenderer } from "./NodeRenderer";
import { EdgeRenderer } from "./EdgeRenderer";
import { GenericGraph } from "../types/dataTypes";
import { GraphUIConfig } from "../config/GraphUIConfig";
import { GraphPreprocessor } from "./GraphPreprocessor";
import { InfoRenderer } from "./InfoRenderer";
import { ResourceAllocationRenderer } from "./ResourceAllocationRenderer";

/*
 * Orchestrator of the typescript modules.
 *
 */
export class GraphRenderer {
    private graphPreprocessor: GraphPreprocessor;
    private nodeRenderer: NodeRenderer;
    private edgeRenderer: EdgeRenderer;
    private infoRenderer: InfoRenderer;
    private resourceAllocationRenderer: ResourceAllocationRenderer;
    private interactionManager: InteractionManager;
    private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;


    constructor(containerId: string) {
        const { width, height, backgroundColor } = GraphUIConfig.graph;
        this.svg = d3.select(containerId).append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", backgroundColor);
           
        this.graphPreprocessor = new GraphPreprocessor();
        this.nodeRenderer = new NodeRenderer(this.svg);
        this.edgeRenderer = new EdgeRenderer(this.svg);
        this.infoRenderer = new InfoRenderer(this.svg);
        this.resourceAllocationRenderer = new ResourceAllocationRenderer(this.svg);
        this.interactionManager = new InteractionManager(this.svg, this.nodeRenderer);

        // Bind functions to window for JavaFX access
        window.renderInfo = this.infoRenderer.renderInfo.bind(this.infoRenderer);
        window.renderResourceAllocations = this.resourceAllocationRenderer.renderResourceAllocations.bind(this.resourceAllocationRenderer);
    }

    /*
     * Entry point for the subproject. Called from JavaFX's WebView.
     */
    renderGraph(graphData: GenericGraph) {
        // Preprocess graph: assign position to nodes based on connections
        const genericGraphUI = this.graphPreprocessor.preprocessGraph(graphData);
        
        // Set up definitions for needed elements (arrows, shadows, etc.)
        this.setupSvgDefinitions();

        // Pass genericGraphUI to the needed renderers
        this.infoRenderer.setGenericGraph(genericGraphUI);
        this.resourceAllocationRenderer.setGenericGraph(genericGraphUI);

        // Draw all nodes
        Object.entries(genericGraphUI.nodes).forEach(([stageNodeId, node]) => {
            this.nodeRenderer.renderGraphNode(node, parseInt(stageNodeId, 10), node.coordinates?.x || 0, node.coordinates?.y || 0);
        });

        // Draw all edges
        Object.entries(genericGraphUI.nodes).forEach(([stageNodeId, node]) => {
            this.edgeRenderer.renderEdges(node, genericGraphUI.adjList, parseInt(stageNodeId, 10));
        });

        // Set up interactions and connect them to JavaFX via JavaConnector
        this.interactionManager = new InteractionManager(this.svg, this.nodeRenderer);    
        this.interactionManager.setupNodeInteractions((nodeId) => {
            window.javaConnector.handleNodeClick(nodeId);
        });
    }

    renderInfo(infoType: string, isVisible: boolean) {
        this.infoRenderer.renderInfo(infoType, isVisible);
    }

    setupSvgDefinitions() {
        // Define arrowhead marker
        this.svg.append("defs").append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "-0 -5 10 10")
            .attr("refX", 5)
            .attr("refY", 0)
            .attr("markerWidth", 5)
            .attr("markerHeight", 5)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#000");

        // Define drop shadow filter
        const defs = this.svg.append("defs");
        const filter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "130%");
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 3)
            .attr("result", "blur");
        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 1)
            .attr("dy", 1)
            .attr("result", "offsetBlur");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");
    }
    
    getSvg() {
        return this.svg;
    }

    clearGraph() {
        this.svg.selectAll("*").remove();
    }
}