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
             
            const edgeId = this.elementIdentifier.encodeOuterEdgeId(neighbor.edge.incomingStageId, neighbor.edge.outgoingStageId, neighbor.edge.incomingStageOutputId, neighbor.edge.outgoingStageInputId);
            const line = this.svg.append("line")
                .attr("id", edgeId)
                .attr("x1", start.x)
                .attr("y1", start.y)
                .attr("x2", end.x)
                .attr("y2", end.y)
                .attr("stroke", color)
                .attr("stroke-width", width)
                .attr("marker-end", markerEnd);

            this.addHoverEffect(line, width, edgeId);
        });
    };
    
        
    private addHoverEffect(line: d3.Selection<SVGLineElement, unknown, HTMLElement, any>, width: number, edgeId: string) {
        const interactionLine = this.svg.append("line")
            .attr("id", `${edgeId}`)
            .attr("x1", line.attr("x1"))
            .attr("y1", line.attr("y1"))
            .attr("x2", line.attr("x2"))
            .attr("y2", line.attr("y2"))
            .attr("stroke", "transparent")
            .attr("stroke-width", 4)
            .style("pointer-events", "all");

        interactionLine
            .on("mouseover", () => {
                if (!line.classed("clicked")) {
                    line.transition().duration(100).attr("stroke-width", width * 2);
                }
            })
            .on("mouseout", () => {
                if (!line.classed("clicked")) {
                    line.transition().duration(100).attr("stroke-width", width);
                }
            });
    }

    public highlightEdge = (edge: d3.Selection<SVGLineElement, unknown, null, undefined>) => {
        const { highlightDuration, highlightColor, highlightWidth } = GraphUIConfig.edge;

        // Ensure all other edges are reset
        this.unhighlightAllEdges(); 

        edge
            .classed("clicked", true)
            .transition()
            .duration(highlightDuration)
            .style("stroke", highlightColor)
            .style("stroke-width", highlightWidth);
    };

    public unhighlightAllEdges = () => {
        const { highlightDuration, color, width } = GraphUIConfig.edge;

        this.svg.selectAll("line")
            .classed("clicked", false)
            .transition()
            .duration(highlightDuration)
            .style("stroke", color)
            .style("stroke-width", width);
    };

    
}