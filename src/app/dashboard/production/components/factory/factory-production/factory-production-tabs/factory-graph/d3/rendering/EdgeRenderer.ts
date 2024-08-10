import * as d3 from "d3";
import { Coordinates, GenericEdgeUI, GenericNodeUI } from "../types/uiTypes";
import { calculateEdgePoints } from "../utils/geometryUtils";
import { GraphUIConfig } from "../config/GraphUIConfig";
import { ElementIdentifier } from "../utils/ElementIdentifier";

export class EdgeRenderer {
    private elementIdentifier: ElementIdentifier;

    constructor(private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>) {
        this.elementIdentifier = new ElementIdentifier();
    }
    
    renderEdges = (
        nodeUI: GenericNodeUI,
        adjListUI: Record<number, GenericEdgeUI[]>,
        stageNodeId: number,
    ) => {
        const { node: { subnodeRadius }, edge: { color, width, markerEnd } } = GraphUIConfig;

        const neighbors = adjListUI[stageNodeId];
        if (!neighbors) {
            return;
        }

        neighbors.forEach((neighbor) => {
            // Find incoming stage output and outgoing stage input
            const sourceElement = d3.select(
                `#${this.elementIdentifier.encodeStageOutputId(neighbor.edge.incomingStageId, neighbor.edge.incomingStageOutputId)}`
            );
            const targetElement = d3.select(
                `#${this.elementIdentifier.encodeStageInputId(neighbor.edge.outgoingStageId, neighbor.edge.outgoingStageInputId)}`
            );

            if (sourceElement.empty() || targetElement.empty()) {
                return;
            }

            const { start, end } = calculateEdgePoints(
                { x: parseFloat(sourceElement.attr("cx")), y: parseFloat(sourceElement.attr("cy")) },
                { x: parseFloat(targetElement.attr("cx")), y: parseFloat(targetElement.attr("cy")) },
                subnodeRadius,
                subnodeRadius
            );
             
            const line = this.svg.append("line")
                .attr("id", this.elementIdentifier.encodeOuterEdgeId(neighbor.edge.incomingStageId, neighbor.edge.outgoingStageId, neighbor.edge.incomingStageOutputId, neighbor.edge.outgoingStageInputId))
                .attr("x1", start.x)
                .attr("y1", start.y)
                .attr("x2", end.x)
                .attr("y2", end.y)
                .attr("stroke", color)
                .attr("stroke-width", width)
                .attr("marker-end", markerEnd);

            this.addHoverEffect(line, width, start, end);
        });
    };
    
    private addHoverEffect(line: d3.Selection<SVGLineElement, unknown, HTMLElement, any>, width: number, start: Coordinates, end: Coordinates) {
        const interactionLine = this.svg.append("line")
        .attr("x1", start.x)
        .attr("y1", start.y)
        .attr("x2", end.x)
        .attr("y2", end.y)
        .attr("stroke", "transparent")
        .attr("stroke-width", width * 4) 
        .style("pointer-events", "all");

        // Apply the hover effect to the visible line when the invisible line is hovered
        interactionLine
        .on("mouseover", function () {
            line.transition().duration(100).attr("stroke-width", width * 2);
        })
        .on("mouseout", function () {
            line.transition().duration(100).attr("stroke-width", width);
        })
    }

    public highlightEdge = (edge: d3.Selection<SVGLineElement, unknown, null, undefined>) => {
        const { highlightDuration, highlightColor, highlightWidth } = GraphUIConfig.edge;
        
        edge
            .transition()
            .duration(highlightDuration)
            .style("stroke", highlightColor)
            .style("stroke-width", highlightWidth);
    };

    
    public unhighlightAllEdges = () => {
        const { highlightDuration, color, width } = GraphUIConfig.edge;
        
        this.svg.selectAll("line")
            .transition()
            .duration(highlightDuration)
            .style("stroke", color)
            .style("stroke-width", width)
            .attr("filter", null);
    };
    
}